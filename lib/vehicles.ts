import { get, put, del, list } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import fs from "fs";
import path from "path";
import { Vehicle, VehicleFormData } from "./types";

/**
 * Datenschicht für den Fahrzeugbestand.
 *
 * Produktion (Vercel): Das Dateisystem ist schreibgeschützt (EROFS), deshalb liegt
 * der Bestand im Vercel-Blob-Store (BLOB_READ_WRITE_TOKEN).
 *
 * WICHTIG: Ein Blob darf NICHT an Ort und Stelle überschrieben werden – der Store
 * liefert nach einem Overwrite bis zu ~15 s den alten Inhalt, selbst mit
 * useCache:false (gemessen am 19.09.2026). Deshalb schreibt jede Änderung eine
 * neue, unveränderliche Versionsdatei (data/vehicles/v<zeitstempel>-<zufall>.json);
 * gelesen wird immer die lexikografisch neueste. Alte Versionen werden nach dem
 * Schreiben aufgeräumt (die letzten KEEP_VERSIONS bleiben als Sicherung).
 *
 * Lesezugriffe laufen über den Next-Data-Cache (Tag "vehicles"), damit die
 * öffentlichen Seiten nicht bei jedem Aufruf list+get bezahlen. Jede Änderung
 * ruft revalidateTag("vehicles") auf; als Sicherheitsnetz läuft der Cache nach
 * CACHE_SECONDS ohnehin ab.
 *
 * Lokal (kein BLOB_READ_WRITE_TOKEN): data/vehicles.json wird per fs gelesen und
 * geschrieben. Dieselbe Datei dient in Produktion als Startbestand, solange im
 * Store noch keine Version existiert.
 */

const VERSION_PREFIX = "data/vehicles/v";
const KEEP_VERSIONS = 5;
const CACHE_TAG = "vehicles";
const CACHE_SECONDS = 300;
const LOCAL_FILE = path.join(process.cwd(), "data", "vehicles.json");

function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function parseVehicles(text: string): Vehicle[] {
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : [];
}

function readLocalFile(): Vehicle[] {
  try {
    return parseVehicles(fs.readFileSync(LOCAL_FILE, "utf-8"));
  } catch {
    return [];
  }
}

async function listVersionPathnames(): Promise<string[]> {
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: VERSION_PREFIX, cursor, limit: 1000 });
    pathnames.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return pathnames.sort();
}

async function readVehiclesUncached(): Promise<Vehicle[]> {
  if (!blobEnabled()) return readLocalFile();

  const versions = await listVersionPathnames();
  const newest = versions[versions.length - 1];
  if (!newest) return readLocalFile(); // Store noch leer → Startbestand aus dem Repo

  const result = await get(newest, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) {
    throw new Error(`Fahrzeugdaten konnten nicht gelesen werden (${newest})`);
  }
  return parseVehicles(await new Response(result.stream).text());
}

const readVehiclesCached = unstable_cache(readVehiclesUncached, ["vehicles-store"], {
  tags: [CACHE_TAG],
  revalidate: CACHE_SECONDS,
});

async function readVehicles(): Promise<Vehicle[]> {
  // Lokal ohne Blob direkt von der Platte lesen – kein Cache nötig.
  if (!blobEnabled()) return readLocalFile();
  return readVehiclesCached();
}

async function writeVehicles(vehicles: Vehicle[]): Promise<void> {
  const json = JSON.stringify(vehicles, null, 2);

  if (!blobEnabled()) {
    fs.writeFileSync(LOCAL_FILE, json, "utf-8");
    return;
  }

  const stamp = String(Date.now()).padStart(15, "0");
  const pathname = `${VERSION_PREFIX}${stamp}-${Math.random().toString(36).slice(2, 8)}.json`;
  await put(pathname, json, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  revalidateTag(CACHE_TAG);

  // Alte Versionen aufräumen (best effort, blockiert die Antwort nicht bei Fehlern)
  try {
    const versions = await listVersionPathnames();
    const stale = versions.filter((p) => p < pathname).slice(0, -KEEP_VERSIONS + 1);
    if (stale.length > 0) await del(stale);
  } catch (err) {
    console.error("Alte Bestandsversionen konnten nicht gelöscht werden:", err);
  }
}

/** Liegt die Bild-URL im eigenen Blob-Store? (Nur dann darf sie mitgelöscht werden.) */
function isOwnBlobUrl(url: string): boolean {
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
  await writeVehicles([newVehicle, ...vehicles]);
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
  await writeVehicles(next);
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
