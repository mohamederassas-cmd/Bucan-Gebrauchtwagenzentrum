"use client";

import { placeholderImage } from "@/lib/site";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { fmt } from "@/lib/i18n";

interface Props {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const { t } = useI18n();
  const g = t.vehicles.gallery;
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const fallback = placeholderImage(800, 600);
  const imgs = images.length > 0 ? images : [fallback];

  const prev = () => setCurrent((c) => (c - 1 + imgs.length) % imgs.length);
  const next = () => setCurrent((c) => (c + 1) % imgs.length);

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative aspect-[4/3] rounded-[1.25rem] overflow-hidden bg-ivory-200 border border-sand group">
          <Image
            src={imgs[current]}
            alt={fmt(g.image, { title, n: current + 1 })}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => setLightbox(true)}
              aria-label={g.open}
              className="bg-ivory-50/95 p-3 rounded-full text-ink hover:text-gold-700 transition-[transform,color] duration-200 hover:scale-105 active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
            >
              <Expand size={20} />
            </button>
          </div>
          {/* Arrows */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label={g.prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-ivory-50/95 w-10 h-10 rounded-full flex items-center justify-center text-ink hover:text-gold-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label={g.next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-ivory-50/95 w-10 h-10 rounded-full flex items-center justify-center text-ink hover:text-gold-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          {/* Counter */}
          {imgs.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-graphite-950/70 backdrop-blur px-2.5 py-1 rounded-full text-xs text-ivory-50 font-medium tabular-nums">
              {current + 1} / {imgs.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {imgs.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {imgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-current={i === current ? "true" : undefined}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-[opacity,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70 ${
                  i === current ? "border-gold-500" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={fmt(g.thumbnail, { title, n: i + 1 })}
                  width={80}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            aria-label={g.close}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
            onClick={() => setLightbox(false)}
          >
            <X size={24} />
          </button>
          <div
            className="relative max-w-5xl w-full mx-4 aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imgs[current]}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />
            {imgs.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label={g.prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={next}
                  aria-label={g.next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
