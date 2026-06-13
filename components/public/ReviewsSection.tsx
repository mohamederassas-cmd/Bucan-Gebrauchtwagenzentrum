"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "mobile.de Nutzer",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Korrekter, ehrlicher Verkäufer. Tolles Auto. Gerne wieder.",
    date: "16.05.2026",
  },
  {
    name: "Said",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Very good experience. Fair prices, honest seller and transparent communication. Everything was handled professionally and without any issues. Highly recommended.",
    date: "06.01.2026",
  },
  {
    name: "mobile.de Nutzer",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Ich habe einen BMW 6er aus erster Hand mit lückenlos gepflegter Historie gekauft. Der Ablauf war freundlich, ehrlich und professionell. Bin sehr zufrieden mit dem Kauf – jederzeit gerne wieder!",
    date: "14.11.2025",
  },
  {
    name: "mobile.de Nutzer",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Ich bin sehr zufrieden mit dem Kauf. Herr Bucan hat für mich die Export-Kennzeichen organisiert, alles war schnell und ohne Probleme. Die Abwicklung war einfach und professionell. Sehr freundlicher Kontakt, vielen Dank, gerne wieder!",
    date: "09.11.2025",
  },
  {
    name: "mobile.de Nutzer",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Ich bin sehr zufrieden mit dem Autokauf! Das Fahrzeug entsprach genau der Beschreibung, war in einem sehr guten Zustand und der gesamte Kaufprozess verlief reibungslos. Der Verkäufer war freundlich, ehrlich und professionell. Ich kann diesen Anbieter nur weiterempfehlen. Vielen Dank!",
    date: "17.05.2025",
  },
  {
    name: "Damir",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Alles Lob an den Verkäufer, angenehmes und sehr freundliches Personal!",
    date: "09.05.2025",
  },
  {
    name: "mobile.de Nutzer",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Ich habe einen Audi A3 von diesem Verkäufer gekauft und bin sehr zufrieden! Das Auto entsprach genau der Beschreibung – es war in ausgezeichnetem Zustand, sauber und technisch einwandfrei. Der Verkäufer war äußerst korrekt, freundlich und bereit, alle Fragen zu beantworten. Ich kann diesen Verkäufer jedem empfehlen. Vielen Dank nochmals!",
    date: "05.05.2025",
  },
  {
    name: "Thommi",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Ich habe hier ein tolles Auto mit kompletter Historie und für sein Baujahr echt wenig Kilometer gekauft. Ich bin super zufrieden und kaufe mir beim nächsten Mal gerne wieder ein Auto hier.",
    date: "16.03.2025",
  },
  {
    name: "mobile.de Nutzer",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Unsere Erfahrung hätte nicht besser sein können – sie kennen sich bestens auf dem Markt aus. Wir können getrost sagen, dass wir beim nächsten Autokauf wiederkommen werden und können sie jedem wärmstens empfehlen, der auf der Suche nach einem neuen Fahrzeug ist.",
    date: "24.02.2025",
  },
  {
    name: "Luay",
    badge: "Fahrzeug gekauft · mobile.de",
    rating: 5,
    text: "Auto in top Zustand mit toller Ausstattung gekauft, Lieferung des Fahrzeugs war auch kein Problem.",
    date: "11.02.2025",
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
            <span className="text-slate-500 text-sm">· 56 Bewertungen</span>
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
                <div className="text-xs text-slate-300 mt-0.5">{review.date}</div>
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
