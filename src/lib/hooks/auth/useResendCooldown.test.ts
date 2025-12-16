/**
 * @vitest-environment jsdom
 */
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useResendCooldown } from "./useResendCooldown";

describe("useResendCooldown - REAL TIME", () => {
  it("should initialize with idle state and no cooldown", () => {
    const { result } = renderHook(() => useResendCooldown());

    expect(result.current.resendState).toBe("idle");
    expect(result.current.cooldown).toBeNull();
  });

  it("should handle successful resend and start cooldown", async () => {
    const { result } = renderHook(() =>
      useResendCooldown({ cooldownDuration: 3 })
    );

    const mockResendFn = vi.fn().mockResolvedValue(undefined);
    await result.current.handleResend(mockResendFn);

    // Wait for state update
    await waitFor(() => {
      expect(result.current.resendState).toBe("success");
    });

    expect(mockResendFn).toHaveBeenCalledTimes(1);
    expect(result.current.cooldown).toBe(3);
  });

  it("should countdown in REAL TIME from 10 to 0", async () => {
    const mockResendFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useResendCooldown({ cooldownDuration: 10 })
    );

    // Start resend
    await result.current.handleResend(mockResendFn);

    // Wait for state to update
    await waitFor(() => {
      expect(result.current.resendState).toBe("success");
      expect(result.current.cooldown).toBe(10);
    });

    // Watch countdown in REAL TIME
    for (let i = 10; i >= 1; i--) {
      await waitFor(
        () => {
          expect(result.current.cooldown).toBe(i);
        },
        { timeout: 2000 }
      );

      console.log(`Cooldown: ${i}s remaining`);

      // Wait for next tick (real time)
      if (i > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Wait for cooldown to complete
    await waitFor(
      () => {
        expect(result.current.cooldown).toBeNull();
        expect(result.current.resendState).toBe("idle");
      },
      { timeout: 2000 }
    );
  }, 15000);

  it("should handle resend error and reset after 3 seconds", async () => {
    const mockResendFn = vi.fn().mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() =>
      useResendCooldown({ errorResetDuration: 3000 })
    );

    await result.current.handleResend(mockResendFn);

    // Wait for error state
    await waitFor(() => {
      expect(result.current.resendState).toBe("error");
    });

    expect(result.current.cooldown).toBeNull();

    // Wait in real time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await waitFor(
      () => {
        expect(result.current.resendState).toBe("idle");
      },
      { timeout: 1000 }
    );
  }, 6000);

  it("should keep button disabled during countdown", async () => {
    const mockResendFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useResendCooldown({ cooldownDuration: 5 })
    );

    await result.current.handleResend(mockResendFn);

    // Wait for initial state
    await waitFor(() => {
      expect(result.current.resendState).toBe("success");
    });

    // Check button disabled during countdown
    for (let i = 5; i >= 1; i--) {
      await waitFor(
        () => {
          expect(result.current.cooldown).toBe(i);
        },
        { timeout: 2000 }
      );

      const isDisabled =
        result.current.resendState === "loading" ||
        result.current.resendState === "success";

      console.log(`${i}s | Button: ${isDisabled ? "DISABLED" : "ENABLED"}`);

      if (i > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    await waitFor(
      () => {
        expect(result.current.cooldown).toBeNull();
        expect(result.current.resendState).toBe("idle");
      },
      { timeout: 2000 }
    );
  }, 10000);

  it("should allow multiple resend cycles", async () => {
    const mockResendFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useResendCooldown({ cooldownDuration: 3 })
    );

    // Cycle 1
    await result.current.handleResend(mockResendFn);

    await waitFor(() => {
      expect(result.current.resendState).toBe("success");
    });

    for (let i = 3; i >= 1; i--) {
      await waitFor(() => expect(result.current.cooldown).toBe(i), {
        timeout: 2000,
      });
      console.log(`${i}s...`);
      if (i > 1) await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await waitFor(() => expect(result.current.resendState).toBe("idle"), {
      timeout: 2000,
    });

    // Cycle 2
    await result.current.handleResend(mockResendFn);

    await waitFor(() => {
      expect(result.current.resendState).toBe("success");
    });
    expect(mockResendFn).toHaveBeenCalledTimes(2);

    for (let i = 3; i >= 1; i--) {
      await waitFor(() => expect(result.current.cooldown).toBe(i), {
        timeout: 2000,
      });
      console.log(`${i}s...`);
      if (i > 1) await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await waitFor(() => expect(result.current.resendState).toBe("idle"), {
      timeout: 2000,
    });
  }, 15000);

  it("should reset cooldown immediately", async () => {
    const mockResendFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useResendCooldown({ cooldownDuration: 5 })
    );

    await result.current.handleResend(mockResendFn);

    await waitFor(() => {
      expect(result.current.resendState).toBe("success");
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    result.current.reset();

    await waitFor(() => {
      expect(result.current.cooldown).toBeNull();
      expect(result.current.resendState).toBe("idle");
    });
  }, 10000);
});
