import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePageStore } from "@/stores/usePageStore";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNotionToken, setNotionToken, clearNotionToken, isNotionConnected,
  listNotionPages, fetchNotionPageContent, type NotionPage,
} from "@/lib/notion";
import { formatDistanceToNow } from "date-fns";

export function NotionIntegration({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(getNotionToken() ?? "");
  const [connected, setConnected] = useState(isNotionConnected());
  const [testing, setTesting] = useState(false);
  const [pages, setNotionPages] = useState<NotionPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const { upsertPage } = usePageStore();
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();

  const connect = async () => {
    if (!token.trim()) return;
    setTesting(true);
    try {
      setNotionToken(token.trim());
      const results = await listNotionPages();
      setNotionPages(results);
      setConnected(true);
      toast.success(`Connected! Found ${results.length} pages.`);
    } catch (e) {
      clearNotionToken();
      toast.error(e instanceof Error ? e.message : "Connection failed. Check your token.");
    } finally {
      setTesting(false);
    }
  };

  const loadPages = async () => {
    setLoadingPages(true);
    try {
      const results = await listNotionPages();
      setNotionPages(results);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load pages");
    } finally {
      setLoadingPages(false);
    }
  };

  const importPage = async (p: NotionPage) => {
    if (!activeWorkspace || !user) return;
    setImporting(p.id);
    try {
      const content = await fetchNotionPageContent(p.id);
      const { data: maxRow } = await supabase.from("pages").select("sort_order").eq("workspace_id", activeWorkspace.id).order("sort_order", { ascending: false }).limit(1).maybeSingle();
      const nextOrder = ((maxRow?.sort_order ?? 0) as number) + 1;
      const { data, error } = await supabase.from("pages").insert({
        workspace_id: activeWorkspace.id,
        title: p.title,
        icon: "📥",
        type: "page",
        created_by: user.id,
        updated_by: user.id,
        sort_order: nextOrder,
        content: { blocks: [{ type: "paragraph", content: [{ type: "text", text: content }] }] } as never,
      }).select().single();
      if (error) throw error;
      upsertPage(data as never);
      toast.success(`"${p.title}" imported!`);
      setOpen(false);
      navigate(`/app/${workspaceSlug ?? activeWorkspace.slug}/${data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(null);
    }
  };

  const disconnect = () => {
    clearNotionToken();
    setConnected(false);
    setToken("");
    setNotionPages([]);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v && connected && pages.length === 0) loadPages(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col bg-background">
        <DialogHeader><DialogTitle>Notion Integration</DialogTitle></DialogHeader>
        <Tabs defaultValue={connected ? "import" : "connect"}>
          <TabsList className="w-full">
            <TabsTrigger value="connect" className="flex-1">Connect</TabsTrigger>
            <TabsTrigger value="import" className="flex-1" disabled={!connected}>Import</TabsTrigger>
          </TabsList>
          <TabsContent value="connect" className="space-y-3 pt-3">
            <p className="text-sm text-muted-foreground">
              Create an internal integration at{" "}
              <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="underline">notion.so/my-integrations</a>{" "}
              and paste the token below. Then share your Notion pages with the integration.
            </p>
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="secret_..." type="password" />
            <div className="flex gap-2">
              <Button onClick={connect} disabled={testing || !token.trim()} className="flex-1">
                {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {connected ? "Reconnect" : "Connect"}
              </Button>
              {connected && <Button variant="outline" onClick={disconnect}>Disconnect</Button>}
            </div>
            {connected && <p className="text-xs text-green-600">✓ Connected to Notion</p>}
          </TabsContent>
          <TabsContent value="import" className="pt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{pages.length} pages found</span>
              <Button size="sm" variant="ghost" onClick={loadPages} disabled={loadingPages}>
                {loadingPages ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </div>
            <ScrollArea className="h-[50vh] bg-background">
              {pages.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(p.last_edited_time), { addSuffix: true })}</div>
                  </div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /></a>
                  <Button size="sm" onClick={() => importPage(p)} disabled={!!importing}>
                    {importing === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Import"}
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
