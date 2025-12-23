"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/input/PasswordInput";
import { supabaseClient } from "@/lib/supabase/client";
import { ROUTES } from "@/app/shared/constants/routes";
import { useError } from "@/lib/hooks/useError";
import { getValidationSchema } from "./getValidationSchema";
import Link from "next/link";

export interface UpdatePasswordFormProps {
  initialShowSuccess?: boolean;
}

export const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({
  initialShowSuccess = false,
}) => {
  const t = useTranslations("auth");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(initialShowSuccess);
  const { getErrorMessage } = useError("auth");

  const validationSchema = getValidationSchema({
    errors: {
      required: t("errors.required"),
      passwordShort: t("errors.password_short"),
    },
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const { error: updateError } = await supabaseClient.auth.updateUser({
          password: values.password,
        });

        if (updateError) throw updateError;

        // Sign out the user after password update
        await supabaseClient.auth.signOut();
        setShowSuccess(true);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
  });

  const isSubmitDisabled = loading || !formik.isValid || !formik.dirty;

  // Show success notification instead of modal
  if (showSuccess) {
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
            {t("password_updated_title")}
          </h2>
          <p className="text-muted-foreground">
            {t("password_updated_message")}
          </p>
        </div>
        <Button asChild variant="navigation">
          <Link href={ROUTES.LOGIN} replace>
            {t("go_to_login")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-3 w-full max-w-md mx-auto"
    >
      <PasswordInput
        id="password"
        {...formik.getFieldProps("password")}
        error={formik.errors.password}
        touched={formik.touched.password}
      />
      {error && <div className="text-sm text-destructive">{error}</div>}
      <Button type="submit" disabled={isSubmitDisabled} loading={loading}>
        {t("update_password_button")}
      </Button>
    </form>
  );
};

export default UpdatePasswordForm;
