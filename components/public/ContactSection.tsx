import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import ConsentMap from "@/components/public/ConsentMap";
import { SITE, TEL_HREF, MAIL_HREF, whatsappUrl } from "@/lib/site";

export default function ContactSection() {
  return (
    <section id="kontakt" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
            Wir sind für Sie da
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Kontakt & Standort
          </h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="card p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Bucan Automobile
              </h3>
              <div className="space-y-5">
                <a
                  href={TEL_HREF}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">Telefon</div>
                    <div className="text-slate-900 font-semibold group-hover:text-accent transition-colors">
                      {SITE.phoneDisplay}
                    </div>
                  </div>
                </a>

                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)" }}
                  >
                    <MessageCircle size={20} style={{ color: "#25D366" }} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">WhatsApp</div>
                    <div className="font-semibold" style={{ color: "#25D366" }}>
                      Jetzt schreiben
                    </div>
                  </div>
                </a>

                <a
                  href={MAIL_HREF}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">E-Mail</div>
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
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">Adresse</div>
                    <div className="text-slate-900 font-semibold">
                      Fichtenstrasse 40<br />
                      <span className="font-normal text-slate-500">85649 Hofolding</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">Öffnungszeiten</div>
                    <div className="text-slate-900 font-semibold">
                      Mo – Fr: 09:00 – 18:00 Uhr<br />
                      Sa: 10:00 – 15:00 Uhr<br />
                      <span className="font-normal text-slate-500 text-sm">Termine auch außerhalb der Öffnungszeiten nach Vereinbarung</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="flex gap-4">
              <a
                href={TEL_HREF}
                className="btn-primary flex-1 py-4 rounded-xl text-center text-sm"
              >
                Jetzt anrufen
              </a>
              <a
                href={whatsappUrl("Hallo Bucan Automobile, ich interessiere mich für eines Ihrer Fahrzeuge.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-1 py-4 rounded-xl text-center text-sm"
              >
                WhatsApp
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
