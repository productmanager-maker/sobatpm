import { create } from "zustand";
import type { Workspace } from "@/lib/types";

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setWorkspaces: (w: Workspace[]) => void;
  setActiveWorkspace: (w: Workspace | null) => void;
  addWorkspace: (w: Workspace) => void;
  updateWorkspace: (w: Workspace) => void;
  removeWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  activeWorkspace: null,
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),
  addWorkspace: (w) => set((s) => ({ workspaces: [...s.workspaces, w] })),
  updateWorkspace: (w) =>
    set((s) => ({
      workspaces: s.workspaces.map((x) => (x.id === w.id ? w : x)),
      activeWorkspace: s.activeWorkspace?.id === w.id ? w : s.activeWorkspace,
    })),
  removeWorkspace: (id) =>
    set((s) => ({
      workspaces: s.workspaces.filter((x) => x.id !== id),
      activeWorkspace: s.activeWorkspace?.id === id ? null : s.activeWorkspace,
    })),
}));
