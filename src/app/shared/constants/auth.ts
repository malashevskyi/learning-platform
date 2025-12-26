export const COOKIE_NAMES = {
  PROFILE_COMPLETE: "profile_complete",
  NEXT_LOCALE: "NEXT_LOCALE",
  PASSWORD_RECOVERY: "password_recovery_active",
  AUTH_CALLBACK_PROCESSING: "auth_callback_processing",
} as const;

export const COOKIE_SETTINGS = {
  PASSWORD_RECOVERY_MAX_AGE: 3600, // 1 hour
};

export const AUTH_QUERY_PARAMS = {
  TYPE: "type",
  CODE: "code",
  NEXT: "next",
  ERROR: "error",
  ERROR_CODE: "error_code",
  ERROR_DESCRIPTION: "error_description",
  RECOVERY: "recovery",
  PASSWORD_UPDATED: "password_updated",
} as const;

export const AUTH_TYPES = {
  RECOVERY: "recovery",
} as const;

export type AuthType = (typeof AUTH_TYPES)[keyof typeof AUTH_TYPES];
