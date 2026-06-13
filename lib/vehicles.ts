import { Vehicle, VehicleFormData } from "./types";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "vehicles.json");

function readVehicles(): Vehicle[] {
  try {
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeVehicles(vehicles: Vehicle[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(vehicles, null, 2), "utf-8");
}

export function getAllVehicles(): Vehicle[] {
  return readVehicles().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getFeaturedVehicles(): Vehicle[] {
  return readVehicles().filter((v) => v.featured && v.status !== "sold");
}

export function getVehicleById(id: string): Vehicle | null {
  return readVehicles().find((v) => v.id === id) ?? null;
}

export function createVehicle(data: VehicleFormData): Vehicle {
  const vehicles = readVehicles();
  const newVehicle: Vehicle = {
    ...data,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  vehicles.unshift(newVehicle);
  writeVehicles(vehicles);
  return newVehicle;
}

export function updateVehicle(id: string, data: Partial<VehicleFormData>): Vehicle | null {
  const vehicles = readVehicles();
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return null;
  vehicles[index] = { ...vehicles[index], ...data, updated_at: new Date().toISOString() };
  writeVehicles(vehicles);
  return vehicles[index];
}

export function deleteVehicle(id: string): boolean {
  const vehicles = readVehicles();
  const filtered = vehicles.filter((v) => v.id !== id);
  if (filtered.length === vehicles.length) return false;
  writeVehicles(filtered);
  return true;
}

export function getVehicleStats() {
  const vehicles = readVehicles();
  return {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    reserved: vehicles.filter((v) => v.status === "reserved").length,
    sold: vehicles.filter((v) => v.status === "sold").length,
  };
}
