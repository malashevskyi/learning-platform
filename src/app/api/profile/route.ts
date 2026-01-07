import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "../utils/logger";
import ensureError from "ensure-error";
import { z } from "zod";
import { COOKIE_NAMES } from "@/app/shared/constants/auth";
import { i18n } from "@/i18n/config";

const UpdateProfileSchema = z.object({
  full_name: z.string().min(1, "errors.required"),
  native_language: z.enum(i18n.locales),
});

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("full_name, native_language")
      .eq("id", user.id)
      .single();

    if (profileError) {
      logger.error("Failed to fetch user profile", {
        userId: user.id,
        error: profileError.message,
      });
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      full_name: profile?.full_name || "",
      native_language: profile?.native_language || i18n.defaultLocale,
    });
  } catch (error) {
    const err = ensureError(error);
    logger.error("Unexpected error fetching profile", {
      error: err.message,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          type: "auth_error",
          code: null,
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsedBody = UpdateProfileSchema.safeParse(body);

    if (!parsedBody.success) {
      const validationErrors = parsedBody.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          type: "validation_error",
          code: null,
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    const { full_name, native_language } = parsedBody.data;

    // Use upsert to create the profile row if it doesn't exist
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ id: user.id, full_name, native_language })
      .eq("id", user.id);

    if (updateError) {
      logger.error("Failed to upsert user profile", {
        userId: user.id,
        error: updateError.message,
      });

      const maybeCode =
        (updateError as { code?: string } | undefined)?.code ?? null;
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update profile",
          type: "update_error",
          code: maybeCode,
        },
        { status: 500 }
      );
    }

    logger.info("Profile updated successfully", {
      userId: user.id,
    });

    const response = NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });

    // Update profile completion cache (only after successful upsert)
    response.cookies.set(COOKIE_NAMES.PROFILE_COMPLETE, "true", {
      maxAge: 3600 * 24, // 1 day
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    const err = ensureError(error);
    logger.error("Unexpected error updating profile", {
      error: err.message,
    });

    return NextResponse.json(
      {
        success: false,
        message: err.message,
        type: "unexpected_error",
        code: null,
      },
      { status: 500 }
    );
  }
}
