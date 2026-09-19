import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  VehicleFormData,
  VehicleStatus,
  FuelType,
  TransmissionType,
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

  // Alle anderen Felder: über die Vollvalidierung eines gemergten Objekts wäre
  // sauberer, aber PATCH wird im Admin nur für status/featured genutzt.
  const allowed: (keyof VehicleFormData)[] = [
    "make", "model", "year", "mileage", "price", "fuel_type", "transmission",
    "power_ps", "color", "description", "features", "images",
  ];
  const rest: Record<string, unknown> = {};
  for (const key of allowed) if (key in b) rest[key] = b[key];
  if (Object.keys(rest).length > 0) {
    throw new ValidationError("PATCH unterstützt nur status und featured. Bitte PUT verwenden.");
  }
  return out;
}
