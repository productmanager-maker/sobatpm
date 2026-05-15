import { Suspense, lazy, useEffect, useRef, useState } from "react";
import "@excalidraw/excalidraw/index.css";
import { Pencil, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadPath, refreshSignedUrl } from "@/lib/upload";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Excalidraw = lazy(() =>
  import("@excalidraw/excalidraw").then((m) => ({ default: m.Excalidraw }))
);

interface Props {
  storageKey: string;
  previewUrl: string;
  pageId: string;
  onChange: (props: { storageKey: string; previewUrl: string }) => void;
  editable: boolean;
}

const SAVE_DEBOUNCE = 2000;

export function DrawingBlockRenderer({ storageKey, previewUrl, pageId, onChange, editable }: Props) {
  const { activeWorkspace } = useWorkspaceStore();
  const [editing, setEditing] = useState(false);
  const [initialData, setInitialData] = useState<unknown | null>(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState<unknown | null>(null);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!editing || !storageKey) {
      setInitialData(null);
      return;
    }
    (async () => {
      const { data } = await supabase.storage.from("workspace-assets").download(storageKey);
      if (!data) return;
      try {
        const text = await data.text();
        setInitialData(JSON.parse(text));
      } catch {
        setInitialData(null);
      }
    })();
  }, [editing, storageKey]);

  const handleChange = () => {
    if (!editable || !activeWorkspace || !excalidrawAPI) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        const api = excalidrawAPI as {
          getSceneElements: () => unknown[];
          getAppState: () => unknown;
          getFiles: () => unknown;
        };
        const elements = api.getSceneElements();
        const appState = api.getAppState();
        const files = api.getFiles();
        const json = JSON.stringify({ elements, appState, files });
        const jsonKey = storageKey || `${activeWorkspace.id}/${pageId}/drawing-${crypto.randomUUID()}.json`;
        await uploadPath(
          "workspace-assets",
          jsonKey,
          new Blob([json], { type: "application/json" }),
          "application/json"
        );

        // Export PNG preview
        const { exportToBlob } = await import("@excalidraw/excalidraw");
        const blob = await exportToBlob({
          elements: elements as never,
          appState: { ...(appState as object), exportWithDarkMode: false } as never,
          files: files as never,
          mimeType: "image/png",
        });
        const pngKey = jsonKey.replace(/\.json$/, ".png");
        const { url } = await uploadPath("workspace-assets", pngKey, blob, "image/png");
        onChange({ storageKey: jsonKey, previewUrl: url });
      } catch (e) {
        console.error(e);
      }
    }, SAVE_DEBOUNCE);
  };

  // Refresh signed URL if it expired (best-effort)
  useEffect(() => {
    if (!previewUrl || !storageKey) return;
    const img = new Image();
    img.src = previewUrl;
    img.onerror = async () => {
      const pngKey = storageKey.replace(/\.json$/, ".png");
      const fresh = await refreshSignedUrl("workspace-assets", pngKey);
      if (fresh && fresh !== previewUrl) onChange({ storageKey, previewUrl: fresh });
    };
  }, [previewUrl, storageKey, onChange]);

  if (!editing) {
    return (
      <div
        className="group my-2 cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary"
        onClick={() => editable && setEditing(true)}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Drawing" className="max-h-[400px] w-full object-contain bg-muted/20" />
        ) : (
          <div className="flex h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
            Click to start drawing
          </div>
        )}
        {editable && (
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-1.5 text-xs">
            <span className="text-muted-foreground">Drawing</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              <Pencil className="mr-1 h-3 w-3" /> Edit
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-2 overflow-hidden rounded-lg border border-border" style={{ height: 500 }}>
      <Suspense fallback={<div className="p-8 text-sm">Loading whiteboard…</div>}>
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={(initialData as never) ?? undefined}
          onChange={handleChange}
        />
      </Suspense>
      <div className="flex justify-end border-t border-border bg-background p-1.5">
        <Button size="sm" onClick={() => setEditing(false)}>
          Done
        </Button>
      </div>
    </div>
  );
}
