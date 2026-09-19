import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TOKEN_PATTERN } from "@/lib/session-constants";
import { GERMAN_ONLY_PATHS } from "@/lib/i18n/config";

/**
 * Edge-Middleware.
 *
 * 1. /admin/*: nur formale Prüfung des Session-Tokens (die echte Prüfung passiert
 *    in lib/auth.ts, Node). Kein Locale-Handling für den Admin.
 * 2. /en/*: englische Seiten werden direkt aus app/(site)/[lang] bedient.
 *    Admin, API und die nur deutschen Rechtsseiten haben keine /en-Variante.
 * 3. /de/*: gibt es nicht öffentlich → 308 auf den unpräfixierten Pfad.
 * 4. Alles andere ist Deutsch und wird intern auf /de/... umgeschrieben
 *    (die URL im Browser bleibt unverändert).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!pathname.startsWith("/admin/login")) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (!token || !SESSION_TOKEN_PATTERN.test(token)) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const rest = pathname.slice(3) || "/";
    if (rest.startsWith("/admin") || rest.startsWith("/api") || GERMAN_ONLY_PATHS.includes(rest)) {
      return NextResponse.redirect(new URL(rest, request.url), 308);
    }
    return NextResponse.next();
  }

  if (pathname === "/de" || pathname.startsWith("/de/")) {
    return NextResponse.redirect(new URL(pathname.slice(3) || "/", request.url), 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/de${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Alles außer API, Next-Interna und Dateien mit Endung (Bilder, sitemap.xml, robots.txt)
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
};
