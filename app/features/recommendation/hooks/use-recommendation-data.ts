import { useQuery } from '~/lib/sanity.loader';
import { recommendationQuery } from '../data';
import {
  DEFAULT_MESSAGE_MAP,
  mapSanityStatus,
  type RecommendationData,
  type UseRecommendationDataReturn,
} from '../types';

/**
 * Hook for fetching live recommendation data using @sanity/react-loader
 * Automatically handles live updates when data changes in Sanity
 */
export function useRecommendationData(
  userId: string,
  // biome-ignore lint/suspicious/noExplicitAny: QueryResponseInitial type from @sanity/react-loader
  initial?: any
): UseRecommendationDataReturn {
  // Use Sanity's real-time useQuery hook - automatically handles SSR and live updates
  const { data, loading, error } = useQuery<RecommendationData>(
    recommendationQuery,
    { userId },
    initial ? { initial } : {} // Pass loadQuery result for SSR hydration
  );

  // Determine current status and message
  const currentStatus = mapSanityStatus(data?.status);
  const currentMessage = data?.message ?? DEFAULT_MESSAGE_MAP[currentStatus];

  return {
    data: data ?? null,
    status: currentStatus,
    message: currentMessage,
    isLoading: loading,
    error: error as Error | null,
  };
}
