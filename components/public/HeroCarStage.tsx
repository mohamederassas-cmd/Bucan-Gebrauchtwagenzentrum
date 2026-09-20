import Image from "next/image";

/**
 * Fahrzeug-Bühne im Hero: ein freigestelltes Fahrzeug auf der dunklen Bühne, darüber
 * eine choreografierte Lichtshow aus reinem CSS (Scheinwerferkegel, Glanz-Sweep
 * über die Karosserie, Lichtpfütze und Spiegelung am Boden). Server-Komponente,
 * kein JavaScript.
 *
 * Alle Bewegungen laufen ausschließlich über transform und opacity und stehen bei
 * prefers-reduced-motion still (siehe .stage-* in globals.css).
 */

/** Freigestelltes PNG mit Alphakanal, aus dem Originalfoto gelöst (siehe
 *  ASSET-QUELLEN.md und tools/cutout.swift). Weil der Wagen keinen eigenen
 *  Hintergrund mehr mitbringt, steht keine Bildkante mehr über den goldenen
 *  Hintergrundlinien: er steht frei im Raum und wird allein durch Licht,
 *  Bodenspiegelung und Schatten geerdet. */
const PHOTO = "/hero/car-cutout.png";
const PHOTO_W = 1600;
const PHOTO_H = 445;

/** Gemeinsam für Wagen und Spiegelung, damit der Browser nur eine Datei lädt. */
const SIZES = "(min-width: 1024px) 46vw, 92vw";

interface Props {
  title: string;
  className?: string;
}

export default function HeroCarStage({ title, className = "" }: Props) {
  return (
    <div className={`car-stage relative aspect-[8/5] w-full ${className}`}>
      {/* Lichtglocke hinter dem Wagen: hebt die schwarze Karosserie vom ebenso
          dunklen Seitenhintergrund ab, ohne eine sichtbare Fläche zu erzeugen. */}
      <div className="stage-glow" aria-hidden="true" />

      {/* Scheinwerferkegel von oben, schwenken langsam gegeneinander */}
      <div className="stage-beam stage-beam-l" aria-hidden="true" />
      <div className="stage-beam stage-beam-r" aria-hidden="true" />

      {/* Lichtpfütze auf der Standlinie: setzt den Wagen auf den Boden */}
      <div className="stage-pool" aria-hidden="true" />

      {/* Wagen und seine Spiegelung. Die Standlinie ist die Unterkante von .stage-rig,
          die Spiegelung beginnt bei top: 100 % exakt dort.
          priority: steht auf Mobilgeräten über der Überschrift und trägt den LCP. */}
      <div className="stage-rig">
        <div className="stage-shadow" aria-hidden="true" />
        {/* relative, sonst malt der positionierte Kontaktschatten über den Wagen */}
        <Image
          src={PHOTO}
          alt={title}
          width={PHOTO_W}
          height={PHOTO_H}
          priority
          sizes={SIZES}
          className="relative w-full h-auto"
        />
        <Image
          src={PHOTO}
          alt=""
          aria-hidden="true"
          width={PHOTO_W}
          height={PHOTO_H}
          loading="eager"
          sizes={SIZES}
          className="stage-mirror w-full h-auto"
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
