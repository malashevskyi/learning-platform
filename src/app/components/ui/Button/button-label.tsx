import * as React from "react";

type ButtonSize = "default" | "sm" | "lg" | "icon" | "auto";

const iconSizes: Record<ButtonSize, string> = {
  default: "h-5 w-5",
  sm: "h-4 w-4",
  lg: "h-6 w-6",
  icon: "h-6 w-6",
  auto: "h-5 w-5",
};

interface ButtonLabelProps {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  size: ButtonSize;
}

export const ButtonLabel: React.FC<ButtonLabelProps> = ({
  label,
  icon,
  size,
}) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      const element = icon as React.ReactElement<{ className?: string }>;
      const existingClassName = element.props.className || "";
      const sizeClass = iconSizes[size];

      return React.cloneElement(element, {
        className: `${existingClassName} ${sizeClass}`.trim(),
      });
    }

    return icon;
  };

  // ignore unexpected label and icon combinations
  if (size === "icon" && icon) return <>{renderIcon()}</>;

  if (label && icon) {
    return (
      <>
        {label}
        <span className="ml-2">{renderIcon()}</span>
      </>
    );
  }

  if (label) return <>{label}</>;

  if (icon) return <>{renderIcon()}</>;

  return null;
};

ButtonLabel.displayName = "ButtonLabel";
