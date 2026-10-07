import "server-only";

/* ==========================================================================
   Per-IP rate limit for the lead endpoint.

   In-memory, so on serverless each warm instance counts separately. That is
   fine for what this is for: stopping one script from hammering the form and
   flooding the agent's inbox, not metering legitimate traffic.
   ========================================================================== */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

const hits = new Map<string, number[]>();

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** True when this IP has used up its submissions for the window. */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}
