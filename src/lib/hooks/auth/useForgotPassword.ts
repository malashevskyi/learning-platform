import { useState, useCallback } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { ROUTES } from "@/app/shared/constants/routes";
import { handleError } from "@/lib/error-utils";
import { useError } from "@/lib/hooks/useError";

interface UseForgotPasswordResult {
  isSending: boolean;
  resetSent: boolean;
  resetError: string | null;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetState: () => void;
}

/**
 * Hook to handle forgot password functionality.
 * Sends password reset email with correct redirectTo URL.
 */
export const useForgotPassword = (): UseForgotPasswordResult => {
  const [isSending, setIsSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getErrorMessage } = useError("auth");

  const sendPasswordResetEmail = useCallback(
    async (email: string) => {
      if (!email) return;

      try {
        setIsSending(true);
        setError(null);

        await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}${ROUTES.PASSWORD_RESET}`,
        });

        setResetSent(true);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage || "errors.password_reset_failed");
        handleError({
          error: err,
          clientMessage: "errors.password_reset_failed",
          showToast: false,
        });
      } finally {
        setIsSending(false);
      }
    },
    [getErrorMessage]
  );

  const resetState = useCallback(() => {
    setIsSending(false);
    setResetSent(false);
    setError(null);
  }, []);

  return {
    isSending,
    resetSent,
    resetError: error,
    sendPasswordResetEmail,
    resetState,
  };
};
