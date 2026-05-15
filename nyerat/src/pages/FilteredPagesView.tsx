import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { FileText, Tag as TagIcon, Book, Plus } from "lucide-react";
import { TAG_COLOR_HEX, type Tag, type TagColor, type Notebook, type Page } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Props {
  variant: "tag" | "notebook";
}

export default function FilteredPagesView({ variant }: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [pages, setPages] = useState<Page[] | null>(null);
  const [meta, setMeta] = useState<Tag | Notebook | null>(null);

  const id = variant === "tag" ? params.tagId : params.notebookId;

  useEffect(() => {
    if (!id || !activeWorkspace) return;
    setPages(null);
    (async () => {
      if (variant === "tag") {
        const [{ data: tag }, { data: links }] = await Promise.all([
          supabase.from("tags").select("*").eq("id", id).maybeSingle(),
          supabase.from("page_tags").select("page_id").eq("tag_id", id),
        ]);
        setMeta((tag as Tag) ?? null);
        const ids = (links ?? []).map((r) => r.page_id as string);
        if (ids.length === 0) {
          setPages([]);
          return;
        }
        const { data: pgs } = await supabase
          .from("pages")
          .select("*")
          .in("id", ids)
          .eq("is_archived", false)
          .order("updated_at", { ascending: false });
        setPages((pgs ?? []) as Page[]);
      } else {
        const [{ data: nb }, { data: pgs }] = await Promise.all([
          supabase.from("notebooks").select("*").eq("id", id).maybeSingle(),
          supabase
            .from("pages")
            .select("*")
            .eq("notebook_id", id)
            .eq("is_archived", false)
            .order("updated_at", { ascending: false }),
        ]);
        setMeta((nb as Notebook) ?? null);
        setPages((pgs ?? []) as Page[]);
      }
    })();
  }, [id, variant, activeWorkspace]);

  if (!activeWorkspace) return null;

  const title =
    meta && variant === "tag" ? (meta as Tag).name : meta ? (meta as Notebook).name : "Loading…";
  const color =
    variant === "tag" && meta
      ? ((meta as Tag).color && (meta as Tag).color! in TAG_COLOR_HEX
          ? TAG_COLOR_HEX[(meta as Tag).color as TagColor]
          : (meta as Tag).color) ?? TAG_COLOR_HEX.gray
      : null;

  return (
    <div className="mx-auto max-w-3xl px-12 pt-12 pb-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {variant === "tag" ? (
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm"
              style={{ background: `${color}33` }}
            >
              <TagIcon className="h-3.5 w-3.5" />
              {title}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-3xl">
              <span>{(meta as Notebook | null)?.icon ?? <Book />}</span>
              <span className="font-bold">{title}</span>
            </span>
          )}
        </div>
        {variant === "notebook" && meta && (
          <Button
            size="sm"
            onClick={async () => {
              if (!user || !activeWorkspace) return;
              const { data: maxRow } = await supabase
                .from("pages")
                .select("sort_order")
                .eq("workspace_id", activeWorkspace.id)
                .order("sort_order", { ascending: false })
                .limit(1)
                .maybeSingle();
              const nextOrder = ((maxRow?.sort_order ?? 0) as number) + 1;
              const { data, error } = await supabase
                .from("pages")
                .insert({
                  workspace_id: activeWorkspace.id,
                  notebook_id: (meta as Notebook).id,
                  title: "Untitled",
                  type: "page",
                  created_by: user.id,
                  updated_by: user.id,
                  sort_order: nextOrder,
                })
                .select()
                .single();
              if (error) return toast.error(error.message);
              navigate(`/app/${activeWorkspace.slug}/${data.id}`);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> New page in this notebook
          </Button>
        )}
      </div>

      {pages === null && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {pages && pages.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No pages here yet.
        </div>
      )}

      <ul className="divide-y divide-border rounded-md border border-border">
        {(pages ?? []).map((p) => (
          <li key={p.id}>
            <button
              onClick={() => navigate(`/app/${activeWorkspace.slug}/${p.id}`)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent"
            >
              <span className="text-lg">{p.icon ?? <FileText className="h-4 w-4 text-muted-foreground" />}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{p.title || "Untitled"}</div>
                <div className="text-xs text-muted-foreground">
                  Edited {formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
