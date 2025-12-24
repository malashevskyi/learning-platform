import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { PUBLIC_ROUTES } from "@/app/shared/constants/routes";
import { getSafeRedirect } from "@/app/api/utils/url";
import { COOKIE_NAMES } from "@/app/shared/constants/auth";

export function isPublicRoute(
  pathname: string
): pathname is (typeof PUBLIC_ROUTES)[number] {
  const safePathname = getSafeRedirect(pathname);

  return (PUBLIC_ROUTES as readonly string[]).includes(safePathname);
}

// clear profile cache cookie after an account is deleted (not supported by now)
// TODO: implement account deletion flow
export function invalidateProfileCache(response: NextResponse) {
  response.cookies.delete(COOKIE_NAMES.PROFILE_COMPLETE);
}
