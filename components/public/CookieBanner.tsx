"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { CONSENT_EVENT, ConsentState, readConsent, writeConsent } from "@/lib/consent";
import { useI18n } from "@/lib/i18n/context";

export default function CookieBanner() {
  const { t } = useI18n();
  const c = t.cookies;
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [maps, setMaps] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (!saved) {
      setVisible(true);
      return;
    }
    setAnalytics(saved.analytics);
    setMaps(saved.maps);
  }, []);

  useEffect(() => {
    const sync = () => {
      const current = readConsent();
      if (!current) return;
      setAnalytics(current.analytics);
      setMaps(current.maps);
    };
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  const save = (consent: ConsentState) => {
    writeConsent(consent);
    setVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true, maps: true });
  const declineAll = () => save({ necessary: true, analytics: false, maps: false });
  const saveSettings = () => save({ necessary: true, analytics, maps });

  if (!visible) return null;

  const iconBtn =
    "text-ink-500 hover:text-ink active:text-gold-700 transition-colors flex-shrink-0 rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center px-4 pb-4 sm:pb-6" role="region" aria-label={c.title}>
      <div className="surface p-6 w-full max-w-2xl shadow-surface-hover">
        {!showSettings ? (
          <>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="font-serif text-2xl text-ink mb-1">{c.title}</h3>
                <p className="text-ink-700 text-sm leading-relaxed">
                  {c.text}{" "}
                  <Link href="/datenschutz" className="link-gold">
                    {c.privacyLink}
                  </Link>
                  .
                </p>
              </div>
              <button onClick={declineAll} className={iconBtn} aria-label={c.decline}>
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button onClick={acceptAll} className="btn-ink w-full sm:w-auto px-6 py-3 text-sm">
                {c.acceptAll}
              </button>
              <button onClick={declineAll} className="btn-outline-ink w-full sm:w-auto px-6 py-3 text-sm">
                {c.necessaryOnly}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="text-ink-500 hover:text-ink text-sm underline underline-offset-4 transition-colors sm:ml-auto focus-visible:outline-none focus-visible:text-gold-700"
              >
                {c.settings}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-2xl text-ink">{c.settingsTitle}</h3>
              <button onClick={() => setShowSettings(false)} className={iconBtn} aria-label={c.back}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 cursor-not-allowed">
                <input type="checkbox" checked disabled className="checkbox-gold" />
                <div>
                  <div className="text-ink font-semibold text-sm">{c.necessary.title}</div>
                  <div className="text-ink-500 text-xs mt-0.5">{c.necessary.desc}</div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="checkbox-gold" />
                <div>
                  <div className="text-ink font-semibold text-sm">{c.analytics.title}</div>
                  <div className="text-ink-500 text-xs mt-0.5">{c.analytics.desc}</div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={maps} onChange={(e) => setMaps(e.target.checked)} className="checkbox-gold" />
                <div>
                  <div className="text-ink font-semibold text-sm">{c.maps.title}</div>
                  <div className="text-ink-500 text-xs mt-0.5">{c.maps.desc}</div>
                </div>
              </label>
            </div>
            <button onClick={saveSettings} className="btn-ink w-full py-3 text-sm">
              {c.save}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
