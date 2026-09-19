/**
 * Sehr einfaches In-Memory-Limit pro Schlüssel (z. B. IP). Auf Vercel lebt es nur
 * pro Function-Instanz – also ein Tempolimit, kein Schutzwall. Der eigentliche
 * Schutz sind Form-Token, Honeypot und Replay-Prüfung (lib/form-token.ts).
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    // Speicher begrenzen: älteste Einträge verwerfen
    for (const k of Array.from(buckets.keys()).slice(0, 1000)) buckets.delete(k);
  }
  return true;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip") ?? "unknown").trim();
}
