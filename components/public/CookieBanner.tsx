"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type ConsentState = {
  necessary: true;
  analytics: boolean;
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-consent");
    if (!saved) setVisible(true);
  }, []);

  const save = (consent: ConsentState) => {
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true });
  const declineAll = () => save({ necessary: true, analytics: false });
  const saveSettings = () => save({ necessary: true, analytics });

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center px-4 pb-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-2xl">
        {!showSettings ? (
          <>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-slate-900 font-bold text-base mb-1">
                  Wir nutzen Cookies 🍪
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Wir verwenden Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten.
                  Weitere Informationen finden Sie in unserer{" "}
                  <Link href="/datenschutz" className="text-accent underline hover:text-accent-hover">
                    Datenschutzerklärung
                  </Link>
                  .
                </p>
              </div>
              <button
                onClick={declineAll}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5"
                aria-label="Ablehnen"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={acceptAll}
                className="btn-primary w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={declineAll}
                className="btn-outline w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm"
              >
                Nur notwendige
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="text-slate-500 hover:text-accent text-sm underline transition-colors"
              >
                Einstellungen
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-slate-900 font-bold text-base">Cookie-Einstellungen</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Zurück"
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
                  <div className="text-slate-900 font-semibold text-sm">Notwendige Cookies</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    Technisch erforderlich für den Betrieb der Website. Können nicht deaktiviert werden.
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
                  <div className="text-slate-900 font-semibold text-sm">Analyse-Cookies</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    Helfen uns, die Nutzung der Website zu verstehen und zu verbessern.
                  </div>
                </div>
              </label>
            </div>
            <button
              onClick={saveSettings}
              className="btn-primary w-full py-2.5 rounded-lg text-sm"
            >
              Auswahl speichern
            </button>
          </>
        )}
      </div>
    </div>
  );
}
