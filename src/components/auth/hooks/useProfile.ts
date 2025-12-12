import { useEffect } from "react";
import useSWR from "swr";
import { supabaseClient } from "@/lib/supabase/client";
import { useUserStore, type UserProfile } from "@/app/store/user-store";

export function useProfile() {
  const user = useUserStore((state) => state.user);
  const setProfile = useUserStore((state) => state.setProfile);

  const {
    data: fetchedProfile,
    error: profileError,
    mutate,
  } = useSWR(
    user?.id ? `profile-${user.id}` : null,
    async () => {
      const { data, error } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          const { data: newProfile, error: createError } = await supabaseClient
            .from("user_profiles")
            .insert([{ id: user!.id }])
            .select()
            .single();

          if (createError) throw createError;
          return newProfile as UserProfile;
        }
        throw error;
      }

      return data as UserProfile;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  useEffect(() => {
    if (fetchedProfile) {
      setProfile(fetchedProfile);
    }
  }, [fetchedProfile, setProfile]);

  useEffect(() => {
    if (profileError) {
      console.error("[useProfile] Profile error:", profileError);
    }
  }, [profileError]);

  return { profile: fetchedProfile, error: profileError, mutate };
}
