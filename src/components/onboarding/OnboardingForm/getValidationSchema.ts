import * as Yup from "yup";
import { i18n } from "@/i18n/config";
import { VALIDATION } from "@/app/shared/constants/ui";

export const getValidationSchema = (t: (key: string) => string) =>
  Yup.object({
    full_name: Yup.string()
      .required(t("errors.required"))
      .min(VALIDATION.FULL_NAME_MIN_LENGTH, t("errors.full_name_too_short")),
    native_language: Yup.string()
      .oneOf([...i18n.locales], t("errors.invalid_language"))
      .required(t("errors.required")),
  });
