import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { SECTION_LABELS, SECTION_GUIDANCE, type SectionType } from "@/lib/sections";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sectionType } = await req.json();

  const prd = await prisma.pRD.findUnique({ where: { id } });
  if (!prd) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.pRDSection.upsert({
    where: { prdId_sectionType: { prdId: id, sectionType } },
    create: { prdId: id, sectionType, status: "generating" },
    update: { status: "generating" },
  });

  const t = sectionType as SectionType;
  const label = SECTION_LABELS[t] ?? t;
  const guidance = SECTION_GUIDANCE[t] ?? "";
  const isMermaid = t === "flow_diagram";

  const briefContext = `
Judul PRD: ${prd.title}
Problem: ${prd.problem ?? ""}
Target User: ${prd.targetUser ?? ""}
Why Now: ${prd.whyNow ?? ""}
Desired Outcome: ${prd.desiredOutcome ?? ""}
Evidence: ${prd.evidence ?? ""}
In Scope: ${(prd.inScope ?? []).join(", ")}
Out of Scope: ${(prd.outOfScope ?? []).join(", ")}
Dependencies: ${prd.dependencies ?? ""}
Risks: ${prd.risks ?? ""}
${prd.briefContext ? `\nKonteks tambahan:\n${prd.briefContext.slice(0, 3000)}` : ""}
  `.trim();

  const system = isMermaid
    ? `Kamu adalah senior PM yang membuat flow diagram untuk PRD. Output ONLY valid Mermaid flowchart syntax, mulai dengan "flowchart TD". Tidak ada prose, tidak ada code fences. Tampilkan happy path dan decision points penting.`
    : `Kamu adalah senior PM coach untuk tim SID/Sekolah.mu. Tulis section PRD "${label}" yang sempurna. Output Markdown only. Concise, specific, testable. Bahasa Indonesia kecuali istilah teknis. Jadikan PM dan stakeholder mudah memahami.`;

  const userMsg = `Berdasarkan brief PRD berikut, tulis section: ${label}\n\nGuidance: ${guidance}\n\nBrief:\n${briefContext}`;

  let content = "";
  try {
    content = await generate(system, userMsg, 2000);
    if (isMermaid) content = content.replace(/```mermaid|```/g, "").trim();
  } catch (e: unknown) {
    await prisma.pRDSection.update({
      where: { prdId_sectionType: { prdId: id, sectionType } },
      data: { status: "error" },
    });
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const section = await prisma.pRDSection.upsert({
    where: { prdId_sectionType: { prdId: id, sectionType } },
    create: { prdId: id, sectionType, content, status: "done" },
    update: { content, status: "done", version: { increment: 1 } },
  });

  return NextResponse.json(section);
}
