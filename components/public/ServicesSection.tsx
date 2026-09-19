"use client";

import { CreditCard, Truck, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import Reveal from "./Reveal";

export default function ServicesSection() {
  const { t } = useI18n();
  const services = [
    { icon: CreditCard, iconBg: "bg-blue-50", iconColor: "text-accent", ...t.services.financing, link: null, linkLabel: null },
    { icon: Truck, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", ...t.services.delivery, link: null, linkLabel: null },
    { icon: ShieldCheck, iconBg: "bg-violet-50", iconColor: "text-violet-600", ...t.services.warranty, link: null, linkLabel: null },
    { icon: RefreshCw, iconBg: "bg-orange-50", iconColor: "text-orange-500", title: t.services.purchase.title, desc: t.services.purchase.desc, link: SITE.ankaufPortal, linkLabel: t.services.purchase.link },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="text-center mb-14">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
            {t.services.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {t.services.title}
          </h2>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-slate-600 leading-relaxed flex-1">{service.desc}</p>
                {service.link && (
                  <div className="mt-6 flex items-center gap-2 text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all">
                    {service.linkLabel}
                    <ArrowRight size={15} />
                  </div>
                )}
              </div>
            );

            return (
              <Reveal key={service.title} delay={i * 80} className="h-full">
                {service.link ? (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-xl"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
