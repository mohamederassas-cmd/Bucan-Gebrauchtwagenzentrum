import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { fmt, localePath, type Locale } from "@/lib/i18n";
import { SITE, whatsappUrl } from "@/lib/site";

interface Props {
  locale: Locale;
  t: Dictionary;
}

/** Text-Ebene des Heros – scrollt normal mit, während die Bühne (HeroStage) stehen bleibt. */
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
    <div className="relative z-10 -mt-[100svh] min-h-svh flex flex-col justify-end">
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-28">
        <div className="max-w-2xl">
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
          <h1 className="rise mt-6 font-serif text-ivory-50 text-[2.9rem] leading-[0.98] sm:text-6xl lg:text-7xl xl:text-[5.4rem] tracking-[-0.01em]" style={delay(1)}>
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

        {/* Trust-Leiste */}
        <div className="rise mt-10 sm:mt-14" style={delay(4)}>
          <ul className="glass-light rounded-2xl sm:rounded-full px-5 sm:px-7 py-3.5 flex items-center gap-x-6 sm:gap-x-0 overflow-x-auto no-scrollbar sm:overflow-visible sm:justify-between">
            {trust.map((item, i) => (
              <li key={item} className="flex items-center gap-x-6 whitespace-nowrap text-ivory-50/85 text-[13px] sm:text-sm font-medium">
                {i > 0 && <span className="hidden sm:block w-1 h-1 rounded-full bg-gold-400" aria-hidden="true" />}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
