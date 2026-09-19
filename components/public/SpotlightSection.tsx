"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";
import { fmt } from "@/lib/i18n";
import { formatPrice, formatMileage } from "@/lib/utils";
import { placeholderImage, whatsappUrl } from "@/lib/site";

interface Props {
  vehicle: Vehicle;
}

/** „Fahrzeug der Woche“ – schiebt sich als erste dunkle Fläche über die Hero-Bühne. */
export default function SpotlightSection({ vehicle }: Props) {
  const { t, locale, path } = useI18n();
  const s = t.spotlight;
  const [view, setView] = useState<"main" | "detail">("main");

  const main = vehicle.images[0] || placeholderImage(1200, 800);
  const detail = vehicle.images[1] ?? null;
  const name = `${vehicle.make} ${vehicle.model}`;

  const specs = [
    { label: s.firstReg, value: String(vehicle.year) },
    { label: s.mileage, value: formatMileage(vehicle.mileage, locale) },
    ...(vehicle.power_ps ? [{ label: s.power, value: `${vehicle.power_ps} ${t.units.ps}` }] : []),
    { label: s.fuel, value: t.vehicles.fuel[vehicle.fuel_type] ?? vehicle.fuel_type },
    { label: s.transmission, value: t.vehicles.transmission[vehicle.transmission] ?? vehicle.transmission },
  ];

  const toggle = (v: "main" | "detail", label: string) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70 ${
        view === v ? "bg-ivory-50 text-ink" : "text-ivory-50/70 hover:text-ivory-50 active:text-gold-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section
      id="fahrzeug-der-woche"
      className="relative text-ivory-50"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Bildbühne */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/11] rounded-[1.5rem] overflow-hidden bg-graphite-800 border border-white/8">
              <Image
                src={main}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className={`object-cover transition-[opacity,transform] duration-700 ease-out ${
                  view === "main" ? "opacity-100 scale-100" : detail ? "opacity-0 scale-[1.02]" : "opacity-100 scale-[1.65] object-[68%_62%]"
                }`}
                priority={false}
              />
              {detail && (
                <Image
                  src={detail}
                  alt={`${name} – ${s.viewDetail}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className={`object-cover transition-opacity duration-700 ease-out ${view === "detail" ? "opacity-100" : "opacity-0"}`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Ansicht wechseln */}
              <div className="absolute bottom-4 left-4 glass-light rounded-full p-1 flex gap-1">
                {toggle("main", s.viewMain)}
                {toggle("detail", s.viewDetail)}
              </div>

              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass-light text-[11px] tracking-[0.18em] uppercase text-gold-200 font-semibold">
                {t.vehicles.status[vehicle.status]}
              </div>
            </div>
          </div>

          {/* Daten */}
          <div className="lg:col-span-5">
            <p className="eyebrow eyebrow-dark eyebrow-left">{s.eyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.02] text-ivory-50">
              {vehicle.make} <span className="text-ivory-50/80">{vehicle.model}</span>
            </h2>
            <p className="mt-5 font-serif text-4xl sm:text-5xl text-gold-200 tabular-nums">{formatPrice(vehicle.price, locale)}</p>

            <dl className="mt-8 divide-y divide-white/8 border-y border-white/8">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between py-3 gap-4">
                  <dt className="text-[11px] tracking-[0.18em] uppercase text-ivory-50/50">{spec.label}</dt>
                  <dd className="text-ivory-50 font-medium tabular-nums">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href={path(`/fahrzeuge/${vehicle.id}`)} className="btn-gold px-6 py-3.5 text-sm">
                {s.cta}
                <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappUrl(fmt(s.whatsappPrefill, { vehicle: `${name} (${vehicle.year})` }))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-light px-6 py-3.5 text-sm"
              >
                <MessageCircle size={16} />
                {s.ask}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
