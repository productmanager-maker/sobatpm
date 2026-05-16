"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Calendar, Users, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type Section = "mengajar" | "menilai";

interface Program {
  id: string; nama: string; deskripsi: string; status: string;
  jumlahPeserta: number; tanggalMulai: string; tanggalSelesai: string;
  jumlahAktivitas: number; selesaiAktivitas: number;
}
interface AktivitasItem {
  id: string; nama: string; type: string; waktuMulai: string; waktuSelesai: string;
  lokasi: string | null; status: string; jumlahPeserta: number;
  kehadiranSelesai: number; penilaianSelesai: number;
}

const BG_PALETTE = ["#4F46E5", "#0F6E56", "#D97706", "#0369A1", "#7C3AED", "#DC2626", "#0891B2", "#059669"];
function headerBg(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return BG_PALETTE[n % BG_PALETTE.length];
}

const STATUS_PILL: Record<string, { label: string; bg: string; color: string }> = {
  "belum-mulai":        { label: "Belum Mulai",       bg: "#ffe6ea", color: "#eb0b54" },
  "sedang-berlangsung": { label: "Sedang Berlangsung", bg: "#fff5de", color: "#c97a24" },
  "sudah-diisi":        { label: "Sudah Diisi",        bg: "#DCFCE7", color: "#15803D" },
  "selesai":            { label: "Selesai",            bg: "#f0f0f0", color: "#555555" },
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}

function AktivitasRow({ a, mode }: { a: AktivitasItem; mode: "presensi" | "penilaian" }) {
  const pill = STATUS_PILL[a.status] ?? STATUS_PILL["belum-mulai"];
  const href = mode === "penilaian" ? `/penilaian/${a.id}` : `/presensi/${a.id}`;
  const bg = headerBg(a.id);

  return (
    <Link href={href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)", background: "var(--neutral-100)" }}>
      <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mode === "penilaian"
            ? <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12l2 2 4-4"/></>
            : <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></>
          }
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", lineHeight: 1.35, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {a.nama}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: pill.bg, color: pill.color, padding: "2px 7px", borderRadius: 100 }}>
            {pill.label}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-300)" }}>{fmtDate(a.waktuMulai)}, {fmtTime(a.waktuMulai)}</span>
          {a.lokasi && (
            <span style={{ fontSize: 11, color: "var(--text-300)", display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin size={10} /> {a.lokasi}
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={16} color="var(--neutral-700)" style={{ flexShrink: 0 }} />
    </Link>
  );
}

export default function DetailProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [section, setSection] = useState<Section>("mengajar");

  const { data: p, isLoading } = useQuery<Program>({
    queryKey: ["program", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/program/${id}`);
      if (!r.ok) return null;
      return (await r.json()).data;
    },
  });

  const { data: aktivitas = [] } = useQuery<AktivitasItem[]>({
    queryKey: ["program", id, "aktivitas"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/program/${id}/aktivitas`);
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
    enabled: !!p,
  });

  if (isLoading) return <div style={{ padding: 24, color: "var(--text-300)", fontSize: 13 }}>Memuat...</div>;
  if (!p) return <div style={{ padding: 24 }}>Program tidak ditemukan.</div>;

  const mengajar = aktivitas.filter(a => a.type === "mengajar");
  const menilai  = aktivitas.filter(a => a.type === "menilai");
  const progress = p.jumlahAktivitas > 0 ? Math.round((p.selesaiAktivitas / p.jumlahAktivitas) * 100) : 0;
  const color = headerBg(p.id);

  const SECTIONS = [
    { key: "mengajar" as Section, label: "Presensi", count: mengajar.length },
    { key: "menilai"  as Section, label: "Penilaian", count: menilai.length },
  ];

  const currentList = section === "mengajar" ? mengajar : menilai;
  const currentMode = section === "mengajar" ? "presensi" : "penilaian";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: color, paddingBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)" }}>
          <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "var(--radius-md)", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={18} color="white" />
          </button>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "white", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Detail Program
          </p>
        </div>
        <div style={{ padding: "0 var(--space-4)" }}>
          <span style={{ background: "rgba(255,255,255,0.25)", color: "white", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: "var(--radius-pill)", display: "inline-block", marginBottom: 8 }}>
            {p.status === "aktif" ? "Aktif" : "Selesai"}
          </span>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", lineHeight: 1.4 }}>
            {p.nama}
          </p>
        </div>
      </div>

      {/* Card */}
      <div style={{ background: "var(--neutral-100)", borderRadius: "20px 20px 0 0", marginTop: -12, flex: 1 }}>
        {/* Info bar */}
        <div style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
          <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-300)" }}>
              <Calendar size={13} />
              <span>{p.tanggalMulai} – {p.tanggalSelesai}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-300)" }}>
              <Users size={13} />
              <span>{p.jumlahPeserta} peserta · {p.jumlahAktivitas} aktivitas</span>
            </div>
          </div>
          {p.deskripsi && (
            <p style={{ fontSize: 12, color: "var(--text-300)", lineHeight: 1.6, marginBottom: "var(--space-3)" }}>{p.deskripsi}</p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--text-300)" }}>Progress aktivitas</span>
            <span style={{ fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--primary-600)" }}>{p.selesaiAktivitas}/{p.jumlahAktivitas} ({progress}%)</span>
          </div>
          <div style={{ height: 6, background: "var(--neutral-400)", borderRadius: "var(--radius-pill)" }}>
            <div style={{ height: "100%", background: "var(--primary-600)", borderRadius: "var(--radius-pill)", width: `${progress}%`, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Progres Belajar link */}
        <Link href={`/program/${id}/progres`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)", textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)" }}>Progres Belajar</p>
              <p style={{ fontSize: 11, color: "var(--text-300)" }}>Pantau penyelesaian aktivitas per peserta</p>
            </div>
          </div>
          <ChevronRight size={16} color="var(--neutral-700)" />
        </Link>

        {/* Section tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--neutral-500)" }}>
          {SECTIONS.map(s => {
            const isActive = section === s.key;
            return (
              <button key={s.key} onClick={() => setSection(s.key)} style={{
                flex: 1, padding: "var(--space-3) var(--space-4)",
                fontFamily: "var(--font-body)", fontWeight: isActive ? 700 : 400,
                fontSize: 13, color: isActive ? "var(--primary-600)" : "var(--text-300)",
                borderBottom: isActive ? "2px solid var(--primary-600)" : "2px solid transparent",
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                {s.label}
                <span style={{ background: isActive ? "var(--primary-100)" : "var(--neutral-400)", color: isActive ? "var(--primary-600)" : "var(--text-300)", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: "var(--radius-pill)" }}>
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Activity list */}
        <div>
          {currentList.length === 0 ? (
            <div style={{ padding: "var(--space-8) var(--space-4)", textAlign: "center", color: "var(--text-300)", fontSize: 13 }}>
              Belum ada aktivitas di seksi ini.
            </div>
          ) : (
            currentList.map(a => (
              <AktivitasRow key={a.id} a={a} mode={currentMode} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
