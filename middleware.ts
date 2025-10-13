import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const PROTECTED_PREFIXES = [
  "/properties",
  "/provinces",
  "/localities",
  "/types-properties",
  "/mapa-inmobiliaria",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!requiresAuth) return NextResponse.next();

  // Prefer cookie token for SSR/middleware checks
  const token = request.cookies.get("authToken")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};



