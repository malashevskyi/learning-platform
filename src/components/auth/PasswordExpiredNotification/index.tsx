"use client";

import { ROUTES } from "@/app/shared/constants/routes";
import { EmailInput } from "@/components/input/EmailInput";
import { Button } from "@/components/ui/Button";
import { useForgotPassword } from "@/lib/hooks/auth/useForgotPassword";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { getValidationSchema } from "./getValidationSchema";

interface PasswordExpiredNotificationProps {
  errorDescription?: string;
  email?: string;
}

export const PasswordExpiredNotification: React.FC<
  PasswordExpiredNotificationProps
> = ({ errorDescription, email: propEmail }) => {
  const t = useTranslations("auth");
  const { isSending, resetSent, resetError, sendPasswordResetEmail } =
    useForgotPassword();

  const validationSchema = getValidationSchema({
    errors: {
      emailInvalid: t("errors.email_invalid"),
      required: t("errors.required"),
    },
  });

  const formik = useFormik({
    initialValues: {
      email: propEmail || "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await sendPasswordResetEmail(values.email);
    },
  });

  const isSubmitDisabled =
    isSending || !formik.isValid || (!propEmail && !formik.dirty);

  if (resetSent) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="text-primary">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {t("password_reset_email_sent_title")}
          </h2>
          <p className="text-muted-foreground">
            {t("password_reset_email_sent_description")}
          </p>
        </div>
        <Button asChild variant="default" className="w-full">
          <Link href={ROUTES.LOGIN} replace>
            {t("back_to_login")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="text-destructive">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t("password_reset_link_expired_title")}
        </h2>
        <p className="text-muted-foreground">
          {errorDescription || t("password_reset_link_expired_description")}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="w-full space-y-3">
        {!propEmail && (
          <EmailInput
            id="email"
            {...formik.getFieldProps("email")}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
        )}

        {resetError && (
          <div className="text-sm text-destructive">{resetError}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitDisabled}
          loading={isSending}
          className="w-full"
        >
          {t("request_new_password_reset_link")}
        </Button>

        <Button asChild variant="navigation">
          <Link href={ROUTES.LOGIN} replace>
            {t("back_to_login")}
          </Link>
        </Button>
      </form>
    </div>
  );
};

export default PasswordExpiredNotification;
