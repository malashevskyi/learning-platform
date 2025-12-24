import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { i18n } from "@/i18n/config";

const intlMiddleware = createIntlMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: "as-needed",
});

export async function withI18n(request: NextRequest): Promise<NextResponse> {
  return intlMiddleware(request);
}
