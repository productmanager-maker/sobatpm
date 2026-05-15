import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Expert {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatarUrl?: string | null;
}

interface AuthStore {
  expert: Expert | null;
  setExpert: (expert: Expert | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      expert: null,
      setExpert: (expert) => set({ expert }),
      clear: () => set({ expert: null }),
    }),
    { name: "expert-auth" }
  )
);
