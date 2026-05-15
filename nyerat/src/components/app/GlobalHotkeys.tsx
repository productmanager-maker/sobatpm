import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/stores/useUIStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePageStore } from "@/stores/usePageStore";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Page } from "@/lib/types";

const SHORTCUTS: [string, string][] = [
  ["⌘ K", "Open command palette"],
  ["⌘ P", "Open command palette"],
  ["⌘ N", "New page"],
  ["⌘ \\", "Toggle sidebar"],
  ["⌘ Shift D", "Toggle dark mode"],
  ["⌘ /", "Show shortcuts"],
  ["Esc", "Close modal"],
];

export function GlobalHotkeys() {
  const navigate = useNavigate();
  const { setCommandPaletteOpen, toggleSidebar, theme, setTheme } = useUIStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const { upsertPage } = usePageStore();
  const [helpOpen, setHelpOpen] = useState(false);

  useHotkeys("mod+k, mod+p", (e) => {
    e.preventDefault();
    setCommandPaletteOpen(true);
  });
  useHotkeys("mod+\\", (e) => {
    e.preventDefault();
    toggleSidebar();
  });
  useHotkeys("mod+shift+d", (e) => {
    e.preventDefault();
    setTheme(theme === "dark" ? "light" : "dark");
  });
  useHotkeys("mod+/", (e) => {
    e.preventDefault();
    setHelpOpen(true);
  });
  useHotkeys("mod+n", async (e) => {
    e.preventDefault();
    if (!activeWorkspace || !user) return;
    const { data } = await supabase
      .from("pages")
      .insert({
        workspace_id: activeWorkspace.id,
        title: "Untitled",
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();
    if (data) {
      upsertPage(data as Page);
      navigate(`/app/${activeWorkspace.slug}/${data.id}`);
    }
  });

  return (
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 text-sm">
          {SHORTCUTS.map(([k, label]) => (
            <div key={k} className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-accent">
              <span>{label}</span>
              <kbd className="rounded border bg-muted px-2 py-0.5 text-xs">{k}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
