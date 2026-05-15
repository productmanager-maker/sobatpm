import { create } from "zustand";
import type { ThemeMode } from "@/lib/types";
import type { AIAction } from "@/lib/ai";

export type RightPanelTab = "props" | "comments" | "history" | "ai";

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelTab: RightPanelTab;
  pendingAIAction: AIAction | null;
  commandPaletteOpen: boolean;
  theme: ThemeMode;
  setSidebarOpen: (b: boolean) => void;
  toggleSidebar: () => void;
  setRightPanelOpen: (b: boolean) => void;
  setRightPanelTab: (t: RightPanelTab) => void;
  openAI: (action?: AIAction) => void;
  consumePendingAIAction: () => AIAction | null;
  setCommandPaletteOpen: (b: boolean) => void;
  setTheme: (t: ThemeMode) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  rightPanelOpen: false,
  rightPanelTab: "props",
  pendingAIAction: null,
  commandPaletteOpen: false,
  theme: "system",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setRightPanelOpen: (rightPanelOpen) => set({ rightPanelOpen }),
  setRightPanelTab: (rightPanelTab) => set({ rightPanelTab }),
  openAI: (action) =>
    set({ rightPanelOpen: true, rightPanelTab: "ai", pendingAIAction: action ?? null }),
  consumePendingAIAction: () => {
    const a = get().pendingAIAction;
    if (a) set({ pendingAIAction: null });
    return a;
  },
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setTheme: (theme) => set({ theme }),
}));
