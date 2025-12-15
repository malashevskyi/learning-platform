import React from "react";

export interface InlineErrorProps {
  message: string | null | undefined;
  className?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-md bg-red-50 p-3 text-sm text-red-700 ${className}`}
    >
      {message}
    </div>
  );
};

export default InlineError;
