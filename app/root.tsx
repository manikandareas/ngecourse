import { ClerkProvider } from '@clerk/react-router';
import { getAuth, rootAuthLoader } from '@clerk/react-router/ssr.server';
import {
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';
import './app.css';
import { Toaster } from './components/ui/sonner';
import ReactQueryProvider from './providers/react-query';
import { usecaseUser } from './usecase/users';

export async function loader(args: Route.LoaderArgs) {
  return await rootAuthLoader(args);
}

export async function getCurrentSession(args: LoaderFunctionArgs) {
  const { isAuthenticated, userId } = await getAuth(args);

  if (!isAuthenticated) {
    return null;
  }

  const currentSession = await usecaseUser.getCurrentUser(userId);

  if (!currentSession) {
    return null;
  }

  return {
    ...currentSession,
    clerkId: userId,
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
      <body>
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
    <ReactQueryProvider>
      <ClerkProvider loaderData={loaderData}>
        <Outlet />
      </ClerkProvider>
    </ReactQueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
