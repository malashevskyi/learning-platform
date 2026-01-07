import { logger } from "@/app/api/utils/logger";
import { API_ROUTES } from "@/app/shared/constants/routes";
import { api } from "../axios-client";
import {
  type ProfileSuccessResponse,
  ProfileSuccessSchema,
  type UpdateProfileResponse,
  UpdateProfileResponseSchema,
  type UpdateProfileRequest,
} from "../types/profile.types";
import { treeifyError } from "zod/v4/core";
import {
  API_ERROR_TYPES,
  INTERNAL_ERROR_CODES,
} from "@/app/shared/constants/errors";

export class ProfileServiceError extends Error {
  constructor(message: string, public code: string, public type: string) {
    super(message);
    this.name = "ProfileServiceError";
  }
}

/**
 * Profile service - handles all profile-related API calls
 */
export const profileService = {
  /**
   * Get user profile
   * @returns Promise resolving to user profile
   * @throws {ProfileServiceError} When profile fetch fails
   */
  getProfile: async (): Promise<ProfileSuccessResponse> => {
    const response = await api.get(API_ROUTES.PROFILE);

    const result = ProfileSuccessSchema.safeParse(response.data);

    if (!result.success) {
      logger.error("API Contract Violation - Profile Get", {
        errors: treeifyError(result.error),
        raw: response.data,
      });
      throw new ProfileServiceError(
        "Malformed response",
        INTERNAL_ERROR_CODES.PARSE_ERROR,
        API_ERROR_TYPES.INTERNAL
      );
    }

    return result.data;
  },

  /**
   * Update user profile
   * @param data - Profile data to update
   * @returns Promise resolving to success response
   * @throws {ProfileServiceError} When profile update fails
   */
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    const response = await api.patch(API_ROUTES.PROFILE, data);

    const result = UpdateProfileResponseSchema.safeParse(response.data);

    if (!result.success) {
      logger.error("API Contract Violation - Profile Update", {
        errors: treeifyError(result.error),
        raw: response.data,
      });
      throw new ProfileServiceError(
        "Malformed response",
        INTERNAL_ERROR_CODES.PARSE_ERROR,
        API_ERROR_TYPES.INTERNAL
      );
    }
    const parsedData = result.data;

    if (parsedData.success === false) {
      throw new ProfileServiceError(
        parsedData.message,
        parsedData.code,
        parsedData.type
      );
    }

    return parsedData;
  },
} as const;
