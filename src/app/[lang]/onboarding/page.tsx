"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  OnboardingForm,
  OnboardingFormValues,
} from "@/components/onboarding/OnboardingForm";
import { ROUTES } from "@/app/shared/constants/routes";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { useProfile, useUpdateProfile } from "@/lib/hooks/profile/useProfile";
import { useRedirectStore } from "@/store/redirect-store";
import { useEffect } from "react";
import { i18n } from "@/i18n/config";
import { getSafeRedirect } from "@/app/api/utils/url";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, isLoading: isFetching } = useProfile();
  const { isUpdating, updateSuccess, updateError, updateProfile } =
    useUpdateProfile();
  const pendingRedirect = useRedirectStore((state) => state.pendingRedirect);
  const setPendingRedirect = useRedirectStore(
    (state) => state.setPendingRedirect
  );
  const clearPendingRedirect = useRedirectStore(
    (state) => state.clearPendingRedirect
  );

  // Store redirect from URL query param to store
  useEffect(() => {
    const nextParam = searchParams.get("next");
    if (nextParam && !pendingRedirect) {
      const safeRedirect = getSafeRedirect(
        nextParam,
        ROUTES.DEFAULT_AUTH_REDIRECT
      );
      setPendingRedirect(safeRedirect);
    }
  }, [searchParams, pendingRedirect, setPendingRedirect]);

  useEffect(() => {
    if (updateSuccess) {
      const redirectUrl = pendingRedirect || ROUTES.DEFAULT_AUTH_REDIRECT;
      clearPendingRedirect();
      router.push(redirectUrl);
    }
  }, [updateSuccess, pendingRedirect, clearPendingRedirect, router]);

  const handleSubmit = (values: OnboardingFormValues) => {
    updateProfile(values);
  };

  if (isFetching) {
    return <FullScreenLoader />;
  }

  const initialValues: OnboardingFormValues = {
    full_name: profile?.full_name || "",
    native_language: profile?.native_language || i18n.defaultLocale,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <OnboardingForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          formError={updateError}
        />
      </div>
    </div>
  );
}
