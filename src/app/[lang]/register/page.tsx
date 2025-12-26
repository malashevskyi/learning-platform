"use client";

import { API_ERROR_CODES } from "@/app/shared/constants/errors";
import { API_ROUTES } from "@/app/shared/constants/routes";
import { AlreadyRegisteredModal } from "@/components/auth/AlreadyRegisteredModal";
import { EmailVerificationModal } from "@/components/auth/EmailVerificationModal";
import {
  RegisterForm,
  RegisterFormValues,
} from "@/components/auth/RegisterForm";
import { usePathname, useRouter } from "@/i18n/navigation";
import { handleError } from "@/lib/error-utils";
import { useError } from "@/lib/hooks/useError";
import { supabaseClient } from "@/lib/supabase/client";
import { getBaseUrl } from "@/lib/utils";
import { useAuthModalStore } from "@/store/auth-modal-store";
import { useRedirectStore } from "@/store/redirect-store";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const { getErrorMessage } = useError("auth");
  const setPendingRedirect = useRedirectStore(
    (state) => state.setPendingRedirect
  );

  const showAlreadyRegisteredModal = useAuthModalStore(
    (state) => state.showAlreadyRegisteredModal
  );
  const showVerificationModal = useAuthModalStore(
    (state) => state.showVerificationModal
  );

  const pendingRedirect = useRedirectStore((state) => state.pendingRedirect);

  useEffect(() => {
    const redirectParam = searchParams.get("redirect");

    if (redirectParam) {
      setPendingRedirect(redirectParam);
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname, setPendingRedirect]);

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setRegisterError(null);
      setIsRegisterLoading(true);

      // STEP 1: Try to register
      const { error, data } = await supabaseClient.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${getBaseUrl()}${API_ROUTES.AUTH.CALLBACK}`,
          data: {
            email: values.email,
          },
        },
      });

      if (error) {
        setRegisterError(getErrorMessage(error));
        return;
      }

      // STEP 2: Check if NEW user or EXISTING user
      const isNewUser =
        data.user?.identities && data.user.identities.length > 0;
      console.log("🚀 ~ isNewUser identities:", isNewUser);

      if (isNewUser) {
        showVerificationModal(values.email, "new-registration");
        return;
      }

      // STEP 3: EXISTING user → check if verified by trying to login
      const { error: loginError } =
        await supabaseClient.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

      if (loginError) {
        if (
          loginError.message?.toLowerCase().includes("email not confirmed") ||
          loginError.code === API_ERROR_CODES.AUTH.EMAIL_NOT_CONFIRMED
        ) {
          handleError({
            error: loginError,
            clientMessage: "Email not confirmed",
          });
          // Email NOT verified → show verification modal
          showVerificationModal(values.email, "existing-unverified");
          return;
        } else if (
          loginError.message
            ?.toLowerCase()
            .includes("invalid login credentials")
        ) {
          handleError({
            error: loginError,
            clientMessage: "Invalid login credentials",
          });
          showAlreadyRegisteredModal(values.email);
          return;
        } else {
          handleError({
            error: loginError,
            clientMessage: "Other login error",
          });
          // Other error
          setRegisterError(getErrorMessage(loginError));
          return;
        }
      }

      if (pendingRedirect) router.push(pendingRedirect);
    } catch (err) {
      setRegisterError(getErrorMessage(err));
    } finally {
      setIsRegisterLoading(false);
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
            <h2 className="text-2xl font-semibold mb-4">
              {t("register_title")}
            </h2>

            <RegisterForm
              onSubmit={handleRegister}
              formError={registerError}
              isLoading={isRegisterLoading}
            />
          </div>
        </div>
      </div>

      <EmailVerificationModal />
      <AlreadyRegisteredModal />
    </>
  );
}
