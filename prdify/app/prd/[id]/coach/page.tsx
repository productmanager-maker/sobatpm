"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/prd/topbar";
import { PRDStepper } from "@/components/prd/stepper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SectionsBreakdown } from "@/components/prd/sections-breakdown";
import {
  Send,
  CheckCircle2,
  ExternalLink,
  Plus,
  X,
  ArrowRight,
  Loader2,
  Bot,
  User,
  Sparkles,
  LayoutList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface PRD {
  id: string;
  title: string;
  status: string;
  currentStep: string;
  problem?: string;
  targetUser?: string;
  whyNow?: string;
  desiredOutcome?: string;
  evidence?: string;
  inScope: string[];
  outOfScope: string[];
  dependencies?: string;
  risks?: string;
  gdriveUrl?: string;
  gdriveFileId?: string;
  gdriveTitle?: string;
  uploadedFile?: string;
  briefExtracted?: boolean;
}

interface BriefField {
  key: keyof PRD;
  label: string;
  placeholder: string;
  multiline?: boolean;
  isList?: boolean;
}

const briefFields: BriefField[] = [
  { key: "problem", label: "Problem", placeholder: "Apa masalah yang ingin diselesaikan?", multiline: true },
  { key: "targetUser", label: "Target User", placeholder: "Siapa yang paling terdampak?", multiline: true },
  { key: "whyNow", label: "Why Now", placeholder: "Kenapa ini penting sekarang?", multiline: true },
  { key: "desiredOutcome", label: "Desired Outcome", placeholder: "Apa outcome yang diharapkan?", multiline: true },
  { key: "evidence", label: "Evidence", placeholder: "Data atau bukti pendukung?", multiline: true },
  { key: "inScope", label: "In Scope", placeholder: "Tambah item...", isList: true },
  { key: "outOfScope", label: "Out of Scope", placeholder: "Tambah item...", isList: true },
  { key: "dependencies", label: "Dependencies", placeholder: "Dependensi apa yang ada?", multiline: true },
  { key: "risks", label: "Risks", placeholder: "Risiko apa yang mungkin terjadi?", multiline: true },
];

export default function CoachPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prd, setPRD] = useState<PRD | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listInputs, setListInputs] = useState<Record<string, string>>({
    inScope: "",
    outOfScope: "",
  });
  const [generating, setGenerating] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [rightTab, setRightTab] = useState("coach");
  const [mobilePanel, setMobilePanel] = useState<"brief" | "chat">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPRD();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadPRD() {
    try {
      const res = await fetch(`/api/prd/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPRD(data);
        setMessages(data.messages || []);

        // If no messages yet, trigger initial coach message
        if ((data.messages || []).length === 0) {
          triggerInitialMessage(data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function triggerInitialMessage(prdData: PRD) {
    const greeting = prdData.gdriveUrl
      ? `Halo! Saya lihat kamu sudah menghubungkan dokumen Google Drive sebagai context. Mari kita mulai coaching PRD "${prdData.title}". Ceritakan lebih detail tentang problem yang ingin kamu selesaikan!`
      : `Halo! Selamat datang di Sobat PM Coach. Mari kita bangun PRD "${prdData.title}" bersama. Untuk memulai, ceritakan: **Apa problem utama yang ingin kamu selesaikan?** Jelaskan sebisa mungkin dalam konteks user dan bisnis SID/Sekolah.mu.`;

    try {
      const res = await fetch(`/api/prd/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "assistant", content: greeting }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages([msg]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage() {
    if (!input.trim() || sending) return;

    const userMsg = input;
    setInput("");
    setSending(true);

    // Optimistically add user message
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMsg,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/prd/${id}/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        // Replace temp msg + add assistant msg
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempMsg.id),
          { id: `user-${Date.now()}`, role: "user", content: userMsg, createdAt: new Date().toISOString() },
          data.message,
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  async function saveBriefField(field: string, value: string | string[]) {
    if (!prd) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/prd/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPRD((prev) => (prev ? { ...prev, ...updated } : updated));
      }
    } finally {
      setSaving(false);
    }
  }

  function addListItem(field: "inScope" | "outOfScope") {
    const val = listInputs[field]?.trim();
    if (!val || !prd) return;
    const newList = [...(prd[field] as string[]), val];
    setPRD((prev) => (prev ? { ...prev, [field]: newList } : prev));
    saveBriefField(field, newList);
    setListInputs((prev) => ({ ...prev, [field]: "" }));
  }

  function removeListItem(field: "inScope" | "outOfScope", index: number) {
    if (!prd) return;
    const newList = (prd[field] as string[]).filter((_, i) => i !== index);
    setPRD((prev) => (prev ? { ...prev, [field]: newList } : prev));
    saveBriefField(field, newList);
  }

  async function proceedToContext() {
    setGenerating(true);
    try {
      await fetch(`/api/prd/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStep: "CONTEXT_SCAN" }),
      });
      router.push(`/prd/${id}/context`);
    } finally {
      setGenerating(false);
    }
  }

  async function extractBrief() {
    if (!prd) return;
    setExtracting(true);
    try {
      const rawContext = prd.gdriveUrl
        ? `Google Drive document URL: ${prd.gdriveUrl}\nTitle: ${prd.gdriveTitle || prd.title}\nPlease extract a structured brief from this document context.`
        : `Uploaded file: ${prd.uploadedFile}\nTitle: ${prd.title}`;

      const res = await fetch(`/api/prd/${id}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawContext }),
      });

      if (res.ok) {
        // Reload PRD to get updated fields
        const prdRes = await fetch(`/api/prd/${id}`);
        if (prdRes.ok) {
          const updated = await prdRes.json();
          setPRD(updated);
        }
        // Auto-switch to breakdown after extraction
        setRightTab("breakdown");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExtracting(false);
    }
  }

  const filledFields = briefFields.filter((f) => {
    if (f.isList) return (prd?.[f.key] as string[])?.length > 0;
    return !!(prd?.[f.key] as string);
  }).length;
  const readiness = Math.round((filledFields / briefFields.length) * 100);

  const hasContext = !!(prd?.gdriveUrl || prd?.uploadedFile);

  if (!prd) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-[#0519B0]" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title={prd.title} />

      {/* Stepper + Continue button */}
      <div className="bg-white border-b border-slate-200">
        <div className="relative">
          <PRDStepper currentStep={prd.currentStep} prdId={id} />
          <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2">
            <Button
              onClick={proceedToContext}
              disabled={generating}
              size="sm"
              className="bg-[#0519B0] hover:bg-[#000B8A] text-white"
            >
              {generating ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Continue to Context
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
        {/* Mobile continue button */}
        <div className="md:hidden px-4 pb-3">
          <Button
            onClick={proceedToContext}
            disabled={generating}
            size="sm"
            className="w-full bg-[#0519B0] hover:bg-[#000B8A] text-white"
          >
            {generating ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
            Continue to Context
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Mobile panel tab bar */}
      <div className="md:hidden flex border-b border-slate-200 bg-white shrink-0">
        <button
          onClick={() => setMobilePanel("brief")}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            mobilePanel === "brief"
              ? "border-[#0519B0] text-[#000B8A] bg-[#F5F8FF]"
              : "border-transparent text-slate-500"
          }`}
        >
          Brief Form
        </button>
        <button
          onClick={() => setMobilePanel("chat")}
          className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            mobilePanel === "chat"
              ? "border-[#0519B0] text-[#000B8A] bg-[#F5F8FF]"
              : "border-transparent text-slate-500"
          }`}
        >
          Coach Chat
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Brief Form */}
        <div className={`flex flex-col border-r border-slate-200 bg-white overflow-hidden ${
          mobilePanel === "brief" ? "flex-1" : "hidden"
        } md:flex md:flex-none md:w-[40%]`}>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <Tabs defaultValue="readiness" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="readiness" className="flex-1 text-xs">
                  Readiness ({readiness}%)
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex-1 text-xs">
                  Summary
                </TabsTrigger>
              </TabsList>

              {/* Readiness Tab - Brief Form */}
              <TabsContent value="readiness" className="mt-3">
                {saving && (
                  <div className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                    <Loader2 size={10} className="animate-spin" /> Menyimpan...
                  </div>
                )}

                <div className="space-y-3 overflow-y-auto max-h-[calc(100dvh-280px)] pr-1">
                  {/* GDrive Context */}
                  {prd.gdriveUrl && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={13} className="text-green-600" />
                        <span className="text-xs font-medium text-green-700">Context is up to date</span>
                      </div>
                      <a
                        href={prd.gdriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-green-600 hover:underline"
                      >
                        <ExternalLink size={10} />
                        {prd.gdriveTitle || "View GDrive document"}
                      </a>
                    </div>
                  )}

                  {/* Extract Brief Button */}
                  {hasContext && !prd.briefExtracted && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-700 mb-2 font-medium">
                        Brief belum diekstrak dari dokumen
                      </p>
                      <Button
                        size="sm"
                        onClick={extractBrief}
                        disabled={extracting}
                        className="w-full text-xs bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {extracting ? (
                          <Loader2 size={12} className="animate-spin mr-1.5" />
                        ) : (
                          <Sparkles size={12} className="mr-1.5" />
                        )}
                        {extracting ? "Mengekstrak brief..." : "Ekstrak Brief dari Dokumen"}
                      </Button>
                    </div>
                  )}

                  {prd.briefExtracted && (
                    <div className="p-2 bg-[#E6EAF8] border border-[#C2CDF1] rounded-lg flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#0519B0] shrink-0" />
                      <span className="text-xs text-[#000B8A] font-medium">Brief berhasil diekstrak</span>
                    </div>
                  )}

                  {briefFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        {field.label}
                        {field.isList
                          ? (prd[field.key] as string[]).length > 0 && (
                              <CheckCircle2 size={11} className="text-green-500" />
                            )
                          : prd[field.key] && (
                              <CheckCircle2 size={11} className="text-green-500" />
                            )}
                      </label>

                      {field.isList ? (
                        <div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {(prd[field.key] as string[]).map((item, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs gap-1 pr-1"
                              >
                                {item}
                                <button
                                  onClick={() =>
                                    removeListItem(field.key as "inScope" | "outOfScope", i)
                                  }
                                  className="hover:text-red-500"
                                >
                                  <X size={10} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-1">
                            <Input
                              placeholder={field.placeholder}
                              value={listInputs[field.key as string] || ""}
                              onChange={(e) =>
                                setListInputs((prev) => ({
                                  ...prev,
                                  [field.key]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  addListItem(field.key as "inScope" | "outOfScope");
                              }}
                              className="h-7 text-xs"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                              onClick={() =>
                                addListItem(field.key as "inScope" | "outOfScope")
                              }
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Textarea
                          placeholder={field.placeholder}
                          value={(prd[field.key] as string) || ""}
                          onChange={(e) =>
                            setPRD((prev) =>
                              prev ? { ...prev, [field.key]: e.target.value } : prev
                            )
                          }
                          onBlur={(e) => saveBriefField(field.key as string, e.target.value)}
                          className="text-xs min-h-[60px] resize-none"
                          rows={2}
                        />
                      )}
                    </div>
                  ))}

                  <Separator />

                  {/* View Context Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => router.push(`/prd/${id}/context`)}
                  >
                    <ExternalLink size={12} className="mr-1.5" />
                    View context
                  </Button>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="mt-3">
                <div className="space-y-3 overflow-y-auto max-h-[calc(100dvh-280px)]">
                  <div className="p-3 bg-[#E6EAF8] rounded-lg">
                    <p className="text-xs font-semibold text-[#000B8A] mb-1">PRD Readiness</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#C2CDF1] rounded-full">
                        <div
                          className="h-full bg-[#0519B0] rounded-full transition-all"
                          style={{ width: `${readiness}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#000B8A]">{readiness}%</span>
                    </div>
                    <p className="text-xs text-[#0519B0] mt-1">
                      {filledFields}/{briefFields.length} fields completed
                    </p>
                  </div>

                  {briefFields.map((field) => {
                    const value = prd[field.key];
                    const isEmpty = field.isList
                      ? (value as string[]).length === 0
                      : !value;
                    return (
                      <div
                        key={field.key}
                        className={cn(
                          "p-2 rounded",
                          isEmpty ? "bg-slate-50" : "bg-white border border-slate-200"
                        )}
                      >
                        <p className="text-xs font-semibold text-slate-500 mb-0.5">
                          {field.label}
                        </p>
                        {isEmpty ? (
                          <p className="text-xs text-slate-300 italic">Belum diisi</p>
                        ) : field.isList ? (
                          <div className="flex flex-wrap gap-1">
                            {(value as string[]).map((item, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-600 line-clamp-3">
                            {value as string}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* RIGHT PANEL - Coach Chat + PRD Breakdown tabs */}
        <div className={`flex flex-col bg-slate-50 overflow-hidden ${
          mobilePanel === "chat" ? "flex-1" : "hidden"
        } md:flex md:flex-1`}>
          {/* Right Panel Tab Header */}
          <div className="bg-white border-b border-slate-200 px-4 pt-3">
            <div className="flex gap-1">
              <button
                onClick={() => setRightTab("coach")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t border-b-2 transition-colors",
                  rightTab === "coach"
                    ? "border-[#0519B0] text-[#000B8A] bg-[#E6EAF8]"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <Bot size={13} />
                Coach Chat
              </button>
              <button
                onClick={() => setRightTab("breakdown")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t border-b-2 transition-colors",
                  rightTab === "breakdown"
                    ? "border-[#0519B0] text-[#000B8A] bg-[#E6EAF8]"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <LayoutList size={13} />
                PRD Breakdown
              </button>
            </div>
          </div>

          {/* Coach Chat Panel */}
          {rightTab === "coach" && (
            <>
              {/* Coach Header */}
              <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0519B0] rounded-lg flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 tracking-widest uppercase">
                    Sobat PM Coach
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                    Active
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        msg.role === "user" ? "bg-[#0519B0]" : "bg-slate-700"
                      )}
                    >
                      {msg.role === "user" ? (
                        <User size={13} className="text-white" />
                      ) : (
                        <Bot size={13} className="text-white" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-[#0519B0] text-white rounded-tr-sm"
                          : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                      )}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                          {line}
                        </p>
                      ))}
                      <p
                        className={cn(
                          "text-[10px] mt-1.5",
                          msg.role === "user" ? "text-indigo-200" : "text-slate-400"
                        )}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      <Bot size={13} className="text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-200 prd-chat-input-wrap">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Tulis pesan ke Coach..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 min-h-[44px] max-h-32 resize-none text-sm"
                    rows={1}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="bg-[#0519B0] hover:bg-[#000B8A] text-white h-auto px-4"
                  >
                    <Send size={16} />
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Enter untuk kirim · Shift+Enter untuk baris baru
                </p>
              </div>
            </>
          )}

          {/* PRD Breakdown Panel */}
          {rightTab === "breakdown" && (
            <div className="flex-1 overflow-y-auto p-5">
              <SectionsBreakdown prdId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
