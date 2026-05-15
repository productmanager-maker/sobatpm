import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { PropertyCell } from "../PropertyCell";
import { PropertyIcon } from "../PropertyIcon";
import { applyFilter, applySort } from "@/lib/database-utils";
import type { DatabaseProperty, DatabaseView } from "@/lib/database-types";
import type { Page } from "@/lib/types";

interface Props {
  view: DatabaseView;
  databasePageId: string;
  properties: DatabaseProperty[];
  rows: Page[];
  values: Record<string, Record<string, unknown>>;
  onSetValue: (pageId: string, propertyId: string, value: unknown) => void;
}

export function TableView({ view, databasePageId, properties, rows, values, onSetValue }: Props) {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();
  const { user } = useAuthStore();

  const visible = useMemo(
    () =>
      [...properties]
        .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : a.sort_order - b.sort_order))
        .filter((p) => !p.config.hidden),
    [properties]
  );

  const processed = useMemo(() => {
    let r = applyFilter(rows, view.config.filters ?? [], properties, values);
    r = applySort(r, view.config.sorts ?? [], properties, values);
    return r;
  }, [rows, view.config, properties, values]);

  const addRow = async () => {
    if (!user) return;
    const { data: parent } = await supabase
      .from("pages")
      .select("workspace_id, sort_order")
      .eq("id", databasePageId)
      .single();
    if (!parent) return;
    const maxOrder = rows.reduce((m, r) => Math.max(m, r.sort_order), 0);
    await supabase.from("pages").insert({
      workspace_id: parent.workspace_id,
      parent_id: databasePageId,
      title: "Untitled",
      type: "page",
      sort_order: maxOrder + 1,
      created_by: user.id,
      updated_by: user.id,
    });
  };

  const updateTitle = async (page: Page, title: string) => {
    await supabase.from("pages").update({ title: title || "Untitled" }).eq("id", page.id);
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this row?")) return;
    await supabase.from("pages").delete().eq("id", id);
  };

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-background">
          <tr>
            {visible.map((p) => (
              <th
                key={p.id}
                className="border-b border-r border-border px-3 py-1.5 text-left font-normal text-muted-foreground"
                style={{ minWidth: 160, maxWidth: 320 }}
              >
                <div className="flex items-center gap-1.5">
                  <PropertyIcon type={p.type} />
                  <span className="truncate">{p.name}</span>
                </div>
              </th>
            ))}
            <th className="w-10 border-b border-border" />
          </tr>
        </thead>
        <tbody>
          {processed.map((row) => (
            <tr key={row.id} className="group hover:bg-accent/40">
              {visible.map((p, idx) => {
                const isTitle = p.is_primary;
                return (
                  <td
                    key={p.id}
                    className="border-b border-r border-border px-3 py-1.5 align-top"
                    style={{ minWidth: 160, maxWidth: 320 }}
                  >
                    {isTitle ? (
                      <div className="flex items-center gap-2">
                        <input
                          defaultValue={row.title}
                          onBlur={(e) => updateTitle(row, e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && (e.target as HTMLInputElement).blur()
                          }
                          className="flex-1 bg-transparent font-medium outline-none"
                        />
                        <button
                          onClick={() => navigate(`/app/${workspaceSlug}/${row.id}`)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Open
                        </button>
                      </div>
                    ) : (
                      <PropertyCell
                        property={p}
                        value={values[row.id]?.[p.id] ?? null}
                        onChange={(v) => onSetValue(row.id, p.id, v)}
                        compact
                      />
                    )}
                  </td>
                );
              })}
              <td className="border-b border-border px-2">
                <button
                  onClick={() => deleteRow(row.id)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-destructive"
                  aria-label="Delete row"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={visible.length + 1} className="border-b border-border">
              <Button variant="ghost" size="sm" onClick={addRow} className="h-8 w-full justify-start">
                <Plus className="mr-1 h-3.5 w-3.5" /> New
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
