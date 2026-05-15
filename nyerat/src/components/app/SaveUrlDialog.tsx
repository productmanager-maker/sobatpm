import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { usePageStore } from "@/stores/usePageStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import type { Page } from "@/lib/types";

interface Props {
  trigger?: React.ReactNode;
}

export function SaveUrlDialog({ trigger }: Props) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { upsertPage } = usePageStore();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"article" | "full">("article");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!user || !activeWorkspace || !url) return;
    setLoading(true);
    try {
      const { data: page, error } = await supabase
        .from("pages")
        .insert({
          workspace_id: activeWorkspace.id,
          title: url,
          type: "page",
          created_by: user.id,
          updated_by: user.id,
        })
        .select()
        .single();
      if (error || !page) throw error ?? new Error("Failed to create page");

      upsertPage(page as Page);
      toast.success("Saving page…");
      setOpen(false);
      navigate(`/app/${activeWorkspace.slug}/${page.id}`);

      // Fire-and-forget edge function call
      const { error: fnError } = await supabase.functions.invoke("web-clip", {
        body: { url, workspace_id: activeWorkspace.id, page_id: page.id, mode },
      });
      if (fnError) toast.error(`Clip failed: ${fnError.message}`);
      else {
        try {
          const host = new URL(url).hostname;
          toast.success(`Page saved from ${host}`);
        } catch {
          toast.success("Page saved");
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
      setUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
            aria-label="Save URL as note"
          >
            <LinkIcon className="h-4 w-4" />
            <span className="flex-1 text-left">Save URL</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save web page as note</DialogTitle>
          <DialogDescription>
            We&apos;ll fetch the page and create a new note in your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="clip-url">URL</Label>
            <Input
              id="clip-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Capture</Label>
            <RadioGroup value={mode} onValueChange={(v) => setMode(v as "article" | "full")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="article" id="mode-article" />
                <Label htmlFor="mode-article" className="font-normal">Article only (readable content)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="mode-full" />
                <Label htmlFor="mode-full" className="font-normal">Full page (URL + metadata)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={loading || !url}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
