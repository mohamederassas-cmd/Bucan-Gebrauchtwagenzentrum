export const CONSENT_KEY = "cookie-consent";

export const CONSENT_EVENT = "cookie-consent-change";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  maps: boolean;
};

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  maps: false,
};

/**
 * Liest die gespeicherte Einwilligung. Gibt `null` zurück, wenn der Besucher
 * noch nicht entschieden hat – dann ist der Cookie-Banner noch offen.
 */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;

  const saved = window.localStorage.getItem(CONSENT_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      maps: parsed.maps === true,
    };
  } catch {
    return null;
  }
}

/**
 * Speichert die Einwilligung und benachrichtigt alle Komponenten im selben Tab
 * (das native `storage`-Event feuert nur in *anderen* Tabs).
 */
export function writeConsent(consent: ConsentState): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
}
