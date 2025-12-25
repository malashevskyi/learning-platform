"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/input/PasswordInput";
import { ROUTES } from "@/app/shared/constants/routes";
import { getValidationSchema } from "./getValidationSchema";
import { useUpdatePassword } from "@/lib/hooks/auth/useUpdatePassword";
import Link from "next/link";

export interface UpdatePasswordFormProps {
  initialShowSuccess?: boolean;
}

export const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({
  initialShowSuccess = false,
}) => {
  const t = useTranslations("auth");
  const { isUpdating, updateSuccess, updateError, updatePassword } =
    useUpdatePassword();

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
      updatePassword(values.password);
    },
  });

  const isSubmitDisabled = isUpdating || !formik.isValid || !formik.dirty;

  // Show success notification
  if (updateSuccess || initialShowSuccess) {
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
    <>
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
        {updateError && (
          <div className="text-sm text-destructive">{updateError}</div>
        )}

        <Button type="submit" disabled={isSubmitDisabled} loading={isUpdating}>
          {t("update_password_button")}
        </Button>
      </form>
      <div className="flex flex-col items-center gap-2 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {t("remembered_password_label")}
        </span>
        <Button asChild variant="navigation">
          <Link href={ROUTES.LOGIN} replace>
            {t("go_to_login")}
          </Link>
        </Button>
      </div>
    </>
  );
};

export default UpdatePasswordForm;
