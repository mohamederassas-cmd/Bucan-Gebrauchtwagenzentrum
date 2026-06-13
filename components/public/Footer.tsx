import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image
              src="/bb-logo.svg"
              alt="BB Gebrauchtwagen"
              width={120}
              height={120}
              className="h-16 w-auto mb-6 bg-white rounded-full p-1"
            />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Ihr vertrauensvoller Partner für Gebrauchtwagen aller Marken in München.
              Faire Preise, transparente Abwicklung, persönlicher Service.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.facebook.com/GebrauchtwagenMunchen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm font-bold"
                aria-label="Facebook"
              >
                f
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs text-slate-300 font-semibold tracking-widest uppercase mb-4">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: "/fahrzeuge", label: "Alle Fahrzeuge" },
                { href: "/#ueber-uns", label: "Über uns" },
                { href: "/#bewertungen", label: "Kundenstimmen" },
                { href: "/#kontakt", label: "Kontakt" },
                { href: "/impressum", label: "Impressum" },
                { href: "/datenschutz", label: "Datenschutz" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs text-slate-300 font-semibold tracking-widest uppercase mb-4">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Fichtenstrasse+40%2C+85649+Hofolding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  Fichtenstrasse 40<br />85649 Hofolding
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <a href="tel:+491783022999" className="text-slate-400 text-sm hover:text-white transition-colors">
                  0178 302 2999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <a href="mailto:info@gebrauchtwagen-ankauf.de" className="text-slate-400 text-sm hover:text-white transition-colors">
                  info@gebrauchtwagen-ankauf.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} BB Gebrauchtwagen – Denis Bucan. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
