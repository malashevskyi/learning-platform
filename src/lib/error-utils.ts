import { toast } from "sonner";
import { serializeError } from "serialize-error";
import ensureError from "ensure-error";
import * as Sentry from "@sentry/nextjs";

/**
 * Error handler configuration
 */
interface ErrorHandlerOptions {
  /**
   * User-friendly message to display in toast
   * If not provided, a generic error message will be shown
   */
  message?: string;

  /**
   * The error object to log and report
   */
  error?: unknown;

  /**
   * Additional context to send to Sentry
   */
  context?: Record<string, unknown>;

  /**
   * Whether to show toast notification
   * @default true
   */
  showToast?: boolean;
}

/**
 * Default error messages
 */
const DEFAULT_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
} as const;

/**
 * Detects if app is running in development mode
 */
const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

/**
 * Detects if Sentry is configured
 */
const isSentryConfigured = (): boolean => {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
};

/**
 * Gets user-friendly message based on error type
 */
const getErrorMessage = (error: unknown, customMessage?: string): string => {
  if (customMessage) return customMessage;

  const errorInstance = ensureError(error);

  // Check for common error patterns
  if (errorInstance.message.toLowerCase().includes("network")) {
    return DEFAULT_MESSAGES.NETWORK;
  }

  if (
    errorInstance.message.toLowerCase().includes("unauthorized") ||
    errorInstance.message.toLowerCase().includes("403")
  ) {
    return DEFAULT_MESSAGES.UNAUTHORIZED;
  }

  if (
    errorInstance.message.toLowerCase().includes("not found") ||
    errorInstance.message.toLowerCase().includes("404")
  ) {
    return DEFAULT_MESSAGES.NOT_FOUND;
  }

  return DEFAULT_MESSAGES.GENERIC;
};

/**
 * Logs error to Sentry or console based on environment
 */
const logError = (error: unknown, context?: Record<string, unknown>): void => {
  const errorInstance = ensureError(error);
  const normalized = serializeError(error);

  if (isDevelopment()) {
    // Development: log to console with full details
    console.error("[Error Handler] Error occurred:", {
      message: errorInstance.message,
      stack: errorInstance.stack,
      context,
      originalError: error,
    });
  } else if (isSentryConfigured()) {
    // Production: send to Sentry
    Sentry.captureException(normalized, {
      contexts: {
        custom: context,
      },
      tags: {
        errorHandler: "handleError",
      },
    });
  } else {
    // Production without Sentry: at least log to console
    console.error("[Error Handler] Error occurred:", errorInstance.message);
  }
};

/**
 * Universal error handler
 *
 * Handles errors by:
 * - Showing user-friendly toast notification
 * - Logging to console (dev) or Sentry (production)
 * - Normalizing error format
 *
 * @example
 * ```typescript
 * try {
 *   await fetchData();
 * } catch (error) {
 *   handleError({
 *     message: "Failed to fetch data",
 *     error,
 *     context: { userId: user.id }
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Show only toast without logging
 * handleError({
 *   message: "Please fill in all required fields"
 * });
 * ```
 */
export const handleError = ({
  message,
  error,
  context,
  showToast = true,
}: ErrorHandlerOptions): void => {
  // Get appropriate user message
  const userMessage = getErrorMessage(error, message);

  // Show toast notification if enabled
  if (showToast) {
    toast.error(userMessage, {
      duration: 5000,
      closeButton: true,
    });
  }

  // Log error if provided
  if (error) {
    logError(error, context);
  }
};

/**
 * Async wrapper that automatically handles errors
 *
 * @example
 * ```typescript
 * const handleSubmit = withErrorHandler(
 *   async (data) => {
 *     await saveData(data);
 *     toast.success("Saved!");
 *   },
 *   { message: "Failed to save data" }
 * );
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withErrorHandler = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: Omit<ErrorHandlerOptions, "error">
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError({
        ...options,
        error,
      });
      throw error; // Re-throw for further handling if needed
    }
  }) as T;
};

/**
 * Helper to check if error is a specific type
 */
export const isErrorType = (
  error: unknown,
  type: "network" | "auth" | "notfound"
): boolean => {
  const errorInstance = ensureError(error);
  const message = errorInstance.message.toLowerCase();

  switch (type) {
    case "network":
      return message.includes("network") || message.includes("fetch");
    case "auth":
      return message.includes("unauthorized") || message.includes("403");
    case "notfound":
      return message.includes("not found") || message.includes("404");
    default:
      return false;
  }
};
