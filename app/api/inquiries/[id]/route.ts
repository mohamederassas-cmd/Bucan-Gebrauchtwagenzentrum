import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { updateInquiryStatus, deleteInquiry } from "@/lib/inquiries";
import { validateInquiryPatch, ValidationError } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { status } = validateInquiryPatch(await req.json());
    const inquiry = await updateInquiryStatus(id, status);
    if (!inquiry) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch (err) {
    if (err instanceof ValidationError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("PATCH /api/inquiries/[id] fehlgeschlagen:", err);
    return NextResponse.json({ error: "Änderung konnte nicht gespeichert werden." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const ok = await deleteInquiry(id);
    if (!ok) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/inquiries/[id] fehlgeschlagen:", err);
    return NextResponse.json({ error: "Anfrage konnte nicht gelöscht werden." }, { status: 500 });
  }
}
