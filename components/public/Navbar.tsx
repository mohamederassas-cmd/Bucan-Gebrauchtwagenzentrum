"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { SITE, TEL_HREF } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { switchLocalePath, LOCALES, type Locale } from "@/lib/i18n/config";

function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? "/";
  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-xs font-semibold tracking-wider ${className}`}
      role="group"
      aria-label="Sprache / Language"
    >
      {LOCALES.map((l: Locale) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            aria-label={active ? undefined : t.nav.switchAria}
            className={`px-2.5 py-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
              active ? "bg-navy text-white" : "text-slate-400 hover:text-navy active:text-navy-dark"
            }`}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const { t, path } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: path("/fahrzeuge"), label: t.nav.vehicles },
    { href: path("/#ueber-uns"), label: t.nav.about },
    { href: path("/#bewertungen"), label: t.nav.reviews },
    { href: path("/#kontakt"), label: t.nav.contact },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <Link href={path("/")} className="flex-shrink-0">
            <Image
              src="/bucan-logo-header.png"
              alt="Bucan Automobile"
              width={320}
              height={160}
              className="h-24 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-navy transition-colors duration-200 font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitch />
            <a
              href={TEL_HREF}
              className="flex items-center gap-2 text-navy font-semibold text-sm hover:text-accent transition-colors"
            >
              <Phone size={15} />
              {SITE.phoneDisplay}
            </a>
            <Link href={path("/fahrzeuge")} className="btn-primary px-5 py-2.5 rounded-lg text-sm">
              {t.nav.cta}
            </Link>
          </div>

          {/* Mobile: language + menu button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitch />
            <button
              className="text-slate-600 hover:text-navy transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t.nav.menu}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-700 hover:text-navy font-medium text-sm py-3 px-2 border-b border-slate-100 last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a href={TEL_HREF} className="flex items-center gap-2 text-navy font-semibold text-sm pt-4 px-2">
              <Phone size={15} />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
