import { createNavigation } from "next-intl/navigation";
import { i18n } from "./config";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: "as-needed",
});
