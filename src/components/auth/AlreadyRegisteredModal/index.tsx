"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SimpleModal from "@/components/ui/SimpleModal";
import Link from "next/link";
import { useAuthModalStore } from "@/store/auth-modal-store";
import { ROUTES } from "@/app/shared/constants/routes";
import { supabaseClient } from "@/lib/supabase/client";
import { handleError } from "@/lib/error-utils";
import { InlineError } from "@/components/ui/InlineError";
import { useForgotPassword } from "@/lib/hooks/auth/useForgotPassword";

/**
 * AlreadyRegisteredModal Component
 *
 * Shown when a user tries to register with an email that already has
 * a verified account.
 */
export const AlreadyRegisteredModal: React.FC = () => {
  const t = useTranslations("auth");
  const activeModal = useAuthModalStore((state) => state.activeModal);
  const registeredEmail = useAuthModalStore((state) => state.registeredEmail);
  const closeAllModals = useAuthModalStore((state) => state.closeAllModals);

  const {
    isSending: isSendingReset,
    resetSent,
    resetError,
    sendPasswordResetEmail,
  } = useForgotPassword();

  const handleForgotPassword = async () => {
    if (!registeredEmail) return;
    await sendPasswordResetEmail(registeredEmail);
  };

  const handleSignInWithGoogle = async () => {
    try {
      await supabaseClient.auth.signInWithOAuth({ provider: "google" });
    } catch (error) {
      handleError({
        error,
        clientMessage: "errors.oauth_provider_error",
        showToast: false,
      });
    }
  };

  return (
    <SimpleModal
      isOpen={activeModal === "alreadyRegistered"}
      onClose={closeAllModals}
      titleId="already-registered-title"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-amber-600" />
        </div>
      </div>

      {/* Title */}
      <h2
        id="already-registered-title"
        className="text-2xl font-bold text-center mb-3"
      >
        {t("account_already_exists_title")}
      </h2>

      {/* Message */}
      <p className="text-center text-muted-foreground mb-6">
        {t.rich("account_already_exists_message", {
          email: registeredEmail,
          highlight: (children: React.ReactNode) => (
            <span className="font-semibold text-primary">{children}</span>
          ),
        })}
      </p>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        {!resetSent ? (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={handleForgotPassword}
              className="w-full"
              loading={isSendingReset}
            >
              {t("forgot_password")}
            </Button>

            <Button
              variant="default"
              size="lg"
              onClick={handleSignInWithGoogle}
              className="w-full"
            >
              {t("login_google")}
            </Button>
          </>
        ) : (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-center">
            {t("password_reset_email_sent")}
          </div>
        )}

        {resetError && <InlineError message={resetError} />}

        <Button variant="navigation" size="lg" asChild>
          <Link href={ROUTES.LOGIN}>{t("go_to_login")}</Link>
        </Button>
      </div>
    </SimpleModal>
  );
};
