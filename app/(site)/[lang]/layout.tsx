import type { Metadata } from "next";
import "../../globals.css";
import { inter, cormorant } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { getDictionary, toLocale, ogLocale } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/context";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import CookieBanner from "@/components/public/CookieBanner";

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE.url),
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    openGraph: {
      title: t.meta.title,
      description: t.meta.ogDescription,
      type: "website",
      locale: ogLocale(locale),
      siteName: SITE.name,
    },
  };
}

export default async function SiteLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { lang } = await params;
  // Kein notFound() im Root-Layout (kein Boundary) – Middleware garantiert de|en.
  const locale = toLocale(lang);
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased theme-public">
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <I18nProvider locale={locale} dict={dict}>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
          <CookieBanner />
        </I18nProvider>
      </body>
    </html>
  );
}
