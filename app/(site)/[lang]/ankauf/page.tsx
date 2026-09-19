import type { Metadata } from "next";
import { BadgeCheck, FileSignature, Repeat } from "lucide-react";
import AnkaufForm from "@/components/public/AnkaufForm";
import JsonLd from "@/components/public/JsonLd";
import Reveal from "@/components/public/Reveal";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getDictionary, toLocale, localePath } from "@/lib/i18n";
import { issueFormToken } from "@/lib/form-token";
import { blobEnabled } from "@/lib/blob-json-store";

// Formular-Token wird pro Aufruf ausgestellt → immer dynamisch
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = toLocale((await params).lang);
  const t = getDictionary(locale);
  return {
    title: t.meta.purchaseTitle,
    description: t.meta.purchaseDescription,
    alternates: {
      canonical: localePath(locale, "/ankauf"),
      languages: { de: "/ankauf", en: "/en/ankauf", "x-default": "/ankauf" },
    },
  };
}

export default async function AnkaufPage({ params }: Params) {
  const locale = toLocale((await params).lang);
  const t = getDictionary(locale);
  const p = t.purchase;
  const token = issueFormToken();
  const icons = [BadgeCheck, FileSignature, Repeat];

  return (
    <main className="bg-ivory-100 min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.vehicles.detail.breadcrumbHome, path: localePath(locale, "/") },
          { name: p.eyebrow, path: localePath(locale, "/ankauf") },
        ])}
      />

      {/* Kopfband */}
      <div className="relative bg-graphite-950 text-ivory-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_82%_30%,rgba(194,160,87,0.16),transparent_65%)]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-14 sm:pb-20">
          <p className="eyebrow eyebrow-dark eyebrow-left">{p.eyebrow}</p>
          <h1 className="mt-5 font-serif text-[2.6rem] leading-[1] sm:text-6xl lg:text-7xl max-w-3xl">
            <span className="block">{p.title[0]}</span>
            <span className="block italic text-gold-200">{p.title[1]}</span>
          </h1>
          <p className="mt-6 text-ivory-50/70 text-base sm:text-lg leading-relaxed max-w-2xl">{p.intro}</p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {p.chips.map((chip) => (
              <li key={chip} className="glass-light rounded-full px-4 py-2 text-sm text-ivory-50/90">
                {chip}
              </li>
            ))}
          </ul>
        </div>
        <div className="hairline" aria-hidden="true" />
      </div>

      {/* Ablauf – eine echte Reihenfolge, darum nummeriert */}
      <section className="bg-graphite-900 text-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="sr-only">{p.stepsTitle}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {p.steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="font-serif text-4xl text-gold-300 leading-none tabular-nums" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="mt-1.5 text-ivory-50/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Formular + Argumente */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <AnkaufForm token={token} clientUpload={blobEnabled()} />
          </div>
          <aside className="lg:col-span-4 space-y-4 lg:pt-2">
            {p.usps.map((usp, i) => {
              const Icon = icons[i] ?? BadgeCheck;
              return (
                <Reveal key={usp.title} delay={i * 80}>
                  <div className="surface p-6">
                    <div className="w-10 h-10 rounded-full border border-gold-300 text-gold-600 flex items-center justify-center mb-4">
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <h3 className="font-semibold text-ink">{usp.title}</h3>
                    <p className="mt-1.5 text-ink-500 text-sm leading-relaxed">{usp.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </aside>
        </div>
      </section>
    </main>
  );
}
