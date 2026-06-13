"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Simon van Endern",
    badge: "Local Guide · 293 Bewertungen",
    rating: 5,
    text: "Top! Schnelle Reaktion, freundlich, professionell und zügige Abwicklung. Absolut empfehlenswert und zuverlässig.",
    date: "vor 2 Wochen",
  },
  {
    name: "Mel D.",
    badge: "Verifizierte Käuferin",
    rating: 5,
    text: "Mittwoch angerufen, Donnerstag abgeholt, Freitag abgemeldet. Hervorragende Kommunikation via Telefon und WhatsApp. So schnell und unkompliziert habe ich noch kein Auto verkauft!",
    date: "vor 1 Monat",
  },
  {
    name: "Maike",
    badge: "Verifizierte Käuferin",
    rating: 5,
    text: "Fairer Preis und sehr schnelle, unkomplizierte Abwicklung. Auto wurde abgeholt und sofort abgemeldet. Vertrag und Bezahlung direkt vor Ort. Klare Empfehlung!",
    date: "vor 3 Wochen",
  },
  {
    name: "Susy",
    badge: "Verifizierte Kundin",
    rating: 5,
    text: "Nur Positives zu berichten! Der Kundenservice war wirklich ausgezeichnet! Er kam pünktlich. Perfekte, professionelle und reibungslose Abwicklung!",
    date: "vor 2 Monaten",
  },
  {
    name: "Thomas K.",
    badge: "Verifizierter Käufer",
    rating: 5,
    text: "Sehr seriöser und fairer Händler. Transparente Kommunikation vom ersten Kontakt bis zur Übergabe. Gerne wieder!",
    date: "vor 1 Monat",
  },
  {
    name: "Anna M.",
    badge: "Verifizierte Käuferin",
    rating: 5,
    text: "Bestes Erlebnis beim Autohandel! Alles wurde schnell und fair abgewickelt. Das Fahrzeug war genau wie beschrieben. Absolut empfehlenswert.",
    date: "vor 3 Monaten",
  },
];

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const perSlide = 3;
  const total = Math.ceil(reviews.length / perSlide);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 4500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, total]);

  const go = (dir: number) => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev + dir + total) % total);
  };

  const visible = reviews.slice(current * perSlide, current * perSlide + perSlide);

  return (
    <section id="bewertungen" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
            Was unsere Kunden sagen
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Kundenstimmen
          </h2>
          <div className="section-divider mb-6" />
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-900 font-bold text-xl">5,0</span>
            <span className="text-slate-500 text-sm">· 91 Google-Bewertungen</span>
          </div>
        </div>

        {/* Reviews grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {visible.map((review, i) => (
            <div key={i} className="card p-6 relative group hover:border-accent/30">
              {/* Quote mark */}
              <div className="absolute top-4 right-4 text-5xl leading-none font-bold text-accent opacity-15 select-none">
                &ldquo;
              </div>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="border-t border-slate-100 pt-4">
                <div className="font-semibold text-slate-900 text-sm">{review.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{review.badge}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            className="w-10 h-10 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-600 hover:text-accent hover:border-accent transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          {[...Array(total)].map((_, i) => (
            <button
              key={i}
              onClick={() => { setIsAutoPlaying(false); setCurrent(i); }}
              className={`h-2 rounded-full transition-all ${
                i === current ? "bg-accent w-6" : "bg-slate-300 w-2 hover:bg-slate-400"
              }`}
            />
          ))}
          <button
            onClick={() => go(1)}
            className="w-10 h-10 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-600 hover:text-accent hover:border-accent transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
