"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  token: string;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ token }: Props) {
  const { t, locale } = useI18n();
  const f = t.contactForm;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", consent: false, website: "" });

  const set = (k: keyof typeof form, v: string | boolean) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", token, locale, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || f.error);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError(f.error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="h-full flex flex-col items-start justify-center py-6" role="status">
        <CheckCircle2 size={40} className="text-gold-300 mb-5" strokeWidth={1.5} />
        <h3 className="font-serif text-3xl text-ivory-50">{f.successTitle}</h3>
        <p className="mt-3 text-ivory-50/75 leading-relaxed max-w-md">{f.successText}</p>
        <button
          type="button"
          onClick={() => {
            setForm({ name: "", email: "", phone: "", message: "", consent: false, website: "" });
            setStatus("idle");
          }}
          className="mt-8 link-gold text-sm font-medium"
        >
          {f.another}
        </button>
      </div>
    );
  }

  const label = "block text-[13px] font-semibold text-ivory-50 mb-1.5";

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <h3 className="font-serif text-3xl text-ivory-50">{f.title}</h3>
        <p className="mt-2 text-ivory-50/60 text-sm leading-relaxed">{f.intro}</p>
      </div>

      {/* Honeypot – für Menschen unsichtbar */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className={label}>{f.name} <span className="text-gold-300" aria-hidden="true">*</span></label>
          <input id="cf-name" name="name" type="text" required autoComplete="name" maxLength={80} className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>{f.email} <span className="text-gold-300" aria-hidden="true">*</span></label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" inputMode="email" maxLength={120} className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-phone" className={label}>{f.phone}</label>
        <input id="cf-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <div>
        <label htmlFor="cf-message" className={label}>{f.message} <span className="text-gold-300" aria-hidden="true">*</span></label>
        <textarea id="cf-message" name="message" required rows={5} maxLength={2000} placeholder={f.messagePlaceholder} className="input resize-y min-h-[8rem]" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </div>

      <label className="flex items-start gap-3 cursor-pointer text-sm text-ivory-50/75 leading-relaxed">
        <input type="checkbox" required className="checkbox-gold" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} />
        <span>
          {f.consent.split("{privacy}")[0]}
          <Link href="/datenschutz" className="link-gold" target="_blank" rel="noopener noreferrer">{f.privacy}</Link>
          {f.consent.split("{privacy}")[1]}
        </span>
      </label>

      {error && (
        <p role="alert" className="input-error error-box text-sm !mt-4">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-gold px-7 py-4 text-[15px] w-full sm:w-auto disabled:opacity-60 disabled:cursor-wait">
        {status === "sending" ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
        {status === "sending" ? f.sending : f.submit}
      </button>
    </form>
  );
}
