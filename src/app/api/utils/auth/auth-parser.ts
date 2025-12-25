import { AUTH_QUERY_PARAMS, AuthType } from "@/app/shared/constants/auth";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { getSafeRedirect } from "../url";
import { ROUTES } from "@/app/shared/constants/routes";

interface AuthCallbackMetadata {
  code: string | null;
  errorCode: string | null;
  type: AuthType | null;
  next: string;
  error: string | null;
  errorDescription: string | null;
  recovery: string | null;
}

export function parseAuthCallback(request: NextRequest): AuthCallbackMetadata {
  const { searchParams } = new URL(request.url);

  return {
    code: searchParams.get(AUTH_QUERY_PARAMS.CODE),
    errorCode: searchParams.get(AUTH_QUERY_PARAMS.ERROR_CODE),
    type: searchParams.get(AUTH_QUERY_PARAMS.TYPE) as AuthType | null,
    next: getSafeRedirect(
      searchParams.get(AUTH_QUERY_PARAMS.NEXT),
      ROUTES.DEFAULT_AUTH_REDIRECT
    ),
    error: searchParams.get(AUTH_QUERY_PARAMS.ERROR),
    errorDescription: searchParams.get(AUTH_QUERY_PARAMS.ERROR_DESCRIPTION),
    recovery: searchParams.get(AUTH_QUERY_PARAMS.RECOVERY) || null,
  };
}
