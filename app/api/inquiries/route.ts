import { NextRequest, NextResponse } from "next/server";
import { verifyFormToken, FormTokenError } from "@/lib/form-token";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { validateContactInquiry, validatePurchaseInquiry, ValidationError } from "@/lib/validation";
import { createInquiry, inquiryExists } from "@/lib/inquiries";
import { sendInquiryMail } from "@/lib/mail";
import type { Inquiry } from "@/lib/types";

export const dynamic = "force-dynamic";

const TOKEN_ERROR = "Das Formular ist abgelaufen. Bitte laden Sie die Seite neu und senden Sie erneut.";

/** Öffentlich: Kontakt- und Ankauf-Formular. Reihenfolge: Token → Honeypot → Limit → Validierung → Replay → Speichern → Mail. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  let draftId: string;
  try {
    draftId = verifyFormToken(body.token).draftId;
  } catch (err) {
    if (err instanceof FormTokenError && err.message === "Zu schnell gesendet.") {
      return NextResponse.json({ error: "Bitte einen Moment warten und dann erneut senden." }, { status: 400 });
    }
    return NextResponse.json({ error: TOKEN_ERROR }, { status: 400 });
  }

  // Honeypot: Bots füllen das versteckte Feld → still „erfolgreich“, nichts speichern.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!rateLimit(`inq:${clientIp(req)}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." }, { status: 429 });
  }

  try {
    let data: Omit<Inquiry, "created_at" | "updated_at" | "status">;
    if (body.type === "purchase") {
      const v = validatePurchaseInquiry(body, draftId);
      data = { id: draftId, type: "purchase", ...v };
    } else {
      const c = validateContactInquiry(body);
      data = { id: draftId, type: "contact", ...c };
    }

    if (await inquiryExists(draftId)) {
      return NextResponse.json({ error: "Diese Anfrage wurde bereits gesendet." }, { status: 409 });
    }

    const inquiry = await createInquiry(data);
    try {
      await sendInquiryMail(inquiry);
    } catch (err) {
      console.error(`[mail] Versand für Anfrage ${inquiry.id} fehlgeschlagen:`, err);
    }
    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("POST /api/inquiries fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Ihre Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut oder rufen Sie uns an." },
      { status: 500 }
    );
  }
}
