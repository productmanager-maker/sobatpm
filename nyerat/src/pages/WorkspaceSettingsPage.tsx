import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Member {
  id: string;
  user_id: string;
  role: string;
  profile?: { full_name: string | null; email: string | null; avatar_url: string | null };
}

export default function WorkspaceSettingsPage() {
  const { user } = useAuthStore();
  const { activeWorkspace, updateWorkspace, removeWorkspace } = useWorkspaceStore();
  const navigate = useNavigate();
  const [name, setName] = useState(activeWorkspace?.name ?? "");
  const [icon, setIcon] = useState(activeWorkspace?.icon ?? "🏠");
  const [members, setMembers] = useState<Member[]>([]);
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (!activeWorkspace) return;
    setName(activeWorkspace.name);
    setIcon(activeWorkspace.icon);
    void (async () => {
      const { data: ms } = await supabase
        .from("workspace_members")
        .select("id, user_id, role")
        .eq("workspace_id", activeWorkspace.id);
      const list = (ms ?? []) as Member[];
      const ids = list.map((m) => m.user_id);
      if (ids.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", ids);
        const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
        for (const m of list) m.profile = byId.get(m.user_id) as never;
      }
      setMembers(list);
    })();
  }, [activeWorkspace?.id]);

  const save = async () => {
    if (!activeWorkspace) return;
    const { data, error } = await supabase
      .from("workspaces")
      .update({ name, icon })
      .eq("id", activeWorkspace.id)
      .select()
      .single();
    if (error) return toast.error(error.message);
    updateWorkspace(data as never);
    toast.success("Workspace saved");
  };

  const removeMember = async (id: string) => {
    await supabase.from("workspace_members").delete().eq("id", id);
    setMembers((s) => s.filter((m) => m.id !== id));
  };

  const deleteWorkspace = async () => {
    if (!activeWorkspace || confirm !== activeWorkspace.name) return;
    const { error } = await supabase.from("workspaces").delete().eq("id", activeWorkspace.id);
    if (error) return toast.error(error.message);
    removeWorkspace(activeWorkspace.id);
    toast.success("Workspace deleted");
    navigate("/app");
  };

  if (!activeWorkspace) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-12 items-center gap-2 border-b px-6">
        <SettingsIcon className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Workspace settings</h1>
      </header>
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-2xl space-y-6 p-8">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">General</h2>
            <div className="flex gap-2">
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="w-16 text-center text-lg" />
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Workspace name" />
            </div>
            <Button onClick={save}>Save</Button>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-sm font-semibold">Members</h2>
            <div className="rounded-lg border">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 border-b px-3 py-2 last:border-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {(m.profile?.full_name ?? m.profile?.email ?? "U")[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{m.profile?.full_name ?? m.profile?.email}</div>
                    <div className="text-xs text-muted-foreground">{m.profile?.email}</div>
                  </div>
                  <span className="text-xs capitalize text-muted-foreground">{m.role}</span>
                  {m.user_id !== user?.id && m.role !== "owner" && (
                    <Button size="icon" variant="ghost" onClick={() => removeMember(m.id)} aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-3 rounded-lg border border-destructive/40 p-4">
            <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
            <p className="text-xs text-muted-foreground">
              Type <span className="font-mono font-semibold">{activeWorkspace.name}</span> to confirm deletion.
            </p>
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <Button variant="destructive" disabled={confirm !== activeWorkspace.name} onClick={deleteWorkspace}>
              Delete workspace
            </Button>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
