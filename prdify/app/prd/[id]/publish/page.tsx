"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/prd/topbar";
import { PRDStepper } from "@/components/prd/stepper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Loader2,
  Globe,
  ArrowLeft,
  Star,
  FileText,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PRD {
  id: string;
  title: string;
  status: string;
  currentStep: string;
  quality?: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  problem?: string;
  targetUser?: string;
  whyNow?: string;
  desiredOutcome?: string;
  evidence?: string;
  inScope: string[];
  outOfScope: string[];
  dependencies?: string;
  risks?: string;
}

const criteriaChecks = [
  { label: "Problem statement jelas dan terukur", key: "problem" },
  { label: "Target user terdefinisi dengan baik", key: "targetUser" },
  { label: "Alasan timing (Why Now) terjustifikasi", key: "whyNow" },
  { label: "Desired outcome SMART", key: "desiredOutcome" },
  { label: "Evidence/data pendukung ada", key: "evidence" },
  { label: "Scope in/out scope terdefinisi", key: "inScope" },
  { label: "Dependencies teridentifikasi", key: "dependencies" },
  { label: "Risks telah dipertimbangkan", key: "risks" },
];

export default function PublishPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prd, setPRD] = useState<PRD | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

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
        if (data.status === "PUBLISHED") setPublished(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const res = await fetch(`/api/prd/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PUBLISHED",
          currentStep: "PUBLISH",
          quality: prd?.quality || 82,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPRD(data);
        setPublished(true);
      }
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-[#0519B0]" size={32} />
      </div>
    );
  }

  if (!prd) return null;

  const filledCriteria = criteriaChecks.filter((c) => {
    const val = prd[c.key as keyof PRD];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  });

  const qualityScore = prd.quality || Math.round((filledCriteria.length / criteriaChecks.length) * 100);

  const qualityColor =
    qualityScore >= 85
      ? "text-green-600"
      : qualityScore >= 70
      ? "text-yellow-600"
      : "text-red-500";

  const qualityLabel =
    qualityScore >= 85
      ? "Excellent"
      : qualityScore >= 70
      ? "Good"
      : "Needs Improvement";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title={prd.title} />

      {/* Stepper */}
      <PRDStepper currentStep={prd.currentStep} prdId={id} />

      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Published Success Banner */}
          {published && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-start gap-3 flex-wrap">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-green-800 mb-0.5">PRD berhasil dipublish!</h3>
                <p className="text-sm text-green-700">
                  PRD &quot;{prd.title}&quot; sudah tersedia secara global untuk tim.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto border-green-300 text-green-700 hover:bg-green-100 shrink-0"
                onClick={() => router.push("/prd")}
              >
                Lihat Dashboard
              </Button>
            </div>
          )}

          {/* Quality Score Card */}
          <Card className="p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">PRD Quality Review</h2>
              <Badge
                className={cn(
                  "text-sm px-3 py-1",
                  published ? "bg-green-600 text-white" : "bg-teal-100 text-teal-700 border-teal-200 border"
                )}
              >
                {published ? "Published" : "Generated"}
              </Badge>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              {/* Quality Donut */}
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke={qualityScore >= 85 ? "#16a34a" : qualityScore >= 70 ? "#ca8a04" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={`${(qualityScore / 100) * 301.6} 301.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn("text-3xl font-bold", qualityColor)}>{qualityScore}</span>
                  <span className="text-xs text-slate-400 font-medium">/100</span>
                </div>
              </div>

              <div>
                <div className={cn("text-xl font-bold mb-1", qualityColor)}>{qualityLabel}</div>
                <p className="text-sm text-slate-500 mb-3">
                  {filledCriteria.length}/{criteriaChecks.length} kriteria terpenuhi
                </p>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <Star size={13} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-slate-600">Quality Assurance</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Criteria Checklist */}
          <Card className="p-5 mb-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-slate-400" />
              Publish Criteria
            </h3>
            <div className="space-y-2">
              {criteriaChecks.map((criterion) => {
                const val = prd[criterion.key as keyof PRD];
                const isPassed = Array.isArray(val) ? val.length > 0 : !!val;
                return (
                  <div
                    key={criterion.key}
                    className="flex items-center gap-3 py-1.5"
                  >
                    <CheckCircle2
                      size={16}
                      className={isPassed ? "text-green-500" : "text-slate-200"}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        isPassed ? "text-slate-700" : "text-slate-400"
                      )}
                    >
                      {criterion.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* PRD Info */}
          <Card className="p-5 mb-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Users size={14} className="text-slate-400" />
              Document Info
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Author", value: prd.author },
                { label: "Status", value: prd.status },
                { label: "Created", value: new Date(prd.createdAt).toLocaleDateString("id-ID") },
                { label: "Last Updated", value: new Date(prd.updatedAt).toLocaleDateString("id-ID") },
              ].map((info) => (
                <div key={info.label} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-0.5">{info.label}</p>
                  <p className="text-sm font-medium text-slate-700">{info.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/prd/${id}/draft`)}
            >
              <ArrowLeft size={14} className="mr-1.5" />
              Back to Draft
            </Button>

            {!published ? (
              <Button
                className="bg-[#0519B0] hover:bg-[#000B8A] text-white px-6"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? (
                  <Loader2 size={15} className="animate-spin mr-2" />
                ) : (
                  <Globe size={15} className="mr-2" />
                )}
                Publish PRD
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/prd")}
              >
                <CheckCircle2 size={14} className="mr-2 text-green-500" />
                Kembali ke Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
