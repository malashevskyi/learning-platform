import { API_ROUTES } from "@/app/shared/constants/routes";
import { api } from "../axios-client";
import {
  type ProfileSuccessResponse,
  ProfileSuccessSchema,
  type UpdateProfileResponse,
  UpdateProfileResponseSchema,
  type UpdateProfileRequest,
} from "../types/profile.types";
import {
  API_ERROR_TYPES,
  INTERNAL_ERROR_CODES,
} from "@/app/shared/constants/errors";
import { ApiServiceError } from "../error";
import { treeifyError } from "zod/v4/core";

/**
 * Profile service - handles all profile-related API calls
 */
export const profileService = {
  /**
   * Get user profile
   * @returns Promise resolving to user profile
   * @throws {ApiServiceError} When profile fetch fails
   */
  getProfile: async (): Promise<ProfileSuccessResponse> => {
    const response = await api.get(API_ROUTES.PROFILE);

    const result = ProfileSuccessSchema.safeParse(response.data);

    if (!result.success) {
      throw new ApiServiceError(
        "Malformed response",
        INTERNAL_ERROR_CODES.PARSE_ERROR,
        API_ERROR_TYPES.INTERNAL,
        {
          validationErrors: treeifyError(result.error),
          rawResponse: response.data,
        }
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
      throw new ApiServiceError(
        "Malformed response",
        INTERNAL_ERROR_CODES.PARSE_ERROR,
        API_ERROR_TYPES.INTERNAL,
        {
          validationErrors: treeifyError(result.error),
          rawResponse: response.data,
        }
      );
    }
    const parsedData = result.data;

    if (parsedData.success === false) {
      throw new ApiServiceError(
        parsedData.message,
        parsedData.code,
        parsedData.type
      );
    }

    return parsedData;
  },
} as const;
