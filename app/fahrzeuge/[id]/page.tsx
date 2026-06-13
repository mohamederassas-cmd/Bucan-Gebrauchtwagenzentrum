import { notFound } from "next/navigation";
import { getVehicleById, getAllVehicles } from "@/lib/vehicles";
import { formatPrice, formatMileage } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/types";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import ImageGallery from "@/components/public/ImageGallery";
import { Phone, MessageCircle, Gauge, Zap, Fuel, Settings, Palette, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  const vehicles = getAllVehicles();
  return vehicles.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) return { title: "Fahrzeug nicht gefunden" };
  return {
    title: `${vehicle.make} ${vehicle.model} ${vehicle.year} – Bucan Automobile`,
    description: `${vehicle.make} ${vehicle.model}, ${vehicle.year}, ${formatMileage(vehicle.mileage)}, ${formatPrice(vehicle.price)}. Jetzt bei Bucan Automobile München entdecken.`,
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) notFound();

  const statusColor = STATUS_COLORS[vehicle.status];
  const statusLabel = STATUS_LABELS[vehicle.status];

  const specs = [
    { icon: <Calendar size={16} />, label: "Baujahr", value: vehicle.year.toString() },
    { icon: <Gauge size={16} />, label: "Kilometerstand", value: formatMileage(vehicle.mileage) },
    { icon: <Fuel size={16} />, label: "Kraftstoff", value: vehicle.fuel_type },
    { icon: <Settings size={16} />, label: "Getriebe", value: vehicle.transmission },
    ...(vehicle.power_ps ? [{ icon: <Zap size={16} />, label: "Leistung", value: `${vehicle.power_ps} PS` }] : []),
    ...(vehicle.color ? [{ icon: <Palette size={16} />, label: "Farbe", value: vehicle.color }] : []),
  ];

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/fahrzeuge"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-accent transition-colors text-sm font-medium mb-8"
          >
            <ArrowLeft size={16} /> Zurück zur Übersicht
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <ImageGallery images={vehicle.images} title={`${vehicle.make} ${vehicle.model}`} />
            </div>

            {/* Details */}
            <div>
              {/* Status + Title */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                  style={{
                    background: `${statusColor}20`,
                    border: `1px solid ${statusColor}60`,
                    color: statusColor,
                  }}
                >
                  ● {statusLabel}
                </span>
                <span className="text-slate-500 text-sm font-medium">{vehicle.year}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {vehicle.make} {vehicle.model}
              </h1>

              <div className="text-3xl font-bold text-accent mb-8">
                {formatPrice(vehicle.price)}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {specs.map((spec) => (
                  <div key={spec.label} className="card p-4">
                    <div className="flex items-center gap-2 text-accent mb-1">{spec.icon}</div>
                    <div className="text-slate-500 text-xs font-medium tracking-wider uppercase">{spec.label}</div>
                    <div className="text-slate-900 font-semibold mt-0.5">{spec.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="mb-8">
                  <h3 className="text-accent font-semibold tracking-wider text-xs uppercase mb-3">Beschreibung</h3>
                  <p className="text-slate-600 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Features */}
              {vehicle.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-accent font-semibold tracking-wider text-xs uppercase mb-3">Ausstattung</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature) => (
                      <span
                        key={feature}
                        className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              {vehicle.status !== "sold" && (
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/491734414474?text=Hallo%20BB%20Gebrauchtwagen%2C%20ich%20interessiere%20mich%20f%C3%BCr%20den%20${encodeURIComponent(vehicle.make + " " + vehicle.model + " " + vehicle.year)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                    style={{ background: "#25D366" }}
                  >
                    <MessageCircle size={18} />
                    WhatsApp – Jetzt anfragen
                  </a>
                  <a
                    href="tel:+491734414474"
                    className="btn-primary flex items-center justify-center gap-3 w-full py-4 rounded-xl text-sm"
                  >
                    <Phone size={18} />
                    0173 441 4474
                  </a>
                  <a
                    href="tel:+491734414474"
                    className="btn-outline flex items-center justify-center gap-3 w-full py-4 rounded-xl text-sm"
                  >
                    Probefahrt vereinbaren
                  </a>
                </div>
              )}
              {vehicle.status === "sold" && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                  <div className="text-2xl mb-2">🚗</div>
                  <p className="text-navy font-semibold">Dieses Fahrzeug wurde bereits verkauft.</p>
                  <p className="text-slate-500 text-sm mt-1">Schauen Sie unsere anderen Angebote an.</p>
                  <Link href="/fahrzeuge" className="inline-block mt-4 btn-primary px-6 py-3 rounded-xl text-sm">
                    Weitere Fahrzeuge
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
