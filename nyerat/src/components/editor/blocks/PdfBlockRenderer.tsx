import { useState } from "react";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToBucket } from "@/lib/upload";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface Props {
  url: string;
  fileName: string;
  pageId: string;
  onChange: (props: { url: string; fileName: string }) => void;
  editable: boolean;
}

export function PdfBlockRenderer({ url, fileName, pageId, onChange, editable }: Props) {
  const { activeWorkspace } = useWorkspaceStore();
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!activeWorkspace) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF");
      return;
    }
    setUploading(true);
    try {
      const signed = await uploadToBucket("attachments", activeWorkspace.id, pageId, file);
      onChange({ url: signed, fileName: file.name });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!url) {
    return (
      <label
        className="my-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition hover:bg-muted/50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {uploading ? "Uploading…" : "Click or drop a PDF here"}
        </span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={!editable || uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
      </label>
    );
  }

  return (
    <div className="my-2 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-1.5 text-xs">
        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="flex-1 truncate font-medium">{fileName || "PDF"}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs text-muted-foreground">
          {page} / {numPages || "…"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setPage((p) => Math.min(numPages, p + 1))}
          disabled={page >= numPages}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs text-muted-foreground">{Math.round(scale * 100)}%</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setScale((s) => Math.min(2, s + 0.25))}
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <a href={url} target="_blank" rel="noreferrer" download={fileName}>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </a>
      </div>
      <div className="max-h-[800px] overflow-auto bg-muted/20 p-3 flex justify-center">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="p-8 text-sm text-muted-foreground">Loading PDF…</div>}
          error={<div className="p-8 text-sm text-destructive">Failed to load PDF</div>}
        >
          <PdfPage pageNumber={page} scale={scale} renderTextLayer={false} />
        </Document>
      </div>
    </div>
  );
}
