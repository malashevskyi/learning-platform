import React from "react";
import { useTranslations } from "next-intl";
import { Mail, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useResendCooldown } from "@/lib/hooks/auth/useResendCooldown";

export interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResendEmail?: () => Promise<void>;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onResendEmail,
}) => {
  const t = useTranslations("auth");

  const { resendState, cooldown, handleResend } = useResendCooldown();

  const onResendClick = async () => {
    if (!onResendEmail) return;
    await handleResend(onResendEmail);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-verification-title"
      >
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 mx-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-8 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

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
            {t("email_verification_required")}
          </h2>

          {/* Message */}
          <p className="text-center break-words text-muted-foreground mb-2">
            {t.rich("email_verification_message", {
              email,
              highlight: (children: React.ReactNode) => (
                <span className="font-medium text-primary">{children}</span>
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
            {onResendEmail && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onResendClick}
                disabled={
                  resendState === "loading" || resendState === "success"
                }
              >
                {resendState === "loading"
                  ? t("sending")
                  : cooldown
                  ? t("resend_cooldown", { seconds: cooldown })
                  : t("email_verification_resend")}
              </Button>
            )}

            <Button variant="default" className="w-full" onClick={onClose}>
              {t("email_verification_close")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

EmailVerificationModal.displayName = "EmailVerificationModal";
