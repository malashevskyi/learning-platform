import * as Yup from "yup";

interface SchemaTranslations {
  errors: {
    emailInvalid: string;
    required: string;
  };
}

export const getValidationSchema = ({
  errors: { emailInvalid, required },
}: SchemaTranslations) =>
  Yup.object({
    email: Yup.string().email(emailInvalid).required(required),
  });
