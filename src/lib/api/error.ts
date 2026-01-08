import { API_ERROR_TYPES } from "@/app/shared/constants/errors";

export interface ErrorContext extends Record<string, unknown> {
  serverResponse?: unknown;
  validationErrors?: Record<string, unknown>;
}

export class ApiServiceError extends Error {
  public readonly code: string | null;
  public readonly type: string;
  public readonly context: ErrorContext;

  constructor(
    message: string,
    code: string | null = null,
    type: string = API_ERROR_TYPES.INTERNAL,
    context: ErrorContext = {}
  ) {
    super(message);
    this.name = "ApiServiceError";
    this.code = code;
    this.type = type;
    this.context = context;
  }
}
