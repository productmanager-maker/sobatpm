import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QUALITY_WEIGHTS } from "@/lib/sections";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sections = await prisma.pRDSection.findMany({ where: { prdId: id, status: "done" } });
  const sectionMap: Record<string, string> = {};
  for (const s of sections) sectionMap[s.sectionType] = s.content ?? "";

  const fill = (s: string, threshold: number) => Math.min(1, (s?.trim().length ?? 0) / threshold);

  let total = 0;
  const breakdown: Record<string, number> = {};

  for (const [key, { sections: secs, weight }] of Object.entries(QUALITY_WEIGHTS)) {
    const avg = secs.reduce((sum, s) => sum + fill(sectionMap[s] ?? "", 200), 0) / secs.length;
    const score = Math.round(weight * avg);
    breakdown[key] = score;
    total += score;
  }

  await prisma.pRD.update({ where: { id }, data: { quality: total } });
  return NextResponse.json({ total, breakdown });
}
