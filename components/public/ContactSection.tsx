"use client";

import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import ConsentMap from "@/components/public/ConsentMap";
import ContactForm from "@/components/public/ContactForm";
import { SITE, TEL_HREF, MAIL_HREF, whatsappUrl } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import Reveal from "./Reveal";

interface Props {
  formToken: string;
}

export default function ContactSection({ formToken }: Props) {
  const { t } = useI18n();
  const c = t.contact;
  const [weekdays, saturday] = SITE.openingHours;

  const row = "flex items-start gap-4 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60";
  const icon = "w-11 h-11 rounded-full border border-gold-500/40 text-gold-300 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-gold-500 group-hover:text-ink group-hover:border-gold-500";
  const small = "text-[11px] text-ivory-50/55 tracking-[0.18em] uppercase font-semibold mb-1";

  return (
    <section id="kontakt" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-14">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-ivory-50">{c.title}</h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formular */}
          <Reveal className="lg:col-span-7">
            <div className="surface p-6 sm:p-9 h-full">
              <ContactForm token={formToken} />
            </div>
          </Reveal>

          {/* Kontaktdaten + Karte */}
          <Reveal delay={120} className="lg:col-span-5 space-y-6">
            <div className="surface p-6 sm:p-7">
              <div className="space-y-5">
                <a href={TEL_HREF} className={row}>
                  <div className={icon}><Phone size={18} strokeWidth={1.75} /></div>
                  <div>
                    <div className={small}>{c.phone}</div>
                    <div className="text-ivory-50 font-semibold">{SITE.phoneDisplay}</div>
                  </div>
                </a>
                <a href={whatsappUrl(t.whatsapp.prefill)} target="_blank" rel="noopener noreferrer" className={row}>
                  <div className={icon}><MessageCircle size={18} strokeWidth={1.75} /></div>
                  <div>
                    <div className={small}>{c.whatsapp}</div>
                    <div className="text-ivory-50 font-semibold">{c.whatsappCta}</div>
                  </div>
                </a>
                <a href={MAIL_HREF} className={row}>
                  <div className={icon}><Mail size={18} strokeWidth={1.75} /></div>
                  <div>
                    <div className={small}>{c.email}</div>
                    <div className="text-ivory-50 font-semibold break-all">{SITE.email}</div>
                  </div>
                </a>
                <a href={SITE.mapsDirections} target="_blank" rel="noopener noreferrer" className={row}>
                  <div className={icon}><MapPin size={18} strokeWidth={1.75} /></div>
                  <div>
                    <div className={small}>{c.address}</div>
                    <div className="text-ivory-50 font-semibold">
                      {SITE.address.street}
                      <br />
                      <span className="font-normal text-ivory-50/55">{SITE.address.zip} {SITE.address.city}</span>
                    </div>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border border-gold-500/40 text-gold-300 flex items-center justify-center flex-shrink-0"><Clock size={18} strokeWidth={1.75} /></div>
                  <div>
                    <div className={small}>{c.hours}</div>
                    <div className="text-ivory-50 font-semibold tabular-nums">
                      {c.weekdays}: {weekdays.opens} – {weekdays.closes}{c.timeSuffix}
                      <br />
                      {c.saturday}: {saturday.opens} – {saturday.closes}{c.timeSuffix}
                    </div>
                    <div className="text-ivory-50/55 text-sm mt-1">{c.hoursNote}</div>
                  </div>
                </div>
              </div>
            </div>

            <ConsentMap compact />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
