"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Star } from "lucide-react";

export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".word");
    words.forEach((w, i) => {
      (w as HTMLElement).style.transitionDelay = `${i * 0.12}s`;
      (w as HTMLElement).classList.add("word-visible");
    });
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* Background 3D car silhouette */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden opacity-15 hidden lg:block">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-full object-cover animate-float"
          style={{ filter: "drop-shadow(0 0 40px rgba(30,58,138,0.15))" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 280 C50 280 80 220 160 180 C200 160 280 140 360 138 C440 136 520 155 560 180 C580 192 590 220 590 240 L590 280 C590 295 580 300 560 300 L530 300 C530 320 515 335 495 335 C475 335 460 320 460 300 L180 300 C180 320 165 335 145 335 C125 335 110 320 110 300 L80 300 C60 300 50 295 50 280 Z"
            stroke="url(#carNavy)"
            strokeWidth="2"
            fill="rgba(30,58,138,0.04)"
          />
          <path
            d="M200 175 L240 140 L380 140 L440 175"
            stroke="url(#carNavy)"
            strokeWidth="1.5"
            fill="rgba(30,58,138,0.02)"
          />
          <line x1="310" y1="140" x2="310" y2="175" stroke="rgba(30,58,138,0.3)" strokeWidth="1" />
          <circle cx="145" cy="300" r="35" stroke="url(#carNavy)" strokeWidth="2" fill="none" />
          <circle cx="145" cy="300" r="20" stroke="rgba(30,58,138,0.2)" strokeWidth="1.5" fill="none" />
          <circle cx="145" cy="300" r="6" fill="rgba(30,58,138,0.3)" />
          <circle cx="495" cy="300" r="35" stroke="url(#carNavy)" strokeWidth="2" fill="none" />
          <circle cx="495" cy="300" r="20" stroke="rgba(30,58,138,0.2)" strokeWidth="1.5" fill="none" />
          <circle cx="495" cy="300" r="6" fill="rgba(30,58,138,0.3)" />
          <ellipse cx="560" cy="215" rx="18" ry="8" fill="rgba(37,99,235,0.3)" />
          <rect x="55" y="220" width="12" height="20" rx="2" fill="rgba(30,58,138,0.2)" />
          <defs>
            <linearGradient id="carNavy" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#172554" />
              <stop offset="50%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(30,58,138,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Rating badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-full mb-8 animate-fade-in">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-slate-700 font-semibold text-sm">5,0 · 91 Google-Bewertungen</span>
        </div>

        {/* Headline */}
        <div ref={headlineRef} className="mb-6">
          <style>{`
            .word {
              display: inline-block;
              opacity: 0;
              transform: translateY(40px);
              transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
            }
            .word-visible {
              opacity: 1 !important;
              transform: translateY(0) !important;
            }
          `}</style>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none mb-4 tracking-tight">
            <span className="word text-slate-900">Ihr</span>{" "}
            <span className="word text-slate-900">Gebrauchtwagen</span>
            <br />
            <span className="word text-navy">aus</span>{" "}
            <span className="word text-accent">München.</span>
          </h1>
        </div>

        <p className="text-slate-600 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed animate-slide-up">
          Alle Marken, alle Modelle – sorgfältig geprüft, fair bewertet und
          persönlich betreut. Qualität und Vertrauen direkt aus München.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/fahrzeuge" className="btn-primary px-8 py-4 rounded-xl text-base text-center">
            Fahrzeuge entdecken
          </Link>
          <a
            href="tel:+491734414474"
            className="btn-outline px-8 py-4 rounded-xl text-base text-center"
          >
            Jetzt anrufen
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-8 md:gap-16">
          {[
            { value: "91", label: "Bewertungen" },
            { value: "5,0★", label: "Google Rating" },
            { value: "100+", label: "Autos verkauft" },
            { value: "Hofolding", label: "Fichtenstr. 40" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-navy">{stat.value}</div>
              <div className="text-slate-500 text-xs tracking-wider uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent opacity-60 hover:opacity-100 transition-opacity animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </button>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
    </section>
  );
}
