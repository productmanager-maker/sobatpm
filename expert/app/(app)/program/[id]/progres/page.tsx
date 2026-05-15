"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PROGRAMS, PROGRES_LIST } from "@/lib/mock-data";

type Filter = "semua" | "bawah50" | "50-80" | "atas80";

function getBarColor(pct: number) {
  if (pct >= 80) return "var(--primary-600)";
  if (pct >= 50) return "#E0B547";
  return "var(--danger-600)";
}

function getAvatarStyle(pct: number): React.CSSProperties {
  if (pct >= 80) return { background: "var(--primary-100)", color: "var(--primary-700, var(--primary-600))" };
  if (pct >= 50) return { background: "#FFF4D6", color: "#8a5b00" };
  return { background: "#FFE6EA", color: "#C40048" };
}

export default function ProgresPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("semua");

  const p = PROGRAMS.find(x => x.id === id);
  const data = PROGRES_LIST.find(x => x.programId === id);

  if (!p) return <div style={{ padding: 24 }}>Program tidak ditemukan.</div>;

  const allPeserta = data?.peserta ?? [];
  const displayed = allPeserta.filter(pe => {
    if (filter === "bawah50") return pe.persentase < 50;
    if (filter === "50-80")   return pe.persentase >= 50 && pe.persentase < 80;
    if (filter === "atas80")  return pe.persentase >= 80;
    return true;
  });

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
          Progres Belajar
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero card */}
        <div style={{
          background: "var(--primary-600)", margin: "var(--space-4)", borderRadius: 12, padding: "var(--space-4)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
            Program
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "white", lineHeight: 1.35, marginBottom: "var(--space-4)" }}>
            {p.nama}
          </p>
          <div style={{ display: "flex", gap: "var(--space-6)" }}>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Total peserta</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "white" }}>{allPeserta.length}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Rata-rata</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "white" }}>{data?.rataRata ?? 0}%</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "var(--space-2)", overflowX: "auto", paddingBottom: 4, padding: "0 var(--space-4) var(--space-3)" }}>
          {[
            { key: "semua"   as Filter, label: "Semua" },
            { key: "bawah50" as Filter, label: "< 50%" },
            { key: "50-80"   as Filter, label: "50–80%" },
            { key: "atas80"  as Filter, label: "> 80%" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 14px", borderRadius: 100, whiteSpace: "nowrap",
                background: filter === f.key ? "var(--primary-600)" : "var(--neutral-400)",
                color: filter === f.key ? "white" : "var(--text-200)",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                border: "none", cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Peserta list */}
        <div style={{ background: "var(--neutral-100)", padding: "0 var(--space-4)" }}>
          {displayed.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-300)", textAlign: "center", padding: "var(--space-8) 0" }}>
              Tidak ada peserta di kategori ini.
            </p>
          ) : (
            displayed.map(pe => (
              <Link
                key={pe.pesertaId}
                href={`/program/${id}/progres/${pe.pesertaId}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "var(--space-3) 0", borderBottom: "1px solid var(--neutral-400)",
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
                    ...getAvatarStyle(pe.persentase),
                  }}>
                    {pe.pesertaNama.split(" ").slice(0, 2).map(w => w[0]).join("")}
                  </div>
                  {/* Name */}
                  <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text-100)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {pe.pesertaNama}
                  </p>
                  {/* Progress bar */}
                  <div style={{ width: 80, height: 6, background: "var(--neutral-400)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 100, background: getBarColor(pe.persentase), width: `${pe.persentase}%` }} />
                  </div>
                  {/* Percentage */}
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--text-100)", minWidth: 36, textAlign: "right" }}>
                    {pe.persentase}%
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
