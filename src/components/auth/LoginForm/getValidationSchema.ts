import { VALIDATION } from "@/app/shared/constants/ui";
import * as Yup from "yup";

interface SchemaTranslations {
  errors: {
    emailInvalid: string;
    required: string;
    passwordShort: string;
  };
}

export const getValidationSchema = ({
  errors: { emailInvalid, required, passwordShort },
}: SchemaTranslations) =>
  Yup.object({
    email: Yup.string().email(emailInvalid).required(required),
    password: Yup.string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, passwordShort)
      .required(required),
  });
