"use client";

import { API_ERROR_CODES } from "@/app/shared/constants/errors";
import { ROUTES } from "@/app/shared/constants/routes";
import { EmailVerificationModal } from "@/components/auth/EmailVerificationModal";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";
import { usePathname, useRouter } from "@/i18n/navigation";
import { handleError } from "@/lib/error-utils";
import { useError } from "@/lib/hooks/useError";
import { supabaseClient } from "@/lib/supabase/client";
import { useAuthModalStore } from "@/store/auth-modal-store";
import { useRedirectStore } from "@/store/redirect-store";
import { AuthError } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const pendingRedirect = useRedirectStore((state) => state.pendingRedirect);
  const { getErrorMessage } = useError("auth");
  const setPendingRedirect = useRedirectStore(
    (state) => state.setPendingRedirect
  );
  const showVerificationModal = useAuthModalStore(
    (state) => state.showVerificationModal
  );

  useEffect(() => {
    const redirectParam = searchParams.get("redirect");

    if (redirectParam) {
      setPendingRedirect(redirectParam);
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname, setPendingRedirect]);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLoginError(null);
      setShowForgotPassword(false);
      setIsLoginLoading(true);

      const { error } = await supabaseClient.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // Check for email not verified
        if (
          error instanceof AuthError &&
          (error.code === API_ERROR_CODES.AUTH.EMAIL_NOT_CONFIRMED ||
            error.message?.toLowerCase().includes("email not confirmed"))
        ) {
          handleError({
            error,
            clientMessage: "Email not confirmed",
          });
          showVerificationModal(values.email, "login-unverified");
          return;
        }

        // Check for invalid credentials - show forgot password option
        if (
          error instanceof AuthError &&
          (error.code === API_ERROR_CODES.AUTH.INVALID_CREDENTIALS ||
            error.message?.toLowerCase().includes("invalid login credentials"))
        ) {
          setLoginError(getErrorMessage(error));
          setShowForgotPassword(true);
          return;
        }

        setLoginError(getErrorMessage(error));
        return;
      }

      if (pendingRedirect) {
        router.push(pendingRedirect);
      } else {
        router.push(ROUTES.LEARN);
      }
    } catch (err) {
      setLoginError(getErrorMessage(err));
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-lg">
            <h1 className="text-4xl font-bold mb-4">{t("hero_title")}</h1>
            <p className="text-lg text-opacity-90">{t("hero_subtitle")}</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow w-full">
            <h2 className="text-2xl font-semibold mb-4">{t("login_title")}</h2>

            <LoginForm
              onSubmit={handleLogin}
              formError={loginError}
              isLoading={isLoginLoading}
              showForgotPassword={showForgotPassword}
            />
          </div>
        </div>
      </div>

      <EmailVerificationModal />
    </>
  );
}
