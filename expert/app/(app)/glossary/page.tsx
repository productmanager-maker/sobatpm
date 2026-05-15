"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";

const TERMS = [
  { term: "Expert",                def: "Fasilitator atau instruktur yang memimpin program pembelajaran. Memiliki tanggung jawab mengajar, menilai, dan memantau progres peserta." },
  { term: "Aktivitas",             def: "Unit terkecil dalam sebuah program. Bisa berupa Diskusi & Konsultasi (sesi tatap muka/online), Tugas Asesmen (evaluasi), atau Materi (konten mandiri)." },
  { term: "Program",               def: "Kumpulan aktivitas yang tersusun untuk mencapai satu tujuan pembelajaran. Peserta mendaftar ke program, bukan ke aktivitas individual." },
  { term: "Presensi",              def: "Catatan kehadiran peserta dalam satu sesi aktivitas (Diskusi & Konsultasi). Status: Hadir, Izin, Sakit, Tanpa Keterangan." },
  { term: "Penilaian",             def: "Proses evaluasi hasil kerja peserta pada Tugas Asesmen. Expert memberikan nilai (0–100) dan catatan per peserta." },
  { term: "Hasil Karya",           def: "File atau dokumen yang dikumpulkan peserta sebagai jawaban dari Tugas Asesmen. Expert mereview dan memberikan nilai." },
  { term: "Progres Belajar",       def: "Persentase penyelesaian aktivitas oleh peserta dalam sebuah program. Dihitung berdasarkan kombinasi kehadiran, submission, dan nilai." },
  { term: "Umpan Balik",           def: "Catatan kualitatif dari Expert untuk peserta setelah satu sesi. Dapat dilihat oleh peserta." },
  { term: "Catatan Internal",      def: "Catatan yang hanya bisa dilihat oleh Expert dan Admin. Tidak tampil ke peserta." },
  { term: "Tugas Asesmen",         def: "Jenis aktivitas di mana peserta mengerjakan dan mengumpulkan karya/hasil kerja untuk dinilai oleh Expert." },
  { term: "Diskusi & Konsultasi",  def: "Jenis aktivitas berupa sesi langsung (online atau tatap muka). Memerlukan presensi." },
  { term: "Materi",                def: "Konten belajar mandiri (self-paced) yang bisa diakses peserta kapan saja. Tidak memerlukan presensi." },
  { term: "Perlu Perhatian",       def: "Label pada peserta dengan persentase penyelesaian < 50%. Menandakan peserta membutuhkan dukungan lebih." },
  { term: "LERN",                  def: "Design System yang digunakan di Platform Expert. Mendefinisikan warna, tipografi, spacing, dan komponen UI." },
];

export default function GlossaryPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = query
    ? TERMS.filter(t => t.term.toLowerCase().includes(query.toLowerCase()) || t.def.toLowerCase().includes(query.toLowerCase()))
    : TERMS;

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
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>Glossary</p>
      </div>

      <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-300)" }} />
          <input
            type="search"
            className="input"
            placeholder="Cari istilah..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 38, height: 40, borderRadius: 10, fontSize: 13 }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-300)", textAlign: "center", padding: "var(--space-8) var(--space-4)" }}>
            Tidak ada istilah yang sesuai.
          </p>
        ) : (
          <div style={{ padding: "0 var(--space-4)" }}>
            {filtered.map((t, i) => (
              <div key={t.term} style={{
                paddingTop: "var(--space-4)", paddingBottom: "var(--space-4)",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--neutral-400)" : "none",
              }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: 6 }}>
                  {t.term}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-200)", lineHeight: 1.6 }}>
                  {t.def}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
