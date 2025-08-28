import { useCustomLiveQuery } from '~/lib/use-custom-live-query';
import { recommendationQuery } from '../data';
import {
  DEFAULT_MESSAGE_MAP,
  mapSanityStatus,
  type RecommendationData,
  type UseRecommendationDataReturn,
} from '../types';

/**
 * Hook for fetching live recommendation data using custom Live Content API
 * Provides real-time updates when recommendation data changes in Sanity
 * 
 * This replaces the old @sanity/react-loader implementation with a production-ready
 * live content system that works in both development and production.
 */
export function useLiveRecommendationData(
  userId: string,
  // Accept initial data from SSR for proper hydration
  initialData?: RecommendationData
): UseRecommendationDataReturn {
  // Use our custom live query hook with the recommendation query
  const { data, loading, error } = useCustomLiveQuery<RecommendationData>(
    recommendationQuery,
    { userId },
    { 
      initialData,
      enabled: true // Always enabled for real-time updates
    }
  );

  // Map the Sanity status to our internal status system
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

/**
 * Legacy hook wrapper for backward compatibility
 * Can be removed once all components are migrated
 * 
 * @deprecated Use useLiveRecommendationData instead
 */
export function useRecommendationDataLive(
  userId: string,
  initialData?: RecommendationData
): UseRecommendationDataReturn {
  return useLiveRecommendationData(userId, initialData);
}