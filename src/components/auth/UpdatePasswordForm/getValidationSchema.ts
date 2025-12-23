import { VALIDATION } from "@/app/shared/constants/ui";
import * as Yup from "yup";

interface SchemaTranslations {
  errors: {
    required: string;
    passwordShort: string;
  };
}

export const getValidationSchema = ({
  errors: { required, passwordShort },
}: SchemaTranslations) =>
  Yup.object({
    password: Yup.string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, passwordShort)
      .required(required),
  });
