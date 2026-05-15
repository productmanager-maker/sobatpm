import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No auth header");

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userErr } = await supabaseUser.auth.getUser();
    if (userErr || !user) throw new Error("Unauthorized");

    const { name, slug, icon } = await req.json();
    if (!name || !slug) throw new Error("name and slug are required");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: existing } = await supabaseAdmin
      .from("workspaces")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    const finalSlug = existing ? `${slug}-${Math.random().toString(36).slice(2, 6)}` : slug;

    const { data: ws, error: wsErr } = await supabaseAdmin
      .from("workspaces")
      .insert({ name: name.trim(), slug: finalSlug, icon: icon || "🏠", owner_id: user.id })
      .select()
      .single();
    if (wsErr) throw wsErr;

    const { data: page, error: pageErr } = await supabaseAdmin
      .from("pages")
      .insert({
        workspace_id: ws.id,
        title: "Getting Started",
        icon: "👋",
        created_by: user.id,
        updated_by: user.id,
        sort_order: 1,
      })
      .select()
      .single();
    if (pageErr) throw pageErr;

    await supabaseAdmin
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    return new Response(JSON.stringify({ workspace: ws, page }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
