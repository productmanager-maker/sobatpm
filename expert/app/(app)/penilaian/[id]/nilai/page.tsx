"use client";

import { use, useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Peserta { id: string; nama: string; kelas: string; email: string; inisial: string; }
interface PenilaianEntry { pesertaId: string; nilai: number; catatan: string | null; }
interface AktDetail { id: string; nama: string; jumlahPeserta: number; }

function NilaiContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pesertaId = searchParams.get("peserta");

  const { data: a } = useQuery<AktDetail | null>({
    queryKey: ["aktivitas", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: allPeserta = [] } = useQuery<Peserta[]>({
    queryKey: ["aktivitas", id, "peserta"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/peserta`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
    enabled: !!a,
  });

  const { data: penilaianData, isLoading: penilaianLoading } = useQuery<{ entries: PenilaianEntry[] }>({
    queryKey: ["aktivitas", id, "penilaian"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/penilaian`);
      return r.ok ? (await r.json()).data : { entries: [] };
    },
    enabled: allPeserta.length > 0,
  });

  const queryClient = useQueryClient();
  const [nilai, setNilai] = useState<Record<string, { skor: string; catatan: string }>>({});
  const initializedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (allPeserta.length > 0 && !penilaianLoading && !initializedRef.current) {
      const map = new Map((penilaianData?.entries ?? []).map(e => [e.pesertaId, e]));
      const init = Object.fromEntries(allPeserta.map(p => {
        const existing = map.get(p.id);
        return [p.id, { skor: existing ? String(existing.nilai) : "", catatan: existing?.catatan ?? "" }];
      }));
      setNilai(init);
      initializedRef.current = true;
    }
  }, [allPeserta, penilaianData, penilaianLoading]);

  const peserta = pesertaId ? allPeserta.find(p => p.id === pesertaId) : undefined;

  async function handleSubmit() {
    setLoading(true);
    const entries = (peserta ? [peserta] : allPeserta)
      .filter(p => nilai[p.id]?.skor !== "")
      .map(p => ({
        pesertaId: p.id,
        nilai: Math.min(100, Math.max(0, parseInt(nilai[p.id]?.skor ?? "0", 10))),
        catatan: nilai[p.id]?.catatan || null,
      }));
    try {
      await fetch(`/api/v1/aktivitas/${id}/penilaian`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      queryClient.invalidateQueries({ queryKey: ["aktivitas", id] });
      setSubmitted(true);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100dvh", padding: "var(--space-6)", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Check size={36} color="#15803D" strokeWidth={2.5} />
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", marginBottom: 8 }}>Penilaian Tersimpan!</p>
        <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-300)", marginBottom: 32, lineHeight: 1.6 }}>
          Nilai berhasil disimpan.
        </p>
        <button className="btn btn-primary" onClick={() => router.back()}>Kembali ke Daftar Peserta</button>
      </div>
    );
  }

  // Per-student view
  if (peserta && initializedRef.current) {
    const v = nilai[peserta.id] ?? { skor: "", catatan: "" };
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
        <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-4)", flexShrink: 0, height: 56 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
            <ArrowLeft size={20} color="var(--text-100)" />
          </button>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>
            Penilaian Peserta
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)" }}>
          <div style={{ background: "var(--neutral-100)", border: "1px solid var(--neutral-500)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: 2 }}>{peserta.nama}</p>
            <p style={{ fontSize: 12, color: "var(--text-300)", marginBottom: 8 }}>{peserta.kelas} · {peserta.email}</p>
          </div>

          <div style={{ marginBottom: "var(--space-4)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: "var(--space-3)" }}>
              Informasi Pengaturan Penilaian
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <InfoRow label="Format Penilaian" value="Skala 100" />
              <InfoRow label="Tipe Penilaian" value="Manual" valueBg="var(--primary-100)" valueColor="var(--primary-600)" />
              <InfoRow label="Nilai Minimum" value="0" />
              <InfoRow label="Tampilkan Nilai" value="Aktif" valueBg="#DCFCE7" valueColor="#15803D" />
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-4)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: "var(--space-3)" }}>
              Nilai Akhir
            </p>
            <div style={{ background: "var(--neutral-100)", border: "1px solid var(--neutral-500)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                <label style={{ flex: 1, fontSize: "var(--font-label-1-size)", fontWeight: 600, color: "var(--text-200)" }}>Nilai (0–100)</label>
                <input
                  type="number" min={0} max={100}
                  value={v.skor}
                  onChange={e => setNilai(prev => ({ ...prev, [peserta.id]: { ...prev[peserta.id], skor: e.target.value } }))}
                  className="input"
                  style={{ width: 90, height: 40, padding: "0 var(--space-3)", textAlign: "center" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "var(--font-label-1-size)", fontWeight: 600, color: "var(--text-200)", marginBottom: 8 }}>Catatan (opsional)</label>
                <textarea
                  className="input" placeholder="Tambahkan catatan untuk peserta..." rows={3}
                  value={v.catatan}
                  onChange={e => setNilai(prev => ({ ...prev, [peserta.id]: { ...prev[peserta.id], catatan: e.target.value } }))}
                  style={{ height: "auto", resize: "none", padding: "var(--space-3)", lineHeight: 1.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "var(--space-4)", background: "var(--neutral-100)", borderTop: "1px solid var(--neutral-500)", flexShrink: 0 }}>
          <button className="btn btn-primary" disabled={!v.skor} onClick={() => setShowConfirm(true)}>
            Simpan Nilai
          </button>
        </div>

        {showConfirm && (
          <div className="modal-backdrop" onClick={() => setShowConfirm(false)}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-5)" }} />
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", marginBottom: 8 }}>Konfirmasi Penilaian</p>
              <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-300)", marginBottom: "var(--space-5)", lineHeight: 1.6 }}>
                Simpan nilai <strong>{v.skor}</strong> untuk <strong>{peserta.nama}</strong>?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? <span className="spinner" /> : "Ya, Simpan"}
                </button>
                <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // All-students view
  const dinilai = Object.values(nilai).filter(v => v.skor !== "").length;
  const total = allPeserta.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-4)", flexShrink: 0, height: 56 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Beri Penilaian</p>
          {a && <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nama}</p>}
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--primary-600)", flexShrink: 0 }}>{dinilai}/{total}</span>
      </div>

      <div style={{ height: 4, background: "var(--neutral-400)", flexShrink: 0 }}>
        <div style={{ height: "100%", background: "var(--primary-600)", width: total > 0 ? `${(dinilai / total) * 100}%` : "0%", transition: "width 200ms" }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {allPeserta.map(p => {
            const v = nilai[p.id] ?? { skor: "", catatan: "" };
            const isDone = v.skor !== "";
            return (
              <div key={p.id} style={{ background: "var(--neutral-100)", borderRadius: "var(--radius-xl)", border: `1.5px solid ${isDone ? "var(--primary-300)" : "var(--neutral-500)"}`, padding: "var(--space-3) var(--space-4)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: isDone ? "#DCFCE7" : "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: isDone ? "#15803D" : "var(--primary-600)" }}>
                    {isDone ? <Check size={14} strokeWidth={3} /> : p.inisial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-body-3-size)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nama}</p>
                    <p style={{ fontSize: 11, color: "var(--text-300)" }}>{p.kelas}</p>
                  </div>
                  {isDone && <span className="pill" style={{ background: "#DCFCE7", color: "#15803D" }}>{v.skor}</span>}
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <input
                    type="number" min={0} max={100} value={v.skor}
                    onChange={e => setNilai(prev => ({ ...prev, [p.id]: { ...prev[p.id], skor: e.target.value } }))}
                    className="input" placeholder="0–100"
                    style={{ width: 80, height: 40, padding: "0 var(--space-3)", textAlign: "center" }}
                  />
                  <input
                    type="text" placeholder="Catatan (opsional)" value={v.catatan}
                    onChange={e => setNilai(prev => ({ ...prev, [p.id]: { ...prev[p.id], catatan: e.target.value } }))}
                    className="input" style={{ flex: 1, height: 40 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "var(--space-4)", background: "var(--neutral-100)", borderTop: "1px solid var(--neutral-500)", flexShrink: 0 }}>
        <button className="btn btn-primary" disabled={dinilai === 0} onClick={() => setShowConfirm(true)}>
          Submit Penilaian ({dinilai}/{total})
        </button>
      </div>

      {showConfirm && (
        <div className="modal-backdrop" onClick={() => setShowConfirm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-5)" }} />
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", marginBottom: 8 }}>Konfirmasi Penilaian</p>
            <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-300)", marginBottom: "var(--space-5)", lineHeight: 1.6 }}>
              Simpan nilai untuk <strong>{dinilai}</strong> peserta?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" /> : "Ya, Simpan Penilaian"}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, valueBg, valueColor }: { label: string; value: string; valueBg?: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <p style={{ fontSize: 12, color: "var(--text-300)" }}>{label}</p>
      {valueBg ? (
        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: valueBg, color: valueColor, padding: "2px 8px", borderRadius: 4 }}>{value}</span>
      ) : (
        <p style={{ fontSize: 12, color: "var(--text-100)" }}>{value}</p>
      )}
    </div>
  );
}

export default function NilaiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense>
      <NilaiContent id={id} />
    </Suspense>
  );
}
