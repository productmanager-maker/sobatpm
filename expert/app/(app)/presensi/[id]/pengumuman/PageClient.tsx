"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Plus, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PengumumanItem {
  id: string; judul: string; isi: string; createdAt: string; penulis: string;
}
interface AktDetail { id: string; nama: string; programNama: string; }

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function PengumumanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: a } = useQuery<AktDetail | null>({
    queryKey: ["aktivitas", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: pengumuman = [], isLoading } = useQuery<PengumumanItem[]>({
    queryKey: ["pengumuman", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/pengumuman`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
  });

  async function handleSubmit() {
    if (!judul.trim() || !isi.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/v1/aktivitas/${id}/pengumuman`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul: judul.trim(), isi: isi.trim() }),
      });
      qc.invalidateQueries({ queryKey: ["pengumuman", id] });
      setJudul("");
      setIsi("");
      setShowForm(false);
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
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
        >
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)", flex: 1 }}>
          Pengumuman
        </p>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 14px", borderRadius: 100,
            background: "var(--primary-600)", color: "white",
            border: "none", cursor: "pointer",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
          }}
        >
          <Plus size={14} />
          Buat
        </button>
      </div>

      {/* Activity label */}
      {a && (
        <div style={{ background: "var(--neutral-200)", padding: "var(--space-2) var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
          <p style={{ fontSize: 12, color: "var(--text-300)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.nama}
          </p>
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", color: "var(--text-300)", padding: "var(--space-6)" }}>Memuat...</div>
        ) : pengumuman.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "var(--space-10) var(--space-4)", gap: "var(--space-4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={28} color="var(--primary-600)" />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-100)", marginBottom: 6 }}>
                Belum ada pengumuman
              </p>
              <p style={{ fontSize: 13, color: "var(--text-300)", lineHeight: 1.5 }}>
                Buat pengumuman untuk memberikan informasi penting kepada peserta.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
              style={{ width: "100%" }}
            >
              Buat Pengumuman Pertama
            </button>
          </div>
        ) : pengumuman.map(pg => (
          <div key={pg.id} style={{
            background: "var(--neutral-100)", border: "1px solid var(--neutral-500)",
            borderRadius: "var(--radius-xl)", padding: "var(--space-4)",
            display: "flex", gap: "var(--space-3)",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "var(--radius-md)",
              background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Bell size={18} color="var(--primary-600)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: 4, lineHeight: 1.4 }}>
                {pg.judul}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-200)", lineHeight: 1.6, marginBottom: 8 }}>
                {pg.isi}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-300)" }}>
                {fmtDateTime(pg.createdAt)} · {pg.penulis}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Create form bottom sheet */}
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "85dvh", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-4)" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>
                Buat Pengumuman
              </p>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-300)", padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: "var(--space-2)" }}>
                  Judul <span style={{ color: "#eb0b54" }}>*</span>
                </label>
                <input
                  className="input"
                  placeholder="Judul pengumuman..."
                  value={judul}
                  onChange={e => setJudul(e.target.value)}
                  style={{ height: 46, fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: "var(--space-2)" }}>
                  Isi Pengumuman <span style={{ color: "#eb0b54" }}>*</span>
                </label>
                <textarea
                  className="input"
                  placeholder="Tuliskan isi pengumuman yang akan dilihat peserta..."
                  value={isi}
                  onChange={e => setIsi(e.target.value)}
                  rows={5}
                  style={{ height: "auto", resize: "none", fontSize: 13, lineHeight: 1.6, padding: "var(--space-3)" }}
                />
                <p style={{ fontSize: 11, color: "var(--text-300)", marginTop: 4 }}>{isi.length} karakter</p>
              </div>

              {/* Info */}
              <div style={{ background: "var(--primary-100)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                <Bell size={14} color="var(--primary-600)" style={{ marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: "var(--primary-600)", lineHeight: 1.5 }}>
                  Pengumuman ini akan dikirim ke semua peserta aktivitas <strong>{a?.nama}</strong>.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || !judul.trim() || !isi.trim()}
              >
                {loading ? <span className="spinner" /> : "Kirim Pengumuman"}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
