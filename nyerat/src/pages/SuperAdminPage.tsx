import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Users, FileText, RefreshCw, Building2, Sparkles, Activity } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ADMIN_EMAIL = "product.manager@sekolahmu.co.id";

interface AdminStats {
  overview: {
    total_users: number;
    active_today: number;
    active_7d: number;
    total_workspaces: number;
    total_pages: number;
    total_prd_sessions: number;
  };
  users: Array<{
    id: string;
    email: string;
    name: string;
    created_at: string;
    last_sign_in_at: string | null;
    prd_sessions: number;
    active_today: boolean;
    active_7d: boolean;
  }>;
  workspaces: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string;
    created_at: string;
    page_count: number;
  }>;
  signups_by_day: Array<{ date: string; count: number }>;
}

export default function SuperAdminPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [search, setSearch] = useState("");

  const isAdmin = user?.email === ADMIN_EMAIL;

  const load = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("admin-stats", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      if (res.error) throw new Error(res.error.message);
      setStats(res.data as AdminStats);
      setLastUpdated(new Date());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) void load(); }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <div className="text-xl font-semibold">403 Forbidden</div>
          <div className="text-muted-foreground mt-1">You don't have permission to view this page.</div>
        </div>
      </div>
    );
  }

  const filteredUsers = stats?.users.filter((u) =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const overviewCards = stats ? [
    { label: "Total Users", value: stats.overview.total_users, icon: Users, color: "text-blue-500" },
    { label: "Active Today", value: stats.overview.active_today, icon: Activity, color: "text-green-500" },
    { label: "Active 7 Days", value: stats.overview.active_7d, icon: Activity, color: "text-emerald-500" },
    { label: "Workspaces", value: stats.overview.total_workspaces, icon: Building2, color: "text-purple-500" },
    { label: "Total Pages", value: stats.overview.total_pages, icon: FileText, color: "text-orange-500" },
    { label: "PRD Sessions", value: stats.overview.total_prd_sessions, icon: Sparkles, color: "text-pink-500" },
  ] : [];

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Superadmin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {lastUpdated ? `Updated ${formatDistanceToNow(lastUpdated, { addSuffix: true })}` : "Loading..."}
            </p>
          </div>
          <Button onClick={load} disabled={loading} variant="outline" size="sm">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </div>

        {loading && !stats ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {overviewCards.map((c) => (
                <Card key={c.label}>
                  <CardHeader className="pb-1 pt-3 px-4">
                    <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <c.icon className={`h-3.5 w-3.5 ${c.color}`} />
                      {c.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 px-4">
                    <div className="text-2xl font-bold">{c.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">New Signups — Last 14 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={stats.signups_by_day}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={24} />
                    <Tooltip labelFormatter={(v) => v} formatter={(v) => [v, "signups"]} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Users ({stats.users.length})</CardTitle>
                  <Input
                    placeholder="Search by email or name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 w-52 text-xs"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-72">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50 text-xs text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Joined</th>
                        <th className="px-4 py-2 text-left">Last Active</th>
                        <th className="px-4 py-2 text-center">PRD</th>
                        <th className="px-4 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-muted/30">
                          <td className="px-4 py-2 font-mono text-xs">{u.email}</td>
                          <td className="px-4 py-2">{u.name || "—"}</td>
                          <td className="px-4 py-2 text-xs text-muted-foreground">{format(new Date(u.created_at), "dd MMM yyyy")}</td>
                          <td className="px-4 py-2 text-xs text-muted-foreground">
                            {u.last_sign_in_at ? formatDistanceToNow(new Date(u.last_sign_in_at), { addSuffix: true }) : "Never"}
                          </td>
                          <td className="px-4 py-2 text-center text-xs">{u.prd_sessions}</td>
                          <td className="px-4 py-2 text-center">
                            <Badge variant={u.active_today ? "default" : u.active_7d ? "secondary" : "outline"} className="text-[10px]">
                              {u.active_today ? "Today" : u.active_7d ? "7d" : "Inactive"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Workspaces ({stats.workspaces.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left">Workspace</th>
                      <th className="px-4 py-2 text-left">Slug</th>
                      <th className="px-4 py-2 text-center">Pages</th>
                      <th className="px-4 py-2 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.workspaces.map((w) => (
                      <tr key={w.id} className="border-b hover:bg-muted/30">
                        <td className="px-4 py-2 font-medium">{w.icon} {w.name}</td>
                        <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{w.slug}</td>
                        <td className="px-4 py-2 text-center">{w.page_count}</td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">{format(new Date(w.created_at), "dd MMM yyyy")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
