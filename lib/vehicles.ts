import { del } from "@vercel/blob";
import path from "node:path";
import { Vehicle, VehicleFormData } from "./types";
import { createVersionedJsonStore, blobEnabled } from "./blob-json-store";

/**
 * Datenschicht für den Fahrzeugbestand.
 *
 * Produktion: versionierte JSON-Dateien im Vercel-Blob-Store (data/vehicles/v*.json),
 * lokal: data/vehicles.json. Details und Begründung (Blob-Overwrite ist ~15 s stale)
 * in lib/blob-json-store.ts.
 */

function parseVehicles(text: string): Vehicle[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) return [];
  // Ältere Datensätze kennen `spotlight` noch nicht → immer boolesch machen.
  return parsed.map((v: Vehicle) => ({ ...v, spotlight: v.spotlight === true }));
}

/** Es gibt höchstens ein Fahrzeug der Woche: der Gewinner setzt alle anderen zurück (ein einziger Write). */
function applySpotlight(list: Vehicle[], winnerId: string, wants: boolean): Vehicle[] {
  if (!wants) return list;
  return list.map((v) => (v.id === winnerId || !v.spotlight ? v : { ...v, spotlight: false }));
}

const store = createVersionedJsonStore<Vehicle[]>({
  prefix: "data/vehicles/v",
  localFile: path.join(process.cwd(), "data", "vehicles.json"),
  cacheTag: "vehicles",
  keepVersions: 5,
  revalidateSeconds: 300,
  parse: parseVehicles,
  empty: [],
});

const readVehicles = store.read;
const writeVehicles = store.write;

/** Liegt die Bild-URL im eigenen Blob-Store? (Nur dann darf sie mitgelöscht werden.) */
export function isOwnBlobUrl(url: string): boolean {
  return /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(url);
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const vehicles = await readVehicles();
  return [...vehicles].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const vehicles = await readVehicles();
  return vehicles.filter((v) => v.featured && v.status !== "sold");
}

export interface SpotlightSelection {
  /** Fahrzeug, das die Startseite tatsächlich als Fahrzeug der Woche zeigt. */
  vehicle: Vehicle | null;
  /**
   * Gesetzt, wenn ein Fahrzeug markiert ist, aber nicht gezeigt wird (verkauft).
   * Der Admin kann damit erklären, warum die Startseite ein anderes Fahrzeug zeigt.
   */
  hidden: Vehicle | null;
}

/**
 * Welches Fahrzeug zeigt die Startseite als Fahrzeug der Woche und warum?
 * Reihenfolge: markiertes Fahrzeug, sonst erstes Highlight. Verkaufte Fahrzeuge
 * werden übersprungen.
 */
export async function getSpotlightSelection(): Promise<SpotlightSelection> {
  const vehicles = await readVehicles();
  const marked = vehicles.filter((v) => v.spotlight);
  const vehicle =
    marked.find((v) => v.status !== "sold") ??
    vehicles.find((v) => v.featured && v.status !== "sold") ??
    null;
  return {
    vehicle,
    hidden: marked.length > 0 && !vehicle?.spotlight ? marked[0] : null,
  };
}

/** Fahrzeug der Woche für den Startseiten-Showcase; Fallback: erstes Highlight. */
export async function getSpotlightVehicle(): Promise<Vehicle | null> {
  return (await getSpotlightSelection()).vehicle;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const vehicles = await readVehicles();
  return vehicles.find((v) => v.id === id) ?? null;
}

export async function createVehicle(data: VehicleFormData): Promise<Vehicle> {
  const vehicles = await readVehicles();
  const now = new Date().toISOString();
  const newVehicle: Vehicle = {
    ...data,
    id: Date.now().toString(),
    created_at: now,
    updated_at: now,
  };
  await writeVehicles(applySpotlight([newVehicle, ...vehicles], newVehicle.id, newVehicle.spotlight));
  return newVehicle;
}

export async function updateVehicle(
  id: string,
  data: Partial<VehicleFormData>
): Promise<Vehicle | null> {
  const vehicles = await readVehicles();
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return null;
  const updated: Vehicle = {
    ...vehicles[index],
    ...data,
    id: vehicles[index].id,
    created_at: vehicles[index].created_at,
    updated_at: new Date().toISOString(),
  };
  const next = [...vehicles];
  next[index] = updated;
  await writeVehicles(applySpotlight(next, updated.id, data.spotlight === true));
  return updated;
}

export async function deleteVehicle(id: string): Promise<boolean> {
  const vehicles = await readVehicles();
  const vehicle = vehicles.find((v) => v.id === id);
  if (!vehicle) return false;

  await writeVehicles(vehicles.filter((v) => v.id !== id));

  // Hochgeladene Bilder im Blob-Store mit entfernen (best effort)
  if (blobEnabled()) {
    const ownImages = (vehicle.images ?? []).filter(isOwnBlobUrl);
    if (ownImages.length > 0) {
      try {
        await del(ownImages);
      } catch (err) {
        console.error("Bilder konnten nicht gelöscht werden:", err);
      }
    }
  }
  return true;
}

export async function getVehicleStats() {
  const vehicles = await readVehicles();
  return {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    reserved: vehicles.filter((v) => v.status === "reserved").length,
    sold: vehicles.filter((v) => v.status === "sold").length,
  };
}
