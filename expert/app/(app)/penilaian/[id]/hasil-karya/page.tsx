"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type Filter = "semua" | "belum" | "sudah";
type KaryaStatus = "BELUM_DIREVIEW" | "DIREVIEW";

interface KaryaItem {
  id: string; pesertaNama: string; waktuSubmit: string;
  status: KaryaStatus; reviewNilai?: number;
}

interface AktDetail { id: string; nama: string; jumlahPeserta: number; }

const KARYA_PILL: Record<KaryaStatus, { label: string; bg: string; color: string }> = {
  BELUM_DIREVIEW: { label: "Belum direview", bg: "#FFF4D6", color: "#6B4F00" },
  DIREVIEW:       { label: "Direview",        bg: "#E1F5E6", color: "#1B6B2D" },
};

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
}

function KaryaCard({ k, href }: { k: KaryaItem; href: string }) {
  const pill = KARYA_PILL[k.status];
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ background: "var(--neutral-100)", border: "1px solid var(--neutral-500)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ aspectRatio: "4/3", background: "linear-gradient(135deg, #e8e4f8, var(--primary-100))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ width: 44, height: 44, background: "var(--primary-300)", borderRadius: 8, opacity: 0.5 }} />
          {k.status === "DIREVIEW" && k.reviewNilai !== undefined && (
            <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(27,107,45,0.9)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, padding: "2px 8px", borderRadius: "var(--radius-pill)" }}>
              {k.reviewNilai}
            </div>
          )}
        </div>
        <div style={{ padding: 10 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {k.pesertaNama.split(" ")[0]} {k.pesertaNama.split(" ")[1]?.charAt(0) ?? ""}.
          </p>
          <p style={{ fontSize: 11, color: "var(--text-300)", marginBottom: 4 }}>{fmtDateTime(k.waktuSubmit)}</p>
          <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: pill.bg, color: pill.color, padding: "2px 8px", borderRadius: 100 }}>
            {pill.label}{k.status === "DIREVIEW" && k.reviewNilai !== undefined ? ` · ${k.reviewNilai}` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HasilKaryaListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("semua");

  const { data: a } = useQuery<AktDetail | null>({
    queryKey: ["aktivitas", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: allKarya = [], isLoading } = useQuery<KaryaItem[]>({
    queryKey: ["aktivitas", id, "hasil-karya"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/hasil-karya`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
  });

  const displayed = filter === "belum"
    ? allKarya.filter(k => k.status === "BELUM_DIREVIEW")
    : filter === "sudah"
    ? allKarya.filter(k => k.status === "DIREVIEW")
    : allKarya;

  const belumCount = allKarya.filter(k => k.status === "BELUM_DIREVIEW").length;
  const sudahCount = allKarya.filter(k => k.status === "DIREVIEW").length;
  const totalPeserta = a?.jumlahPeserta ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)", flexShrink: 0, height: 56 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)", flex: 1 }}>Hasil Karya</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: "var(--neutral-100)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-2)" }}>
          <p style={{ fontSize: 12, color: "var(--text-300)", marginBottom: 2 }}>Tugas: {a?.nama ?? "—"}</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)" }}>
            <span style={{ color: "var(--primary-600)" }}>{allKarya.length}</span> dari {totalPeserta} peserta sudah submit
          </p>
        </div>

        {isLoading ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-300)" }}>Memuat...</div>
        ) : allKarya.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "var(--space-10) var(--space-5)", gap: "var(--space-4)" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#ede9f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 48, height: 48, background: "#c4b8f0", borderRadius: 10, opacity: 0.6 }} />
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>Belum ada karya dikumpulkan</p>
            <p style={{ fontSize: 13, color: "var(--text-300)", lineHeight: 1.5, maxWidth: 280 }}>Peserta belum mengumpulkan hasil karya untuk tugas ini.</p>
          </div>
        ) : (
          <div style={{ padding: "var(--space-3) var(--space-4)" }}>
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)", overflowX: "auto", paddingBottom: 4 }}>
              {[
                { key: "semua" as Filter, label: `Semua · ${allKarya.length}` },
                { key: "belum" as Filter, label: `Belum direview · ${belumCount}` },
                { key: "sudah" as Filter, label: `Sudah direview · ${sudahCount}` },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  padding: "6px 14px", borderRadius: 100, whiteSpace: "nowrap",
                  background: filter === f.key ? "var(--primary-600)" : "var(--neutral-400)",
                  color: filter === f.key ? "white" : "var(--text-200)",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                  border: "none", cursor: "pointer",
                }}>
                  {f.label}
                </button>
              ))}
            </div>

            {displayed.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-300)", textAlign: "center", padding: "var(--space-8) 0" }}>Tidak ada karya dalam kategori ini.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {displayed.map(k => (
                  <KaryaCard key={k.id} k={k} href={`/penilaian/${id}/hasil-karya/${k.id}`} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
