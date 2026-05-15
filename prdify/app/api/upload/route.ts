import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  let text = "";

  try {
    if (name.endsWith(".pdf")) {
      // bypass pdf-parse's test-file loader (known Next.js issue)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      const data = await pdfParse(buffer);
      text = data.text?.trim() ?? "";
    } else if (name.endsWith(".txt") || name.endsWith(".md")) {
      text = buffer.toString("utf-8");
    } else if (name.endsWith(".docx")) {
      // Basic DOCX: extract raw XML text (no mammoth dep needed for simple docs)
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(buffer);
      const xml = await zip.file("word/document.xml")?.async("string") ?? "";
      text = xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    } else {
      return NextResponse.json({ error: "Format tidak didukung. Gunakan PDF, TXT, MD, atau DOCX." }, { status: 400 });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Gagal membaca file: " + msg }, { status: 500 });
  }

  if (!text || text.length < 20) {
    return NextResponse.json({ error: "File kosong atau tidak bisa dibaca. Coba file lain." }, { status: 422 });
  }

  return NextResponse.json({
    filename: file.name,
    size: file.size,
    text: text.slice(0, 60000), // cap at 60k chars for AI
    preview: text.slice(0, 300),
  });
}
