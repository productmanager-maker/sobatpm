import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ data: { ok: true } });
  res.cookies.delete("expert_token");
  return res;
}
