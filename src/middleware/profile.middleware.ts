import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware-client";
import {
  getBaseUrl,
  getCurrentLocale,
  getLocalizedPath,
  getSafeRedirect,
} from "@/app/api/utils/url";
import { isPublicRoute } from "./utils";
import { COOKIE_NAMES } from "@/app/shared/constants/auth";
import { ROUTES } from "@/app/shared/constants/routes";

const CACHE_DURATION = 3600 * 24; // 1 day

async function handleCompleteProfile(
  request: NextRequest
): Promise<NextResponse> {
  const currentLocale = getCurrentLocale(request);
  const baseUrl = getBaseUrl(request);
  const redirectUrl = new URL(
    getLocalizedPath(ROUTES.DEFAULT_AUTH_REDIRECT, currentLocale),
    baseUrl
  );

  return NextResponse.redirect(redirectUrl);
}

async function handleIncompleteProfile(
  request: NextRequest
): Promise<NextResponse> {
  const currentLocale = getCurrentLocale(request);
  const baseUrl = getBaseUrl(request);
  const redirectUrl = new URL(
    getLocalizedPath(ROUTES.ONBOARDING, currentLocale),
    baseUrl
  );

  return NextResponse.redirect(redirectUrl);
}

export async function withProfileCheck(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const pathname = getSafeRedirect(request.nextUrl.pathname);

  const supabase = createMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // must not happen, handled in auth middleware
  if (!user) {
    return response;
  }

  const isPublic = isPublicRoute(pathname);
  const isOnboarding = pathname.startsWith(ROUTES.ONBOARDING);

  // Check cached profile completeness
  const cachedComplete = request.cookies.get(
    COOKIE_NAMES.PROFILE_COMPLETE
  )?.value;

  let isProfileComplete = cachedComplete === "true";

  if (!isProfileComplete) {
    const supabase = createMiddlewareClient(request, response);
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    isProfileComplete = Boolean(profile?.full_name);

    // Set cookie cache
    response.cookies.set(
      COOKIE_NAMES.PROFILE_COMPLETE,
      String(isProfileComplete),
      {
        maxAge: CACHE_DURATION,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      }
    );
  }

  if (!isProfileComplete && !isOnboarding) {
    return handleIncompleteProfile(request);
  }

  if (isProfileComplete && (isOnboarding || isPublic)) {
    return handleCompleteProfile(request);
  }

  return response;
}
