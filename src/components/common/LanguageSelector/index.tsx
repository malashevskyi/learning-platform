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
} from "@/components/ui/Select";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  id,
  value,
  onChange,
  disabled = false,
}) => {
  const t = useTranslations("common.language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const isControlled = typeof onChange === "function";

  const handleInternalChange = (newLocale: string) => {
    if (isControlled) {
      onChange?.(newLocale);
      return;
    }
    router.replace(pathname, { locale: newLocale });
  };

  const triggerClass = cn(
    isControlled
      ? "w-full h-9 gap-2 bg-background border-border focus:ring-primary"
      : "w-[140px] h-9 gap-2 bg-background border-border focus:ring-primary"
  );

  return (
    <div className="flex flex-col">
      <Select
        value={isControlled ? value : undefined}
        defaultValue={locale}
        onValueChange={handleInternalChange}
        disabled={disabled}
      >
        <SelectTrigger id={id} className={triggerClass}>
          <Globe className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder={t("label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("english")}</SelectItem>
          <SelectItem value="uk">{t("ukrainian")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
