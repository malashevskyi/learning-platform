"use client";

import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isInitializing } = useAuth();
  useProfile();

  if (isInitializing) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};
