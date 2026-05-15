import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ChevronRight, Plus, Book, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { Notebook } from "@/lib/types";
import { toast } from "sonner";

interface NotebookWithCount extends Notebook {
  count: number;
}

export function NotebooksSection() {
  const navigate = useNavigate();
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [notebooks, setNotebooks] = useState<NotebookWithCount[]>([]);
  const [open, setOpen] = useState(true);

  const load = async () => {
    if (!activeWorkspace) return;
    const { data: nbs } = await supabase
      .from("notebooks")
      .select("*")
      .eq("workspace_id", activeWorkspace.id)
      .order("sort_order");
    const list = (nbs ?? []) as Notebook[];
    const counts: Record<string, number> = {};
    if (list.length > 0) {
      const { data: pgs } = await supabase
        .from("pages")
        .select("notebook_id")
        .in("notebook_id", list.map((n) => n.id))
        .eq("is_archived", false);
      for (const p of pgs ?? []) {
        const id = p.notebook_id as string;
        if (id) counts[id] = (counts[id] ?? 0) + 1;
      }
    }
    setNotebooks(list.map((n) => ({ ...n, count: counts[n.id] ?? 0 })));
  };

  useEffect(() => {
    void load();
  }, [activeWorkspace]); // eslint-disable-line

  if (!activeWorkspace) return null;

  const create = async (parentId: string | null = null) => {
    if (!user) return;
    const name = prompt("Notebook name?");
    if (!name) return;
    const { error } = await supabase.from("notebooks").insert({
      workspace_id: activeWorkspace.id,
      parent_id: parentId,
      name,
      created_by: user.id,
    });
    if (error) return toast.error(error.message);
    void load();
  };

  const rename = async (n: Notebook) => {
    const name = prompt("New name", n.name);
    if (!name || name === n.name) return;
    await supabase.from("notebooks").update({ name }).eq("id", n.id);
    void load();
  };

  const remove = async (n: Notebook) => {
    if (!confirm(`Delete "${n.name}"? Pages inside will be unassigned.`)) return;
    await supabase.from("notebooks").delete().eq("id", n.id);
    void load();
  };

  const addPage = async (notebook: Notebook) => {
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
        notebook_id: notebook.id,
        title: "Untitled",
        type: "page",
        created_by: user.id,
        updated_by: user.id,
        sort_order: nextOrder,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    void load();
    navigate(`/app/${activeWorkspace.slug}/${data.id}`);
  };

  const renderTree = (parentId: string | null, depth = 0) =>
    notebooks
      .filter((n) => n.parent_id === parentId)
      .map((n) => (
        <ContextMenu key={n.id}>
          <ContextMenuTrigger asChild>
            <button
              onClick={() => navigate(`/app/${activeWorkspace.slug}/notebook/${n.id}`)}
              style={{ paddingLeft: 12 + depth * 12 }}
              className="flex w-full items-center gap-2 rounded py-1 pr-2 text-left text-xs hover:bg-sidebar-accent"
            >
              <span>{n.icon ?? "📓"}</span>
              <span className="flex-1 truncate">{n.name}</span>
              <span className="text-muted-foreground">{n.count}</span>
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => addPage(n)}>
              <FileText className="mr-2 h-3 w-3" /> Add page
            </ContextMenuItem>
            <ContextMenuItem onClick={() => rename(n)}>Rename</ContextMenuItem>
            <ContextMenuItem onClick={() => create(n.id)}>Add sub-notebook</ContextMenuItem>
            <ContextMenuItem className="text-destructive" onClick={() => remove(n)}>
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))
      .concat(
        ...notebooks
          .filter((n) => n.parent_id === parentId)
          .map((n) => <div key={`c-${n.id}`}>{renderTree(n.id, depth + 1)}</div>)
      );

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="px-2 py-1">
      <CollapsibleTrigger className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
        <ChevronRight className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`} />
        <Book className="h-3 w-3" />
        Notebooks
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-0.5">{renderTree(null)}</div>
        <button
          onClick={() => create(null)}
          className="mt-1 flex w-full items-center gap-1 rounded px-3 py-1 text-xs text-muted-foreground hover:bg-sidebar-accent"
        >
          <Plus className="h-3 w-3" /> New notebook
        </button>
      </CollapsibleContent>
    </Collapsible>
  );
}
