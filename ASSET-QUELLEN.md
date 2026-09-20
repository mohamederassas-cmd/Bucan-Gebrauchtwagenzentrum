# Bildquellen

## public/hero/car-cutout.png — Fahrzeug im Hero

Das freigestellte PNG mit Alphakanal, das `components/public/HeroCarStage.tsx` anzeigt.
Der Wagen bringt keinen eigenen Hintergrund mit: er steht frei über dem animierten
Linien-Hintergrund und wird allein durch CSS geerdet (Kontaktschatten, Lichtpfütze,
Bodenspiegelung). Genau deshalb ist die Freistellung nötig. Ein rechteckiges Foto
stand vorher sichtbar als Kasten auf der Seite.

Erzeugt aus `public/hero/car.jpg` in zwei Schritten, beide lokal auf dem Mac,
ohne externen Dienst:

```bash
swiftc -O tools/cutout.swift -o /tmp/cutout && /tmp/cutout public/hero/car.jpg /tmp/car-cut.png
swiftc -O tools/crop.swift   -o /tmp/crop   && /tmp/crop   /tmp/car-cut.png  /tmp/car-crop.png
sips -Z 1600 /tmp/car-crop.png --out public/hero/car-cutout.png
```

- `tools/cutout.swift` — Freistellen per Vision (`VNGenerateForegroundInstanceMaskRequest`,
  macOS 14+). Dieselbe Technik wie "Motiv extrahieren" in der Vorschau-App.
- `tools/crop.swift` — schneidet auf die Alpha-Bounding-Box zu, damit im PNG kein
  leerer Rand mitgeladen wird und der Wagen die volle Breite der Bühne nutzt.
- Endformat: 1600 x 445 px. Die Maße stehen als `PHOTO_W` / `PHOTO_H` in
  `HeroCarStage.tsx`. Bei einem neuen Bild dort mitpflegen, sonst springt das Layout.

Bei einem Fahrzeugwechsel: neues Foto nach `public/hero/car.jpg`, die drei Befehle
oben laufen lassen, Maße prüfen, diese Datei aktualisieren.

## public/hero/car.jpg — Originalfoto

Bleibt im Repo, weil die Freistellung ohne das Original nicht wiederholbar wäre.
Wird selbst nicht mehr angezeigt.

Quelle:      https://unsplash.com/photos/FMbWFDiVRPs
Fotograf:    Samuele Errico Piccarini
Lizenz:      Unsplash License (kommerzielle Nutzung erlaubt, keine Namensnennung nötig)
Heruntergeladen: 2026-09-20
Hinweis:     Reine Seitenansicht ohne sichtbares Markenemblem, bewusst gewählt, damit
             keine Herstellerzugehörigkeit suggeriert wird.

Die Unsplash License erlaubt die kommerzielle Nutzung ohne Namensnennung. Trotzdem
bleibt dieser Nachweis im Repo, damit die Herkunft des Bildes später nachvollziehbar
ist. Bei einem Austausch des Fotos diese Datei mitpflegen.
