"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Loader, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

interface Props {
  usingDefaultPassword: boolean;
}

type Field = "current" | "next" | "confirm";

export default function PasswordChangeForm({ usingDefaultPassword }: Props) {
  const router = useRouter();
  const [values, setValues] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState<Record<Field, boolean>>({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [defaultActive, setDefaultActive] = useState(usingDefaultPassword);

  const set = (field: Field, value: string) => setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Dieselben Regeln wie serverseitig, damit die Meldung sofort kommt
    if (!values.current) return setError("Bitte geben Sie Ihr aktuelles Passwort ein.");
    if (values.next.length < PASSWORD_MIN_LENGTH) {
      return setError(`Das neue Passwort muss mindestens ${PASSWORD_MIN_LENGTH} Zeichen lang sein.`);
    }
    if (values.next !== values.confirm) return setError("Die Passwörter stimmen nicht überein.");
    if (values.next === values.current) {
      return setError("Das neue Passwort muss sich vom aktuellen Passwort unterscheiden.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.current,
          newPassword: values.next,
          confirmPassword: values.confirm,
        }),
      });
      if (!res.ok) {
        let message = "Passwort konnte nicht geändert werden.";
        if (res.status === 401) message = "Sitzung abgelaufen. Bitte erneut anmelden.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // keine JSON-Antwort
        }
        setError(message);
        return;
      }
      setValues({ current: "", next: "", confirm: "" });
      setDefaultActive(false);
      setSuccess("Passwort erfolgreich geändert. Sie bleiben angemeldet.");
      router.refresh();
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-3 pr-12 text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 text-sm transition-colors";
  const labelCls = "block text-[#475569] text-xs font-accent tracking-wider uppercase mb-2";

  const passwordField = (field: Field, label: string, autoComplete: string, hint?: string) => (
    <div>
      <label htmlFor={`pw-${field}`} className={labelCls}>
        {label}
      </label>
      <div className="relative">
        <input
          id={`pw-${field}`}
          type={show[field] ? "text" : "password"}
          value={values[field]}
          onChange={(e) => set(field, e.target.value)}
          autoComplete={autoComplete}
          required
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
          aria-label={show[field] ? "Passwort verbergen" : "Passwort anzeigen"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 rounded transition-colors"
        >
          {show[field] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <p className="text-[#94A3B8] text-xs mt-1.5">{hint}</p>}
    </div>
  );

  return (
    <div className="max-w-xl space-y-4">
      {defaultActive && (
        <div role="alert" className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <span>
            Sie verwenden noch das Standardpasswort. Bitte legen Sie jetzt ein eigenes Passwort fest.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-card border border-[#E2E8F0] space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full flex items-center justify-center">
            <KeyRound size={20} className="text-[#2563EB]" />
          </div>
          <div>
            <h2 className="font-display text-lg text-[#0F172A] font-semibold">Passwort ändern</h2>
            <p className="text-[#475569] text-xs">Gilt sofort für alle Anmeldungen im Admin-Bereich.</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div role="status" className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
            <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {passwordField("current", "Aktuelles Passwort", "current-password")}
        {passwordField("next", "Neues Passwort", "new-password", `Mindestens ${PASSWORD_MIN_LENGTH} Zeichen. Empfehlung: ein längerer Satz oder eine Kombination aus Wörtern, Zahlen und Zeichen.`)}
        {passwordField("confirm", "Neues Passwort wiederholen", "new-password")}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 py-3.5 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
        >
          {loading ? <Loader size={18} className="animate-spin" /> : <KeyRound size={18} />}
          Passwort ändern
        </button>
      </form>

      <p className="text-[#94A3B8] text-xs leading-relaxed">
        Passwort vergessen? Wenden Sie sich an Ihren Website-Betreuer. Das Passwort kann nicht per E-Mail zurückgesetzt werden.
      </p>
    </div>
  );
}
