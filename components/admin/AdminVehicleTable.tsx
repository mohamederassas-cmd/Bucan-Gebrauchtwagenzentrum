"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Vehicle, STATUS_COLORS } from "@/lib/types";
import { formatPrice, formatMileage } from "@/lib/utils";
import { Pencil, Trash2, Star, StarOff, ChevronDown } from "lucide-react";

interface Props {
  vehicles: Vehicle[];
}

export default function AdminVehicleTable({ vehicles }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setLoading(id + "-status");
    await fetch(`/api/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    router.refresh();
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    setLoading(id + "-featured");
    await fetch(`/api/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    setLoading(null);
    router.refresh();
  };

  const deleteVehicle = async (id: string, name: string) => {
    if (!confirm(`„${name}" wirklich löschen?`)) return;
    setLoading(id + "-delete");
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  };

  const statusOptions = [
    { value: "available", label: "Verfügbar", color: "#22c55e" },
    { value: "reserved", label: "Reserviert", color: "#f59e0b" },
    { value: "sold", label: "Verkauft", color: "#ef4444" },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-5 py-4 text-xs font-accent text-[#475569] tracking-wider uppercase">Fahrzeug</th>
              <th className="text-left px-5 py-4 text-xs font-accent text-[#475569] tracking-wider uppercase">Preis</th>
              <th className="text-left px-5 py-4 text-xs font-accent text-[#475569] tracking-wider uppercase">km</th>
              <th className="text-left px-5 py-4 text-xs font-accent text-[#475569] tracking-wider uppercase">Status</th>
              <th className="text-left px-5 py-4 text-xs font-accent text-[#475569] tracking-wider uppercase">Featured</th>
              <th className="text-right px-5 py-4 text-xs font-accent text-[#475569] tracking-wider uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {vehicles.map((v) => {
              const isLoading = loading?.startsWith(v.id);
              return (
                <tr key={v.id} className={`hover:bg-[#F8FAFC] transition-colors ${isLoading ? "opacity-50" : ""}`}>
                  {/* Vehicle */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] flex-shrink-0">
                        {v.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={v.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#94A3B8] text-xs">—</div>
                        )}
                      </div>
                      <div>
                        <div className="text-[#0F172A] text-sm font-semibold">{v.make} {v.model}</div>
                        <div className="text-[#475569] text-xs">{v.year} · {v.fuel_type}</div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 text-[#2563EB] font-accent font-semibold">{formatPrice(v.price)}</td>

                  {/* Mileage */}
                  <td className="px-5 py-4 text-[#475569] text-sm">{formatMileage(v.mileage)}</td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-4">
                    <div className="relative">
                      <select
                        value={v.status}
                        onChange={(e) => updateStatus(v.id, e.target.value)}
                        disabled={!!loading}
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-accent cursor-pointer focus:outline-none"
                        style={{
                          background: `${STATUS_COLORS[v.status]}15`,
                          border: `1px solid ${STATUS_COLORS[v.status]}50`,
                          color: STATUS_COLORS[v.status],
                        }}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: STATUS_COLORS[v.status] }} />
                    </div>
                  </td>

                  {/* Featured */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleFeatured(v.id, v.featured)}
                      disabled={!!loading}
                      title={v.featured ? "Von Highlights entfernen" : "Als Highlight setzen"}
                      className="transition-colors"
                    >
                      {v.featured ? (
                        <Star size={18} className="fill-[#2563EB] text-[#2563EB]" />
                      ) : (
                        <StarOff size={18} className="text-[#CBD5E1] hover:text-[#2563EB] transition-colors" />
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/fahrzeuge/${v.id}`}
                        className="w-8 h-8 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#475569] hover:text-[#2563EB] hover:border-[#BFDBFE] hover:bg-[#EFF6FF] transition-all"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => deleteVehicle(v.id, `${v.make} ${v.model}`)}
                        disabled={!!loading}
                        className="w-8 h-8 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#475569] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {vehicles.length === 0 && (
          <div className="text-center py-16 text-[#475569]">
            Noch keine Fahrzeuge.{" "}
            <Link href="/admin/fahrzeuge/neu" className="text-[#2563EB] hover:underline">
              Jetzt hinzufügen →
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#E2E8F0]">
        {vehicles.map((v) => (
          <div key={v.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-[#0F172A] font-semibold">{v.make} {v.model}</div>
                <div className="text-[#475569] text-xs">{v.year} · {formatMileage(v.mileage)} · {v.fuel_type}</div>
              </div>
              <div className="text-[#2563EB] font-accent font-bold text-sm">{formatPrice(v.price)}</div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={v.status}
                onChange={(e) => updateStatus(v.id, e.target.value)}
                className="flex-1 text-xs font-accent rounded-lg px-2 py-1.5 focus:outline-none"
                style={{
                  background: `${STATUS_COLORS[v.status]}15`,
                  border: `1px solid ${STATUS_COLORS[v.status]}50`,
                  color: STATUS_COLORS[v.status],
                }}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Link
                href={`/admin/fahrzeuge/${v.id}`}
                className="w-8 h-8 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#475569] hover:text-[#2563EB] transition-all"
              >
                <Pencil size={14} />
              </Link>
              <button
                onClick={() => deleteVehicle(v.id, `${v.make} ${v.model}`)}
                className="w-8 h-8 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#475569] hover:text-red-600 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
