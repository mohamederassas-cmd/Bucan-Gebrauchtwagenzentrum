import type { CSSProperties } from "react";
import type { Dictionary } from "@/lib/i18n";
import { fmt } from "@/lib/i18n";
import { SITE } from "@/lib/site";

interface Props {
  t: Dictionary;
  className?: string;
}

/**
 * Endlos laufendes Band mit den Leistungsversprechen (früher die statische Trust-Leiste).
 * Reines CSS, kein JavaScript: der Track enthält die Liste zweimal und wandert um 50 %,
 * dadurch ist die Schleife nahtlos. Die zweite Kopie ist aria-hidden, damit Screenreader
 * die Punkte nur einmal vorlesen. Pausiert bei Hover und bei Tastaturfokus; bei
 * prefers-reduced-motion steht das Band still und lässt sich stattdessen scrollen.
 */
export default function TrustMarquee({ t, className = "" }: Props) {
  const h = t.hero;
  const items = [
    fmt(h.trust.customers, { customers: SITE.trust.customers }),
    h.trust.warranty,
    h.trust.financing,
    h.trust.delivery,
    h.trust.purchase,
    h.trust.tradeIn,
    h.trust.history,
    h.trust.testDrive,
  ];

  return (
    <div className={`marquee glass-light rounded-full overflow-hidden py-3.5 ${className}`}>
      <div className="marquee-mask no-scrollbar">
        <div className="marquee-track flex w-max" style={{ "--marquee-dur": "46s" } as CSSProperties}>
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex items-center shrink-0"
              aria-label={copy === 0 ? h.trustLabel : undefined}
              aria-hidden={copy === 1 || undefined}
            >
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center whitespace-nowrap text-ivory-50/85 text-[13px] sm:text-sm font-medium"
                >
                  <span className="w-1 h-1 rounded-full bg-gold-400 mx-5 sm:mx-7" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
