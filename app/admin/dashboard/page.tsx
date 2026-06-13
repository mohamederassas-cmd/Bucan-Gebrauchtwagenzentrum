import { getVehicleStats, getAllVehicles } from "@/lib/vehicles";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPrice } from "@/lib/utils";
import { Car, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const stats = getVehicleStats();
  const vehicles = getAllVehicles().slice(0, 5);

  const cards = [
    { label: "Gesamt", value: stats.total, icon: <Car size={24} />, color: "#2563EB" },
    { label: "Verfügbar", value: stats.available, icon: <CheckCircle size={24} />, color: "#22c55e" },
    { label: "Reserviert", value: stats.reserved, icon: <Clock size={24} />, color: "#f59e0b" },
    { label: "Verkauft", value: stats.sold, icon: <TrendingUp size={24} />, color: "#2563EB" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl text-[#0F172A] font-bold">Dashboard</h1>
          <p className="text-[#475569] text-sm mt-1">Übersicht Ihres Fahrzeugbestands</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-[#E2E8F0] shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${card.color}15`, color: card.color }}
                >
                  {card.icon}
                </div>
              </div>
              <div className="text-3xl font-accent font-bold text-[#0F172A]">{card.value}</div>
              <div className="text-[#475569] text-sm mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Vehicles */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="font-display text-lg text-[#0F172A] font-semibold">Letzte Fahrzeuge</h2>
            <Link href="/admin/fahrzeuge" className="text-[#2563EB] text-sm font-accent hover:text-[#1D4ED8] transition-colors">
              Alle ansehen →
            </Link>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {vehicles.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors">
                <div>
                  <div className="text-[#0F172A] font-semibold text-sm">
                    {v.make} {v.model} {v.year}
                  </div>
                  <div className="text-[#475569] text-xs mt-0.5">{v.fuel_type} · {v.transmission}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[#2563EB] font-accent font-semibold">{formatPrice(v.price)}</div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-accent"
                    style={{
                      background: v.status === "available" ? "#22c55e15" : v.status === "reserved" ? "#f59e0b15" : "#ef444415",
                      color: v.status === "available" ? "#22c55e" : v.status === "reserved" ? "#f59e0b" : "#ef4444",
                      border: `1px solid ${v.status === "available" ? "#22c55e40" : v.status === "reserved" ? "#f59e0b40" : "#ef444440"}`,
                    }}
                  >
                    {v.status === "available" ? "Verfügbar" : v.status === "reserved" ? "Reserviert" : "Verkauft"}
                  </span>
                  <Link
                    href={`/admin/fahrzeuge/${v.id}`}
                    className="text-[#475569] hover:text-[#2563EB] transition-colors text-xs font-accent"
                  >
                    Bearbeiten
                  </Link>
                </div>
              </div>
            ))}
            {vehicles.length === 0 && (
              <div className="text-center py-12 text-[#475569] text-sm">
                Noch keine Fahrzeuge vorhanden.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/admin/fahrzeuge/neu" className="btn-primary px-6 py-3 rounded-lg text-sm">
            + Fahrzeug hinzufügen
          </Link>
          <Link href="/fahrzeuge" target="_blank" className="btn-outline px-6 py-3 rounded-lg text-sm">
            Website ansehen
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
