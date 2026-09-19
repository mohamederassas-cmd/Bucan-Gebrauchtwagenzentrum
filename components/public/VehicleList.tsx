"use client";

import { useState, useMemo } from "react";
import { Vehicle, VehicleStatus, FuelType, TransmissionType, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";
import { fmt } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";
import CarCard from "./CarCard";
import { SlidersHorizontal, X } from "lucide-react";

interface Props {
  vehicles: Vehicle[];
}

export default function VehicleList({ vehicles }: Props) {
  const { t, locale } = useI18n();
  const f = t.vehicles.filters;
  const [status, setStatus] = useState<VehicleStatus | "all">("all");
  const [fuel, setFuel] = useState<FuelType | "all">("all");
  const [transmission, setTransmission] = useState<TransmissionType | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "mileage">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const maxAvailablePrice = useMemo(
    () => Math.max(...vehicles.map((v) => v.price), 10000),
    [vehicles]
  );

  const filtered = useMemo(() => {
    let result = [...vehicles];

    if (status !== "all") result = result.filter((v) => v.status === status);
    if (fuel !== "all") result = result.filter((v) => v.fuel_type === fuel);
    if (transmission !== "all") result = result.filter((v) => v.transmission === transmission);
    result = result.filter((v) => v.price <= maxPrice);

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "mileage": result.sort((a, b) => a.mileage - b.mileage); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [vehicles, status, fuel, transmission, maxPrice, sortBy]);

  const hasFilters = status !== "all" || fuel !== "all" || transmission !== "all" || maxPrice < maxAvailablePrice;

  const resetFilters = () => {
    setStatus("all");
    setFuel("all");
    setTransmission("all");
    setMaxPrice(maxAvailablePrice);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-slate-600 hover:text-accent transition-colors font-medium text-sm"
            >
              <SlidersHorizontal size={16} />
              {showFilters ? f.hide : f.show}
            </button>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors ml-4"
              >
                <X size={13} /> {f.reset}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm hidden sm:block">{f.sort}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label={f.sort}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent"
            >
              <option value="newest">{f.newest}</option>
              <option value="price-asc">{f.priceAsc}</option>
              <option value="price-desc">{f.priceDesc}</option>
              <option value="mileage">{f.mileage}</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {/* Status */}
            <div>
              <label className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-2 block">{f.status}</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: f.all },
                  { value: "available", label: t.vehicles.status.available },
                  { value: "reserved", label: t.vehicles.status.reserved },
                  { value: "sold", label: t.vehicles.status.sold },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value as typeof status)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      status === opt.value
                        ? "bg-accent text-white font-semibold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel */}
            <div>
              <label className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-2 block">{f.fuel}</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as typeof fuel)}
                aria-label={f.fuel}
                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-accent"
              >
                <option value="all">{f.all}</option>
                {FUEL_TYPES.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>{t.vehicles.fuel[fuelType]}</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-2 block">{f.transmission}</label>
              <div className="flex gap-2">
                {[
                  { value: "all", label: f.all },
                  ...TRANSMISSION_TYPES.map((tr) => ({ value: tr, label: t.vehicles.transmission[tr] })),
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTransmission(opt.value as typeof transmission)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      transmission === opt.value
                        ? "bg-accent text-white font-semibold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-2 block">
                {f.maxPrice} <span className="text-accent font-semibold">{formatNumber(maxPrice, locale)} €</span>
              </label>
              <input
                type="range"
                min={0}
                max={maxAvailablePrice}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label={f.maxPrice}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-slate-500 text-sm mb-6 font-medium">
        {filtered.length === 1 ? t.vehicles.foundOne : fmt(t.vehicles.found, { count: filtered.length })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🚗</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t.vehicles.empty}</h3>
          <p className="text-slate-500 text-sm mb-6">{t.vehicles.emptyHint}</p>
          <button onClick={resetFilters} className="btn-outline px-6 py-3 rounded-xl text-sm">
            {t.vehicles.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
}
