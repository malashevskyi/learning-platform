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
  AUTH_CALLBACK: "/api/auth/callback",
  PASSWORD_RESET: "/password-reset",
  DEFAULT_AUTH_REDIRECT: "/learn", // ROUTES.LEARN
  UNAUTHENTICATED_REDIRECT: "/login", // ROUTES.LOGIN
  AUTH_SIGN_OUT: "/api/auth/sign-out",
  UPDATE_PASSWORD: "/update-password",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.PASSWORD_RESET,
  ROUTES.UPDATE_PASSWORD,
] as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
