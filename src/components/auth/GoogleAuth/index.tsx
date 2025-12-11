import { useTranslations } from "next-intl";
import GoogleButton from "react-google-button";

export interface GoogleAuthProps {
  label?: string;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ label }) => {
  const t = useTranslations("auth");

  const onGoogleSignIn = () => {
    // TODO: Implement Google Sign-In logic here
  };

  return (
    <GoogleButton label={label || t("login_google")} onClick={onGoogleSignIn} />
  );
};
