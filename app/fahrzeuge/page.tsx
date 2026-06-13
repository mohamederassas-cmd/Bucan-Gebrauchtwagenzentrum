import { getAllVehicles } from "@/lib/vehicles";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import VehicleList from "@/components/public/VehicleList";

export const metadata = {
  title: "Fahrzeuge – BB Gebrauchtwagen München",
  description: "Alle verfügbaren Fahrzeuge bei BB Gebrauchtwagen München. Geprüfte Gebrauchtwagen aller Marken zu fairen Festpreisen.",
};

export default function FahrzeugePage() {
  const vehicles = getAllVehicles();

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* Page Header */}
      <div className="pt-32 pb-16 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">
            Unser Bestand
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Alle Fahrzeuge
          </h1>
          <p className="text-slate-500 text-lg">
            {vehicles.filter((v) => v.status !== "sold").length} Fahrzeuge verfügbar
          </p>
        </div>
      </div>

      {/* Vehicle List with Filters */}
      <VehicleList vehicles={vehicles} />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
