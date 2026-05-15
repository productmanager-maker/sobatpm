"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/prd/topbar";
import { PRDStepper } from "@/components/prd/stepper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  RefreshCw,
  Send,
  Download,
} from "lucide-react";

interface PRD {
  id: string;
  title: string;
  status: string;
  currentStep: string;
  generatedPRD?: string;
  quality?: number;
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold text-slate-800 mt-6 mb-3">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-slate-700 mt-5 mb-2 border-b border-slate-200 pb-1">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-sm font-bold text-slate-600 mt-3 mb-1.5">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="text-sm text-slate-600 ml-4 mb-0.5 list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={i} className="text-sm text-slate-600 ml-4 mb-0.5 list-decimal">
          {line.replace(/^\d+\. /, "")}
        </li>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="border-slate-200 my-4" />);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      // Handle bold and inline formatting
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      elements.push(
        <p
          key={i}
          className="text-sm text-slate-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    }
    i++;
  }

  return elements;
}

export default function DraftPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prd, setPRD] = useState<PRD | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    loadPRD();
  }, [id]);

  async function loadPRD() {
    setLoading(true);
    try {
      const res = await fetch(`/api/prd/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPRD(data);

        // If no generated PRD yet, generate it
        if (!data.generatedPRD) {
          await generatePRD();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function generatePRD() {
    setRegenerating(true);
    try {
      const res = await fetch(`/api/prd/${id}/generate`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setPRD(data);
      }
    } finally {
      setRegenerating(false);
    }
  }

  async function sendToReview() {
    setPublishing(true);
    try {
      await fetch(`/api/prd/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: "PUBLISH",
          status: "GENERATED",
        }),
      });
      router.push(`/prd/${id}/publish`);
    } finally {
      setPublishing(false);
    }
  }

  if (loading || regenerating) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title="Draft PRD" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-[#E6EAF8] rounded-2xl flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-[#0519B0]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700 mb-1">
              {regenerating ? "Generating PRD..." : "Loading..."}
            </p>
            <p className="text-sm text-slate-400">
              Memproses brief dan menghasilkan dokumen PRD
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!prd) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title={prd.title} />

      {/* Stepper */}
      <div className="bg-white border-b border-slate-200">
        <div className="relative">
          <PRDStepper currentStep={prd.currentStep} prdId={id} />
          <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-2">
            <Button variant="outline" size="sm" onClick={generatePRD} disabled={regenerating}>
              <RefreshCw size={13} className={regenerating ? "animate-spin mr-1.5" : "mr-1.5"} />
              Regenerate
            </Button>
            <Button size="sm" className="bg-[#0519B0] hover:bg-[#000B8A] text-white" onClick={sendToReview} disabled={publishing}>
              {publishing ? <Loader2 size={13} className="animate-spin mr-1.5" /> : <Send size={13} className="mr-1.5" />}
              Send to Review
            </Button>
          </div>
        </div>
        {/* Mobile buttons */}
        <div className="md:hidden flex gap-2 px-4 pb-3">
          <Button variant="outline" size="sm" onClick={generatePRD} disabled={regenerating} className="flex-1">
            <RefreshCw size={13} className={regenerating ? "animate-spin mr-1.5" : "mr-1.5"} />
            Regenerate
          </Button>
          <Button size="sm" className="flex-1 bg-[#0519B0] hover:bg-[#000B8A] text-white" onClick={sendToReview} disabled={publishing}>
            {publishing ? <Loader2 size={13} className="animate-spin mr-1.5" /> : <Send size={13} className="mr-1.5" />}
            Send to Review
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <Card className="p-4 mb-4 flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-teal-100 text-teal-700 border-teal-200 border" variant="outline">
                  Generated
                </Badge>
                {prd.quality && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 border" variant="outline">
                    Quality: {prd.quality}%
                  </Badge>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-800">{prd.title}</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Generated by Sobat PM · {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download size={13} className="mr-1.5" />
              Export
            </Button>
          </Card>

          {/* PRD Content */}
          <Card className="p-8">
            {prd.generatedPRD ? (
              <div className="prose prose-slate max-w-none">
                {renderMarkdown(prd.generatedPRD)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">PRD belum di-generate.</p>
                <Button
                  onClick={generatePRD}
                  className="mt-4 bg-[#0519B0] hover:bg-[#000B8A] text-white"
                >
                  Generate PRD
                </Button>
              </div>
            )}
          </Card>

          {/* Action Footer */}
          <div className="flex items-center justify-between mt-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/prd/${id}/context`)}
            >
              <ArrowLeft size={14} className="mr-1.5" />
              Back to Context
            </Button>
            <Button
              className="bg-[#0519B0] hover:bg-[#000B8A] text-white"
              onClick={sendToReview}
              disabled={publishing}
            >
              {publishing ? (
                <Loader2 size={14} className="animate-spin mr-2" />
              ) : (
                <ArrowRight size={14} className="mr-2" />
              )}
              Send to Review & Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
