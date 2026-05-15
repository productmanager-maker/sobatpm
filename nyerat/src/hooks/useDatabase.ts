import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  DatabaseProperty,
  DatabaseView,
  PropertyValueRow,
  ViewConfig,
} from "@/lib/database-types";
import type { Page } from "@/lib/types";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface DatabaseState {
  databaseId: string | null;
  properties: DatabaseProperty[];
  views: DatabaseView[];
  rows: Page[];
  values: Record<string, Record<string, unknown>>; // page_id -> property_id -> value
  loading: boolean;
}

/**
 * Loads database meta + child rows for a page of type='database'.
 * Sets up realtime sync for properties, views, child page rows, and property_values.
 */
export function useDatabase(databasePageId: string | null) {
  const [state, setState] = useState<DatabaseState>({
    databaseId: null,
    properties: [],
    views: [],
    rows: [],
    values: {},
    loading: true,
  });
  const channelRef = useRef<RealtimeChannel | null>(null);

  const loadAll = useCallback(async () => {
    if (!databasePageId) return;
    setState((s) => ({ ...s, loading: true }));
    const { data: db } = await supabase
      .from("databases")
      .select("id")
      .eq("page_id", databasePageId)
      .maybeSingle();
    if (!db) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    const dbId = db.id as string;
    const [{ data: props }, { data: views }, { data: rows }] = await Promise.all([
      supabase.from("database_properties").select("*").eq("database_id", dbId).order("sort_order"),
      supabase.from("database_views").select("*").eq("database_id", dbId).order("sort_order"),
      supabase
        .from("pages")
        .select("*")
        .eq("parent_id", databasePageId)
        .eq("is_archived", false)
        .order("sort_order"),
    ]);
    const rowIds = (rows ?? []).map((r) => r.id);
    let valuesByPage: Record<string, Record<string, unknown>> = {};
    if (rowIds.length > 0) {
      const { data: values } = await supabase
        .from("property_values")
        .select("*")
        .in("page_id", rowIds);
      for (const v of (values ?? []) as PropertyValueRow[]) {
        valuesByPage[v.page_id] = valuesByPage[v.page_id] ?? {};
        valuesByPage[v.page_id][v.property_id] = v.value;
      }
    }
    setState({
      databaseId: dbId,
      properties: ((props ?? []) as unknown) as DatabaseProperty[],
      views: ((views ?? []) as unknown) as DatabaseView[],
      rows: (rows ?? []) as Page[],
      values: valuesByPage,
      loading: false,
    });
  }, [databasePageId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!databasePageId) return;
    const ch = supabase
      .channel(`db:${databasePageId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "database_properties" },
        () => void loadAll()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "database_views" },
        () => void loadAll()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "property_values" },
        () => void loadAll()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pages", filter: `parent_id=eq.${databasePageId}` },
        () => void loadAll()
      )
      .subscribe();
    channelRef.current = ch;
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [databasePageId, loadAll]);

  // Optimistic value setter
  const setValue = useCallback(
    async (pageId: string, propertyId: string, value: unknown) => {
      setState((s) => ({
        ...s,
        values: {
          ...s.values,
          [pageId]: { ...(s.values[pageId] ?? {}), [propertyId]: value },
        },
      }));
      await supabase
        .from("property_values")
        .upsert({ page_id: pageId, property_id: propertyId, value: value as never });
    },
    []
  );

  const updateView = useCallback(async (viewId: string, patch: Partial<DatabaseView> | { config: ViewConfig }) => {
    await supabase.from("database_views").update(patch as never).eq("id", viewId);
  }, []);

  return { ...state, reload: loadAll, setValue, updateView };
}
