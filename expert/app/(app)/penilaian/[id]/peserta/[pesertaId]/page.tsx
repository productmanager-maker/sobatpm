"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PESERTA_LIST, PENGERJAAAN_PILL, AKTIVITAS_LIST } from "@/lib/mock-data";

export default function ProfilPesertaPenilaianPage({ params }: { params: Promise<{ id: string; pesertaId: string }> }) {
  const { id, pesertaId } = use(params);
  const router = useRouter();

  const peserta = PESERTA_LIST.find(p => p.id === pesertaId);
  const a = AKTIVITAS_LIST.find(x => x.id === id);

  if (!peserta) return <div style={{ padding: 24 }}>Peserta tidak ditemukan.</div>;

  const pill = peserta.pengerjaaanStatus ? PENGERJAAAN_PILL[peserta.pengerjaaanStatus] : null;
  const initials = peserta.nama.split(" ").slice(0, 2).map(w => w[0]).join("");

  const nilaiHistory = [
    { aktivitas: "Penilaian Strategi Marketing", nilai: peserta.nilaiAkhir ?? "—", tanggal: "14 Feb 2026" },
    { aktivitas: "Kuis Modul 1",                 nilai: 78,                         tanggal: "10 Feb 2026" },
    { aktivitas: "Presentasi Awal",              nilai: 82,                         tanggal: "5 Feb 2026" },
  ];

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
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>
          Profil Peserta
        </p>
        <Link
          href={`/penilaian/${id}/nilai?peserta=${pesertaId}`}
          style={{
            padding: "6px 14px", borderRadius: "var(--radius-pill)",
            background: "var(--primary-600)", color: "white",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
            textDecoration: "none",
          }}
        >
          Beri Nilai
        </Link>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div style={{
          background: "var(--neutral-100)", padding: "var(--space-5) var(--space-4) var(--space-4)",
          borderBottom: "1px solid var(--neutral-400)", textAlign: "center",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--primary-100)", color: "var(--primary-600)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24,
            margin: "0 auto var(--space-3)",
          }}>
            {initials}
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-100)", marginBottom: 4 }}>
            {peserta.nama}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-300)", marginBottom: "var(--space-2)" }}>
            {peserta.email}
          </p>
          {pill && (
            <span style={{
              display: "inline-block", padding: "3px 10px", borderRadius: 100,
              background: pill.bg, color: pill.color,
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
            }}>
              {pill.label}
            </span>
          )}
        </div>

        {/* Context aktivitas */}
        {a && (
          <div style={{ background: "var(--neutral-200)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
              Dari Aktivitas
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-100)" }}>{a.judul}</p>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--neutral-400)" }}>
          {[
            { label: "Nilai Akhir", value: peserta.nilaiAkhir !== undefined ? peserta.nilaiAkhir.toFixed(0) : "—" },
            { label: "Kehadiran",   value: "2 / 3" },
            { label: "Submit",      value: peserta.pengerjaaanStatus?.startsWith("SELESAI") ? "✓" : "✗" },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, padding: "var(--space-3)", textAlign: "center", borderRight: "1px solid var(--neutral-400)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--primary-600)" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "var(--text-300)", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nilai history */}
        <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-200)", marginBottom: "var(--space-3)" }}>
            Riwayat Penilaian
          </p>
          {nilaiHistory.map((h, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "var(--space-3)",
              paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)",
              borderBottom: i < nilaiHistory.length - 1 ? "1px solid var(--neutral-400)" : "none",
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-100)", marginBottom: 2 }}>{h.aktivitas}</p>
                <p style={{ fontSize: 11, color: "var(--text-300)" }}>{h.tanggal}</p>
              </div>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
                color: typeof h.nilai === "number" ? "var(--primary-600)" : "var(--text-300)",
              }}>
                {typeof h.nilai === "number" ? h.nilai.toFixed(0) : h.nilai}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
