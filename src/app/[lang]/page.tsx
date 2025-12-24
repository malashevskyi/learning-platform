import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/app/shared/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  if (!hasLocale) return notFound();

  const t = await getTranslations({
    locale: lang,
    namespace: "home",
  });

  const tAuth = await getTranslations({
    locale: lang,
    namespace: "auth",
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">{t("title")}</h1>

        {!user ? (
          <div className="bg-white p-8 rounded-lg shadow">
            <p className="text-lg text-slate-600 mb-6">{t("auth_prompt")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default" className="w-full sm:w-auto">
                <Link href={ROUTES.LOGIN}>{tAuth("login")}</Link>
              </Button>

              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={ROUTES.REGISTER}>{tAuth("sign_up")}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow">
            <p className="text-lg text-slate-600 mb-6">
              Welcome back! You&apos;re logged in.
            </p>
            <Button asChild variant="default">
              <Link href={ROUTES.LEARN}>Go to Learn</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
