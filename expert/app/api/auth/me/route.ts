import { NextRequest, NextResponse } from "next/server";
import { EXPERTS } from "@/lib/seed-playground";
import { CREDENTIAL_SEED } from "@/lib/credentials-and-usecases";

const ALL_EXPERTS = [...EXPERTS, ...CREDENTIAL_SEED.experts];

export async function GET(request: NextRequest) {
  const token = request.cookies.get("expert_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Token tidak valid" } },
      { status: 401 }
    );
  }

  // token format: dummy-token-{expertId}
  const expertId = token.startsWith("dummy-token-") ? token.slice("dummy-token-".length) : null;
  const expert = ALL_EXPERTS.find(e => e.id === expertId) ?? {
    id: expertId ?? "exp-guest",
    nama: "Tamu",
    email: "",
    role: "guest",
    permissions: [] as string[],
    avatarUrl: null,
    inisial: "TM",
  };

  return NextResponse.json({ data: { expert } });
}
