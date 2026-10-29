/**
 * Fixed-window rate limiter kept in memory.
 *
 * On Vercel each function instance has its own memory, so this is a speed bump against a single noisy client, not a
 * global guarantee. For a hard limit swap the store for Upstash Redis (`@upstash/ratelimit`) — the call site stays the
 * same.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function check(key: string, now: number = Date.now()): RateLimitResult {
    // Drop expired windows so the map cannot grow without bound.
    if (hits.size > 5_000) {
      for (const [k, entry] of hits) if (entry.resetAt <= now) hits.delete(k);
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: limit - 1, retryAfter: Math.ceil(windowMs / 1000) };
    }
    entry.count += 1;
    const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: entry.count <= limit, remaining: Math.max(0, limit - entry.count), retryAfter };
  };
}

/** The client IP as Vercel reports it (first hop of `x-forwarded-for`). */
export function clientIp(headers: Headers): string {
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
