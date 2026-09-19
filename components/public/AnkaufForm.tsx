"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { fmt } from "@/lib/i18n";
import { FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/types";
import { whatsappUrl } from "@/lib/site";
import PhotoUploader, { type UploadedPhoto } from "./PhotoUploader";

interface Props {
  token: string;
  clientUpload: boolean;
}

type Status = "idle" | "sending" | "success" | "error";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - 1979 }, (_, i) => THIS_YEAR - i);

export default function AnkaufForm({ token, clientUpload }: Props) {
  const { t, locale } = useI18n();
  const p = t.purchase;
  const f = p.fields;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [form, setForm] = useState({
    make: "",
    model: "",
    month: "",
    year: "",
    mileage: "",
    fuel_type: "",
    transmission: "",
    condition: "",
    price_expectation: "",
    name: "",
    phone: "",
    email: "",
    message: "",
    consent: false,
    website: "",
  });
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
        body: JSON.stringify({
          type: "purchase",
          token,
          locale,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          consent: form.consent,
          website: form.website,
          vehicle: {
            make: form.make,
            model: form.model,
            month: form.month,
            year: form.year,
            mileage: form.mileage,
            fuel_type: form.fuel_type,
            transmission: form.transmission,
            condition: form.condition,
            price_expectation: form.price_expectation,
          },
          photos: photos.map((x) => x.url),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || p.error);
        setStatus("error");
        return;
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(p.error);
      setStatus("error");
    }
  };

  if (status === "success") {
    const vehicleName = `${form.make} ${form.model}`.trim();
    return (
      <div className="surface p-8 sm:p-12 text-center" role="status">
        <CheckCircle2 size={44} className="text-gold-600 mx-auto mb-5" strokeWidth={1.5} />
        <h2 className="font-serif text-3xl sm:text-4xl text-ink">{p.success.title}</h2>
        <p className="mt-4 text-ink-700 leading-relaxed max-w-lg mx-auto">{p.success.text}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappUrl(fmt(p.success.whatsappPrefill, { vehicle: vehicleName }))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ink px-6 py-3.5 text-sm"
          >
            <MessageCircle size={16} /> {p.success.whatsapp}
          </a>
          <Link href={locale === "en" ? "/en" : "/"} className="btn-outline-ink px-6 py-3.5 text-sm">
            {p.success.home}
          </Link>
        </div>
      </div>
    );
  }

  const label = "block text-[13px] font-semibold text-ink mb-1.5";
  const req = <span className="text-gold-700" aria-hidden="true"> *</span>;
  const sectionTitle = "font-serif text-2xl text-ink";
  const busy = status === "sending";

  return (
    <form onSubmit={submit} noValidate className="surface p-6 sm:p-9 space-y-10">
      <div>
        <h2 className="font-serif text-3xl text-ink">{p.formTitle}</h2>
        <p className="mt-2 text-ink-500 text-sm">{p.formIntro}</p>
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="pf-website">Website</label>
        <input id="pf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      {/* Fahrzeug */}
      <fieldset className="space-y-5">
        <legend className={sectionTitle}>{p.sections.vehicle}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pf-make" className={label}>{f.make}{req}</label>
            <input id="pf-make" required maxLength={60} className="input" value={form.make} onChange={(e) => set("make", e.target.value)} placeholder="BMW" />
          </div>
          <div>
            <label htmlFor="pf-model" className={label}>{f.model}{req}</label>
            <input id="pf-model" required maxLength={120} className="input" value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="320d Touring" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="pf-month" className={label}>{f.firstReg} · {f.month}{req}</label>
            <select id="pf-month" required className="input" value={form.month} onChange={(e) => set("month", e.target.value)}>
              <option value="">{f.select}</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pf-year" className={label}>{f.year}{req}</label>
            <select id="pf-year" required className="input" value={form.year} onChange={(e) => set("year", e.target.value)}>
              <option value="">{f.select}</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="pf-mileage" className={label}>{f.mileage}{req}</label>
            <div className="relative">
              <input id="pf-mileage" required type="number" inputMode="numeric" min={0} max={2000000} step={1} className="input pr-12" value={form.mileage} onChange={(e) => set("mileage", e.target.value)} placeholder="120000" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 text-sm">{t.units.km}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pf-fuel" className={label}>{f.fuel}{req}</label>
            <select id="pf-fuel" required className="input" value={form.fuel_type} onChange={(e) => set("fuel_type", e.target.value)}>
              <option value="">{f.select}</option>
              {FUEL_TYPES.map((x) => (
                <option key={x} value={x}>{t.vehicles.fuel[x]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pf-transmission" className={label}>{f.transmission}{req}</label>
            <select id="pf-transmission" required className="input" value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
              <option value="">{f.select}</option>
              {TRANSMISSION_TYPES.map((x) => (
                <option key={x} value={x}>{t.vehicles.transmission[x]}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="pf-condition" className={label}>{f.condition}{req}</label>
          <textarea id="pf-condition" required rows={4} maxLength={2000} className="input resize-y min-h-[7rem]" placeholder={f.conditionPlaceholder} value={form.condition} onChange={(e) => set("condition", e.target.value)} />
        </div>
        <div className="sm:max-w-xs">
          <label htmlFor="pf-price" className={label}>{f.price}</label>
          <div className="relative">
            <input id="pf-price" type="number" inputMode="numeric" min={0} step={100} className="input pr-10" value={form.price_expectation} onChange={(e) => set("price_expectation", e.target.value)} placeholder="8500" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 text-sm">€</span>
          </div>
          <p className="text-ink-500 text-xs mt-1.5">{f.priceHint}</p>
        </div>
      </fieldset>

      {/* Fotos */}
      <fieldset>
        <legend className={`${sectionTitle} mb-3`}>{p.sections.photos}</legend>
        <PhotoUploader token={token} clientUpload={clientUpload} photos={photos} onChange={setPhotos} disabled={busy} />
      </fieldset>

      {/* Kontakt */}
      <fieldset className="space-y-5">
        <legend className={sectionTitle}>{p.sections.contact}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pf-name" className={label}>{f.name}{req}</label>
            <input id="pf-name" required autoComplete="name" maxLength={80} className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label htmlFor="pf-phone" className={label}>{f.phone}{req}</label>
            <input id="pf-phone" required type="tel" autoComplete="tel" inputMode="tel" maxLength={30} className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
        </div>
        <div>
          <label htmlFor="pf-email" className={label}>{f.email}{req}</label>
          <input id="pf-email" required type="email" autoComplete="email" inputMode="email" maxLength={120} className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label htmlFor="pf-message" className={label}>{f.message}</label>
          <textarea id="pf-message" rows={3} maxLength={2000} className="input resize-y" placeholder={f.messagePlaceholder} value={form.message} onChange={(e) => set("message", e.target.value)} />
        </div>

        <label className="flex items-start gap-3 cursor-pointer text-sm text-ink-700 leading-relaxed">
          <input type="checkbox" required className="checkbox-gold" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} />
          <span>
            {t.contactForm.consent.split("{privacy}")[0]}
            <Link href="/datenschutz" className="link-gold" target="_blank" rel="noopener noreferrer">{t.contactForm.privacy}</Link>
            {t.contactForm.consent.split("{privacy}")[1]}
          </span>
        </label>
      </fieldset>

      {error && (
        <p role="alert" className="input-error text-sm bg-[#FBEDEB] border border-[#EAC2BD] rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-ink px-8 py-4 text-[15px] w-full sm:w-auto disabled:opacity-60 disabled:cursor-wait">
        {busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
        {busy ? p.sending : p.submit}
      </button>
    </form>
  );
}
