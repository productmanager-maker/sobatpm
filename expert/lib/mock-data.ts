export type AktivitasStatus = "BELUM_MULAI" | "BERLANGSUNG" | "SELESAI" | "SUDAH_DIISI";
export type PenilaianStatus = "BELUM_DINILAI" | "SEBAGIAN_DINILAI" | "SELESAI_DINILAI";
export type AktivitasMode = "mengajar" | "menilai" | "materi";
export type KehadiranStatus = "HADIR" | "IZIN" | "SAKIT" | "TANPA_KETERANGAN" | "";
export type PengerjaaanStatus = "SELESAI_TEPAT_WAKTU" | "SELESAI_TERLAMBAT" | "BELUM_SELESAI" | "BELUM_MENGERJAKAN";

export interface Peserta {
  id: string;
  nama: string;
  email: string;
  avatar?: string;
  kehadiran: KehadiranStatus;
  pengerjaaanStatus?: PengerjaaanStatus;
  nilaiAkhir?: number;
}

export interface Aktivitas {
  id: string;
  judul: string;
  programId?: string;
  programNama?: string;
  mode: AktivitasMode;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  jumlahPeserta: number;
  deskripsi?: string;
  status: AktivitasStatus;
  penilaianStatus?: PenilaianStatus;
  penilaianProgress?: { selesai: number; total: number };
  pesertaSelesai?: number;
  pesertaDinilai?: number;
  pesertaUmpanBalik?: number;
  modulNama?: string;
  durasiMenit?: number;
  thumbnailEmoji: string;
  thumbnailColor: string;
  hasUmpanBalik: boolean;
  hasPengumuman: boolean;
}

export interface Program {
  id: string;
  nama: string;
  deskripsi: string;
  jumlahAktivitas: number;
  selesaiAktivitas: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  thumbnailColor: string;
  kategori: string;
  aktivitasDiskusi: string[];
  aktivitasTugas: string[];
  aktivitasMateri: string[];
}

export const PROGRAMS: Program[] = [
  {
    id: "p1",
    nama: "Rusak Strategi Pemasaran untuk Pemula",
    deskripsi: "Program intensif membangun strategi pemasaran digital yang efektif untuk pelaku bisnis baru.",
    jumlahAktivitas: 6,
    selesaiAktivitas: 2,
    tanggalMulai: "1 Feb 2026",
    tanggalSelesai: "28 Feb 2026",
    thumbnailColor: "#0519B0",
    kategori: "Marketing",
    aktivitasDiskusi: ["a1", "a2"],
    aktivitasTugas: ["a3"],
    aktivitasMateri: ["a4"],
  },
  {
    id: "p2",
    nama: "Jadikan Media Sosial Terinspirasi oleh Data",
    deskripsi: "Workshop praktis content creation berbasis data dan social media analytics.",
    jumlahAktivitas: 4,
    selesaiAktivitas: 1,
    tanggalMulai: "5 Feb 2026",
    tanggalSelesai: "20 Feb 2026",
    thumbnailColor: "#7C3AED",
    kategori: "Social Media",
    aktivitasDiskusi: ["a5"],
    aktivitasTugas: ["a6"],
    aktivitasMateri: [],
  },
  {
    id: "p3",
    nama: "Dasar-Dasar Team Leadership",
    deskripsi: "Program pengembangan kepemimpinan untuk manajer dan team lead.",
    jumlahAktivitas: 8,
    selesaiAktivitas: 4,
    tanggalMulai: "10 Jan 2026",
    tanggalSelesai: "10 Mar 2026",
    thumbnailColor: "#0891B2",
    kategori: "Leadership",
    aktivitasDiskusi: [],
    aktivitasTugas: ["a7"],
    aktivitasMateri: [],
  },
];

export const AKTIVITAS_LIST: Aktivitas[] = [
  {
    id: "a1",
    judul: "A. Team Marketing 8H — Sesi Diskusi",
    programId: "p1",
    programNama: "Rusak Strategi Pemasaran untuk Pemula",
    mode: "mengajar",
    tanggal: "Selasa, 11 Februari 2026",
    waktuMulai: "09:00",
    waktuSelesai: "12:00",
    lokasi: "Online — Zoom",
    jumlahPeserta: 12,
    deskripsi: "Sesi diskusi dan konsultasi strategi marketing bersama tim. Peserta akan belajar teknik mengidentifikasi target pasar dan menyusun pesan pemasaran yang efektif.",
    status: "BERLANGSUNG",
    thumbnailEmoji: "📣",
    thumbnailColor: "#0519B0",
    hasUmpanBalik: true,
    hasPengumuman: true,
    pesertaSelesai: 0,
    pesertaDinilai: 0,
    pesertaUmpanBalik: 2,
    modulNama: "Dasar Pemasaran",
    durasiMenit: 180,
  },
  {
    id: "a2",
    judul: "B. Word of Mouth — Beginner Journey yang Paling Efektif",
    programId: "p1",
    programNama: "Rusak Strategi Pemasaran untuk Pemula",
    mode: "mengajar",
    tanggal: "Kamis, 13 Februari 2026",
    waktuMulai: "13:00",
    waktuSelesai: "16:00",
    lokasi: "Gedung A Lt. 3 — Ruang Rapat",
    jumlahPeserta: 8,
    deskripsi: "Workshop interaktif tentang word-of-mouth marketing. Peserta akan mempraktikkan teknik storytelling untuk produk mereka.",
    status: "BELUM_MULAI",
    thumbnailEmoji: "💬",
    thumbnailColor: "#7C3AED",
    hasUmpanBalik: true,
    hasPengumuman: false,
  },
  {
    id: "a3",
    judul: "Penilaian Strategi Marketing — Studi Kasus",
    programId: "p1",
    programNama: "Rusak Strategi Pemasaran untuk Pemula",
    mode: "menilai",
    tanggal: "Jumat, 14 Februari 2026",
    waktuMulai: "10:00",
    waktuSelesai: "11:30",
    lokasi: "Online — Teams",
    jumlahPeserta: 12,
    deskripsi: "Peserta menyelesaikan studi kasus dan mempresentasikan strategi marketing untuk brand fiktif.",
    status: "BELUM_MULAI",
    penilaianStatus: "BELUM_DINILAI",
    penilaianProgress: { selesai: 0, total: 12 },
    pesertaSelesai: 8,
    pesertaDinilai: 0,
    pesertaUmpanBalik: 0,
    modulNama: "Strategi Lanjutan",
    durasiMenit: 90,
    thumbnailEmoji: "📋",
    thumbnailColor: "#0891B2",
    hasUmpanBalik: true,
    hasPengumuman: false,
  },
  {
    id: "a4",
    judul: "Modul 1 — Dasar Strategi Pemasaran Digital",
    programId: "p1",
    programNama: "Rusak Strategi Pemasaran untuk Pemula",
    mode: "materi",
    tanggal: "Senin, 10 Februari 2026",
    waktuMulai: "00:00",
    waktuSelesai: "23:59",
    lokasi: "Self-paced (Online)",
    jumlahPeserta: 12,
    deskripsi: "Materi dasar digital marketing yang dapat dipelajari secara mandiri oleh peserta.",
    status: "SUDAH_DIISI",
    thumbnailEmoji: "📚",
    thumbnailColor: "#D97706",
    hasUmpanBalik: false,
    hasPengumuman: false,
  },
  {
    id: "a5",
    judul: "A. Storytelling untuk Konten Instagram",
    programId: "p2",
    programNama: "Jadikan Media Sosial Terinspirasi oleh Data",
    mode: "mengajar",
    tanggal: "Selasa, 11 Februari 2026",
    waktuMulai: "14:00",
    waktuSelesai: "17:00",
    lokasi: "Studio Kreatif — Lantai 2",
    jumlahPeserta: 15,
    deskripsi: "Workshop praktik storytelling untuk platform Instagram. Peserta akan membuat konten berdasarkan data engagement.",
    status: "BERLANGSUNG",
    thumbnailEmoji: "📸",
    thumbnailColor: "#DC2626",
    hasUmpanBalik: true,
    hasPengumuman: true,
  },
  {
    id: "a6",
    judul: "Tugas Asesmen — Laporan Analitik Media Sosial",
    programId: "p2",
    programNama: "Jadikan Media Sosial Terinspirasi oleh Data",
    mode: "menilai",
    tanggal: "Rabu, 19 Februari 2026",
    waktuMulai: "09:00",
    waktuSelesai: "12:00",
    lokasi: "Online — Zoom",
    jumlahPeserta: 15,
    deskripsi: "Peserta mengumpulkan laporan analitik media sosial untuk brand pilihan mereka.",
    status: "BELUM_MULAI",
    penilaianStatus: "BELUM_DINILAI",
    penilaianProgress: { selesai: 0, total: 15 },
    pesertaSelesai: 11,
    pesertaDinilai: 0,
    pesertaUmpanBalik: 0,
    durasiMenit: 180,
    thumbnailEmoji: "📊",
    thumbnailColor: "#059669",
    hasUmpanBalik: true,
    hasPengumuman: false,
  },
  {
    id: "a7",
    judul: "Penilaian Akhir — Leadership Assessment",
    programId: "p3",
    programNama: "Dasar-Dasar Team Leadership",
    mode: "menilai",
    tanggal: "Senin, 10 Februari 2026",
    waktuMulai: "08:00",
    waktuSelesai: "17:00",
    lokasi: "Ruang Serbaguna Lt. 2",
    jumlahPeserta: 16,
    deskripsi: "Penilaian komprehensif kemampuan leadership yang mencakup presentasi, studi kasus, dan simulasi manajemen tim.",
    status: "SELESAI",
    penilaianStatus: "SELESAI_DINILAI",
    penilaianProgress: { selesai: 16, total: 16 },
    thumbnailEmoji: "🏆",
    thumbnailColor: "#0891B2",
    hasUmpanBalik: true,
    hasPengumuman: false,
  },
];

export const TODAY_AKTIVITAS = AKTIVITAS_LIST.filter(a =>
  a.tanggal.includes("11 Februari")
);

export const PRESENSI_AKTIVITAS = AKTIVITAS_LIST.filter(a => a.mode === "mengajar");
export const PENILAIAN_AKTIVITAS = AKTIVITAS_LIST.filter(a => a.mode === "menilai");

export const PESERTA_LIST: Peserta[] = [
  { id: "u1",  nama: "Ahmad Fauzi",   email: "ahmadfauzi@examplemail.com",   kehadiran: "", pengerjaaanStatus: "SELESAI_TEPAT_WAKTU",  nilaiAkhir: 70 },
  { id: "u2",  nama: "Budi Santoso",  email: "budisantoso@examplemail.com",  kehadiran: "", pengerjaaanStatus: "SELESAI_TEPAT_WAKTU",  nilaiAkhir: 80 },
  { id: "u3",  nama: "Citra Dewi",    email: "citradewi@examplemail.com",    kehadiran: "", pengerjaaanStatus: "SELESAI_TEPAT_WAKTU",  nilaiAkhir: 90 },
  { id: "u4",  nama: "Dian Purnama",  email: "dianpurnama@examplemail.com",  kehadiran: "", pengerjaaanStatus: "SELESAI_TERLAMBAT",    nilaiAkhir: 75.5 },
  { id: "u5",  nama: "Eva Maharani",  email: "evamaharani@examplemail.com",  kehadiran: "", pengerjaaanStatus: "SELESAI_TEPAT_WAKTU",  nilaiAkhir: 80 },
  { id: "u6",  nama: "Fajar Nugraha", email: "fajarnugraha@examplemail.com", kehadiran: "", pengerjaaanStatus: "BELUM_SELESAI",        nilaiAkhir: undefined },
  { id: "u7",  nama: "Gita Sari",     email: "gitasari@examplemail.com",     kehadiran: "", pengerjaaanStatus: "SELESAI_TEPAT_WAKTU",  nilaiAkhir: 80 },
  { id: "u8",  nama: "Hendra Wijaya", email: "hendrawijaya@examplemail.com", kehadiran: "", pengerjaaanStatus: "BELUM_MENGERJAKAN",    nilaiAkhir: undefined },
  { id: "u9",  nama: "Indra Kusuma",  email: "indrakusuma@examplemail.com",  kehadiran: "", pengerjaaanStatus: "SELESAI_TEPAT_WAKTU",  nilaiAkhir: 65 },
  { id: "u10", nama: "Jasmine Putri", email: "jasmineputri@examplemail.com", kehadiran: "", pengerjaaanStatus: "BELUM_MENGERJAKAN",    nilaiAkhir: undefined },
  { id: "u11", nama: "Kevin Halim",   email: "kevinhalim@examplemail.com",   kehadiran: "", pengerjaaanStatus: "SELESAI_TERLAMBAT",    nilaiAkhir: 55 },
  { id: "u12", nama: "Laila Nisa",    email: "lailanisa@examplemail.com",    kehadiran: "", pengerjaaanStatus: "SELESAI_TEPAT_WAKTU",  nilaiAkhir: 88 },
];

export const PENGERJAAAN_PILL: Record<PengerjaaanStatus, { label: string; bg: string; color: string }> = {
  SELESAI_TEPAT_WAKTU: { label: "Selesai (Tepat Waktu)", bg: "#d5ede9", color: "#008387" },
  SELESAI_TERLAMBAT:   { label: "Selesai (Terlambat)",   bg: "#ffe6ea", color: "#eb0b54" },
  BELUM_SELESAI:       { label: "Belum Selesai",          bg: "#fff5de", color: "#c97a24" },
  BELUM_MENGERJAKAN:   { label: "Belum Mengerjakan",      bg: "#f2f2f2", color: "#6b6b6b" },
};

export const STATUS_PILL: Record<AktivitasStatus, { label: string; css: string }> = {
  BELUM_MULAI:  { label: "Belum Mulai",  css: "status-belum-mulai" },
  BERLANGSUNG:  { label: "Berlangsung",  css: "status-berlangsung" },
  SELESAI:      { label: "Selesai",      css: "status-selesai" },
  SUDAH_DIISI:  { label: "Sudah Diisi",  css: "status-sudah-diisi" },
};

export const PENILAIAN_PILL: Record<PenilaianStatus, { label: string; css: string }> = {
  BELUM_DINILAI:    { label: "Belum Dinilai",    css: "status-belum-dinilai" },
  SEBAGIAN_DINILAI: { label: "Sebagian Dinilai",  css: "status-berlangsung" },
  SELESAI_DINILAI:  { label: "Selesai Dinilai",  css: "status-sudah-diisi" },
};

export const NOTIFIKASI = [
  {
    id: "n1",
    judul: "Jadwal Training Marketing Q2 Diperbarui",
    isi: "Harap perhatikan perubahan jadwal untuk sesi Training Marketing pada bulan April dan Mei 2026. Konfirmasi ketersediaan Anda paling lambat Jumat ini.",
    tanggal: "11 Feb 2026",
    terbaca: false,
    cta: { label: "Lihat Jadwal", href: "/presensi" },
  },
  {
    id: "n2",
    judul: "Reminder: Pengumpulan Laporan Aktivitas",
    isi: "Batas waktu pengumpulan laporan aktivitas bulan Januari adalah 15 Februari 2026. Pastikan semua data kehadiran sudah diisi.",
    tanggal: "10 Feb 2026",
    terbaca: false,
    cta: null,
  },
  {
    id: "n3",
    judul: "Selamat Datang di Platform Expert",
    isi: "Kami senang menyambut Anda sebagai Expert di platform kami. Mulai eksplorasi program dan aktivitas yang Anda pegang.",
    tanggal: "1 Feb 2026",
    terbaca: true,
    cta: null,
  },
];

// ─── Fase 3: Hasil Karya ────────────────────────────────────────────────────

export type KaryaStatus = "BELUM_DIREVIEW" | "DIREVIEW";

export interface KaryaEntry {
  id: string;
  aktivitasId: string;
  pesertaId: string;
  pesertaNama: string;
  namaFile: string;
  ukuranFile: string;
  waktuSubmit: string;
  catatanPeserta?: string;
  status: KaryaStatus;
  reviewNilai?: number;
  reviewCatatan?: string;
}

export const KARYA_LIST: KaryaEntry[] = [
  { id: "k1",  aktivitasId: "a3", pesertaId: "u1",  pesertaNama: "Ahmad Fauzi",   namaFile: "studi_kasus_marketing.pdf", ukuranFile: "2.1 MB", waktuSubmit: "2 jam lalu",   catatanPeserta: "Saya fokus pada strategi diferensiasi produk di pasar lokal.", status: "BELUM_DIREVIEW" },
  { id: "k2",  aktivitasId: "a3", pesertaId: "u2",  pesertaNama: "Budi Santoso",  namaFile: "marketing_case.pdf",        ukuranFile: "1.8 MB", waktuSubmit: "3 jam lalu",   catatanPeserta: "Analisis kompetitor sudah termasuk 3 merek utama.", status: "DIREVIEW", reviewNilai: 85, reviewCatatan: "Analisis sangat tajam, visualisasi data perlu ditingkatkan." },
  { id: "k3",  aktivitasId: "a3", pesertaId: "u3",  pesertaNama: "Citra Dewi",    namaFile: "citra_strategi.pdf",        ukuranFile: "3.2 MB", waktuSubmit: "5 jam lalu",   status: "BELUM_DIREVIEW" },
  { id: "k4",  aktivitasId: "a3", pesertaId: "u4",  pesertaNama: "Dian Purnama",  namaFile: "dian_kasus.pdf",            ukuranFile: "1.5 MB", waktuSubmit: "kemarin",      catatanPeserta: "Dikumpulkan terlambat karena sakit.", status: "DIREVIEW", reviewNilai: 72, reviewCatatan: "Konten baik walau terlambat. Perlu perbaikan struktur argumen." },
  { id: "k5",  aktivitasId: "a3", pesertaId: "u5",  pesertaNama: "Eva Maharani",  namaFile: "eva_marketing.pdf",         ukuranFile: "2.7 MB", waktuSubmit: "kemarin",      status: "BELUM_DIREVIEW" },
  { id: "k6",  aktivitasId: "a3", pesertaId: "u7",  pesertaNama: "Gita Sari",     namaFile: "gita_case_study.pdf",       ukuranFile: "2.0 MB", waktuSubmit: "2 hari lalu",  status: "DIREVIEW", reviewNilai: 78, reviewCatatan: "Pendekatan kreatif, data kuantitatif perlu lebih banyak." },
  { id: "k7",  aktivitasId: "a6", pesertaId: "u1",  pesertaNama: "Ahmad Fauzi",   namaFile: "laporan_analitik.pdf",      ukuranFile: "4.1 MB", waktuSubmit: "1 jam lalu",   catatanPeserta: "Data dari Instagram dan TikTok selama 3 bulan terakhir.", status: "BELUM_DIREVIEW" },
  { id: "k8",  aktivitasId: "a6", pesertaId: "u2",  pesertaNama: "Budi Santoso",  namaFile: "sosmed_report.pdf",         ukuranFile: "2.9 MB", waktuSubmit: "4 jam lalu",   status: "BELUM_DIREVIEW" },
  { id: "k9",  aktivitasId: "a6", pesertaId: "u3",  pesertaNama: "Citra Dewi",    namaFile: "analytics_citra.pdf",       ukuranFile: "3.5 MB", waktuSubmit: "6 jam lalu",   catatanPeserta: "Menganalisis 4 platform: IG, TikTok, Twitter, LinkedIn.", status: "DIREVIEW", reviewNilai: 90, reviewCatatan: "Sangat komprehensif. Insight actionable dan didukung data." },
];

// ─── Fase 3: Progres Belajar ─────────────────────────────────────────────────

export interface ProgresAktivitas {
  judul: string;
  keterangan: string;
  warnaKet: "normal" | "warning" | "danger";
}

export interface ProgresEntry {
  pesertaId: string;
  pesertaNama: string;
  persentase: number;
  aktivitasTerakhir: ProgresAktivitas[];
}

export interface ProgresProgram {
  programId: string;
  rataRata: number;
  peserta: ProgresEntry[];
}

export const PROGRES_LIST: ProgresProgram[] = [
  {
    programId: "p1",
    rataRata: 72,
    peserta: [
      { pesertaId: "u1",  pesertaNama: "Ahmad Fauzi",   persentase: 95, aktivitasTerakhir: [{ judul: "Sesi Diskusi Marketing", keterangan: "Hadir · Nilai 70", warnaKet: "normal" }, { judul: "Penilaian Strategi", keterangan: "Nilai 70 · 3 hari lalu", warnaKet: "normal" }] },
      { pesertaId: "u2",  pesertaNama: "Budi Santoso",  persentase: 82, aktivitasTerakhir: [{ judul: "Word of Mouth Workshop", keterangan: "Hadir · selesai", warnaKet: "normal" }, { judul: "Penilaian Strategi", keterangan: "Nilai 80 · 2 hari lalu", warnaKet: "normal" }] },
      { pesertaId: "u3",  pesertaNama: "Citra Dewi",    persentase: 91, aktivitasTerakhir: [{ judul: "Sesi Diskusi Marketing", keterangan: "Hadir · Nilai 90", warnaKet: "normal" }, { judul: "Modul 1 Materi", keterangan: "Selesai · kemarin", warnaKet: "normal" }] },
      { pesertaId: "u4",  pesertaNama: "Dian Purnama",  persentase: 63, aktivitasTerakhir: [{ judul: "Penilaian Strategi", keterangan: "Terlambat submit · 4 hari lalu", warnaKet: "warning" }, { judul: "Sesi Diskusi Marketing", keterangan: "Izin", warnaKet: "warning" }] },
      { pesertaId: "u5",  pesertaNama: "Eva Maharani",  persentase: 88, aktivitasTerakhir: [{ judul: "Word of Mouth Workshop", keterangan: "Hadir · selesai", warnaKet: "normal" }] },
      { pesertaId: "u6",  pesertaNama: "Fajar Nugraha", persentase: 31, aktivitasTerakhir: [{ judul: "Penilaian Strategi", keterangan: "Belum submit · deadline lewat 3 hari", warnaKet: "danger" }, { judul: "Sesi Diskusi Marketing", keterangan: "Tanpa keterangan", warnaKet: "danger" }] },
      { pesertaId: "u7",  pesertaNama: "Gita Sari",     persentase: 78, aktivitasTerakhir: [{ judul: "Sesi Diskusi Marketing", keterangan: "Hadir · Nilai 80", warnaKet: "normal" }] },
      { pesertaId: "u8",  pesertaNama: "Hendra Wijaya", persentase: 42, aktivitasTerakhir: [{ judul: "Penilaian Strategi", keterangan: "Belum mengerjakan · deadline besok", warnaKet: "warning" }, { judul: "Sesi Diskusi Marketing", keterangan: "Sakit", warnaKet: "normal" }] },
    ],
  },
  {
    programId: "p2",
    rataRata: 68,
    peserta: [
      { pesertaId: "u1",  pesertaNama: "Ahmad Fauzi",   persentase: 80, aktivitasTerakhir: [{ judul: "Storytelling Instagram", keterangan: "Hadir · selesai", warnaKet: "normal" }] },
      { pesertaId: "u3",  pesertaNama: "Citra Dewi",    persentase: 92, aktivitasTerakhir: [{ judul: "Laporan Analitik Sosmed", keterangan: "Nilai 90 · 2 hari lalu", warnaKet: "normal" }] },
      { pesertaId: "u5",  pesertaNama: "Eva Maharani",  persentase: 55, aktivitasTerakhir: [{ judul: "Laporan Analitik Sosmed", keterangan: "Belum submit · deadline hari ini", warnaKet: "warning" }] },
    ],
  },
];

export const PENGUMUMAN_LIST = [
  {
    id: "pg1",
    judul: "Perubahan Lokasi Sesi Besok",
    isi: "Sesi besok (13 Feb 2026) dipindahkan ke Ruang Rapat B lantai 4. Mohon hadir 10 menit lebih awal.",
    tanggal: "11 Feb 2026",
    penulis: "Admin Platform",
  },
  {
    id: "pg2",
    judul: "Update Materi — Modul 2 Tersedia",
    isi: "Materi Modul 2 sudah diunggah ke platform. Peserta dapat mulai mengaksesnya sekarang.",
    tanggal: "10 Feb 2026",
    penulis: "Admin Platform",
  },
];
