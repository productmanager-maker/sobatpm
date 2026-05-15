"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const ROLES = [
  {
    title: "Expert",
    icon: "🎓",
    color: "var(--primary-600)",
    bg: "var(--primary-100)",
    items: [
      "Lihat daftar program dan aktivitas yang dipegang",
      "Isi presensi peserta untuk sesi Diskusi & Konsultasi",
      "Berikan penilaian untuk Tugas Asesmen",
      "Tulis umpan balik dan catatan internal per peserta",
      "Review hasil karya yang dikumpulkan peserta",
      "Monitor progres belajar peserta per program",
      "Lihat dan kirim pengumuman dalam konteks aktivitas",
    ],
  },
  {
    title: "Tidak Dapat Dilakukan Expert",
    icon: "🚫",
    color: "#eb0b54",
    bg: "#ffe6ea",
    items: [
      "Menambah atau menghapus peserta dari program",
      "Mengubah jadwal atau detail aktivitas",
      "Mengakses data peserta di luar program yang dipegang",
      "Mengubah rubrik atau format penilaian",
      "Menerbitkan materi baru ke platform",
    ],
  },
];

export default function HakAksesPage() {
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <div style={{
        background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)",
        padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center",
        gap: "var(--space-3)", flexShrink: 0, height: 56,
      }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>Hak Akses</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-100)", marginBottom: 4 }}>
            Peran Anda: Expert
          </p>
          <p style={{ fontSize: 13, color: "var(--text-300)", lineHeight: 1.6 }}>
            Sebagai Expert, Anda bertanggung jawab untuk memfasilitasi pembelajaran peserta di program yang Anda pegang. Berikut adalah ringkasan hak akses Anda.
          </p>
        </div>

        {ROLES.map(role => (
          <div key={role.title} style={{
            background: "var(--neutral-100)", border: "1px solid var(--neutral-500)",
            borderRadius: "var(--radius-xl)", overflow: "hidden",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", background: role.bg, borderBottom: "1px solid var(--neutral-400)" }}>
              <span style={{ fontSize: 20 }}>{role.icon}</span>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: role.color }}>{role.title}</p>
            </div>
            <div style={{ padding: "var(--space-3) var(--space-4)" }}>
              {role.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "var(--space-2)", paddingTop: i > 0 ? "var(--space-2)" : 0 }}>
                  <span style={{ color: role.color, flexShrink: 0, marginTop: 2, fontSize: 12 }}>•</span>
                  <p style={{ fontSize: 13, color: "var(--text-200)", lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-lg)", padding: "var(--space-3) var(--space-4)" }}>
          <p style={{ fontSize: 12, color: "var(--text-300)", lineHeight: 1.6 }}>
            Ada pertanyaan tentang hak akses Anda? Hubungi Admin platform melalui menu Notifikasi atau email support.
          </p>
        </div>
      </div>
    </div>
  );
}
