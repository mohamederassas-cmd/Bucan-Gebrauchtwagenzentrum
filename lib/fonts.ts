import { Inter } from "next/font/google";

/** Selbst gehostet über next/font (kein Abruf bei Google zur Laufzeit → DSGVO-konform). */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
