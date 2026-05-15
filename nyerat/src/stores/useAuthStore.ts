import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  setAuth: (s: { user: User | null; session: Session | null }) => void;
  setProfile: (p: Profile | null) => void;
  setLoading: (b: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  setAuth: ({ user, session }) => set({ user, session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, session: null, profile: null }),
}));
