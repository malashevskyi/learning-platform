import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  if (!hasLocale) return notFound();

  const t = await getTranslations({
    locale: lang,
    namespace: "common.meta",
  });

  return <div>Home Page - {t("title")}</div>;
}
