import type { Metadata } from "next";
import { Rubik, Roboto, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/request";

import "../../styles/globals.css";

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  variable: "--font-rubik",
  display: "swap",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "common.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "uk" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  return (
    <html lang={(await params).lang}>
      <body
        className={`${rubik.variable} ${roboto.variable} ${nunito.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
