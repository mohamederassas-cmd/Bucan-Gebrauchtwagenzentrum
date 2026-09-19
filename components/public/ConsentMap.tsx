"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { CONSENT_EVENT, readConsent, writeConsent, DEFAULT_CONSENT } from "@/lib/consent";
import { SITE } from "@/lib/site";

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.2!2d11.8065!3d47.9776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDU4JzM5LjQiTiAxMcKwNDgnMjMuNCJF!5e0!3m2!1sde!2sde!4v1699000000000!5m2!1sde!2sde";

export default function ConsentMap() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(readConsent()?.maps === true);

    const onConsentChange = () => setLoaded(readConsent()?.maps === true);
    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  const loadMap = () => {
    writeConsent({ ...(readConsent() ?? DEFAULT_CONSENT), maps: true });
    setLoaded(true);
  };

  return (
    <div
      className="rounded-xl overflow-hidden border border-slate-200 shadow-card"
      style={{ minHeight: 450 }}
    >
      {loaded ? (
        <iframe
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: 450 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bucan Automobile Standort"
        />
      ) : (
        <div
          className="bg-slate-100 h-full flex flex-col items-center justify-center text-center px-6 py-12"
          style={{ minHeight: 450 }}
        >
          <MapPin size={36} className="text-accent mb-4" />
          <p className="text-slate-900 font-semibold">Bucan Automobile</p>
          <p className="text-slate-600 text-sm mt-1">
            Fichtenstrasse 40
            <br />
            85649 Hofolding
          </p>
          <p className="text-slate-500 text-xs leading-relaxed mt-5 max-w-xs">
            Beim Laden der Karte werden Daten an Google übertragen. Näheres dazu in unserer{" "}
            <Link href="/datenschutz" className="text-accent hover:underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={loadMap}
            className="btn-primary mt-6 px-6 py-2.5 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Karte laden
          </button>
          <a
            href={SITE.mapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 text-xs underline mt-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded transition-colors"
          >
            Stattdessen Route in Google Maps öffnen
          </a>
        </div>
      )}
    </div>
  );
}
