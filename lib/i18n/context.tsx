"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dictionary } from "./index";
import { localePath, type Locale } from "./config";

interface I18nValue {
  locale: Locale;
  t: Dictionary;
  /** Interner Pfad → Pfad in der aktuellen Sprache */
  path: (p: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({ locale, t: dict, path: (p) => localePath(locale, p) }),
    [locale, dict]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n muss innerhalb von <I18nProvider> verwendet werden.");
  return ctx;
}
