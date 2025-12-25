import { handleError } from "@/lib/error-utils";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface UseUpdatePasswordResult {
  isUpdating: boolean;
  updateSuccess: boolean;
  updateError: string | null;
  updatePassword: (password: string) => void;
  reset: () => void;
}

/**
 * Hook to handle password update via API endpoint.
 * Uses TanStack Query for declarative mutation management.
 */
export const useUpdatePassword = (): UseUpdatePasswordResult => {
  const t = useTranslations("auth.errors");

  const mutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("update_password_failed"));
      }

      return response;
    },
  });

  useEffect(() => {
    handleError({ error: mutation.error, showToast: false });
  }, [mutation.error]);

  return {
    isUpdating: mutation.isPending,
    updateSuccess: mutation.isSuccess,
    updateError: null,
    updatePassword: mutation.mutate,
    reset: mutation.reset,
  };
};
