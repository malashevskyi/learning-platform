import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@/app/shared/constants/routes";
import {
  getBaseUrl,
  getCurrentLocale,
  getLocalizedPath,
  getSafeRedirect,
} from "@/app/api/utils/url";
import { invalidateProfileCache } from "./utils";

export async function withSignOut(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const pathname = getSafeRedirect(request.nextUrl.pathname);

  if (pathname.includes(ROUTES.AUTH_SIGN_OUT)) {
    const currentLocale = getCurrentLocale(request);
    const baseUrl = getBaseUrl(request);

    // Create the redirect response to the Home page
    const redirectUrl = new URL(
      getLocalizedPath(ROUTES.HOME, currentLocale),
      baseUrl
    );

    const signOutResponse = NextResponse.redirect(redirectUrl);

    invalidateProfileCache(signOutResponse);

    return signOutResponse;
  }

  return response;
}
