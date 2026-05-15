import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive)
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });

    const token = await signSession({ id: user.id, name: user.name, email: user.email, role: user.role as "ADMIN" | "MEMBER" });
    await setSessionCookie(token);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Server error. Coba lagi." }, { status: 500 });
  }
}
