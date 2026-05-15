"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Users, Bell, ChevronRight, Search, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const TABS = ["Detail", "Peserta", "Kehadiran", "Umpan Balik", "Hasil Karya", "Pengumuman"] as const;
type Tab = typeof TABS[number];

interface AktDetail {
  id: string; nama: string; programId: string; programNama: string;
  type: string; waktuMulai: string; waktuSelesai: string; lokasi: string | null;
  jumlahPeserta: number; status: string; deskripsi: string;
  kehadiranSelesai: number;
}
interface PengumumanItem {
  id: string; judul: string; isi: string; createdAt: string; penulis: string;
}
interface PesertaItem {
  id: string; nama: string; kelas: string; inisial: string;
}
interface PesertaAggregate {
  id: string; nama: string; kelas: string; inisial: string;
  kehadiranStatus: string | null; kehadiranCount: number;
  catatanCount: number; karyaCount: number; nilai: number | null;
}

const BG_COLORS = ["#4F46E5", "#0F6E56", "#D97706", "#0369A1", "#7C3AED", "#DC2626"];
function thumbBg(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return BG_COLORS[n % BG_COLORS.length];
}
const AVATAR_PALETTE = ["#E8F0FF", "#FFE8F3", "#E8FFF0", "#FFF8E8", "#F3E8FF", "#E8F8FF"];
function avatarBg(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[n % AVATAR_PALETTE.length];
}

const STATUS_PILL: Record<string, { label: string; bg: string; color: string }> = {
  "belum-mulai":        { label: "Belum Mulai",       bg: "#ffe6ea", color: "#eb0b54" },
  "sedang-berlangsung": { label: "Sedang Berlangsung", bg: "#fff5de", color: "#c97a24" },
  "sudah-diisi":        { label: "Sudah Diisi",        bg: "#DCFCE7", color: "#15803D" },
  "selesai":            { label: "Selesai",            bg: "#f0f0f0", color: "#555555" },
};
const KEHADIRAN_PILL: Record<string, { label: string; bg: string; color: string }> = {
  hadir:             { label: "Hadir", bg: "#DCFCE7", color: "#15803D" },
  izin:              { label: "Izin",  bg: "#f2f2f2", color: "#6b6b6b" },
  sakit:             { label: "Sakit", bg: "#fff5de", color: "#c97a24" },
  "tanpa-keterangan":{ label: "Alpa",  bg: "#ffe6ea", color: "#eb0b54" },
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function DetailAktivitasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("Detail");
  const [pesertaSearch, setPesertaSearch] = useState("");
  const [pesertaKelasFilter, setPesertaKelasFilter] = useState<string>("semua");
  const [showPengumumanForm, setShowPengumumanForm] = useState(false);
  const [pgJudul, setPgJudul] = useState("");
  const [pgIsi, setPgIsi] = useState("");
  const [pgLoading, setPgLoading] = useState(false);

  const { data: a, isLoading } = useQuery<AktDetail>({
    queryKey: ["aktivitas", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}`);
      if (!r.ok) return null;
      return (await r.json()).data ?? null;
    },
  });

  const { data: pengumuman = [] } = useQuery<PengumumanItem[]>({
    queryKey: ["pengumuman", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/pengumuman`);
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
  });

  const { data: pesertaAggregate = [], isLoading: pesertaLoading } = useQuery<PesertaAggregate[]>({
    queryKey: ["aktivitas", id, "peserta-aggregate"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/peserta-aggregate`);
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
    enabled: activeTab === "Peserta",
  });

  const { data: pesertaList = [] } = useQuery<PesertaItem[]>({
    queryKey: ["aktivitas", id, "peserta"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/peserta`);
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
  });

  if (isLoading) return <div style={{ padding: 24, color: "var(--text-300)" }}>Memuat...</div>;
  if (!a) return <div style={{ padding: 24 }}>Aktivitas tidak ditemukan.</div>;

  const pill = STATUS_PILL[a.status] ?? STATUS_PILL["belum-mulai"];
  const bandColor = thumbBg(a.id);

  const uniqueKelas = Array.from(new Set(pesertaAggregate.map(p => p.kelas))).sort();
  const filteredPeserta = pesertaAggregate.filter(p => {
    const matchSearch = !pesertaSearch || p.nama.toLowerCase().includes(pesertaSearch.toLowerCase());
    const matchKelas = pesertaKelasFilter === "semua" || p.kelas === pesertaKelasFilter;
    return matchSearch && matchKelas;
  });

  async function submitPengumuman() {
    if (!pgJudul.trim() || !pgIsi.trim()) return;
    setPgLoading(true);
    try {
      await fetch(`/api/v1/aktivitas/${id}/pengumuman`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul: pgJudul.trim(), isi: pgIsi.trim() }),
      });
      qc.invalidateQueries({ queryKey: ["pengumuman", id] });
      setPgJudul("");
      setPgIsi("");
      setShowPengumumanForm(false);
    } finally {
      setPgLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* Header with color band */}
      <div style={{ background: bandColor, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)" }}>
          <button
            onClick={() => router.push(`/presensi?sheet=${id}`)}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "var(--radius-md)",
              width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "white", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Detail Aktivitas
          </p>
        </div>
        <div style={{ padding: "0 var(--space-4) var(--space-3)" }}>
          <span style={{
            display: "inline-flex", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
            background: pill.bg, color: pill.color, padding: "3px 10px", borderRadius: 100,
            marginBottom: "var(--space-2)",
          }}>
            {pill.label}
          </span>
          <h2 style={{ color: "white", fontSize: "var(--font-heading-6-size)", lineHeight: 1.4, marginTop: "var(--space-2)" }}>
            {a.nama}
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", overflowX: "auto", flexShrink: 0, display: "flex" }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flexShrink: 0, padding: "var(--space-3) var(--space-4)",
                fontFamily: "var(--font-body)", fontWeight: isActive ? 700 : 400,
                fontSize: "var(--font-label-1-size)",
                color: isActive ? "var(--primary-600)" : "var(--text-300)",
                borderBottom: isActive ? "2px solid var(--primary-600)" : "2px solid transparent",
                background: "transparent", border: "none", cursor: "pointer",
                transition: "all 150ms", position: "relative",
              }}
            >
              {tab}
              {tab === "Pengumuman" && pengumuman.length > 0 && (
                <span style={{
                  marginLeft: 4, background: "var(--primary-600)", color: "white",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 9,
                  padding: "1px 5px", borderRadius: 100,
                }}>
                  {pengumuman.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sticky CTA — di atas konten, selalu visible */}
      <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", flexShrink: 0 }}>
        {a.status === "sedang-berlangsung" || a.status === "belum-mulai" ? (
          <Link href={`/presensi/${id}/kehadiran`} className="btn btn-primary" style={{ textDecoration: "none", display: "flex" }}>
            Isi Presensi
          </Link>
        ) : (
          <Link href={`/presensi/${id}/kehadiran`} className="btn btn-outline" style={{ textDecoration: "none", display: "flex" }}>
            Lihat Rekap Kehadiran
          </Link>
        )}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--neutral-400)" }}>

        {/* ─── TAB: Detail ─── */}
        {activeTab === "Detail" && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
              <InfoRow icon={<Clock size={15} />} label={`${fmtDate(a.waktuMulai)} · ${fmtTime(a.waktuMulai)} – ${fmtTime(a.waktuSelesai)}`} />
              {a.lokasi && <InfoRow icon={<MapPin size={15} />} label={a.lokasi} />}
              <InfoRow icon={<Users size={15} />} label={`${a.jumlahPeserta} peserta · ${a.kehadiranSelesai} presensi diisi`} />
              {a.programNama && (
                <Link href={`/program/${a.programId}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "var(--space-3)", paddingTop: "var(--space-3)", marginTop: "var(--space-3)", borderTop: "1px solid var(--neutral-500)" }}>
                  <div style={{ width: 20, display: "flex", flexShrink: 0, color: "var(--text-300)" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                  </div>
                  <p style={{ flex: 1, fontSize: "var(--font-body-3-size)", color: "var(--primary-600)", fontWeight: 600 }}>{a.programNama}</p>
                  <ChevronRight size={14} color="var(--primary-600)" />
                </Link>
              )}
            </div>
            {a.deskripsi && (
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-label-1-size)", marginBottom: "var(--space-2)", color: "var(--text-200)" }}>Deskripsi</p>
                <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-200)", lineHeight: "var(--font-body-3-lh)" }}>{a.deskripsi}</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: Peserta ─── */}
        {activeTab === "Peserta" && (
          <div style={{ background: "var(--neutral-100)" }}>
            {/* Filter bar */}
            <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-500)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <div style={{ position: "relative" }}>
                <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-300)" }} />
                <input
                  type="search" className="input" placeholder="Cari peserta..."
                  value={pesertaSearch} onChange={e => setPesertaSearch(e.target.value)}
                  style={{ paddingLeft: 36, height: 38, borderRadius: 8, fontSize: 13 }}
                />
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)", overflowX: "auto", paddingBottom: 2 }}>
                {["semua", ...uniqueKelas].map(k => (
                  <button key={k} onClick={() => setPesertaKelasFilter(k)} style={{
                    padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap", flexShrink: 0,
                    background: pesertaKelasFilter === k ? "var(--primary-600)" : "var(--neutral-300)",
                    color: pesertaKelasFilter === k ? "white" : "var(--text-200)",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
                    border: "none", cursor: "pointer",
                  }}>
                    {k === "semua" ? `Semua · ${pesertaAggregate.length}` : k}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary stats */}
            <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--neutral-200)", borderBottom: "1px solid var(--neutral-400)" }}>
              <div style={{ display: "flex", gap: "var(--space-4)" }}>
                {[
                  { label: "Total Peserta", value: pesertaAggregate.length },
                  { label: "Sudah Hadir", value: pesertaAggregate.filter(p => p.kehadiranStatus === "hadir").length },
                  { label: "Ada Catatan", value: pesertaAggregate.filter(p => p.catatanCount > 0).length },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--primary-600)" }}>{s.value}</p>
                    <p style={{ fontSize: 10, color: "var(--text-300)", marginTop: 2 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Peserta list */}
            {pesertaLoading ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text-300)" }}>Memuat...</div>
            ) : filteredPeserta.length === 0 ? (
              <div style={{ padding: "var(--space-8) var(--space-4)", textAlign: "center", color: "var(--text-300)", fontSize: 13 }}>
                Tidak ada peserta ditemukan.
              </div>
            ) : filteredPeserta.map(p => {
              const kpill = p.kehadiranStatus ? KEHADIRAN_PILL[p.kehadiranStatus] : null;
              return (
                <Link key={p.id} href={`/presensi/${id}/peserta/${p.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "var(--space-3)",
                    padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-500)",
                    background: "var(--neutral-100)",
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: avatarBg(p.id), display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-200)",
                    }}>
                      {p.inisial}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2 }}>{p.nama}</p>
                      <p style={{ fontSize: 11, color: "var(--text-300)" }}>{p.kelas}</p>
                      <div style={{ display: "flex", gap: "var(--space-2)", marginTop: 4, flexWrap: "wrap" }}>
                        {kpill && (
                          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: kpill.bg, color: kpill.color, padding: "2px 7px", borderRadius: 100 }}>
                            {kpill.label}
                          </span>
                        )}
                        {p.catatanCount > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: "var(--primary-100)", color: "var(--primary-600)", padding: "2px 7px", borderRadius: 100 }}>
                            {p.catatanCount} catatan
                          </span>
                        )}
                        {p.karyaCount > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: "#F3E8FF", color: "#7C3AED", padding: "2px 7px", borderRadius: 100 }}>
                            {p.karyaCount} karya
                          </span>
                        )}
                        {p.nilai !== null && (
                          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)", background: "#DCFCE7", color: "#15803D", padding: "2px 7px", borderRadius: 100 }}>
                            Nilai: {p.nilai}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--text-300)" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ─── TAB: Kehadiran ─── */}
        {activeTab === "Kehadiran" && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)" }}>
            <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-300)", marginBottom: "var(--space-4)" }}>
              {a.kehadiranSelesai > 0
                ? `${a.kehadiranSelesai} dari ${a.jumlahPeserta} kehadiran sudah diisi.`
                : "Isi kehadiran peserta untuk sesi ini."}
            </p>
            <Link href={`/presensi/${id}/kehadiran`} className="btn btn-primary" style={{ textDecoration: "none", display: "flex" }}>
              {a.kehadiranSelesai > 0 ? "Edit Kehadiran" : "Isi Kehadiran"}
            </Link>
          </div>
        )}

        {/* ─── TAB: Umpan Balik ─── */}
        {activeTab === "Umpan Balik" && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)" }}>
            <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-300)", marginBottom: "var(--space-4)" }}>
              Berikan catatan dan umpan balik untuk sesi ini.
            </p>
            <Link href={`/presensi/${id}/umpan-balik`} className="btn btn-primary" style={{ textDecoration: "none", display: "flex" }}>
              Tulis Umpan Balik
            </Link>
          </div>
        )}

        {/* ─── TAB: Hasil Karya ─── */}
        {activeTab === "Hasil Karya" && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p style={{ fontSize: 13, color: "var(--text-300)", lineHeight: 1.5 }}>
              Upload dan kelola hasil karya peserta — foto, video, dan file lainnya. Tandai (tag) ke peserta lain agar muncul di profil mereka.
            </p>
            <Link href={`/presensi/${id}/hasil-karya`} className="btn btn-primary" style={{ textDecoration: "none", display: "flex" }}>
              Kelola Hasil Karya
            </Link>
          </div>
        )}

        {/* ─── TAB: Pengumuman ─── */}
        {activeTab === "Pengumuman" && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {pengumuman.length === 0 && !showPengumumanForm ? (
              <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-300)", textAlign: "center", padding: "var(--space-6) 0" }}>
                Belum ada pengumuman untuk aktivitas ini.
              </p>
            ) : pengumuman.map(pg => (
              <div key={pg.id} style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)", display: "flex", gap: "var(--space-3)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bell size={16} color="var(--primary-600)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-body-3-size)", marginBottom: 4 }}>{pg.judul}</p>
                  <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)", lineHeight: 1.5 }}>{pg.isi}</p>
                  <p style={{ fontSize: "var(--font-label-3-size)", color: "var(--text-300)", marginTop: 6 }}>{fmtDateTime(pg.createdAt)} · {pg.penulis}</p>
                </div>
              </div>
            ))}

            {showPengumumanForm ? (
              <div style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)" }}>Buat Pengumuman</p>
                  <button onClick={() => setShowPengumumanForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-300)", padding: 4 }}>
                    <X size={18} />
                  </button>
                </div>
                <input
                  className="input" placeholder="Judul pengumuman..."
                  value={pgJudul} onChange={e => setPgJudul(e.target.value)}
                  style={{ height: 44, fontSize: 14 }}
                />
                <textarea
                  className="input" placeholder="Isi pengumuman..." rows={4}
                  value={pgIsi} onChange={e => setPgIsi(e.target.value)}
                  style={{ height: "auto", resize: "none", fontSize: 13, lineHeight: 1.6, padding: "var(--space-3)" }}
                />
                <button
                  className="btn btn-primary"
                  onClick={submitPengumuman}
                  disabled={pgLoading || !pgJudul.trim() || !pgIsi.trim()}
                >
                  {pgLoading ? <span className="spinner" /> : "Kirim Pengumuman"}
                </button>
              </div>
            ) : (
              <button
                className="btn btn-outline"
                onClick={() => setShowPengumumanForm(true)}
              >
                + Buat Pengumuman
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
      <span style={{ color: "var(--text-300)", flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-200)", lineHeight: 1.5 }}>{label}</p>
    </div>
  );
}
