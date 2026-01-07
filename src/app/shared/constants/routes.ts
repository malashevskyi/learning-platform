export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Protected routes
  LEARN: "/learn",
  ONBOARDING: "/onboarding",
  PROFILE: "/profile",
  SETTINGS: "/settings",

  // Auth routes
  PASSWORD_RESET: "/password-reset",
  DEFAULT_AUTH_REDIRECT: "/learn", // ROUTES.LEARN
  UNAUTHENTICATED_REDIRECT: "/login", // ROUTES.LOGIN
  UPDATE_PASSWORD: "/update-password",
} as const;

export const API_ROUTES = {
  AUTH: {
    UPDATE_PASSWORD: "/api/auth/update-password",
    CALLBACK: "/api/auth/callback",
    SIGN_OUT: "/api/auth/sign-out",
  },
  PROFILE: "/api/profile",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.PASSWORD_RESET,
  ROUTES.UPDATE_PASSWORD,
] as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
