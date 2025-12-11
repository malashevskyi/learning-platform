import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "uk"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

// i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  const store = await cookies();
  const cookieLocale = store.get("NEXT_LOCALE")?.value;

  if (!locale || !i18n.locales.includes(locale as Locale)) {
    locale = cookieLocale || i18n.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
