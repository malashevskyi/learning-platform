import { serializeError } from "serialize-error";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? serializeError(context) : undefined;
    // In development: pretty console logs
    if (this.isDevelopment) {
      const emoji = {
        info: "ℹ️",
        warn: "⚠️",
        error: "❌",
        debug: "🔍",
      }[level];

      const consoleMethod =
        level === "error" ? "error" : level === "warn" ? "warn" : "log";
      console[consoleMethod](
        `${emoji} [${timestamp}] ${message}`,
        sanitizedContext ? "\n" + JSON.stringify(sanitizedContext, null, 2) : ""
      );
      return;
    }

    // In production: structured JSON logs (parseable by log aggregators)
    const logEntry = {
      timestamp,
      level,
      message,
      data: sanitizedContext,
    };

    console.log(JSON.stringify(logEntry));
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  error(message: string, context?: LogContext) {
    this.log("error", message, context);
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }
}

export const logger = new Logger();
