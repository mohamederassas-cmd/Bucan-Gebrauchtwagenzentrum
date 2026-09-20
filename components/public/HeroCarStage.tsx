import Image from "next/image";

/**
 * Fahrzeug-Bühne im Hero: ein echtes Fahrzeugfoto auf der dunklen Bühne, darüber
 * eine choreografierte Lichtshow aus reinem CSS (Scheinwerferkegel, Glanz-Sweep
 * über die Karosserie, Lichtpfütze am Boden). Server-Komponente, kein JavaScript.
 *
 * Alle Bewegungen laufen ausschließlich über transform und opacity und stehen bei
 * prefers-reduced-motion still (siehe .stage-* in globals.css).
 */

/** Foto: Samuele Errico Piccarini, Unsplash License (siehe public/hero/QUELLE.txt).
 *  Reine Seitenansicht ohne sichtbares Emblem, damit keine Herstellerzugehörigkeit
 *  suggeriert wird. Der schwarze Hintergrund verschwindet per screen-Blend im Graphit. */
const PHOTO = "/hero/car.jpg";

interface Props {
  title: string;
  className?: string;
}

export default function HeroCarStage({ title, className = "" }: Props) {
  return (
    <div className={`car-stage relative aspect-[8/5] w-full ${className}`}>
      {/* Weich auslaufende Dunkelfläche: darin verschwindet die Kante des Fotos,
          das sonst als schwarzes Rechteck über den goldenen Hintergrundlinien stünde. */}
      <div className="stage-veil" aria-hidden="true" />

      {/* Scheinwerferkegel von oben, schwenken langsam gegeneinander */}
      <div className="stage-beam stage-beam-l" aria-hidden="true" />
      <div className="stage-beam stage-beam-r" aria-hidden="true" />

      {/* Lichtpfütze: setzt den Wagen auf den Boden, statt ihn schweben zu lassen */}
      <div className="stage-pool" aria-hidden="true" />

      {/* Das Fahrzeug. priority: steht auf Mobilgeräten über der Überschrift und trägt den LCP. */}
      <div className="stage-car absolute inset-0">
        <Image
          src={PHOTO}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 92vw"
          className="stage-photo object-contain"
        />
      </div>

      {/* Glanz-Sweep: ein schmaler Lichtstreifen wandert einmalig über den Lack.
          Der Rahmen beschneidet ihn, sonst ragt der verschobene Streifen aus der
          Bühne heraus und erzeugt auf dem Handy horizontalen Scroll. */}
      <div className="stage-sheen-clip" aria-hidden="true">
        <div className="stage-sheen" />
      </div>
    </div>
  );
}
