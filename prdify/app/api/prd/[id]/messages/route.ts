import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await prisma.message.findMany({
      where: { prdId: id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/prd/[id]/messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { role, content } = body;

    const message = await prisma.message.create({
      data: { prdId: id, role, content },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("POST /api/prd/[id]/messages error:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
