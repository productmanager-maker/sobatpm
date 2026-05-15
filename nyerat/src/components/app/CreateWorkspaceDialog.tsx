import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { usePageStore } from "@/stores/usePageStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

const ICONS = ["🏠", "💼", "🎨", "🚀", "📚", "🔬", "🎯", "✨"];

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addWorkspace, setActiveWorkspace } = useWorkspaceStore();
  const { upsertPage } = usePageStore();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🏠");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) return;
    if (name.trim().length < 2) return toast.error("Workspace name too short");
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("Not authenticated. Please sign in again.");
      }
      const slug = slugify(name);
      console.log("[create-ws] calling create-workspace edge function");
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ name: name.trim(), slug, icon }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Workspace creation failed");
      const { workspace: ws, page } = result;

      addWorkspace(ws as never);
      setActiveWorkspace(ws as never);
      upsertPage(page as never);
      toast.success("Workspace created!");
      onOpenChange(false);
      setName("");
      navigate(`/app/${ws.slug}/${page.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create workspace";
      console.error("[create-ws] failed:", e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Workspaces are where your team's pages and databases live.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ws-name">Name</Label>
            <Input
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
              autoFocus
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-8 gap-2">
              {ICONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-md border text-lg hover:bg-accent",
                    icon === e && "ring-2 ring-ring",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading || name.trim().length < 2}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
