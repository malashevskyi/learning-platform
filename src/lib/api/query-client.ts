import { QueryClient, MutationCache, QueryCache } from "@tanstack/react-query";
import { handleError } from "@/lib/error-utils";
import { FeatureName, FEATURES } from "@/app/shared/constants/features";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      feature: FeatureName;
    };
  }
}

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        const feature =
          (mutation.meta?.feature as string) || FEATURES.UNKNOWN_FEATURE;
        // Every time ANY mutation fails, log to Sentry automatically
        handleError({ error, context: { feature }, showToast: false });
      },
    }),
    queryCache: new QueryCache({
      onError: (error) => {
        // Every time ANY query fails, log to Sentry automatically
        handleError({ error, showToast: false });
      },
    }),
  });
