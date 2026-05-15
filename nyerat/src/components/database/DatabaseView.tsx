import { useEffect, useState } from "react";
import { Plus, Table, Columns3, CalendarDays, LayoutGrid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDatabase } from "@/hooks/useDatabase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TableView } from "./views/TableView";
import { KanbanView } from "./views/KanbanView";
import { CalendarView } from "./views/CalendarView";
import { GalleryView } from "./views/GalleryView";
import { DatabaseToolbar } from "./DatabaseToolbar";
import { PropertiesPanel } from "./PropertiesPanel";
import type { ViewType, ViewConfig } from "@/lib/database-types";
import { toast } from "sonner";

const VIEW_ICONS = {
  table: Table,
  kanban: Columns3,
  calendar: CalendarDays,
  gallery: LayoutGrid,
};

export function DatabaseView({ databasePageId }: { databasePageId: string }) {
  const { databaseId, properties, views, rows, values, loading, setValue } =
    useDatabase(databasePageId);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [propsOpen, setPropsOpen] = useState(false);

  useEffect(() => {
    if (!activeViewId && views.length > 0) setActiveViewId(views[0].id);
  }, [views, activeViewId]);

  if (loading || !databaseId) {
    return (
      <div className="space-y-2 p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const activeView = views.find((v) => v.id === activeViewId) ?? views[0];

  const addView = async (type: ViewType) => {
    const maxOrder = views.reduce((m, v) => Math.max(m, v.sort_order), 0);
    const { data, error } = await supabase
      .from("database_views")
      .insert({
        database_id: databaseId,
        name: type[0].toUpperCase() + type.slice(1),
        type,
        sort_order: maxOrder + 1,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    if (data) setActiveViewId(data.id as string);
  };

  const updateConfig = async (cfg: ViewConfig) => {
    if (!activeView) return;
    await supabase.from("database_views").update({ config: cfg as never }).eq("id", activeView.id);
  };

  const renameView = async () => {
    if (!activeView) return;
    const next = prompt("Rename view", activeView.name);
    if (!next) return;
    await supabase.from("database_views").update({ name: next }).eq("id", activeView.id);
  };

  const deleteView = async () => {
    if (!activeView || views.length <= 1) return toast.error("Cannot delete the last view");
    if (!confirm("Delete this view?")) return;
    await supabase.from("database_views").delete().eq("id", activeView.id);
    setActiveViewId(views.find((v) => v.id !== activeView.id)?.id ?? null);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* View tabs */}
      <div className="flex items-center gap-1 border-b border-border px-4 py-1">
        {views.map((v) => {
          const Icon = VIEW_ICONS[v.type];
          return (
            <button
              key={v.id}
              onClick={() => setActiveViewId(v.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs",
                activeViewId === v.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {v.name}
            </button>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add view
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => addView("table")}>
              <Table className="mr-2 h-3.5 w-3.5" /> Table
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addView("kanban")}>
              <Columns3 className="mr-2 h-3.5 w-3.5" /> Kanban
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addView("calendar")}>
              <CalendarDays className="mr-2 h-3.5 w-3.5" /> Calendar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addView("gallery")}>
              <LayoutGrid className="mr-2 h-3.5 w-3.5" /> Gallery
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                ⋯
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={renameView}>Rename view</DropdownMenuItem>
              <DropdownMenuItem onClick={deleteView} className="text-destructive">
                Delete view
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {activeView && (
        <DatabaseToolbar
          view={activeView}
          properties={properties}
          onUpdateConfig={updateConfig}
          onOpenProperties={() => setPropsOpen(true)}
        />
      )}

      <div className="flex-1 overflow-auto">
        {!activeView ? (
          <div className="p-6 text-sm text-muted-foreground">Add a view to get started.</div>
        ) : rows.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
            <div className="text-4xl">📊</div>
            <div className="text-sm">This database is empty</div>
          </div>
        ) : activeView.type === "table" ? (
          <TableView
            view={activeView}
            databasePageId={databasePageId}
            properties={properties}
            rows={rows}
            values={values}
            onSetValue={setValue}
          />
        ) : activeView.type === "kanban" ? (
          <KanbanView
            view={activeView}
            databasePageId={databasePageId}
            properties={properties}
            rows={rows}
            values={values}
            onSetValue={setValue}
          />
        ) : activeView.type === "calendar" ? (
          <CalendarView
            view={activeView}
            properties={properties}
            rows={rows}
            values={values}
          />
        ) : (
          <GalleryView view={activeView} properties={properties} rows={rows} values={values} />
        )}
      </div>

      <PropertiesPanel
        databaseId={databaseId}
        properties={properties}
        open={propsOpen}
        onOpenChange={setPropsOpen}
      />
    </div>
  );
}
