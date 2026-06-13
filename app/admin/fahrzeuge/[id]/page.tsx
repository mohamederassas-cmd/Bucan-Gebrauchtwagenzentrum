import { notFound } from "next/navigation";
import { getVehicleById } from "@/lib/vehicles";
import AdminLayout from "@/components/admin/AdminLayout";
import VehicleForm from "@/components/admin/VehicleForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) notFound();

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
          <h1 className="font-display text-2xl text-[#0F172A] font-bold">
            Fahrzeug bearbeiten
          </h1>
          <p className="text-[#475569] text-sm mt-1">
            {vehicle.make} {vehicle.model} {vehicle.year}
          </p>
        </div>
        <VehicleForm vehicle={vehicle} mode="edit" />
      </div>
    </AdminLayout>
  );
}
