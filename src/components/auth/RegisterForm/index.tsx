import React from "react";
import { useFormik } from "formik";

import { useTranslations } from "next-intl";
import { UserPlus } from "lucide-react";
import { getValidationSchema } from "./getValidationSchema";
import { PasswordInput } from "@/components/input/PasswordInput";
import { EmailInput } from "@/components/input/EmailInput";
import { Button } from "@/components/ui/Button";
import { GoogleAuth } from "../GoogleAuth";
import InlineError from "@/components/ui/InlineError";
import Link from "next/link";
import { ROUTES } from "@/app/shared/constants/routes";

export interface RegisterFormValues {
  email: string;
  password: "";
  confirmPassword: "";
}

export interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isLoading?: boolean;
  formError?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  formError = null,
}) => {
  const t = useTranslations("auth");

  const validationSchema = getValidationSchema({
    errors: {
      emailInvalid: t("errors.email_invalid"),
      required: t("errors.required"),
      passwordShort: t("errors.password_short"),
      passwordMatch: t("errors.password_match"),
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      onSubmit(values as RegisterFormValues);
    },
  });

  const isSubmitDisabled = isLoading || !formik.isValid || !formik.dirty;

  return (
    <div className="w-full flex flex-col gap-6">
      <InlineError message={formError} />
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-4"
      >
        <EmailInput
          id="email"
          {...formik.getFieldProps("email")}
          error={formik.errors.email}
          touched={formik.touched.email}
        />

        <PasswordInput
          id="password"
          {...formik.getFieldProps("password")}
          error={formik.errors.password}
          touched={formik.touched.password}
        />

        <PasswordInput
          id="confirmPassword"
          label={t("confirm_password_label")}
          confirmPassword
          {...formik.getFieldProps("confirmPassword")}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        />

        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full mt-2"
          disabled={isSubmitDisabled}
          loading={isLoading}
          icon={<UserPlus />}
          onClick={() => formik.submitForm()}
        >
          {t("sign_up")}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-bold">
            {t("or")}
          </span>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <GoogleAuth label={t("register_google")} />
      </div>

      <div className="flex items-center justify-center gap-2 text-base mt-2">
        <span className="text-muted-foreground font-base">
          {t("already_have_account")}
        </span>
        <Button asChild variant="navigation">
          <Link href={ROUTES.LOGIN}>{t("sign_in")}</Link>
        </Button>
      </div>
    </div>
  );
};
