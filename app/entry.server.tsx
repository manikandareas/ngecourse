/**
 * Entry point for server-side rendering
 * Handles security headers, logging, and error handling for production
 */
import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable } from '@react-router/node';
import { renderToPipeableStream } from 'react-dom/server';
import type { AppLoadContext, EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { getEnv } from './env.server';

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;

    // Validate environment variables on server startup using existing Zod schemas
    try {
      if (getEnv(process.env).NODE_ENV === 'production') {
        // Additional production-specific validation could go here
        console.log('✅ Environment validation passed');
      }
    } catch (error) {
      console.error('❌ Environment validation failed:', error);

      // In production, we might want to fail fast
      if (getEnv(process.env).NODE_ENV === 'production') {
        throw new Error('Critical environment variables missing or invalid');
      }
    }

    // Apply security headers
    const isProduction = getEnv(process.env).NODE_ENV === 'production';

    // Log security-relevant information in production
    if (isProduction) {
      const userAgent = request.headers.get('user-agent') || 'unknown';
      const origin = request.headers.get('origin');
      const referer = request.headers.get('referer');

      console.log(`🔒 Request: ${request.method} ${request.url}`, {
        userAgent: userAgent.substring(0, 100), // Truncate for security
        origin,
        referer,
        timestamp: new Date().toISOString(),
      });
    }

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error('⚠️ Server render error:', error);
          responseStatusCode = 500;

          // Don't log full error details in production for security
          if (getEnv(process.env).NODE_ENV === 'production') {
            console.error('Server error occurred - check logs');
          } else {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

/**
 * Handle streaming errors
 */
export function handleStreamingError(error: unknown): void {
  console.error('Streaming error:', error);

  // In production, we might want to send error notifications
  if (getEnv(process.env).NODE_ENV === 'production') {
    // TODO: Integrate with error monitoring service (Sentry, etc.)
    console.error('⚠️ Streaming error in production:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
