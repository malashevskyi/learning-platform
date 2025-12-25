import { parseAuthCallback } from "@/app/api/utils/auth/auth-parser";
import { getRequestMetadata } from "@/app/api/utils/auth/request-context";
import { getLocalizedPath } from "@/app/api/utils/url";
import { COOKIE_NAMES } from "@/app/shared/constants/auth";
import { ROUTES } from "@/app/shared/constants/routes";
import { createMiddlewareClient } from "@/lib/supabase/middleware-client";
import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to restrict navigation during password recovery.
 * Users can only access password-reset, login, and auth-callback routes.
 */
export async function withPasswordRecoveryRestriction(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { baseUrl, locale, pathname } = getRequestMetadata(request);
  const { code, error, errorCode } = parseAuthCallback(request);

  // Check if user has an active recovery session
  const hasRecoveryCookie = request.cookies.has(COOKIE_NAMES.PASSWORD_RECOVERY);
  const isPasswordResetPage = pathname === ROUTES.PASSWORD_RESET;

  if (
    (isPasswordResetPage && !!code) ||
    (error === "access_denied" && errorCode === "otp_expired")
  ) {
    // We believe the email reset link was clicked
    // Let the user through to see the form or the error message
    if (!hasRecoveryCookie) {
      // set recovery cookie to allow user stay on the reset password page after the page reload
      response.cookies.set(COOKIE_NAMES.PASSWORD_RECOVERY, "true", {
        maxAge: 3600, // 1 hour
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return response;
  }

  if (isPasswordResetPage && !hasRecoveryCookie) {
    const homeUrl = new URL(getLocalizedPath(ROUTES.HOME, locale), baseUrl);
    return NextResponse.redirect(homeUrl);
  }

  if (hasRecoveryCookie && !isPasswordResetPage) {
    response.cookies.delete(COOKIE_NAMES.PASSWORD_RECOVERY);

    const supabase = createMiddlewareClient(request, response);
    await supabase.auth.signOut();

    return response;
  }

  return response;
}
