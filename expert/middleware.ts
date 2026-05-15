import { NextRequest, NextResponse } from "next/server";

const PROTECTED = [
  "/presensi",
  "/penilaian",
  "/program",
  "/peserta",
  "/notifikasi",
  "/hak-akses",
  "/glossary",
  "/brand-identity",
  "/profil",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("expert_token")?.value;

  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + "/"));
  const isLoginPage = pathname === "/login";

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isLoginPage && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/presensi";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/).*)"],
};
