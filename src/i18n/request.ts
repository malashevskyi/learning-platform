import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { i18n, type Locale } from "./config";
import { COOKIE_NAMES } from "@/app/shared/constants/auth";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  const store = await cookies();
  const cookieLocale = store.get(COOKIE_NAMES.NEXT_LOCALE)?.value;

  if (!locale || !i18n.locales.includes(locale as Locale)) {
    locale = cookieLocale || i18n.defaultLocale;
  }

  const appMessages = (await import(`./messages/${locale}.json`)).default;

  const storybookMessages = (
    await import(`./messages/storybook/${locale}.json`)
  ).default;

  return {
    locale,
    messages: {
      ...appMessages,
      storybook: storybookMessages,
    },
  };
});
