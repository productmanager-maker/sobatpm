import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rawContext } = await req.json();

  const prd = await prisma.pRD.findUnique({ where: { id } });
  if (!prd) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const system = `Kamu adalah senior PM coach. Ekstrak structured brief dari input raw.
Reply ONLY valid JSON dengan shape ini:
{"problem":"","target_user":"","why_now":"","desired_outcome":"","evidence":"","in_scope":[],"out_of_scope":[],"dependencies":"","risks":"","title":""}
Gunakan bahasa yang sama dengan input (Indonesia atau English). Singkat dan konkret.
Untuk "title": buat judul PRD yang ringkas dan deskriptif (5-10 kata).`;

  let brief: Record<string, unknown> = {};
  try {
    const text = await generate(system, rawContext.slice(0, 50000), 2000);
    const match = text.match(/\{[\s\S]*\}/);
    brief = JSON.parse(match ? match[0] : text);
  } catch {
    brief = { problem: rawContext.slice(0, 300) };
  }

  await prisma.pRD.update({
    where: { id },
    data: {
      title: (brief.title as string) || prd.title,
      problem: (brief.problem as string) || null,
      targetUser: (brief.target_user as string) || null,
      whyNow: (brief.why_now as string) || null,
      desiredOutcome: (brief.desired_outcome as string) || null,
      evidence: (brief.evidence as string) || null,
      inScope: (brief.in_scope as string[]) || [],
      outOfScope: (brief.out_of_scope as string[]) || [],
      dependencies: (brief.dependencies as string) || null,
      risks: (brief.risks as string) || null,
      briefContext: rawContext.slice(0, 60000),
      briefExtracted: true,
      status: "IN_PROGRESS",
    },
  });

  return NextResponse.json({ brief });
}
