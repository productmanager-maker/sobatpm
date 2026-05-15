import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function extractGDriveFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { gdriveUrl } = body;

    if (!gdriveUrl) {
      return NextResponse.json({ error: "gdriveUrl is required" }, { status: 400 });
    }

    const fileId = extractGDriveFileId(gdriveUrl);
    if (!fileId) {
      return NextResponse.json(
        { error: "URL tidak valid. Pastikan URL Google Drive mengandung /d/FILE_ID/" },
        { status: 400 }
      );
    }

    // Update PRD with GDrive info
    const prd = await prisma.pRD.update({
      where: { id },
      data: {
        gdriveUrl,
        gdriveFileId: fileId,
        gdriveTitle: `Google Doc (${fileId.substring(0, 8)}...)`,
      },
    });

    return NextResponse.json({
      fileId,
      gdriveUrl,
      gdriveTitle: prd.gdriveTitle,
      message: "Google Drive berhasil dihubungkan",
    });
  } catch (error) {
    console.error("POST /api/prd/[id]/gdrive error:", error);
    return NextResponse.json({ error: "Failed to connect Google Drive" }, { status: 500 });
  }
}
