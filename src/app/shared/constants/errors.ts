export const API_ERROR_CODES = {
  AUTH: {
    SAME_PASSWORD: "same_password",
    INVALID_CREDENTIALS: "invalid_credentials",
    EMAIL_NOT_CONFIRMED: "email_not_confirmed",
  },
} as const;

export const API_ERROR_TYPES = {
  INTERNAL: "internal",
  VALIDATION: "validation",
  AUTH: "auth",
} as const;

export const INTERNAL_ERROR_CODES = {
  PARSE_ERROR: "parse_error",
  NETWORK_ERROR: "network_error",
  UNEXPECTED: "unexpected_error",
} as const;
