import { FEATURES } from "@/app/shared/constants/features";
import {
  profileService,
  ProfileServiceError,
} from "@/lib/api/services/profile.service";
import type {
  ProfileSuccessResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/lib/api/types/profile.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { API_ERROR_CODES } from "@/app/shared/constants/errors";

interface UseProfileResult {
  profile: ProfileSuccessResponse | undefined;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch user profile data
 */
export const useProfile = (): UseProfileResult => {
  const t = useTranslations("onboarding.errors");

  const query = useQuery<ProfileSuccessResponse, ProfileServiceError>({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
    meta: {
      feature: FEATURES.USER.PROFILE_GET,
    },
  });

  const getClientErrorMessage = (): string | null => {
    if (!query.error) return null;

    if (query.error.code === API_ERROR_CODES.AUTH.EMAIL_NOT_CONFIRMED) {
      // If we ever surfaced this code from server, show a helpful message.
      return t("save_failed");
    }

    return t("save_failed");
  };

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: getClientErrorMessage(),
  };
};

interface UseUpdateProfileResult {
  isUpdating: boolean;
  updateSuccess: boolean;
  updateError: string | null;
  updateProfile: (data: UpdateProfileRequest) => void;
  reset: () => void;
}

/**
 * Hook to update user profile
 */
export const useUpdateProfile = (): UseUpdateProfileResult => {
  const t = useTranslations("onboarding.errors");

  const mutation = useMutation<
    UpdateProfileResponse,
    ProfileServiceError,
    UpdateProfileRequest
  >({
    mutationFn: profileService.updateProfile,
    meta: {
      feature: FEATURES.USER.PROFILE_UPDATE,
    },
  });

  const getClientErrorMessage = (): string | null => {
    if (!mutation.error) return null;
    return t("save_failed");
  };

  return {
    isUpdating: mutation.isPending,
    updateSuccess: mutation.isSuccess,
    updateError: getClientErrorMessage(),
    updateProfile: mutation.mutate,
    reset: mutation.reset,
  };
};
