"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X } from "lucide-react";
import { AKTIVITAS_LIST, PESERTA_LIST } from "@/lib/mock-data";

interface PesertaFeedback {
  catatan: string;
  catatanInternal: string;
}

export default function UmpanBalikPenilaianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const a = AKTIVITAS_LIST.find(x => x.id === id);
  const peserta = a ? PESERTA_LIST.slice(0, a.jumlahPeserta) : PESERTA_LIST;

  const [feedback, setFeedback] = useState<Record<string, PesertaFeedback>>(() =>
    Object.fromEntries(peserta.map(p => [p.id, { catatan: "", catatanInternal: "" }]))
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const active = activeId ? peserta.find(p => p.id === activeId) : null;
  const activeFb = activeId ? feedback[activeId] : null;

  function updateFeedback(pid: string, field: keyof PesertaFeedback, value: string) {
    setFeedback(prev => ({ ...prev, [pid]: { ...prev[pid], [field]: value } }));
  }

  async function saveFeedback(pid: string) {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setSavedIds(prev => new Set(prev).add(pid));
    setActiveId(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* App bar */}
      <div style={{
        background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)",
        padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center",
        gap: "var(--space-3)", flexShrink: 0, height: 56,
      }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Umpan Balik &amp; Catatan Internal
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {a && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-2)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.judul}
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
            const fb = feedback[p.id];
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--neutral-500)" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: isSaved ? "#DCFCE7" : "var(--primary-100)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                  color: isSaved ? "#15803D" : "var(--primary-600)",
                }}>
                  {isSaved ? <Check size={16} strokeWidth={3} /> : p.nama.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.nama}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-300)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {isSaved && fb.catatan ? fb.catatan : isSaved ? "Tersimpan" : "Belum ada umpan balik"}
                  </p>
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
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "85dvh", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-4)" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{active.nama}</p>
                <p style={{ fontSize: 12, color: "var(--text-300)" }}>{active.email}</p>
              </div>
              <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-300)" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: "var(--space-2)" }}>
                Umpan Balik untuk Peserta
              </label>
              <textarea className="input" placeholder="Tulis umpan balik..." rows={4} value={activeFb.catatan} onChange={e => updateFeedback(active.id, "catatan", e.target.value)} style={{ height: "auto", resize: "none", padding: "var(--space-3)", lineHeight: 1.6, fontSize: 13 }} />
            </div>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: "var(--space-2)" }}>
                Catatan Internal
              </label>
              <div style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-md)", padding: "var(--space-2) var(--space-3)", marginBottom: "var(--space-2)", display: "flex", gap: "var(--space-2)" }}>
                <span style={{ fontSize: 13 }}>🔒</span>
                <p style={{ fontSize: 11, color: "var(--text-300)" }}>Hanya dapat dilihat oleh Expert dan Admin.</p>
              </div>
              <textarea className="input" placeholder="Catatan internal..." rows={3} value={activeFb.catatanInternal} onChange={e => updateFeedback(active.id, "catatanInternal", e.target.value)} style={{ height: "auto", resize: "none", padding: "var(--space-3)", lineHeight: 1.6, fontSize: 13 }} />
            </div>
            <button className="btn btn-primary" onClick={() => saveFeedback(active.id)} disabled={loading || (!activeFb.catatan.trim() && !activeFb.catatanInternal.trim())}>
              {loading ? <span className="spinner" /> : "Simpan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
