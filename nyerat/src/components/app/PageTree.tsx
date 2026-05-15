import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePageStore } from "@/stores/usePageStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, FileText, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Page } from "@/lib/types";
import { toast } from "sonner";

const MAX_DEPTH = 5;

export function PageTree() {
  const { pages } = usePageStore();
  const tree = useMemo(() => {
    const roots: Page[] = [];
    const byParent = new Map<string, Page[]>();
    Object.values(pages).forEach((p) => {
      if (!p.parent_id) roots.push(p);
      else {
        const arr = byParent.get(p.parent_id) ?? [];
        arr.push(p);
        byParent.set(p.parent_id, arr);
      }
    });
    const sortFn = (a: Page, b: Page) =>
      a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at);
    roots.sort(sortFn);
    byParent.forEach((arr) => arr.sort(sortFn));
    return { roots, byParent };
  }, [pages]);

  if (tree.roots.length === 0) {
    return (
      <div className="px-2 py-3 text-xs text-muted-foreground">
        No pages yet. Click "New Page" to start.
      </div>
    );
  }

  return (
    <div className="space-y-0.5 pb-4">
      {tree.roots.map((p) => (
        <PageNode key={p.id} page={p} depth={0} byParent={tree.byParent} />
      ))}
    </div>
  );
}

function PageNode({
  page,
  depth,
  byParent,
}: {
  page: Page;
  depth: number;
  byParent: Map<string, Page[]>;
}) {
  const navigate = useNavigate();
  const { workspaceSlug, pageId } = useParams();
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const { upsertPage, removePage } = usePageStore();
  const [open, setOpen] = useState(true);
  // Hide database row children from sidebar tree
  const children = page.type === "database" ? [] : byParent.get(page.id) ?? [];
  const hasChildren = children.length > 0;
  const isActive = pageId === page.id;

  const goTo = () => navigate(`/app/${workspaceSlug}/${page.id}`);

  const addChild = async () => {
    if (!activeWorkspace || !user || depth + 1 >= MAX_DEPTH) return;
    const { data, error } = await supabase
      .from("pages")
      .insert({
        workspace_id: activeWorkspace.id,
        parent_id: page.id,
        title: "Untitled",
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    upsertPage(data as Page);
    setOpen(true);
    navigate(`/app/${workspaceSlug}/${data.id}`);
  };

  const rename = async () => {
    const next = prompt("Rename page", page.title);
    if (!next) return;
    const { data, error } = await supabase
      .from("pages")
      .update({ title: next })
      .eq("id", page.id)
      .select()
      .single();
    if (error) return toast.error(error.message);
    upsertPage(data as Page);
  };

  const duplicate = async () => {
    if (!activeWorkspace || !user) return;
    const { data, error } = await supabase
      .from("pages")
      .insert({
        workspace_id: activeWorkspace.id,
        parent_id: page.parent_id,
        title: `${page.title} (copy)`,
        icon: page.icon,
        content: page.content as never,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    upsertPage(data as Page);
  };

  const archive = async () => {
    const { error } = await supabase
      .from("pages")
      .update({ is_archived: true })
      .eq("id", page.id);
    if (error) return toast.error(error.message);
    removePage(page.id);
  };

  const deletePage = async () => {
    if (!confirm("Delete this page and all its sub-pages?")) return;
    const { error } = await supabase.from("pages").delete().eq("id", page.id);
    if (error) return toast.error(error.message);
    removePage(page.id);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/app/${workspaceSlug}/${page.id}`);
    toast.success("Link copied");
  };

  return (
    <div>
      <div
        className={cn(
          "group flex h-7 items-center gap-1 rounded-md pr-1 transition-colors hover:bg-sidebar-accent",
          isActive && "bg-sidebar-accent"
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-background/50",
            !hasChildren && "invisible"
          )}
        >
          <ChevronRight className={cn("h-3 w-3 transition-transform", open && "rotate-90")} />
        </button>
        <button
          type="button"
          onClick={goTo}
          className="flex flex-1 items-center gap-1.5 truncate text-left text-sm"
        >
          <span className="text-sm">
            {page.icon ?? <FileText className="h-3.5 w-3.5 text-muted-foreground" />}
          </span>
          <span className="truncate">{page.title || "Untitled"}</span>
        </button>
        <div className="flex items-center opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-background/50">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={rename}>Rename</DropdownMenuItem>
              {depth + 1 < MAX_DEPTH && (
                <DropdownMenuItem onClick={addChild}>Add sub-page</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={duplicate}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink}>Copy link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={archive}>Archive</DropdownMenuItem>
              <DropdownMenuItem onClick={deletePage} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {depth + 1 < MAX_DEPTH && (
            <button
              onClick={addChild}
              className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-background/50"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      {open && hasChildren && (
        <div>
          {children.map((c) => (
            <PageNode key={c.id} page={c} depth={depth + 1} byParent={byParent} />
          ))}
        </div>
      )}
    </div>
  );
}
