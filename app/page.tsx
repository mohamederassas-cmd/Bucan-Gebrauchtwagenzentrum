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
import Link from "next/link";
import { Shield, Award, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const featuredVehicles = getFeaturedVehicles();

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
              Handverlesen & geprüft
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Aktuelle Highlights
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
                  href="/fahrzeuge"
                  className="inline-flex items-center gap-2 btn-outline px-8 py-4 rounded-xl text-sm"
                >
                  Alle Fahrzeuge ansehen <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-500">
              Derzeit keine Highlights verfügbar.
            </div>
          )}
        </div>
      </section>

      {/* About / USPs */}
      <section id="ueber-uns" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-4">
                Über BB Gebrauchtwagen
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Ihr vertrauensvoller<br />
                <span className="text-accent">Partner in München</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Denis Bucan steht seit Jahren für seriösen Fahrzeughandel in München. Mit über
                91 begeisterten Google-Bewertungen und einem Rating von 5,0 Sternen spricht
                das Ergebnis für sich.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Jedes Fahrzeug in unserem Bestand wird sorgfältig geprüft, transparent
                beschrieben und zu einem fairen Festpreis angeboten. Kein versteckter
                Aufwand, kein Risiko für Sie.
              </p>
              <div className="flex flex-wrap gap-8">
                {[
                  { value: "91", label: "Bewertungen" },
                  { value: "5,0★", label: "Google Rating" },
                  { value: "München", label: "Standort" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold text-navy">{s.value}</div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Shield size={24} className="text-accent" />,
                  title: "Geprüfte Fahrzeuge",
                  desc: "Jedes Auto wird vor dem Verkauf gründlich geprüft.",
                },
                {
                  icon: <Award size={24} className="text-accent" />,
                  title: "Festpreise",
                  desc: "Keine versteckten Kosten. Was Sie sehen, ist was Sie zahlen.",
                },
                {
                  icon: <Clock size={24} className="text-accent" />,
                  title: "Schnelle Abwicklung",
                  desc: "Von der Anfrage bis zur Übergabe in kürzester Zeit.",
                },
                {
                  icon: <CheckCircle size={24} className="text-accent" />,
                  title: "Transparenz",
                  desc: "Vollständige Fahrzeughistorie, keine Überraschungen.",
                },
              ].map((usp) => (
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
