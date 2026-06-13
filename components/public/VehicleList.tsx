"use client";

import { useState, useMemo } from "react";
import { Vehicle, VehicleStatus, FuelType, TransmissionType } from "@/lib/types";
import CarCard from "./CarCard";
import { SlidersHorizontal, X } from "lucide-react";

interface Props {
  vehicles: Vehicle[];
}

export default function VehicleList({ vehicles }: Props) {
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
              Filter {showFilters ? "ausblenden" : "einblenden"}
            </button>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors ml-4"
              >
                <X size={13} /> Zurücksetzen
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm hidden sm:block">Sortieren:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="price-asc">Preis aufsteigend</option>
              <option value="price-desc">Preis absteigend</option>
              <option value="mileage">Geringste Laufleistung</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {/* Status */}
            <div>
              <label className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "Alle" },
                  { value: "available", label: "Verfügbar" },
                  { value: "reserved", label: "Reserviert" },
                  { value: "sold", label: "Verkauft" },
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
              <label className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-2 block">Kraftstoff</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as typeof fuel)}
                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-accent"
              >
                <option value="all">Alle</option>
                {["Benzin", "Diesel", "Elektro", "Hybrid", "Erdgas"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-2 block">Getriebe</label>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "Alle" },
                  { value: "Automatik", label: "Automatik" },
                  { value: "Manuell", label: "Manuell" },
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
                Max. Preis: <span className="text-accent font-semibold">{new Intl.NumberFormat("de-DE").format(maxPrice)} €</span>
              </label>
              <input
                type="range"
                min={0}
                max={maxAvailablePrice}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-slate-500 text-sm mb-6 font-medium">
        {filtered.length} Fahrzeug{filtered.length !== 1 ? "e" : ""} gefunden
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
          <h3 className="text-xl font-bold text-slate-900 mb-2">Keine Fahrzeuge gefunden</h3>
          <p className="text-slate-500 text-sm mb-6">Passen Sie die Filter an oder setzen Sie sie zurück.</p>
          <button onClick={resetFilters} className="btn-outline px-6 py-3 rounded-xl text-sm">
            Filter zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
}
