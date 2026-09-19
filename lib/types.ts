export type VehicleStatus = "available" | "reserved" | "sold";

export type FuelType = "Benzin" | "Diesel" | "Elektro" | "Hybrid" | "Erdgas";

export type TransmissionType = "Automatik" | "Manuell";

export interface Vehicle {
  id: string;
  created_at: string;
  updated_at: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  power_ps: number | null;
  color: string | null;
  description: string | null;
  features: string[];
  images: string[];
  status: VehicleStatus;
  featured: boolean;
  /** Genau ein Fahrzeug ist „Fahrzeug der Woche“ (Startseiten-Showcase). */
  spotlight: boolean;
}

export interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  power_ps: number | null;
  color: string;
  description: string;
  features: string[];
  images: string[];
  status: VehicleStatus;
  featured: boolean;
  spotlight: boolean;
}

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Verfügbar",
  reserved: "Reserviert",
  sold: "Verkauft",
};

export const STATUS_COLORS: Record<VehicleStatus, string> = {
  available: "#22c55e",
  reserved: "#f59e0b",
  sold: "#ef4444",
};

export const FUEL_TYPES: FuelType[] = ["Benzin", "Diesel", "Elektro", "Hybrid", "Erdgas"];
export const TRANSMISSION_TYPES: TransmissionType[] = ["Automatik", "Manuell"];

/* ---------------------------------------------------------------------------
 * Anfragen (Kontaktformular und Fahrzeug-Ankauf)
 * ------------------------------------------------------------------------- */
export type InquiryType = "contact" | "purchase";
export type InquiryStatus = "new" | "done";

export interface InquiryBase {
  id: string;
  created_at: string;
  updated_at: string;
  type: InquiryType;
  status: InquiryStatus;
  locale: "de" | "en";
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactInquiry extends InquiryBase {
  type: "contact";
}

export interface PurchaseVehicle {
  make: string;
  model: string;
  first_registration: { month: number; year: number };
  mileage: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  condition: string;
  price_expectation: number | null;
}

export interface PurchaseInquiry extends InquiryBase {
  type: "purchase";
  vehicle: PurchaseVehicle;
  photos: string[];
}

export type Inquiry = ContactInquiry | PurchaseInquiry;

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  contact: "Kontakt",
  purchase: "Ankauf",
};

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "Neu",
  done: "Erledigt",
};

export const MAX_INQUIRY_PHOTOS = 6;
export const MAX_INQUIRY_PHOTO_BYTES = 8 * 1024 * 1024;
export const INQUIRY_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
