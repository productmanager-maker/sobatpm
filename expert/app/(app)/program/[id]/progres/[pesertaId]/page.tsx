"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PROGRAMS, PROGRES_LIST, PESERTA_LIST } from "@/lib/mock-data";

export default function ProgresDetailPage({ params }: { params: Promise<{ id: string; pesertaId: string }> }) {
  const { id, pesertaId } = use(params);
  const router = useRouter();

  const p = PROGRAMS.find(x => x.id === id);
  const data = PROGRES_LIST.find(x => x.programId === id);
  const pe = data?.peserta.find(x => x.pesertaId === pesertaId);
  const peserta = PESERTA_LIST.find(x => x.id === pesertaId);

  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  if (!pe) return <div style={{ padding: 24 }}>Data progres tidak ditemukan.</div>;

  const needsAttention = pe.persentase < 50;

  const pct = pe.persentase;
  const barColor = pct >= 80 ? "var(--primary-600)" : pct >= 50 ? "#E0B547" : "var(--danger-600)";
  const cardBg  = pct >= 80 ? "var(--primary-100)" : pct >= 50 ? "#FFF4D6" : "var(--danger-100)";
  const cardBorder = pct >= 80 ? "var(--primary-300)" : pct >= 50 ? "#E0B547" : "var(--danger-200)";
  const labelColor = pct >= 80 ? "var(--primary-700, var(--primary-600))" : pct >= 50 ? "#8a5b00" : "#780034";
  const pctColor  = pct >= 80 ? "var(--primary-600)" : pct >= 50 ? "#c97a24" : "var(--danger-600)";

  const avatarStyle: React.CSSProperties = pct >= 80
    ? { background: "var(--primary-100)", color: "var(--primary-700, var(--primary-600))" }
    : pct >= 50
    ? { background: "#FFF4D6", color: "#8a5b00" }
    : { background: "#FFE6EA", color: "#C40048" };

  const initials = pe.pesertaNama.split(" ").slice(0, 2).map(w => w[0]).join("");

  async function handleSaveNote() {
    await new Promise(r => setTimeout(r, 500));
    setNoteSaved(true);
    setShowNote(false);
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
          {pe.pesertaNama.split(" ")[0]} — Progres
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {/* Peserta header */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
            ...avatarStyle,
          }}>
            {initials}
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)", marginBottom: 2 }}>
              {pe.pesertaNama}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-300)", marginBottom: 6 }}>
              {p?.nama ?? "Program"} · {peserta?.email ?? ""}
            </p>
            {needsAttention && (
              <span style={{
                display: "inline-block", padding: "3px 10px", borderRadius: 100,
                background: "#FFF4D6", color: "#6B4F00",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
              }}>
                Perlu perhatian
              </span>
            )}
          </div>
        </div>

        {/* Progress card */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 10, padding: "var(--space-3) var(--space-4)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Penyelesaian
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: pctColor, marginBottom: 4 }}>
            {pct}%
          </p>
          <div style={{ height: 6, background: "rgba(0,0,0,0.1)", borderRadius: 100, marginBottom: 6 }}>
            <div style={{ height: "100%", borderRadius: 100, background: barColor, width: `${pct}%` }} />
          </div>
          <p style={{ fontSize: 12, color: labelColor }}>
            dari {p?.jumlahAktivitas ?? "—"} aktivitas dalam program
          </p>
        </div>

        {/* Aktivitas terakhir */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-2)" }}>
            Aktivitas Terakhir
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {pe.aktivitasTerakhir.map((a, i) => (
              <div key={i} style={{
                background: "var(--neutral-200)", border: "1px solid var(--neutral-500)",
                borderRadius: 10, padding: "var(--space-3) var(--space-4)",
              }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2 }}>{a.judul}</p>
                <p style={{
                  fontSize: 11, color: a.warnaKet === "danger" ? "var(--danger-600)" : a.warnaKet === "warning" ? "#c97a24" : "var(--text-300)",
                }}>
                  {a.keterangan}
                </p>
              </div>
            ))}
          </div>
        </div>

        {noteSaved && (
          <div style={{ background: "#E1F5E6", border: "1px solid #86efac", borderRadius: 8, padding: "var(--space-3) var(--space-4)" }}>
            <p style={{ fontSize: 13, color: "#1B6B2D", fontWeight: 600 }}>Catatan berhasil disimpan.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--neutral-100)", borderTop: "1px solid var(--neutral-500)", flexShrink: 0 }}>
        <button className="btn btn-primary" onClick={() => setShowNote(true)}>
          Buat Catatan untuk Peserta
        </button>
      </div>

      {/* Note bottom sheet */}
      {showNote && (
        <div className="modal-backdrop" onClick={() => setShowNote(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "70dvh" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-4)" }} />
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: "var(--space-1)" }}>
              Catatan untuk {pe.pesertaNama.split(" ")[0]}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-300)", marginBottom: "var(--space-3)" }}>
              Catatan ini hanya dapat dilihat oleh Expert dan Admin.
            </p>
            <textarea
              className="input"
              placeholder="Tulis catatan..."
              rows={5}
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{ height: "auto", resize: "none", padding: "var(--space-3)", lineHeight: 1.6, marginBottom: "var(--space-3)" }}
            />
            <button
              className="btn btn-primary"
              disabled={!note.trim()}
              onClick={handleSaveNote}
            >
              Simpan Catatan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
