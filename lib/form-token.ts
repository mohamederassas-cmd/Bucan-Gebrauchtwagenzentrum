import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Signiertes Formular-Token gegen Bots und Replay:
 *   <draftId>.<ausgestelltUm>.<hmac>
 * - draftId: zufällig, dient als Anfrage-ID und als Ordner für hochgeladene Fotos
 * - Mindestalter (Bots senden sofort) und Höchstalter (abgelaufene Seiten)
 * Zustandslos, braucht keine Datenbank; die Einmaligkeit prüft lib/inquiries.ts
 * (Ordner darf beim Anlegen noch nicht existieren).
 */
const PREFIX = "inq-v1";

function secret(): string {
  return process.env.SESSION_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "bucan-dev-session-secret";
}

function sign(draftId: string, ts: number): string {
  return createHmac("sha256", secret()).update(`${PREFIX}:${draftId}:${ts}`).digest("hex");
}

export function issueFormToken(): string {
  const draftId = randomBytes(16).toString("hex");
  const ts = Date.now();
  return `${draftId}.${ts}.${sign(draftId, ts)}`;
}

export class FormTokenError extends Error {}

export interface VerifiedFormToken {
  draftId: string;
  issuedAt: number;
}

export function verifyFormToken(
  token: unknown,
  { minAgeMs = 4000, maxAgeMs = 2 * 60 * 60 * 1000 }: { minAgeMs?: number; maxAgeMs?: number } = {}
): VerifiedFormToken {
  if (typeof token !== "string") throw new FormTokenError("Token fehlt.");
  const [draftId, tsRaw, sig] = token.split(".");
  if (!/^[a-f0-9]{32}$/.test(draftId ?? "") || !/^\d+$/.test(tsRaw ?? "") || !/^[a-f0-9]{64}$/.test(sig ?? "")) {
    throw new FormTokenError("Token ungültig.");
  }
  const ts = Number(tsRaw);
  const expected = Buffer.from(sign(draftId, ts), "hex");
  const given = Buffer.from(sig, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    throw new FormTokenError("Token ungültig.");
  }
  const age = Date.now() - ts;
  if (age > maxAgeMs) throw new FormTokenError("Token abgelaufen.");
  if (age < minAgeMs) throw new FormTokenError("Zu schnell gesendet.");
  return { draftId, issuedAt: ts };
}
