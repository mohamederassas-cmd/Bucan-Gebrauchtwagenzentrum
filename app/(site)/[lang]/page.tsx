import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import ReviewsSection from "@/components/public/ReviewsSection";
import ContactSection from "@/components/public/ContactSection";
import CarCard from "@/components/public/CarCard";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import CookieBanner from "@/components/public/CookieBanner";
import { getFeaturedVehicles } from "@/lib/vehicles";
import { getDictionary, toLocale, localePath } from "@/lib/i18n";
import Link from "next/link";
import { Shield, ShieldCheck, Clock, CheckCircle, ArrowRight } from "lucide-react";

// Bestand ändert sich im Admin → Seite immer serverseitig frisch rendern
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = toLocale((await params).lang);
  return {
    alternates: {
      canonical: localePath(locale, "/"),
      languages: { de: "/", en: "/en", "x-default": "/" },
    },
  };
}

export default async function Home({ params }: Params) {
  const locale = toLocale((await params).lang);
  const t = getDictionary(locale);
  const featuredVehicles = await getFeaturedVehicles();

  const stats = [
    { value: "500+", label: t.about.stats.customers },
    { value: locale === "en" ? "5.0★" : "5,0★", label: t.about.stats.rating },
    { value: "56", label: t.about.stats.reviews },
    { value: "Hofolding", label: t.about.stats.location },
  ];

  const usps = [
    { icon: <Shield size={24} className="text-accent" />, ...t.about.usps.checked },
    { icon: <ShieldCheck size={24} className="text-accent" />, ...t.about.usps.warranty },
    { icon: <Clock size={24} className="text-accent" />, ...t.about.usps.fast },
    { icon: <CheckCircle size={24} className="text-accent" />, ...t.about.usps.transparent },
  ];

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Services / USP Highlights */}
      <ServicesSection />

      {/* Featured Vehicles */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-4">
              {t.featured.eyebrow}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t.featured.title}
            </h2>
            <div className="section-divider" />
          </div>

          {featuredVehicles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredVehicles.map((vehicle) => (
                  <CarCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href={localePath(locale, "/fahrzeuge")}
                  className="inline-flex items-center gap-2 btn-outline px-8 py-4 rounded-xl text-sm"
                >
                  {t.featured.all} <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-500">{t.featured.empty}</div>
          )}
        </div>
      </section>

      {/* About / USPs */}
      <section id="ueber-uns" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-4">
                {t.about.eyebrow}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {t.about.title1}
                <br />
                <span className="text-accent">{t.about.title2}</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">{t.about.p1}</p>
              <p className="text-slate-600 leading-relaxed mb-8">{t.about.p2}</p>
              <div className="flex flex-wrap gap-8">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold text-navy">{s.value}</div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {usps.map((usp) => (
                <div key={usp.title} className="card p-6 hover:border-accent/30">
                  <div className="mb-3">{usp.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{usp.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{usp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection />

      {/* Contact & Map */}
      <ContactSection />

      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </main>
  );
}
