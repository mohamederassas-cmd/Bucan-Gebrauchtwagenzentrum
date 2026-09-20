import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { fmt, localePath, type Locale } from "@/lib/i18n";
import { SITE, whatsappUrl } from "@/lib/site";
import HeroCarStage from "./HeroCarStage";
import TrustMarquee from "./TrustMarquee";

interface Props {
  locale: Locale;
  t: Dictionary;
}

/** Hero: Text links, Fahrzeug-Bühne rechts (mobil oben), über der festen Bühne (SiteBackground). */
export default function HeroContent({ locale, t }: Props) {
  const h = t.hero;
  const delay = (n: number) => ({ animationDelay: `${0.25 + n * 0.12}s` });

  return (
    <section className="relative min-h-svh flex items-center pt-28 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-6">
            {/* Bewertungs-Badge */}
            <div className="rise inline-flex items-center gap-2.5 glass-light rounded-full pl-2.5 pr-4 py-1.5" style={delay(0)}>
              <span className="flex gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-gold-400 text-gold-400" />
                ))}
              </span>
              <span className="text-ivory-50/90 text-[13px] font-medium tracking-wide">
                {fmt(h.badge, {
                  rating: SITE.trust.ratingDisplay[locale],
                  count: SITE.trust.reviewCount,
                  source: SITE.trust.reviewsSource,
                })}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="rise mt-6 font-serif text-ivory-50 text-[2.9rem] leading-[0.98] sm:text-6xl lg:text-[4.2rem] xl:text-[5rem] tracking-[-0.01em]"
              style={delay(1)}
            >
              <span className="block">{h.headline[0]}</span>
              <span className="block italic text-gold-200 font-medium">{h.headline[1]}</span>
            </h1>

            <p className="rise mt-6 text-ivory-50/75 text-base sm:text-lg leading-relaxed max-w-xl" style={delay(2)}>
              {h.subline}
            </p>

            {/* CTAs */}
            <div className="rise mt-8 flex flex-col sm:flex-row gap-3" style={delay(3)}>
              <Link href={localePath(locale, "/fahrzeuge")} className="btn-gold px-7 py-4 text-[15px]">
                {h.ctaVehicles}
                <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappUrl(h.whatsappPrefill)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-light px-7 py-4 text-[15px]"
              >
                {h.ctaWhatsapp}
              </a>
            </div>
          </div>

          {/* Fahrzeug: im DOM nach dem Text (H1 bleibt erste Überschrift), mobil optisch oben */}
          <div className="order-first lg:order-none lg:col-span-6">
            <HeroCarStage title={h.imageAlt} className="mx-auto max-w-[560px] lg:max-w-none lg:translate-x-4" />
          </div>
        </div>

        {/* Laufband der Leistungsversprechen */}
        <div className="rise mt-12 sm:mt-16" style={delay(4)}>
          <TrustMarquee t={t} />
        </div>
      </div>
    </section>
  );
}
