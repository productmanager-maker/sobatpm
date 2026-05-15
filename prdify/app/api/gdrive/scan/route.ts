import { NextRequest, NextResponse } from "next/server";
import { extractFileId, listFolderFiles, readTextFile } from "@/lib/gdrive";
import { generate } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { driveUrl, prdContext } = await req.json();

    if (!driveUrl) {
      return NextResponse.json({ error: "driveUrl required" }, { status: 400 });
    }

    const folderId = extractFileId(driveUrl);
    if (!folderId) {
      return NextResponse.json({ error: "Tidak bisa ekstrak ID dari URL Drive" }, { status: 400 });
    }

    // List files in the folder
    const files = await listFolderFiles(folderId);

    if (files.length === 0) {
      return NextResponse.json({
        files: [],
        analysis: null,
        message: "Folder kosong atau tidak ada akses ke file",
      });
    }

    // Read content from up to 5 readable files for analysis
    const readable = files.filter(
      (f) =>
        f.mimeType === "application/vnd.google-apps.document" ||
        f.mimeType?.startsWith("text/")
    );

    const contentChunks: string[] = [];
    for (const file of readable.slice(0, 5)) {
      if (file.id) {
        try {
          const text = await readTextFile(file.id);
          contentChunks.push(`=== ${file.name} ===\n${text}`);
        } catch {
          // skip unreadable files
        }
      }
    }

    // Build file list summary
    const fileList = files
      .map((f) => `- ${f.name} (${f.mimeType?.split(".").pop() ?? "file"}, modified: ${f.modifiedTime?.slice(0, 10) ?? "-"})`)
      .join("\n");

    // Use Claude to analyze the content and extract structured context
    let analysis = null;
    const combinedContent = contentChunks.join("\n\n");

    if (combinedContent) {
      const system = `Kamu adalah PM assistant di SID/Sekolah.mu. Tugasmu menganalisis dokumen dari Google Drive dan mengekstrak informasi yang relevan untuk sebuah PRD.

Konteks PRD yang sedang dibuat:
${prdContext || "Tidak ada konteks PRD"}

Dari dokumen yang diberikan, ekstrak dan kembalikan dalam format JSON:
{
  "coreRefs": [{ "title": string, "source": "Google Drive", "date": string, "summary": string }],
  "dependencies": [{ "title": string, "type": string, "status": "Ready"|"Needed"|"TBD" }],
  "relatedInitiatives": [{ "title": string, "type": string, "progress": number }],
  "risks": [{ "title": string, "severity": "High"|"Medium"|"Low", "category": string }],
  "stakeholders": [{ "name": string, "role": string, "impact": "High"|"Medium"|"Low" }]
}

Kembalikan HANYA JSON valid, tanpa markdown code block.`;

      const userMsg = `Daftar file di Google Drive:\n${fileList}\n\nIsi dokumen:\n${combinedContent}`;

      try {
        const raw = await generate(system, userMsg, 2000);
        analysis = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
      } catch {
        analysis = null;
      }
    }

    return NextResponse.json({
      files: files.map((f) => ({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        modifiedTime: f.modifiedTime,
        webViewLink: f.webViewLink,
      })),
      analysis,
    });
  } catch (error) {
    console.error("POST /api/gdrive/scan error:", error);
    const msg = String((error as Error)?.message ?? error);
    if (msg.includes("GOOGLE_SERVICE_ACCOUNT_JSON not set")) {
      return NextResponse.json(
        { error: "Google Service Account belum dikonfigurasi di server" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Gagal scan Google Drive" }, { status: 500 });
  }
}
