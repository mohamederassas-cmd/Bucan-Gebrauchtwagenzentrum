/**
 * Sprach-Konfiguration. Deutsch ist die Standardsprache ohne URL-Präfix
 * (bestehende URLs bleiben gültig), Englisch liegt unter /en/... .
 * Impressum und Datenschutz existieren nur auf Deutsch.
 */
export const LOCALES = ["de", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";

/** Seiten, die es nur auf Deutsch gibt (ohne /en-Variante). */
export const GERMAN_ONLY_PATHS = ["/impressum", "/datenschutz"];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Hängt bei Englisch das /en-Präfix an einen internen Pfad an. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "de") return path;
  if (GERMAN_ONLY_PATHS.includes(path) || path.startsWith("/admin") || path.startsWith("/api")) return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path}`;
  return `/en${path}`;
}

/** Entfernt ein /en-Präfix vom Browser-Pfad. */
export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
}

/** Ziel-URL des Sprachumschalters für den aktuellen Browser-Pfad. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const base = stripLocale(pathname);
  if (GERMAN_ONLY_PATHS.includes(base)) return to === "en" ? "/en" : base;
  return localePath(to, base);
}

export function intlLocale(locale: Locale): string {
  return locale === "en" ? "en-GB" : "de-DE";
}

export function ogLocale(locale: Locale): string {
  return locale === "en" ? "en_GB" : "de_DE";
}
