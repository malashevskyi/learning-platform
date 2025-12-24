"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import PasswordExpiredNotification from "@/components/auth/PasswordExpiredNotification";
import { handleError } from "@/lib/error-utils";

type Status = "loading" | "ready" | "expired" | "error";

export default function PasswordResetPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function verifyResetToken() {
      // 1. Check for URL errors first (fastest check)
      const urlError = searchParams.get("error");
      if (urlError) {
        if (!cancelled) {
          handleError({ error: urlError });
          setStatus("expired");
          setErrorMessage(
            searchParams.get("error_description") ||
              t("password_reset_link_expired_description")
          );
        }
        return;
      }

      // 2. Check for existing session (user already authenticated)
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (cancelled) return;

      if (session) {
        setStatus("ready");
        return;
      }

      // 3. Extract token from hash or query string
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const token = hashParams.get("access_token") || searchParams.get("token");
      const type = hashParams.get("type") || searchParams.get("type");

      if (!token || type !== "recovery") {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(t("password_reset_no_token"));
        }
        return;
      }

      // 4. Authenticate with token
      try {
        const { error } = hashParams.get("access_token")
          ? await supabaseClient.auth.setSession({
              access_token: hashParams.get("access_token")!,
              refresh_token: hashParams.get("refresh_token") || "",
            })
          : await supabaseClient.auth.verifyOtp({
              token_hash: token,
              type: "recovery",
            });

        if (cancelled) return;

        if (error) {
          handleError({ error });
          setStatus("expired");
          setErrorMessage(t("password_reset_link_expired_description"));
          return;
        }

        setStatus("ready");
        window.history.replaceState(null, "", window.location.pathname);
      } catch (error) {
        if (cancelled) return;
        handleError({ error });
        setStatus("error");
        setErrorMessage(t("errors.generic"));
      }
    }

    verifyResetToken();

    return () => {
      cancelled = true;
    };
  }, [searchParams, t]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md bg-card rounded-[20px] border border-border shadow-md p-8">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t("processing_password_reset")}
            </p>
          </div>
        )}

        {status === "ready" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {t("update_password_title")}
              </h1>
              <p className="text-muted-foreground">
                {t("update_password_description")}
              </p>
            </div>
            <UpdatePasswordForm />
          </div>
        )}

        {(status === "expired" || status === "error") && (
          <PasswordExpiredNotification errorDescription={errorMessage} />
        )}
      </div>
    </div>
  );
}
