import Foundation
import Vision
import CoreImage
import AppKit

// Freistellen per Vision Subject Lifting (macOS 14+), lokal, ohne Netz.
let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: cutout <in> <out.png>"); exit(2) }
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let src = CIImage(contentsOf: inURL) else { print("konnte Bild nicht laden"); exit(1) }

let handler = VNImageRequestHandler(url: inURL, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
do { try handler.perform([req]) } catch { print("Vision-Fehler: \(error)"); exit(1) }

guard let obs = req.results?.first else { print("kein Motiv erkannt"); exit(3) }
print("Instanzen gefunden: \(obs.allInstances.count)")

let pixelBuffer = try! obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
var mask = CIImage(cvPixelBuffer: pixelBuffer)

// Maske auf Bildgröße skalieren (Vision liefert evtl. andere Auflösung)
let sx = src.extent.width / mask.extent.width
let sy = src.extent.height / mask.extent.height
mask = mask.transformed(by: CGAffineTransform(scaleX: sx, y: sy))

let filter = CIFilter(name: "CIBlendWithMask")!
filter.setValue(src, forKey: kCIInputImageKey)
filter.setValue(CIImage(color: .clear).cropped(to: src.extent), forKey: kCIInputBackgroundImageKey)
filter.setValue(mask, forKey: kCIInputMaskImageKey)
guard let out = filter.outputImage else { print("Blend fehlgeschlagen"); exit(1) }

let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
try! ctx.writePNGRepresentation(of: out, to: outURL, format: .RGBA8, colorSpace: cs)
print("geschrieben: \(outURL.path)")
