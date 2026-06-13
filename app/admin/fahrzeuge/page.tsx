import { getAllVehicles } from "@/lib/vehicles";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminVehicleTable from "@/components/admin/AdminVehicleTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminVehiclesPage() {
  const vehicles = getAllVehicles();

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl text-[#0F172A] font-bold">Fahrzeuge</h1>
            <p className="text-[#475569] text-sm mt-1">{vehicles.length} Fahrzeug{vehicles.length !== 1 ? "e" : ""} im Bestand</p>
          </div>
          <Link href="/admin/fahrzeuge/neu" className="btn-primary px-5 py-2.5 rounded-lg text-sm flex items-center gap-2">
            <Plus size={16} /> Neu hinzufügen
          </Link>
        </div>

        <AdminVehicleTable vehicles={vehicles} />
      </div>
    </AdminLayout>
  );
}
