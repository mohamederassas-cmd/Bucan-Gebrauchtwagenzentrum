import { put, del } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import fs from "node:fs";
import path from "node:path";
import type { Inquiry, InquiryStatus, InquiryType } from "./types";
import { blobEnabled, listPathnames, readBlobText, versionStamp } from "./blob-json-store";
import { isOwnBlobUrl } from "./vehicles";

/**
 * Anfragen-Speicher (Kontakt + Ankauf).
 *
 * Eine Anfrage = ein Ordner `data/inquiries/<id>/` mit unveränderlichen Versionsdateien
 * `<zeitstempel>-<zufall>.json`; die lexikografisch neueste Datei ist der aktuelle Stand.
 * Kein Blob wird je überschrieben (siehe lib/blob-json-store.ts), und da jede Anfrage
 * ihren eigenen Ordner hat, können zwei gleichzeitige Absendungen einander nicht
 * verlieren (anders als beim Listen-Store der Fahrzeuge).
 *
 * Lokal ohne BLOB_READ_WRITE_TOKEN: data/inquiries/<id>.json auf der Festplatte.
 */
const PREFIX = "data/inquiries/";
const CACHE_TAG = "inquiries";
const KEEP_VERSIONS = 2;
const LOCAL_DIR = path.join(process.cwd(), "data", "inquiries");

function localFile(id: string): string {
  return path.join(LOCAL_DIR, `${id}.json`);
}

function parseInquiry(text: string): Inquiry {
  return JSON.parse(text) as Inquiry;
}

function folderOf(pathname: string): string | null {
  const m = pathname.match(/^data\/inquiries\/([a-f0-9]{32})\//);
  return m ? m[1] : null;
}

async function readAllUncached(): Promise<Inquiry[]> {
  if (!blobEnabled()) {
    if (!fs.existsSync(LOCAL_DIR)) return [];
    return fs
      .readdirSync(LOCAL_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => parseInquiry(fs.readFileSync(path.join(LOCAL_DIR, f), "utf-8")))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const pathnames = await listPathnames(PREFIX);
  const newest = new Map<string, string>();
  for (const p of pathnames) {
    const id = folderOf(p);
    if (id) newest.set(id, p); // sortiert → letzter Eintrag pro Ordner gewinnt
  }

  const result: Inquiry[] = [];
  const entries = Array.from(newest.values());
  for (let i = 0; i < entries.length; i += 20) {
    const chunk = entries.slice(i, i + 20);
    const texts = await Promise.all(chunk.map((p) => readBlobText(p).catch(() => null)));
    for (const t of texts) if (t) result.push(parseInquiry(t));
  }
  return result.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

const readAllCached = unstable_cache(readAllUncached, ["inquiries-all"], {
  tags: [CACHE_TAG],
  revalidate: 300,
});

async function writeVersion(inquiry: Inquiry): Promise<void> {
  if (!blobEnabled()) {
    fs.mkdirSync(LOCAL_DIR, { recursive: true });
    fs.writeFileSync(localFile(inquiry.id), JSON.stringify(inquiry, null, 2), "utf-8");
    return;
  }
  const folder = `${PREFIX}${inquiry.id}/`;
  const pathname = `${folder}${versionStamp()}.json`;
  await put(pathname, JSON.stringify(inquiry, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  revalidateTag(CACHE_TAG);
  try {
    const versions = (await listPathnames(folder)).filter((p) => p < pathname);
    const stale = versions.slice(0, Math.max(0, versions.length - (KEEP_VERSIONS - 1)));
    if (stale.length > 0) await del(stale);
  } catch (err) {
    console.error(`Alte Versionen (${folder}) konnten nicht gelöscht werden:`, err);
  }
}

export async function listInquiries(): Promise<Inquiry[]> {
  return blobEnabled() ? readAllCached() : readAllUncached();
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  return (await listInquiries()).find((i) => i.id === id) ?? null;
}

/** Existiert die Anfrage bereits? (Replay-Schutz: ein Token = eine Absendung.) */
export async function inquiryExists(id: string): Promise<boolean> {
  if (!blobEnabled()) return fs.existsSync(localFile(id));
  return (await listPathnames(`${PREFIX}${id}/`)).length > 0;
}

export async function createInquiry(
  data: Omit<Inquiry, "created_at" | "updated_at" | "status">
): Promise<Inquiry> {
  const now = new Date().toISOString();
  const inquiry = { ...data, status: "new", created_at: now, updated_at: now } as Inquiry;
  await writeVersion(inquiry);
  return inquiry;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry | null> {
  const current = await getInquiryById(id);
  if (!current) return null;
  const updated = { ...current, status, updated_at: new Date().toISOString() } as Inquiry;
  await writeVersion(updated);
  return updated;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const current = await getInquiryById(id);
  if (!current) return false;

  if (!blobEnabled()) {
    fs.rmSync(localFile(id), { force: true });
    return true;
  }
  const files = await listPathnames(`${PREFIX}${id}/`);
  if (files.length > 0) await del(files);
  revalidateTag(CACHE_TAG);

  if (current.type === "purchase") {
    const own = current.photos.filter(isOwnBlobUrl);
    if (own.length > 0) {
      try {
        await del(own);
      } catch (err) {
        console.error("Fotos der Anfrage konnten nicht gelöscht werden:", err);
      }
    }
  }
  return true;
}

export async function getInquiryStats(): Promise<{ total: number; open: number; byType: Record<InquiryType, number> }> {
  const all = await listInquiries();
  return {
    total: all.length,
    open: all.filter((i) => i.status === "new").length,
    byType: {
      contact: all.filter((i) => i.type === "contact").length,
      purchase: all.filter((i) => i.type === "purchase").length,
    },
  };
}
