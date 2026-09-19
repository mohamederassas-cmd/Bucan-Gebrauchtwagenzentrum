import { get, put, del, list } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { randomBytes } from "node:crypto";
import fs from "node:fs";

/**
 * Generischer, versionierter JSON-Store auf Vercel Blob mit lokalem Datei-Fallback.
 *
 * Produktion (Vercel): Das Dateisystem ist schreibgeschützt (EROFS), deshalb liegen
 * die Daten im Vercel-Blob-Store (BLOB_READ_WRITE_TOKEN).
 *
 * WICHTIG: Ein Blob darf NICHT an Ort und Stelle überschrieben werden – der Store
 * liefert nach einem Overwrite bis zu ~15 s den alten Inhalt, selbst mit
 * useCache:false (gemessen am 19.09.2026). Deshalb schreibt jede Änderung eine
 * neue, unveränderliche Versionsdatei `<prefix><zeitstempel>-<zufall>.json`;
 * gelesen wird immer die lexikografisch neueste. Alte Versionen werden nach dem
 * Schreiben aufgeräumt (die letzten `keepVersions` bleiben als Sicherung).
 *
 * Lesezugriffe laufen über den Next-Data-Cache (Tag `cacheTag`), jede Änderung ruft
 * revalidateTag auf; als Sicherheitsnetz läuft der Cache nach `revalidateSeconds` ab.
 *
 * Lokal (kein BLOB_READ_WRITE_TOKEN): `localFile` wird per fs gelesen und geschrieben.
 * Dieselbe Datei dient in Produktion als Startbestand, solange im Store keine
 * Version existiert.
 */

export function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** Alle Pfade unter einem Prefix, lexikografisch sortiert (paginiert). */
export async function listPathnames(prefix: string): Promise<string[]> {
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    pathnames.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return pathnames.sort();
}

/** Inhalt eines Blobs als Text – immer am Cache vorbei (siehe Overwrite-Hinweis oben). */
export async function readBlobText(pathname: string): Promise<string> {
  const result = await get(pathname, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) {
    throw new Error(`Daten konnten nicht gelesen werden (${pathname})`);
  }
  return new Response(result.stream).text();
}

/** Zeitstempel-Präfix für versionierte Dateinamen (lexikografisch sortierbar). */
export function versionStamp(): string {
  return `${String(Date.now()).padStart(15, "0")}-${randomBytes(8).toString("hex")}`;
}

export interface VersionedJsonStoreOptions<T> {
  /** z. B. "data/vehicles/v" */
  prefix: string;
  /** Absoluter Pfad der lokalen Datei (Fallback + Startbestand) */
  localFile: string;
  cacheTag: string;
  keepVersions: number;
  revalidateSeconds: number;
  parse: (text: string) => T;
  /** Wert, wenn weder Blob noch lokale Datei existiert */
  empty: T;
}

export interface VersionedJsonStore<T> {
  read: () => Promise<T>;
  write: (value: T) => Promise<void>;
  /** true, wenn im aktiven Backend (Blob bzw. Datei) bereits Daten gespeichert wurden */
  exists: () => Promise<boolean>;
}

export function createVersionedJsonStore<T>(opts: VersionedJsonStoreOptions<T>): VersionedJsonStore<T> {
  function readLocalFile(): T {
    try {
      return opts.parse(fs.readFileSync(opts.localFile, "utf-8"));
    } catch {
      return opts.empty;
    }
  }

  async function listVersionPathnames(): Promise<string[]> {
    const pathnames: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: opts.prefix, cursor, limit: 1000 });
      pathnames.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return pathnames.sort();
  }

  async function readUncached(): Promise<T> {
    if (!blobEnabled()) return readLocalFile();

    const versions = await listVersionPathnames();
    const newest = versions[versions.length - 1];
    if (!newest) return readLocalFile(); // Store noch leer → Startbestand aus dem Repo

    const result = await get(newest, { access: "public", useCache: false });
    if (!result || result.statusCode !== 200) {
      throw new Error(`Daten konnten nicht gelesen werden (${newest})`);
    }
    return opts.parse(await new Response(result.stream).text());
  }

  const readCached = unstable_cache(readUncached, ["json-store", opts.prefix], {
    tags: [opts.cacheTag],
    revalidate: opts.revalidateSeconds,
  });

  return {
    read: () => (blobEnabled() ? readCached() : Promise.resolve(readLocalFile())),

    async write(value: T) {
      const json = JSON.stringify(value, null, 2);
      if (!blobEnabled()) {
        fs.writeFileSync(opts.localFile, json, "utf-8");
        return;
      }

      const stamp = String(Date.now()).padStart(15, "0");
      const pathname = `${opts.prefix}${stamp}-${randomBytes(8).toString("hex")}.json`;
      await put(pathname, json, {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
      revalidateTag(opts.cacheTag);

      // Alte Versionen aufräumen (best effort)
      try {
        const versions = await listVersionPathnames();
        const stale = versions.filter((p) => p < pathname).slice(0, -opts.keepVersions + 1);
        if (stale.length > 0) await del(stale);
      } catch (err) {
        console.error(`Alte Versionen (${opts.prefix}) konnten nicht gelöscht werden:`, err);
      }
    },

    async exists() {
      if (!blobEnabled()) return fs.existsSync(opts.localFile);
      return (await listVersionPathnames()).length > 0;
    },
  };
}
