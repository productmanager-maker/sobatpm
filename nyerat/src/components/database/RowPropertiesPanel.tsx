import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCell } from "./PropertyCell";
import { PropertyIcon } from "./PropertyIcon";
import { Skeleton } from "@/components/ui/skeleton";
import type { DatabaseProperty, PropertyValueRow } from "@/lib/database-types";

interface Props {
  pageId: string;
  parentId: string;
}

/**
 * Renders the database row's properties (when this page is a child of a `database` page)
 * as a two-column key/value list. Inline-editable, syncs to property_values.
 */
export function RowPropertiesPanel({ pageId, parentId }: Props) {
  const [properties, setProperties] = useState<DatabaseProperty[] | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Verify parent is a database page
      const { data: parent } = await supabase
        .from("pages")
        .select("type")
        .eq("id", parentId)
        .maybeSingle();
      if (!parent || parent.type !== "database") {
        if (!cancelled) setProperties([]);
        return;
      }
      const { data: db } = await supabase
        .from("databases")
        .select("id")
        .eq("page_id", parentId)
        .maybeSingle();
      if (!db) {
        if (!cancelled) setProperties([]);
        return;
      }
      const [{ data: props }, { data: vals }] = await Promise.all([
        supabase
          .from("database_properties")
          .select("*")
          .eq("database_id", db.id)
          .order("sort_order"),
        supabase.from("property_values").select("*").eq("page_id", pageId),
      ]);
      if (cancelled) return;
      const byProp: Record<string, unknown> = {};
      for (const v of (vals ?? []) as PropertyValueRow[]) byProp[v.property_id] = v.value;
      setValues(byProp);
      setProperties(((props ?? []) as unknown) as DatabaseProperty[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [pageId, parentId]);

  const setValue = async (propertyId: string, value: unknown) => {
    setValues((s) => ({ ...s, [propertyId]: value }));
    await supabase
      .from("property_values")
      .upsert({ page_id: pageId, property_id: propertyId, value: value as never });
  };

  if (properties === null) {
    return (
      <div className="mb-6 space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  if (properties.length === 0) return null;

  const editable = properties.filter((p) => !p.is_primary);
  if (editable.length === 0) return null;

  return (
    <div className="mb-8 grid grid-cols-[160px_1fr] gap-x-4 gap-y-1 border-b border-border pb-6">
      {editable.map((p) => (
        <div key={p.id} className="contents">
          <div className="flex items-center gap-1.5 py-1.5 text-sm text-muted-foreground">
            <PropertyIcon type={p.type} />
            <span className="truncate">{p.name}</span>
          </div>
          <div className="min-w-0 py-0.5">
            <PropertyCell
              property={p}
              value={values[p.id] ?? null}
              onChange={(v) => void setValue(p.id, v)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
