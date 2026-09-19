"""Erzeugt die Hero-Bühne (public/hero/) aus einem echten Fahrzeugfoto.

Kein KI-Bild: Das Foto stammt aus dem eigenen Bestand (mobile.de-Inserat), wird
graphitfarben gegradet und in eine dunkle Bühne komponiert – links/unten bleibt
Raum für Headline und Text.

    python3 scripts/hero-image.py [foto.jpg]   # ohne Argument: scripts/hero-quelle.avif

Voraussetzung: Pillow + numpy (`pip3 install pillow numpy`). Die Bildausschnitte
(CAR, photo_box) sind auf das Foto des schwarzen Audi A6 abgestimmt; für ein
anderes Foto müssen sie angepasst werden – danach jeweils Desktop (1440px) und
Mobile (375px) im Browser gegenprüfen.
"""
import os
import sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "scripts", "hero-quelle.avif")
OUT = os.path.join(ROOT, "public", "hero")

GRAPHITE = np.array([11, 12, 14], np.float32) / 255
MID      = np.array([42, 45, 51], np.float32) / 255   # #2A2D33
GOLD     = np.array([194, 160, 87], np.float32) / 255

def grade(im, sat=0.48, gamma=1.30, lift=0.06, gold=0.15, grain=2.6):
    a = np.asarray(im.convert("RGB"), np.float32) / 255.0
    luma = (a * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1)
    a = luma[..., None] * (1 - sat) + a * sat
    a = np.clip(a, 0, 1) ** gamma
    a = np.clip((a - 0.5) * 1.14 + 0.5, 0, 1)
    a = a * (1 - lift) + GRAPHITE * lift
    hi = (np.clip((luma - 0.55) / 0.45, 0, 1) ** 1.4)[..., None]
    a = a * (1 - gold * hi) + GOLD * (gold * hi)
    rng = np.random.default_rng(7)
    a = np.clip(a + rng.normal(0, grain / 255, a.shape).astype(np.float32), 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8))

def stage(w, h, cx, cy, rx, ry):
    """Dunkle Buehne wie der CSS-Platzhalter: radialer Graphit-Verlauf + Goldschimmer."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx - w * cx) / (w * rx)) ** 2 + ((yy - h * cy) / (h * ry)) ** 2)
    t = np.clip(r, 0, 1.4)
    a = np.where(t[..., None] < 0.45,
                 MID + (GRAPHITE * 1.35 - MID) * (t[..., None] / 0.45),
                 GRAPHITE * 1.35 + (GRAPHITE - GRAPHITE * 1.35) * np.clip((t[..., None] - 0.45) / 0.55, 0, 1))
    g = np.exp(-(((xx - w * (cx + 0.02)) / (w * 0.30)) ** 2 + ((yy - h * (cy + 0.14)) / (h * 0.22)) ** 2))
    a = np.clip(a + GOLD * (g * 0.17)[..., None], 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8))

def fade_mask(w, h, left=0.0, right=0.0, top=0.0, bottom=0.0):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    m = np.ones((h, w), np.float32)
    if left:   m = np.minimum(m, np.clip(xx / (w * left), 0, 1) ** 1.25)
    if right:  m = np.minimum(m, np.clip((w - 1 - xx) / (w * right), 0, 1) ** 1.25)
    if top:    m = np.minimum(m, np.clip(yy / (h * top), 0, 1) ** 1.25)
    if bottom: m = np.minimum(m, np.clip((h - 1 - yy) / (h * bottom), 0, 1) ** 1.25)
    return Image.fromarray((m * 255).astype(np.uint8))

def hide_plate(im, box=(34, 630, 266, 752), dim=0.30, blur=6.0):
    """Fremdwerbung auf dem Haendler-Kennzeichen weich in den Lack zurueckziehen."""
    x0, y0, x1, y1 = box
    reg = im.crop(box).filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(reg, np.float32) * dim
    reg = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    w, h = x1 - x0, y1 - y0
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    m = np.clip(1 - (r - 0.55) / 0.45, 0, 1) ** 1.2
    im.paste(reg, (x0, y0), Image.fromarray((m * 255).astype(np.uint8)))
    return im


def compose(out_size, crop, photo_box, stage_focus, fades, name):
    W, H = out_size
    canvas = stage(W, H, *stage_focus)
    car = grade(hide_plate(Image.open(SRC).convert("RGB")).crop(crop))
    px, py, pw, ph = photo_box
    car = car.resize((pw, ph), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.5, 50, 3))
    canvas.paste(car, (px, py), fade_mask(pw, ph, **fades))
    p = os.path.join(OUT, name)
    canvas.save(p, "JPEG", quality=84, optimize=True, progressive=True)
    print(name, canvas.size, f"{os.path.getsize(p)/1024:.0f} KB")

os.makedirs(OUT, exist_ok=True)

# Auto komplett im Bild lassen: Front bei x~30, Heck bei x~1600, Dach y~230, Reifen y~1010
CAR = (24, 214, 1600, 1046)

# Desktop 16:9 – Wagen rechts, links bleibt Graphit fuer Headline
compose((2000, 1125), CAR, (620, 250, 1450, 765), (0.70, 0.56, 0.60, 0.66),
        dict(left=0.30, top=0.22, bottom=0.26, right=0.06), "hero-desktop.jpg")

# Mobile 2:3 – Wagen in der unteren Haelfte, oben Luft fuer die Headline
compose((1080, 1620), CAR, (30, 120, 1120, 576), (0.54, 0.26, 0.78, 0.40),
        dict(left=0.22, top=0.20, bottom=0.34, right=0.10), "hero-mobile.jpg")
