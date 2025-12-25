import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AUTH_QUERY_PARAMS, COOKIE_NAMES } from "@/app/shared/constants/auth";
import { VALIDATION } from "@/app/shared/constants/ui";
import { ROUTES } from "@/app/shared/constants/routes";
import { logger } from "../../utils/logger";
import { redirectWithError } from "../../utils/url";
import { getRequestMetadata } from "../../utils/auth/request-context";
import ensureError from "ensure-error";
import { z } from "zod";

export const UpdatePasswordSchema = z.object({
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, "errors.password_short"),
});

export async function POST(request: NextRequest) {
  const { baseUrl, locale } = getRequestMetadata(request);

  try {
    const body = await request.json();
    const parsedBody = UpdatePasswordSchema.safeParse(body);

    const validationErrors = parsedBody.error?.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    if (!parsedBody.success) {
      return redirectWithError({
        locale,
        baseUrl,
        redirectPath: ROUTES.PASSWORD_RESET,
        message:
          JSON.stringify(validationErrors, null, 2) ||
          "Password update attempt without password",
        errorType: "validation_error",
      });
    }

    const { password } = parsedBody.data;

    const supabase = await createClient();

    // Check if user has active session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return redirectWithError({
        locale,
        baseUrl,
        redirectPath: ROUTES.LOGIN,
        message:
          sessionError?.message || "No active session for password update",
        errorType: "session_error",
      });
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      return redirectWithError({
        locale,
        baseUrl,
        redirectPath: ROUTES.PASSWORD_RESET,
        message: updateError.message || "Password update failed",
        errorType: "password_update_error",
        code: updateError.code,
        responseType: "json",
      });
    }

    logger.info("Password updated successfully", {
      userId: session.user.id,
    });

    // Sign out user
    await supabase.auth.signOut();

    const redirectUrl = new URL(baseUrl);
    redirectUrl.pathname = `/${locale}${ROUTES.LOGIN}`;
    redirectUrl.searchParams.set(AUTH_QUERY_PARAMS.PASSWORD_UPDATED, "true");

    const response = NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });

    response.cookies.delete(COOKIE_NAMES.PASSWORD_RECOVERY);

    return response;
  } catch (error) {
    return redirectWithError({
      locale,
      baseUrl,
      redirectPath: ROUTES.PASSWORD_RESET,
      message:
        ensureError(error).message || "Unexpected error during password update",
      errorType: "unexpected_error",
    });
  }
}
