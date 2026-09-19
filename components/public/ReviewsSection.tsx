"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { fmt } from "@/lib/i18n";
import Reveal from "./Reveal";

const reviews = [
  {
    name: "mobile.de Nutzer",
    rating: 5,
    text: "Korrekter, ehrlicher Verkäufer. Tolles Auto. Gerne wieder.",
    date: "16.05.2026",
  },
  {
    name: "Said",
    rating: 5,
    text: "Very good experience. Fair prices, honest seller and transparent communication. Everything was handled professionally and without any issues. Highly recommended.",
    date: "06.01.2026",
  },
  {
    name: "mobile.de Nutzer",
    rating: 5,
    text: "Ich habe einen BMW 6er aus erster Hand mit lückenlos gepflegter Historie gekauft. Der Ablauf war freundlich, ehrlich und professionell. Bin sehr zufrieden mit dem Kauf – jederzeit gerne wieder!",
    date: "14.11.2025",
  },
  {
    name: "mobile.de Nutzer",
    rating: 5,
    text: "Ich bin sehr zufrieden mit dem Kauf. Herr Bucan hat für mich die Export-Kennzeichen organisiert, alles war schnell und ohne Probleme. Die Abwicklung war einfach und professionell. Sehr freundlicher Kontakt, vielen Dank, gerne wieder!",
    date: "09.11.2025",
  },
  {
    name: "mobile.de Nutzer",
    rating: 5,
    text: "Ich bin sehr zufrieden mit dem Autokauf! Das Fahrzeug entsprach genau der Beschreibung, war in einem sehr guten Zustand und der gesamte Kaufprozess verlief reibungslos. Der Verkäufer war freundlich, ehrlich und professionell. Ich kann diesen Anbieter nur weiterempfehlen. Vielen Dank!",
    date: "17.05.2025",
  },
  {
    name: "Damir",
    rating: 5,
    text: "Alles Lob an den Verkäufer, angenehmes und sehr freundliches Personal!",
    date: "09.05.2025",
  },
  {
    name: "mobile.de Nutzer",
    rating: 5,
    text: "Ich habe einen Audi A3 von diesem Verkäufer gekauft und bin sehr zufrieden! Das Auto entsprach genau der Beschreibung – es war in ausgezeichnetem Zustand, sauber und technisch einwandfrei. Der Verkäufer war äußerst korrekt, freundlich und bereit, alle Fragen zu beantworten. Ich kann diesen Verkäufer jedem empfehlen. Vielen Dank nochmals!",
    date: "05.05.2025",
  },
  {
    name: "Thommi",
    rating: 5,
    text: "Ich habe hier ein tolles Auto mit kompletter Historie und für sein Baujahr echt wenig Kilometer gekauft. Ich bin super zufrieden und kaufe mir beim nächsten Mal gerne wieder ein Auto hier.",
    date: "16.03.2025",
  },
  {
    name: "mobile.de Nutzer",
    rating: 5,
    text: "Unsere Erfahrung hätte nicht besser sein können – sie kennen sich bestens auf dem Markt aus. Wir können getrost sagen, dass wir beim nächsten Autokauf wiederkommen werden und können sie jedem wärmstens empfehlen, der auf der Suche nach einem neuen Fahrzeug ist.",
    date: "24.02.2025",
  },
  {
    name: "Luay",
    rating: 5,
    text: "Auto in top Zustand mit toller Ausstattung gekauft, Lieferung des Fahrzeugs war auch kein Problem.",
    date: "11.02.2025",
  },
];

export default function ReviewsSection() {
  const { t, locale } = useI18n();
  const [current, setCurrent] = useState(0);
  const perSlide = 3;
  const total = Math.ceil(reviews.length / perSlide);

  // Kein Autoplay: der Besucher behält die Kontrolle.
  const go = (dir: number) => setCurrent((prev) => (prev + dir + total) % total);
  const visible = reviews.slice(current * perSlide, current * perSlide + perSlide);

  const navBtn =
    "w-11 h-11 rounded-full border border-white/12 flex items-center justify-center text-ivory-50/70 hover:text-ivory-50 hover:border-gold-500/60 active:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70";

  return (
    <section id="bewertungen" className="relative py-20 sm:py-28 text-ivory-50">
      <div className="absolute inset-x-0 top-0 hairline" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
        <Reveal className="text-center mb-14">
          <p className="eyebrow eyebrow-dark">{t.reviews.eyebrow}</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">{t.reviews.title}</h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="flex gap-1" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-gold-400 text-gold-400" />
              ))}
            </span>
            <span className="font-serif text-2xl">{SITE.trust.ratingDisplay[locale]}</span>
            <span className="text-ivory-50/55 text-sm">
              · {fmt(t.reviews.count, { count: SITE.trust.reviewCount, source: SITE.trust.reviewsSource })}
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12" aria-live="polite">
          {visible.map((review, i) => (
            <figure key={`${current}-${i}`} className="surface-dark p-7 flex flex-col">
              <div className="flex gap-1 mb-5" aria-label={`${review.rating} / 5`}>
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={13} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <blockquote className="font-serif text-xl leading-snug text-ivory-50/90 flex-1">
                &bdquo;{review.text}&ldquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-white/8">
                <div className="font-semibold text-sm">{review.name === "mobile.de Nutzer" ? t.reviews.anonymous : review.name}</div>
                <div className="text-xs text-ivory-50/45 mt-1">{t.reviews.badge} · {review.date}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label={t.reviews.prev} className={navBtn}>
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {[...Array(total)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={fmt(t.reviews.goTo, { n: i + 1 })}
                aria-current={i === current ? "true" : undefined}
                className={`h-1.5 rounded-full transition-[background-color,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70 ${
                  i === current ? "bg-gold-400 w-7" : "bg-white/20 w-1.5 hover:bg-white/40 scale-100"
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label={t.reviews.next} className={navBtn}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
