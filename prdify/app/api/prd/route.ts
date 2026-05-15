import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const prds = await prisma.pRD.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { messages: true } },
        sections: { select: { status: true } },
      },
    });
    const result = prds.map(({ sections, ...prd }) => ({
      ...prd,
      sectionsDone: sections.filter(s => s.status === "done").length,
      sectionsTotal: sections.length,
    }));
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/prd error:", error);
    return NextResponse.json({ error: "Failed to fetch PRDs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { gdriveUrl, gdriveFileId, gdriveTitle, uploadedFile, title } = body;

    const prd = await prisma.pRD.create({
      data: {
        title: title || "Untitled PRD",
        gdriveUrl: gdriveUrl || null,
        gdriveFileId: gdriveFileId || null,
        gdriveTitle: gdriveTitle || null,
        uploadedFile: uploadedFile || null,
        author: session.name,
        authorId: session.id,
      },
    });

    return NextResponse.json(prd, { status: 201 });
  } catch (error) {
    console.error("POST /api/prd error:", error);
    return NextResponse.json({ error: "Failed to create PRD" }, { status: 500 });
  }
}
