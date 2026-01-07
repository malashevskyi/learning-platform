import React from "react";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface FullNameInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  touched?: boolean;
}

export const FullNameInput = React.forwardRef<
  HTMLInputElement,
  FullNameInputProps
>(({ className, error, touched, ...props }, ref) => {
  const t = useTranslations("onboarding");

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label
        htmlFor={props.id}
        className="text-sm font-bold ml-1 text-foreground"
      >
        {t("full_name_label")}
      </label>
      <Input
        id={props.id}
        ref={ref}
        type="text"
        placeholder={t("full_name_placeholder")}
        className={cn(
          error &&
            touched &&
            "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
      {touched && error && (
        <span className="text-xs text-destructive ml-1 font-medium animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
});
FullNameInput.displayName = "FullNameInput";
