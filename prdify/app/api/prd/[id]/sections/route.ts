import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SECTION_TYPES } from "@/lib/sections";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sections = await prisma.pRDSection.findMany({ where: { prdId: id } });
  return NextResponse.json(sections);
}

// Init all 18 sections as "pending" for a PRD
export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await prisma.pRDSection.findMany({ where: { prdId: id }, select: { sectionType: true } });
  const existingTypes = new Set(existing.map((s) => s.sectionType));

  const toCreate = SECTION_TYPES.filter((t) => !existingTypes.has(t));
  if (toCreate.length > 0) {
    await prisma.pRDSection.createMany({
      data: toCreate.map((t) => ({ prdId: id, sectionType: t, status: "pending" })),
    });
  }

  const sections = await prisma.pRDSection.findMany({ where: { prdId: id } });
  return NextResponse.json(sections);
}
