import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase/client";
import { useUserStore } from "@/app/store/user-store";
import { handleError } from "@/lib/error-utils";

export function useAuth() {
  const setUser = useUserStore((state) => state.setUser);
  const setProfile = useUserStore((state) => state.setProfile);

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        if (mounted && session?.user) {
          setUser(session.user);
        }
      } catch (err) {
        handleError({
          error: err,
          message: "Failed to initialize authentication",
        });
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    void initAuth();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        console.log("[Auth Event]:", event);

        switch (event) {
          case "SIGNED_IN":
          case "USER_UPDATED":
          case "TOKEN_REFRESHED":
            if (session?.user) {
              setUser(session.user);
            }
            break;

          case "SIGNED_OUT":
            setUser(null);
            setProfile(null);
            // with page reload to reset state
            window.location.href = "/login";
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setProfile]);

  return { isInitializing };
}
