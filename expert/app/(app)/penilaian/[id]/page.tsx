"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type Tab = "penilaian" | "hasil-karya";

interface AktDetail {
  id: string; nama: string; programNama: string; type: string;
  jumlahPeserta: number; status: string;
}
interface Peserta { id: string; nama: string; kelas: string; email: string; inisial: string; }
interface PenilaianEntry { pesertaId: string; nilai: number; catatan: string | null; }
interface KaryaItem { id: string; pesertaNama: string; status: "BELUM_DIREVIEW" | "DIREVIEW"; reviewNilai?: number; }

const PILL_STATUS: Record<string, { label: string; bg: string; color: string }> = {
  done:    { label: "Sudah Dinilai",  bg: "#DCFCE7", color: "#15803D" },
  pending: { label: "Belum Dinilai",  bg: "#FFF4D6", color: "#6B4F00" },
};

export default function PenilaianDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("penilaian");
  const [query, setQuery] = useState("");

  const { data: a, isLoading } = useQuery<AktDetail | null>({
    queryKey: ["aktivitas", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: peserta = [] } = useQuery<Peserta[]>({
    queryKey: ["aktivitas", id, "peserta"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/peserta`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
    enabled: !!a,
  });

  const { data: penilaianData } = useQuery<{ entries: PenilaianEntry[] }>({
    queryKey: ["aktivitas", id, "penilaian"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/penilaian`);
      return r.ok ? (await r.json()).data : { entries: [] };
    },
    enabled: !!a,
  });

  const { data: karya = [] } = useQuery<KaryaItem[]>({
    queryKey: ["aktivitas", id, "hasil-karya"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/hasil-karya`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
    enabled: !!a,
  });

  if (isLoading) return <div style={{ padding: 24, color: "var(--text-300)" }}>Memuat...</div>;
  if (!a) return <div style={{ padding: 24 }}>Aktivitas tidak ditemukan.</div>;

  const penilaianMap = new Map<string, PenilaianEntry>(
    (penilaianData?.entries ?? []).map(e => [e.pesertaId, e])
  );

  const filtered = query
    ? peserta.filter(p => p.nama.toLowerCase().includes(query.toLowerCase()) || p.email.toLowerCase().includes(query.toLowerCase()))
    : peserta;

  const belumDireviewCount = karya.filter(k => k.status === "BELUM_DIREVIEW").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* App bar */}
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-4)", flexShrink: 0, height: 56 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Penilaian &amp; Catatan
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Activity title card */}
        <div style={{ background: "var(--neutral-100)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-2)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.nama}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-300)", lineHeight: 1.4 }}>
            {a.programNama ?? "Tanpa Program"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ background: "var(--neutral-100)", display: "flex", borderBottom: "1px solid var(--neutral-500)", marginBottom: "var(--space-2)" }}>
          {([
            { key: "penilaian" as Tab,   label: "Penilaian" },
            { key: "hasil-karya" as Tab, label: "Hasil Karya", badge: belumDireviewCount > 0 ? belumDireviewCount : undefined },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: "var(--space-3) var(--space-4)",
                fontFamily: "var(--font-body)", fontWeight: tab === t.key ? 700 : 400, fontSize: 14,
                color: tab === t.key ? "var(--primary-600)" : "var(--text-300)",
                borderBottom: tab === t.key ? "2px solid var(--primary-600)" : "2px solid transparent",
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              {t.label}
              {"badge" in t && t.badge !== undefined && (
                <span style={{ background: "var(--danger-600)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10, padding: "1px 6px", borderRadius: 100 }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "penilaian" && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)" }}>
            {/* Umpan balik link */}
            <Link href={`/penilaian/${id}/umpan-balik`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--neutral-200)", borderRadius: "var(--radius-lg)", padding: "var(--space-3) var(--space-4)", textDecoration: "none", marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <span style={{ fontSize: 16 }}>💬</span>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-100)" }}>Umpan Balik &amp; Catatan Internal</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "var(--space-4)" }}>
              <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-300)" }} />
              <input type="search" className="input" placeholder="Cari peserta" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 42, height: 44, borderRadius: 10 }} />
            </div>

            {/* Nilai progress */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
              <p style={{ fontSize: 12, color: "var(--text-300)" }}>
                <strong style={{ fontFamily: "var(--font-display)", color: "var(--primary-600)" }}>{penilaianMap.size}</strong> / {peserta.length} peserta sudah dinilai
              </p>
              <Link href={`/penilaian/${id}/nilai`} style={{ textDecoration: "none", fontSize: 12, fontWeight: 700, color: "var(--primary-600)", fontFamily: "var(--font-display)" }}>
                Isi Semua
              </Link>
            </div>

            {/* Student rows */}
            <div>
              {filtered.map(p => {
                const entry = penilaianMap.get(p.id);
                const isDone = !!entry;
                const pill = isDone ? PILL_STATUS.done : PILL_STATUS.pending;
                return (
                  <Link key={p.id} href={`/penilaian/${id}/nilai?peserta=${p.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ borderBottom: "1px solid var(--neutral-500)", display: "flex", alignItems: "center", gap: "var(--space-2)", paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: isDone ? "#DCFCE7" : "var(--primary-100)", color: isDone ? "#15803D" : "var(--primary-600)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {p.inisial}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--text-100)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nama}</p>
                        <p style={{ fontSize: 12, color: "var(--text-300)", marginBottom: 4 }}>{p.kelas}</p>
                        <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: pill.bg, color: pill.color, padding: "2px 8px", borderRadius: 4 }}>
                          {pill.label}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                        {entry && (
                          <>
                            <div style={{ textAlign: "center" }}>
                              <p style={{ fontSize: 10, color: "var(--text-100)", marginBottom: 2 }}>Nilai</p>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)" }}>{entry.nilai}</p>
                            </div>
                            <div style={{ width: 0, height: 17, borderLeft: "1px solid var(--neutral-600)" }} />
                          </>
                        )}
                        <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {tab === "hasil-karya" && (
          <div style={{ padding: "var(--space-4)" }}>
            {karya.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "var(--space-10) var(--space-5)", gap: "var(--space-4)" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#ede9f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 48, height: 48, background: "#c4b8f0", borderRadius: 10, opacity: 0.6 }} />
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>Belum ada karya dikumpulkan</p>
                <p style={{ fontSize: 13, color: "var(--text-300)", lineHeight: 1.5, maxWidth: 280 }}>Peserta belum mengumpulkan hasil karya untuk tugas ini.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--text-300)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Submitted</p>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--primary-600)" }}>
                      {karya.length} / {a.jumlahPeserta}
                    </p>
                  </div>
                  <Link href={`/penilaian/${id}/hasil-karya`} style={{ height: 36, padding: "0 14px", borderRadius: 8, background: "var(--primary-100)", color: "var(--primary-600)", display: "flex", alignItems: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
                    Lihat Semua
                  </Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {karya.slice(0, 4).map(k => (
                    <Link key={k.id} href={`/penilaian/${id}/hasil-karya/${k.id}`} style={{ textDecoration: "none" }}>
                      <div style={{ background: "var(--neutral-100)", border: "1px solid var(--neutral-500)", borderRadius: 12, overflow: "hidden" }}>
                        <div style={{ aspectRatio: "4/3", background: "linear-gradient(135deg, #e8e4f8, var(--primary-100))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 44, height: 44, background: "var(--primary-300)", borderRadius: 8, opacity: 0.5 }} />
                        </div>
                        <div style={{ padding: 10 }}>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {k.pesertaNama.split(" ")[0]}
                          </p>
                          <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: k.status === "DIREVIEW" ? "#E1F5E6" : "#FFF4D6", color: k.status === "DIREVIEW" ? "#1B6B2D" : "#6B4F00", padding: "2px 8px", borderRadius: 100 }}>
                            {k.status === "DIREVIEW" ? "Direview" : "Belum direview"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
