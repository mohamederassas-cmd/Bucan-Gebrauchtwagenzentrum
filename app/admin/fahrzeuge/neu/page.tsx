import AdminLayout from "@/components/admin/AdminLayout";
import VehicleForm from "@/components/admin/VehicleForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewVehiclePage() {
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/fahrzeuge"
            className="inline-flex items-center gap-2 text-[#475569] hover:text-[#2563EB] transition-colors text-sm font-accent mb-4"
          >
            <ArrowLeft size={16} /> Zurück
          </Link>
          <h1 className="font-display text-2xl text-[#0F172A] font-bold">Neues Fahrzeug</h1>
          <p className="text-[#475569] text-sm mt-1">Fügen Sie ein neues Fahrzeug zu Ihrem Bestand hinzu</p>
        </div>
        <VehicleForm mode="create" />
      </div>
    </AdminLayout>
  );
}
