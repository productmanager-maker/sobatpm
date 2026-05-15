import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SELECT_COLOR_CLASSES,
  type DatabaseProperty,
  type DatabaseView,
  type SelectOption,
} from "@/lib/database-types";
import type { Page } from "@/lib/types";
import { applyFilter, applySort, groupBy } from "@/lib/database-utils";

interface Props {
  view: DatabaseView;
  databasePageId: string;
  properties: DatabaseProperty[];
  rows: Page[];
  values: Record<string, Record<string, unknown>>;
  onSetValue: (pageId: string, propertyId: string, value: unknown) => void;
}

export function KanbanView({
  view,
  databasePageId,
  properties,
  rows,
  values,
  onSetValue,
}: Props) {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();
  const { user } = useAuthStore();

  const groupProp =
    properties.find((p) => p.id === view.config.groupBy) ??
    properties.find((p) => p.type === "select");

  const processed = useMemo(() => {
    let r = applyFilter(rows, view.config.filters ?? [], properties, values);
    r = applySort(r, view.config.sorts ?? [], properties, values);
    return r;
  }, [rows, view.config, properties, values]);

  const groups = useMemo(() => {
    if (!groupProp || groupProp.type !== "select") return [];
    const opts = groupProp.config.options ?? [];
    const groupsArr = opts.map((opt) => ({
      key: opt.id,
      option: opt,
      rows: processed.filter((r) => values[r.id]?.[groupProp.id] === opt.id),
    }));
    groupsArr.push({
      key: "__none",
      option: null as unknown as SelectOption,
      rows: processed.filter((r) => !values[r.id]?.[groupProp.id]),
    });
    return groupsArr;
  }, [processed, groupProp, values]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  if (!groupProp || groupProp.type !== "select") {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
        Add a select property to use Kanban view.
      </div>
    );
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const rowId = e.active.id as string;
    const overContainer = (e.over?.data.current as { container?: string } | undefined)?.container;
    if (!overContainer) return;
    const newValue = overContainer === "__none" ? null : overContainer;
    if (values[rowId]?.[groupProp.id] !== newValue) {
      onSetValue(rowId, groupProp.id, newValue);
    }
  };

  const addCard = async (optionId: string | null) => {
    if (!user) return;
    const { data: parent } = await supabase
      .from("pages")
      .select("workspace_id")
      .eq("id", databasePageId)
      .single();
    if (!parent) return;
    const maxOrder = rows.reduce((m, r) => Math.max(m, r.sort_order), 0);
    const { data: row } = await supabase
      .from("pages")
      .insert({
        workspace_id: parent.workspace_id,
        parent_id: databasePageId,
        title: "Untitled",
        type: "page",
        sort_order: maxOrder + 1,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();
    if (row && optionId) {
      await supabase.from("property_values").upsert({
        page_id: row.id,
        property_id: groupProp.id,
        value: optionId as never,
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-3 overflow-x-auto p-4">
        {groups.map((g) => (
          <KanbanColumn
            key={g.key}
            id={g.key}
            label={g.option?.label ?? "No value"}
            color={g.option?.color}
            rows={g.rows}
            properties={properties}
            view={view}
            values={values}
            onCardClick={(id) => navigate(`/app/${workspaceSlug}/${id}`)}
            onAdd={() => addCard(g.key === "__none" ? null : g.key)}
          />
        ))}
      </div>
    </DndContext>
  );
}

function KanbanColumn({
  id,
  label,
  color,
  rows,
  properties,
  view,
  values,
  onCardClick,
  onAdd,
}: {
  id: string;
  label: string;
  color?: string;
  rows: Page[];
  properties: DatabaseProperty[];
  view: DatabaseView;
  values: Record<string, Record<string, unknown>>;
  onCardClick: (id: string) => void;
  onAdd: () => void;
}) {
  const { setNodeRef } = useSortable({ id: `col-${id}`, data: { container: id } });
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-md bg-muted/40">
      <div className="flex items-center justify-between border-b border-border p-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-xs",
              color ? SELECT_COLOR_CLASSES[color as keyof typeof SELECT_COLOR_CLASSES] : "bg-muted"
            )}
          >
            {label}
          </span>
          <span className="text-xs text-muted-foreground">{rows.length}</span>
        </div>
      </div>
      <div ref={setNodeRef} className="flex-1 space-y-2 overflow-y-auto p-2">
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          {rows.map((row) => (
            <KanbanCard
              key={row.id}
              row={row}
              properties={properties}
              view={view}
              values={values}
              container={id}
              onClick={() => onCardClick(row.id)}
            />
          ))}
        </SortableContext>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={onAdd}>
          <Plus className="mr-1 h-3.5 w-3.5" /> New
        </Button>
      </div>
    </div>
  );
}

function KanbanCard({
  row,
  properties,
  view,
  values,
  container,
  onClick,
}: {
  row: Page;
  properties: DatabaseProperty[];
  view: DatabaseView;
  values: Record<string, Record<string, unknown>>;
  container: string;
  onClick: () => void;
}) {
  const sortable = useSortable({ id: row.id, data: { container } });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    opacity: sortable.isDragging ? 0.4 : 1,
  };
  const visibleProps = (view.config.visibleProps ?? [])
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is DatabaseProperty => !!p && !p.is_primary)
    .slice(0, 3);
  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      {...sortable.attributes}
      {...sortable.listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="cursor-grab rounded-md border border-border bg-card p-2.5 text-sm shadow-sm hover:border-primary/40"
    >
      <div className="font-medium">{row.title || "Untitled"}</div>
      {visibleProps.length > 0 && (
        <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
          {visibleProps.map((p) => {
            const v = values[row.id]?.[p.id];
            return (
              <div key={p.id} className="truncate">
                <span className="opacity-60">{p.name}: </span>
                {v == null || (Array.isArray(v) && v.length === 0) ? "—" : String(v)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
