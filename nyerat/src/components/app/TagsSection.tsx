import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { ChevronRight, Tag as TagIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TAG_COLOR_HEX, type Tag, type TagColor } from "@/lib/types";

interface TagWithCount extends Tag {
  count: number;
}

export function TagsSection() {
  const navigate = useNavigate();
  const { activeWorkspace } = useWorkspaceStore();
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!activeWorkspace) return;
    (async () => {
      const { data: ts } = await supabase
        .from("tags")
        .select("*")
        .eq("workspace_id", activeWorkspace.id)
        .order("name");
      const ids = (ts ?? []).map((t) => t.id);
      const counts: Record<string, number> = {};
      if (ids.length > 0) {
        const { data: pt } = await supabase.from("page_tags").select("tag_id").in("tag_id", ids);
        for (const r of pt ?? []) counts[r.tag_id as string] = (counts[r.tag_id as string] ?? 0) + 1;
      }
      setTags(((ts ?? []) as Tag[]).map((t) => ({ ...t, count: counts[t.id] ?? 0 })));
    })();
  }, [activeWorkspace]);

  if (!activeWorkspace) return null;

  const dot = (color: string | null) => {
    const c = (color && color in TAG_COLOR_HEX ? TAG_COLOR_HEX[color as TagColor] : color) ?? TAG_COLOR_HEX.gray;
    return <span className="inline-block h-2 w-2 rounded-full" style={{ background: c }} />;
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="px-2 py-1">
      <CollapsibleTrigger className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
        <ChevronRight className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`} />
        <TagIcon className="h-3 w-3" />
        Tags
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-0.5">
          {tags.length === 0 && (
            <div className="px-3 py-1 text-xs text-muted-foreground">No tags yet</div>
          )}
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/app/${activeWorkspace.slug}/tag/${t.id}`)}
              className="flex w-full items-center gap-2 rounded px-3 py-1 text-left text-xs hover:bg-sidebar-accent"
            >
              {dot(t.color)}
              <span className="flex-1 truncate">{t.name}</span>
              <span className="text-muted-foreground">{t.count}</span>
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
