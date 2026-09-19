import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { fmt, localePath, type Locale } from "@/lib/i18n";
import { SITE, whatsappUrl } from "@/lib/site";
import HeroCarDrawing from "./HeroCarDrawing";

interface Props {
  locale: Locale;
  t: Dictionary;
}

/** Hero: Text links, gezeichnetes Fahrzeug rechts (mobil oben), über der festen Bühne (SiteBackground). */
export default function HeroContent({ locale, t }: Props) {
  const h = t.hero;
  const trust = [
    fmt(h.trust.customers, { customers: SITE.trust.customers }),
    h.trust.warranty,
    h.trust.financing,
    h.trust.delivery,
  ];
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

          {/* Zeichnung: im DOM nach dem Text (H1 bleibt erste Überschrift), mobil optisch oben */}
          <div className="order-first lg:order-none lg:col-span-6">
            <HeroCarDrawing title={h.imageAlt} className="mx-auto max-w-[520px] lg:max-w-none lg:translate-x-4" />
          </div>
        </div>

        {/* Trust-Leiste */}
        <div className="rise mt-12 sm:mt-16" style={delay(4)}>
          <ul className="glass-light rounded-2xl sm:rounded-full px-5 sm:px-7 py-3.5 flex items-center gap-x-6 lg:gap-x-0 overflow-x-auto no-scrollbar lg:overflow-visible lg:justify-between">
            {trust.map((item, i) => (
              <li key={item} className="flex items-center gap-x-6 whitespace-nowrap text-ivory-50/85 text-[13px] sm:text-sm font-medium">
                {i > 0 && <span className="hidden lg:block w-1 h-1 rounded-full bg-gold-400" aria-hidden="true" />}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
