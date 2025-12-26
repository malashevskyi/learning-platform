import React, { useState } from "react";
import { useTranslations } from "next-intl";
import GoogleButton from "react-google-button";
import { supabaseClient } from "@/lib/supabase/client";
import { handleError } from "@/lib/error-utils";
import { API_ROUTES } from "@/app/shared/constants/routes";
import { getBaseUrl } from "@/lib/utils";

export interface GoogleAuthProps {
  label?: string;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ label }) => {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);

  const onGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${getBaseUrl()}${API_ROUTES.AUTH.CALLBACK}`,
        },
      });
    } catch (error) {
      handleError({
        error,
        clientMessage:
          !label || label.includes("login")
            ? "errors.google_login_failed"
            : "errors.google_signup_failed",
      });
      setIsLoading(false);
    }
  };

  return (
    <GoogleButton
      label={label || t("login_google")}
      onClick={onGoogleSignIn}
      disabled={isLoading}
    />
  );
};
