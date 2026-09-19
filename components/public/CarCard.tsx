"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Vehicle, STATUS_COLORS } from "@/lib/types";
import { placeholderImage } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { formatPrice, formatMileage } from "@/lib/utils";

interface Props {
  vehicle: Vehicle;
}

export default function CarCard({ vehicle }: Props) {
  const { t, locale, path } = useI18n();
  const statusColor = STATUS_COLORS[vehicle.status];
  const statusLabel = t.vehicles.status[vehicle.status];
  const mainImage = vehicle.images[0] || placeholderImage(600, 400);

  const specs = [
    String(vehicle.year),
    formatMileage(vehicle.mileage, locale),
    vehicle.power_ps ? `${vehicle.power_ps} ${t.units.ps}` : null,
    t.vehicles.fuel[vehicle.fuel_type] ?? vehicle.fuel_type,
    t.vehicles.transmission[vehicle.transmission] ?? vehicle.transmission,
  ].filter(Boolean) as string[];

  return (
    <Link
      href={path(`/fahrzeuge/${vehicle.id}`)}
      className="group block h-full surface surface-hover overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-graphite-950 cursor-pointer"
    >
      {/* Bild */}
      <div className="relative aspect-[16/10] overflow-hidden bg-graphite-800">
        <Image
          src={mainImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/55 via-transparent to-transparent" aria-hidden="true" />

        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-graphite-950/55 backdrop-blur text-[11px] font-semibold tracking-wide text-ivory-50">
          <span
            className={`w-1.5 h-1.5 rounded-full ${vehicle.status === "reserved" ? "status-reserved" : ""}`}
            style={{ background: statusColor }}
            aria-hidden="true"
          />
          {statusLabel}
        </div>

        <div className="absolute bottom-3 left-4 font-serif text-3xl text-ivory-50 tabular-nums drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
          {formatPrice(vehicle.price, locale)}
        </div>
      </div>

      {/* Inhalt */}
      <div className="p-5">
        <h3 className="text-ivory-50 text-lg font-semibold leading-snug">
          {vehicle.make} <span className="font-normal text-ivory-50/75">{vehicle.model}</span>
        </h3>

        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-ivory-50/55 text-[13px] tabular-nums">
          {specs.map((spec, i) => (
            <li key={spec} className="flex items-center gap-x-3">
              {i > 0 && <span className="w-px h-3 bg-white/15" aria-hidden="true" />}
              {spec}
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
          <span className="text-gold-300 font-semibold inline-flex items-center gap-1.5">
            {t.vehicles.details}
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <span className="hairline w-10 opacity-70" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
