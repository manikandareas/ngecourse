import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  token: import.meta.env.VITE_SANITY_SECRET_TOKEN, // Needed for certain operations like updating content, accessing drafts or using draft perspectives
  perspective: 'published', // Ensure consistency with live client
});

const { projectId, dataset } = client.config();

export const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

/**
 * Check if an error is retryable (network issues, timeouts, etc.)
 */
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('fetch')
    );
  }
  return false;
};

/**
 * Simple retry wrapper for Sanity operations
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};
