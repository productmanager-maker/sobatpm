import type { DatabaseProperty, FilterRule, SortRule } from "@/lib/database-types";
import type { Page } from "@/lib/types";

type Values = Record<string, Record<string, unknown>>;

function getValue(row: Page, prop: DatabaseProperty, values: Values): unknown {
  if (prop.is_primary) return row.title;
  if (prop.type === "created_time") return row.created_at;
  if (prop.type === "created_by") return row.created_by;
  return values[row.id]?.[prop.id];
}

export function applyFilter(
  rows: Page[],
  filters: FilterRule[],
  properties: DatabaseProperty[],
  values: Values
): Page[] {
  if (!filters || filters.length === 0) return rows;
  return rows.filter((row) =>
    filters.every((f) => {
      const prop = properties.find((p) => p.id === f.property_id);
      if (!prop) return true;
      const v = getValue(row, prop, values);
      const fv = f.value;
      switch (f.operator) {
        case "is_empty":
          return v == null || v === "" || (Array.isArray(v) && v.length === 0);
        case "is_not_empty":
          return !(v == null || v === "" || (Array.isArray(v) && v.length === 0));
        case "contains":
          return typeof v === "string" && v.toLowerCase().includes(String(fv ?? "").toLowerCase());
        case "not_contains":
          return typeof v === "string" && !v.toLowerCase().includes(String(fv ?? "").toLowerCase());
        case "is":
          if (Array.isArray(v)) return v.includes(fv as string);
          return v === fv;
        case "is_not":
          if (Array.isArray(v)) return !v.includes(fv as string);
          return v !== fv;
        case "eq":
          return Number(v) === Number(fv);
        case "neq":
          return Number(v) !== Number(fv);
        case "gt":
          return Number(v) > Number(fv);
        case "lt":
          return Number(v) < Number(fv);
        case "gte":
          return Number(v) >= Number(fv);
        case "lte":
          return Number(v) <= Number(fv);
        case "is_checked":
          return v === true;
        case "is_unchecked":
          return v !== true;
        case "date_is":
          return v && fv && new Date(v as string).toDateString() === new Date(fv as string).toDateString();
        case "date_before":
          return v && fv && new Date(v as string) < new Date(fv as string);
        case "date_after":
          return v && fv && new Date(v as string) > new Date(fv as string);
        default:
          return true;
      }
    })
  );
}

export function applySort(
  rows: Page[],
  sorts: SortRule[],
  properties: DatabaseProperty[],
  values: Values
): Page[] {
  if (!sorts || sorts.length === 0) return rows;
  const arr = [...rows];
  arr.sort((a, b) => {
    for (const s of sorts) {
      const prop = properties.find((p) => p.id === s.property_id);
      if (!prop) continue;
      const av = getValue(a, prop, values);
      const bv = getValue(b, prop, values);
      let cmp = 0;
      if (av == null && bv == null) cmp = 0;
      else if (av == null) cmp = 1;
      else if (bv == null) cmp = -1;
      else if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      if (cmp !== 0) return s.direction === "desc" ? -cmp : cmp;
    }
    return 0;
  });
  return arr;
}

export function groupBy(
  rows: Page[],
  property: DatabaseProperty | undefined,
  values: Values
): Array<{ key: string; label: string; rows: Page[] }> {
  if (!property) return [{ key: "__all", label: "All", rows }];
  const map = new Map<string, Page[]>();
  for (const row of rows) {
    const v = getValue(row, property, values);
    const keys = Array.isArray(v) ? (v.length ? (v as string[]) : ["__none"]) : [v ? String(v) : "__none"];
    for (const k of keys) {
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(row);
    }
  }
  const result: Array<{ key: string; label: string; rows: Page[] }> = [];
  // Order by select option order if applicable
  if (property.type === "select" || property.type === "multi_select") {
    for (const opt of property.config.options ?? []) {
      if (map.has(opt.id)) {
        result.push({ key: opt.id, label: opt.label, rows: map.get(opt.id)! });
        map.delete(opt.id);
      }
    }
  }
  for (const [k, v] of map) {
    if (k === "__none") continue;
    result.push({ key: k, label: k, rows: v });
  }
  if (map.has("__none")) {
    result.push({ key: "__none", label: "No value", rows: map.get("__none")! });
  }
  return result;
}

export { getValue };
