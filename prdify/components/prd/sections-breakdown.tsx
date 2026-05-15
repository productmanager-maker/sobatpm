"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MermaidDiagram } from "./mermaid-diagram";
import {
  SECTION_ORDER,
  SECTION_LABELS,
  SECTION_GUIDANCE,
  SECTION_AUDIENCE,
  QUALITY_WEIGHTS,
  type SectionType,
} from "@/lib/sections";
import {
  Loader2,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Users,
  Palette,
  Code2,
  Zap,
} from "lucide-react";

interface Section {
  id: string;
  sectionType: string;
  content: string | null;
  status: string;
  version: number;
}

const AUDIENCE_STYLES: Record<string, { color: string; icon: React.ReactNode }> = {
  Stakeholder: {
    color: "text-[#1B4ED8] border-[#C2CDF1]",
    icon: <Users className="h-3 w-3" />,
  },
  "UI/UX": {
    color: "text-[#7B3DA0] border-[#E1CBEF]",
    icon: <Palette className="h-3 w-3" />,
  },
  Tech: {
    color: "text-[#1F8A5B] border-[#BFE3D0]",
    icon: <Code2 className="h-3 w-3" />,
  },
};

function StatusIcon({ status }: { status: string }) {
  if (status === "done") return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
  if (status === "generating") return <Loader2 className="h-4 w-4 text-blue-500 animate-spin shrink-0" />;
  if (status === "error") return <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />;
  return <Circle className="h-4 w-4 text-gray-300 shrink-0" />;
}

function SectionCard({
  section,
  prdId,
  onUpdate,
}: {
  section: Section;
  prdId: string;
  onUpdate: (s: Section) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const t = section.sectionType as SectionType;
  const audiences = SECTION_AUDIENCE[t] ?? [];
  const isFlow = t === "flow_diagram";

  async function generate() {
    setGenerating(true);
    setExpanded(true);
    try {
      const res = await fetch(`/api/prd/${prdId}/sections/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: t }),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Card
      className={`p-4 transition-all ${
        section.status === "done" ? "border-[#BFE3D0]" : section.status === "error" ? "border-[#FFB0C0] bg-[#FFF7F8]" : section.status === "generating" ? "border-[#C2CDF1] bg-[#F5F8FF]" : "border-[#EAEAEA]"
      }`}
    >
      <div className="flex items-start gap-3">
        <StatusIcon status={generating ? "generating" : section.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{SECTION_LABELS[t]}</span>
            {audiences.map((a) => (
              <span
                key={a}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border font-medium ${AUDIENCE_STYLES[a].color}`}
              >
                {AUDIENCE_STYLES[a].icon} {a}
              </span>
            ))}
            {section.status === "done" && section.version > 1 && (
              <span className="text-xs text-gray-400">v{section.version}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {SECTION_GUIDANCE[t]}
          </p>

          {(section.status === "error" || (!section.content && section.status !== "generating" && section.status !== "pending")) && section.status !== "done" && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              Gagal generate — kemungkinan rate limit. Klik Generate untuk retry.
            </p>
          )}

          {section.status === "done" && section.content && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-blue-600 mt-2 hover:underline"
            >
              {expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              {expanded ? "Tutup" : "Lihat konten"}
            </button>
          )}

          {expanded && section.content && (
            <div className="mt-3">
              {isFlow ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Flow Diagram</p>
                  <MermaidDiagram chart={section.content} />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono text-gray-700">
                  {section.content}
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          size="sm"
          variant={section.status === "done" ? "outline" : "default"}
          onClick={generate}
          disabled={generating}
          className="shrink-0 text-xs"
        >
          {generating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {section.status === "done" ? "Regen" : "Generate"}
        </Button>
      </div>
    </Card>
  );
}

export function SectionsBreakdown({ prdId }: { prdId: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingAllStatus, setGeneratingAllStatus] = useState("");
  const [quality, setQuality] = useState<{
    total: number;
    breakdown: Record<string, number>;
  } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/prd/${prdId}/sections`);
    if (res.ok) {
      const data = await res.json();
      setSections(data);
    }
    setLoading(false);
  }, [prdId]);

  useEffect(() => {
    // Init sections then load
    fetch(`/api/prd/${prdId}/sections`, { method: "POST" }).then(() => load());
  }, [prdId, load]);

  const updateSection = useCallback((updated: Section) => {
    setSections((prev) =>
      prev.map((s) => (s.sectionType === updated.sectionType ? updated : s))
    );
  }, []);

  const orderedSections = SECTION_ORDER.map((t) =>
    sections.find((s) => s.sectionType === t)
  ).filter(Boolean) as Section[];

  const doneCount = sections.filter((s) => s.status === "done").length;
  const total = sections.length || 18;
  const progress = Math.round((doneCount / total) * 100);

  async function generateAll() {
    setGeneratingAll(true);
    const pending = SECTION_ORDER.filter((t) => {
      const s = sections.find((sec) => sec.sectionType === t);
      return s?.status !== "done";
    });
    for (let i = 0; i < pending.length; i++) {
      const t = pending[i];
      setGeneratingAllStatus(
        `${SECTION_LABELS[t as keyof typeof SECTION_LABELS] ?? t} (${i + 1}/${pending.length})`
      );
      try {
        const res = await fetch(`/api/prd/${prdId}/sections/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionType: t }),
        });
        const data = await res.json();
        if (res.ok) updateSection(data);
      } catch {
        // continue to next section
      }
      // 3s delay between sections to avoid rate limit
      if (i < pending.length - 1) await new Promise((r) => setTimeout(r, 3000));
    }
    setGeneratingAllStatus("");
    const scoreRes = await fetch(`/api/prd/${prdId}/score`, { method: "POST" });
    if (scoreRes.ok) setQuality(await scoreRes.json());
    setGeneratingAll(false);
    load();
  }

  async function calcScore() {
    const res = await fetch(`/api/prd/${prdId}/score`, { method: "POST" });
    if (res.ok) setQuality(await res.json());
  }

  if (loading)
    return (
      <div className="flex items-center gap-2 p-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Memuat breakdown sections…
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Header + progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">PRD Breakdown — 18 Sections</h3>
          <p className="text-xs text-muted-foreground">
            {doneCount} dari {total} section selesai
          </p>
        </div>
        <div className="flex gap-2">
          {doneCount > 0 && (
            <Button size="sm" variant="outline" onClick={calcScore} className="text-xs">
              Hitung Score
            </Button>
          )}
          <Button size="sm" onClick={generateAll} disabled={generatingAll} className="text-xs max-w-[220px]">
            {generatingAll ? (
              <><Loader2 className="h-3 w-3 animate-spin shrink-0" />
              <span className="truncate">{generatingAllStatus || "Generating…"}</span></>
            ) : (
              <><Zap className="h-3 w-3 shrink-0" />Generate All</>
            )}
          </Button>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Quality Score */}
      {quality && (
        <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm">Quality Score</span>
            <span className="text-2xl font-bold text-indigo-700">
              {quality.total}
              <span className="text-sm text-gray-400">/100</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(QUALITY_WEIGHTS).map(([key, { label, weight }]) => {
              const score = quality.breakdown[key] ?? 0;
              return (
                <div key={key} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium">
                      {score}/{weight}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(score / weight) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Sections list */}
      <div className="space-y-2">
        {orderedSections.map((section) => (
          <SectionCard
            key={section.sectionType}
            section={section}
            prdId={prdId}
            onUpdate={updateSection}
          />
        ))}
      </div>
    </div>
  );
}
