import { handleError } from "@/lib/error-utils";
import { useEffect, useState } from "react";

type ResendState = "idle" | "loading" | "success" | "error";

const COOLDOWN_DEFAULT_DURATION = 60; // seconds
const ERROR_RESET_DEFAULT_DURATION = 5000; // milliseconds

export interface UseResendCooldownOptions {
  /**
   * Cooldown duration in seconds
   * @default 60
   */
  cooldownDuration?: number;

  /**
   * Error reset duration in milliseconds
   * @default 5000
   */
  errorResetDuration?: number;
  onResend?: () => Promise<void>;
}

export interface UseResendCooldownReturn {
  resendState: ResendState;
  cooldown: number | null;
  handleResend: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook for managing resend email cooldown logic
 */
export const useResendCooldown = (
  options: UseResendCooldownOptions
): UseResendCooldownReturn => {
  const {
    cooldownDuration = COOLDOWN_DEFAULT_DURATION,
    errorResetDuration = ERROR_RESET_DEFAULT_DURATION,
    onResend,
  } = options;

  const [resendState, setResendState] = useState<ResendState>("idle");
  const [cooldown, setCooldown] = useState<number | null>(null);

  useEffect(() => {
    if (cooldown === null) return;
    if (cooldown <= 0) {
      // eslint-disable-next-line
      setCooldown(null);
      setResendState("idle");
      return;
    }

    const id = setInterval(() => {
      setCooldown((c) => (c !== null ? c - 1 : c));
    }, 1000);

    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    setResendState("loading");
    try {
      if (onResend) await onResend();
      setCooldown(cooldownDuration);
      setResendState("success");
    } catch (error) {
      handleError({
        error,
        clientMessage: "errors.resend_email_failed",
      });
      setResendState("error");
      setTimeout(() => {
        setResendState("idle");
      }, errorResetDuration);
    }
  };

  const reset = () => {
    setResendState("idle");
    setCooldown(null);
  };

  return {
    resendState,
    cooldown,
    handleResend,
    reset,
  };
};
