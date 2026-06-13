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
