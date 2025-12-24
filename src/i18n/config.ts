export const i18n = {
  defaultLocale: "en",
  locales: ["en", "uk"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function isLocale(locale: string): locale is Locale {
  return (i18n.locales as readonly string[]).includes(locale);
}
