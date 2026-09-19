import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { verifyFormToken } from "@/lib/form-token";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { listPathnames, blobEnabled } from "@/lib/blob-json-store";
import { INQUIRY_PHOTO_TYPES, MAX_INQUIRY_PHOTOS, MAX_INQUIRY_PHOTO_BYTES } from "@/lib/types";

export const dynamic = "force-dynamic";

const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "image/heif": ".heif",
};

/**
 * Öffentlicher Foto-Upload für das Ankauf-Formular.
 *
 * Produktion: Client-Upload direkt in den Blob-Store (Vercel-Functions nehmen max. 4,5 MB
 * Body an, die Fotos dürfen 8 MB haben). Der Server stellt nur ein kurzlebiges Client-Token
 * aus – und nur, wenn das Formular-Token gültig ist, der Pfad im Entwurfs-Ordner liegt und
 * dort noch nicht 6 Fotos liegen.
 *
 * Lokal ohne Blob-Token: klassischer Multipart-Upload nach public/uploads/inquiries/<draftId>/.
 */
export async function POST(req: NextRequest) {
  if (!rateLimit(`upl:${clientIp(req)}`, 40, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Zu viele Uploads. Bitte später erneut versuchen." }, { status: 429 });
  }

  if (!blobEnabled()) return localUpload(req);

  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let draftId: string;
        try {
          draftId = verifyFormToken(clientPayload, { minAgeMs: 0 }).draftId;
        } catch {
          throw new Error("Das Formular ist abgelaufen. Bitte Seite neu laden.");
        }
        const allowed = new RegExp(`^inquiries/${draftId}/[A-Za-z0-9._-]{1,80}$`);
        if (!allowed.test(pathname)) throw new Error("Ungültiger Dateipfad.");

        const existing = await listPathnames(`inquiries/${draftId}/`);
        if (existing.length >= MAX_INQUIRY_PHOTOS) throw new Error(`Maximal ${MAX_INQUIRY_PHOTOS} Fotos möglich.`);

        return {
          allowedContentTypes: [...INQUIRY_PHOTO_TYPES],
          maximumSizeInBytes: MAX_INQUIRY_PHOTO_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
          tokenPayload: draftId,
        };
      },
      onUploadCompleted: async () => {
        /* bewusst leer – Fotos werden erst mit der Anfrage verknüpft */
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function localUpload(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file");
  const token = data.get("token");
  if (!(file instanceof File)) return NextResponse.json({ error: "Keine Datei übermittelt" }, { status: 400 });

  let draftId: string;
  try {
    draftId = verifyFormToken(token, { minAgeMs: 0 }).draftId;
  } catch {
    return NextResponse.json({ error: "Das Formular ist abgelaufen. Bitte Seite neu laden." }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) return NextResponse.json({ error: "Nur JPG, PNG, WebP oder HEIC sind erlaubt." }, { status: 400 });
  if (file.size > MAX_INQUIRY_PHOTO_BYTES) return NextResponse.json({ error: "Datei ist zu groß (max. 8 MB)." }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads", "inquiries", draftId);
  await mkdir(dir, { recursive: true });
  const existing = (await readdir(dir)).length;
  if (existing >= MAX_INQUIRY_PHOTOS) return NextResponse.json({ error: `Maximal ${MAX_INQUIRY_PHOTOS} Fotos möglich.` }, { status: 400 });

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/inquiries/${draftId}/${filename}` });
}
