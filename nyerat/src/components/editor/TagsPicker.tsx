import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Check } from "lucide-react";
import { TAG_COLORS, TAG_COLOR_HEX, type Tag, type TagColor } from "@/lib/types";

interface Props {
  workspaceId: string;
  pageId: string;
  trigger?: React.ReactNode;
}

export function TagsPicker({ workspaceId, pageId, trigger }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [pageTagIds, setPageTagIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [creatingColor, setCreatingColor] = useState<TagColor>("blue");
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data: ts } = await supabase.from("tags").select("*").eq("workspace_id", workspaceId);
    setTags((ts ?? []) as Tag[]);
    const { data: pts } = await supabase.from("page_tags").select("tag_id").eq("page_id", pageId);
    setPageTagIds(new Set((pts ?? []).map((r) => r.tag_id as string)));
  };

  useEffect(() => {
    void load();
  }, [workspaceId, pageId]); // eslint-disable-line

  const toggle = async (tag: Tag) => {
    if (pageTagIds.has(tag.id)) {
      await supabase.from("page_tags").delete().eq("page_id", pageId).eq("tag_id", tag.id);
      setPageTagIds((s) => {
        const n = new Set(s);
        n.delete(tag.id);
        return n;
      });
    } else {
      await supabase.from("page_tags").insert({ page_id: pageId, tag_id: tag.id });
      setPageTagIds((s) => new Set(s).add(tag.id));
    }
  };

  const create = async () => {
    const name = query.trim();
    if (!name) return;
    const { data } = await supabase
      .from("tags")
      .insert({ workspace_id: workspaceId, name, color: creatingColor })
      .select()
      .single();
    if (data) {
      const t = data as Tag;
      setTags((ts) => [...ts, t]);
      await supabase.from("page_tags").insert({ page_id: pageId, tag_id: t.id });
      setPageTagIds((s) => new Set(s).add(t.id));
      setQuery("");
    }
  };

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  const exactMatch = tags.some((t) => t.name.toLowerCase() === query.toLowerCase().trim());

  const selected = tags.filter((t) => pageTagIds.has(t.id));

  const dot = (color: string | null) => {
    const c = (color && color in TAG_COLOR_HEX ? TAG_COLOR_HEX[color as TagColor] : color) ?? TAG_COLOR_HEX.gray;
    return <span className="inline-block h-2 w-2 rounded-full" style={{ background: c }} />;
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {selected.map((t) => (
        <button
          key={t.id}
          onClick={() => toggle(t)}
          className="group inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
          style={{ background: `${(t.color && t.color in TAG_COLOR_HEX ? TAG_COLOR_HEX[t.color as TagColor] : t.color) ?? TAG_COLOR_HEX.gray}33` }}
        >
          {dot(t.color)}
          <span>{t.name}</span>
          <X className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100" />
        </button>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger ?? (
            <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent">
              <Plus className="h-3 w-3" /> Add tag
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or create tag…"
            className="h-8 text-xs"
            autoFocus
          />
          <div className="mt-2 max-h-48 space-y-0.5 overflow-y-auto">
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => toggle(t)}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs hover:bg-accent"
              >
                {dot(t.color)}
                <span className="flex-1">{t.name}</span>
                {pageTagIds.has(t.id) && <Check className="h-3 w-3 text-primary" />}
              </button>
            ))}
            {filtered.length === 0 && !query && (
              <p className="px-2 py-1 text-xs text-muted-foreground">No tags yet</p>
            )}
          </div>
          {query && !exactMatch && (
            <div className="mt-2 space-y-1.5 border-t pt-2">
              <div className="flex items-center gap-1">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCreatingColor(c)}
                    className={`h-4 w-4 rounded-full border-2 ${creatingColor === c ? "border-foreground" : "border-transparent"}`}
                    style={{ background: TAG_COLOR_HEX[c] }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
              <Button size="sm" className="h-7 w-full justify-start text-xs" onClick={create}>
                <Plus className="mr-1 h-3 w-3" /> Create &quot;{query}&quot;
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
