import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ShieldCheck, Clock, CheckCircle, ArrowRight } from "lucide-react";
import HeroStage from "@/components/public/HeroStage";
import HeroContent from "@/components/public/HeroContent";
import SpotlightSection from "@/components/public/SpotlightSection";
import ServicesSection from "@/components/public/ServicesSection";
import ReviewsSection from "@/components/public/ReviewsSection";
import ContactSection from "@/components/public/ContactSection";
import CarCard from "@/components/public/CarCard";
import JsonLd from "@/components/public/JsonLd";
import Reveal from "@/components/public/Reveal";
import { autoDealerJsonLd } from "@/lib/seo";
import { getFeaturedVehicles, getSpotlightVehicle } from "@/lib/vehicles";
import { getDictionary, toLocale, localePath, fmt } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { issueFormToken } from "@/lib/form-token";

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
  const [featured, spotlight] = await Promise.all([getFeaturedVehicles(), getSpotlightVehicle()]);
  const featuredVehicles = featured.filter((v) => v.id !== spotlight?.id).slice(0, 6);
  const formToken = issueFormToken();

  const stats = [
    { value: SITE.trust.customers, label: t.about.stats.customers },
    { value: `${SITE.trust.ratingDisplay[locale]} ★`, label: fmt(t.about.stats.rating, { source: SITE.trust.reviewsSource }) },
    { value: String(SITE.trust.reviewCount), label: t.about.stats.reviews },
  ];

  const usps = [
    { icon: Shield, ...t.about.usps.checked },
    { icon: ShieldCheck, ...t.about.usps.warranty },
    { icon: Clock, ...t.about.usps.fast },
    { icon: CheckCircle, ...t.about.usps.transparent },
  ];

  return (
    <main className="bg-ivory-100 min-h-screen">
      <JsonLd data={autoDealerJsonLd()} />

      {/* Bühne: das Bild bleibt stehen, Text und Folgesektion gleiten darüber */}
      <div className="relative">
        <HeroStage alt={t.hero.imageAlt} />
        <HeroContent locale={locale} t={t} />

        <div className="relative z-20">
          {spotlight && <SpotlightSection vehicle={spotlight} />}

          {/* Highlights */}
          <section
            className={`relative bg-ivory-100 py-20 sm:py-28 ${spotlight ? "" : "rounded-t-[2rem] sm:rounded-t-[2.5rem] shadow-stage"}`}
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-14">
                <p className="eyebrow">{t.featured.eyebrow}</p>
                <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-ink">{t.featured.title}</h2>
              </Reveal>

              {featuredVehicles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                    {featuredVehicles.map((vehicle, i) => (
                      <Reveal key={vehicle.id} delay={Math.min(i, 5) * 80} className="h-full">
                        <CarCard vehicle={vehicle} />
                      </Reveal>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link href={localePath(locale, "/fahrzeuge")} className="btn-outline-ink px-8 py-4 text-sm">
                      {t.featured.all} <ArrowRight size={16} />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-ink-500">{t.featured.empty}</div>
              )}
            </div>
          </section>
        </div>
      </div>

      <ServicesSection />

      {/* Über uns */}
      <section id="ueber-uns" className="py-20 sm:py-28 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <Reveal className="lg:col-span-6">
              <p className="eyebrow eyebrow-left">{t.about.eyebrow}</p>
              <h2 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.02] text-ink">
                {t.about.title1}
                <br />
                <span className="italic text-gold-700">{t.about.title2}</span>
              </h2>
              <p className="mt-6 text-ink-700 leading-relaxed">
                {fmt(t.about.p1, { count: SITE.trust.reviewCount, rating: SITE.trust.ratingDisplay[locale] })}
              </p>
              <p className="mt-4 text-ink-700 leading-relaxed">{t.about.p2}</p>

              <dl className="mt-10 grid grid-cols-3 divide-x divide-sand border-y border-sand">
                {stats.map((s) => (
                  <div key={s.label} className="px-2 sm:px-5 py-5 first:pl-0">
                    <dd className="font-serif text-3xl sm:text-4xl text-ink tabular-nums">{s.value}</dd>
                    <dt className="text-ink-500 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] mt-1">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {usps.map((usp, i) => {
                const Icon = usp.icon;
                return (
                  <Reveal key={usp.title} delay={i * 80} className="h-full">
                    <div className="surface p-6 h-full">
                      <div className="w-10 h-10 rounded-full border border-gold-300 text-gold-600 flex items-center justify-center mb-4">
                        <Icon size={18} strokeWidth={1.75} />
                      </div>
                      <h3 className="font-semibold text-ink mb-1.5">{usp.title}</h3>
                      <p className="text-ink-500 text-sm leading-relaxed">{usp.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />
      <ContactSection formToken={formToken} />
    </main>
  );
}
