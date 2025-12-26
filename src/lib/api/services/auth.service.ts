import { logger } from "@/app/api/utils/logger";
import { API_ROUTES } from "@/app/shared/constants/routes";
import { api } from "../axios-client";
import {
  type UpdatePasswordResponse,
  UpdatePasswordResponseSchema,
} from "../types/auth.types";
import { treeifyError } from "zod/v4/core";
import {
  API_ERROR_TYPES,
  INTERNAL_ERROR_CODES,
} from "@/app/shared/constants/errors";

/**
 * Custom error class for auth service errors
 */
export class AuthServiceError extends Error {
  constructor(message: string, public code: string, public type: string) {
    super(message);
    this.name = "AuthServiceError";
  }
}

/**
 * Authentication service - handles all auth-related API calls
 * Pattern follows SupabaseService structure from VSCode extension
 */
export const authService = {
  /**
   * Update user password
   * @param password - The new password to set
   * @returns Promise resolving to success response
   * @throws {AuthServiceError} When password update fails
   */
  updatePassword: async (password: string): Promise<UpdatePasswordResponse> => {
    const response = await api.post(API_ROUTES.AUTH.UPDATE_PASSWORD, {
      password,
    });

    const result = UpdatePasswordResponseSchema.safeParse(response);

    if (!result.success) {
      logger.error("API Contract Violation", {
        errors: treeifyError(result.error),
      });
      throw new AuthServiceError(
        "Malformed response",
        INTERNAL_ERROR_CODES.PARSE_ERROR,
        API_ERROR_TYPES.INTERNAL
      );
    }
    const data = result.data;

    if (data.success === false) {
      throw new AuthServiceError(data.message, data.code, data.type);
    }

    return data;
  },
} as const;
