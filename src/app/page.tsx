import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { i18n } from "@/i18n/request";

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  const detectedLocale = i18n.locales.find((locale) => {
    return acceptLanguage.includes(locale);
  });

  redirect(`/${detectedLocale || i18n.defaultLocale}`);
}
