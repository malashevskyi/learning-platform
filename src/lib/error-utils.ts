import { toast } from "sonner";
import { serializeError } from "serialize-error";
import ensureError from "ensure-error";
import * as Sentry from "@sentry/nextjs";

/**
 * Error handler configuration
 */
interface ErrorHandlerOptions {
  /**
   * Translation key or direct message to display in toast.
   * If it starts with a dot (.), it will be treated as a translation key.
   * Examples: ".errors.network", "Custom error message"
   */
  clientMessage?: string;

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
 * Logs error to Sentry or console based on environment.
 * Always logs full error details for debugging purposes.
 */
const logError = (error: unknown, context?: Record<string, unknown>): void => {
  const normalized = serializeError(error);

  if (isDevelopment()) {
    // Development: log to console with full details
    console.error(
      "[Error Handler] Error occurred:",
      JSON.stringify(normalized, null, 2)
    );
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
    console.error(
      "[Error Handler] Error occurred:",
      JSON.stringify(normalized, null, 2)
    );
  }
};

/**
 * Universal error handler for background/logging errors.
 *
 * This function is designed for errors that need to be logged but may not need
 * user-facing UI (toasts). It always logs to Sentry/console.
 *
 * @example
 * ```typescript
 * // Log error without showing toast (handled in UI)
 * handleError({
 *   error,
 *   showToast: false,
 *   context: { userId: user.id }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Show toast with custom message and log
 * handleError({
 *   clientMessage: "Failed to load data",
 *   error,
 * });
 * ```
 */
export const handleError = ({
  clientMessage,
  error,
  context,
  showToast = true,
}: ErrorHandlerOptions): void => {
  logError(error, context);

  // Show toast notification if enabled
  if (showToast || clientMessage) {
    const errorInstance = error ? ensureError(error) : null;

    // Use custom message if provided, otherwise use error message or fallback
    const userMessage =
      clientMessage ||
      errorInstance?.message ||
      "Something went wrong. Please try again.";

    toast.error(userMessage, {
      duration: 5000,
      closeButton: true,
    });
  }
};
