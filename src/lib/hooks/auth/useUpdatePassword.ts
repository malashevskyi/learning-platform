import { API_ERROR_CODES } from "@/app/shared/constants/errors";
import { FEATURES } from "@/app/shared/constants/features";
import { authService, AuthServiceError } from "@/lib/api/services/auth.service";
import type { UpdatePasswordResponse } from "@/lib/api/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

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

  const mutation = useMutation<
    UpdatePasswordResponse,
    AuthServiceError,
    string
  >({
    mutationFn: authService.updatePassword,
    meta: {
      feature: FEATURES.AUTH.PASSWORD_UPDATE,
    },
  });

  /**
   * Get user-friendly error message based on error code
   */
  const getClientErrorMessage = (): string | null => {
    if (!mutation.error) return null;

    // Handle specific error codes
    if (mutation.error.code === API_ERROR_CODES.AUTH.SAME_PASSWORD) {
      return t("password_same_as_old");
    }

    // Generic password update failure
    return t("update_password_failed");
  };

  return {
    isUpdating: mutation.isPending,
    updateSuccess: mutation.isSuccess,
    updateError: getClientErrorMessage(),
    updatePassword: mutation.mutate,
    reset: mutation.reset,
  };
};
