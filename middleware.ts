import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TOKEN_PATTERN } from "@/lib/session-constants";

/**
 * Edge-Middleware: prüft für /admin/* nur, ob ein formal gültiges Session-Token
 * vorhanden ist. Die eigentliche Prüfung (HMAC gegen aktuellen Passwort-Hash)
 * passiert in lib/auth.ts (Node), das in jeder Admin-Seite und API-Route läuft.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !SESSION_TOKEN_PATTERN.test(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
