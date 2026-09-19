"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Star } from "lucide-react";
import { SITE, TEL_HREF, MAIL_HREF } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { fmt } from "@/lib/i18n";

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const linkCls =
  "text-ivory-50/60 text-sm hover:text-ivory-50 active:text-gold-300 transition-colors focus-visible:outline-none focus-visible:text-gold-300 rounded";

export default function Footer() {
  const { t, path, locale } = useI18n();
  const f = t.footer;
  const [weekdays, saturday] = SITE.openingHours;
  const rating = SITE.trust.ratingDisplay[locale];

  return (
    <footer className="relative z-10 text-ivory-50">
      <div className="hairline" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Marke */}
          <div className="md:col-span-5">
            <Image
              src="/bucan-logo-transparent.png"
              alt="Bucan Automobile"
              width={320}
              height={212}
              className="h-24 w-auto mb-6 object-contain"
            />
            <p className="text-ivory-50/60 text-sm leading-relaxed max-w-sm">{f.tagline}</p>

            <div className="flex items-center gap-2 mt-6 text-sm">
              <span className="flex gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-gold-400 text-gold-400" />
                ))}
              </span>
              <span className="text-ivory-50 font-semibold">{rating}</span>
              <span className="text-ivory-50/50">
                · {fmt(t.reviews.count, { count: SITE.trust.reviewCount, source: SITE.trust.reviewsSource })}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-ivory-50/60 hover:text-gold-300 hover:border-gold-500/50 active:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-ivory-50/60 hover:text-gold-300 hover:border-gold-500/50 active:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] text-gold-300 font-semibold tracking-[0.2em] uppercase mb-5">{f.navigation}</h4>
            <ul className="space-y-3">
              {[
                { href: path("/fahrzeuge"), label: f.allVehicles },
                { href: path("/ankauf"), label: f.purchase },
                { href: path("/#ueber-uns"), label: f.about },
                { href: path("/#bewertungen"), label: f.reviews },
                { href: path("/#kontakt"), label: f.contactLink },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] text-gold-300 font-semibold tracking-[0.2em] uppercase mb-5">{f.contact}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <a href={SITE.mapsDirections} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {SITE.address.street}
                  <br />
                  {SITE.address.zip} {SITE.address.city}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-400 flex-shrink-0" />
                <a href={TEL_HREF} className={linkCls}>
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-400 flex-shrink-0" />
                <a href={MAIL_HREF} className={linkCls}>
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <div className="text-ivory-50/60 text-sm">
                  <span className="block text-ivory-50/80 text-[11px] font-semibold tracking-[0.18em] uppercase mb-1">{f.hours}</span>
                  {t.contact.weekdays}: {weekdays.opens} – {weekdays.closes}{t.contact.timeSuffix}
                  <br />
                  {t.contact.saturday}: {saturday.opens} – {saturday.closes}{t.contact.timeSuffix}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Unten */}
        <div className="border-t border-white/8 mt-14 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ivory-50/40 text-xs">
            © {new Date().getFullYear()} {SITE.legalName}. {f.rights}
          </p>
          <div className="flex gap-6 items-center">
            <span className="hidden sm:inline text-[11px] tracking-[0.2em] uppercase text-gold-400/70">{f.since}</span>
            <Link href="/impressum" className="text-ivory-50/40 text-xs hover:text-ivory-50 transition-colors focus-visible:outline-none focus-visible:text-gold-300">
              {f.imprint}
            </Link>
            <Link href="/datenschutz" className="text-ivory-50/40 text-xs hover:text-ivory-50 transition-colors focus-visible:outline-none focus-visible:text-gold-300">
              {f.privacy}
            </Link>
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <a
            href="https://hybote.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ivory-50/30 text-[11px] hover:text-ivory-50/60 transition-colors focus-visible:outline-none focus-visible:text-gold-300"
          >
            Powered &amp; Designed by HYBOTE AI Systems LLC
          </a>
        </div>
      </div>
    </footer>
  );
}
