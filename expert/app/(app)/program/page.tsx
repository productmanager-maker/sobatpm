"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProgramCover } from "./ProgramCover";

interface ProgApi {
  id: string;
  nama: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  jumlahPeserta: number;
  jumlahAktivitas: number;
  selesaiAktivitas: number;
}

const STATUS_BADGE: Record<string, string> = {
  "aktif": "Aktif",
  "selesai": "Selesai",
  "akan-datang": "Akan Datang",
};

export default function ProgramPage() {
  const [query, setQuery] = useState("");

  const { data: programs = [] } = useQuery<ProgApi[]>({
    queryKey: ["program"],
    queryFn: async () => {
      const r = await fetch("/api/v1/program");
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
  });

  const filtered = programs.filter(p =>
    p.nama.toLowerCase().includes(query.toLowerCase()) ||
    (p.status ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-4)" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", color: "var(--text-100)", marginBottom: 2 }}>
          Program
        </p>
        <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)" }}>
          {programs.length} program
        </p>
      </div>

      <div style={{ padding: "var(--space-4)" }}>
        <div style={{ position: "relative", marginBottom: "var(--space-4)" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-300)" }} />
          <input
            type="search"
            className="input"
            placeholder="Cari program..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada program yang sesuai dengan pencarian.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {filtered.map(p => {
              const progress = p.jumlahAktivitas > 0
                ? Math.round((p.selesaiAktivitas / p.jumlahAktivitas) * 100)
                : 0;
              return (
                <Link key={p.id} href={`/program/${p.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "var(--neutral-100)", borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--neutral-500)", overflow: "hidden",
                  }}>
                    {/* Cover */}
                    <div style={{ height: 120, position: "relative" }}>
                      <ProgramCover id={p.id} />
                      <span style={{
                        position: "absolute", top: 8, right: 8,
                        background: "rgba(0,0,0,0.45)", color: "white",
                        fontSize: "var(--font-label-3-size)", fontWeight: 600,
                        padding: "2px 8px", borderRadius: "var(--radius-pill)",
                        backdropFilter: "blur(4px)",
                      }}>
                        {STATUS_BADGE[p.status] ?? p.status}
                      </span>
                    </div>

                    <div style={{ padding: "var(--space-3) var(--space-4) var(--space-4)" }}>
                      <p style={{
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        fontSize: "var(--font-body-3-size)", color: "var(--text-100)", lineHeight: 1.4,
                        marginBottom: "var(--space-2)",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {p.nama}
                      </p>

                      <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)", marginBottom: "var(--space-3)" }}>
                        {p.tanggalMulai} — {p.tanggalSelesai}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                        <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)" }}>
                          {p.jumlahAktivitas} aktivitas · {p.jumlahPeserta} peserta
                        </p>
                        <p style={{ fontSize: "var(--font-label-2-size)", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--primary-600)" }}>
                          {p.selesaiAktivitas}/{p.jumlahAktivitas}
                        </p>
                      </div>
                      <div style={{ height: 4, background: "var(--neutral-400)", borderRadius: "var(--radius-pill)" }}>
                        <div style={{ height: "100%", borderRadius: "var(--radius-pill)", background: "var(--primary-600)", width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
