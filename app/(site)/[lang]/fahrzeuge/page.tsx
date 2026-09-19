import type { Metadata } from "next";
import { getAllVehicles } from "@/lib/vehicles";
import { getDictionary, toLocale, localePath, fmt } from "@/lib/i18n";
import VehicleList from "@/components/public/VehicleList";
import PageHeader from "@/components/public/PageHeader";

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
    <main className="relative z-10 min-h-screen">
      <PageHeader
        eyebrow={t.vehicles.eyebrow}
        title={t.vehicles.title}
        subtitle={fmt(t.vehicles.available, { count: availableCount })}
      />

      {/* Vehicle List with Filters */}
      <VehicleList vehicles={vehicles} />
    </main>
  );
}
