"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Peserta { id: string; nama: string; kelas: string; inisial: string; email: string; }
interface AktDetail { id: string; nama: string; programNama: string; }
interface PesertaFeedback { catatan: string; catatanInternal: string; }

export default function UmpanBalikPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: a } = useQuery<AktDetail | null>({
    queryKey: ["aktivitas", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: peserta = [] } = useQuery<Peserta[]>({
    queryKey: ["aktivitas", id, "peserta"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/peserta`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
  });

  const [feedback, setFeedback] = useState<Record<string, PesertaFeedback>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [aiLoading, setAiLoading] = useState<"catatan" | "internal" | null>(null);

  const getFeedback = (pid: string): PesertaFeedback =>
    feedback[pid] ?? { catatan: "", catatanInternal: "" };

  const active = activeId ? peserta.find(p => p.id === activeId) : null;
  const activeFb = activeId ? getFeedback(activeId) : null;

  function updateFeedback(pid: string, field: keyof PesertaFeedback, value: string) {
    setFeedback(prev => ({ ...prev, [pid]: { ...getFeedback(pid), [field]: value } }));
  }

  async function generateAI(scope: "catatan" | "internal") {
    if (!active) return;
    setAiLoading(scope);
    try {
      const res = await fetch("/api/v1/ai/generate-catatan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pesertaNama: active.nama,
          aktivitasNama: a?.nama ?? "",
          programNama: a?.programNama ?? "",
          scope,
        }),
      });
      if (!res.ok) return;
      const json = await res.json();
      const field = scope === "catatan" ? "catatan" : "catatanInternal";
      updateFeedback(active.id, field, json.data[field === "catatan" ? "catatan" : "catatanInternal"]);
    } finally {
      // simulate AI "thinking" feel — min 1.2s
      await new Promise(r => setTimeout(r, 1200));
      setAiLoading(null);
    }
  }

  async function saveFeedback(pid: string) {
    const fb = getFeedback(pid);
    setLoading(true);
    try {
      await fetch(`/api/v1/aktivitas/${id}/umpan-balik`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ konten: fb.catatan, scope: "peserta", pesertaId: pid }),
      });
      setSavedIds(prev => new Set(prev).add(pid));
      setActiveId(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* App bar */}
      <div style={{
        background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)",
        padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center",
        gap: "var(--space-3)", flexShrink: 0, height: 56,
      }}>
        <button
          onClick={() => router.push(`/presensi?sheet=${id}`)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}
        >
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
          color: "var(--text-100)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          Umpan Balik & Catatan Internal
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {a && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-2)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.nama}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-300)" }}>{a.programNama ?? "Tanpa Program"}</p>
          </div>
        )}

        <div style={{ background: "var(--neutral-100)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-2)" }}>
          <p style={{ fontSize: 12, color: "var(--text-300)" }}>
            <strong style={{ fontFamily: "var(--font-display)", color: "var(--text-100)" }}>{savedIds.size}</strong> dari{" "}
            <strong style={{ fontFamily: "var(--font-display)", color: "var(--text-100)" }}>{peserta.length}</strong> peserta telah diisi umpan balik.
          </p>
        </div>

        <div style={{ background: "var(--neutral-100)", padding: "0 var(--space-4)" }}>
          {peserta.map(p => {
            const isSaved = savedIds.has(p.id);
            const fb = getFeedback(p.id);
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--neutral-500)" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: isSaved ? "#DCFCE7" : "var(--primary-100)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                  color: isSaved ? "#15803D" : "var(--primary-600)",
                }}>
                  {isSaved ? <Check size={16} strokeWidth={3} /> : p.inisial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.nama}
                  </p>
                  {isSaved && fb.catatan ? (
                    <p style={{ fontSize: 11, color: "var(--text-300)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fb.catatan}</p>
                  ) : (
                    <p style={{ fontSize: 11, color: "var(--text-300)" }}>{isSaved ? "Tersimpan" : "Belum ada umpan balik"}</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveId(p.id)}
                  style={{
                    padding: "6px 14px", borderRadius: "var(--radius-pill)",
                    border: `1px solid ${isSaved ? "var(--neutral-500)" : "var(--primary-600)"}`,
                    background: isSaved ? "transparent" : "var(--primary-100)",
                    color: isSaved ? "var(--text-300)" : "var(--primary-600)",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  {isSaved ? "Edit" : "Tambah"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {active && activeFb !== null && (
        <div className="modal-backdrop" onClick={() => setActiveId(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "90dvh", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-4)" }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-100)" }}>{active.nama}</p>
                <p style={{ fontSize: 12, color: "var(--text-300)" }}>{active.email}</p>
              </div>
              <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-300)" }}>
                <X size={20} />
              </button>
            </div>

            {/* Umpan Balik */}
            <div style={{ marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <label style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)" }}>
                  Umpan Balik untuk Peserta
                </label>
                <button
                  onClick={() => generateAI("catatan")}
                  disabled={aiLoading !== null}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: "var(--radius-pill)",
                    background: aiLoading === "catatan" ? "#f3f0ff" : "#ede9fe",
                    border: "1px solid #c4b5fd",
                    color: "#7c3aed",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
                    cursor: aiLoading !== null ? "not-allowed" : "pointer",
                    opacity: aiLoading !== null && aiLoading !== "catatan" ? 0.5 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  {aiLoading === "catatan" ? (
                    <>
                      <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #c4b5fd", borderTopColor: "#7c3aed", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      Generate AI
                    </>
                  )}
                </button>
              </div>
              <textarea
                className="input"
                placeholder="Tuliskan umpan balik untuk peserta ini, atau gunakan Generate AI sebagai titik awal..."
                rows={4}
                value={activeFb.catatan}
                onChange={e => updateFeedback(active.id, "catatan", e.target.value)}
                style={{ height: "auto", resize: "none", padding: "var(--space-3) var(--space-4)", lineHeight: 1.6, fontSize: 13 }}
              />
            </div>

            {/* Catatan Internal */}
            <div style={{ marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <label style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)" }}>
                  Catatan Internal
                </label>
                <button
                  onClick={() => generateAI("internal")}
                  disabled={aiLoading !== null}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: "var(--radius-pill)",
                    background: aiLoading === "internal" ? "#f3f0ff" : "#ede9fe",
                    border: "1px solid #c4b5fd",
                    color: "#7c3aed",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
                    cursor: aiLoading !== null ? "not-allowed" : "pointer",
                    opacity: aiLoading !== null && aiLoading !== "internal" ? 0.5 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  {aiLoading === "internal" ? (
                    <>
                      <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #c4b5fd", borderTopColor: "#7c3aed", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      Generate AI
                    </>
                  )}
                </button>
              </div>
              <div style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-md)", padding: "var(--space-2) var(--space-3)", marginBottom: "var(--space-2)", display: "flex", gap: "var(--space-2)" }}>
                <span style={{ fontSize: 13 }}>🔒</span>
                <p style={{ fontSize: 11, color: "var(--text-300)" }}>Hanya dapat dilihat oleh Expert dan Admin.</p>
              </div>
              <textarea
                className="input"
                placeholder="Catatan internal (tidak terlihat peserta)..."
                rows={3}
                value={activeFb.catatanInternal}
                onChange={e => updateFeedback(active.id, "catatanInternal", e.target.value)}
                style={{ height: "auto", resize: "none", padding: "var(--space-3) var(--space-4)", lineHeight: 1.6, fontSize: 13 }}
              />
            </div>

            {/* AI disclaimer */}
            <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "var(--radius-md)", padding: "var(--space-2) var(--space-3)", marginBottom: "var(--space-4)", display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
              <Sparkles size={13} color="#7c3aed" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 11, color: "#6d28d9", lineHeight: 1.5 }}>
                Teks dari AI adalah titik awal — pastikan diedit sesuai observasi nyata sebelum disimpan.
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => saveFeedback(active.id)}
              disabled={loading || (!activeFb.catatan.trim() && !activeFb.catatanInternal.trim())}
            >
              {loading ? <span className="spinner" /> : "Simpan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
