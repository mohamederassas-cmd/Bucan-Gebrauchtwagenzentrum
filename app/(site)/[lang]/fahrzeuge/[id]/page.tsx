import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleById } from "@/lib/vehicles";
import { formatPrice, formatMileage } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/types";
import { getDictionary, toLocale, localePath, fmt } from "@/lib/i18n";
import { SITE, TEL_HREF, whatsappUrl } from "@/lib/site";
import ImageGallery from "@/components/public/ImageGallery";
import JsonLd from "@/components/public/JsonLd";
import { vehicleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Phone, MessageCircle, Gauge, Zap, Fuel, Settings, Palette, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

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
    <main className="relative z-10 min-h-screen">
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

      {/* Kopfband */}
      <div className="relative text-ivory-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_80%_20%,rgba(194,160,87,0.12),transparent_65%)]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-8">
          <Link
            href={localePath(locale, "/fahrzeuge")}
            className="inline-flex items-center gap-2 text-ivory-50/60 hover:text-ivory-50 active:text-gold-200 transition-colors text-sm font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
          >
            <ArrowLeft size={16} /> {d.back}
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Galerie */}
            <div className="lg:col-span-7">
              <ImageGallery images={vehicle.images} title={`${vehicle.make} ${vehicle.model}`} />
            </div>

            {/* Details */}
            <div className="lg:col-span-5 lg:pt-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-[0.14em] uppercase text-ivory-50/80">
                  <span className={`w-1.5 h-1.5 rounded-full ${vehicle.status === "reserved" ? "status-reserved" : ""}`} style={{ background: statusColor }} aria-hidden="true" />
                  {statusLabel}
                </span>
                <span className="text-ivory-50/55 text-sm tabular-nums">{vehicle.year}</span>
              </div>

              <h1 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.02] text-ivory-50">
                {vehicle.make} <span className="text-ivory-50/75">{vehicle.model}</span>
              </h1>
              <div className="mt-4 font-serif text-4xl sm:text-5xl text-gold-200 tabular-nums">{formatPrice(vehicle.price, locale)}</div>

              {/* Technische Daten */}
              <dl className="mt-8 grid grid-cols-2 gap-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="surface p-4">
                    <div className="flex items-center gap-2 text-gold-300 mb-2">{spec.icon}</div>
                    <dt className="text-ivory-50/55 text-[11px] font-semibold tracking-[0.16em] uppercase">{spec.label}</dt>
                    <dd className="text-ivory-50 font-semibold mt-0.5 tabular-nums">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              {vehicle.description && (
                <div className="mt-10">
                  <h3 className="eyebrow eyebrow-left mb-3">{d.description}</h3>
                  <p className="text-ivory-50/75 leading-relaxed whitespace-pre-line">{vehicle.description}</p>
                </div>
              )}

              {vehicle.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="eyebrow eyebrow-left mb-3">{d.features}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature) => (
                      <li key={feature} className="bg-white/5 border border-white/10 text-ivory-50/80 px-3 py-1.5 rounded-full text-xs font-medium">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {vehicle.status !== "sold" ? (
                <div className="mt-10 space-y-3">
                  <a
                    href={whatsappUrl(fmt(d.whatsappPrefill, { vehicle: vehicleName }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-full font-semibold text-sm text-white bg-[#25D366] transition-[opacity,transform] duration-200 hover:opacity-90 hover:-translate-y-px active:translate-y-0 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-graphite-950 focus-visible:ring-[#25D366]"
                  >
                    <MessageCircle size={18} />
                    {d.whatsapp}
                  </a>
                  <a href={TEL_HREF} className="btn-gold w-full py-4 text-sm">
                    <Phone size={18} />
                    {SITE.phoneDisplay}
                  </a>
                  <a href={TEL_HREF} className="btn-ghost-light w-full py-4 text-sm">
                    {d.testDrive}
                  </a>
                </div>
              ) : (
                <div className="mt-10 surface p-6 text-center">
                  <p className="font-serif text-2xl text-ivory-50">{d.sold}</p>
                  <p className="text-ivory-50/60 text-sm mt-1">{d.soldHint}</p>
                  <Link href={localePath(locale, "/fahrzeuge")} className="btn-gold inline-flex mt-5 px-6 py-3 text-sm">
                    {d.more} <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
