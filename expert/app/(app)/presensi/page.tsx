"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type Tab = "today" | "all";

interface AktApi {
  id: string;
  nama: string;
  programNama: string;
  type: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string | null;
  jumlahPeserta: number;
  status: string;
  kehadiranSelesai: number;
  deskripsi: string;
}

const PRESENSI_PILL: Record<string, { label: string; bg: string; color: string }> = {
  "belum-mulai":        { label: "Presensi Belum Diisi",  bg: "#ffe6ea", color: "#eb0b54" },
  "sedang-berlangsung": { label: "Presensi Sedang Diisi",  bg: "#fff5de", color: "#c97a24" },
  "sudah-diisi":        { label: "Presensi Selesai Diisi", bg: "#DCFCE7", color: "#15803D" },
  "selesai":            { label: "Selesai",                bg: "#f0f0f0", color: "#555" },
};

const BG_PALETTE = ["#E8F0FF", "#FFE8F3", "#E8FFF0", "#FFF8E8", "#F3E8FF", "#E8F8FF"];
function thumbBg(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return BG_PALETTE[n % BG_PALETTE.length];
}
function thumbInitials(nama: string) {
  return nama.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}

async function fetchAktivitas(filter: "today" | "all"): Promise<AktApi[]> {
  const qs = filter === "today" ? "?filter=today&type=mengajar" : "?type=mengajar";
  const r = await fetch(`/api/v1/aktivitas${qs}`);
  if (!r.ok) return [];
  return (await r.json()).data ?? [];
}

function AktivitasCard({ a, onClick }: { a: AktApi; onClick: () => void }) {
  const pill = PRESENSI_PILL[a.status] ?? PRESENSI_PILL["belum-mulai"];

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", background: "var(--neutral-100)", borderRadius: "var(--radius-xl)",
        border: "1px solid var(--neutral-500)", padding: "var(--space-3) var(--space-4)",
        display: "flex", flexDirection: "column", gap: "var(--space-2)",
        cursor: "pointer", textAlign: "left",
      }}
    >
      <span style={{
        display: "inline-block", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
        background: pill.bg, color: pill.color,
        padding: "3px 10px", borderRadius: "var(--radius-pill)",
      }}>
        {pill.label}
      </span>

      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "var(--radius-md)",
          background: thumbBg(a.id), flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "var(--text-200)", fontFamily: "var(--font-display)",
        }}>
          {thumbInitials(a.nama)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
            color: "var(--text-100)", lineHeight: 1.4, marginBottom: 4,
          }}>
            {a.nama}
          </p>
          {a.programNama && (
            <p style={{ fontSize: 12, color: "var(--text-300)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>
              {a.programNama}
            </p>
          )}
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-300)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {fmtTime(a.waktuMulai)} – {fmtTime(a.waktuSelesai)} WIB
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-300)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              <span>
                <strong style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-100)" }}>
                  {a.kehadiranSelesai}
                </strong>/{a.jumlahPeserta} presensi diisi
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function PresensiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("today");
  const [selected, setSelected] = useState<AktApi | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: me } = useQuery<{ id: string; nama: string; inisial: string; role: string }>({
    queryKey: ["me"],
    queryFn: async () => {
      const r = await fetch("/expert/api/auth/me");
      return r.ok ? (await r.json()).data?.expert : null;
    },
    staleTime: Infinity,
  });

  const { data: todayList = [] } = useQuery({
    queryKey: ["aktivitas", "today", "mengajar"],
    queryFn: () => fetchAktivitas("today"),
  });
  const { data: allList = [] } = useQuery({
    queryKey: ["aktivitas", "all", "mengajar"],
    queryFn: () => fetchAktivitas("all"),
  });
  const { data: notifList = [] } = useQuery<{ dibaca: boolean }[]>({
    queryKey: ["notifikasi", "unread"],
    queryFn: async () => {
      const r = await fetch("/api/v1/notifikasi?unreadOnly=true");
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
  });

  const unread = notifList.length;

  // Auto-open bottom sheet when ?sheet=id is in URL
  useEffect(() => {
    const sheetId = searchParams.get("sheet");
    if (!sheetId) return;
    const all = [...todayList, ...allList];
    const found = all.find(a => a.id === sheetId);
    if (found) {
      setSelected(found);
      router.replace("/presensi");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, todayList, allList]);
  const displayed = tab === "today" ? todayList : allList;
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      {/* Header */}
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-3) var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Image src="/logo.png" alt="SMM" width={36} height={28} style={{ objectFit: "contain", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)" }}>Sekolah Murid Merdeka</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Link href="/notifikasi" style={{ position: "relative", display: "flex", color: "var(--text-200)" }}>
              <Bell size={22} />
              {unread > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, width: 7, height: 7, borderRadius: "50%", background: "var(--danger-600)" }} />
              )}
            </Link>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserMenu(p => !p)}
                style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--primary-300)", cursor: "pointer", flexShrink: 0 }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: "var(--primary-700)", letterSpacing: 0.5 }}>
                  {me?.inisial ?? "?"}
                </span>
              </button>
              {showUserMenu && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100,
                  background: "var(--neutral-100)", border: "1px solid var(--neutral-500)",
                  borderRadius: "var(--radius-lg)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  minWidth: 200, overflow: "hidden",
                }}>
                  {me && (
                    <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text-100)" }}>{me.nama}</p>
                      <p style={{ fontSize: 11, color: "var(--text-300)", marginTop: 2 }}>{me.role}</p>
                    </div>
                  )}
                  {[
                    { label: "Profil Saya", href: "/profil" },
                    { label: "Hak Akses", href: "/hak-akses" },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowUserMenu(false)}
                      style={{ display: "block", padding: "var(--space-3) var(--space-4)", fontSize: 13, color: "var(--text-100)", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid var(--neutral-400)" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={async () => {
                      setShowUserMenu(false);
                      await fetch("/expert/api/auth/logout", { method: "POST" }).catch(() => {});
                      router.replace("/login");
                    }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "var(--space-3) var(--space-4)", fontSize: 13, color: "#eb0b54", fontWeight: 700, fontFamily: "var(--font-display)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", color: "var(--text-100)", marginBottom: "var(--space-1)" }}>
          Presensi
        </p>
        <p style={{ fontSize: 12, color: "var(--text-300)", lineHeight: 1.4 }}>
          Aktivitas mengajar yang membutuhkan presensi peserta.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", marginTop: "var(--space-3)", borderBottom: "1px solid var(--neutral-500)", marginLeft: "calc(-1 * var(--space-4))", marginRight: "calc(-1 * var(--space-4))", paddingLeft: "var(--space-4)" }}>
          {([{ key: "today", label: "Hari Ini" }, { key: "all", label: "Semua" }] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "var(--space-2) var(--space-4)",
              fontFamily: "var(--font-body)", fontWeight: tab === t.key ? 700 : 400,
              fontSize: 14, color: tab === t.key ? "var(--primary-600)" : "var(--text-300)",
              borderBottom: tab === t.key ? "2px solid var(--primary-600)" : "2px solid transparent",
              background: "transparent", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer",
              marginBottom: -1,
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "var(--space-4)" }}>
        {tab === "today" && (
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-300)", marginBottom: "var(--space-3)", fontFamily: "var(--font-display)" }}>
            {today}
          </p>
        )}

        {displayed.length > 0 && (
          <div style={{
            background: "var(--primary-100)", borderRadius: "var(--radius-lg)",
            padding: "var(--space-3) var(--space-4)",
            display: "flex", alignItems: "center", gap: "var(--space-2)",
            marginBottom: "var(--space-3)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ fontSize: 13, color: "var(--primary-600)", lineHeight: 1.4 }}>
              <strong>{displayed.length}</strong> aktivitas presensi.
            </p>
          </div>
        )}

        {displayed.length === 0 ? (
          <div className="empty-state">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-600)" strokeWidth="1.5" style={{ margin: "0 auto", display: "block" }}>
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-200)", marginTop: 12, marginBottom: 4 }}>
              Tidak Ada Aktivitas
            </p>
            <p style={{ fontSize: 13, color: "var(--text-300)" }}>
              {tab === "today" ? "Tidak ada aktivitas presensi hari ini." : "Tidak ada aktivitas mengajar."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {displayed.map(a => (
              <AktivitasCard key={a.id} a={a} onClick={() => setSelected(a)} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-4)" }} />

            <div style={{ marginBottom: "var(--space-4)", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
              <span style={{
                display: "inline-block", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
                background: (PRESENSI_PILL[selected.status] ?? PRESENSI_PILL["belum-mulai"]).bg,
                color: (PRESENSI_PILL[selected.status] ?? PRESENSI_PILL["belum-mulai"]).color,
                padding: "3px 10px", borderRadius: "var(--radius-pill)", marginBottom: "var(--space-2)",
              }}>
                {(PRESENSI_PILL[selected.status] ?? PRESENSI_PILL["belum-mulai"]).label}
              </span>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-100)", lineHeight: 1.4, marginBottom: "var(--space-2)" }}>
                {selected.nama}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: 12, color: "var(--text-300)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <span>Presensi:</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-100)" }}>
                  {selected.kehadiranSelesai} dari {selected.jumlahPeserta}
                </span>
              </div>
            </div>

            {[
              { icon: "📋", label: "Isi Presensi",                   href: `/presensi/${selected.id}/kehadiran` },
              { icon: "💬", label: "Umpan Balik & Catatan Internal", href: `/presensi/${selected.id}/umpan-balik` },
              { icon: "🖼️", label: "Hasil Karya",                   href: `/presensi/${selected.id}/hasil-karya` },
              { icon: "📢", label: "Pengumuman",                      href: `/presensi/${selected.id}/pengumuman` },
              { icon: "📊", label: "Detail Aktivitas",                href: `/presensi/${selected.id}` },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSelected(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "var(--space-3)",
                  padding: "var(--space-4) 0",
                  borderBottom: "1px solid var(--neutral-400)",
                  textDecoration: "none", color: "var(--text-100)",
                  fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14,
                }}
              >
                <span style={{ fontSize: 20, width: 24, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PresensiPage() {
  return (
    <Suspense>
      <PresensiContent />
    </Suspense>
  );
}
