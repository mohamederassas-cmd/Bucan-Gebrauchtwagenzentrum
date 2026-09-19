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
    // Bereits getroffene Teil-Entscheidungen (z. B. „Karte laden“) vorbelegen.
    setAnalytics(saved.analytics);
    setMaps(saved.maps);
  }, []);

  // Der Besucher kann die Karte auch direkt über „Karte laden“ freigeben,
  // während dieser Banner noch offen ist – dann die Schalter nachziehen.
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center px-4 pb-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-2xl">
        {!showSettings ? (
          <>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-slate-900 font-bold text-base mb-1">
                  {c.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {c.text}{" "}
                  <Link href="/datenschutz" className="text-accent underline hover:text-accent-hover">
                    {c.privacyLink}
                  </Link>
                  .
                </p>
              </div>
              <button
                onClick={declineAll}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5"
                aria-label={c.decline}
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={acceptAll}
                className="btn-primary w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm"
              >
                {c.acceptAll}
              </button>
              <button
                onClick={declineAll}
                className="btn-outline w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm"
              >
                {c.necessaryOnly}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="text-slate-500 hover:text-accent text-sm underline transition-colors"
              >
                {c.settings}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-slate-900 font-bold text-base">{c.settingsTitle}</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={c.back}
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 cursor-not-allowed">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 accent-accent"
                />
                <div>
                  <div className="text-slate-900 font-semibold text-sm">{c.necessary.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {c.necessary.desc}
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 accent-accent"
                />
                <div>
                  <div className="text-slate-900 font-semibold text-sm">{c.analytics.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {c.analytics.desc}
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maps}
                  onChange={(e) => setMaps(e.target.checked)}
                  className="mt-1 accent-accent"
                />
                <div>
                  <div className="text-slate-900 font-semibold text-sm">{c.maps.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {c.maps.desc}
                  </div>
                </div>
              </label>
            </div>
            <button
              onClick={saveSettings}
              className="btn-primary w-full py-2.5 rounded-lg text-sm"
            >
              {c.save}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
