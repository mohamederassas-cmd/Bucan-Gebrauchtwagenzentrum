"use client";

import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import ConsentMap from "@/components/public/ConsentMap";
import { SITE, TEL_HREF, MAIL_HREF, whatsappUrl } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";

export default function ContactSection() {
  const { t } = useI18n();
  const c = t.contact;
  const [weekdays, saturday] = SITE.openingHours;

  return (
    <section id="kontakt" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">{c.eyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{c.title}</h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="card p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">{SITE.name}</h3>
              <div className="space-y-5">
                <a href={TEL_HREF} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">{c.phone}</div>
                    <div className="text-slate-900 font-semibold group-hover:text-accent transition-colors">
                      {SITE.phoneDisplay}
                    </div>
                  </div>
                </a>

                <a href={whatsappUrl(t.whatsapp.prefill)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)" }}
                  >
                    <MessageCircle size={20} style={{ color: "#25D366" }} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">{c.whatsapp}</div>
                    <div className="font-semibold" style={{ color: "#25D366" }}>{c.whatsappCta}</div>
                  </div>
                </a>

                <a href={MAIL_HREF} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">{c.email}</div>
                    <div className="text-slate-900 font-semibold group-hover:text-accent transition-colors text-sm">
                      {SITE.email}
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">{c.address}</div>
                    <div className="text-slate-900 font-semibold">
                      {SITE.address.street}
                      <br />
                      <span className="font-normal text-slate-500">
                        {SITE.address.zip} {SITE.address.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">{c.hours}</div>
                    <div className="text-slate-900 font-semibold">
                      {c.weekdays}: {weekdays.opens} – {weekdays.closes}{c.timeSuffix}
                      <br />
                      {c.saturday}: {saturday.opens} – {saturday.closes}{c.timeSuffix}
                      <br />
                      <span className="font-normal text-slate-500 text-sm">{c.hoursNote}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="flex gap-4">
              <a href={TEL_HREF} className="btn-primary flex-1 py-4 rounded-xl text-center text-sm">
                {c.call}
              </a>
              <a
                href={whatsappUrl(t.whatsapp.prefill)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-1 py-4 rounded-xl text-center text-sm"
              >
                {c.whatsapp}
              </a>
            </div>
          </div>

          {/* Right: Google Maps – lädt erst nach Einwilligung (§ 25 TDDDG) */}
          <ConsentMap />
        </div>
      </div>
    </section>
  );
}
