"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PesertaItem {
  id: string; nama: string; kelas: string; inisial: string;
  programId: string; programNama: string;
}

const AVATAR_PALETTE = ["#E8F0FF", "#FFE8F3", "#E8FFF0", "#FFF8E8", "#F3E8FF", "#E8F8FF"];
function avatarBg(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[n % AVATAR_PALETTE.length];
}

export default function PesertaPage() {
  const [search, setSearch] = useState("");
  const [kelasFilter, setKelasFilter] = useState("semua");
  const [programFilter, setProgramFilter] = useState("semua");

  const { data: peserta = [], isLoading } = useQuery<PesertaItem[]>({
    queryKey: ["peserta"],
    queryFn: async () => {
      const r = await fetch("/api/v1/peserta");
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
  });

  const uniqueKelas = Array.from(new Set(peserta.map(p => p.kelas))).sort();
  const uniquePrograms = Array.from(
    new Map(peserta.map(p => [p.programId, { id: p.programId, nama: p.programNama }])).values()
  ).sort((a, b) => a.nama.localeCompare(b.nama));

  const filtered = peserta.filter(p => {
    const matchSearch = !search || p.nama.toLowerCase().includes(search.toLowerCase()) || p.kelas.toLowerCase().includes(search.toLowerCase());
    const matchKelas = kelasFilter === "semua" || p.kelas === kelasFilter;
    const matchProgram = programFilter === "semua" || p.programId === programFilter;
    return matchSearch && matchKelas && matchProgram;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* Header */}
      <div style={{ background: "var(--primary-600)", flexShrink: 0 }}>
        <div style={{ padding: "var(--space-3) var(--space-4) var(--space-4)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 2 }}>
            Peserta
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            {isLoading ? "Memuat..." : `${peserta.length} peserta dari program kamu`}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-3) var(--space-4)", flexShrink: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div style={{ position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-300)" }} />
          <input
            type="search"
            className="input"
            placeholder="Cari nama atau kelas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36, height: 38, borderRadius: 8, fontSize: 13 }}
          />
        </div>
        {uniqueKelas.length > 0 && (
          <div style={{ display: "flex", gap: "var(--space-2)", overflowX: "auto", paddingBottom: 2 }}>
            {["semua", ...uniqueKelas].map(k => (
              <button key={k} onClick={() => setKelasFilter(k)} style={{
                padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap", flexShrink: 0,
                background: kelasFilter === k ? "var(--primary-600)" : "var(--neutral-300)",
                color: kelasFilter === k ? "white" : "var(--text-200)",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
                border: "none", cursor: "pointer",
              }}>
                {k === "semua" ? `Semua Kelas` : k}
              </button>
            ))}
          </div>
        )}
        {uniquePrograms.length > 0 && (
          <div style={{ display: "flex", gap: "var(--space-2)", overflowX: "auto", paddingBottom: 2 }}>
            {[{ id: "semua", nama: "Semua Program" }, ...uniquePrograms].map(prog => (
              <button key={prog.id} onClick={() => setProgramFilter(prog.id)} style={{
                padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap", flexShrink: 0,
                background: programFilter === prog.id ? "var(--primary-600)" : "var(--neutral-300)",
                color: programFilter === prog.id ? "white" : "var(--text-200)",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
                border: "none", cursor: "pointer",
              }}>
                {prog.nama}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--neutral-400)" }}>
        {isLoading ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-300)", fontSize: 13 }}>Memuat peserta...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "var(--space-8) var(--space-4)", textAlign: "center", color: "var(--text-300)", fontSize: 13 }}>
            {search || kelasFilter !== "semua" || programFilter !== "semua" ? "Tidak ada peserta yang cocok." : "Belum ada peserta."}
          </div>
        ) : (
          <div style={{ background: "var(--neutral-100)" }}>
            {filtered.map(p => (
              <Link key={`${p.id}-${p.programId}`} href={`/presensi/${p.programId}/peserta/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  borderBottom: "1px solid var(--neutral-500)",
                  background: "var(--neutral-100)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: avatarBg(p.id),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-200)",
                  }}>
                    {p.inisial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: 2 }}>
                      {p.nama}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-300)", marginBottom: 3 }}>{p.kelas}</p>
                    <p style={{ fontSize: 11, color: "var(--primary-600)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.programNama}
                    </p>
                  </div>
                  <ChevronRight size={16} color="var(--text-300)" style={{ flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
