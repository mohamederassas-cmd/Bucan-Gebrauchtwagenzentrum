"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { CONSENT_EVENT, readConsent, writeConsent, DEFAULT_CONSENT } from "@/lib/consent";
import { SITE } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.2!2d11.8065!3d47.9776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDU4JzM5LjQiTiAxMcKwNDgnMjMuNCJF!5e0!3m2!1sde!2sde!4v1699000000000!5m2!1sde!2sde";

export default function ConsentMap({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const minHeight = compact ? 300 : 450;

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
    <div className="surface overflow-hidden" style={{ minHeight }}>
      {loaded ? (
        <iframe
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight, filter: "grayscale(0.35) contrast(1.05)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t.contact.map.title}
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10" style={{ minHeight }}>
          <div className="w-11 h-11 rounded-full border border-gold-500/40 text-gold-300 flex items-center justify-center mb-4">
            <MapPin size={18} strokeWidth={1.75} />
          </div>
          <p className="text-ivory-50 font-semibold">{SITE.name}</p>
          <p className="text-ivory-50/75 text-sm mt-1">
            {SITE.address.street}
            <br />
            {SITE.address.zip} {SITE.address.city}
          </p>
          <p className="text-ivory-50/55 text-xs leading-relaxed mt-5 max-w-xs">
            {t.contact.map.consent}{" "}
            <Link href="/datenschutz" className="link-gold">
              {t.contact.map.privacy}
            </Link>
            .
          </p>
          <button type="button" onClick={loadMap} className="btn-gold mt-6 px-6 py-3 text-sm">
            {t.contact.map.load}
          </button>
          <a
            href={SITE.mapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="link-gold text-xs mt-4"
          >
            {t.contact.map.route}
          </a>
        </div>
      )}
    </div>
  );
}
