import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  touched?: boolean;
  label?: string;
  confirmPassword?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, error, touched, label, confirmPassword, ...props }, ref) => {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label
        htmlFor={props.id}
        className="text-sm font-bold ml-1 text-foreground"
      >
        {label || t("password_label")}
      </label>
      <div className="relative">
        <Input
          id={props.id}
          ref={ref}
          type={showPassword ? "text" : "password"}
          placeholder={
            confirmPassword
              ? t("confirm_password_placeholder")
              : t("password_placeholder")
          }
          className={cn(
            "pr-10", // Space for the eye icon
            error &&
              touched &&
              "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1} // Skip tab focus for the eye button to keep flow smooth
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {touched && error && (
        <span className="text-xs text-destructive ml-1 font-medium animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
