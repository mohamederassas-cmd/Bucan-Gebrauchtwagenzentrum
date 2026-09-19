"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Loader2, X, FileImage } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { fmt } from "@/lib/i18n";
import { INQUIRY_PHOTO_TYPES, MAX_INQUIRY_PHOTOS, MAX_INQUIRY_PHOTO_BYTES } from "@/lib/types";

export interface UploadedPhoto {
  url: string;
  name: string;
  preview: string | null;
}

interface Props {
  token: string;
  /** true = direkter Client-Upload in den Blob-Store (Produktion), false = lokaler Multipart-Fallback */
  clientUpload: boolean;
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  disabled?: boolean;
}

const HEIC = /\.(heic|heif)$/i;

function safeName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]/g, "-").replace(/-+/g, "-").slice(-60);
  return cleaned || "foto.jpg";
}

export default function PhotoUploader({ token, clientUpload, photos, onChange, disabled }: Props) {
  const { t } = useI18n();
  const p = t.purchase.photos;
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const draftId = token.split(".")[0];

  const uploadOne = async (file: File): Promise<string> => {
    if (clientUpload) {
      const blob = await upload(`inquiries/${draftId}/${safeName(file.name)}`, file, {
        access: "public",
        handleUploadUrl: "/api/inquiries/upload",
        clientPayload: token,
      });
      return blob.url;
    }
    const body = new FormData();
    body.append("file", file);
    body.append("token", token);
    const res = await fetch("/api/inquiries/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen");
    return data.url as string;
  };

  const handleFiles = async (list: FileList | null) => {
    if (!list || disabled) return;
    const files = Array.from(list);
    const next: string[] = [];
    const accepted: File[] = [];

    for (const file of files) {
      if (photos.length + accepted.length >= MAX_INQUIRY_PHOTOS) {
        next.push(fmt(p.tooMany, { max: MAX_INQUIRY_PHOTOS }));
        break;
      }
      const typeOk = INQUIRY_PHOTO_TYPES.includes(file.type) || HEIC.test(file.name);
      if (!typeOk) {
        next.push(fmt(p.wrongType, { name: file.name }));
        continue;
      }
      if (file.size > MAX_INQUIRY_PHOTO_BYTES) {
        next.push(fmt(p.tooLarge, { name: file.name }));
        continue;
      }
      accepted.push(file);
    }
    setErrors(next);
    if (accepted.length === 0) return;

    setBusy(accepted.map((f) => f.name));
    const results: UploadedPhoto[] = [];
    for (const file of accepted) {
      try {
        const url = await uploadOne(file);
        const isHeic = HEIC.test(file.name) || /hei[cf]/.test(file.type);
        results.push({ url, name: file.name, preview: isHeic ? null : URL.createObjectURL(file) });
      } catch (err) {
        next.push(err instanceof Error && err.message ? `${file.name}: ${err.message}` : fmt(p.failed, { name: file.name }));
        setErrors([...next]);
      }
      setBusy((b) => b.filter((n) => n !== file.name));
    }
    if (results.length > 0) onChange([...photos, ...results]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (url: string) => {
    const photo = photos.find((x) => x.url === url);
    if (photo?.preview) URL.revokeObjectURL(photo.preview);
    onChange(photos.filter((x) => x.url !== url));
  };

  const full = photos.length >= MAX_INQUIRY_PHOTOS;

  return (
    <div>
      <p className="text-ink-500 text-sm leading-relaxed">{fmt(p.hint, { max: MAX_INQUIRY_PHOTOS })}</p>

      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {photos.map((photo, i) => (
          <div key={photo.url} className="relative aspect-square rounded-xl overflow-hidden border border-sand bg-ivory-200">
            {photo.preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.preview} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-ink-500 gap-1 px-1 text-center">
                <FileImage size={20} />
                <span className="text-[10px] leading-tight">{p.noPreview}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => remove(photo.url)}
              aria-label={p.remove}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-graphite-950/80 text-ivory-50 flex items-center justify-center hover:bg-graphite-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {busy.map((name) => (
          <div key={name} className="aspect-square rounded-xl border border-dashed border-sand bg-ivory-200 flex flex-col items-center justify-center text-ink-500 gap-1">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-[10px]">{p.uploading}</span>
          </div>
        ))}
        {!full && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || busy.length > 0}
            className="aspect-square rounded-xl border border-dashed border-gold-400 bg-gold-50/60 text-gold-700 flex flex-col items-center justify-center gap-1.5 hover:bg-gold-100 active:bg-gold-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
          >
            <ImagePlus size={20} />
            <span className="text-[11px] font-semibold">{p.add}</span>
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
        <span>{fmt(p.count, { n: photos.length, max: MAX_INQUIRY_PHOTOS })}</span>
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1">
          {errors.map((e, i) => (
            <li key={i} className="input-error !mt-0">{e}</li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
