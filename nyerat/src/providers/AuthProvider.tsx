import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Profile } from "@/lib/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setProfile, setLoading, reset } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        if (error) console.warn("loadProfile error:", error.message);
        if (mounted) setProfile((data as Profile) ?? null);
      } catch (e) {
        console.warn("loadProfile threw:", e);
        if (mounted) setProfile(null);
      }
    };

    let sub: { subscription: { unsubscribe: () => void } } | null = null;
    try {
      const res = supabase.auth.onAuthStateChange((_event, session) => {
        try {
          setAuth({ user: session?.user ?? null, session });
          if (session?.user) {
            setTimeout(() => void loadProfile(session.user.id), 0);
          } else {
            setProfile(null);
          }
        } catch (e) {
          console.error("onAuthStateChange handler error:", e);
        }
      });
      sub = res.data;
    } catch (e) {
      console.error("Failed to subscribe to auth state:", e);
    }

    supabase.auth.refreshSession().then(({ data: { session } }) => {
      if (session && mounted) {
        setAuth({ user: session.user, session });
      }
    }).catch((e) => console.warn("refreshSession failed:", e));

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setAuth({ user: session?.user ?? null, session });
        if (session?.user) {
          loadProfile(session.user.id).finally(() => setLoading(false));
        } else {
          reset();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error("getSession failed:", e);
        reset();
        setLoading(false);
      });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []); // eslint-disable-line

  return <>{children}</>;
}
