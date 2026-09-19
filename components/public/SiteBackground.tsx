import type { CSSProperties } from "react";

/**
 * Feststehende Bühne hinter der gesamten öffentlichen Website.
 *
 * Port von Kokonut UI „Background Paths“ (MIT, github.com/kokonut-labs/kokonutui):
 * der Pfad-Generator ist 1:1 übernommen, die Farben sind auf Gold/Graphit gestimmt.
 * Statt jeden der 37 Pfade per JS zu animieren (Original: motion/react) driften
 * nur die drei Ebenen-Container per CSS-transform – identisches Bild, null
 * Client-JS, keine Main-Thread-Arbeit. Reduced Motion: statische Linien.
 * Unter md entfällt die dritte Ebene.
 */
type Tier = "primary" | "secondary" | "accent";

function pathD(index: number, type: Tier): string {
  const amp = type === "primary" ? 150 : type === "secondary" ? 100 : 60;
  const segments = type === "primary" ? 10 : type === "secondary" ? 8 : 6;
  const phase = index * 0.2;
  const startX = 2400;
  const startY = 800;
  const endX = -2400;
  const endY = -800 + index * 25;
  const pts: [number, number][] = [];

  for (let i = 0; i <= segments; i++) {
    const p = i / segments;
    const eased = 1 - (1 - p) ** 2;
    const bx = startX + (endX - startX) * eased;
    const by = startY + (endY - startY) * eased;
    const af = 1 - eased * 0.3;
    const y =
      by +
      Math.sin(p * Math.PI * 3 + phase) * amp * 0.7 * af +
      Math.cos(p * Math.PI * 4 + phase) * amp * 0.3 * af +
      Math.sin(p * Math.PI * 2 + phase) * amp * 0.2 * af;
    pts.push([bx, y]);
  }

  return pts
    .map(([x, y], i) => {
      if (i === 0) return `M${x.toFixed(0)} ${y.toFixed(0)}`;
      const [px, py] = pts[i - 1];
      const c1x = px + (x - px) * 0.4;
      const c2x = px + (x - px) * 0.6;
      return `C${c1x.toFixed(0)} ${py.toFixed(0)} ${c2x.toFixed(0)} ${y.toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}`;
    })
    .join("");
}

interface TierSpec {
  type: Tier;
  count: number;
  dur: string;
  drift: string;
  className: string;
  opacity: (i: number) => number;
  width: (i: number) => number;
}

const TIERS: TierSpec[] = [
  {
    type: "primary",
    count: 12,
    dur: "14s",
    drift: "-14px",
    className: "",
    opacity: (i) => 0.1 + i * 0.012,
    width: (i) => 0.8 + i * 0.04,
  },
  {
    type: "secondary",
    count: 15,
    dur: "11s",
    drift: "-9px",
    className: "",
    opacity: (i) => 0.08 + i * 0.01,
    width: (i) => 0.7 + i * 0.03,
  },
  {
    type: "accent",
    count: 10,
    dur: "9s",
    drift: "-5px",
    className: "hidden md:block",
    opacity: (i) => 0.06 + i * 0.02,
    width: (i) => 0.6 + i * 0.03,
  },
];

export default function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="site-bg fixed inset-0 z-0 overflow-hidden pointer-events-none bg-graphite-950"
    >
      {TIERS.map((tier) => (
        <div
          key={tier.type}
          className={`bg-tier absolute inset-0 ${tier.className}`}
          style={{ "--dur": tier.dur, "--drift": tier.drift } as CSSProperties}
        >
          <svg
            className="h-full w-full"
            viewBox="-2400 -800 4800 1600"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <defs>
              <linearGradient
                id={`bg-gold-${tier.type}`}
                gradientUnits="userSpaceOnUse"
                x1="-1500"
                y1="0"
                x2="1500"
                y2="0"
              >
                <stop offset="0" stopColor="#C2A057" stopOpacity="0" />
                <stop offset="0.3" stopColor="#DCC585" stopOpacity="0.85" />
                <stop offset="0.7" stopColor="#C2A057" stopOpacity="0.85" />
                <stop offset="1" stopColor="#C2A057" stopOpacity="0" />
              </linearGradient>
            </defs>
            {Array.from({ length: tier.count }, (_, i) => (
              <path
                key={i}
                d={pathD(i, tier.type)}
                stroke={`url(#bg-gold-${tier.type})`}
                strokeWidth={tier.width(i)}
                strokeOpacity={tier.opacity(i)}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
      ))}

      {/* Vignette: hält Text lesbar, dunkelt Ränder und Fuß ab */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(11,12,14,0) 0%, rgba(11,12,14,0.35) 60%, rgba(11,12,14,0.72) 100%), linear-gradient(to top, rgba(11,12,14,0.55) 0%, rgba(11,12,14,0) 35%)",
        }}
      />
    </div>
  );
}
