import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Globe } from "lucide-react";
import { toast } from "sonner";
import type { Page } from "@/lib/types";

interface Share {
  id: string;
  page_id: string;
  is_public: boolean | null;
  allow_comments: boolean | null;
  share_token: string | null;
}

export function ShareDialog({
  page,
  open,
  onOpenChange,
}: {
  page: Page;
  open: boolean;
  onOpenChange: (b: boolean) => void;
}) {
  const [share, setShare] = useState<Share | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const { data } = await supabase
        .from("page_shares")
        .select("*")
        .eq("page_id", page.id)
        .maybeSingle();
      if (data) setShare(data as Share);
      else {
        const { data: created } = await supabase
          .from("page_shares")
          .insert({ page_id: page.id })
          .select()
          .single();
        if (created) setShare(created as Share);
      }
    })();
  }, [open, page.id]);

  const update = async (patch: Partial<Share>) => {
    if (!share) return;
    setLoading(true);
    const { data } = await supabase
      .from("page_shares")
      .update(patch)
      .eq("id", share.id)
      .select()
      .single();
    if (data) setShare(data as Share);
    setLoading(false);
  };

  const shareUrl = share?.share_token
    ? `${window.location.origin}/share/${share.share_token}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this page</DialogTitle>
          <DialogDescription>Anyone with the link can view it on the web.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Publish to web</div>
                <div className="text-xs text-muted-foreground">Read-only public link</div>
              </div>
            </div>
            <Switch
              checked={!!share?.is_public}
              disabled={loading}
              onCheckedChange={(v) => update({ is_public: v })}
            />
          </div>

          {share?.is_public && (
            <>
              <div className="space-y-1.5">
                <Label>Public link</Label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      toast.success("Link copied");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="text-sm">Allow comments</div>
                <Switch
                  checked={!!share?.allow_comments}
                  disabled={loading}
                  onCheckedChange={(v) => update({ allow_comments: v })}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
