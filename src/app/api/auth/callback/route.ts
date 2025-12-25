import {
  AUTH_QUERY_PARAMS,
  COOKIE_NAMES,
  COOKIE_SETTINGS,
} from "@/app/shared/constants/auth";
import { ROUTES } from "@/app/shared/constants/routes";
import { Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { parseAuthCallback } from "../../utils/auth/auth-parser";
import { getRequestMetadata } from "../../utils/auth/request-context";
import { logger } from "../../utils/logger";
import { getLocalizedPath, redirectWithError } from "../../utils/url";

/**
 * Handle password recovery redirect with cookie
 */
function handlePasswordRecoveryRedirect(
  currentLocale: Locale,
  baseUrl: string
): NextResponse {
  const redirectUrl = new URL(
    getLocalizedPath(ROUTES.PASSWORD_RESET, currentLocale),
    baseUrl
  );

  const response = NextResponse.redirect(redirectUrl);

  // Set recovery cookie
  // TODO: we don't use it now as we redirect to  /password-reset, consider to redirect to /api/auth/callback?type=recovery
  response.cookies.set(COOKIE_NAMES.PASSWORD_RECOVERY, "true", {
    maxAge: COOKIE_SETTINGS.PASSWORD_RECOVERY_MAX_AGE,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

/**
 * Handle logged in redirect with cookie
 */
function handleLoggedInRedirect(
  currentLocale: Locale,
  baseUrl: string,
  redirectPath: string
): NextResponse {
  const redirectUrl = new URL(baseUrl);
  redirectUrl.pathname = getLocalizedPath(redirectPath, currentLocale);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(COOKIE_NAMES.AUTH_CALLBACK_PROCESSING, "true", {
    maxAge: 30,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}

export async function GET(request: NextRequest) {
  const { errorCode, code, recovery, next, error, errorDescription } =
    parseAuthCallback(request);
  const { referer, baseUrl, locale } = getRequestMetadata(request);

  if (error) {
    return redirectWithError({
      locale,
      baseUrl,
      redirectPath: ROUTES.UNAUTHENTICATED_REDIRECT,
      message: errorDescription || "Could not authenticate user",
      code: errorCode,
      errorType: error,
      context: {
        url: request.url,
        referer,
      },
    });
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectWithError({
        locale,
        baseUrl,
        redirectPath: ROUTES.UNAUTHENTICATED_REDIRECT,
        message: error.message || "Could not authenticate user",
        errorType: error.name,
        context: {
          errorStatus: error.status,
          codeLength: code.length,
        },
      });
    }

    logger.info("Auth callback successful", {
      userId: data.user.id,
      email: data.user.email,
      locale,
    });

    // Check if this is a password recovery session
    if (recovery === AUTH_QUERY_PARAMS.RECOVERY) {
      return handlePasswordRecoveryRedirect(locale, baseUrl);
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("id", data.user.id)
      .single();

    const isProfileComplete = Boolean(profile?.full_name);

    if (profileError) {
      logger.warn("Failed to fetch user profile", {
        userId: data.user.id,
        error: profileError.message,
      });
    }

    return handleLoggedInRedirect(
      locale,
      baseUrl,
      isProfileComplete ? next : ROUTES.ONBOARDING
    );
  }

  return redirectWithError({
    locale,
    baseUrl,
    errorType: "missing_code",
    redirectPath: ROUTES.UNAUTHENTICATED_REDIRECT,
    message: "Could not authenticate user",
  });
}
