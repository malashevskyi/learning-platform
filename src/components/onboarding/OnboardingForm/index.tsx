"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/Button";
import { FullNameInput } from "@/components/input/FullNameInput";
import { getValidationSchema } from "./getValidationSchema";
import { InlineError } from "@/components/ui/InlineError";
import { i18n, Locale } from "@/i18n/config";
import { LanguageSelector } from "@/components/common/LanguageSelector";

export interface OnboardingFormValues {
  full_name: string;
  native_language: Locale;
}

interface OnboardingFormProps {
  initialValues?: OnboardingFormValues;
  onSubmit: (values: OnboardingFormValues) => void | Promise<void>;
  isLoading?: boolean;
  formError?: string;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  initialValues = {
    full_name: "",
    native_language: i18n.defaultLocale,
  },
  onSubmit,
  isLoading = false,
  formError,
}) => {
  const t = useTranslations("onboarding");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(t)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched, dirty }) => (
        <Form className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-4 w-full">
            <FullNameInput
              id="full-name"
              name="full_name"
              value={values.full_name}
              onChange={(e) => setFieldValue("full_name", e.target.value)}
              onBlur={() => setFieldTouched("full_name", true)}
              error={errors.full_name}
              touched={touched.full_name}
              disabled={isLoading}
            />

            <LanguageSelector
              id="native-language"
              value={values.native_language}
              onChange={(value) => {
                setFieldValue("native_language", value);
                setFieldTouched("native_language", true);
              }}
              disabled={isLoading}
            />
          </div>

          {formError && <InlineError message={formError} />}

          <Button
            id="save-profile"
            type="submit"
            variant="default"
            disabled={!dirty || isLoading}
            className="w-full"
          >
            {isLoading ? t("saving") : t("save")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
