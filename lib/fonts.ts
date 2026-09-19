import { Inter, Cormorant_Garamond } from "next/font/google";

/** Selbst gehostet über next/font (kein Abruf bei Google zur Laufzeit → DSGVO-konform). */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Display-Serife für Überschriften der öffentlichen Website (greift die Logo-Wortmarke auf). */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display-serif",
  display: "swap",
});
