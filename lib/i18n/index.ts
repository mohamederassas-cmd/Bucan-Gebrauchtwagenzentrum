import { de } from "./de";
import { en } from "./en";
import type { Locale } from "./config";

export type Dictionary = typeof de;

const dictionaries: Record<Locale, Dictionary> = { de, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? de;
}

/** Ersetzt {platzhalter} in einem Text. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : `{${key}}`));
}

export * from "./config";
