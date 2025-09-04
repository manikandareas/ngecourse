import type { QueryParams, SanityClient } from '@sanity/client';
import { createClient } from '@sanity/client';
import { getPublicEnv } from '~/env.public';

/**
 * Custom live content client following Sanity's "Create Your Own Integration" approach
 * Provides real-time updates using sync tags and event subscriptions
 */
class SanityLiveClient {
  private client: SanityClient;
  private syncTags: string[] = [];
  private subscriptions = new Map<string, () => void>();

  constructor() {
    this.client = createClient({
      projectId: getPublicEnv(import.meta.env).SANITY_PROJECT_ID,
      dataset: getPublicEnv(import.meta.env).SANITY_DATASET,
      useCdn: false, // Critical: Must be false for live updates
      apiVersion: getPublicEnv(import.meta.env).SANITY_API_VERSION,
      token: getPublicEnv(import.meta.env).SANITY_SECRET_TOKEN,
      perspective: 'published',
      stega: {
        enabled: false, // Disable for live queries
      },
    });
  }

  /**
   * Subscribe to live updates for a specific query
   */
  subscribeLive<T>(
    query: string,
    params: QueryParams,
    callback: (data: T | null, error?: Error) => void,
    subscriptionKey: string
  ): () => void {
    let currentSyncTags: string[] = [];

    const fetchData = async (lastLiveEventId?: string) => {
      try {
        const result = await this.client.fetch(query, params, {
          filterResponse: false,
          lastLiveEventId,
        });

        // Extract sync tags and data from response
        const { result: data, syncTags } = result as {
          result: T;
          syncTags: string[];
        };

        currentSyncTags = syncTags || [];
        callback(data, undefined);
      } catch (error) {
        callback(null, error as Error);
      }
    };

    // Initial fetch
    fetchData();

    // Subscribe to live events
    const subscription = this.client.live.events().subscribe((event) => {
      if (event.type === 'message') {
        // Check if any of our sync tags match the event tags
        const hasMatchingTag = event.tags?.some((tag) =>
          currentSyncTags.includes(tag)
        );

        if (hasMatchingTag) {
          fetchData(event.id);
        }
      } else if (event.type === 'restart') {
        fetchData();
      }
    });

    // Cleanup function
    const unsubscribe = () => {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    };

    // Store subscription for cleanup
    this.subscriptions.set(subscriptionKey, unsubscribe);

    return unsubscribe;
  }

  /**
   * Cleanup all subscriptions
   */
  cleanup() {
    for (const unsubscribe of this.subscriptions.values()) {
      unsubscribe();
    }
    this.subscriptions.clear();
  }

  /**
   * One-time query fetch (no live updates)
   */
  async fetch<T>(query: string, params: QueryParams = {}): Promise<T> {
    return await this.client.fetch<T>(query, params);
  }

  /**
   * Get the underlying Sanity client if needed
   */
  getClient(): SanityClient {
    return this.client;
  }
}

// Singleton instance
let liveClientInstance: SanityLiveClient | null = null;

/**
 * Get the singleton live client instance
 */
export function getLiveClient(): SanityLiveClient {
  if (typeof window === 'undefined') {
    throw new Error('Live client can only be used on the client side');
  }

  if (!liveClientInstance) {
    liveClientInstance = new SanityLiveClient();
  }

  return liveClientInstance;
}

/**
 * Cleanup live client (useful for testing or when needed)
 */
export function cleanupLiveClient(): void {
  if (liveClientInstance) {
    liveClientInstance.cleanup();
    liveClientInstance = null;
  }
}
