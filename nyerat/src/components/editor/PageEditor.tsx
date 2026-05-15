import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { usePageStore } from "@/stores/usePageStore";
import { useUIStore } from "@/stores/useUIStore";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EmojiPicker } from "@/components/editor/EmojiPicker";
import { PresenceAvatars } from "@/components/editor/PresenceAvatars";
import { PageTopBar } from "@/components/editor/PageTopBar";
import { RightPanel } from "@/components/editor/RightPanel";
import { DatabaseView } from "@/components/database/DatabaseView";
import { RowPropertiesPanel } from "@/components/database/RowPropertiesPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ImagePlus, Smile, X } from "lucide-react";
import { uploadToBucket, pickPresenceColor } from "@/lib/upload";
import { toast } from "sonner";
import type { Page } from "@/lib/types";
import { BlockNoteEditor, type PartialBlock } from "@blocknote/core";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { isDriveConnected, syncPageToDrive } from "@/lib/gdrive";
import { SpreadsheetBlock } from "@/components/editor/SpreadsheetBlock";

interface Spreadsheet { id: string; data: string[][]; }
const emptySheet = (): Spreadsheet => ({
  id: `ss_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  data: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => "")),
});

type EditorInstance = {
  insertBlocks: (blocks: PartialBlock[], reference: unknown, placement: "after" | "before") => void;
  getTextCursorPosition: () => { block: unknown };
  document: PartialBlock[];
  blocksToMarkdownLossy: (blocks?: PartialBlock[]) => Promise<string>;
};

interface Collaborator {
  userId: string;
  name: string;
  color: string;
  typing?: boolean;
}

const TYPING_DEBOUNCE = 2000;
const SAVE_DEBOUNCE = 800;
const TITLE_DEBOUNCE = 500;
const VERSION_INTERVAL_MS = 5 * 60 * 1000;

export default function PageEditor() {
  const { pageId, workspaceSlug } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { pages, upsertPage, setActivePage, pushRecent } = usePageStore();
  const { rightPanelOpen } = useUIStore();
  const page = pageId ? pages[pageId] : undefined;

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [initial, setInitial] = useState<PartialBlock[] | undefined>(undefined);
  const [latestUpdatedAt, setLatestUpdatedAt] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [embeds, setEmbeds] = useState<string[]>([]);
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const [driveSyncing, setDriveSyncing] = useState(false);
  const [layout, setLayout] = useState<"default" | "wide" | "full">(() => {
    if (!pageId) return "default";
    const v = localStorage.getItem(`page_layout_${pageId}`);
    return v === "wide" || v === "full" ? v : "default";
  });

  const embedsRef = useRef<string[]>([]);
  const spreadsheetsRef = useRef<Spreadsheet[]>([]);

  const saveTimer = useRef<number | null>(null);
  const titleTimer = useRef<number | null>(null);
  const typingTimer = useRef<number | null>(null);
  const lastVersionAt = useRef<number>(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const blocksRef = useRef<PartialBlock[]>([]);
  const editorRef = useRef<EditorInstance | null>(null);
  const presenceColor = useRef<string>(pickPresenceColor());

  const insertAIText = useCallback((text: string) => {
    const ed = editorRef.current;
    if (!ed) return;
    const blocks: PartialBlock[] = text
      .split(/\n{2,}/)
      .filter((p) => p.trim().length > 0)
      .map((p) => ({ type: "paragraph", content: p.trim() }));
    if (blocks.length === 0) return;
    ed.insertBlocks(blocks, ed.getTextCursorPosition().block, "after");
  }, []);

  const getMarkdown = useCallback(async (): Promise<string> => {
    const blocks = blocksRef.current.length > 0 ? blocksRef.current : (initial ?? []);
    if (editorRef.current) {
      return editorRef.current.blocksToMarkdownLossy(blocks);
    }
    const tmp = BlockNoteEditor.create({
      initialContent: blocks.length ? blocks : [{ type: "paragraph" as const }],
    });
    return tmp.blocksToMarkdownLossy(blocks as never);
  }, [initial]);

  // Auto-redirect to first page if no pageId
  useEffect(() => {
    if (pageId || !activeWorkspace) return;
    const first = Object.values(pages).find((p) => !p.parent_id && p.workspace_id === activeWorkspace.id);
    if (first) navigate(`/app/${workspaceSlug}/${first.id}`, { replace: true });
  }, [pageId, activeWorkspace, pages, workspaceSlug, navigate]);

  // Load page (fresh from DB to get full content)
  useEffect(() => {
    if (!pageId) return;
    setInitial(undefined);
    (async () => {
      const { data } = await supabase.from("pages").select("*").eq("id", pageId).maybeSingle();
      if (!data) return;
      const p = data as Page;
      upsertPage(p);
      setActivePage(p.id);
      pushRecent(p.id);
      setTitle(p.title);
      setIcon(p.icon);
      setCover(p.cover_url);
      setLatestUpdatedAt(p.updated_at);
      const contentObj = (p.content as { blocks?: PartialBlock[]; embeds?: string[]; embeddedSheets?: string[]; spreadsheets?: Spreadsheet[] } | null);
      const content = contentObj?.blocks;
      setInitial(content && Array.isArray(content) && content.length > 0 ? content : [{ type: "paragraph", content: [] }]);
      const sheets = Array.isArray(contentObj?.embeds)
        ? contentObj!.embeds!
        : Array.isArray(contentObj?.embeddedSheets) ? contentObj!.embeddedSheets! : [];
      setEmbeds(sheets);
      embedsRef.current = sheets;
      const ssList = Array.isArray(contentObj?.spreadsheets) ? contentObj!.spreadsheets! : [];
      setSpreadsheets(ssList);
      spreadsheetsRef.current = ssList;
      lastVersionAt.current = new Date(p.updated_at).getTime();
    })();
  }, [pageId]); // eslint-disable-line

  // Realtime presence + page changes
  useEffect(() => {
    if (!pageId || !user) return;
    const ch = supabase.channel(`page:${pageId}`, {
      config: { presence: { key: user.id } },
    });
    channelRef.current = ch;

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState<Collaborator>();
      const list: Collaborator[] = [];
      for (const arr of Object.values(state)) for (const m of arr) list.push(m);
      setCollaborators(list);
    });

    ch.on("broadcast", { event: "typing" }, (payload) => {
      const userId = (payload.payload as { userId: string }).userId;
      setCollaborators((cs) => cs.map((c) => (c.userId === userId ? { ...c, typing: true } : c)));
      window.setTimeout(
        () =>
          setCollaborators((cs) => cs.map((c) => (c.userId === userId ? { ...c, typing: false } : c))),
        TYPING_DEBOUNCE + 500
      );
    });

    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "pages", filter: `id=eq.${pageId}` },
      (payload) => {
        const next = payload.new as Page;
        if (next.updated_by && next.updated_by !== user.id) {
          if (latestUpdatedAt && new Date(next.updated_at) > new Date(latestUpdatedAt)) {
            toast.warning(`This page was updated by someone else. Refresh to see the latest.`);
          }
        }
      }
    );

    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({
          userId: user.id,
          name: profile?.full_name ?? profile?.email ?? "User",
          color: presenceColor.current,
          typing: false,
        });
      }
    });

    return () => {
      void ch.untrack();
      void supabase.removeChannel(ch);
      channelRef.current = null;
    };
  }, [pageId, user?.id]); // eslint-disable-line

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (titleTimer.current) clearTimeout(titleTimer.current);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  const broadcastTyping = useCallback(() => {
    if (!channelRef.current || !user) return;
    if (typingTimer.current) return;
    void channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: user.id },
    });
    typingTimer.current = window.setTimeout(() => {
      typingTimer.current = null;
    }, TYPING_DEBOUNCE);
  }, [user]);

  const persistContent = useCallback(
    async (blocks: PartialBlock[], sheets?: string[], ssOverride?: Spreadsheet[]) => {
      if (!page || !user) return;
      setSaveState("saving");
      const sheetsToSave = sheets ?? embedsRef.current;
      const ssToSave = ssOverride ?? spreadsheetsRef.current;
      const { data, error } = await supabase
        .from("pages")
        .update({ content: { blocks, embeds: sheetsToSave, spreadsheets: ssToSave } as never, updated_by: user.id })
        .eq("id", page.id)
        .select()
        .single();
      if (error) {
        setSaveState("idle");
        return;
      }
      const updated = data as Page;
      upsertPage(updated);
      setLatestUpdatedAt(updated.updated_at);
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 1500);

      // Snapshot version every 5 minutes
      const now = Date.now();
      if (now - lastVersionAt.current > VERSION_INTERVAL_MS) {
        lastVersionAt.current = now;
        await supabase.from("page_versions").insert({
          page_id: page.id,
          content: { blocks, embeds: sheetsToSave, spreadsheets: ssToSave } as never,
          title: updated.title,
          created_by: user.id,
        });
      }

      if (isDriveConnected()) {
        setDriveSyncing(true);
        try {
          let md: string;
          if (editorRef.current) {
            md = await editorRef.current.blocksToMarkdownLossy(blocks);
          } else {
            const tmp = BlockNoteEditor.create({
              initialContent: blocks.length ? blocks : [{ type: "paragraph" as const }],
            });
            md = await tmp.blocksToMarkdownLossy(blocks as never);
          }
          await syncPageToDrive(page.id, updated.title || "Untitled", md);
        } catch (e) {
          console.warn("Drive sync failed:", e);
        } finally {
          setDriveSyncing(false);
        }
      }
    },
    [page, user, upsertPage]
  );

  const handleEditorChange = (blocks: PartialBlock[]) => {
    blocksRef.current = blocks;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => persistContent(blocks), SAVE_DEBOUNCE);
  };

  const queueSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(
      () => persistContent(blocksRef.current.length > 0 ? blocksRef.current : (initial ?? [])),
      SAVE_DEBOUNCE
    );
  };

  const handleEmbed = (url: string) => {
    if (embedsRef.current.includes(url)) {
      toast.info("That URL is already embedded");
      return;
    }
    const next = [...embedsRef.current, url];
    embedsRef.current = next;
    setEmbeds(next);
    void persistContent(blocksRef.current.length > 0 ? blocksRef.current : (initial ?? []), next);
    toast.success("Embedded");
  };

  const removeEmbed = (url: string) => {
    const next = embedsRef.current.filter((u) => u !== url);
    embedsRef.current = next;
    setEmbeds(next);
    void persistContent(blocksRef.current.length > 0 ? blocksRef.current : (initial ?? []), next);
  };

  const updateSpreadsheets = (next: Spreadsheet[]) => {
    spreadsheetsRef.current = next;
    setSpreadsheets(next);
    queueSave();
  };

  const handleAddTable = () => {
    const next = [...spreadsheetsRef.current, emptySheet()];
    updateSpreadsheets(next);
  };

  const handleSheetChange = (id: string, newData: string[][]) => {
    const next = spreadsheetsRef.current.map((s) => (s.id === id ? { ...s, data: newData } : s));
    updateSpreadsheets(next);
  };

  const handleSheetRemove = (id: string) => {
    const next = spreadsheetsRef.current.filter((s) => s.id !== id);
    updateSpreadsheets(next);
  };

  const toEmbedUrl = (url: string) =>
    url.includes("docs.google.com/spreadsheets")
      ? url
          .replace("?usp=sharing", "?embedded=true")
          .replace("/edit#", "/edit?embedded=true#")
          .replace(/\/edit$/, "/edit?embedded=true")
      : url;

  const handleLayoutChange = (l: "default" | "wide" | "full") => {
    setLayout(l);
    if (pageId) localStorage.setItem(`page_layout_${pageId}`, l);
  };


  const handleTitleChange = (next: string) => {
    setTitle(next);
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = window.setTimeout(async () => {
      if (!page || !user) return;
      const { data } = await supabase
        .from("pages")
        .update({ title: next || "Untitled", updated_by: user.id })
        .eq("id", page.id)
        .select()
        .single();
      if (data) upsertPage(data as Page);
    }, TITLE_DEBOUNCE);
  };

  const updateIcon = async (next: string) => {
    if (!page) return;
    const value = next || null;
    setIcon(value);
    const { data } = await supabase
      .from("pages")
      .update({ icon: value })
      .eq("id", page.id)
      .select()
      .single();
    if (data) upsertPage(data as Page);
  };

  const handleCoverUpload = async (file: File) => {
    if (!activeWorkspace || !page) return;
    try {
      const url = await uploadToBucket("page-covers", activeWorkspace.id, page.id, file);
      setCover(url);
      const { data } = await supabase
        .from("pages")
        .update({ cover_url: url })
        .eq("id", page.id)
        .select()
        .single();
      if (data) upsertPage(data as Page);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cover upload failed");
    }
  };

  const removeCover = async () => {
    if (!page) return;
    setCover(null);
    await supabase.from("pages").update({ cover_url: null }).eq("id", page.id);
  };

  if (!pageId) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select or create a page to get started.
      </div>
    );
  }

  if (!page || initial === undefined) {
    return (
      <div className="flex-1 p-12">
        <Skeleton className="mb-4 h-10 w-1/2" />
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (page.type === "database") {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <PageTopBar page={page} saveState={saveState} onExportMarkdown={async () => {}} />
        <div className="border-b border-border px-12 pt-6 pb-3">
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled database"
            aria-label="Database title"
            className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/40"
          />
        </div>
        <DatabaseView databasePageId={page.id} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <PageTopBar
          page={page}
          saveState={saveState}
          driveSyncing={driveSyncing}
          onEmbedSheet={handleEmbed}
          onAddTable={handleAddTable}
          onLayoutChange={handleLayoutChange}
          currentLayout={layout}
          onExportMarkdown={async () => {
            try {
              const md = await getMarkdown();
              const blob = new Blob([md], { type: "text/markdown" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `${page.title || "untitled"}.md`;
              a.click();
              URL.revokeObjectURL(a.href);
            } catch {
              toast.error("Export failed");
            }
          }}
          onCopyMarkdown={async () => {
            try {
              const md = await getMarkdown();
              await navigator.clipboard.writeText(md);
              toast.success("Markdown copied to clipboard");
            } catch {
              toast.error("Copy failed");
            }
          }}
        >
          <PresenceAvatars collaborators={collaborators} currentUserId={user?.id ?? null} />
        </PageTopBar>

        <div className="flex-1 overflow-auto">
          {cover && (
            <div className="group relative h-[180px] w-full overflow-hidden">
              <img src={cover} alt="" className="h-full w-full object-cover" />
              <Button
                variant="secondary"
                size="sm"
                onClick={removeCover}
                className="absolute right-3 top-3 opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3" /> Remove cover
              </Button>
            </div>
          )}

          <div className={`mx-auto ${layout === "default" ? "max-w-[720px]" : layout === "wide" ? "max-w-[1100px]" : "max-w-none"} px-16 py-8`}>
            <div className="group mb-2 flex items-center gap-2 text-xs">
              {!cover && (
                <label className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-muted-foreground opacity-0 hover:bg-accent group-hover:opacity-100">
                  <ImagePlus className="h-3.5 w-3.5" /> Add cover
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleCoverUpload(f);
                    }}
                  />
                </label>
              )}
              {!icon && (
                <EmojiPicker
                  value={icon}
                  onChange={updateIcon}
                  trigger={
                    <button className="flex items-center gap-1 rounded px-2 py-1 text-muted-foreground opacity-0 hover:bg-accent group-hover:opacity-100">
                      <Smile className="h-3.5 w-3.5" /> Add icon
                    </button>
                  }
                />
              )}
            </div>
            {icon && (
              <EmojiPicker
                value={icon}
                onChange={updateIcon}
                trigger={
                  <button className="mb-3 inline-block text-5xl hover:opacity-80" aria-label="Change icon">
                    {icon}
                  </button>
                }
              />
            )}
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled"
              aria-label="Page title"
              className="mb-6 w-full bg-transparent text-4xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/40"
              autoFocus={title === "Untitled" || title === ""}
            />
            {page.parent_id && (
              <RowPropertiesPanel pageId={page.id} parentId={page.parent_id} />
            )}
            <ErrorBoundary
              fallback={(err, retry) => (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
                  <div className="mb-2 font-medium">Editor failed to load</div>
                  <div className="mb-3 text-xs text-muted-foreground">{err.message}</div>
                  <Button size="sm" variant="outline" onClick={retry}>Retry</Button>
                </div>
              )}
            >
              <BlockEditor
                pageId={page.id}
                initialContent={initial}
                editable
                onChange={handleEditorChange}
                onTyping={broadcastTyping}
                onReady={(ed) => {
                  editorRef.current = ed as unknown as EditorInstance;
                }}
              />
            </ErrorBoundary>

            {spreadsheets.length > 0 && (
              <div className="mt-2 space-y-2">
                {spreadsheets.map((ss) => (
                  <SpreadsheetBlock
                    key={ss.id}
                    data={ss.data}
                    onChange={(d) => handleSheetChange(ss.id, d)}
                    onRemove={() => handleSheetRemove(ss.id)}
                  />
                ))}
              </div>
            )}

            {embeds.length > 0 && (
              <div className="mt-6 space-y-4">
                {embeds.map((url) => {
                  let host = url;
                  try { host = new URL(url).hostname; } catch { /* noop */ }
                  return (
                    <div key={url} className="mt-4 rounded-lg border overflow-hidden">
                      <div className="flex items-center justify-between bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                        <span>{host}</span>
                        <button onClick={() => removeEmbed(url)} className="hover:text-destructive">✕</button>
                      </div>
                      <iframe
                        src={toEmbedUrl(url)}
                        className="h-[500px] w-full border-0"
                        allow="clipboard-read; clipboard-write"
                        allowFullScreen
                        title={host}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {rightPanelOpen && <RightPanel page={page} onInsertText={insertAIText} />}
    </div>
  );
}
