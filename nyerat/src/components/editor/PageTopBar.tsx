import { useNavigate, useParams } from "react-router-dom";
import { isDriveConnected, connectDrive, clearDriveToken } from "@/lib/gdrive";
import { isNotionConnected, pushPageToNotion, pageContentToMarkdown } from "@/lib/notion";
import { useMemo, useState } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { usePageStore } from "@/stores/usePageStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  MoreHorizontal,
  Sun,
  Moon,
  Star,
  PanelRight,
  Download,
  Share2,
  Bell,
  LayoutTemplate,
  Table,
  Link as LinkIcon,
  Copy,
  Printer,
  FileDown,
  CloudUpload,
  Globe,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type { Page } from "@/lib/types";
import { ShareDialog } from "./ShareDialog";
import { SetReminderDialog } from "./SetReminderDialog";
import { SaveAsTemplateDialog } from "./SaveAsTemplateDialog";
import { toast } from "sonner";

export function PageTopBar({
  page,
  saveState,
  onExportMarkdown,
  onCopyMarkdown,
  onEmbedSheet,
  onAddTable,
  driveSyncing,
  onLayoutChange,
  currentLayout,
  children,
}: {
  page: Page;
  saveState: "idle" | "saving" | "saved";
  onExportMarkdown: () => void;
  onCopyMarkdown?: () => void;
  onEmbedSheet?: (url: string) => void;
  onAddTable?: () => void;
  driveSyncing?: boolean;
  onLayoutChange?: (layout: "default" | "wide" | "full") => void;
  currentLayout?: "default" | "wide" | "full";
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();
  const { theme, setTheme, rightPanelOpen, setRightPanelOpen } = useUIStore();
  const { pages } = usePageStore();
  const { activeWorkspace } = useWorkspaceStore();
  const [shareOpen, setShareOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [driveConnected, setDriveConnected] = useState(isDriveConnected());

  const handleConnectDrive = async () => {
    try {
      await connectDrive();
      setDriveConnected(true);
      toast.success("Google Drive connected — pages will sync automatically");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Drive connection failed");
    }
  };
  const [sheetPopoverOpen, setSheetPopoverOpen] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState("");

  const handleEmbedSheet = () => {
    const url = sheetUrlInput.trim();
    if (!url) return;
    if (!url.startsWith("https://")) {
      toast.error("URL must start with https://");
      return;
    }
    onEmbedSheet?.(url);
    setSheetUrlInput("");
    setSheetPopoverOpen(false);
  };

  const breadcrumbs = useMemo(() => {
    const chain: Page[] = [page];
    let cur: Page | undefined = page;
    while (cur?.parent_id) {
      cur = pages[cur.parent_id];
      if (!cur) break;
      chain.unshift(cur);
    }
    return chain;
  }, [page, pages]);

  const copyLink = async () => {
    const url = `${window.location.origin}/app/${workspaceSlug}/${page.id}`;
    await navigator.clipboard.writeText(url);
    toast.success("Page link copied");
  };

  const printPage = () => {
    toast.info("Use 'Save as PDF' in the print dialog");
    window.setTimeout(() => window.print(), 200);
  };


  return (
    <header className="flex h-12 flex-shrink-0 items-center justify-between border-b px-4 print:hidden">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/app/${workspaceSlug}`)} className="cursor-pointer">
              {activeWorkspace?.icon} {activeWorkspace?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((p, i) => (
            <span key={p.id} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {i === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="max-w-[200px] truncate">
                    {p.icon} {p.title || "Untitled"}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => navigate(`/app/${workspaceSlug}/${p.id}`)}
                    className="max-w-[150px] cursor-pointer truncate"
                  >
                    {p.icon} {p.title || "Untitled"}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved ✓" : ""}
        </span>
        {driveSyncing && (
          <span className="text-xs text-muted-foreground">⟳ Syncing...</span>
        )}
        {driveConnected ? (
          <button
            title="Drive synced — click to disconnect"
            onClick={() => { clearDriveToken(); setDriveConnected(false); toast.info("Drive disconnected"); }}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-green-600 hover:bg-muted"
          >
            <CloudUpload className="h-3.5 w-3.5" /> Drive On
          </button>
        ) : (
          <button
            onClick={handleConnectDrive}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            <CloudUpload className="h-3.5 w-3.5" /> Sync Drive
          </button>
        )}
        {children}
        {onLayoutChange && (
          <div className="flex items-center gap-0.5 rounded border p-0.5">
            {(["default", "wide", "full"] as const).map((l) => (
              <button
                key={l}
                onClick={() => onLayoutChange(l)}
                title={l === "default" ? "Centered (720px)" : l === "wide" ? "Wide (1100px)" : "Full width"}
                className={`rounded px-1.5 py-0.5 text-[10px] transition ${currentLayout === l ? "bg-foreground text-background" : "hover:bg-muted"}`}
              >
                {l === "default" ? "⊟" : l === "wide" ? "⊞" : "⊡"}
              </button>
            ))}
          </div>
        )}
        {onAddTable && (
          <Button variant="ghost" size="sm" onClick={onAddTable}>
            <Table className="mr-1 h-4 w-4" /> Table
          </Button>
        )}
        {onEmbedSheet && (
          <Popover open={sheetPopoverOpen} onOpenChange={setSheetPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe className="mr-1 h-4 w-4" /> Embed
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-2">
                <div className="text-sm font-medium">Paste URL to embed</div>
                <Input
                  value={sheetUrlInput}
                  onChange={(e) => setSheetUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/..., YouTube, Figma, Airtable, etc."
                  onKeyDown={(e) => e.key === "Enter" && handleEmbedSheet()}
                  autoFocus
                />
                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="ghost" onClick={() => setSheetPopoverOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleEmbedSheet}>Embed</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  The site must allow being embedded in iframes.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Button variant="ghost" size="sm" onClick={() => setShareOpen(true)}>
          <Share2 className="mr-1 h-4 w-4" /> Share
        </Button>
        <Button variant="ghost" size="icon" aria-label="Favorite">
          <Star className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle properties"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
        >
          <PanelRight className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => setRightPanelOpen(true)}>
              <PanelRight className="mr-2 h-4 w-4" /> Properties
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setReminderOpen(true)}>
              <Bell className="mr-2 h-4 w-4" /> Set reminder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTemplateOpen(true)}>
              <LayoutTemplate className="mr-2 h-4 w-4" /> Save as template
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Download className="mr-2 h-4 w-4" /> Export
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={onExportMarkdown}>
                  <FileDown className="mr-2 h-4 w-4" /> Markdown (.md)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={printPage}>
                  <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
                </DropdownMenuItem>
                {isNotionConnected() && (
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        const md = pageContentToMarkdown(page.content);
                        const url = await pushPageToNotion(page.title ?? "Untitled", md);
                        toast.success("Pushed to Notion!");
                        window.open(url, "_blank");
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Failed");
                      }
                    }}
                  >
                    <FileDown className="mr-2 h-4 w-4" /> Push to Notion
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={onCopyMarkdown ?? onExportMarkdown}>
                  <FileDown className="mr-2 h-4 w-4" /> Copy as Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyLink}>
                  <LinkIcon className="mr-2 h-4 w-4" /> Copy page link
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              Toggle theme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ShareDialog page={page} open={shareOpen} onOpenChange={setShareOpen} />
      {activeWorkspace && (
        <>
          <SetReminderDialog
            open={reminderOpen}
            onOpenChange={setReminderOpen}
            pageId={page.id}
            workspaceId={activeWorkspace.id}
            pageTitle={page.title}
          />
          <SaveAsTemplateDialog
            open={templateOpen}
            onOpenChange={setTemplateOpen}
            workspaceId={activeWorkspace.id}
            pageTitle={page.title}
            pageIcon={page.icon}
            pageContent={page.content}
          />
        </>
      )}
    </header>
  );
}
