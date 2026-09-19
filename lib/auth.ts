import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getAdminPasswordHash, saveAdminPasswordHash } from "./settings";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./session-constants";

/**
 * Admin-Authentifizierung (nur Node-Runtime; NIE aus middleware.ts importieren).
 *
 * - Passwort liegt als scrypt-Hash im Settings-Store (lib/settings.ts).
 * - Solange kein Hash gesetzt ist, gilt das Startpasswort aus ADMIN_PASSWORD
 *   bzw. der Fallback (Bootstrap). Nach der ersten Änderung wird es nie mehr genutzt.
 * - Session-Cookie = HMAC-SHA256(secret, hash). Jede Passwortänderung erzeugt einen
 *   neuen Hash → neues Token → alle alten Sitzungen sind ungültig.
 * - Die Edge-Middleware prüft nur das Token-Format; die echte Prüfung ist isAuthenticated().
 */

const FALLBACK_PASSWORD = process.env.ADMIN_PASSWORD || "bucan2024admin";
export const DEFAULT_PASSWORD_LITERAL = "bucan2024admin";
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

function sessionSecret(): string {
  return process.env.SESSION_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "bucan-dev-session-secret";
}

function safeEqual(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyHash(password: string, stored: string): boolean {
  const [alg, N, r, p, saltHex, hashHex] = stored.split("$");
  if (alg !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  return timingSafeEqual(actual, expected);
}

export function deriveSessionToken(passwordHash: string | null): string {
  const material =
    passwordHash ?? `bootstrap:${createHash("sha256").update(FALLBACK_PASSWORD).digest("hex")}`;
  return createHmac("sha256", sessionSecret()).update(`bucan-session-v1:${material}`).digest("hex");
}

export async function currentSessionToken(): Promise<string> {
  return deriveSessionToken(await getAdminPasswordHash());
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const hash = await getAdminPasswordHash();
  return hash ? verifyHash(candidate, hash) : safeEqual(candidate, FALLBACK_PASSWORD);
}

/** Setzt ein neues Passwort und gibt das neue Session-Token zurück. */
export async function changePassword(newPassword: string): Promise<string> {
  const hash = hashPassword(newPassword);
  await saveAdminPasswordHash(hash);
  return deriveSessionToken(hash);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, await currentSessionToken());
}

/** Für Admin-Seiten: leitet nicht angemeldete Besucher zum Login um. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}

export { SESSION_COOKIE };
