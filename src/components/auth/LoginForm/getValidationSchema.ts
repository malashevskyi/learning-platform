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
    password: Yup.string().min(6, passwordShort).required(required),
  });
