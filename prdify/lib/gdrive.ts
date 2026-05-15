import { google } from "googleapis";

function getAuthClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");

  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

export function getDriveClient() {
  const auth = getAuthClient();
  return google.drive({ version: "v3", auth });
}

export function extractFileId(url: string): string | null {
  // Folder: /folders/<id> or ?id=<id>
  // File: /file/d/<id> or /d/<id>/
  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)\//,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export async function listFolderFiles(folderId: string) {
  const drive = getDriveClient();
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, modifiedTime, webViewLink, size)",
    pageSize: 50,
    orderBy: "modifiedTime desc",
  });
  return res.data.files ?? [];
}

export async function readTextFile(fileId: string): Promise<string> {
  const drive = getDriveClient();
  const meta = await drive.files.get({ fileId, fields: "mimeType, name" });
  const mimeType = meta.data.mimeType ?? "";

  if (mimeType === "application/vnd.google-apps.document") {
    // Export Google Doc as plain text
    const exported = await drive.files.export(
      { fileId, mimeType: "text/plain" },
      { responseType: "text" }
    );
    return String(exported.data).slice(0, 8000);
  }

  if (mimeType.startsWith("text/")) {
    const content = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "text" }
    );
    return String(content.data).slice(0, 8000);
  }

  return `[File: ${meta.data.name} — binary/unsupported (${mimeType})]`;
}
