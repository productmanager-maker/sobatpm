import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon } from "lucide-react";
import { applyFilter, applySort } from "@/lib/database-utils";
import type { DatabaseProperty, DatabaseView } from "@/lib/database-types";
import type { Page } from "@/lib/types";

interface Props {
  view: DatabaseView;
  properties: DatabaseProperty[];
  rows: Page[];
  values: Record<string, Record<string, unknown>>;
}

export function GalleryView({ view, properties, rows, values }: Props) {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();

  const processed = useMemo(() => {
    let r = applyFilter(rows, view.config.filters ?? [], properties, values);
    r = applySort(r, view.config.sorts ?? [], properties, values);
    return r;
  }, [rows, view.config, properties, values]);

  const visibleProps = (view.config.visibleProps ?? [])
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is DatabaseProperty => !!p && !p.is_primary)
    .slice(0, 4);

  if (processed.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
        No entries yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {processed.map((row) => (
        <button
          key={row.id}
          onClick={() => navigate(`/app/${workspaceSlug}/${row.id}`)}
          className="overflow-hidden rounded-lg border border-border bg-card text-left transition-shadow hover:shadow-md"
        >
          <div className="flex h-40 w-full items-center justify-center bg-muted">
            {row.cover_url ? (
              <img src={row.cover_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
            )}
          </div>
          <div className="p-3">
            <div className="font-medium">{row.title || "Untitled"}</div>
            {visibleProps.length > 0 && (
              <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
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
        </button>
      ))}
    </div>
  );
}
