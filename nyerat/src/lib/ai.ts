// Streaming helper for the ai-assistant edge function.
// Parses SSE chunks from OpenAI-compatible /v1/chat/completions responses.
import { supabase } from "@/integrations/supabase/client";

export type AIAction =
  | "summarize"
  | "continue"
  | "improve"
  | "translate"
  | "ask"
  | "tag"
  | "chat";

export interface AIRequest {
  action: AIAction;
  pageContext?: string;
  prompt?: string;
  language?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  model?: string;
}

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

export async function streamAI(
  req: AIRequest,
  onDelta: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const resp = await fetch(FN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(req),
    signal,
  });

  if (!resp.ok) {
    const errBody = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(errBody.error || `HTTP ${resp.status}`);
  }
  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return full;
      try {
        const json = JSON.parse(payload);
        const delta: string =
          json.choices?.[0]?.delta?.content ??
          json.choices?.[0]?.message?.content ??
          "";
        if (delta) {
          full += delta;
          onDelta(delta);
        }
      } catch {
        // ignore non-JSON keepalive lines
      }
    }
  }
  return full;
}

// Best-effort plain-text extraction from a BlockNote document (array of blocks).
export function blocksToPlainText(blocks: unknown): string {
  let out = "";
  const walk = (node: unknown) => {
    if (!node) return;
    if (typeof node === "string") {
      out += node;
      return;
    }
    if (Array.isArray(node)) {
      for (const n of node) walk(n);
      return;
    }
    if (typeof node === "object") {
      const obj = node as Record<string, unknown>;
      if (typeof obj.text === "string") out += obj.text;
      if (obj.content) walk(obj.content);
      if (obj.children) walk(obj.children);
      if (obj.type === "paragraph" || obj.type === "heading") out += "\n";
    }
  };
  walk(blocks);
  return out.trim();
}
