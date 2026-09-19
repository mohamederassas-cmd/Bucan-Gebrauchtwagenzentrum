"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function NotFound() {
  const { t, path } = useI18n();
  return (
    <main className="relative z-10 min-h-screen">
      <div className="pt-32 sm:pt-40 pb-20 text-ivory-50">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <p className="eyebrow eyebrow-dark">404</p>
          <h1 className="mt-5 font-serif text-5xl sm:text-6xl">{t.notFound.title}</h1>
          <p className="mt-5 text-ivory-50/65 max-w-md mx-auto">{t.notFound.text}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={path("/")} className="btn-gold px-7 py-3.5 text-sm">
              {t.notFound.home}
            </Link>
            <Link href={path("/fahrzeuge")} className="btn-ghost-light px-7 py-3.5 text-sm">
              {t.notFound.vehicles}
            </Link>
          </div>
        </div>
      </div>
      <div className="hairline" />
      <div className="h-24" />
    </main>
  );
}
