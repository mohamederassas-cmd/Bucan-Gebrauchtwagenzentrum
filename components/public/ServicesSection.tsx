"use client";

import Link from "next/link";
import { CreditCard, Truck, ShieldCheck, RefreshCw, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import Reveal from "./Reveal";

export default function ServicesSection() {
  const { t, path } = useI18n();
  const services = [
    { icon: CreditCard, ...t.services.financing, href: null },
    { icon: Truck, ...t.services.delivery, href: null },
    { icon: ShieldCheck, ...t.services.warranty, href: null },
    { icon: RefreshCw, title: t.services.purchase.title, desc: t.services.purchase.desc, href: path("/ankauf"), linkLabel: t.services.purchase.link },
  ];

  return (
    <section className="py-20 sm:py-28 bg-ivory-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-14">
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-ink">{t.services.title}</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon = service.icon;
            const inner = (
              <>
                <div className="w-12 h-12 rounded-full border border-gold-300 text-gold-600 flex items-center justify-center mb-6 transition-colors group-hover:bg-gold-500 group-hover:text-ink group-hover:border-gold-500">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">{service.title}</h3>
                <p className="text-ink-700 text-[15px] leading-relaxed flex-1">{service.desc}</p>
                {service.href && (
                  <span className="mt-6 inline-flex items-center gap-2 text-gold-700 font-semibold text-sm">
                    {"linkLabel" in service ? service.linkLabel : null}
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
              </>
            );
            return (
              <Reveal key={service.title} delay={i * 80} className="h-full">
                {service.href ? (
                  <Link
                    href={service.href}
                    className="group surface surface-hover p-7 h-full flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory-200"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="group surface p-7 h-full flex flex-col">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
