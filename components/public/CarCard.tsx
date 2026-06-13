"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gauge, Zap, Fuel, ArrowRight } from "lucide-react";
import { Vehicle, STATUS_LABELS, STATUS_COLORS } from "@/lib/types";
import { formatPrice, formatMileage } from "@/lib/utils";

interface Props {
  vehicle: Vehicle;
}

export default function CarCard({ vehicle }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  const statusColor = STATUS_COLORS[vehicle.status];
  const statusLabel = STATUS_LABELS[vehicle.status];
  const mainImage = vehicle.images[0] || "https://placehold.co/600x400/EFF6FF/1E3A8A?text=BB+Gebrauchtwagen";

  return (
    <div
      ref={cardRef}
      className="car-card-3d group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease-out, box-shadow 0.3s ease" }}
    >
      <Link href={`/fahrzeuge/${vehicle.id}`} className="block">
        <div className="card rounded-xl overflow-hidden hover:shadow-card-hover">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <Image
              src={mainImage}
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Status Badge */}
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
              style={{
                background: `${statusColor}20`,
                border: `1px solid ${statusColor}60`,
                color: statusColor,
              }}
            >
              <span className={vehicle.status === "reserved" ? "status-reserved" : ""}>
                ● {statusLabel}
              </span>
            </div>

            {/* Year badge */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-white/85 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700">
              {vehicle.year}
            </div>

            {/* Price overlay */}
            <div className="absolute bottom-3 left-3">
              <div className="text-white font-bold text-xl drop-shadow-lg">
                {formatPrice(vehicle.price)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {vehicle.make} {vehicle.model}
            </h3>

            {/* Specs row */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Gauge size={13} className="text-accent" />
                {formatMileage(vehicle.mileage)}
              </div>
              {vehicle.power_ps && (
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Zap size={13} className="text-accent" />
                  {vehicle.power_ps} PS
                </div>
              )}
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Fuel size={13} className="text-accent" />
                {vehicle.fuel_type}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <span className="text-slate-400 text-xs font-medium tracking-wide uppercase">
                {vehicle.transmission}
              </span>
              <div className="flex items-center gap-1 text-accent text-sm font-semibold group-hover:gap-2 transition-all">
                Details <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
