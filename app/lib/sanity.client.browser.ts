import { createClient } from '@sanity/client';

/**
 * Client-side only Sanity client for live mode functionality
 * This client is specifically configured for real-time updates and should only be used in the browser
 */
export const browserClient =
  typeof window !== 'undefined'
    ? createClient({
        projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
        dataset: import.meta.env.VITE_SANITY_DATASET,
        useCdn: true, // Must be false for live updates to work
        apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
        token: import.meta.env.VITE_SANITY_SECRET_TOKEN, // Required for live updates
        perspective: 'published', // Use 'raw' for draft content
        stega: {
          enabled: true,
          studioUrl: 'https://genii.sanity.studio',
        },
      })
    : null;

// Export a safe getter function for the browser client
export function getBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('Browser client can only be used on the client side');
  }

  if (!browserClient) {
    throw new Error(
      'Browser client failed to initialize - check environment variables'
    );
  }

  return browserClient;
}
