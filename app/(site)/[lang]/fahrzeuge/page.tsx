import type { Metadata } from "next";
import { getAllVehicles } from "@/lib/vehicles";
import { getDictionary, toLocale, localePath, fmt } from "@/lib/i18n";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import VehicleList from "@/components/public/VehicleList";

// Bestand ändert sich im Admin → Seite immer serverseitig frisch rendern
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = toLocale((await params).lang);
  const t = getDictionary(locale);
  return {
    title: t.meta.vehiclesTitle,
    description: t.meta.vehiclesDescription,
    alternates: {
      canonical: localePath(locale, "/fahrzeuge"),
      languages: { de: "/fahrzeuge", en: "/en/fahrzeuge", "x-default": "/fahrzeuge" },
    },
  };
}

export default async function FahrzeugePage({ params }: Params) {
  const locale = toLocale((await params).lang);
  const t = getDictionary(locale);
  const vehicles = await getAllVehicles();
  const availableCount = vehicles.filter((v) => v.status !== "sold").length;

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* Page Header */}
      <div className="pt-32 pb-16 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">
            {t.vehicles.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">{t.vehicles.title}</h1>
          <p className="text-slate-500 text-lg">{fmt(t.vehicles.available, { count: availableCount })}</p>
        </div>
      </div>

      {/* Vehicle List with Filters */}
      <VehicleList vehicles={vehicles} />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
