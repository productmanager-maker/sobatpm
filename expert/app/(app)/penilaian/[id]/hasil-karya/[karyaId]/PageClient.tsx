"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface KaryaDetail {
  id: string; aktivitasId: string; pesertaId: string; pesertaNama: string;
  namaFile: string; ukuranFile: string; waktuSubmit: string;
  catatanPeserta?: string; status: "BELUM_DIREVIEW" | "DIREVIEW";
  reviewNilai?: number; reviewCatatan?: string;
}

export default function DetailKaryaPage({ params }: { params: Promise<{ id: string; karyaId: string }> }) {
  const { id, karyaId } = use(params);
  const router = useRouter();

  const { data: k, isLoading } = useQuery<KaryaDetail | null>({
    queryKey: ["aktivitas", id, "hasil-karya", karyaId],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/hasil-karya/${karyaId}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const queryClient = useQueryClient();
  const [reviewCatatan, setReviewCatatan] = useState("");
  const [reviewNilai, setReviewNilai] = useState("");
  const initializedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (k && !initializedRef.current) {
      setReviewCatatan(k.reviewCatatan ?? "");
      setReviewNilai(k.reviewNilai?.toString() ?? "");
      initializedRef.current = true;
    }
  }, [k]);

  const nilaiNum = reviewNilai !== "" ? parseInt(reviewNilai, 10) : undefined;
  const isValid = nilaiNum !== undefined && !isNaN(nilaiNum) && nilaiNum >= 0 && nilaiNum <= 100;

  async function handleSave() {
    if (!isValid) return;
    setLoading(true);
    try {
      await fetch(`/api/v1/aktivitas/${id}/hasil-karya/${karyaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewNilai: nilaiNum, reviewCatatan }),
      });
      queryClient.invalidateQueries({ queryKey: ["aktivitas", id, "hasil-karya"] });
      setSaved(true);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return <div style={{ padding: 24, color: "var(--text-300)" }}>Memuat...</div>;
  if (!k) return <div style={{ padding: 24 }}>Karya tidak ditemukan.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* App bar */}
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)", flexShrink: 0, height: 56 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Karya {k.pesertaNama.split(" ")[0]}
        </p>
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#1B6B2D" }}>
            <Check size={14} strokeWidth={3} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Tersimpan</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {/* Thumbnail */}
        <div style={{ width: "100%", aspectRatio: "4/3", background: "linear-gradient(135deg, #e8e4f8, var(--primary-100))", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 64, height: 64, background: "var(--primary-300)", borderRadius: 12, opacity: 0.5 }} />
        </div>

        {/* File info */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>File</p>
          <p style={{ fontSize: 14, color: "var(--text-100)" }}>{k.namaFile} · {k.ukuranFile}</p>
        </div>

        {k.catatanPeserta && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Catatan Peserta</p>
            <p style={{ fontSize: 14, color: "var(--text-100)", lineHeight: 1.5 }}>{k.catatanPeserta}</p>
          </div>
        )}

        {/* Review expert */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Review Expert</p>
          <textarea
            className="input" placeholder="Tulis catatan untuk peserta…" rows={4}
            value={reviewCatatan}
            onChange={e => { setReviewCatatan(e.target.value); setSaved(false); }}
            style={{ height: "auto", resize: "none", padding: "var(--space-3)", lineHeight: 1.6, fontSize: 13 }}
          />
        </div>

        {/* Nilai + status row */}
        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Nilai (0–100)</p>
            <input
              type="number" className="input" placeholder="—" min={0} max={100}
              value={reviewNilai}
              onChange={e => { setReviewNilai(e.target.value); setSaved(false); }}
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--primary-600)", height: 52, textAlign: "center", MozAppearance: "textfield" } as React.CSSProperties}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Status</p>
            <span style={{
              display: "inline-block", padding: "4px 12px", borderRadius: 100,
              background: saved && isValid ? "#E1F5E6" : "#FFF4D6",
              color: saved && isValid ? "#1B6B2D" : "#6B4F00",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, marginTop: 8,
            }}>
              {saved && isValid ? "Direview" : "Belum direview"}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--neutral-100)", borderTop: "1px solid var(--neutral-500)", flexShrink: 0 }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading || !isValid}>
          {loading ? <span className="spinner" /> : "Simpan Review"}
        </button>
      </div>
    </div>
  );
}
