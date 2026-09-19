"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Inquiry, INQUIRY_STATUS_LABELS, INQUIRY_TYPE_LABELS, InquiryStatus } from "@/lib/types";
import { formatDate, formatMileage, formatPrice } from "@/lib/utils";
import { AlertCircle, Check, ChevronDown, ChevronUp, Mail, Phone, RotateCcw, Trash2, X, Inbox } from "lucide-react";

interface Props {
  inquiries: Inquiry[];
}

type Filter = "new" | "done" | "all";

function isHeic(url: string) {
  return /\.hei[cf](\?|$)/i.test(url);
}

export default function InquiryList({ inquiries }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("new");
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(
    () => inquiries.filter((i) => (filter === "all" ? true : i.status === filter)),
    [inquiries, filter]
  );

  const run = async (key: string, fallback: string, request: () => Promise<Response>) => {
    setLoading(key);
    setError(null);
    try {
      const res = await request();
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || fallback);
        return;
      }
      router.refresh();
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(null);
    }
  };

  const setStatus = (id: string, status: InquiryStatus) =>
    run(id, "Status konnte nicht geändert werden.", () =>
      fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
    );

  const remove = (i: Inquiry) => {
    if (!confirm(`Anfrage von „${i.name}“ wirklich löschen? Hochgeladene Fotos werden mit entfernt.`)) return;
    return run(i.id, "Anfrage konnte nicht gelöscht werden.", () => fetch(`/api/inquiries/${i.id}`, { method: "DELETE" }));
  };

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "new", label: "Neu", count: inquiries.filter((i) => i.status === "new").length },
    { key: "done", label: "Erledigt", count: inquiries.filter((i) => i.status === "done").length },
    { key: "all", label: "Alle", count: inquiries.length },
  ];

  return (
    <div>
      {error && (
        <div role="alert" className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="Meldung schließen" className="text-red-400 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-accent border transition-colors ${
              filter === t.key
                ? "bg-[#2563EB] border-[#2563EB] text-white"
                : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]"
            }`}
          >
            {t.label} <span className="opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-card py-16 text-center text-[#475569] text-sm">
          <Inbox size={28} className="mx-auto mb-3 text-[#CBD5E1]" />
          Keine Anfragen in dieser Ansicht.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((i) => {
            const expanded = openId === i.id;
            const busy = loading === i.id;
            const summary =
              i.type === "purchase"
                ? `${i.vehicle.make} ${i.vehicle.model} · ${String(i.vehicle.first_registration.month).padStart(2, "0")}/${i.vehicle.first_registration.year} · ${formatMileage(i.vehicle.mileage)}`
                : i.message.slice(0, 90) + (i.message.length > 90 ? "…" : "");
            return (
              <div key={i.id} className={`bg-white rounded-xl border border-[#E2E8F0] shadow-card overflow-hidden ${busy ? "opacity-50" : ""}`}>
                <button
                  type="button"
                  onClick={() => setOpenId(expanded ? null : i.id)}
                  aria-expanded={expanded}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-[#F8FAFC] transition-colors"
                >
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-accent border flex-shrink-0 ${
                      i.type === "purchase"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]"
                    }`}
                  >
                    {INQUIRY_TYPE_LABELS[i.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#0F172A] text-sm font-semibold truncate">
                      {i.name}
                      {i.status === "new" && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[#2563EB] align-middle" aria-label="neu" />}
                    </div>
                    <div className="text-[#475569] text-xs truncate">{summary}</div>
                  </div>
                  <div className="text-[#475569] text-xs whitespace-nowrap hidden sm:block">{formatDate(i.created_at)}</div>
                  {expanded ? <ChevronUp size={16} className="text-[#94A3B8]" /> : <ChevronDown size={16} className="text-[#94A3B8]" />}
                </button>

                {expanded && (
                  <div className="border-t border-[#E2E8F0] px-5 py-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
                    <div className="space-y-4 text-sm">
                      <div className="flex flex-wrap gap-4">
                        <a href={`mailto:${i.email}`} className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#1D4ED8]">
                          <Mail size={15} /> {i.email}
                        </a>
                        {i.phone && (
                          <a href={`tel:${i.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#1D4ED8]">
                            <Phone size={15} /> {i.phone}
                          </a>
                        )}
                        <span className="text-[#475569]">Eingegangen: {new Date(i.created_at).toLocaleString("de-DE")} · {i.locale.toUpperCase()}</span>
                      </div>

                      {i.type === "purchase" && (
                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                          <Item label="Fahrzeug" value={`${i.vehicle.make} ${i.vehicle.model}`} />
                          <Item label="Erstzulassung" value={`${String(i.vehicle.first_registration.month).padStart(2, "0")}/${i.vehicle.first_registration.year}`} />
                          <Item label="Kilometerstand" value={formatMileage(i.vehicle.mileage)} />
                          <Item label="Kraftstoff" value={i.vehicle.fuel_type} />
                          <Item label="Getriebe" value={i.vehicle.transmission} />
                          <Item label="Preisvorstellung" value={i.vehicle.price_expectation != null ? formatPrice(i.vehicle.price_expectation) : "–"} />
                          <div className="col-span-2 sm:col-span-3">
                            <dt className="text-xs text-[#475569] uppercase tracking-wider">Zustand / Schäden</dt>
                            <dd className="text-[#0F172A] whitespace-pre-wrap mt-1">{i.vehicle.condition}</dd>
                          </div>
                        </dl>
                      )}

                      {i.message && (
                        <div>
                          <div className="text-xs text-[#475569] uppercase tracking-wider mb-1">Nachricht</div>
                          <p className="text-[#0F172A] whitespace-pre-wrap">{i.message}</p>
                        </div>
                      )}

                      {i.type === "purchase" && i.photos.length > 0 && (
                        <div>
                          <div className="text-xs text-[#475569] uppercase tracking-wider mb-2">Fotos ({i.photos.length})</div>
                          <div className="flex flex-wrap gap-2">
                            {i.photos.map((url, n) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-24 h-20 rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9] hover:border-[#2563EB] transition-colors"
                                title={`Foto ${n + 1} öffnen`}
                              >
                                {isHeic(url) ? (
                                  <span className="w-full h-full flex items-center justify-center text-[10px] text-[#475569] px-1 text-center">HEIC<br />öffnen</span>
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={url} alt={`Foto ${n + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-[11px] text-[#94A3B8]">ID {i.id}</div>
                    </div>

                    <div className="flex lg:flex-col gap-2 flex-wrap">
                      {i.status === "new" ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setStatus(i.id, "done")}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-accent bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          <Check size={15} /> Als erledigt markieren
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setStatus(i.id, "new")}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-accent bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
                        >
                          <RotateCcw size={15} /> Wieder auf {INQUIRY_STATUS_LABELS.new}
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => remove(i)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-accent bg-white border border-[#E2E8F0] text-[#475569] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} /> Löschen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[#475569] uppercase tracking-wider">{label}</dt>
      <dd className="text-[#0F172A] mt-1">{value}</dd>
    </div>
  );
}
