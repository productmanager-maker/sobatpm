import { supabase } from "@/integrations/supabase/client";

const PALETTE = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
export function pickPresenceColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

export type StorageBucket =
  | "page-assets"
  | "page-covers"
  | "avatars"
  | "attachments"
  | "audio-recordings"
  | "workspace-assets";

export async function uploadToBucket(
  bucket: StorageBucket,
  workspaceId: string,
  pageId: string | null,
  file: File | Blob,
  fileName?: string
): Promise<string> {
  const name = fileName ?? (file instanceof File ? file.name : "file.bin");
  const ext = name.split(".").pop() ?? "bin";
  const id = crypto.randomUUID();
  const path =
    bucket === "avatars"
      ? `${workspaceId}/${id}.${ext}`
      : `${workspaceId}/${pageId ?? "misc"}/${id}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: (file as File).type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365);
  if (!data?.signedUrl) throw new Error("Failed to sign URL");
  return data.signedUrl;
}

export async function uploadPath(
  bucket: StorageBucket,
  path: string,
  file: File | Blob,
  contentType: string
): Promise<{ path: string; url: string }> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365);
  return { path, url: data?.signedUrl ?? "" };
}

export async function refreshSignedUrl(bucket: StorageBucket, path: string) {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? "";
}
