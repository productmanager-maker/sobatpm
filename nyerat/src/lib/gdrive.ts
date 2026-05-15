const CLIENT_ID = "655328588949-h51s1h59lqiejjrdddfegj5ccs27qvqn.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const TOKEN_KEY = "nyerat_gdrive_token";
const MAP_KEY = "nyerat_gdrive_map";
const FOLDER_KEY = "nyerat_gdrive_folder";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const { token, exp } = JSON.parse(raw);
    return Date.now() < exp ? token : null;
  } catch {
    return null;
  }
}

function saveToken(token: string, expiresIn: number) {
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ token, exp: Date.now() + expiresIn * 1000 - 60000 })
  );
}

export function clearDriveToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(MAP_KEY);
  localStorage.removeItem(FOLDER_KEY);
}

export function isDriveConnected(): boolean {
  return getToken() !== null;
}

function getFileMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(MAP_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setFileId(pageId: string, fileId: string) {
  const map = getFileMap();
  map[pageId] = fileId;
  localStorage.setItem(MAP_KEY, JSON.stringify(map));
}

async function loadGsi(): Promise<void> {
  if ((window as any).google?.accounts?.oauth2) return;
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="accounts.google.com/gsi"]')) {
      const t = setInterval(() => {
        if ((window as any).google?.accounts?.oauth2) {
          clearInterval(t);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(t);
        reject(new Error("GSI timeout"));
      }, 8000);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("GSI load failed"));
    document.head.appendChild(s);
  });
}

async function getAccessToken(): Promise<string> {
  const cached = getToken();
  if (cached) return cached;
  await loadGsi();
  const g = (window as any).google;
  return new Promise((resolve, reject) => {
    const client = g.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (resp: any) => {
        if (resp?.access_token) {
          saveToken(resp.access_token, resp.expires_in ?? 3600);
          resolve(resp.access_token);
        } else reject(new Error(resp?.error ?? "OAuth failed"));
      },
    });
    client.requestAccessToken({ prompt: "select_account" });
  });
}

async function ensureFolder(token: string): Promise<string> {
  const cached = localStorage.getItem(FOLDER_KEY);
  if (cached) return cached;

  const q = "name='Nyerat' and mimeType='application/vnd.google-apps.folder' and trashed=false";
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const searchData = await searchRes.json();
  if (searchData.files?.length > 0) {
    const folderId = searchData.files[0].id;
    localStorage.setItem(FOLDER_KEY, folderId);
    return folderId;
  }

  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Nyerat", mimeType: "application/vnd.google-apps.folder" }),
  });
  const folder = await createRes.json();
  localStorage.setItem(FOLDER_KEY, folder.id);
  return folder.id;
}

export async function connectDrive(): Promise<void> {
  await getAccessToken();
}

export async function syncPageToDrive(
  pageId: string,
  title: string,
  markdownContent: string
): Promise<string> {
  const token = await getAccessToken();
  const folderId = await ensureFolder(token);
  const map = getFileMap();
  const existingId = map[pageId];

  const html = `<!DOCTYPE html><html><body>${markdownContent
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")}</body></html>`;

  const boundary = "nyerat_boundary_" + Math.random().toString(36).slice(2);
  const metadata: Record<string, unknown> = {
    name: `${title || "Untitled"}`,
    mimeType: "application/vnd.google-apps.document",
  };
  if (!existingId) metadata.parents = [folderId];

  const multipart =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(metadata) +
    `\r\n--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n` +
    html +
    `\r\n--${boundary}--`;

  const url = existingId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=multipart`
    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  const method = existingId ? "PATCH" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: multipart,
  });
  if (!res.ok) throw new Error(`Drive sync failed: ${res.status}`);
  const file = await res.json();
  if (!existingId) setFileId(pageId, file.id);
  return file.id;
}

function extractTextFromBlocks(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const c = content as Record<string, unknown>;
  const blocks = (c.blocks ?? []) as Array<unknown>;
  return blocks
    .map((b) => {
      const block = b as Record<string, unknown>;
      if (Array.isArray(block.content)) {
        return (block.content as Array<unknown>).map((s) => {
          const seg = s as Record<string, unknown>;
          return typeof seg.text === "string" ? seg.text : "";
        }).join("");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export async function syncAllPagesToDrive(
  pages: Array<{ id: string; title: string; content: unknown }>,
  onProgress?: (done: number, total: number) => void
): Promise<{ synced: number; failed: number }> {
  let synced = 0, failed = 0;
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    try {
      const text = extractTextFromBlocks(p.content);
      await syncPageToDrive(p.id, p.title || "Untitled", text);
      synced++;
    } catch {
      failed++;
    }
    onProgress?.(i + 1, pages.length);
  }
  return { synced, failed };
}
