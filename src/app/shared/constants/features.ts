export const FEATURES = {
  AUTH: {
    LOGIN: "auth-login",
    REGISTER: "auth-register",
    PASSWORD_UPDATE: "auth-password-update",
    PASSWORD_RESET_REQUEST: "auth-password-reset-request",
  },
  USER: {
    PROFILE_GET: "user-profile-get",
    PROFILE_UPDATE: "user-profile-update",
  },
  UNKNOWN_FEATURE: "unknown-feature",
} as const;

export type FeatureName =
  | (typeof FEATURES.AUTH)[keyof typeof FEATURES.AUTH]
  | (typeof FEATURES.USER)[keyof typeof FEATURES.USER];
