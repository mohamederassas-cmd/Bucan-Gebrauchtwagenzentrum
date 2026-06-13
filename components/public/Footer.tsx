import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image
              src="/bucan-logo.jpg"
              alt="Bucan Automobile"
              width={160}
              height={80}
              className="h-20 w-auto mb-6 object-contain"
            />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Ihr vertrauensvoller Partner für Gebrauchtwagen aller Marken in München.
              Faire Preise, transparente Abwicklung, persönlicher Service.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.facebook.com/profile.php?id=61590425339745&mibextid=wwXIfr&rdid=oTKduCK8B9FXcXB7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BTqK665S5%2F%3Fmibextid%3DwwXIfr%26ref%3D1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/bucanautomobile?igsh=NTU5M3QzOWZxcHFq&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
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
                <a href="mailto:info@bucan-automobile.de" className="text-slate-400 text-sm hover:text-white transition-colors">
                  info@bucan-automobile.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Bucan Automobile – Denis Bucan. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 items-center">
            <Link href="/impressum" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <a
            href="https://hybote.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 text-xs hover:text-slate-400 transition-colors"
          >
            Powered &amp; Designed by HYBOTE AI Systems LLC
          </a>
        </div>
      </div>
    </footer>
  );
}
