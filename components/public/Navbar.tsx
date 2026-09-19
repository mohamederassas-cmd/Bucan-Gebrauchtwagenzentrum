"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { SITE, TEL_HREF, whatsappUrl } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { switchLocalePath, stripLocale, LOCALES, type Locale } from "@/lib/i18n/config";

function LanguageSwitch({ onDark, className = "" }: { onDark: boolean; className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? "/";
  return (
    <div
      className={`inline-flex items-center rounded-full p-0.5 text-[11px] font-semibold tracking-[0.14em] ${
        onDark ? "border border-white/15 bg-white/5" : "border border-sand bg-white/60"
      } ${className}`}
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
            className={`px-2.5 py-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 ${
              active
                ? onDark
                  ? "bg-ivory-50 text-ink"
                  : "bg-ink text-ivory-50"
                : onDark
                  ? "text-ivory-50/60 hover:text-ivory-50"
                  : "text-ink-500 hover:text-ink"
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
  const pathname = usePathname() ?? "/";
  const isHome = stripLocale(pathname) === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Mobile-Menü: Body-Scroll sperren, Escape schließt, Routenwechsel schließt
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, close]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Über dem Hero transparent, sonst dunkles Glas. Alle Seiten beginnen mit einer dunklen Bühne.
  const solid = scrolled || !isHome || menuOpen;

  const navLinks = [
    { href: path("/fahrzeuge"), label: t.nav.vehicles },
    { href: path("/ankauf"), label: t.nav.purchase },
    { href: path("/#ueber-uns"), label: t.nav.about },
    { href: path("/#bewertungen"), label: t.nav.reviews },
    { href: path("/#kontakt"), label: t.nav.contact },
  ];

  const current = stripLocale(pathname);

  return (
    <>
      <header className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-50 flex justify-center pointer-events-none">
        <nav
          aria-label="Hauptnavigation"
          className={`pointer-events-auto w-full max-w-7xl rounded-full pl-4 pr-2 sm:pl-6 sm:pr-2.5 h-16 flex items-center justify-between transition-[background-color,border-color,box-shadow] duration-300 ${
            solid ? "glass-dark shadow-stage" : "bg-transparent border border-transparent"
          }`}
        >
          {/* Logo */}
          <Link
            href={path("/")}
            className="flex-shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
            aria-label={SITE.name}
          >
            <Image
              src="/bucan-logo-transparent.png"
              alt="Bucan Automobile"
              width={320}
              height={212}
              className="h-11 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop-Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = !link.href.includes("#") && current.startsWith(stripLocale(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 ${
                    active ? "text-gold-300" : "text-ivory-50/80 hover:text-ivory-50 active:text-gold-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Rechts: Sprache, Telefon */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitch onDark />
            <a
              href={TEL_HREF}
              className="inline-flex items-center gap-2 h-11 pl-4 pr-5 rounded-full bg-ivory-50 text-ink text-sm font-semibold hover:bg-white active:bg-ivory-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
            >
              <Phone size={15} className="text-gold-600" />
              {SITE.phoneDisplay}
            </a>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href={TEL_HREF}
              aria-label={t.nav.callUs}
              className="w-11 h-11 rounded-full bg-ivory-50 text-ink flex items-center justify-center hover:bg-white active:bg-ivory-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
            >
              <Phone size={17} />
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="w-11 h-11 rounded-full text-ivory-50 border border-white/15 bg-white/5 flex items-center justify-center hover:bg-white/10 active:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
              onClick={() => (menuOpen ? close() : setMenuOpen(true))}
              aria-label={menuOpen ? t.nav.close : t.nav.menu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile-Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        className={`lg:hidden fixed inset-0 z-40 bg-graphite-950/96 backdrop-blur-xl transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col pt-28 pb-10 px-8 overflow-y-auto">
          <ul className="space-y-1">
            {navLinks.map((link, i) => (
              <li key={link.href} style={{ transitionDelay: `${i * 40}ms` }} className={`transition-[opacity,transform] duration-500 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 font-serif text-4xl text-ivory-50 hover:text-gold-300 active:text-gold-200 transition-colors focus-visible:outline-none focus-visible:text-gold-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hairline my-8" />

          <div className="space-y-4">
            <a href={TEL_HREF} className="flex items-center gap-3 text-ivory-50 text-lg font-medium">
              <Phone size={18} className="text-gold-400" /> {SITE.phoneDisplay}
            </a>
            <a
              href={whatsappUrl(t.whatsapp.prefill)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-ivory-50/80 text-base"
            >
              <ArrowUpRight size={18} className="text-gold-400" /> WhatsApp
            </a>
            <p className="text-ivory-50/50 text-sm leading-relaxed pt-2">
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}
            </p>
          </div>

          <div className="mt-auto pt-8 flex items-center justify-between">
            <LanguageSwitch onDark />
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold-400/80">Est. 2020</span>
          </div>
        </div>
      </div>
    </>
  );
}
