import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const prd = await prisma.pRD.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!prd) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(prd);
  } catch (error) {
    console.error("GET /api/prd/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch PRD" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Ownership check for non-admin
    if (session.role !== "ADMIN") {
      const existing = await prisma.pRD.findUnique({ where: { id }, select: { authorId: true } });
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (existing.authorId !== session.id)
        return NextResponse.json({ error: "Forbidden: you can only edit your own PRDs" }, { status: 403 });
    }

    const body = await req.json();
    const prd = await prisma.pRD.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(prd);
  } catch (error) {
    console.error("PATCH /api/prd/[id] error:", error);
    return NextResponse.json({ error: "Failed to update PRD" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Ownership check for non-admin
    if (session.role !== "ADMIN") {
      const existing = await prisma.pRD.findUnique({ where: { id }, select: { authorId: true } });
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (existing.authorId !== session.id)
        return NextResponse.json({ error: "Forbidden: you can only delete your own PRDs" }, { status: 403 });
    }

    await prisma.pRD.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/prd/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete PRD" }, { status: 500 });
  }
}
