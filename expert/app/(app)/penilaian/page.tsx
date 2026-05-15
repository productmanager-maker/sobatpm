"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AktApi {
  id: string;
  nama: string;
  programNama: string;
  type: string;
  waktuMulai: string;
  waktuSelesai: string;
  jumlahPeserta: number;
  status: string;
  penilaianSelesai: number;
  deskripsi: string;
}

const PENILAIAN_PILL: Record<string, { label: string; css: string }> = {
  "belum-mulai":        { label: "Belum Dinilai",  css: "pill-red" },
  "sedang-berlangsung": { label: "Sedang Dinilai",  css: "pill-yellow" },
  "sudah-diisi":        { label: "Selesai Dinilai", css: "pill-green" },
  "selesai":            { label: "Selesai Dinilai", css: "pill-green" },
};

const BG_PALETTE = ["#E8F0FF", "#FFE8F3", "#E8FFF0", "#FFF8E8", "#F3E8FF", "#E8F8FF"];
function thumbBg(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return BG_PALETTE[n % BG_PALETTE.length];
}
function thumbInitials(nama: string) {
  return nama.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

function PenilaianCard({ a }: { a: AktApi }) {
  const pill = PENILAIAN_PILL[a.status] ?? PENILAIAN_PILL["belum-mulai"];
  const isSelesai = a.status === "sudah-diisi" || a.status === "selesai";
  const progress = a.jumlahPeserta > 0 ? a.penilaianSelesai / a.jumlahPeserta : 0;

  return (
    <Link href={`/penilaian/${a.id}`} className="aktivitas-card" style={{ marginBottom: 10 }}>
      <div className="aktivitas-thumb" style={{ background: thumbBg(a.id), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-200)", fontFamily: "var(--font-display)" }}>
          {thumbInitials(a.nama)}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
          <span className={`pill ${pill.css}`}>{pill.label}</span>
        </div>

        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "var(--font-body-3-size)", color: "var(--text-100)", lineHeight: "var(--font-body-3-lh)", marginBottom: 4,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {a.nama}
        </p>

        {a.programNama && (
          <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.programNama}
          </p>
        )}

        <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)" }}>
          {fmtDateTime(a.waktuMulai)}
        </p>

        {!isSelesai && a.jumlahPeserta > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <p style={{ fontSize: "var(--font-label-3-size)", color: "var(--text-300)" }}>
                {a.penilaianSelesai}/{a.jumlahPeserta} peserta dinilai
              </p>
              <p style={{ fontSize: "var(--font-label-3-size)", color: "var(--primary-600)", fontWeight: 600 }}>
                {Math.round(progress * 100)}%
              </p>
            </div>
            <div style={{ height: 4, background: "var(--neutral-400)", borderRadius: "var(--radius-pill)" }}>
              <div style={{
                height: "100%", borderRadius: "var(--radius-pill)",
                background: "var(--primary-600)",
                width: `${progress * 100}%`,
              }} />
            </div>
          </div>
        )}
      </div>

      <ChevronRight size={16} color="var(--neutral-700)" style={{ flexShrink: 0, marginTop: 2 }} />
    </Link>
  );
}

export default function PenilaianListPage() {
  const { data: list = [] } = useQuery<AktApi[]>({
    queryKey: ["penilaian"],
    queryFn: async () => {
      const r = await fetch("/api/v1/penilaian");
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
  });

  const belumDinilai = list.filter(a => a.status === "belum-mulai" || a.status === "sedang-berlangsung");
  const selesai = list.filter(a => a.status === "sudah-diisi" || a.status === "selesai");

  return (
    <div>
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-4)" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", color: "var(--text-100)", marginBottom: 2 }}>
          Penilaian
        </p>
        <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)" }}>
          {list.length} tugas asesmen
        </p>
      </div>

      <div style={{ padding: "var(--space-4)" }}>
        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)", overflowX: "auto" }}>
          <div className="pill pill-red" style={{ flexShrink: 0 }}>
            {belumDinilai.length} Belum Dinilai
          </div>
          <div className="pill pill-green" style={{ flexShrink: 0 }}>
            {selesai.length} Selesai
          </div>
        </div>

        {belumDinilai.length > 0 && (
          <>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-label-1-size)", color: "var(--text-200)", marginBottom: "var(--space-3)" }}>
              Perlu Dinilai
            </p>
            {belumDinilai.map(a => <PenilaianCard key={a.id} a={a} />)}
          </>
        )}

        {selesai.length > 0 && (
          <>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-label-1-size)", color: "var(--text-200)", margin: "var(--space-4) 0 var(--space-3)" }}>
              Selesai Dinilai
            </p>
            {selesai.map(a => <PenilaianCard key={a.id} a={a} />)}
          </>
        )}

        {list.length === 0 && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-500)" strokeWidth="1.5" style={{ display: "block", margin: "0 auto" }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <p style={{ marginTop: 12 }}>Tidak ada tugas asesmen saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
