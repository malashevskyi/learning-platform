import { supabaseClient } from "@/lib/supabase/client";
import { useAuthModalStore } from "@/store/auth-modal-store";
import { useTranslations } from "next-intl";

export const useEmailResend = () => {
  const t = useTranslations("auth");
  const email = useAuthModalStore((state) => state.registeredEmail);

  return async () => {
    if (!email) {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (session?.user?.email) {
        throw new Error(t("errors.account_already_verified"));
      }
      throw new Error(t("errors.no_email_for_resend"));
    }

    const { error } = await supabaseClient.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) throw error;
  };
};
