import * as Yup from "yup";

export interface RegisterSchemaTranslations {
  errors: {
    emailInvalid: string;
    required: string;
    passwordShort: string;
    passwordMatch: string;
  };
}

export const getValidationSchema = ({
  errors: { emailInvalid, required, passwordShort, passwordMatch },
}: RegisterSchemaTranslations) =>
  Yup.object({
    email: Yup.string().email(emailInvalid).required(required),
    password: Yup.string().min(6, passwordShort).required(required),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], passwordMatch)
      .required(required),
  });
