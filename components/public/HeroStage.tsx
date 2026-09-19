import fs from "node:fs";
import path from "node:path";
import { getImageProps } from "next/image";

/**
 * Die Bühne: feststehendes Hero-Bild (sticky), über das Text und Folgesektionen gleiten.
 * Desktop und Mobile bekommen eigene Bildbeschnitte (<picture>), damit das Fahrzeug
 * auf jedem Format richtig sitzt. Solange die Bilder in public/hero/ fehlen, steht
 * eine dunkle Platzhalter-Bühne, damit Layout und Animation gebaut werden können.
 */
const DESKTOP = "/hero/hero-desktop.jpg";
const MOBILE = "/hero/hero-mobile.jpg";

function hasFile(publicPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", publicPath));
  } catch {
    return false;
  }
}

export default function HeroStage({ alt }: { alt: string }) {
  const ready = hasFile(DESKTOP) && hasFile(MOBILE);

  let picture: React.ReactNode = null;
  if (ready) {
    const common = { alt, sizes: "100vw", priority: true as const };
    const {
      props: { srcSet: desktopSet },
    } = getImageProps({ ...common, width: 2000, height: 1125, quality: 78, src: DESKTOP });
    const {
      props: { srcSet: mobileSet, style, ...rest },
    } = getImageProps({ ...common, width: 1080, height: 1620, quality: 72, src: MOBILE });
    picture = (
      <picture className="stage-image absolute inset-0 block">
        <source media="(min-width: 768px)" srcSet={desktopSet} />
        <source media="(max-width: 767px)" srcSet={mobileSet} />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          {...rest}
          style={{ ...style, width: "100%", height: "100%" }}
          className="object-cover object-[62%_50%] md:object-center select-none"
          draggable={false}
        />
      </picture>
    );
  }

  return (
    <div className="sticky top-0 h-svh w-full overflow-hidden bg-graphite-950">
      {ready ? (
        picture
      ) : (
        <div className="stage-image absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_68%_58%,#2A2D33_0%,#15171A_45%,#0B0C0E_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_28%_at_66%_66%,rgba(194,160,87,0.16),transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "96px 96px",
            }}
          />
        </div>
      )}

      {/* Lesbarkeit: Vignette, Bodenverlauf, linke Textzone.
          Das Bühnenfoto ist bereits dunkel gegradet – die Verläufe bleiben deshalb
          deutlich zurückhaltender als über dem hellen Platzhalter. Mobil steht der
          Wagen im oberen Drittel, der Text bekommt seinen Kontrast von unten. */}
      <div
        className={
          ready
            ? "absolute inset-0 bg-[radial-gradient(ellipse_at_52%_28%,transparent_58%,rgba(11,12,14,0.32)_100%)] md:bg-[radial-gradient(ellipse_at_64%_46%,transparent_46%,rgba(11,12,14,0.4)_100%)]"
            : "absolute inset-0 bg-[radial-gradient(ellipse_at_66%_48%,transparent_28%,rgba(11,12,14,0.5)_100%)]"
        }
        aria-hidden="true"
      />
      <div
        className={
          ready
            ? "absolute inset-x-0 bottom-0 h-[54%] md:h-[42%] bg-gradient-to-t from-graphite-950 via-graphite-950/80 md:via-graphite-950/30 to-transparent"
            : "absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-graphite-950 via-graphite-950/55 to-transparent"
        }
        aria-hidden="true"
      />
      <div
        className={
          ready
            ? "hidden md:block absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-graphite-950/70 via-graphite-950/20 to-transparent"
            : "absolute inset-y-0 left-0 w-full md:w-[64%] bg-gradient-to-r from-graphite-950/80 via-graphite-950/35 to-transparent"
        }
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-20 md:h-32 bg-gradient-to-b from-graphite-950/30 md:from-graphite-950/55 to-transparent" aria-hidden="true" />

      {/* Lichtreflexion, die über die Karosserie wandert */}
      <div
        className="stage-sweep"
        aria-hidden="true"
        style={{
          maskImage: "radial-gradient(ellipse 42% 40% at 66% 58%, #000 30%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 42% 40% at 66% 58%, #000 30%, transparent 72%)",
        }}
      />
    </div>
  );
}
