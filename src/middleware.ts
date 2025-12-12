import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { i18n } from "@/i18n/request";

const intlMiddleware = createIntlMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
});

const PUBLIC_ROUTES = ["/", "/login", "/register"];

function getPathnameWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/[^\/]+/, "") || "/";
}

function getLocaleFromPathname(pathname: string): string {
  return pathname.split("/")[1];
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

function mergeResponses(
  baseResponse: NextResponse,
  targetResponse: NextResponse
): void {
  baseResponse.cookies.getAll().forEach((cookie) => {
    targetResponse.cookies.set(cookie.name, cookie.value);
  });
}

async function createSupabaseClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

async function handleUnauthenticated(
  request: NextRequest,
  intlResponse: NextResponse,
  pathname: string
): Promise<NextResponse> {
  const locale = getLocaleFromPathname(request.nextUrl.pathname);
  const redirectUrl = new URL(`/${locale}/login`, request.url);
  redirectUrl.searchParams.set("redirect", pathname);

  const response = NextResponse.redirect(redirectUrl);
  mergeResponses(intlResponse, response);

  return response;
}

async function handleIncompleteProfile(
  request: NextRequest,
  intlResponse: NextResponse
): Promise<NextResponse> {
  const locale = getLocaleFromPathname(request.nextUrl.pathname);
  const redirectUrl = new URL(`/${locale}/onboarding`, request.url);

  const response = NextResponse.redirect(redirectUrl);
  mergeResponses(intlResponse, response);

  return response;
}

async function handleCompleteProfile(
  request: NextRequest,
  intlResponse: NextResponse
): Promise<NextResponse> {
  const locale = getLocaleFromPathname(request.nextUrl.pathname);
  const redirectUrl = new URL(`/${locale}/learn`, request.url);

  const response = NextResponse.redirect(redirectUrl);
  mergeResponses(intlResponse, response);

  return response;
}

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const supabase = await createSupabaseClient(request, intlResponse);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = getPathnameWithoutLocale(request.nextUrl.pathname);
  const isPublic = isPublicRoute(pathname);

  // Rule 1: Unauthenticated users can only access public routes
  if (!user && !isPublic) {
    return handleUnauthenticated(request, intlResponse, pathname);
  }

  // Rule 2: Authenticated users need profile check
  if (user && !isPublic) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const isProfileComplete = Boolean(profile?.full_name);

    // Rule 2a: Incomplete profile -> onboarding
    if (!isProfileComplete && pathname !== "/onboarding") {
      return handleIncompleteProfile(request, intlResponse);
    }

    // Rule 2b: Complete profile -> dashboard (if on auth pages)
    if (isProfileComplete && (isPublic || pathname === "/onboarding")) {
      return handleCompleteProfile(request, intlResponse);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
