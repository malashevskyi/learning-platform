import { NextRequest, NextResponse } from "next/server";
import {
  getBaseUrl,
  getCurrentLocale,
  getLocalizedPath,
} from "@/app/api/utils/url";
import { ROUTES } from "@/app/shared/constants/routes";
import { parseAuthCallback } from "@/app/api/utils/auth/auth-parser";

/**
 * Middleware to detect password reset error params on any page
 * and redirect to the password reset page.
 *
 * When Supabase redirects with expired/invalid token errors,
 * it adds error params to the redirect_to URL. This middleware
 * catches those and redirects to the proper password reset page.
 */
export async function withPasswordResetErrorRedirect(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { pathname, hash } = request.nextUrl;
  const { error, errorCode, errorDescription } = parseAuthCallback(request);

  // Skip if already on password reset page
  if (pathname.includes(ROUTES.PASSWORD_RESET)) {
    return response;
  }

  // TODO: consider do we need to redirect the user to the password reset page
  // If so, we should include the error params in the redirect, now we delete them
  // on client side once we detect that there is an error
  // we need either to not delete them or save to cookies or allow user to go to other pages
  return response;

  // Check if this is a password reset related error
  const isPasswordResetError =
    error === "access_denied" &&
    (errorCode === "otp_expired" ||
      errorDescription?.toLowerCase().includes("expired") ||
      errorDescription?.toLowerCase().includes("invalid"));

  if (isPasswordResetError) {
    const currentLocale = getCurrentLocale(request);
    const baseUrl = getBaseUrl(request);

    const redirectUrl = new URL(
      getLocalizedPath(ROUTES.PASSWORD_RESET, currentLocale),
      baseUrl
    );

    // Forward the error params to the password reset page
    // redirectUrl.searchParams.set("error", error);
    // if (errorCode) {
    //   redirectUrl.searchParams.set("error_code", errorCode);
    // }
    // if (errorDescription) {
    //   redirectUrl.searchParams.set("error_description", errorDescription);
    // }

    // Also preserve any hash fragment
    if (hash) {
      redirectUrl.hash = hash;
    }

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
