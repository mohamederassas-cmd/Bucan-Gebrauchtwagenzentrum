import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";

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
                BB Gebrauchtwagen
              </h3>
              <div className="space-y-5">
                <a
                  href="tel:+491783022999"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">Telefon</div>
                    <div className="text-slate-900 font-semibold group-hover:text-accent transition-colors">
                      0178 302 2999
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/491783022999"
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
                  href="mailto:info@gebrauchtwagen-ankauf.de"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">E-Mail</div>
                    <div className="text-slate-900 font-semibold group-hover:text-accent transition-colors text-sm">
                      info@gebrauchtwagen-ankauf.de
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
                    <div className="text-xs text-slate-500 tracking-wider uppercase font-medium mb-0.5">Erreichbarkeit</div>
                    <div className="text-slate-900 font-semibold">
                      Mo – Sa: 8:00 – 19:00 Uhr<br />
                      <span className="font-normal text-slate-500 text-sm">Terminvereinbarung empfohlen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="flex gap-4">
              <a
                href="tel:+491783022999"
                className="btn-primary flex-1 py-4 rounded-xl text-center text-sm"
              >
                Jetzt anrufen
              </a>
              <a
                href="https://wa.me/491783022999?text=Hallo%20BB%20Gebrauchtwagen%2C%20ich%20interessiere%20mich%20f%C3%BCr%20einen%20Ihrer%20Fahrzeuge."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-1 py-4 rounded-xl text-center text-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right: Google Maps */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-card" style={{ minHeight: 450 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.2!2d11.8065!3d47.9776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDU4JzM5LjQiTiAxMcKwNDgnMjMuNCJF!5e0!3m2!1sde!2sde!4v1699000000000!5m2!1sde!2sde"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 450 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BB Gebrauchtwagen Standort"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
