"use client";

import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { useI18n } from "@/lib/i18n/context";

export default function NotFound() {
  const { t, path } = useI18n();
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="pt-40 pb-24 px-4">
        <div className="card max-w-lg mx-auto p-10 text-center">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">404</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t.notFound.title}</h1>
          <p className="text-slate-500 mb-8">{t.notFound.text}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={path("/")} className="btn-primary px-6 py-3 rounded-xl text-sm">
              {t.notFound.home}
            </Link>
            <Link href={path("/fahrzeuge")} className="btn-outline px-6 py-3 rounded-xl text-sm">
              {t.notFound.vehicles}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
