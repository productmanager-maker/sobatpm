export type ThemeMode = "light" | "dark" | "system";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  preferred_theme: ThemeMode;
  onboarding_completed: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon: string;
  owner_id: string;
}

export type PageType = "page" | "database" | "whiteboard" | "kanban";

export interface Page {
  id: string;
  workspace_id: string;
  parent_id: string | null;
  notebook_id: string | null;
  title: string;
  icon: string | null;
  cover_url: string | null;
  cover_position: number | null;
  content: { text?: string } | Record<string, unknown>;
  type: PageType;
  is_archived: boolean;
  is_pinned: boolean;
  sort_order: number;
  created_by: string | null;
  updated_by: string | null;
  reminder_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notebook {
  id: string;
  workspace_id: string;
  parent_id: string | null;
  name: string;
  icon: string | null;
  sort_order: number;
}

export const TAG_COLORS = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
] as const;
export type TagColor = (typeof TAG_COLORS)[number];

export const TAG_COLOR_HEX: Record<TagColor, string> = {
  gray: "#9ca3af",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
  blue: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  brown: "#92400e",
};

export interface Tag {
  id: string;
  workspace_id: string;
  name: string;
  color: string | null;
}
