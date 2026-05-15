import { NextRequest, NextResponse } from "next/server";
import { client, HAIKU } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

function buildSystemPrompt(prd: {
  title: string;
  problem?: string | null;
  targetUser?: string | null;
  whyNow?: string | null;
  desiredOutcome?: string | null;
  evidence?: string | null;
  inScope: string[];
  outOfScope: string[];
  dependencies?: string | null;
  risks?: string | null;
  gdriveUrl?: string | null;
  gdriveTitle?: string | null;
}) {
  const missingFields = [
    !prd.problem && "problem",
    !prd.targetUser && "targetUser",
    !prd.whyNow && "whyNow",
    !prd.desiredOutcome && "desiredOutcome",
    !prd.evidence && "evidence",
    prd.inScope.length === 0 && "inScope",
    prd.outOfScope.length === 0 && "outOfScope",
    !prd.dependencies && "dependencies",
    !prd.risks && "risks",
  ].filter(Boolean);

  return `Kamu adalah PRD Coach untuk SID/Sekolah.mu — platform pendidikan terbesar di Indonesia.
Tugasmu adalah membantu Product Manager menyusun PRD yang kuat melalui dialog probing dan konstruktif.

PRD Saat Ini: "${prd.title}"
${prd.gdriveUrl ? `Context dari Google Drive: ${prd.gdriveTitle || prd.gdriveUrl}` : ""}

Field belum terisi: ${missingFields.length > 0 ? missingFields.join(", ") : "Semua sudah terisi!"}

Field sudah terisi:
${prd.problem ? `- Problem: ${prd.problem.slice(0, 150)}` : ""}
${prd.targetUser ? `- Target User: ${prd.targetUser.slice(0, 100)}` : ""}
${prd.whyNow ? `- Why Now: ${prd.whyNow.slice(0, 100)}` : ""}
${prd.desiredOutcome ? `- Desired Outcome: ${prd.desiredOutcome.slice(0, 100)}` : ""}
${prd.evidence ? `- Evidence: ${prd.evidence.slice(0, 100)}` : ""}

Panduan coaching:
1. Fokus pada field yang belum terisi terlebih dahulu
2. Gunakan bahasa Indonesia yang natural dan profesional
3. Tanyakan probing question yang konkret dan spesifik
4. Bantu PM berpikir lebih dalam tentang masalah yang mereka selesaikan
5. Arahkan ke outcome yang terukur, bukan sekadar fitur

Mulai dengan menyambut PM dan tanyakan probing question yang paling relevan.`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { message: userMessage } = await req.json();

    const prd = await prisma.pRD.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!prd) return NextResponse.json({ error: "PRD not found" }, { status: 404 });

    await prisma.message.create({
      data: { prdId: id, role: "user", content: userMessage },
    });

    // Build Claude message history
    const history = prd.messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user" as "user" | "assistant",
      content: m.content,
    }));

    const response = await client.messages.create({
      model: HAIKU,
      max_tokens: 1024,
      system: buildSystemPrompt(prd),
      messages: [...history, { role: "user", content: userMessage }],
    });

    const block = response.content[0];
    const assistantMessage = block.type === "text" ? block.text : "";

    const savedMessage = await prisma.message.create({
      data: { prdId: id, role: "assistant", content: assistantMessage },
    });

    if (prd.status === "DRAFT") {
      await prisma.pRD.update({ where: { id }, data: { status: "IN_PROGRESS" } });
    }

    return NextResponse.json({ message: savedMessage });
  } catch (error) {
    console.error("POST /api/prd/[id]/coach error:", error);
    return NextResponse.json({ error: "Failed to get coach response" }, { status: 500 });
  }
}
