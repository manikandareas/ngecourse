import { createClient } from '@sanity/client';
import { setServerClient } from './sanity.loader';

// Server-side client for SSR and initial data loading
const serverClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true, // Set to false for consistency with live updates
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  token: import.meta.env.VITE_SANITY_SECRET_TOKEN,
  perspective: 'published',
  stega: {
    enabled: true,
    studioUrl: 'https://genii.sanity.studio',
  },
});

// Configure the server client for @sanity/react-loader
// Type assertion needed due to version compatibility between @sanity/client and @sanity/react-loader
// biome-ignore lint/suspicious/noExplicitAny: Required for @sanity/react-loader compatibility
setServerClient(serverClient as any);

// Re-export for convenience
export { loadQuery } from './sanity.loader';
