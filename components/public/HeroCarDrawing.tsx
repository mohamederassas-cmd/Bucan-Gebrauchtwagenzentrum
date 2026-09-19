import type { CSSProperties } from "react";

interface Props {
  title: string;
  className?: string;
}

/**
 * Goldene Linienzeichnung einer Fahrzeugsilhouette (Seitenprofil, Front links).
 * Jede Linie zeichnet sich beim Laden selbst (CSS .draw, pathLength=1, gestaffelt
 * über --delay/--dur). Reduced Motion: sofort komplett gezeichnet.
 */
export default function HeroCarDrawing({ title, className = "" }: Props) {
  const t = (delay: number, dur: number) =>
    ({ "--delay": `${delay}s`, "--dur": `${dur}s` } as CSSProperties);
  const stroke = { vectorEffect: "non-scaling-stroke" as const, pathLength: 1 };

  return (
    <svg
      viewBox="0 0 1200 520"
      className={`block w-full h-auto ${className}`}
      role="img"
      aria-labelledby="hero-car-title"
      fill="none"
      stroke="#C2A057"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title id="hero-car-title">{title}</title>
      <defs>
        <linearGradient id="hero-ground" gradientUnits="userSpaceOnUse" x1="40" y1="452" x2="1160" y2="452">
          <stop offset="0" stopColor="#C2A057" stopOpacity="0" />
          <stop offset="0.5" stopColor="#DCC585" stopOpacity="0.9" />
          <stop offset="1" stopColor="#C2A057" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Bodenlinie */}
      <path {...stroke} className="draw" style={t(0.15, 1.5)} stroke="url(#hero-ground)" d="M40 452H1160" />

      {/* Karosserie-Silhouette: Front links, Haube, Windschutzscheibe, Dach, Heckscheibe, Heck, Radhäuser */}
      <path
        {...stroke}
        className="draw draw-fill"
        style={t(0, 1.9)}
        strokeWidth={1.75}
        fill="#C2A057"
        d="M95 405 C78 380 82 335 110 318 C175 302 300 290 430 282 C478 238 540 204 615 196 C700 190 800 192 862 204 C910 218 950 250 992 278 C1040 288 1090 292 1106 306 C1122 332 1120 380 1100 405 L992 405 A92 92 0 0 0 808 405 L392 405 A92 92 0 0 0 208 405 Z"
      />

      {/* Glashaus mit Gürtellinie */}
      <path {...stroke} className="draw" style={t(0.55, 1.2)} d="M458 292 C500 254 548 220 618 210 C700 204 796 206 850 218 C892 232 925 260 948 288 Z" />
      {/* B-Säule und Türfuge */}
      <path {...stroke} className="draw" style={t(1.0, 0.6)} d="M700 206 L692 292 C690 330 688 370 694 405" />
      {/* Außenspiegel */}
      <path {...stroke} className="draw" style={t(1.2, 0.4)} d="M452 268 C444 260 430 260 425 270 C428 279 442 281 452 277" />
      {/* Türgriffe */}
      <path {...stroke} className="draw" style={t(1.35, 0.35)} strokeWidth={1.75} d="M560 322 L604 322" />
      <path {...stroke} className="draw" style={t(1.45, 0.35)} strokeWidth={1.75} d="M760 322 L804 322" />
      {/* Charakterlinie */}
      <path {...stroke} className="draw" style={t(1.3, 0.9)} strokeOpacity={0.7} d="M135 345 C400 332 750 330 1075 342" />
      {/* Scheinwerfer und Rückleuchte */}
      <path {...stroke} className="draw" style={t(1.45, 0.6)} d="M100 325 C135 318 170 316 200 320 C196 332 160 336 104 336 Z" />
      <path {...stroke} className="draw" style={t(1.55, 0.6)} d="M1108 320 C1080 316 1050 317 1030 324 C1036 334 1070 336 1104 334 Z" />
      {/* Lufteinlass vorn, Stoßfängerkante hinten */}
      <path {...stroke} className="draw" style={t(1.5, 0.4)} strokeOpacity={0.7} d="M112 372 L205 372" />
      <path {...stroke} className="draw" style={t(1.6, 0.4)} strokeOpacity={0.7} d="M1010 372 L1092 372" />

      {/* Räder: Reifen, Felge, Nabe, fünf Speichen */}
      {[300, 900].map((cx, w) => (
        <g key={cx}>
          <circle {...stroke} className="draw" style={t(0.7 + w * 0.15, 1.0)} strokeWidth={1.75} cx={cx} cy={386} r={66} />
          <circle {...stroke} className="draw" style={t(1.1 + w * 0.15, 0.8)} cx={cx} cy={386} r={44} />
          <circle {...stroke} className="draw" style={t(1.5 + w * 0.15, 0.4)} cx={cx} cy={386} r={8} />
          {[
            [0, -40],
            [38, -12],
            [24, 32],
            [-24, 32],
            [-38, -12],
          ].map(([dx, dy], s) => (
            <path
              key={s}
              {...stroke}
              className="draw"
              style={t(1.55 + w * 0.15 + s * 0.05, 0.35)}
              strokeOpacity={0.8}
              d={`M${cx} 386 L${cx + dx} ${386 + dy}`}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
