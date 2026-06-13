"use client";

import { CreditCard, Truck, RefreshCw, ArrowRight } from "lucide-react";

const services = [
  {
    icon: CreditCard,
    iconBg: "bg-blue-50",
    iconColor: "text-accent",
    title: "Flexible Finanzierung",
    description:
      "Wir helfen Ihnen, die passende Finanzierungslösung für Ihr Wunschfahrzeug zu finden – schnell, unkompliziert und transparent.",
    link: null,
    linkLabel: null,
  },
  {
    icon: Truck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Direktlieferung",
    description:
      "Ihr neues Fahrzeug kommt direkt zu Ihnen nach Hause – bequem und ohne zusätzlichen Aufwand in München und Umgebung.",
    link: null,
    linkLabel: null,
  },
  {
    icon: RefreshCw,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    title: "Fahrzeug Ankauf",
    description:
      "Wir kaufen Ihr Fahrzeug an und nehmen es in Zahlung – faire Preise, sofortige Abwicklung, kein Aufwand für Sie.",
    link: "https://gebrauchtwagen-ankauf.de",
    linkLabel: "Zum Ankauf-Portal",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
            Unsere Leistungen
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Was wir für Sie tun
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            const content = (
              <div
                className="card p-8 h-full flex flex-col"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center mb-5 flex-shrink-0`}
                >
                  <Icon size={26} className={service.iconColor} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed flex-1">{service.description}</p>
                {service.link && (
                  <div className="mt-6 flex items-center gap-2 text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all">
                    {service.linkLabel}
                    <ArrowRight size={15} />
                  </div>
                )}
              </div>
            );

            if (service.link) {
              return (
                <a
                  key={service.title}
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={service.title}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
