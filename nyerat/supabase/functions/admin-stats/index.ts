import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_EMAILS = ["product.manager@sekolahmu.co.id"];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const auth = req.headers.get("Authorization") ?? "";
  if (!auth) return json({ error: "Unauthorized" }, 401);

  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: auth } } }
  );
  const { data: { user } } = await anonClient.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return json({ error: "Forbidden" }, 403);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const [
    { data: users },
    { count: workspaceCount },
    { count: pageCount },
    { count: prdCount },
    { data: topWorkspaces },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("workspaces").select("*", { count: "exact", head: true }),
    admin.from("pages").select("*", { count: "exact", head: true }).eq("is_archived", false),
    admin.from("prd_sessions").select("*", { count: "exact", head: true }),
    admin.from("workspaces").select("id, name, slug, icon, created_at, owner_id").order("created_at", { ascending: false }).limit(20),
  ]);

  const { data: pageCounts } = await admin
    .from("pages")
    .select("workspace_id")
    .eq("is_archived", false);

  const pageCountMap: Record<string, number> = {};
  for (const p of pageCounts ?? []) {
    pageCountMap[p.workspace_id] = (pageCountMap[p.workspace_id] ?? 0) + 1;
  }

  const { data: prdSessions } = await admin
    .from("prd_sessions")
    .select("user_id, updated_at")
    .order("updated_at", { ascending: false });

  const prdCountMap: Record<string, number> = {};
  for (const s of prdSessions ?? []) {
    prdCountMap[s.user_id] = (prdCountMap[s.user_id] ?? 0) + 1;
  }

  const now = Date.now();
  const day = 86400000;
  const userList = (users?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? "",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    prd_sessions: prdCountMap[u.id] ?? 0,
    active_today: u.last_sign_in_at ? (now - new Date(u.last_sign_in_at).getTime()) < day : false,
    active_7d: u.last_sign_in_at ? (now - new Date(u.last_sign_in_at).getTime()) < 7 * day : false,
  }));

  const activeToday = userList.filter((u) => u.active_today).length;
  const active7d = userList.filter((u) => u.active_7d).length;

  const signupsByDay: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * day).toISOString().slice(0, 10);
    signupsByDay[d] = 0;
  }
  for (const u of userList) {
    const d = new Date(u.created_at).toISOString().slice(0, 10);
    if (d in signupsByDay) signupsByDay[d]++;
  }

  return json({
    overview: {
      total_users: userList.length,
      active_today: activeToday,
      active_7d: active7d,
      total_workspaces: workspaceCount ?? 0,
      total_pages: pageCount ?? 0,
      total_prd_sessions: prdCount ?? 0,
    },
    users: userList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    workspaces: (topWorkspaces ?? []).map((w) => ({
      ...w,
      page_count: pageCountMap[w.id] ?? 0,
    })),
    signups_by_day: Object.entries(signupsByDay).map(([date, count]) => ({ date, count })),
  });
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
