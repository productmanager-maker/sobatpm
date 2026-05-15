"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Image as ImageIcon, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PesertaDetail { id: string; nama: string; email: string; kelas: string; inisial: string; }
interface KehadiranSummary { hadir: number; izin: number; sakit: number; tk: number; total: number; }
interface KehadiranDetailItem { aktivitasId: string; aktivitasNama: string; programNama: string; waktuMulai: string; status: string; }
interface UmpanBalikItem { id: string; konten: string; expertNama: string; aktivitasId: string; aktivitasNama: string; createdAt: string; }
interface PenilaianItem { aktivitasId: string; aktivitasNama: string; nilai: number; tanggal: string; }
interface TaggedKaryaItem {
  aktivitasId: string; aktivitasNama: string;
  originalPesertaId: string; originalPesertaNama: string;
  file: { id: string; nama: string; tipe: "image" | "video" | "file"; ukuranFormatted: string; };
}

type Tab = "Kehadiran" | "Nilai" | "Hasil Karya" | "Catatan" | "Profil";

const KEHADIRAN_PILL: Record<string, { label: string; bg: string; color: string }> = {
  hadir:              { label: "Hadir", bg: "#DCFCE7", color: "#15803D" },
  izin:               { label: "Izin",  bg: "#f2f2f2", color: "#6b6b6b" },
  sakit:              { label: "Sakit", bg: "#fff5de", color: "#c97a24" },
  "tanpa-keterangan": { label: "Alpa",  bg: "#ffe6ea", color: "#eb0b54" },
};

function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function FileTypeIcon({ tipe }: { tipe: "image" | "video" | "file" }) {
  if (tipe === "image") return <ImageIcon size={15} color="#7C3AED" />;
  if (tipe === "video") return <Video size={15} color="#0369A1" />;
  return <FileText size={15} color="#D97706" />;
}
function fileBg(tipe: "image" | "video" | "file") {
  if (tipe === "image") return { bg: "#F3E8FF" };
  if (tipe === "video") return { bg: "#E0F2FE" };
  return { bg: "#FEF3C7" };
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div style={{ padding: "var(--space-10) var(--space-4)", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "var(--text-300)" }}>{msg}</p>
    </div>
  );
}

export default function ProfilPesertaPresensiPage({ params }: { params: Promise<{ id: string; pesertaId: string }> }) {
  const { pesertaId } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Kehadiran");

  const { data: peserta } = useQuery<PesertaDetail | null>({
    queryKey: ["peserta", pesertaId],
    queryFn: async () => {
      const r = await fetch(`/api/v1/peserta/${pesertaId}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: kehadiranSummary } = useQuery<KehadiranSummary | null>({
    queryKey: ["peserta", pesertaId, "riwayat-kehadiran"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/peserta/${pesertaId}/riwayat-kehadiran`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: kehadiranDetail = [] } = useQuery<KehadiranDetailItem[]>({
    queryKey: ["peserta", pesertaId, "kehadiran-detail"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/peserta/${pesertaId}/kehadiran-detail`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
    enabled: activeTab === "Kehadiran",
  });

  const { data: penilaianData } = useQuery<{ entries: PenilaianItem[] } | null>({
    queryKey: ["peserta", pesertaId, "riwayat-penilaian"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/peserta/${pesertaId}/riwayat-penilaian`);
      return r.ok ? (await r.json()).data : null;
    },
    enabled: activeTab === "Nilai",
  });
  const penilaianEntries = penilaianData?.entries ?? [];

  const { data: taggedKarya = [] } = useQuery<TaggedKaryaItem[]>({
    queryKey: ["peserta", pesertaId, "tagged-karya"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/peserta/${pesertaId}/tagged-karya`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
    enabled: activeTab === "Hasil Karya",
  });

  const { data: umpanBalik = [] } = useQuery<UmpanBalikItem[]>({
    queryKey: ["peserta", pesertaId, "umpan-balik"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/peserta/${pesertaId}/umpan-balik`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
    enabled: activeTab === "Catatan",
  });

  const avgNilai = penilaianEntries.length > 0
    ? Math.round(penilaianEntries.reduce((s, e) => s + e.nilai, 0) / penilaianEntries.length)
    : null;

  const TABS: Tab[] = ["Kehadiran", "Nilai", "Hasil Karya", "Catatan", "Profil"];

  if (!peserta) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
        <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)", height: 56, flexShrink: 0 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
            <ArrowLeft size={20} color="var(--text-100)" />
          </button>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>Profil Peserta</p>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-300)" }}>Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>

      {/* App bar */}
      <div style={{
        background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)",
        padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center",
        gap: "var(--space-3)", flexShrink: 0, height: 56,
      }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>
          Profil Peserta
        </p>
      </div>

      {/* Hero */}
      <div style={{ background: "var(--neutral-100)", padding: "var(--space-4) var(--space-4) var(--space-3)", textAlign: "center", flexShrink: 0 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "var(--primary-100)", color: "var(--primary-600)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22,
          margin: "0 auto var(--space-2)",
        }}>
          {peserta.inisial}
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-100)", marginBottom: 6 }}>
          {peserta.nama}
        </p>
        <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 100, background: "var(--neutral-300)", color: "var(--text-200)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11 }}>
          {peserta.kelas}
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", background: "var(--neutral-100)", borderTop: "1px solid var(--neutral-400)", borderBottom: "1px solid var(--neutral-400)", flexShrink: 0 }}>
        {[
          { label: "Total Hadir",    value: kehadiranSummary?.hadir ?? "—",  color: "#15803D" },
          { label: "Izin / Sakit",   value: kehadiranSummary ? ((kehadiranSummary.izin + kehadiranSummary.sakit) || "—") : "—", color: "#c97a24" },
          { label: "Nilai Rata-rata", value: avgNilai ?? "—",                color: "var(--primary-600)" },
          { label: "File Karya",     value: "—",                             color: "var(--text-200)" },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: "var(--space-3) 0", textAlign: "center", borderRight: i < 3 ? "1px solid var(--neutral-400)" : "none" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 9, color: "var(--text-300)", marginTop: 2, lineHeight: 1.3 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", background: "var(--neutral-100)", borderBottom: "2px solid var(--neutral-400)", flexShrink: 0, overflowX: "auto" }}>
        {TABS.map(tab => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: "var(--space-3) 4px",
                fontFamily: "var(--font-display)", fontWeight: active ? 700 : 500,
                fontSize: 12, color: active ? "var(--primary-600)" : "var(--text-300)",
                borderBottom: active ? "2px solid var(--primary-600)" : "2px solid transparent",
                marginBottom: -2,
                background: "transparent", border: "none", cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--neutral-400)" }}>

        {/* ── Tab: Kehadiran ── */}
        {activeTab === "Kehadiran" && (
          <div style={{ background: "var(--neutral-100)" }}>
            {kehadiranSummary && kehadiranSummary.total > 0 && (
              <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                {[
                  { key: "hadir", label: "Hadir", count: kehadiranSummary.hadir },
                  { key: "izin",  label: "Izin",  count: kehadiranSummary.izin },
                  { key: "sakit", label: "Sakit", count: kehadiranSummary.sakit },
                  { key: "tk",    label: "Alpa",  count: kehadiranSummary.tk },
                ].filter(s => s.count > 0).map(s => {
                  const pill = KEHADIRAN_PILL[s.key === "tk" ? "tanpa-keterangan" : s.key];
                  return (
                    <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, background: pill.bg, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: pill.color }}>
                      {s.label}: {s.count}
                    </span>
                  );
                })}
              </div>
            )}
            {kehadiranDetail.length === 0
              ? <EmptyState msg="Belum ada rekam kehadiran." />
              : kehadiranDetail.map(item => {
                  const pill = KEHADIRAN_PILL[item.status] ?? KEHADIRAN_PILL["tanpa-keterangan"];
                  return (
                    <div key={item.aktivitasId} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.aktivitasNama}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-300)" }}>
                          {fmtDate(item.waktuMulai)}, {fmtTime(item.waktuMulai)}
                        </p>
                        {item.programNama && (
                          <p style={{ fontSize: 10, color: "var(--primary-600)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.programNama}
                          </p>
                        )}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, flexShrink: 0, background: pill.bg, color: pill.color, fontFamily: "var(--font-display)" }}>
                        {pill.label}
                      </span>
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* ── Tab: Nilai ── */}
        {activeTab === "Nilai" && (
          <div style={{ background: "var(--neutral-100)" }}>
            {avgNilai !== null && (
              <div style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--neutral-400)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: avgNilai >= 80 ? "#DCFCE7" : avgNilai >= 65 ? "#fff5de" : "#ffe6ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: avgNilai >= 80 ? "#15803D" : avgNilai >= 65 ? "#c97a24" : "#eb0b54" }}>{avgNilai}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)" }}>Rata-rata nilai</p>
                  <p style={{ fontSize: 12, color: "var(--text-300)" }}>dari {penilaianEntries.length} aktivitas dinilai</p>
                </div>
              </div>
            )}
            {penilaianEntries.length === 0
              ? <EmptyState msg="Belum ada penilaian untuk peserta ini." />
              : penilaianEntries.map(item => {
                  const c = item.nilai >= 80 ? "#15803D" : item.nilai >= 65 ? "#c97a24" : "#eb0b54";
                  const bg = item.nilai >= 80 ? "#DCFCE7" : item.nilai >= 65 ? "#fff5de" : "#ffe6ea";
                  return (
                    <div key={item.aktivitasId} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.aktivitasNama}</p>
                        <p style={{ fontSize: 11, color: "var(--text-300)" }}>{fmtDate(item.tanggal)}</p>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: c }}>{item.nilai}</p>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* ── Tab: Hasil Karya ── */}
        {activeTab === "Hasil Karya" && (
          <div style={{ background: "var(--neutral-100)" }}>
            {taggedKarya.length === 0
              ? <EmptyState msg="Belum ada file yang di-tag ke peserta ini." />
              : taggedKarya.map(item => {
                  const fb = fileBg(item.file.tipe);
                  return (
                    <div key={item.file.id} style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", flexShrink: 0, background: fb.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileTypeIcon tipe={item.file.tipe} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.file.nama}</p>
                        <p style={{ fontSize: 11, color: "var(--text-300)", marginBottom: 4 }}>{item.file.ukuranFormatted}</p>
                        <p style={{ fontSize: 10, color: "var(--primary-600)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.aktivitasNama}</p>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* ── Tab: Catatan ── */}
        {activeTab === "Catatan" && (
          <div style={{ background: "var(--neutral-100)" }}>
            {umpanBalik.length === 0
              ? <EmptyState msg="Belum ada catatan dari expert." />
              : umpanBalik.map(item => (
                  <div key={item.id} style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
                    <p style={{ fontSize: 13, color: "var(--text-100)", lineHeight: 1.6, marginBottom: 8 }}>{item.konten}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--primary-600)", background: "var(--primary-100)", padding: "2px 8px", borderRadius: 100 }}>
                        {item.expertNama}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-300)" }}>{item.aktivitasNama}</span>
                      <span style={{ fontSize: 10, color: "var(--text-300)" }}>· {fmtDate(item.createdAt)}</span>
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* ── Tab: Profil ── */}
        {activeTab === "Profil" && (
          <div style={{ background: "var(--neutral-100)" }}>
            {[
              { label: "Nama Lengkap", value: peserta.nama },
              { label: "Email",        value: peserta.email },
              { label: "Kelas",        value: peserta.kelas },
              { label: "ID Peserta",   value: peserta.id },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderBottom: i < arr.length - 1 ? "1px solid var(--neutral-400)" : "none" }}>
                <span style={{ fontSize: 12, color: "var(--text-300)", width: 100, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: "var(--text-100)", fontWeight: 500, flex: 1 }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: "var(--space-8)" }} />
      </div>
    </div>
  );
}
