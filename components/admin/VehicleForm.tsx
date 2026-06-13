"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Vehicle, VehicleFormData, FUEL_TYPES, TRANSMISSION_TYPES, VehicleStatus } from "@/lib/types";
import { Plus, X, Save, Loader, Upload, ImageIcon } from "lucide-react";

const CAR_BRANDS = [
  "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
  "Chevrolet", "Chrysler", "Citroën", "Dacia", "Ferrari", "Fiat",
  "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia",
  "Lamborghini", "Land Rover", "Lexus", "Maserati", "Mazda",
  "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Opel",
  "Peugeot", "Porsche", "Renault", "Rolls-Royce", "SEAT",
  "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota",
  "Volkswagen", "Volvo",
].sort();

const KOMFORT_FEATURES = [
  "Abgedunkelte Scheiben", "Armlehne", "Bluetooth", "CD-Spieler",
  "Elektrische Seitenspiegel", "Elektrische Wegfahrsperre", "Freisprecheinrichtung",
  "Isofix", "Lederlenkrad", "Multifunktionslenkrad", "Raucherpaket",
  "Schaltwippen", "Scheinwerferreinigung", "Sitzheizung", "Sprachsteuerung",
  "Tagfahrlicht", "Winterpaket", "Zentralverriegelung",
];

const TECHNIK_FEATURES = [
  "ABS", "Berganfahrassistent", "Bordcomputer", "Elektrische Fensterheber",
  "Elektrische Seitenspiegel anklappbar", "ESP", "Frontantrieb",
  "Geschwindigkeitsbegrenzer", "Kurvenlicht", "Leichtmetallfelgen",
  "Navigationssystem", "Regensensor", "Scheckheftgepflegt", "Servolenkung",
  "Sommerreifen", "Start/Stopp-Automatik", "Tempomat", "Winterreifen",
];

const ALL_PREDEFINED = new Set([...KOMFORT_FEATURES, ...TECHNIK_FEATURES]);

interface Props {
  vehicle?: Vehicle;
  mode: "create" | "edit";
}

const defaultForm: VehicleFormData = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  mileage: 0,
  price: 0,
  fuel_type: "Benzin",
  transmission: "Automatik",
  power_ps: null,
  color: "",
  description: "",
  features: [],
  images: [],
  status: "available",
  featured: false,
};

export default function VehicleForm({ vehicle, mode }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<VehicleFormData>(
    vehicle
      ? {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          price: vehicle.price,
          fuel_type: vehicle.fuel_type,
          transmission: vehicle.transmission,
          power_ps: vehicle.power_ps,
          color: vehicle.color ?? "",
          description: vehicle.description ?? "",
          features: vehicle.features,
          images: vehicle.images,
          status: vehicle.status,
          featured: vehicle.featured,
        }
      : defaultForm
  );

  const [featureInput, setFeatureInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof VehicleFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (f: string) => {
    update(
      "features",
      form.features.includes(f)
        ? form.features.filter((x) => x !== f)
        : [...form.features, f]
    );
  };

  const addCustomFeature = () => {
    const f = featureInput.trim();
    if (f && !form.features.includes(f)) {
      update("features", [...form.features, f]);
    }
    setFeatureInput("");
  };

  const removeFeature = (f: string) => {
    update("features", form.features.filter((x) => x !== f));
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploading(true);
    const newUrls: string[] = [];

    for (const file of fileArray) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          if (!form.images.includes(url) && !newUrls.includes(url)) {
            newUrls.push(url);
          }
        }
      } catch {
        // ignore individual upload failures silently
      }
    }

    update("images", [...form.images, ...newUrls]);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const addImageUrl = () => {
    const url = imageInput.trim();
    if (url && !form.images.includes(url)) {
      update("images", [...form.images, url]);
    }
    setImageInput("");
  };

  const removeImage = (url: string) => {
    update("images", form.images.filter((x) => x !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = mode === "create" ? "/api/vehicles" : `/api/vehicles/${vehicle!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/fahrzeuge");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-3 text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 text-sm transition-colors";
  const labelCls = "block text-[#475569] text-xs font-accent tracking-wider uppercase mb-2";
  const sectionCls = "bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-card";

  const customFeatures = form.features.filter((f) => !ALL_PREDEFINED.has(f));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">{error}</div>
      )}

      {/* Basic Info */}
      <div className={sectionCls}>
        <h2 className="font-display text-lg text-[#0F172A] font-semibold mb-6">Basisinformationen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Marke *</label>
            <input
              required
              list="brand-suggestions"
              className={inputCls}
              value={form.make}
              onChange={(e) => update("make", e.target.value)}
              placeholder="Marke eingeben oder auswählen..."
              autoComplete="off"
            />
            <datalist id="brand-suggestions">
              {CAR_BRANDS.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelCls}>Modell *</label>
            <input required className={inputCls} value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="z.B. 5er, A4, C-Klasse" />
          </div>
          <div>
            <label className={labelCls}>Baujahr *</label>
            <input required type="number" min={1990} max={new Date().getFullYear() + 1} className={inputCls} value={form.year} onChange={(e) => update("year", parseInt(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>Farbe</label>
            <input className={inputCls} value={form.color} onChange={(e) => update("color", e.target.value)} placeholder="z.B. Schwarz Metallic" />
          </div>
        </div>
      </div>

      {/* Technical */}
      <div className={sectionCls}>
        <h2 className="font-display text-lg text-[#0F172A] font-semibold mb-6">Technische Daten</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Kilometerstand *</label>
            <input required type="number" min={0} className={inputCls} value={form.mileage} onChange={(e) => update("mileage", parseInt(e.target.value))} placeholder="km" />
          </div>
          <div>
            <label className={labelCls}>Preis (€) *</label>
            <input required type="number" min={0} className={inputCls} value={form.price} onChange={(e) => update("price", parseInt(e.target.value))} placeholder="EUR" />
          </div>
          <div>
            <label className={labelCls}>Leistung (PS)</label>
            <input type="number" min={1} className={inputCls} value={form.power_ps ?? ""} onChange={(e) => update("power_ps", e.target.value ? parseInt(e.target.value) : null)} placeholder="PS" />
          </div>
          <div>
            <label className={labelCls}>Kraftstoff *</label>
            <select required className={inputCls} value={form.fuel_type} onChange={(e) => update("fuel_type", e.target.value)} style={{ background: "white" }}>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Getriebe *</label>
            <select required className={inputCls} value={form.transmission} onChange={(e) => update("transmission", e.target.value)} style={{ background: "white" }}>
              {TRANSMISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Status & Featured */}
      <div className={sectionCls}>
        <h2 className="font-display text-lg text-[#0F172A] font-semibold mb-6">Status & Sichtbarkeit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Status</label>
            <div className="flex gap-2">
              {(["available", "reserved", "sold"] as VehicleStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update("status", s)}
                  className={`flex-1 py-2.5 px-3 rounded border text-xs font-accent transition-all ${
                    form.status === s
                      ? s === "available" ? "bg-green-50 border-green-300 text-green-700"
                        : s === "reserved" ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-red-50 border-red-300 text-red-700"
                      : "bg-[#F1F5F9] border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]"
                  }`}
                >
                  {s === "available" ? "Verfügbar" : s === "reserved" ? "Reserviert" : "Verkauft"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Homepage-Highlight</label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => update("featured", !form.featured)}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${form.featured ? "bg-[#2563EB]" : "bg-[#CBD5E1]"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${form.featured ? "left-7" : "left-1"}`} />
              </div>
              <span className="text-[#475569] text-sm">{form.featured ? "Wird auf der Homepage angezeigt" : "Nicht auf Homepage"}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={sectionCls}>
        <h2 className="font-display text-lg text-[#0F172A] font-semibold mb-6">Beschreibung</h2>
        <textarea
          className={`${inputCls} min-h-[120px] resize-y`}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Fahrzeugbeschreibung..."
        />
      </div>

      {/* Ausstattung */}
      <div className={sectionCls}>
        <h2 className="font-display text-lg text-[#0F172A] font-semibold mb-6">Ausstattung</h2>

        {/* Predefined categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Komfort */}
          <div>
            <h3 className="text-xs font-accent text-[#475569] tracking-wider uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] inline-block" />
              Komfort &amp; Innenraum
            </h3>
            <div className="space-y-1.5">
              {KOMFORT_FEATURES.map((f) => {
                const checked = form.features.includes(f);
                return (
                  <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => toggleFeature(f)}
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                        checked ? "bg-[#2563EB] border-[#2563EB]" : "bg-white border-[#CBD5E1] group-hover:border-[#2563EB]"
                      }`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => toggleFeature(f)}
                      className={`text-sm transition-colors ${checked ? "text-[#1E3A8A] font-medium" : "text-[#475569] group-hover:text-[#0F172A]"}`}
                    >
                      {f}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Technik & Sicherheit */}
          <div>
            <h3 className="text-xs font-accent text-[#475569] tracking-wider uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1E3A8A] inline-block" />
              Sicherheit &amp; Technik
            </h3>
            <div className="space-y-1.5">
              {TECHNIK_FEATURES.map((f) => {
                const checked = form.features.includes(f);
                return (
                  <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => toggleFeature(f)}
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                        checked ? "bg-[#1E3A8A] border-[#1E3A8A]" : "bg-white border-[#CBD5E1] group-hover:border-[#1E3A8A]"
                      }`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => toggleFeature(f)}
                      className={`text-sm transition-colors ${checked ? "text-[#1E3A8A] font-medium" : "text-[#475569] group-hover:text-[#0F172A]"}`}
                    >
                      {f}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom / additional features */}
        <div className="border-t border-[#E2E8F0] pt-5">
          <h3 className="text-xs font-accent text-[#475569] tracking-wider uppercase mb-3">Sonstige Ausstattung</h3>
          <div className="flex gap-2 mb-3">
            <input
              className={`${inputCls} flex-1`}
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomFeature(); } }}
              placeholder="Eigenes Merkmal hinzufügen (z.B. Anhängerkupplung)..."
            />
            <button type="button" onClick={addCustomFeature} className="btn-primary px-4 py-3 rounded-lg text-sm flex items-center gap-1">
              <Plus size={16} />
            </button>
          </div>
          {customFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customFeatures.map((f) => (
                <span key={f} className="bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1.5 rounded text-[#2563EB] text-xs font-accent flex items-center gap-1.5">
                  {f}
                  <button type="button" onClick={() => removeFeature(f)} className="hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      <div className={sectionCls}>
        <h2 className="font-display text-lg text-[#0F172A] font-semibold mb-6">Bilder</h2>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all mb-4 ${
            dragOver
              ? "border-[#2563EB] bg-[#EFF6FF]"
              : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-[#EFF6FF]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ""; }}
          />
          {uploading ? (
            <>
              <Loader size={32} className="text-[#2563EB] animate-spin" />
              <p className="text-[#475569] text-sm">Bilder werden hochgeladen…</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full flex items-center justify-center">
                <Upload size={22} className="text-[#2563EB]" />
              </div>
              <div className="text-center">
                <p className="text-[#0F172A] text-sm font-medium">Bilder hierher ziehen oder klicken zum Auswählen</p>
                <p className="text-[#94A3B8] text-xs mt-1">JPG, PNG, WebP — mehrere Dateien möglich</p>
              </div>
            </>
          )}
        </div>

        {/* Image Preview Grid */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {form.images.map((url, i) => (
              <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9]">
                {url.startsWith("/") || url.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={20} className="text-[#94A3B8]" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 w-6 h-6 bg-white/90 border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#475569] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* URL Fallback */}
        <div className="border-t border-[#E2E8F0] pt-4">
          <p className="text-xs text-[#94A3B8] mb-2">Oder Bild-URL manuell einfügen:</p>
          <div className="flex gap-2">
            <input
              className={`${inputCls} flex-1`}
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
              placeholder="https://... (Bild-URL)"
            />
            <button type="button" onClick={addImageUrl} className="btn-primary px-4 py-3 rounded-lg text-sm flex items-center gap-1">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 py-3.5 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          {mode === "create" ? "Fahrzeug erstellen" : "Änderungen speichern"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline px-6 py-3.5 rounded-lg text-sm"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
