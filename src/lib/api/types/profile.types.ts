import { z } from "zod";
import { i18n } from "@/i18n/config";

/**
 * User profile data
 */
export interface UserProfile {
  full_name: string;
  native_language: (typeof i18n.locales)[number];
}

/**
 * Request payload for profile update
 */
export interface UpdateProfileRequest {
  full_name: string;
  native_language: (typeof i18n.locales)[number];
}

/**
 * Successful profile response
 */
export const ProfileSuccessSchema = z.object({
  full_name: z.string(),
  native_language: z.enum(i18n.locales),
});
export type ProfileSuccessResponse = z.infer<typeof ProfileSuccessSchema>;

/**
 * Successful profile update response
 */
export const UpdateProfileSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});
export type UpdateProfileSuccessResponse = z.infer<
  typeof UpdateProfileSuccessSchema
>;

/**
 * Error response from profile operations
 */
export const ProfileErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  type: z.string(),
  code: z.string(),
});
export type ProfileErrorResponse = z.infer<typeof ProfileErrorSchema>;

/**
 * Union type for profile update responses
 */
export type UpdateProfileResponse =
  | UpdateProfileSuccessResponse
  | ProfileErrorResponse;

export const UpdateProfileResponseSchema = z.discriminatedUnion("success", [
  UpdateProfileSuccessSchema,
  ProfileErrorSchema,
]);
