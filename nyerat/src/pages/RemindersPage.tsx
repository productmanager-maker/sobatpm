import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, isPast, isToday, isTomorrow, isThisWeek } from "date-fns";
import { Bell, Check, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Reminder {
  id: string;
  page_id: string;
  title: string;
  remind_at: string;
  repeat_interval: string | null;
  is_done: boolean;
}

const groupOf = (d: Date): string => {
  if (isPast(d) && !isToday(d)) return "Overdue";
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isThisWeek(d, { weekStartsOn: 1 })) return "This week";
  return "Later";
};
const ORDER = ["Overdue", "Today", "Tomorrow", "This week", "Later"];

export default function RemindersPage() {
  const { user } = useAuthStore();
  const { workspaceSlug } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("reminders")
      .select("id, page_id, title, remind_at, repeat_interval, is_done")
      .eq("user_id", user.id)
      .eq("is_done", false)
      .order("remind_at", { ascending: true });
    setItems((data ?? []) as Reminder[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    const ch = supabase
      .channel("reminders-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "reminders" }, () => void load())
      .subscribe();
    return () => void supabase.removeChannel(ch);
  }, [user?.id]); // eslint-disable-line

  const markDone = async (id: string) => {
    await supabase.from("reminders").update({ is_done: true }).eq("id", id);
    setItems((s) => s.filter((r) => r.id !== id));
    toast.success("Marked done");
  };

  const remove = async (id: string) => {
    await supabase.from("reminders").delete().eq("id", id);
    setItems((s) => s.filter((r) => r.id !== id));
  };

  const grouped: Record<string, Reminder[]> = {};
  for (const r of items) {
    const g = groupOf(new Date(r.remind_at));
    (grouped[g] ??= []).push(r);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-12 items-center gap-2 border-b px-6">
        <Bell className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Reminders</h1>
      </header>
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-2xl p-8">
          {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {!loading && items.length === 0 && (
            <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
              No upcoming reminders.
            </div>
          )}
          {ORDER.filter((g) => grouped[g]?.length).map((g) => (
            <section key={g} className="mb-6">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g}</h2>
              <div className="space-y-1 rounded-lg border">
                {grouped[g].map((r) => (
                  <div key={r.id} className="flex items-center gap-3 px-3 py-2 hover:bg-accent">
                    <button
                      onClick={() => navigate(`/app/${workspaceSlug}/${r.page_id}`)}
                      className="flex-1 text-left text-sm"
                    >
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(r.remind_at), "PPp")}
                        {r.repeat_interval && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">
                            {r.repeat_interval}
                          </Badge>
                        )}
                      </div>
                    </button>
                    <Button size="icon" variant="ghost" onClick={() => markDone(r.id)} aria-label="Mark done">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
