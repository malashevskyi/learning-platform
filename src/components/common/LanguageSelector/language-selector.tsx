"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select/select";
import { Globe } from "lucide-react";

export const LanguageSelector = () => {
  const t = useTranslations("common.language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleValueChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select defaultValue={locale} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[140px] h-9 gap-2 bg-background border-border focus:ring-primary">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder={t("label")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t("english")}</SelectItem>
        <SelectItem value="uk">{t("ukrainian")}</SelectItem>
      </SelectContent>
    </Select>
  );
};
