import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleById } from "@/lib/vehicles";
import { formatPrice, formatMileage } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/types";
import { getDictionary, toLocale, localePath, fmt } from "@/lib/i18n";
import { SITE, TEL_HREF, whatsappUrl } from "@/lib/site";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import ImageGallery from "@/components/public/ImageGallery";
import JsonLd from "@/components/public/JsonLd";
import { vehicleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Phone, MessageCircle, Gauge, Zap, Fuel, Settings, Palette, Calendar, ArrowLeft } from "lucide-react";

// Keine Vorab-Generierung: neue/gelöschte Fahrzeuge müssen sofort sichtbar sein
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, id } = await params;
  const locale = toLocale(lang);
  const t = getDictionary(locale);
  const vehicle = await getVehicleById(id);
  if (!vehicle) return { title: t.meta.vehicleNotFound };
  const vars = {
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    mileage: formatMileage(vehicle.mileage, locale),
    price: formatPrice(vehicle.price, locale),
  };
  const path = `/fahrzeuge/${vehicle.id}`;
  return {
    title: fmt(t.meta.vehicleTitle, vars),
    description: fmt(t.meta.vehicleDescription, vars),
    alternates: {
      canonical: localePath(locale, path),
      languages: { de: path, en: `/en${path}`, "x-default": path },
    },
    openGraph: vehicle.images[0] ? { images: [vehicle.images[0]] } : undefined,
  };
}

export default async function VehicleDetailPage({ params }: Params) {
  const { lang, id } = await params;
  const locale = toLocale(lang);
  const t = getDictionary(locale);
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const statusColor = STATUS_COLORS[vehicle.status];
  const statusLabel = t.vehicles.status[vehicle.status];
  const vehicleName = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
  const d = t.vehicles.detail;

  const specs = [
    { icon: <Calendar size={16} />, label: d.specs.year, value: vehicle.year.toString() },
    { icon: <Gauge size={16} />, label: d.specs.mileage, value: formatMileage(vehicle.mileage, locale) },
    { icon: <Fuel size={16} />, label: d.specs.fuel, value: t.vehicles.fuel[vehicle.fuel_type] ?? vehicle.fuel_type },
    { icon: <Settings size={16} />, label: d.specs.transmission, value: t.vehicles.transmission[vehicle.transmission] ?? vehicle.transmission },
    ...(vehicle.power_ps ? [{ icon: <Zap size={16} />, label: d.specs.power, value: `${vehicle.power_ps} ${t.units.ps}` }] : []),
    ...(vehicle.color ? [{ icon: <Palette size={16} />, label: d.specs.color, value: vehicle.color }] : []),
  ];

  return (
    <main className="bg-slate-50 min-h-screen">
      <JsonLd
        data={[
          vehicleJsonLd(vehicle, locale),
          breadcrumbJsonLd([
            { name: d.breadcrumbHome, path: localePath(locale, "/") },
            { name: t.vehicles.title, path: localePath(locale, "/fahrzeuge") },
            { name: vehicleName, path: localePath(locale, `/fahrzeuge/${vehicle.id}`) },
          ]),
        ]}
      />
      <Navbar />

      <div className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href={localePath(locale, "/fahrzeuge")}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-accent transition-colors text-sm font-medium mb-8"
          >
            <ArrowLeft size={16} /> {d.back}
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

              <div className="text-3xl font-bold text-accent mb-8">{formatPrice(vehicle.price, locale)}</div>

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
                  <h3 className="text-accent font-semibold tracking-wider text-xs uppercase mb-3">{d.description}</h3>
                  <p className="text-slate-600 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Features */}
              {vehicle.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-accent font-semibold tracking-wider text-xs uppercase mb-3">{d.features}</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature) => (
                      <span key={feature} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">
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
                    href={whatsappUrl(fmt(d.whatsappPrefill, { vehicle: vehicleName }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
                    style={{ background: "#25D366" }}
                  >
                    <MessageCircle size={18} />
                    {d.whatsapp}
                  </a>
                  <a href={TEL_HREF} className="btn-primary flex items-center justify-center gap-3 w-full py-4 rounded-xl text-sm">
                    <Phone size={18} />
                    {SITE.phoneDisplay}
                  </a>
                  <a href={TEL_HREF} className="btn-outline flex items-center justify-center gap-3 w-full py-4 rounded-xl text-sm">
                    {d.testDrive}
                  </a>
                </div>
              )}
              {vehicle.status === "sold" && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                  <div className="text-2xl mb-2">🚗</div>
                  <p className="text-navy font-semibold">{d.sold}</p>
                  <p className="text-slate-500 text-sm mt-1">{d.soldHint}</p>
                  <Link href={localePath(locale, "/fahrzeuge")} className="inline-block mt-4 btn-primary px-6 py-3 rounded-xl text-sm">
                    {d.more}
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
