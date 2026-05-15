import { NextRequest, NextResponse } from "next/server";
import MASTER_SEED from "@/lib/master-seed";

const ALL_EXPERTS = MASTER_SEED.experts;

const GUEST_EXPERT = {
  id: "exp-guest",
  nama: "Tamu",
  email: "",
  role: "guest",
  permissions: [] as string[],
  avatarUrl: null,
  inisial: "TM",
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = (body.identifier ?? body.email ?? "").toLowerCase().trim();

  const expert = ALL_EXPERTS.find(e => e.email.toLowerCase() === email) ?? { ...GUEST_EXPERT, email };
  const token = `dummy-token-${expert.id}`;

  const res = NextResponse.json({ data: { token, expert } });
  // httpOnly:false so MSW browser handlers (main thread) can read it via document.cookie
  res.cookies.set("expert_token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
