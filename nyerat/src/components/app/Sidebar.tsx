import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { usePageStore } from "@/stores/usePageStore";
import { useUIStore } from "@/stores/useUIStore";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronsUpDown,
  Search,
  Plus,
  Home,
  Inbox,
  FileText,
  
  Bookmark,
  Settings,
  LogOut,
  Sun,
  Moon,
  LayoutTemplate,
  Sparkles,
  User as UserIcon,
  Download,
  CloudUpload,
  Shield,
  Info,
} from "lucide-react";
import { isDriveConnected, syncAllPagesToDrive } from "@/lib/gdrive";
import { PageTree } from "./PageTree";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { TagsSection } from "./TagsSection";
import { NotebooksSection } from "./NotebooksSection";
import { SaveUrlDialog } from "./SaveUrlDialog";
import { NotionIntegration } from "@/components/integrations/NotionIntegration";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import { Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function Sidebar() {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();
  const { user, profile, reset } = useAuthStore();
  const { workspaces, activeWorkspace } = useWorkspaceStore();
  const { upsertPage, pages } = usePageStore();
  const { setCommandPaletteOpen, theme, setTheme } = useUIStore();
  const [createWsOpen, setCreateWsOpen] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const slug = workspaceSlug ?? activeWorkspace?.slug ?? "";

  const handleSyncAll = async () => {
    const allPages = Object.values(pages);
    if (allPages.length === 0) { toast.info("No pages to sync"); return; }
    setSyncingAll(true);
    toast.info(`Syncing ${allPages.length} pages to Drive...`);
    try {
      const { synced, failed } = await syncAllPagesToDrive(
        allPages.map((p) => ({ id: p.id, title: p.title ?? "Untitled", content: p.content }))
      );
      toast.success(`Drive backup done: ${synced} synced${failed > 0 ? `, ${failed} failed` : ""}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncingAll(false);
    }
  };


  const initials = (profile?.full_name ?? profile?.email ?? "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const createPage = async (type: "page" | "database" = "page") => {
    if (!activeWorkspace || !user) {
      toast.error("Pick a workspace first");
      return;
    }
    try {
      console.log("[create-page] inserting page", { type, ws: activeWorkspace.id });
      const { data: maxRow } = await supabase
        .from("pages")
        .select("sort_order")
        .eq("workspace_id", activeWorkspace.id)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextOrder = ((maxRow?.sort_order ?? 0) as number) + 1;

      const { data, error } = await supabase
        .from("pages")
        .insert({
          workspace_id: activeWorkspace.id,
          title: type === "database" ? "New database" : "Untitled",
          type,
          created_by: user.id,
          updated_by: user.id,
          sort_order: nextOrder,
        })
        .select()
        .single();
      if (error) throw error;
      console.log("[create-page] created", data);
      upsertPage(data as never);
      navigate(`/app/${activeWorkspace.slug}/${data.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create page";
      console.error("[create-page] failed", e);
      toast.error(msg);
    }
  };

  const { canInstall, promptInstall } = useInstallPrompt();

  const signOut = async () => {
    await supabase.auth.signOut();
    reset();
    navigate("/login");
  };

  return (
    <div className="flex h-full flex-col text-sidebar-foreground">
      {/* Workspace switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-3 hover:bg-sidebar-accent transition-colors text-left">
            <span className="text-lg">{activeWorkspace?.icon ?? "🏠"}</span>
            <span className="flex-1 truncate text-sm font-medium">
              {activeWorkspace?.name ?? "Workspace"}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {workspaces.map((w) => (
            <DropdownMenuItem
              key={w.id}
              onClick={() => navigate(`/app/${w.slug}`)}
            >
              <span className="mr-2">{w.icon}</span>
              <span className="truncate">{w.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCreateWsOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Create workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="space-y-1 px-2 pb-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent transition-colors">
              <Plus className="h-4 w-4" />
              <span className="flex-1 text-left">New</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem onClick={() => createPage("page")}>
              <FileText className="mr-2 h-4 w-4" /> Page
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createPage("database")}>
              <Inbox className="mr-2 h-4 w-4" /> Database
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SaveUrlDialog
          trigger={
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent transition-colors">
              <LinkIcon className="h-4 w-4" />
              <span className="flex-1 text-left">Save URL</span>
            </button>
          }
        />
      </div>

      <Separator />

      <nav className="space-y-0.5 px-2 py-2">
        {[
          { icon: Home, label: "Home", path: `/app/${slug}` },
          { icon: Sparkles, label: "PRD Builder", path: `/app/${slug}/prd-builder` },
          { icon: LayoutTemplate, label: "Templates", path: `/app/${slug}/templates` },
          { icon: FileText, label: "All Pages", path: `/app/${slug}` },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-sm hover:bg-sidebar-accent transition-colors"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => navigate(`/app/${slug}/about`)}
          className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-sm hover:bg-sidebar-accent transition-colors"
        >
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-left">Tentang Nyerat</span>
        </button>
        {user?.email === "product.manager@sekolahmu.co.id" && (
          <button
            onClick={() => navigate(`/app/${slug}/superadmin`)}
            className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-sm hover:bg-sidebar-accent transition-colors"
          >
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-left">Admin</span>
          </button>
        )}
      </nav>

      <Separator />

      <div className="px-2 py-2">
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Bookmark className="h-3 w-3" />
          Favorites
        </div>
      </div>

      <ScrollArea className="flex-1">
        <NotebooksSection />
        <div className="px-2"><PageTree /></div>
        <TagsSection />
      </ScrollArea>

      <Separator />

      {/* User section */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-sidebar-accent transition-colors">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {initials}
            </div>
            <div className="flex-1 truncate text-left text-sm">
              {profile?.full_name ?? profile?.email ?? "User"}
            </div>
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-1">
          <button onClick={() => navigate("/app/settings/profile")} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
            <UserIcon className="h-4 w-4" /> Profile
          </button>
          <button onClick={() => navigate(`/app/${slug}/settings`)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
            <Settings className="h-4 w-4" /> Workspace settings
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Toggle theme
          </button>
          {canInstall && (
            <button
              onClick={() => promptInstall()}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Download className="h-4 w-4" /> Install app
            </button>
          )}
          {isDriveConnected() && (
            <button
              onClick={handleSyncAll}
              disabled={syncingAll}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
            >
              <CloudUpload className="h-4 w-4" />
              {syncingAll ? "Syncing..." : "Sync All to Drive"}
            </button>
          )}
          <NotionIntegration
            trigger={
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                <FileText className="h-4 w-4" /> Notion
              </button>
            }
          />
          <Separator className="my-1" />
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </PopoverContent>
      </Popover>
      <CreateWorkspaceDialog open={createWsOpen} onOpenChange={setCreateWsOpen} />
    </div>
  );
}
