/**
 * Maps Supabase Auth errors to translation keys for user-facing error messages.
 *
 * This function is specifically designed for Supabase authentication errors.
 * It uses the error's `code` property (the canonical field) to determine
 * the appropriate translation key.
 *
 * @param error - AuthError from Supabase auth operations
 * @returns Translation key (relative to 'auth' namespace) like "errors.invalid_credentials"
 *
 * @example
 * ```ts
 * const { error } = await supabase.auth.signIn({ email, password });
 * if (error) {
 *   const key = mapSupabaseAuthError(error);
 *   const message = t(key); // "errors.invalid_credentials" -> translated string
 * }
 * ```
 */
import { AuthError } from "@supabase/supabase-js";

/**
 * Known Supabase auth error codes mapped to translation keys.
 * Only includes codes that require specific user-facing messages.
 */
const AUTH_ERROR_MAP: Record<string, string> = {
  // Invalid credentials / authentication failures
  invalid_credentials: "errors.invalid_credentials",
  invalid_login_credentials: "errors.invalid_credentials",

  // Email confirmation required
  email_not_confirmed: "errors.email_not_confirmed",
  email_verification_required: "errors.email_verification_required",

  // OAuth/provider errors
  oauth_error: "errors.oauth_provider_error",
  provider_error: "errors.oauth_provider_error",

  // User already exists
  user_already_exists: "errors.user_already_exists",
  email_exists: "errors.user_already_exists",
  email_address_already_registered: "errors.email_already_registered",

  // Weak password
  weak_password: "errors.password_weak",

  // Rate limiting
  over_request_rate_limit: "errors.too_many_requests",
  too_many_requests: "errors.too_many_requests",
  // Email send rate limiting (too many verification / reset emails)
  over_email_send_rate_limit: "errors.over_email_send_rate_limit",
} as const;

export function mapSupabaseAuthError(error: AuthError): string {
  // Use the error code as the primary source of truth
  const errorCode = error.code?.toLowerCase();

  if (!errorCode) {
    return "errors.generic";
  }

  // Return mapped translation key or generic fallback
  return AUTH_ERROR_MAP[errorCode] ?? "errors.generic";
}
