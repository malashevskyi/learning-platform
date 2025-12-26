import { z } from "zod";

/**
 * Request payload for password update
 */
export interface UpdatePasswordRequest {
  password: string;
}

/**
 * Successful password update response
 */
export const UpdatePasswordSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});
export type UpdatePasswordSuccessResponse = z.infer<
  typeof UpdatePasswordSuccessSchema
>;

/**
 * Error response from password update
 */
export const UpdatePasswordErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  type: z.string(),
  code: z.string(),
});
export type UpdatePasswordErrorResponse = z.infer<
  typeof UpdatePasswordErrorSchema
>;

/**
 * Union type for all possible password update responses
 */
export type UpdatePasswordResponse =
  | UpdatePasswordSuccessResponse
  | UpdatePasswordErrorResponse;

export const UpdatePasswordResponseSchema = z.discriminatedUnion("success", [
  UpdatePasswordSuccessSchema,
  UpdatePasswordErrorSchema,
]);

/**
 * Type guard to check if response is an error
 */
export function isUpdatePasswordError(
  response: UpdatePasswordResponse
): response is UpdatePasswordErrorResponse {
  return response.success === false;
}
