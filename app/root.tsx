import { ClerkProvider, useAuth } from '@clerk/react-router';
import { getAuth, rootAuthLoader } from '@clerk/react-router/ssr.server';
import {
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from 'react-router';
import type { Route } from './+types/root';
import './app.css';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useState } from 'react';
import { ErrorFallback } from './components/ui/error-fallback';
import { Toaster } from './components/ui/sonner';
import { usecaseUser } from './features/users/usecase';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const VITE_CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk publishable key');
}

if (!VITE_CONVEX_URL) {
  throw new Error('Missing Convex URL');
}
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});

convexQueryClient.connect(queryClient);

export async function loader(args: Route.LoaderArgs) {
  return await rootAuthLoader(args);
}

export async function getCurrentSession(args: LoaderFunctionArgs) {
  const { isAuthenticated, userId, ...rest } = await getAuth(args);

  if (!isAuthenticated) {
    return null;
  }

  const currentSession = await usecaseUser.getCurrentUser(userId);

  return {
    ...currentSession,
    clerkId: userId,
    ...rest,
  };
}

export const links: Route.LinksFunction = () => [
  // DNS prefetch for external services
  { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
  { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
  { rel: 'dns-prefetch', href: 'https://clerk.dev' },

  // Preconnect to font services
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },

  // Font with display=swap for performance
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Press+Start+2P&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        {children}
        <Toaster position="bottom-right" richColors />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ClerkProvider
      afterSignOutUrl={'/'}
      loaderData={loaderData}
      publishableKey={PUBLISHABLE_KEY}
      signInFallbackRedirectUrl={'/progress'}
      signUpFallbackRedirectUrl={'/onboarding'}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <Analytics />
          <SpeedInsights />
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  const isResponse = isRouteErrorResponse(error);
  const isNotFound = isResponse && error.status === 404;

  if (isResponse) {
    details = isNotFound
      ? 'The page you’re looking for doesn’t exist or has moved.'
      : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Give a tiny delay for the spinner to be visible
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <ErrorFallback
      details={details}
      isNotFound={isNotFound}
      onBack={handleBack}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      stack={stack}
    />
  );
}
