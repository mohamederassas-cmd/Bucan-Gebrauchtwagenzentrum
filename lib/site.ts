/**
 * Zentrale Stammdaten der Website. Keine React-Abhängigkeit, damit die Datei
 * auch aus der Edge-Middleware und aus Server-Code importierbar ist.
 * Alle Kontaktdaten, Öffnungszeiten und externen Links kommen ausschließlich von hier.
 */
export const SITE = {
  name: "Bucan Automobile",
  legalName: "BUCAN AUTOMOBILE – Denis Bucan",
  owner: "Denis Bucan",
  url: "https://bucan-automobile.de",
  phoneDisplay: "0178 302 2999",
  phoneE164: "+491783022999",
  whatsappNumber: "491783022999",
  email: "info@bucan-automobile.de",
  address: {
    street: "Fichtenstrasse 40",
    zip: "85649",
    city: "Hofolding",
    region: "Bayern",
    country: "DE",
  },
  geo: { lat: 47.9776, lng: 11.8065 },
  /** Wochentage als schema.org-Namen; Anzeige-Labels kommen aus den Wörterbüchern. */
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { days: ["Saturday"], opens: "10:00", closes: "15:00" },
  ],
  social: {
    facebook:
      "https://www.facebook.com/profile.php?id=61590425339745&mibextid=wwXIfr&rdid=oTKduCK8B9FXcXB7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BTqK665S5%2F%3Fmibextid%3DwwXIfr%26ref%3D1",
    instagram: "https://www.instagram.com/bucanautomobile?igsh=NTU5M3QzOWZxcHFq&utm_source=qr",
  },
  mapsDirections: "https://www.google.com/maps/dir/?api=1&destination=Fichtenstrasse+40%2C+85649+Hofolding",
  /** Kennzahlen für Badge, Trust-Leiste, Über-uns und strukturierte Daten – nur hier pflegen. */
  trust: {
    rating: 5,
    ratingDisplay: { de: "5,0", en: "5.0" },
    reviewCount: 56,
    reviewsSource: "mobile.de",
    customers: "500+",
  },
} as const;

export const TEL_HREF = `tel:${SITE.phoneE164}`;
export const MAIL_HREF = `mailto:${SITE.email}`;

/** WhatsApp-Link mit vorbelegtem Text. */
export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Platzhalterbild, wenn ein Fahrzeug keine Fotos hat. */
export function placeholderImage(width: number, height: number): string {
  return `https://placehold.co/${width}x${height}/1A1D21/C2A057?text=Bucan+Automobile`;
}
