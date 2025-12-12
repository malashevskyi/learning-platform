import { create } from "zustand";
import { type User } from "@supabase/supabase-js";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
  full_name: string | null;
  native_language?: string;
  created_at: string;
}

interface UserState {
  user: User | null; // supabase user object
  profile: UserProfile | null; // user_profiles table
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setIsLoading: (isLoading) => set({ isLoading }),

      logout: () => set({ user: null, profile: null, isLoading: false }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);
