import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, currentSessionToken, sessionCookie, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  try {
    if (!password || !(await verifyPassword(password))) {
      // Kleine Bremse gegen automatisiertes Durchprobieren
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ error: "Ungültig" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(sessionCookie(await currentSessionToken()));
    return res;
  } catch (err) {
    console.error("POST /api/auth fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Anmeldung derzeit nicht möglich. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
