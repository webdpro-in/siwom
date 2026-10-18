/**
 * Simple sliding-window rate limit, in memory. Good enough for one server
 * instance; on serverless platforms each instance keeps its own window, so
 * use a shared store (for example Upstash Redis or Vercel KV) in production.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, { limit = 5, windowMs = 60 * 60 * 1000 } = {}) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    return { ok: false as const, retryAfter };
  }
  recent.push(now);
  buckets.set(key, recent);
  // Keep the map from growing without bound.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return { ok: true as const, remaining: limit - recent.length };
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
