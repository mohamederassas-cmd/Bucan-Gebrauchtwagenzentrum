import path from "node:path";
import { createVersionedJsonStore } from "./blob-json-store";

/**
 * Einstellungen des Admin-Bereichs. Aktuell nur das Passwort (als scrypt-Hash).
 * Der Blob-Store ist öffentlich lesbar → hier dürfen nie Klartext-Geheimnisse liegen.
 */
export interface AdminSettings {
  version: 1;
  admin: {
    /** scrypt-Hash oder null, solange noch das Startpasswort (Env/Fallback) gilt */
    passwordHash: string | null;
    updatedAt: string | null;
  };
}

const EMPTY: AdminSettings = { version: 1, admin: { passwordHash: null, updatedAt: null } };

const store = createVersionedJsonStore<AdminSettings>({
  prefix: "data/settings/v",
  localFile: path.join(process.cwd(), "data", "settings.json"),
  cacheTag: "settings",
  keepVersions: 3,
  revalidateSeconds: 300,
  parse: (text) => {
    const parsed = JSON.parse(text);
    return { ...EMPTY, ...parsed, admin: { ...EMPTY.admin, ...(parsed?.admin ?? {}) } };
  },
  empty: EMPTY,
});

export async function getSettings(): Promise<AdminSettings> {
  try {
    return await store.read();
  } catch (err) {
    console.error("Einstellungen konnten nicht gelesen werden:", err);
    throw err;
  }
}

export async function getAdminPasswordHash(): Promise<string | null> {
  return (await getSettings()).admin.passwordHash;
}

/** true, solange noch kein eigenes Passwort gesetzt wurde (Env-/Fallback-Passwort aktiv). */
export async function isUsingBootstrapPassword(): Promise<boolean> {
  return (await getAdminPasswordHash()) === null;
}

export async function saveAdminPasswordHash(hash: string): Promise<void> {
  const current = await getSettings();
  await store.write({
    ...current,
    admin: { passwordHash: hash, updatedAt: new Date().toISOString() },
  });
}
