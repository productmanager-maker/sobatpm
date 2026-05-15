// Web Clipper edge function: fetches a URL, extracts metadata + readable content,
// updates the target page with title and a bookmark block (and a paragraph excerpt).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Body {
  url: string;
  workspace_id: string;
  page_id: string;
  mode?: "article" | "full";
}

function pickMeta(html: string, names: string[]): string {
  for (const name of names) {
    const re = new RegExp(
      `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
      "i"
    );
    const m = html.match(re);
    if (m) return decode(m[1]);
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
      "i"
    );
    const m2 = html.match(re2);
    if (m2) return decode(m2[1]);
  }
  return "";
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractTitle(html: string): string {
  const og = pickMeta(html, ["og:title", "twitter:title"]);
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? decode(m[1].trim()) : "";
}

function extractText(html: string): string {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  // Try to grab <article> content first
  const art = stripped.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const target = art ? art[1] : stripped;
  return decode(target.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );
    const { data: userRes } = await userClient.auth.getUser();
    if (!userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Body;
    if (!body?.url || !body?.page_id) {
      return new Response(JSON.stringify({ error: "Missing url or page_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let urlObj: URL;
    try {
      urlObj = new URL(body.url);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch(body.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NotevoClipper/1.0)" },
      redirect: "follow",
    });
    const html = await resp.text();

    const title = extractTitle(html) || urlObj.hostname;
    const description = pickMeta(html, ["og:description", "twitter:description", "description"]);
    const cover = pickMeta(html, ["og:image", "twitter:image"]);
    const favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;

    const blocks: unknown[] = [
      {
        type: "bookmark",
        props: {
          url: body.url,
          title,
          description,
          favicon,
          coverImage: cover,
        },
      },
    ];

    if (body.mode === "article") {
      const excerpt = extractText(html).slice(0, 4000);
      if (excerpt) {
        blocks.push({
          type: "paragraph",
          content: [{ type: "text", text: excerpt, styles: {} }],
        });
      }
    }

    await supabase
      .from("pages")
      .update({
        title,
        content: { blocks },
        updated_by: userRes.user.id,
      })
      .eq("id", body.page_id);

    return new Response(
      JSON.stringify({ ok: true, title, description, cover }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
