import { useEffect, useState } from "react";

type ResendState = "idle" | "loading" | "success" | "error";

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
}

export interface UseResendCooldownReturn {
  resendState: ResendState;
  cooldown: number | null;
  handleResend: (resendFn: () => Promise<void>) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for managing resend email cooldown logic
 */
export const useResendCooldown = (
  options: UseResendCooldownOptions = {}
): UseResendCooldownReturn => {
  const { cooldownDuration = 60, errorResetDuration = 5000 } = options;

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

  const handleResend = async (resendFn: () => Promise<void>) => {
    setResendState("loading");
    try {
      await resendFn();
      setCooldown(cooldownDuration);
      setResendState("success");
    } catch {
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
