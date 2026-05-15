import { useEffect, useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  url: string;
  title: string;
  description: string;
  favicon: string;
  coverImage: string;
  onChange: (props: { url: string; title: string; description: string; favicon: string; coverImage: string }) => void;
  editable: boolean;
}

export function BookmarkBlockRenderer({ url, title, description, favicon, coverImage, onChange, editable }: Props) {
  const [draftUrl, setDraftUrl] = useState("");

  useEffect(() => {
    if (!url || title) return;
    // Auto-populate basic metadata when only URL is set
    try {
      const u = new URL(url);
      onChange({
        url,
        title: title || u.hostname,
        description,
        favicon: favicon || `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`,
        coverImage,
      });
    } catch {
      // ignore
    }
  }, [url, title, description, favicon, coverImage, onChange]);

  if (!url) {
    return (
      <div className="my-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
        <div className="flex gap-2">
          <Input
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="Paste a URL…"
            disabled={!editable}
          />
          <Button
            size="sm"
            onClick={() => {
              try {
                const u = new URL(draftUrl);
                onChange({
                  url: draftUrl,
                  title: u.hostname,
                  description: "",
                  favicon: `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`,
                  coverImage: "",
                });
              } catch {
                /* ignore */
              }
            }}
            disabled={!draftUrl}
          >
            Embed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="my-2 flex overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary"
    >
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {favicon ? (
            <img src={favicon} alt="" className="h-3.5 w-3.5 rounded" />
          ) : (
            <Globe className="h-3.5 w-3.5" />
          )}
          <span className="truncate">{(() => { try { return new URL(url).hostname; } catch { return url; } })()}</span>
          <ExternalLink className="h-3 w-3" />
        </div>
        <div className="line-clamp-1 text-sm font-medium">{title || url}</div>
        {description && (
          <div className="line-clamp-2 text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      {coverImage && (
        <img src={coverImage} alt="" className="h-24 w-32 flex-shrink-0 object-cover" />
      )}
    </a>
  );
}
