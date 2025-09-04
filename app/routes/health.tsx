/**
 * Health check endpoint for production monitoring
 * Returns application status and basic system information
 */

import { getEnv } from '~/env.server';
import type { Route } from './+types/health';

export function meta() {
  return [
    { title: 'Health Check | Genii' },
    {
      name: 'description',
      content: 'Health check endpoint for production monitoring',
    },
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const detailed = url.searchParams.get('detailed') === 'true';

  // Basic health check
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || 'unknown',
  };

  // Detailed health check (includes environment validation)
  if (detailed) {
    let envStatus = { isValid: false, error: null as string | null };

    try {
      getEnv(process.env); // Validate environment
      envStatus = { isValid: true, error: null };
    } catch (error) {
      envStatus = {
        isValid: false,
        error:
          error instanceof Error ? error.message : 'Unknown validation error',
      };
    }

    return Response.json({
      ...health,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isValid: envStatus.isValid,
        error: envStatus.error,
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage(),
      },
    });
  }

  return Response.json(health);
}

// Simple GET endpoint that returns health status
export default function HealthCheck() {
  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>Health Check</h1>
      <p>This endpoint is for monitoring purposes.</p>
      <p>
        Use <code>?detailed=true</code> for detailed information.
      </p>
    </div>
  );
}
