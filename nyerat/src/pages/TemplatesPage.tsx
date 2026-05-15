import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { usePageStore } from "@/stores/usePageStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { BUILT_IN_TEMPLATES, type BuiltInTemplate } from "@/lib/templates";
import { toast } from "sonner";
import type { Page } from "@/lib/types";

interface CustomTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  snapshot_data: unknown;
}

export default function TemplatesPage() {
  const { user } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { upsertPage } = usePageStore();
  const { workspaceSlug } = useParams();
  const navigate = useNavigate();
  const [custom, setCustom] = useState<CustomTemplate[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!activeWorkspace) return;
    void supabase
      .from("templates")
      .select("id, name, description, category, icon, snapshot_data")
      .eq("workspace_id", activeWorkspace.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setCustom((data ?? []) as CustomTemplate[]));
  }, [activeWorkspace?.id]);

  const all = useMemo(() => {
    const built = BUILT_IN_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      icon: t.icon,
      blocks: t.blocks,
      builtin: true as const,
    }));
    const userTpl = custom.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description ?? "",
      category: t.category,
      icon: t.icon ?? "📄",
      snapshot: t.snapshot_data,
      builtin: false as const,
    }));
    const q = search.toLowerCase();
    return [...built, ...userTpl].filter(
      (t) => !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }, [custom, search]);

  const useTemplate = async (
    tpl: BuiltInTemplate | { id: string; name: string; icon: string; snapshot: unknown; builtin: false },
  ) => {
    if (!activeWorkspace || !user) return;
    const blocks = "blocks" in tpl ? tpl.blocks : ((tpl.snapshot as { blocks?: unknown })?.blocks ?? []);
    const { data, error } = await supabase
      .from("pages")
      .insert({
        workspace_id: activeWorkspace.id,
        title: tpl.name,
        icon: tpl.icon,
        content: { blocks } as never,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    upsertPage(data as Page);
    navigate(`/app/${workspaceSlug}/${data.id}`);
    toast.success("Page created from template");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-12 items-center gap-2 border-b px-6">
        <LayoutTemplate className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Templates</h1>
      </header>
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-4xl p-8">
          <Input
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-6 max-w-sm"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {all.map((tpl) => (
              <div key={`${tpl.builtin ? "b" : "c"}-${tpl.id}`} className="rounded-lg border bg-card p-4 transition hover:shadow-md">
                <div className="mb-2 flex items-start gap-3">
                  <span className="text-2xl">{tpl.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{tpl.name}</div>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{tpl.category}</Badge>
                  </div>
                </div>
                <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{tpl.description}</p>
                <Button size="sm" onClick={() => useTemplate(tpl as never)} className="w-full">
                  Use template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
