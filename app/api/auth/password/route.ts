import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated, verifyPassword, changePassword, sessionCookie } from "@/lib/auth";
import { validatePasswordChange, ValidationError } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = validatePasswordChange(await req.json());

    if (!(await verifyPassword(currentPassword))) {
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ error: "Das aktuelle Passwort ist falsch." }, { status: 400 });
    }

    const token = await changePassword(newPassword);
    // Neues Token direkt setzen → der Inhaber bleibt angemeldet, alle anderen Sitzungen enden.
    const res = NextResponse.json({ ok: true });
    res.cookies.set(sessionCookie(token));
    return res;
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("POST /api/auth/password fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Passwort konnte nicht gespeichert werden. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }
}
