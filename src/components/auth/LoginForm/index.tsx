import React from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { LogIn } from "lucide-react";
import { EmailInput } from "@/components/input/EmailInput";
import { PasswordInput } from "@/components/input/PasswordInput";
import { Button } from "@/components/ui/Button";
import { getValidationSchema } from "./getValidationSchema";
import { GoogleAuth } from "../GoogleAuth";

export interface LoginFormValues {
  email: string;
  password: "";
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  onSignUpClick: () => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSignUpClick,
  isLoading = false,
}) => {
  const t = useTranslations("auth");

  const validationSchema = getValidationSchema({
    errors: {
      emailInvalid: t("errors.email_invalid"),
      required: t("errors.required"),
      passwordShort: t("errors.password_short"),
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      onSubmit(values as LoginFormValues);
    },
  });

  const isSubmitDisabled = isLoading || !formik.isValid || !formik.dirty;

  return (
    <div className="w-full flex flex-col gap-6">
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

        <Button
          type="submit"
          variant="default"
          className="w-full mt-2"
          disabled={isSubmitDisabled}
          icon={<LogIn />}
        >
          {t("submit")}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("or")}
          </span>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <GoogleAuth label={t("login_google")} />
      </div>

      <div className="flex items-center justify-center gap-2 text-sm mt-2">
        <span className="text-muted-foreground text-base">
          {t("first_time")}
        </span>
        <Button variant="navigation" onClick={onSignUpClick}>
          {t("register_link")}
        </Button>
      </div>
    </div>
  );
};
