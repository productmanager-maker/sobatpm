import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "nyerat_notion_token";

export function getNotionToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setNotionToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearNotionToken() {
  localStorage.removeItem(TOKEN_KEY);
}
export function isNotionConnected(): boolean {
  return !!getNotionToken();
}

async function notionCall(endpoint: string, method = "GET", body?: unknown) {
  const token = getNotionToken();
  if (!token) throw new Error("Notion token not set");
  const { data: { session } } = await supabase.auth.getSession();
  const res = await supabase.functions.invoke("notion-proxy", {
    body: { notionToken: token, endpoint, method, body },
    headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
  });
  if (res.error) throw new Error(res.error.message);
  const data = res.data as Record<string, unknown>;
  if (data && typeof data === "object" && "object" in data && data.object === "error") {
    throw new Error((data.message as string) ?? "Notion API error");
  }
  return data;
}

export interface NotionPage {
  id: string;
  url: string;
  title: string;
  last_edited_time: string;
}

export async function listNotionPages(): Promise<NotionPage[]> {
  const data = await notionCall("/search", "POST", {
    filter: { value: "page", property: "object" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
    page_size: 50,
  });
  return ((data.results as Array<Record<string, unknown>>) ?? []).map((p) => ({
    id: p.id as string,
    url: p.url as string,
    last_edited_time: p.last_edited_time as string,
    title: (() => {
      const props = p.properties as Record<string, unknown> | undefined;
      if (props) {
        for (const key of Object.keys(props)) {
          const t = props[key] as Record<string, unknown> | undefined;
          if (t?.type === "title" && Array.isArray(t.title)) {
            return (t.title as Array<{ plain_text: string }>).map((r) => r.plain_text).join("") || "Untitled";
          }
        }
      }
      return "Untitled";
    })(),
  }));
}

export async function fetchNotionPageContent(pageId: string): Promise<string> {
  const data = await notionCall(`/blocks/${pageId}/children?page_size=100`);
  const blocks = ((data.results as Array<Record<string, unknown>>) ?? []);
  return blocks.map((b) => notionBlockToText(b)).filter(Boolean).join("\n\n");
}

function notionBlockToText(block: Record<string, unknown>): string {
  const type = block.type as string;
  const content = block[type] as Record<string, unknown> | undefined;
  const rich = (content?.rich_text as Array<{ plain_text: string }> | undefined) ?? [];
  const text = rich.map((r) => r.plain_text).join("");
  if (type === "heading_1") return `# ${text}`;
  if (type === "heading_2") return `## ${text}`;
  if (type === "heading_3") return `### ${text}`;
  if (type === "bulleted_list_item") return `- ${text}`;
  if (type === "numbered_list_item") return `1. ${text}`;
  if (type === "code") return `\`\`\`\n${text}\n\`\`\``;
  if (type === "quote") return `> ${text}`;
  if (type === "divider") return "---";
  return text;
}

export async function pushPageToNotion(title: string, markdown: string): Promise<string> {
  const lines = markdown.split("\n");
  const children = lines.filter((l) => l.trim()).map((line): unknown => {
    if (line.startsWith("# ")) return { object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } };
    if (line.startsWith("## ")) return { object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] } };
    if (line.startsWith("### ")) return { object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: line.slice(4) } }] } };
    if (line.startsWith("- ")) return { object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } };
    return { object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: line } }] } };
  });
  const page = await notionCall("/pages", "POST", {
    parent: { type: "page_id", page_id: await getRootPageId() },
    properties: { title: { title: [{ text: { content: title } }] } },
    children: children.slice(0, 100),
  });
  return (page as Record<string, unknown>).url as string;
}

async function getRootPageId(): Promise<string> {
  const pages = await listNotionPages();
  if (pages.length === 0) throw new Error("No Notion pages found. Create at least one page in Notion and share it with your integration.");
  return pages[0].id;
}

export function pageContentToMarkdown(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const blocks = ((content as Record<string, unknown>).blocks as Array<Record<string, unknown>>) ?? [];
  return blocks
    .map((b) => {
      const inner = Array.isArray(b.content)
        ? (b.content as Array<Record<string, unknown>>)
            .map((s) => (typeof s.text === "string" ? (s.text as string) : ""))
            .join("")
        : "";
      const type = b.type as string;
      if (type === "heading") {
        const lvl = ((b.props as Record<string, unknown>)?.level as number) ?? 1;
        return `${"#".repeat(Math.min(3, Math.max(1, lvl)))} ${inner}`;
      }
      if (type === "bulletListItem") return `- ${inner}`;
      if (type === "numberedListItem") return `1. ${inner}`;
      return inner;
    })
    .filter(Boolean)
    .join("\n\n");
}
