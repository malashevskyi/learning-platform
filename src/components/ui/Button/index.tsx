import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ButtonLabel } from "./ButtonLabel";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[15px] font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-rubik select-none active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        // 1. Primary (MUI Contained): Green background, white text, shadow
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-lg active:shadow-sm",

        // 2. Destructive: Red
        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 hover:shadow-lg",

        // 3. Outline (MUI Outlined): Transparent with colored border
        outline:
          "border-2 border-primary text-primary bg-transparent  hover:bg-primary/5",

        // 4. Secondary: Dark Blue/Gray
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-lg",

        // 5. Ghost: Text button, no background
        ghost: "hover:bg-accent hover:text-accent-foreground ",

        // 6. Navigation: Left aligned, underlined on hover, no background
        navigation:
          "justify-start p-0 h-auto text-lg underline-offset-4 underline text-foreground hover:text-primary bg-transparent rounded-none",

        // 7. Action 3D: Custom style for learning interface (white, thick border, solid shadow)
        action3d:
          "bg-white border-[3px] border-brand-gray-border text-brand-orange-text shadow-3d active:translate-y-[4px] active:shadow-none hover:border-gray-300",
      },
      size: {
        default: "h-11 px-6 py-2 text-base",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11", // Only for icon-only buttons
        auto: "h-auto px-4 py-2", // Adaptive size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  label?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  asChild = false,
  label,
  icon,
  loading = false,
  ref,
  children,
  disabled,
  ...props
}) => {
  const t = useTranslations();

  if (asChild) {
    const slotClass = cn(
      buttonVariants({ variant, size, className }),
      disabled ? "pointer-events-none opacity-50" : undefined,
      "justify-center"
    );

    return (
      <Slot className={slotClass} ref={ref} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>{label ? t(label) : children}</span>
        </>
      ) : (
        <ButtonLabel
          label={label ? t(label) : children}
          icon={icon}
          size={size || "default"}
        />
      )}
    </button>
  );
};
Button.displayName = "Button";

export { Button, buttonVariants };
