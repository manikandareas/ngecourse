import { useEffect, useMemo } from 'react';
import { getBrowserClient } from '~/lib/sanity.client.browser';
import { useLiveMode } from '~/lib/sanity.loader';

interface SanityLiveProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that enables Sanity live mode for real-time updates
 * Should be placed high in the component tree to ensure all queries benefit from live updates
 */
export function SanityLiveProvider({ children }: SanityLiveProviderProps) {
  const isLiveModeEnabled =
    import.meta.env.DEV && typeof window !== 'undefined';

  // Get browser client safely, only when live mode is enabled
  const client = useMemo(() => {
    if (!isLiveModeEnabled) return null;

    try {
      return getBrowserClient();
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Development debugging
      console.warn('⚠️ Failed to initialize Sanity browser client:', error);
      return null;
    }
  }, [isLiveModeEnabled]);

  // Enable live mode with browser client - called at top level (follows Rules of Hooks)
  // Only pass client when live mode should be enabled
  // biome-ignore lint/suspicious/noExplicitAny: Required for @sanity/react-loader client compatibility
  useLiveMode(client ? { client: client as any } : {});

  useEffect(() => {
    if (client) {
      // biome-ignore lint/suspicious/noConsole: Development debugging  
      console.log('🟢 Sanity live mode enabled - real-time updates active');
    }
  }, [client]);

  return <>{children}</>;
}
