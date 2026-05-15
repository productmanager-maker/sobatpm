"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/prd/topbar";
import { PRDStepper } from "@/components/prd/stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Brain,
  Link as LinkIcon,
  FileText,
  AlertTriangle,
  Users,
  GitBranch,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PRD {
  id: string;
  title: string;
  currentStep: string;
  problem?: string;
  targetUser?: string;
  gdriveUrl?: string;
  gdriveTitle?: string;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink: string;
}

interface ContextAnalysis {
  coreRefs: { title: string; source: string; date: string; summary?: string }[];
  dependencies: { title: string; type: string; status: string }[];
  relatedInitiatives: { title: string; type: string; progress: number }[];
  risks: { title: string; severity: string; category: string }[];
  stakeholders: { name: string; role: string; impact: string }[];
}

const severityColor: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
};

export default function ContextPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prd, setPRD] = useState<PRD | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [analysis, setAnalysis] = useState<ContextAnalysis | null>(null);
  const [scanned, setScanned] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"connector" | "results">("connector");

  useEffect(() => {
    loadPRD();
  }, [id]);

  async function loadPRD() {
    try {
      const res = await fetch(`/api/prd/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPRD(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleScan() {
    if (!prd?.gdriveUrl) return;
    setScanning(true);
    setScanError(null);
    try {
      const prdContext = [
        prd.title && `Judul: ${prd.title}`,
        prd.problem && `Problem: ${prd.problem}`,
        prd.targetUser && `Target User: ${prd.targetUser}`,
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/gdrive/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driveUrl: prd.gdriveUrl, prdContext }),
      });

      const data = await res.json();
      if (!res.ok) {
        setScanError(data.error ?? "Gagal scan Google Drive");
        return;
      }

      setDriveFiles(data.files ?? []);
      setAnalysis(data.analysis ?? null);
      setScanned(true);
    } catch {
      setScanError("Gagal terhubung ke server");
    } finally {
      setScanning(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      await fetch(`/api/prd/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStep: "DRAFT_PRD" }),
      });

      const res = await fetch(`/api/prd/${id}/generate`, {
        method: "POST",
      });

      if (res.ok) {
        router.push(`/prd/${id}/draft`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  if (!prd) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-[#0519B0]" size={32} />
      </div>
    );
  }

  const hasGdrive = !!prd.gdriveUrl;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title={prd.title} />
      <PRDStepper currentStep={prd.currentStep} prdId={id} />

      {/* Mobile panel tabs */}
      <div className="md:hidden flex border-b border-slate-200 bg-white shrink-0">
        <button
          onClick={() => setMobilePanel("connector")}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            mobilePanel === "connector" ? "border-[#0519B0] text-[#000B8A] bg-[#F5F8FF]" : "border-transparent text-slate-500"
          }`}
        >
          Workspace
        </button>
        <button
          onClick={() => setMobilePanel("results")}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            mobilePanel === "results" ? "border-[#0519B0] text-[#000B8A] bg-[#F5F8FF]" : "border-transparent text-slate-500"
          }`}
        >
          Context Results
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className={`flex flex-col border-r border-slate-200 bg-white p-4 overflow-y-auto ${
          mobilePanel === "connector" ? "flex-1" : "hidden"
        } md:flex md:flex-none md:w-[35%]`}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
            Workspace Connector
          </h3>

          {/* GDrive Context */}
          {hasGdrive ? (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FolderOpen size={13} className="text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Google Drive terhubung</span>
              </div>
              <p className="text-xs text-blue-600 truncate">{prd.gdriveTitle || prd.gdriveUrl}</p>
              <a
                href={prd.gdriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 mt-1.5 text-xs text-blue-500 hover:underline"
              >
                <ExternalLink size={11} />
                Buka di Drive
              </a>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 font-medium">Belum ada Google Drive</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Tambahkan link Drive di step Coach untuk enable scan otomatis.
              </p>
            </div>
          )}

          {/* Scan Button */}
          <Button
            onClick={handleScan}
            disabled={scanning || !hasGdrive}
            variant="outline"
            className="mb-3 w-full"
          >
            {scanning ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Scanning Drive...
              </>
            ) : (
              <>
                <RefreshCw size={14} className="mr-2" />
                {scanned ? "Rescan Drive" : "Scan Google Drive"}
              </>
            )}
          </Button>

          {scanError && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{scanError}</p>
            </div>
          )}

          {/* Discovered Items */}
          {scanned && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-600">
                {driveFiles.length} file ditemukan
              </h4>

              {analysis && (
                <>
                  {[
                    { label: "Core References", count: analysis.coreRefs.length, icon: FileText },
                    { label: "Dependencies", count: analysis.dependencies.length, icon: GitBranch },
                    { label: "Related Initiatives", count: analysis.relatedInitiatives.length, icon: LinkIcon },
                    { label: "Risks", count: analysis.risks.length, icon: AlertTriangle },
                    { label: "Stakeholders", count: analysis.stakeholders.length, icon: Users },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={13} className="text-slate-400" />
                          <span className="text-xs text-slate-600">{item.label}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      </div>
                    );
                  })}
                </>
              )}

              <div className="p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 size={13} className="text-green-600" />
                <span className="text-xs text-green-700 font-medium">Context berhasil discan</span>
              </div>
            </div>
          )}

          {/* File list from Drive */}
          {scanned && driveFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                File di Drive
              </h4>
              <div className="space-y-1.5">
                {driveFiles.map((f) => (
                  <a
                    key={f.id}
                    href={f.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 group"
                  >
                    <FileText size={12} className="text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-600 truncate group-hover:text-[#0519B0]">
                      {f.name}
                    </span>
                    <ExternalLink size={10} className="text-slate-300 shrink-0 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto pt-5 space-y-2">
            <Button
              onClick={handleGenerate}
              disabled={generating || scanning}
              className="w-full bg-[#0519B0] hover:bg-[#000B8A] text-white"
            >
              {generating ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Generating PRD...
                </>
              ) : (
                <>
                  <ArrowRight size={14} className="mr-2" />
                  Continue to generate
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-500"
              onClick={() => router.push(`/prd/${id}/coach`)}
            >
              <ArrowLeft size={13} className="mr-1.5" />
              Back to coach
            </Button>
          </div>
        </div>

        {/* RIGHT PANEL - Context Results */}
        <div className={`p-4 overflow-y-auto bg-slate-50 ${
          mobilePanel === "results" ? "flex-1" : "hidden"
        } md:flex-1 md:block`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Context Results
            </h3>
            <Badge className="bg-[#0519B0] text-white text-xs gap-1.5">
              <Brain size={11} />
              Sobat PM Intelligence
            </Badge>
          </div>

          {!scanned ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Brain size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium mb-1">Belum ada hasil scan</p>
              <p className="text-slate-400 text-sm">
                {hasGdrive
                  ? 'Klik "Scan Google Drive" untuk menganalisis dokumen PRD kamu'
                  : "Tambahkan link Google Drive di step Coach terlebih dahulu"}
              </p>
            </div>
          ) : !analysis ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                <FileText size={28} className="text-amber-300" />
              </div>
              <p className="text-slate-500 font-medium mb-1">File ditemukan tapi tidak bisa dianalisis</p>
              <p className="text-slate-400 text-sm">
                Pastikan ada Google Doc atau file teks di folder Drive yang di-share.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {driveFiles.length} file terdeteksi: {driveFiles.map((f) => f.name).join(", ")}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Intelligence Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "References", count: analysis.coreRefs.length, color: "bg-[#E6EAF8] text-[#000B8A]" },
                  { label: "Dependencies", count: analysis.dependencies.length, color: "bg-blue-100 text-blue-700" },
                  { label: "Risks", count: analysis.risks.length, color: "bg-red-100 text-red-700" },
                  { label: "Stakeholders", count: analysis.stakeholders.length, color: "bg-purple-100 text-purple-700" },
                ].map((badge) => (
                  <div key={badge.label} className={cn("p-3 rounded-xl text-center", badge.color)}>
                    <p className="text-2xl font-bold">{badge.count}</p>
                    <p className="text-xs font-medium mt-0.5">{badge.label}</p>
                  </div>
                ))}
              </div>

              {/* Core References */}
              {analysis.coreRefs.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <FileText size={14} className="text-slate-400" />
                    Core References
                  </h4>
                  <div className="space-y-2">
                    {analysis.coreRefs.map((ref, i) => (
                      <div key={i} className="flex items-start justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <div className="flex-1 mr-2">
                          <p className="text-sm text-slate-700">{ref.title}</p>
                          {ref.summary && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{ref.summary}</p>
                          )}
                          <p className="text-xs text-slate-400">{ref.source} · {ref.date}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">{ref.source}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Dependencies */}
              {analysis.dependencies.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <GitBranch size={14} className="text-slate-400" />
                    Dependencies
                  </h4>
                  <div className="space-y-2">
                    {analysis.dependencies.map((dep, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-sm text-slate-700">{dep.title}</p>
                          <p className="text-xs text-slate-400">{dep.type}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            dep.status === "Ready"
                              ? "text-green-600 border-green-200 bg-green-50"
                              : dep.status === "Needed"
                              ? "text-yellow-600 border-yellow-200 bg-yellow-50"
                              : "text-slate-500 border-slate-200"
                          )}
                        >
                          {dep.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Related Initiatives */}
              {analysis.relatedInitiatives.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <LinkIcon size={14} className="text-slate-400" />
                    Related Initiatives
                  </h4>
                  <div className="space-y-3">
                    {analysis.relatedInitiatives.map((init, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-slate-700">{init.title}</p>
                          <Badge variant="outline" className="text-xs">{init.type}</Badge>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, init.progress))}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{init.progress}% progress</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Risks */}
              {analysis.risks.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-slate-400" />
                    Risks
                  </h4>
                  <div className="space-y-2">
                    {analysis.risks.map((risk, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-sm text-slate-700">{risk.title}</p>
                          <p className="text-xs text-slate-400">{risk.category}</p>
                        </div>
                        <Badge variant="outline" className={cn("text-xs", severityColor[risk.severity] ?? "")}>
                          {risk.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Stakeholders */}
              {analysis.stakeholders.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <Users size={14} className="text-slate-400" />
                    Stakeholders
                  </h4>
                  <div className="space-y-2">
                    {analysis.stakeholders.map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-sm text-slate-700">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.role}</p>
                        </div>
                        <Badge variant="outline" className={cn("text-xs", severityColor[s.impact] ?? "")}>
                          {s.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
