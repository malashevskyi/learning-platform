import { NextRequest } from "next/server";
import { getBaseUrl, getCurrentLocale, getSafeRedirect } from "../url";

export function getRequestMetadata(request: NextRequest) {
  return {
    locale: getCurrentLocale(request),
    baseUrl: getBaseUrl(request),
    pathname: getSafeRedirect(request.nextUrl.pathname),
    referer: request.headers.get("referer") || null,
  };
}
