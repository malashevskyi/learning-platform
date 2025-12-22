import React from "react";
import { useTranslations } from "next-intl";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useResendCooldown } from "@/lib/hooks/auth/useResendCooldown";
import { useAuthModalStore } from "@/store/auth-modal-store";
import SimpleModal from "@/components/ui/SimpleModal";
import { useEmailResend } from "@/lib/hooks/auth/useEmailResend";

export type EmailVerificationVariant =
  | "new-registration" // User just registered successfully
  | "existing-unverified" // User tries to register with existing unverified email
  | "login-unverified"; // User tries to login with unverified email

export interface EmailVerificationModalProps {
  onClose: () => void;
  onResendEmail?: () => Promise<void>;
}

const VARIANT_CONFIG: Record<
  EmailVerificationVariant,
  { titleKey: string; messageKey: string }
> = {
  "new-registration": {
    titleKey: "errors.email_verification_required",
    messageKey: "email_verification_message",
  },
  "existing-unverified": {
    titleKey: "account_exists_verify_email_title",
    messageKey: "account_exists_verify_email_message",
  },
  "login-unverified": {
    titleKey: "login_verify_email_title",
    messageKey: "login_verify_email_message",
  },
};

export const EmailVerificationModal: React.FC = () => {
  const t = useTranslations("auth");
  const variant = useAuthModalStore((state) => state.verificationVariant);
  const activeModal = useAuthModalStore((state) => state.activeModal);
  const email = useAuthModalStore((state) => state.registeredEmail);
  const closeAllModals = useAuthModalStore((state) => state.closeAllModals);
  const resendEmail = useEmailResend();

  const { resendState, cooldown, handleResend } = useResendCooldown({
    onResend: resendEmail,
  });

  const config = VARIANT_CONFIG[variant];

  return (
    <SimpleModal
      isOpen={activeModal === "verification"}
      onClose={closeAllModals}
      titleId="email-verification-title"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h2
        id="email-verification-title"
        className="text-2xl font-bold text-center mb-3"
      >
        {t(config.titleKey)}
      </h2>

      {/* Message */}
      <p className="text-center break-words text-muted-foreground mb-2">
        {t.rich(config.messageKey, {
          email,
          highlight: (children: React.ReactNode) => (
            <span className="font-semibold text-primary">{children}</span>
          ),
        })}
      </p>

      {/* Spam notice */}
      <p className="text-center text-sm text-muted-foreground mb-6">
        {t("email_verification_spam_notice")}
      </p>

      {/* Resend status messages */}
      {resendState === "success" && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md mb-4 animate-in slide-in-from-top-1">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            {t("email_verification_resend_success")}
          </p>
        </div>
      )}

      {resendState === "error" && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md mb-4 animate-in slide-in-from-top-1">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            {t("email_verification_resend_error")}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => void handleResend()}
          loading={resendState === "loading"}
          disabled={
            resendState === "success" || (cooldown !== null && cooldown > 0)
          }
        >
          {cooldown
            ? t("resend_cooldown", { seconds: cooldown })
            : t("email_verification_resend")}
        </Button>
      </div>
    </SimpleModal>
  );
};

EmailVerificationModal.displayName = "EmailVerificationModal";
