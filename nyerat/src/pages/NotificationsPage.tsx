import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow, isToday, isThisWeek } from "date-fns";
import { Bell, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: string;
  message: string;
  link: string | null;
  page_id: string | null;
  is_read: boolean;
  created_at: string;
}

const groupOf = (d: Date): "Today" | "This week" | "Earlier" => {
  if (isToday(d)) return "Today";
  if (isThisWeek(d, { weekStartsOn: 1 })) return "This week";
  return "Earlier";
};

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { workspaceSlug } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("id, type, message, link, page_id, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    setItems((data ?? []) as Notification[]);
  };

  useEffect(() => {
    void load();
    const ch = supabase
      .channel("notifications-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user?.id}` },
        () => void load(),
      )
      .subscribe();
    return () => void supabase.removeChannel(ch);
  }, [user?.id]); // eslint-disable-line

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    setItems((s) => s.map((n) => ({ ...n, is_read: true })));
  };

  const open = async (n: Notification) => {
    if (!n.is_read) await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
    if (n.link) navigate(n.link);
    else if (n.page_id) navigate(`/app/${workspaceSlug}/${n.page_id}`);
  };

  const grouped: Record<string, Notification[]> = {};
  for (const n of items) (grouped[groupOf(new Date(n.created_at))] ??= []).push(n);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-12 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Notifications</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all as read</Button>
      </header>
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-2xl p-8">
          {items.length === 0 && (
            <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-3 h-8 w-8 opacity-40" />
              You're all caught up.
            </div>
          )}
          {(["Today", "This week", "Earlier"] as const)
            .filter((g) => grouped[g]?.length)
            .map((g) => (
              <section key={g} className="mb-6">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g}</h2>
                <div className="space-y-1 rounded-lg border">
                  {grouped[g].map((n) => (
                    <button
                      key={n.id}
                      onClick={() => open(n)}
                      className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-accent"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                          n.is_read ? "bg-transparent" : "bg-primary"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="text-sm">{n.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
