import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { usePageStore } from "@/stores/usePageStore";
import { useUIStore } from "@/stores/useUIStore";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/app/Sidebar";
import { CommandPalette } from "@/components/app/CommandPalette";
import { GlobalHotkeys } from "@/components/app/GlobalHotkeys";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { OfflineBanner } from "@/components/app/OfflineBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Page, Workspace } from "@/lib/types";

export default function AppLayout() {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();
  const { user } = useAuthStore();
  const { workspaces, activeWorkspace, setWorkspaces, setActiveWorkspace } = useWorkspaceStore();
  const { setPages } = usePageStore();
  const { sidebarOpen, setSidebarOpen, setCommandPaletteOpen } = useUIStore();
  const isMobile = useIsMobile();

  // Load workspaces
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("workspaces")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) {
          console.error("Failed to load workspaces:", error.message);
          return;
        }
        const list = (data ?? []) as Workspace[];
        setWorkspaces(list);
        if (list.length === 0) {
          navigate("/onboarding");
          return;
        }
        const active =
          (workspaceSlug && list.find((w) => w.slug === workspaceSlug)) || list[0];
        setActiveWorkspace(active);
        if (!workspaceSlug) navigate(`/app/${active.slug}`, { replace: true });
      } catch (e) {
        console.error("Workspace load threw:", e);
      }
    })();
  }, [user]); // eslint-disable-line

  // Sync active workspace with URL
  useEffect(() => {
    if (!workspaceSlug) return;
    const found = workspaces.find((w) => w.slug === workspaceSlug);
    if (found && found.id !== activeWorkspace?.id) setActiveWorkspace(found);
  }, [workspaceSlug, workspaces]); // eslint-disable-line

  // Load pages for active workspace
  useEffect(() => {
    if (!activeWorkspace) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("pages")
          .select("*")
          .eq("workspace_id", activeWorkspace.id)
          .eq("is_archived", false)
          .order("sort_order", { ascending: true });
        if (error) {
          console.error("Failed to load pages:", error.message);
          return;
        }
        setPages((data ?? []) as Page[]);
      } catch (e) {
        console.error("Pages load threw:", e);
      }
    })();
  }, [activeWorkspace?.id]); // eslint-disable-line

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <ErrorBoundary><Sidebar /></ErrorBoundary>
          </SheetContent>
        </Sheet>
      ) : (
        sidebarOpen && (
          <aside className="w-[260px] flex-shrink-0 border-r bg-sidebar">
            <ErrorBoundary><Sidebar /></ErrorBoundary>
          </aside>
        )
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <OfflineBanner />
        {isMobile && (
          <div className="flex h-12 items-center border-b px-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}
        <ErrorBoundary><Outlet /></ErrorBoundary>
      </div>

      <ErrorBoundary fallback={() => null}><CommandPalette /></ErrorBoundary>
      <ErrorBoundary fallback={() => null}><GlobalHotkeys /></ErrorBoundary>
    </div>
  );
}
