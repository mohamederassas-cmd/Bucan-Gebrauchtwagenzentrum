import type { Metadata } from "next";
import "../globals.css";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Admin – BUCAN AUTOMOBILE",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
