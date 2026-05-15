import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { BlockNoteSchema, defaultBlockSpecs, type PartialBlock } from "@blocknote/core";
import { useEffect, useMemo } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { supabase } from "@/integrations/supabase/client";
import { Callout, Toggle, Pdf, Audio, Drawing, Bookmark } from "./customBlocks";

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    callout: Callout,
    toggle: Toggle,
    pdf: Pdf,
    audio: Audio,
    drawing: Drawing,
    bookmark: Bookmark,
  } as never,
});

interface Props {
  pageId: string;
  initialContent: PartialBlock[] | undefined;
  editable: boolean;
  onChange: (blocks: PartialBlock[]) => void;
  onTyping?: () => void;
  onReady?: (editor: ReturnType<typeof useCreateBlockNote>) => void;
}

export function BlockEditor({ pageId, initialContent, editable, onChange, onTyping, onReady }: Props) {
  const theme = useUIStore((s) => s.theme);
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);

  const initial = useMemo<PartialBlock[]>(
    () =>
      Array.isArray(initialContent) && initialContent.length > 0
        ? (initialContent as PartialBlock[])
        : [{ type: "paragraph", content: [] }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageId]
  );

  const editor = useCreateBlockNote({
    schema,
    initialContent: initial as never,
    uploadFile: async (file: File) => {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${pageId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("attachments")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from("attachments").getPublicUrl(path);
      return data.publicUrl;
    },
  });

  // Expose pageId on the editor instance for custom block renderers
  useEffect(() => {
    (editor as unknown as { _pageId?: string })._pageId = pageId;
  }, [editor, pageId]);

  useEffect(() => {
    onReady?.(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div className="relative w-full min-h-full">
      <BlockNoteView
        editor={editor}
        editable={editable}
        sideMenu={false}
        theme={isDark ? "dark" : "light"}
        className="min-h-[calc(100vh-200px)]"
        onChange={() => {
          onChange(editor.document as PartialBlock[]);
          onTyping?.();
        }}
      />
    </div>
  );
}
