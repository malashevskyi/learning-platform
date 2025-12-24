import { AuthError } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { handleError } from "../error-utils";
import { mapSupabaseAuthError } from "../mapSupabaseAuthError";

/**
 * Hook for handling errors in components with automatic translation.
 *
 * This hook provides a clean API for handling errors that need to be displayed
 * in the UI. It automatically:
 * - Translates Supabase auth errors using mapSupabaseAuthError
 * - Logs all errors to Sentry/console via handleError
 * - Returns user-friendly translated messages
 *
 * @param namespace - Translation namespace (default: "auth")
 * @returns Object with methods to handle and translate errors
 *
 * @example
 * ```tsx
 *     try {
 *       const { error } = await supabase.auth.signIn(values);
 *       if (error) {
 *         setErrorMessage(getErrorMessage(error));
 *         return;
 *       }
 *     } catch (err) {
 *       setErrorMessage(getErrorMessage(err));
 *     }
 *
 *   return <div>{errorMessage && <ErrorBanner message={errorMessage} />}</div>;
 * }
 * ```
 */
export function useError(namespace: string) {
  const t = useTranslations(namespace);

  /**
   * Get a translated error message for display in the UI.
   * Automatically logs the error to Sentry/console.
   *
   * @param error - The error to process
   * @param context - Optional context for logging
   * @returns Translated error message suitable for display
   */
  const getErrorMessage = (
    error: unknown,
    context?: Record<string, unknown>
  ): string => {
    // Always log the error (without toast)
    handleError({
      error,
      context,
      showToast: false,
    });

    // Check if it's a Supabase AuthError
    if (error instanceof AuthError) {
      const authError = error as AuthError;
      const translationKey = mapSupabaseAuthError(authError);
      return t(translationKey);
    }

    return t("errors.generic");
  };

  return {
    /**
     * Get translated error message for UI display.
     * Automatically logs the error.
     */
    getErrorMessage,
  };
}
