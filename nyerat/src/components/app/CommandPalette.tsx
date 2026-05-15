import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { useUIStore } from "@/stores/useUIStore";
import { usePageStore } from "@/stores/usePageStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FileText, Plus, Database, Settings, Bell, LayoutTemplate } from "lucide-react";
import type { Page } from "@/lib/types";

interface SearchHit {
  id: string;
  title: string;
  icon: string | null;
  type: string;
  snippet?: string;
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { pages, recentPageIds, upsertPage } = usePageStore();
  const { user } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();

  const [query, setQuery] = useState("");
  const [serverHits, setServerHits] = useState<SearchHit[]>([]);
  const [filter, setFilter] = useState<"all" | "page" | "database">("all");

  const close = () => {
    setCommandPaletteOpen(false);
    setQuery("");
    setServerHits([]);
  };
  const slug = workspaceSlug ?? activeWorkspace?.slug;
  const goPage = (id: string) => {
    navigate(`/app/${slug}/${id}`);
    close();
  };
  const goRoute = (path: string) => {
    navigate(path);
    close();
  };

  const newPage = async (type: "page" | "database" = "page") => {
    if (!activeWorkspace || !user) return;
    const { data } = await supabase
      .from("pages")
      .insert({
        workspace_id: activeWorkspace.id,
        title: type === "database" ? "New database" : "Untitled",
        type,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();
    if (data) {
      upsertPage(data as Page);
      goPage(data.id);
    }
  };

  const allPages = useMemo(() => Object.values(pages), [pages]);
  const fuse = useMemo(
    () => new Fuse(allPages, { keys: ["title"], threshold: 0.4, includeMatches: true }),
    [allPages],
  );

  const fuzzyHits = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  }, [query, fuse]);

  // Server FTS, debounced
  useEffect(() => {
    if (!activeWorkspace || query.trim().length < 2) {
      setServerHits([]);
      return;
    }
    const q = query.trim().split(/\s+/).join(" & ");
    const t = window.setTimeout(async () => {
      const { data } = await supabase
        .from("pages")
        .select("id, title, icon, type")
        .eq("workspace_id", activeWorkspace.id)
        .textSearch("search_vector", q, { type: "websearch", config: "simple" })
        .limit(20);
      setServerHits((data ?? []) as SearchHit[]);
    }, 300);
    return () => clearTimeout(t);
  }, [query, activeWorkspace?.id]);

  const recent = recentPageIds.map((id) => pages[id]).filter(Boolean);
  const isSearching = query.trim().length >= 2;

  // Merge fuzzy + FTS, dedupe by id, apply filter chip
  const merged = useMemo(() => {
    const map = new Map<string, SearchHit>();
    for (const p of fuzzyHits) map.set(p.id, p as SearchHit);
    for (const h of serverHits) if (!map.has(h.id)) map.set(h.id, h);
    let list = Array.from(map.values());
    if (filter !== "all") list = list.filter((h) => h.type === filter);
    return list;
  }, [fuzzyHits, serverHits, filter]);

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={(b) => (b ? setCommandPaletteOpen(true) : close())}>
      <CommandInput
        placeholder="Search pages or run a command..."
        value={query}
        onValueChange={setQuery}
      />
      {isSearching && (
        <div className="flex gap-1 border-b px-3 py-2">
          {(["all", "page", "database"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-2.5 py-0.5 text-xs capitalize transition ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {!isSearching && recent.length > 0 && (
          <CommandGroup heading="Recent">
            {recent.map((p) => (
              <CommandItem key={p.id} value={`recent-${p.id}`} onSelect={() => goPage(p.id)}>
                <span className="mr-2">{p.icon ?? <FileText className="h-4 w-4" />}</span>
                {p.title || "Untitled"}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {isSearching && merged.length > 0 && (
          <CommandGroup heading="Pages">
            {merged.map((h) => (
              <CommandItem key={h.id} value={`hit-${h.id}`} onSelect={() => goPage(h.id)}>
                <span className="mr-2">
                  {h.icon ?? (h.type === "database" ? <Database className="h-4 w-4" /> : <FileText className="h-4 w-4" />)}
                </span>
                <div className="flex-1 truncate">{h.title || "Untitled"}</div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="new-page" onSelect={() => newPage("page")}>
            <Plus className="mr-2 h-4 w-4" /> New page
          </CommandItem>
          <CommandItem value="new-db" onSelect={() => newPage("database")}>
            <Database className="mr-2 h-4 w-4" /> New database
          </CommandItem>
          <CommandItem value="reminders" onSelect={() => goRoute(`/app/${slug}/reminders`)}>
            <Bell className="mr-2 h-4 w-4" /> Open reminders
          </CommandItem>
          <CommandItem value="templates" onSelect={() => goRoute(`/app/${slug}/templates`)}>
            <LayoutTemplate className="mr-2 h-4 w-4" /> Browse templates
          </CommandItem>
          <CommandItem value="settings" onSelect={() => goRoute(`/app/settings/profile`)}>
            <Settings className="mr-2 h-4 w-4" /> Profile settings
          </CommandItem>
        </CommandGroup>

        {!isSearching && (
          <>
            <CommandSeparator />
            <CommandGroup heading="All pages">
              {allPages.slice(0, 30).map((p) => (
                <CommandItem key={p.id} value={`all-${p.id}`} onSelect={() => goPage(p.id)}>
                  <span className="mr-2">{p.icon ?? <FileText className="h-4 w-4" />}</span>
                  {p.title || "Untitled"}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
