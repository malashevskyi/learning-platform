import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware-client";
import {
  getBaseUrl,
  getCurrentLocale,
  getLocalizedPath,
  getSafeRedirect,
} from "@/app/api/utils/url";
import { isPublicRoute } from "./utils";
import { ROUTES } from "@/app/shared/constants/routes";

async function handleUnauthenticated(
  request: NextRequest,
  pathname: string
): Promise<NextResponse> {
  const currentLocale = getCurrentLocale(request);
  const baseUrl = getBaseUrl(request);

  const redirectUrl = new URL(
    getLocalizedPath(ROUTES.UNAUTHENTICATED_REDIRECT, currentLocale),
    baseUrl
  );

  redirectUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(redirectUrl);
}

export async function withAuth(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const pathname = getSafeRedirect(request.nextUrl.pathname);

  // Password reset page should be publicly accessible
  // The page itself will handle the authentication flow
  if (pathname === ROUTES.PASSWORD_RESET) {
    return response;
  }

  // Auth callback should be publicly accessible
  if (pathname === ROUTES.AUTH_CALLBACK) {
    return response;
  }

  // Skip if just redirected from callback
  const referer = request.headers.get("referer") || "";
  if (referer.includes(ROUTES.AUTH_CALLBACK)) {
    return response;
  }

  const supabase = createMiddlewareClient(request, response);
  const isPublic = isPublicRoute(pathname);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not authenticated - redirect to login if accessing protected route
  if (!user && !isPublic) {
    return handleUnauthenticated(request, pathname);
  }

  return response;
}
