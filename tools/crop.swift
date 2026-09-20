import Foundation
import CoreImage
import AppKit

// Alpha-Bounding-Box bestimmen und das Bild darauf zuschneiden (kleiner Rand bleibt).
let inURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outURL = URL(fileURLWithPath: CommandLine.arguments[2])

guard let nsimg = NSImage(contentsOf: inURL),
      let cg = nsimg.cgImage(forProposedRect: nil, context: nil, hints: nil) else { exit(1) }
let w = cg.width, h = cg.height
var buf = [UInt8](repeating: 0, count: w*h*4)
let ctx = CGContext(data: &buf, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4,
                    space: CGColorSpace(name: CGColorSpace.sRGB)!,
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))

var minX = w, minY = h, maxX = -1, maxY = -1
let threshold: UInt8 = 12   // fast unsichtbare Fransen ignorieren
for y in 0..<h {
  for x in 0..<w {
    if buf[(y*w + x)*4 + 3] > threshold {
      if x < minX { minX = x }; if x > maxX { maxX = x }
      if y < minY { minY = y }; if y > maxY { maxY = y }
    }
  }
}
print("bbox: x \(minX)..\(maxX)  y \(minY)..\(maxY)  (Bild \(w)x\(h))")
guard maxX > minX else { exit(1) }

let pad = 8
let rx = max(0, minX - pad), ry = max(0, minY - pad)
let rw = min(w - rx, maxX - minX + 1 + 2*pad), rh = min(h - ry, maxY - minY + 1 + 2*pad)
guard let cropped = cg.cropping(to: CGRect(x: rx, y: ry, width: rw, height: rh)) else { exit(1) }
print("zugeschnitten auf \(rw)x\(rh)")

let rep = NSBitmapImageRep(cgImage: cropped)
rep.size = NSSize(width: rw, height: rh)
try! rep.representation(using: .png, properties: [:])!.write(to: outURL)
