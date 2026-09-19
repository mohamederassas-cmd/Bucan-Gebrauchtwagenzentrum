"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  /** Verzögerung in ms (für gestaffelte Karten) */
  delay?: number;
  className?: string;
}

/**
 * Blendet Inhalte beim Scrollen einmalig ein (nur opacity/transform, siehe .reveal
 * in globals.css). Ohne JavaScript oder bei prefers-reduced-motion ist alles sofort sichtbar.
 */
export default function Reveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
