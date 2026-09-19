import type { Inquiry } from "./types";
import { SITE } from "./site";
import { formatMileage, formatPrice } from "./utils";

/**
 * Versand neuer Anfragen. Zwei Wege, in dieser Reihenfolge:
 *
 * 1. **SMTP** (empfohlen) – das vorhandene Postfach info@bucan-automobile.de.
 *    Kein zusätzlicher Dienst, keine Domain-Freischaltung: SMTP_HOST, SMTP_USER
 *    und SMTP_PASS setzen, fertig. Absender ist dann das Postfach selbst.
 * 2. **Resend** – HTTP-API, greift nur wenn kein SMTP konfiguriert ist und
 *    RESEND_API_KEY gesetzt wurde. Ohne verifizierte Domain nutzt Resend den
 *    Test-Absender, der ausschließlich an die Konto-Adresse zustellt (→ INQUIRY_TO).
 *
 * Ist nichts konfiguriert, wird nur gewarnt – die Anfrage liegt trotzdem im
 * Admin-Posteingang unter /admin/anfragen.
 */
function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#6B7079;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:6px 0;color:#15171A;font-size:14px">${value}</td></tr>`;
}

function buildMail(i: Inquiry): { subject: string; html: string; text: string } {
  const created = new Date(i.created_at).toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  const lines: string[] = [];
  const rows: string[] = [];

  rows.push(row("Name", esc(i.name)));
  rows.push(row("E-Mail", `<a href="mailto:${esc(i.email)}">${esc(i.email)}</a>`));
  lines.push(`Name: ${i.name}`, `E-Mail: ${i.email}`);
  if (i.phone) {
    rows.push(row("Telefon", `<a href="tel:${esc(i.phone.replace(/\s+/g, ""))}">${esc(i.phone)}</a>`));
    lines.push(`Telefon: ${i.phone}`);
  }

  let subject: string;
  if (i.type === "purchase") {
    const v = i.vehicle;
    const ez = `${String(v.first_registration.month).padStart(2, "0")}/${v.first_registration.year}`;
    subject = `Neue Ankauf-Anfrage: ${v.make} ${v.model} (${v.first_registration.year})`;
    rows.push(row("Fahrzeug", `<strong>${esc(v.make)} ${esc(v.model)}</strong>`));
    rows.push(row("Erstzulassung", ez));
    rows.push(row("Kilometerstand", esc(formatMileage(v.mileage))));
    rows.push(row("Kraftstoff / Getriebe", `${esc(v.fuel_type)} / ${esc(v.transmission)}`));
    rows.push(row("Zustand", esc(v.condition).replace(/\n/g, "<br>")));
    if (v.price_expectation != null) rows.push(row("Preisvorstellung", esc(formatPrice(v.price_expectation))));
    if (i.photos.length > 0) {
      rows.push(
        row(
          "Fotos",
          i.photos.map((u, n) => `<a href="${esc(u)}">Foto ${n + 1}</a>`).join(" · ")
        )
      );
    }
    lines.push(
      `Fahrzeug: ${v.make} ${v.model}`,
      `Erstzulassung: ${ez}`,
      `Kilometerstand: ${formatMileage(v.mileage)}`,
      `Kraftstoff / Getriebe: ${v.fuel_type} / ${v.transmission}`,
      `Zustand: ${v.condition}`,
      v.price_expectation != null ? `Preisvorstellung: ${formatPrice(v.price_expectation)}` : "",
      ...i.photos.map((u, n) => `Foto ${n + 1}: ${u}`)
    );
  } else {
    subject = `Neue Kontaktanfrage von ${i.name}`;
  }

  if (i.message) {
    rows.push(row("Nachricht", esc(i.message).replace(/\n/g, "<br>")));
    lines.push(`Nachricht: ${i.message}`);
  }
  rows.push(row("Eingegangen", `${esc(created)} · Sprache ${i.locale.toUpperCase()}`));
  rows.push(row("Anfrage-ID", `<code>${esc(i.id)}</code>`));
  lines.push(`Eingegangen: ${created}`, `Anfrage-ID: ${i.id}`);

  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#F6F2EA;font-family:Inter,Arial,sans-serif;padding:24px">
<div style="max-width:620px;margin:0 auto;background:#FBF9F4;border:1px solid #DED5C4;border-radius:16px;padding:28px">
<p style="margin:0 0 4px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#A98847">${i.type === "purchase" ? "Fahrzeug-Ankauf" : "Kontaktformular"} · ${esc(SITE.name)}</p>
<h1 style="margin:0 0 18px;font-size:20px;color:#15171A;font-weight:600">${esc(subject)}</h1>
<table style="border-collapse:collapse;width:100%">${rows.join("")}</table>
<p style="margin:22px 0 0;font-size:12px;color:#6B7079">Antworten Sie einfach auf diese E-Mail – die Antwort geht direkt an den Kunden. Alle Anfragen finden Sie auch unter ${esc(SITE.url)}/admin/anfragen.</p>
</div></body></html>`;

  return { subject, html, text: lines.filter(Boolean).join("\n") };
}

interface Message {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}

/** SMTP-Versand über das eigene Postfach (Strato, IONOS, Google Workspace, Brevo …). */
async function sendViaSmtp(msg: Message, host: string, user: string, pass: string): Promise<void> {
  const { default: nodemailer } = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT ?? 465);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  });
  // Absender muss beim eigenen Postfach die authentifizierte Adresse sein.
  await transport.sendMail({ from: process.env.MAIL_FROM || `"${SITE.name}" <${user}>`, ...msg });
}

/** Resend-Versand als Alternative, wenn kein SMTP-Postfach hinterlegt ist. */
async function sendViaResend(msg: Message, apiKey: string): Promise<void> {
  const { Resend } = await import("resend");
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.MAIL_FROM || `${SITE.name} <onboarding@resend.dev>`,
    ...msg,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

export async function sendInquiryMail(inquiry: Inquiry): Promise<void> {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, RESEND_API_KEY } = process.env;
  const { subject, html, text } = buildMail(inquiry);
  const msg: Message = {
    to: process.env.INQUIRY_TO || SITE.email,
    replyTo: inquiry.email,
    subject,
    html,
    text,
  };

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    await sendViaSmtp(msg, SMTP_HOST, SMTP_USER, SMTP_PASS);
    return;
  }
  if (RESEND_API_KEY) {
    await sendViaResend(msg, RESEND_API_KEY);
    return;
  }
  console.warn(
    `[mail] Kein Mailversand konfiguriert (SMTP_HOST/SMTP_USER/SMTP_PASS oder RESEND_API_KEY) – ` +
      `Anfrage ${inquiry.id} ist gespeichert, wurde aber nicht gemailt.`
  );
}
