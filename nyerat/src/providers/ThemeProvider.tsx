import { useEffect } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/integrations/supabase/client";
import type { ThemeMode } from "@/lib/types";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (profile?.preferred_theme && profile.preferred_theme !== theme) {
      setTheme(profile.preferred_theme);
    }
  }, [profile?.preferred_theme]); // eslint-disable-line

  useEffect(() => {
    applyTheme(theme);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  // persist on change
  useEffect(() => {
    if (!user || !profile) return;
    if (profile.preferred_theme === theme) return;
    void supabase
      .from("profiles")
      .update({ preferred_theme: theme })
      .eq("id", user.id);
  }, [theme, user, profile]);

  return <>{children}</>;
}
