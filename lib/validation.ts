import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  VehicleFormData,
  VehicleStatus,
  FuelType,
  TransmissionType,
  InquiryStatus,
  PurchaseVehicle,
  MAX_INQUIRY_PHOTOS,
} from "./types";

const STATUS_VALUES: VehicleStatus[] = ["available", "reserved", "sold"];

export class ValidationError extends Error {}

function toInt(value: unknown, label: string, min: number, max: number): number {
  const n = typeof value === "string" ? parseInt(value, 10) : Number(value);
  if (!Number.isFinite(n)) throw new ValidationError(`${label} muss eine Zahl sein.`);
  if (n < min || n > max) throw new ValidationError(`${label} liegt außerhalb des gültigen Bereichs.`);
  return Math.round(n);
}

function toStringArray(value: unknown, label: string): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new ValidationError(`${label} ist ungültig.`);
  return value
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.trim())
    .filter(Boolean);
}

function toText(value: unknown, label: string, required = false, maxLen = 5000): string {
  const s = value == null ? "" : String(value).trim();
  if (required && !s) throw new ValidationError(`${label} ist ein Pflichtfeld.`);
  if (s.length > maxLen) throw new ValidationError(`${label} ist zu lang.`);
  return s;
}

/**
 * Prüft ein vollständiges Fahrzeug (POST / PUT). Unbekannte Felder werden verworfen,
 * Zahlen gecastet, Pflichtfelder geprüft. Wirft ValidationError mit deutscher Meldung.
 */
export function validateVehicle(input: unknown): VehicleFormData {
  if (!input || typeof input !== "object") throw new ValidationError("Ungültige Daten.");
  const b = input as Record<string, unknown>;
  const maxYear = new Date().getFullYear() + 1;

  const fuel_type = String(b.fuel_type ?? "");
  if (!FUEL_TYPES.includes(fuel_type as FuelType)) throw new ValidationError("Kraftstoff ist ungültig.");

  const transmission = String(b.transmission ?? "");
  if (!TRANSMISSION_TYPES.includes(transmission as TransmissionType)) throw new ValidationError("Getriebe ist ungültig.");

  const status = String(b.status ?? "available");
  if (!STATUS_VALUES.includes(status as VehicleStatus)) throw new ValidationError("Status ist ungültig.");

  return {
    make: toText(b.make, "Marke", true, 100),
    model: toText(b.model, "Modell", true, 200),
    year: toInt(b.year, "Baujahr", 1900, maxYear),
    mileage: toInt(b.mileage, "Kilometerstand", 0, 5_000_000),
    price: toInt(b.price, "Preis", 0, 100_000_000),
    fuel_type: fuel_type as FuelType,
    transmission: transmission as TransmissionType,
    power_ps: b.power_ps == null || b.power_ps === "" ? null : toInt(b.power_ps, "Leistung", 1, 5000),
    color: toText(b.color, "Farbe", false, 100),
    description: toText(b.description, "Beschreibung", false, 10000),
    features: toStringArray(b.features, "Ausstattung"),
    images: toStringArray(b.images, "Bilder"),
    status: status as VehicleStatus,
    featured: Boolean(b.featured),
    spotlight: Boolean(b.spotlight),
  };
}

/**
 * Prüft ein Teil-Update (PATCH): nur die übergebenen Felder werden validiert.
 */
export function validateVehiclePatch(input: unknown): Partial<VehicleFormData> {
  if (!input || typeof input !== "object") throw new ValidationError("Ungültige Daten.");
  const b = input as Record<string, unknown>;
  const out: Partial<VehicleFormData> = {};

  if ("status" in b) {
    const status = String(b.status);
    if (!STATUS_VALUES.includes(status as VehicleStatus)) throw new ValidationError("Status ist ungültig.");
    out.status = status as VehicleStatus;
  }
  if ("featured" in b) out.featured = Boolean(b.featured);
  if ("spotlight" in b) out.spotlight = Boolean(b.spotlight);

  // Alle anderen Felder: über die Vollvalidierung eines gemergten Objekts wäre
  // sauberer, aber PATCH wird im Admin nur für status/featured/spotlight genutzt.
  const allowed: (keyof VehicleFormData)[] = [
    "make", "model", "year", "mileage", "price", "fuel_type", "transmission",
    "power_ps", "color", "description", "features", "images",
  ];
  const rest: Record<string, unknown> = {};
  for (const key of allowed) if (key in b) rest[key] = b[key];
  if (Object.keys(rest).length > 0) {
    throw new ValidationError("PATCH unterstützt nur status, featured und spotlight. Bitte PUT verwenden.");
  }
  return out;
}

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;
const DEFAULT_PASSWORD_LITERAL = "bucan2024admin";

/**
 * Prüft eine Passwortänderung. Erwartet currentPassword, newPassword, confirmPassword.
 */
export function validatePasswordChange(input: unknown): { currentPassword: string; newPassword: string } {
  if (!input || typeof input !== "object") throw new ValidationError("Ungültige Daten.");
  const b = input as Record<string, unknown>;
  const currentPassword = typeof b.currentPassword === "string" ? b.currentPassword : "";
  const newPassword = typeof b.newPassword === "string" ? b.newPassword : "";
  const confirmPassword = typeof b.confirmPassword === "string" ? b.confirmPassword : "";

  if (!currentPassword) throw new ValidationError("Bitte geben Sie Ihr aktuelles Passwort ein.");
  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    throw new ValidationError(`Das neue Passwort muss mindestens ${PASSWORD_MIN_LENGTH} Zeichen lang sein.`);
  }
  if (newPassword.length > PASSWORD_MAX_LENGTH) {
    throw new ValidationError(`Das neue Passwort darf höchstens ${PASSWORD_MAX_LENGTH} Zeichen lang sein.`);
  }
  if (newPassword !== confirmPassword) throw new ValidationError("Die Passwörter stimmen nicht überein.");
  if (newPassword === currentPassword) {
    throw new ValidationError("Das neue Passwort muss sich vom aktuellen Passwort unterscheiden.");
  }
  if (newPassword === DEFAULT_PASSWORD_LITERAL) {
    throw new ValidationError("Das Standardpasswort kann nicht erneut verwendet werden.");
  }
  return { currentPassword, newPassword };
}

/* ---------------------------------------------------------------------------
 * Anfragen (öffentliche Formulare)
 * ------------------------------------------------------------------------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INQUIRY_STATUS_VALUES: InquiryStatus[] = ["new", "done"];

export interface InquiryContactFields {
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: "de" | "en";
}

function validateContactFields(b: Record<string, unknown>, messageRequired: boolean): InquiryContactFields {
  const name = toText(b.name, "Name", true, 80);
  const email = toText(b.email, "E-Mail", true, 120).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new ValidationError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
  const phone = toText(b.phone, "Telefon", false, 30);
  if (phone && phone.replace(/[^0-9+]/g, "").length < 6) {
    throw new ValidationError("Bitte geben Sie eine gültige Telefonnummer ein.");
  }
  const message = toText(b.message, "Nachricht", messageRequired, 2000);
  if (b.consent !== true) throw new ValidationError("Bitte stimmen Sie der Datenschutzerklärung zu.");
  const locale = b.locale === "en" ? "en" : "de";
  return { name, email, phone, message, locale };
}

/** Kontaktformular der Startseite. */
export function validateContactInquiry(input: unknown): InquiryContactFields {
  if (!input || typeof input !== "object") throw new ValidationError("Ungültige Daten.");
  return validateContactFields(input as Record<string, unknown>, true);
}

/**
 * Ankauf-Formular. Foto-URLs müssen im eigenen Blob-Store unterhalb des
 * Entwurfs-Ordners liegen, damit keine fremden Links eingeschleust werden.
 */
export function validatePurchaseInquiry(
  input: unknown,
  draftId: string
): InquiryContactFields & { vehicle: PurchaseVehicle; photos: string[] } {
  if (!input || typeof input !== "object") throw new ValidationError("Ungültige Daten.");
  const b = input as Record<string, unknown>;
  const contact = validateContactFields(b, false);

  const v = (b.vehicle && typeof b.vehicle === "object" ? b.vehicle : {}) as Record<string, unknown>;
  const fuel_type = String(v.fuel_type ?? "");
  if (!FUEL_TYPES.includes(fuel_type as FuelType)) throw new ValidationError("Bitte wählen Sie den Kraftstoff.");
  const transmission = String(v.transmission ?? "");
  if (!TRANSMISSION_TYPES.includes(transmission as TransmissionType)) throw new ValidationError("Bitte wählen Sie das Getriebe.");
  const year = toInt(v.year, "Erstzulassung (Jahr)", 1970, new Date().getFullYear());
  const month = toInt(v.month, "Erstzulassung (Monat)", 1, 12);

  const vehicle: PurchaseVehicle = {
    make: toText(v.make, "Marke", true, 60),
    model: toText(v.model, "Modell", true, 120),
    first_registration: { month, year },
    mileage: toInt(v.mileage, "Kilometerstand", 0, 2_000_000),
    fuel_type: fuel_type as FuelType,
    transmission: transmission as TransmissionType,
    condition: toText(v.condition, "Zustand", true, 2000),
    price_expectation:
      v.price_expectation == null || v.price_expectation === "" ? null : toInt(v.price_expectation, "Preisvorstellung", 0, 10_000_000),
  };

  const photos = toStringArray(b.photos, "Fotos");
  if (photos.length > MAX_INQUIRY_PHOTOS) throw new ValidationError(`Maximal ${MAX_INQUIRY_PHOTOS} Fotos möglich.`);
  const ownPhoto = new RegExp(
    `^(https://[a-z0-9-]+\\.public\\.blob\\.vercel-storage\\.com/inquiries/${draftId}/|/uploads/inquiries/${draftId}/)`,
    "i"
  );
  for (const url of photos) {
    if (!ownPhoto.test(url)) throw new ValidationError("Ein Foto konnte nicht zugeordnet werden. Bitte laden Sie es erneut hoch.");
  }

  return { ...contact, vehicle, photos };
}

export function validateInquiryPatch(input: unknown): { status: InquiryStatus } {
  if (!input || typeof input !== "object") throw new ValidationError("Ungültige Daten.");
  const status = String((input as Record<string, unknown>).status ?? "");
  if (!INQUIRY_STATUS_VALUES.includes(status as InquiryStatus)) throw new ValidationError("Status ist ungültig.");
  return { status: status as InquiryStatus };
}
