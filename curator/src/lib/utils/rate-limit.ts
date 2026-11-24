/**
 * In-memory rate limiting (per serverless isolate — not global).
 */

import { RATE_LIMIT_REQUESTS_PER_MINUTE, MINUTE_MS } from '@/lib/constants';

export { RATE_LIMIT_REQUESTS_PER_MINUTE, MINUTE_MS };

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple rate limiter
 * @param identifier - Unique identifier for the rate limit (e.g., IP address, user ID)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limited
 */
function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const key = identifier;

  // Clean up expired entries periodically
  // Use a more aggressive cleanup strategy: clean up every 100th request
  // This ensures memory doesn't grow unbounded while keeping performance good
  const cleanupThreshold = 100;
  const entryCount = Object.keys(store).length;
  if (entryCount > 0 && (entryCount % cleanupThreshold === 0 || Math.random() < 0.02)) {
    // Clean up expired entries
    Object.keys(store).forEach((k) => {
      if (store[k].resetTime < now) {
        delete store[k];
      }
    });
  }

  const entry = store[key];

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return true;
  }

  if (entry.count >= maxRequests) {
    return false; // Rate limited
  }

  entry.count++;
  return true;
}

/**
 * Get rate limit info for an identifier
 * @param identifier - Unique identifier for the rate limit
 * @param maxRequests - Maximum number of requests allowed (used to calculate remaining)
 * @returns Rate limit info with remaining requests and reset time, or null if no active limit
 */
function getRateLimitInfo(
  identifier: string,
  maxRequests: number
): { remaining: number; resetTime: number } | null {
  const entry = store[identifier];
  if (!entry || entry.resetTime < Date.now()) {
    return null;
  }
  return {
    remaining: Math.max(0, maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

/**
 * Client IP for rate-limit buckets.
 *
 * Vercel overwrites `x-vercel-forwarded-for` on inbound requests, so that
 * value is the client IP only when `VERCEL` is set. `x-forwarded-for`,
 * `cf-connecting-ip`, and `x-real-ip` are caller-controlled, so off Vercel
 * every request shares `unknown` and a rotated header cannot mint a new bucket.
 */
export function resolveClientIp(request: Request): string {
  const vercel = request.headers.get('x-vercel-forwarded-for')?.trim();
  if (vercel && process.env.VERCEL) {
    return vercel.split(',')[0].trim() || 'unknown';
  }
  return 'unknown';
}

/**
 * Bucket per endpoint path (per client): one vault page fans out to ~10 BFF
 * routes and tab switches refetch several of them, so a single shared `api`
 * bucket let ordinary navigation trip 429s. Each path still gets its own
 * `maxRequests` per window, which keeps the per-endpoint abuse throttle.
 *
 * Route template, not the raw path: hex ids (vault / market / tx) collapse
 * to `:id`, so varying an id cannot mint a fresh budget.
 */
export function rateLimitIdentifier(request: Request, bucket = 'api'): string {
  let path = '';
  try {
    path = new URL(request.url).pathname
      .toLowerCase()
      .replace(/\/0x[0-9a-f]+/g, '/:id');
  } catch {
    path = '';
  }
  return `${bucket}:${path}:${resolveClientIp(request)}`;
}

export function createRateLimitMiddleware(
  maxRequests: number,
  windowMs: number,
  bucket = 'api'
) {
  return (request: Request): { allowed: boolean; headers?: Headers } => {
    const identifier = rateLimitIdentifier(request, bucket);

    const allowed = rateLimit(identifier, maxRequests, windowMs);

    if (!allowed) {
      const info = getRateLimitInfo(identifier, maxRequests);
      const headers = new Headers();
      if (info) {
        headers.set('X-RateLimit-Limit', maxRequests.toString());
        headers.set('X-RateLimit-Remaining', '0');
        headers.set('X-RateLimit-Reset', Math.ceil(info.resetTime / 1000).toString());
      }
      return { allowed: false, headers };
    }

    const info = getRateLimitInfo(identifier, maxRequests);
    const headers = new Headers();
    if (info) {
      headers.set('X-RateLimit-Limit', maxRequests.toString());
      headers.set('X-RateLimit-Remaining', info.remaining.toString());
      headers.set('X-RateLimit-Reset', Math.ceil(info.resetTime / 1000).toString());
    }
    return { allowed: true, headers };
  };
}

