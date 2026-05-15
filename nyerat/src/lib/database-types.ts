export type PropertyType =
  | "text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "checkbox"
  | "url"
  | "email"
  | "person"
  | "created_time"
  | "created_by";

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  text: "Text",
  number: "Number",
  select: "Select",
  multi_select: "Multi-select",
  date: "Date",
  checkbox: "Checkbox",
  url: "URL",
  email: "Email",
  person: "Person",
  created_time: "Created time",
  created_by: "Created by",
};

export const SELECT_COLORS = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
] as const;
export type SelectColor = (typeof SELECT_COLORS)[number];

export const SELECT_COLOR_CLASSES: Record<SelectColor, string> = {
  gray: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100",
  red: "bg-red-200 text-red-900 dark:bg-red-900/60 dark:text-red-100",
  orange: "bg-orange-200 text-orange-900 dark:bg-orange-900/60 dark:text-orange-100",
  yellow: "bg-yellow-200 text-yellow-900 dark:bg-yellow-900/60 dark:text-yellow-100",
  green: "bg-green-200 text-green-900 dark:bg-green-900/60 dark:text-green-100",
  blue: "bg-blue-200 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100",
  purple: "bg-purple-200 text-purple-900 dark:bg-purple-900/60 dark:text-purple-100",
  pink: "bg-pink-200 text-pink-900 dark:bg-pink-900/60 dark:text-pink-100",
};

export interface SelectOption {
  id: string;
  label: string;
  color: SelectColor;
}

export interface PropertyConfig {
  options?: SelectOption[];
  numberFormat?: "number" | "currency_idr" | "currency_usd" | "percent";
  width?: number;
  hidden?: boolean;
  includeTime?: boolean;
}

export interface DatabaseProperty {
  id: string;
  database_id: string;
  name: string;
  type: PropertyType;
  config: PropertyConfig;
  sort_order: number;
  is_primary: boolean;
}

export type ViewType = "table" | "kanban" | "calendar" | "gallery";

export interface FilterRule {
  id: string;
  property_id: string;
  operator: string;
  value: unknown;
}

export interface SortRule {
  id: string;
  property_id: string;
  direction: "asc" | "desc";
}

export interface ViewConfig {
  filters?: FilterRule[];
  sorts?: SortRule[];
  groupBy?: string | null;
  visibleProps?: string[];
  cardCoverProp?: string | null;
  dateProp?: string | null;
  columnOrder?: string[];
}

export interface DatabaseView {
  id: string;
  database_id: string;
  name: string;
  type: ViewType;
  config: ViewConfig;
  sort_order: number;
}

export interface DatabaseRecord {
  id: string;
  page_id: string;
}

export interface PropertyValueRow {
  page_id: string;
  property_id: string;
  value: unknown;
}
