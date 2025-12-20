import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import {
  getBaseUrl,
  getCurrentLocale,
  getLocalizedPath,
  getSafeRedirect,
  redirectWithError,
} from "../../utils/url";

const DEFAULT_AUTH_REDIRECT = "/learn";
const ONBOARDING_PATH = "/onboarding";
const ERROR_REDIRECT_PATH = "/login";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currentLocale = getCurrentLocale(request);
  const baseUrl = getBaseUrl(request);

  const error = searchParams.get("error");

  if (error) {
    return redirectWithError({
      locale: currentLocale,
      baseUrl,
      redirectPath: ERROR_REDIRECT_PATH,
      message:
        searchParams.get("error_description") || "Could not authenticate user",
      code: searchParams.get("error_code"),
      errorType: error,
    });
  }

  const code = searchParams.get("code");

  const next = getSafeRedirect(searchParams.get("next"), DEFAULT_AUTH_REDIRECT);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectWithError({
        locale: currentLocale,
        baseUrl,
        redirectPath: ERROR_REDIRECT_PATH,
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
      locale: currentLocale,
    });

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      logger.warn("Failed to fetch user profile", {
        userId: data.user.id,
        error: profileError.message,
      });
    }

    const isProfileComplete = Boolean(profile?.full_name);
    const redirectPath = isProfileComplete ? next : ONBOARDING_PATH;

    const redirectUrl = new URL(baseUrl);
    redirectUrl.pathname = getLocalizedPath(redirectPath, currentLocale);

    return NextResponse.redirect(redirectUrl);
  }

  return redirectWithError({
    locale: currentLocale,
    baseUrl,
    redirectPath: ERROR_REDIRECT_PATH,
    message: "Could not authenticate user",
  });
}
