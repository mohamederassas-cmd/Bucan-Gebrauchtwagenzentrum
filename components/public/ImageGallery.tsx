"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const fallback = "https://placehold.co/800x600/EFF6FF/1E3A8A?text=BB+Gebrauchtwagen";
  const imgs = images.length > 0 ? images : [fallback];

  const prev = () => setCurrent((c) => (c - 1 + imgs.length) % imgs.length);
  const next = () => setCurrent((c) => (c + 1) % imgs.length);

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 group">
          <Image
            src={imgs[current]}
            alt={`${title} – Bild ${current + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => setLightbox(true)}
              className="bg-white/90 border border-slate-200 p-3 rounded-full text-slate-700 hover:text-accent hover:scale-110 transition-all"
            >
              <Expand size={20} />
            </button>
          </div>
          {/* Arrows */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 border border-slate-200 w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-accent hover:scale-110 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 border border-slate-200 w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-accent hover:scale-110 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          {/* Counter */}
          {imgs.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-xs text-slate-700 font-medium">
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
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`${title} Thumbnail ${i + 1}`}
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
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={next}
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
