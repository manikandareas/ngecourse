import type { QueryParams } from '@sanity/client';
import { useEffect, useRef, useState } from 'react';
import { getLiveClient } from './sanity-live-client';

interface UseCustomLiveQueryOptions<T> {
  /**
   * Initial data from server-side rendering
   * This ensures smooth hydration and prevents layout shifts
   */
  initialData?: T;
  /**
   * Whether to enable live updates
   * Useful for disabling in certain conditions
   */
  enabled?: boolean;
}

interface UseCustomLiveQueryReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for live Sanity queries using the Live Content API
 * Provides real-time updates with proper SSR hydration
 */
export function useCustomLiveQuery<T>(
  query: string,
  params: QueryParams = {},
  options: UseCustomLiveQueryOptions<T> = {}
): UseCustomLiveQueryReturn<T> {
  const { initialData, enabled = true } = options;
  
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);
  
  // Use refs to track subscription and prevent unnecessary re-subscriptions
  const subscriptionRef = useRef<(() => void) | null>(null);
  const subscriptionKeyRef = useRef<string>('');

  useEffect(() => {
    // Skip if not enabled or server-side
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // Create unique subscription key
    const subscriptionKey = `${query}-${JSON.stringify(params)}-${Date.now()}`;
    subscriptionKeyRef.current = subscriptionKey;

    try {
      const liveClient = getLiveClient();
      
      // Set up live subscription
      const unsubscribe = liveClient.subscribeLive<T>(
        query,
        params,
        (newData, newError) => {
          if (newError) {
            setError(newError);
            setLoading(false);
          } else {
            setData(newData);
            setError(null);
            setLoading(false);
          }
        },
        subscriptionKey
      );

      subscriptionRef.current = unsubscribe;

      return () => {
        // Cleanup subscription
        if (subscriptionRef.current) {
          subscriptionRef.current();
          subscriptionRef.current = null;
        }
      };
    } catch (clientError) {
      setError(clientError as Error);
      setLoading(false);
    }
  }, [query, JSON.stringify(params), enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
  };
}

/**
 * Hook for one-time queries (no live updates)
 * Useful when you only need initial data without subscriptions
 */
export function useCustomQuery<T>(
  query: string,
  params: QueryParams = {},
  initialData?: T
): UseCustomLiveQueryReturn<T> {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        const liveClient = getLiveClient();
        const result = await liveClient.fetch<T>(query, params);
        
        if (!cancelled) {
          setData(result);
          setError(null);
          setLoading(false);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError as Error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [query, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
  };
}