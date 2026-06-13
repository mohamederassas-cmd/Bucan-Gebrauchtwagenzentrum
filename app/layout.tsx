import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUCAN AUTOMOBILE – Premium Fahrzeuge München",
  description: "BUCAN AUTOMOBILE – Ihr exklusiver Fahrzeughändler in München. Geprüfte Gebrauchtwagen aller Marken. Faire Preise, transparente Abwicklung.",
  keywords: "Gebrauchtwagen München, Auto kaufen München, Fahrzeughandel München, BUCAN AUTOMOBILE",
  openGraph: {
    title: "BUCAN AUTOMOBILE – Premium Fahrzeuge München",
    description: "Exklusiver Fahrzeughandel in München. Geprüfte Fahrzeuge, faire Preise.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
