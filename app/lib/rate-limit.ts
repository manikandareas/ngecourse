/**
 * Rate limiting utilities for React Router v7
 * Provides in-memory rate limiting with configurable windows and limits
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyGenerator?: (request: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// In-memory store for rate limiting
// In production, consider using Redis or similar persistent store
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get client identifier from request
 */
function getClientKey(request: Request): string {
  // In production, consider using a combination of IP + User-Agent + Auth token
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const remoteAddr = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  
  // Include user agent for better fingerprinting
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Create a simple hash for the key
  return `${remoteAddr}:${userAgent.slice(0, 50)}`;
}

/**
 * Rate limit middleware function
 */
export function rateLimit(config: RateLimitConfig) {
  return (request: Request): { allowed: boolean; headers: Record<string, string> } => {
    const now = Date.now();
    const key = config.keyGenerator ? config.keyGenerator(request) : getClientKey(request);
    
    // Clean up expired entries periodically
    if (Math.random() < 0.1) { // 10% chance to cleanup on each request
      cleanupExpiredEntries();
    }
    
    // Get or create entry
    let entry = rateLimitStore.get(key);
    
    if (!entry || now >= entry.resetTime) {
      // Create new entry or reset expired one
      entry = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(key, entry);
    } else {
      // Increment existing entry
      entry.count++;
    }
    
    const remaining = Math.max(0, config.max - entry.count);
    const resetTime = Math.ceil((entry.resetTime - now) / 1000); // seconds
    
    const headers = {
      'X-RateLimit-Limit': config.max.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetTime.toString(),
    };
    
    const allowed = entry.count <= config.max;
    
    if (!allowed) {
      headers['Retry-After'] = resetTime.toString();
    }
    
    return { allowed, headers };
  };
}

/**
 * Common rate limit configurations
 */
export const rateLimitConfigs = {
  // General API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },
  
  // Authentication endpoints (more restrictive)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  },
  
  // AI endpoints (resource intensive)
  ai: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
  },
  
  // Public content (less restrictive)
  public: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
  },
} as const;

/**
 * Create rate limit response
 */
export function createRateLimitResponse(headers: Record<string, string>): Response {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    }),
    {
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

/**
 * Rate limit check for loader functions
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): { allowed: boolean; response?: Response } {
  const limiter = rateLimit(config);
  const result = limiter(request);
  
  if (!result.allowed) {
    return {
      allowed: false,
      response: createRateLimitResponse(result.headers),
    };
  }
  
  return { allowed: true };
}

/**
 * Apply rate limiting to a loader or action function
 */
export function withRateLimit<T extends (...args: any[]) => any>(
  handler: T,
  config: RateLimitConfig
): T {
  return ((...args: Parameters<T>) => {
    const request = args[0]?.request as Request;
    
    if (request) {
      const rateLimitResult = checkRateLimit(request, config);
      if (!rateLimitResult.allowed && rateLimitResult.response) {
        return rateLimitResult.response;
      }
    }
    
    return handler(...args);
  }) as T;
}

/**
 * Get rate limit statistics (useful for monitoring)
 */
export function getRateLimitStats(): {
  totalEntries: number;
  oldestEntry: number | null;
  newestEntry: number | null;
} {
  const now = Date.now();
  let oldestEntry: number | null = null;
  let newestEntry: number | null = null;
  
  for (const entry of rateLimitStore.values()) {
    if (oldestEntry === null || entry.resetTime < oldestEntry) {
      oldestEntry = entry.resetTime;
    }
    if (newestEntry === null || entry.resetTime > newestEntry) {
      newestEntry = entry.resetTime;
    }
  }
  
  return {
    totalEntries: rateLimitStore.size,
    oldestEntry,
    newestEntry,
  };
}