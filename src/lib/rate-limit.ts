/**
 * Simple In-Memory Rate Limiter for Serverless Routes
 * This implementation uses a Map as a cache with TTL.
 * Note: Since Next.js API routes are stateless in some deployments (like Vercel),
 * this limiter is "best effort" per instance. For global limiting, a Redis-based 
 * solution (like Upstash) is recommended.
 */

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const cache = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
    limit: number;      // Max requests
    windowMs: number;   // Time window in ms
}

export function rateLimit(identifier: string, options: RateLimitOptions) {
    const now = Date.now();
    const record = cache.get(identifier);

    if (!record || now > record.resetTime) {
        // First request or window expired
        cache.set(identifier, {
            count: 1,
            resetTime: now + options.windowMs,
        });
        return { success: true, remaining: options.limit - 1 };
    }

    if (record.count >= options.limit) {
        return { success: false, remaining: 0 };
    }

    record.count += 1;
    return { success: true, remaining: options.limit - record.count };
}

// Cleanup interval to prevent memory leaks in long-running processes (dev/preview)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of cache.entries()) {
            if (now > record.resetTime) {
                cache.delete(key);
            }
        }
    }, 60000); // Clean up every minute
}
