"use client";

import { ROUTES } from "@/app/shared/constants/routes";
import { Button } from "@/components/ui/Button";
import { SimpleModal } from "@/components/ui/SimpleModal";
import { handleError } from "@/lib/error-utils";
import { supabaseClient } from "@/lib/supabase/client";
import { useAuthModalStore } from "@/store/auth-modal-store";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export type MismatchProvider = "google" | "email";

const VARIANT_CONFIG: Record<
  MismatchProvider,
  { titleKey: string; messageKey: string; providerAuthKey?: string }
> = {
  google: {
    titleKey: "provider_mismatch_google_title",
    messageKey: "provider_mismatch_google_message",
    providerAuthKey: "login_google",
  },
  email: {
    titleKey: "provider_mismatch_email_title",
    messageKey: "provider_mismatch_email_message",
  },
};

/**
 * Shown when user tries to use the wrong authentication method
 */
export const ProviderMismatchModal: React.FC = ({}) => {
  const t = useTranslations("auth");
  const provider = useAuthModalStore((state) => state.providerMismatchType);
  const activeModal = useAuthModalStore((state) => state.activeModal);
  const closeAllModals = useAuthModalStore((state) => state.closeAllModals);

  const config = VARIANT_CONFIG[provider];

  const handleUseCorrectProvider = async () => {
    try {
      if (provider === "google") {
        await supabaseClient.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
      }
    } catch (error) {
      handleError({
        error,
        clientMessage: "errors.oauth_provider_error",
        showToast: false,
      });
    }
  };

  return (
    <>
      <SimpleModal
        isOpen={activeModal === "providerMismatch"}
        onClose={closeAllModals}
        titleId="provider-mismatch-title"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        {/* Title */}
        <h2
          id="provider-mismatch-title"
          className="text-2xl font-bold text-center mb-3"
        >
          {t(config.titleKey)}
        </h2>

        {/* Message */}
        <p className="text-center text-muted-foreground mb-6">
          {t.rich(config.messageKey, {
            heading: (children: React.ReactNode) => (
              <span className="font-semibold text-primary">{children}</span>
            ),
          })}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {config.providerAuthKey && (
            <Button
              variant="default"
              size="lg"
              onClick={handleUseCorrectProvider}
              className="w-full"
            >
              {t(config.providerAuthKey)}
            </Button>
          )}
          {!config.providerAuthKey && (
            <Button variant="navigation" asChild size="lg">
              <Link href={ROUTES.LOGIN}>{t("go_to_login")}</Link>
            </Button>
          )}
        </div>
      </SimpleModal>
    </>
  );
};
