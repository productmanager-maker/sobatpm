import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Send, History as HistoryIcon, MessageCircle, Settings2, Check, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Page } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { TagsPicker } from "@/components/editor/TagsPicker";
import { toast } from "sonner";
import type { PartialBlock } from "@blocknote/core";
import { AIPanel } from "./AIPanel";

interface Tag {
  id: string;
  name: string;
  color: string | null;
}
interface PageVersion {
  id: string;
  title: string | null;
  content: { blocks?: PartialBlock[] } | null;
  created_by: string | null;
  created_at: string;
}
interface Comment {
  id: string;
  page_id: string;
  parent_id: string | null;
  content: string;
  resolved: boolean | null;
  created_by: string;
  created_at: string;
}

export function RightPanel({ page, onInsertText }: { page: Page; onInsertText?: (t: string) => void }) {
  const { setRightPanelOpen, rightPanelTab, setRightPanelTab } = useUIStore();
  return (
    <aside className="flex w-[320px] flex-shrink-0 flex-col border-l bg-background">
      <div className="flex h-12 items-center justify-between border-b px-3">
        <span className="text-sm font-medium">Page details</span>
        <Button variant="ghost" size="icon" onClick={() => setRightPanelOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Tabs
        value={rightPanelTab}
        onValueChange={(v) => setRightPanelTab(v as typeof rightPanelTab)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <TabsList className="m-2 grid grid-cols-4">
          <TabsTrigger value="props" aria-label="Properties">
            <Settings2 className="h-3.5 w-3.5" />
          </TabsTrigger>
          <TabsTrigger value="ai" aria-label="AI assistant">
            <Sparkles className="h-3.5 w-3.5" />
          </TabsTrigger>
          <TabsTrigger value="comments" aria-label="Comments">
            <MessageCircle className="h-3.5 w-3.5" />
          </TabsTrigger>
          <TabsTrigger value="history" aria-label="History">
            <HistoryIcon className="h-3.5 w-3.5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="props" className="flex-1 overflow-auto px-3 pb-4">
          <PropsPanel page={page} />
        </TabsContent>
        <TabsContent value="ai" className="flex-1 overflow-hidden">
          <AIPanel key={page.id} page={page} onInsert={onInsertText} />
        </TabsContent>
        <TabsContent value="comments" className="flex-1 overflow-hidden">
          <CommentsPanel page={page} />
        </TabsContent>
        <TabsContent value="history" className="flex-1 overflow-auto px-3 pb-4">
          <HistoryPanel page={page} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function PropsPanel({ page }: { page: Page }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [pageTagIds, setPageTagIds] = useState<Set<string>>(new Set());
  const [newTag, setNewTag] = useState("");
  const [reminder, setReminder] = useState<string>(
    page.reminder_at ? new Date(page.reminder_at).toISOString().slice(0, 16) : ""
  );

  // Compute live word count from current page content
  const wordStats = useMemo(() => {
    const blocks = (page.content as { blocks?: PartialBlock[] } | null)?.blocks ?? [];
    let text = "";
    const walk = (b: unknown) => {
      if (!b) return;
      if (typeof b === "string") {
        text += " " + b;
        return;
      }
      if (Array.isArray(b)) {
        for (const x of b) walk(x);
        return;
      }
      if (typeof b === "object") {
        const obj = b as Record<string, unknown>;
        if (typeof obj.text === "string") text += " " + obj.text;
        if (obj.content) walk(obj.content);
        if (obj.children) walk(obj.children);
      }
    };
    walk(blocks);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return { words, minutes: Math.max(1, Math.round(words / 200)) };
  }, [page.content]);

  useEffect(() => {
    (async () => {
      const { data: ts } = await supabase
        .from("tags")
        .select("*")
        .eq("workspace_id", page.workspace_id);
      setTags((ts ?? []) as Tag[]);
      const { data: pts } = await supabase
        .from("page_tags")
        .select("tag_id")
        .eq("page_id", page.id);
      setPageTagIds(new Set((pts ?? []).map((r) => r.tag_id as string)));
    })();
  }, [page.id, page.workspace_id]);

  const toggleTag = async (tag: Tag) => {
    if (pageTagIds.has(tag.id)) {
      await supabase.from("page_tags").delete().eq("page_id", page.id).eq("tag_id", tag.id);
      setPageTagIds((s) => {
        const n = new Set(s);
        n.delete(tag.id);
        return n;
      });
    } else {
      await supabase.from("page_tags").insert({ page_id: page.id, tag_id: tag.id });
      setPageTagIds((s) => new Set(s).add(tag.id));
    }
  };

  const createTag = async () => {
    if (!newTag.trim()) return;
    const { data } = await supabase
      .from("tags")
      .insert({ workspace_id: page.workspace_id, name: newTag.trim() })
      .select()
      .single();
    if (data) {
      setTags((ts) => [...ts, data as Tag]);
      await supabase.from("page_tags").insert({ page_id: page.id, tag_id: (data as Tag).id });
      setPageTagIds((s) => new Set(s).add((data as Tag).id));
      setNewTag("");
    }
  };

  const updateReminder = async (val: string) => {
    setReminder(val);
    await supabase
      .from("pages")
      .update({ reminder_at: val ? new Date(val).toISOString() : null })
      .eq("id", page.id);
  };

  return (
    <div className="space-y-5 pt-2 text-sm">
      <section>
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</div>
        <TagsPicker workspaceId={page.workspace_id} pageId={page.id} />
      </section>

      <Separator />

      <section className="space-y-1.5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Reminder
        </div>
        <Input
          type="datetime-local"
          value={reminder}
          onChange={(e) => updateReminder(e.target.value)}
          className="h-8 text-xs"
        />
      </section>

      <Separator />

      <section className="space-y-1 text-xs text-muted-foreground">
        <div className="text-xs font-medium uppercase tracking-wider">Stats</div>
        <div>
          {wordStats.words} words · ~{wordStats.minutes} min read
        </div>
        <div>Created {formatDistanceToNow(new Date(page.created_at), { addSuffix: true })}</div>
        <div>Edited {formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}</div>
      </section>
    </div>
  );
}

function CommentsPanel({ page }: { page: Page }) {
  const { user, profile } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("page_id", page.id)
        .order("created_at", { ascending: true });
      setComments((data ?? []) as Comment[]);
    })();

    const ch = supabase
      .channel(`comments:${page.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `page_id=eq.${page.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((cs) => [...cs, payload.new as Comment]);
          } else if (payload.eventType === "UPDATE") {
            setComments((cs) => cs.map((c) => (c.id === (payload.new as Comment).id ? (payload.new as Comment) : c)));
          } else if (payload.eventType === "DELETE") {
            setComments((cs) => cs.filter((c) => c.id !== (payload.old as Comment).id));
          }
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [page.id]);

  const send = async () => {
    if (!text.trim() || !user) return;
    await supabase.from("comments").insert({
      page_id: page.id,
      parent_id: replyTo,
      content: text.trim(),
      created_by: user.id,
    });
    setText("");
    setReplyTo(null);
  };

  const toggleResolve = async (c: Comment) => {
    await supabase.from("comments").update({ resolved: !c.resolved }).eq("id", c.id);
  };

  const roots = comments.filter((c) => !c.parent_id);
  const childrenOf = (id: string) => comments.filter((c) => c.parent_id === id);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-3 py-3">
          {roots.length === 0 && (
            <p className="text-xs text-muted-foreground">No comments yet.</p>
          )}
          {roots.map((c) => (
            <div key={c.id} className={`rounded-md border p-2 text-xs ${c.resolved ? "opacity-50" : ""}`}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">
                  {c.created_by === user?.id ? profile?.full_name ?? "You" : "Member"}
                </span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{c.content}</p>
              <div className="mt-1.5 flex gap-1">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setReplyTo(c.id)}>
                  Reply
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => toggleResolve(c)}>
                  <Check className="mr-1 h-3 w-3" />
                  {c.resolved ? "Reopen" : "Resolve"}
                </Button>
              </div>
              {childrenOf(c.id).map((r) => (
                <div key={r.id} className="mt-2 ml-3 border-l pl-2">
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="font-medium">
                      {r.created_by === user?.id ? profile?.full_name ?? "You" : "Member"}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{r.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-2">
        {replyTo && (
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Replying...</span>
            <button onClick={() => setReplyTo(null)}>Cancel</button>
          </div>
        )}
        <div className="flex gap-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="text-xs"
          />
          <Button size="icon" onClick={send} disabled={!text.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function HistoryPanel({ page }: { page: Page }) {
  const { user } = useAuthStore();
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [viewing, setViewing] = useState<PageVersion | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("page_versions")
        .select("*")
        .eq("page_id", page.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setVersions((data ?? []) as PageVersion[]);
    })();
  }, [page.id]);

  const restore = async () => {
    if (!viewing || !user) return;
    await supabase
      .from("pages")
      .update({ content: viewing.content as never, title: viewing.title ?? page.title, updated_by: user.id })
      .eq("id", page.id);
    await supabase.from("page_versions").insert({
      page_id: page.id,
      content: viewing.content as never,
      title: viewing.title,
      created_by: user.id,
    });
    toast.success("Version restored — refresh to see the change");
    setViewing(null);
  };

  return (
    <div className="space-y-1 pt-2 text-xs">
      {versions.length === 0 && <p className="text-muted-foreground">No version history yet.</p>}
      {versions.map((v) => (
        <button
          key={v.id}
          onClick={() => setViewing(v)}
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-accent"
        >
          <span>{v.created_by === user?.id ? "You" : "Member"}</span>
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}
          </span>
        </button>
      ))}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewing?.title ?? "Version"}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="max-h-[60vh] overflow-auto rounded-md border p-4">
              <BlockEditor
                pageId={`v-${viewing.id}`}
                initialContent={(viewing.content?.blocks as PartialBlock[]) ?? []}
                editable={false}
                onChange={() => {}}
              />
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={restore}>Restore this version</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
