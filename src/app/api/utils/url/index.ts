import { NextRequest, NextResponse } from "next/server";
import queryString from "query-string";
import { logger } from "../logger";
import { i18n, isLocale, Locale } from "@/i18n/request";

export const getCurrentLocale = (request: NextRequest): Locale => {
  if (isLocale(request.nextUrl.locale)) {
    return request.nextUrl.locale;
  }

  // is not empty but not a valid locale
  if (request.nextUrl.locale) {
    logger.warn("Unsupported locale detected", {
      locale: request.nextUrl.locale,
      fallback: i18n.defaultLocale,
    });
  }

  return i18n.defaultLocale;
};

export const getLocalizedPath = (path: string, locale: Locale) => {
  if (locale === i18n.defaultLocale) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  return `/${locale}/${path.replace(/^\/+/, "")}`;
};

/**
 * Gets the base URL accounting for proxies in production
 * @param request - The incoming request object
 * @returns The base URL (e.g., "https://example.com")
 */
export function getBaseUrl(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (process.env.NODE_ENV === "production" && forwardedHost) {
    const protocol = forwardedProto || "https";
    // Clean host header (remove any protocol prefix)
    const cleanHost = forwardedHost.replace(/^https?:\/\//, "");
    return `${protocol}://${cleanHost}`;
  }

  return new URL(request.url).origin;
}

/**
 * Validates and sanitizes redirect paths to prevent open redirects
 * @param next - The redirect path from query params
 * @returns A safe redirect path (always relative)
 */
export function getSafeRedirect(
  next: string | null,
  fallback?: string
): string {
  if (!next && fallback) return getSafeRedirect(fallback);

  // Default to home if no redirect specified
  if (!next) return "/";

  // Block absolute URLs
  if (next.startsWith("http://") || next.startsWith("https://")) {
    return "/";
  }

  // Block protocol-relative URLs (//example.com)
  if (next.startsWith("//")) {
    return "/";
  }

  // Block backslash paths (Windows-style SSRF attempts)
  if (next.includes("\\")) {
    return "/";
  }

  // Ensure path starts with /
  const safePath = next.startsWith("/") ? next : `/${next}`;

  // Additional validation: ensure no double slashes after normalization
  if (safePath.startsWith("//")) {
    return "/";
  }

  const pathParts = safePath.split("/").filter(Boolean);
  if (isLocale(pathParts[0])) {
    return "/" + pathParts.slice(1).join("/");
  }

  return safePath;
}

/**
 * Configuration for error redirects
 */
interface RedirectWithErrorOptions {
  locale: Locale;
  baseUrl: string;
  redirectPath: string;
  message: string;
  code?: string | null;
  errorType?: string | null;
  /** Additional context for logging (won't be shown to user) */
  context?: Record<string, unknown>;
}

/**
 * Creates a redirect response with error parameters
 * @param options - Configuration for the error redirect
 * @returns NextResponse redirect with error query params
 */
export function redirectWithError(
  options: RedirectWithErrorOptions
): NextResponse {
  const { locale, baseUrl, redirectPath, message, code, errorType, context } =
    options;

  logger.error("Auth redirect with error", {
    message,
    code,
    errorType,
    redirectPath,
    ...context,
  });

  const url = queryString.stringifyUrl(
    {
      url: new URL(getLocalizedPath(redirectPath, locale), baseUrl).toString(),
      query: {
        error: message,
        code,
        type: errorType,
      },
    },
    { skipNull: true, skipEmptyString: true }
  );

  return NextResponse.redirect(url);
}
