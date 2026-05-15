import { create } from "zustand";
import type { Page } from "@/lib/types";

interface PageState {
  pages: Record<string, Page>;
  activePageId: string | null;
  recentPageIds: string[];
  setPages: (pages: Page[]) => void;
  upsertPage: (page: Page) => void;
  removePage: (id: string) => void;
  setActivePage: (id: string | null) => void;
  pushRecent: (id: string) => void;
}

export const usePageStore = create<PageState>((set) => ({
  pages: {},
  activePageId: null,
  recentPageIds: [],
  setPages: (pages) =>
    set({ pages: Object.fromEntries(pages.map((p) => [p.id, p])) }),
  upsertPage: (page) =>
    set((s) => ({ pages: { ...s.pages, [page.id]: page } })),
  removePage: (id) =>
    set((s) => {
      const next = { ...s.pages };
      delete next[id];
      return { pages: next };
    }),
  setActivePage: (activePageId) => set({ activePageId }),
  pushRecent: (id) =>
    set((s) => ({
      recentPageIds: [id, ...s.recentPageIds.filter((x) => x !== id)].slice(0, 5),
    })),
}));
