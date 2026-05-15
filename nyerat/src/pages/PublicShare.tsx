import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { NotevoLogo } from "@/components/Brand";
import { Skeleton } from "@/components/ui/skeleton";
import type { PartialBlock } from "@blocknote/core";

export default function PublicShare() {
  const { shareToken } = useParams();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<{
    title: string;
    icon: string | null;
    cover_url: string | null;
    blocks: PartialBlock[];
  } | null>(null);

  useEffect(() => {
    if (!shareToken) return;
    (async () => {
      const { data: share } = await supabase
        .from("page_shares")
        .select("page_id, is_public")
        .eq("share_token", shareToken)
        .maybeSingle();
      if (!share?.is_public) {
        setLoading(false);
        return;
      }
      const { data: p } = await supabase
        .from("pages")
        .select("title, icon, cover_url, content")
        .eq("id", share.page_id)
        .maybeSingle();
      if (p) {
        const blocks = ((p.content as { blocks?: PartialBlock[] } | null)?.blocks) ?? [];
        setPage({
          title: p.title,
          icon: p.icon,
          cover_url: p.cover_url,
          blocks: blocks.length > 0 ? blocks : [{ type: "paragraph", content: "" }],
        });
      }
      setLoading(false);
    })();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[760px] p-12">
        <Skeleton className="h-10 w-1/2" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        This page is private or no longer shared.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {page.cover_url && (
        <img src={page.cover_url} alt="" className="h-[180px] w-full object-cover" />
      )}
      <div className="mx-auto max-w-[760px] px-12 pt-10 pb-24">
        {page.icon && <div className="mb-3 text-5xl">{page.icon}</div>}
        <h1 className="mb-6 text-4xl font-bold tracking-tight">{page.title || "Untitled"}</h1>
        <BlockEditor
          pageId={`share-${shareToken}`}
          initialContent={page.blocks}
          editable={false}
          onChange={() => {}}
        />
      </div>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Made with <NotevoLogo className="ml-1 inline-flex items-center gap-1" />
      </footer>
    </div>
  );
}
