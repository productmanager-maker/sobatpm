import { factory, primaryKey } from "@mswjs/data";

// ─── Date helpers ───────────────────────────────────────────────────────────
const today = new Date();
const daysAgo = (n: number, h = 9, m = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const todayAt = (h: number, m = 0) => {
  const d = new Date(today);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

export const db = factory({
  program: {
    id: primaryKey(String),
    nama: String,
    status: String,         // aktif | selesai
    kategori: String,
    tanggalMulai: String,
    tanggalSelesai: String,
    jumlahPeserta: Number,
    jumlahAktivitas: Number,
    selesaiAktivitas: Number,
    thumbnailColor: String,
    deskripsi: String,
  },
  aktivitas: {
    id: primaryKey(String),
    nama: String,
    programId: String,
    programNama: String,
    type: String,           // mengajar | menilai | materi
    waktuMulai: String,     // ISO
    waktuSelesai: String,   // ISO
    jumlahPeserta: Number,
    status: String,         // belum-mulai | sedang-berlangsung | selesai | sudah-diisi
    deskripsi: String,
    thumbnailColor: String,
    thumbnailEmoji: String,
    modulNama: String,
    durasiMenit: Number,
    lokasi: String,
  },
  peserta: {
    id: primaryKey(String),
    nama: String,
    email: String,
    programId: String,
  },
  kehadiran: {
    id: primaryKey(String),
    aktivitasId: String,
    pesertaId: String,
    status: String,         // hadir | izin | sakit | tanpa-keterangan
    updatedAt: String,
  },
  notifikasi: {
    id: primaryKey(String),
    judul: String,
    konten: String,
    type: String,
    read: Boolean,
    aktivitasId: String,
    createdAt: String,
  },
});

// ─── Seed: Programs ──────────────────────────────────────────────────────────

db.program.create({
  id: "p1",
  nama: "Rusak Strategi Pemasaran untuk Pemula",
  status: "aktif",
  kategori: "Marketing",
  tanggalMulai: "1 Feb 2026",
  tanggalSelesai: "28 Feb 2026",
  jumlahPeserta: 18,
  jumlahAktivitas: 6,
  selesaiAktivitas: 2,
  thumbnailColor: "#0519B0",
  deskripsi: "Program intensif membangun strategi pemasaran digital yang efektif untuk pelaku bisnis baru.",
});

db.program.create({
  id: "p2",
  nama: "Jadikan Media Sosial Terinspirasi oleh Data",
  status: "aktif",
  kategori: "Social Media",
  tanggalMulai: "5 Feb 2026",
  tanggalSelesai: "20 Feb 2026",
  jumlahPeserta: 12,
  jumlahAktivitas: 4,
  selesaiAktivitas: 1,
  thumbnailColor: "#7C3AED",
  deskripsi: "Workshop praktis content creation berbasis data dan social media analytics.",
});

db.program.create({
  id: "p3",
  nama: "Dasar-Dasar Team Leadership",
  status: "selesai",
  kategori: "Leadership",
  tanggalMulai: "10 Jan 2026",
  tanggalSelesai: "31 Jan 2026",
  jumlahPeserta: 15,
  jumlahAktivitas: 5,
  selesaiAktivitas: 5,
  thumbnailColor: "#0891B2",
  deskripsi: "Keterampilan dasar kepemimpinan tim untuk manajer baru dan calon pemimpin.",
});

// ─── Seed: Aktivitas (10 total, a5+a6 = hari ini) ───────────────────────────

const aktivitasSeed = [
  // Program A — mengajar (past)
  { id: "a1", nama: "Pengenalan Strategi Pemasaran", programId: "p1", programNama: "Rusak Strategi Pemasaran untuk Pemula", type: "mengajar", waktuMulai: daysAgo(7, 9), waktuSelesai: daysAgo(7, 12), jumlahPeserta: 18, status: "sudah-diisi", deskripsi: "Sesi pengenalan konsep dasar strategi pemasaran digital.", thumbnailColor: "#DBEAFE", thumbnailEmoji: "📣", modulNama: "Dasar Pemasaran", durasiMenit: 180, lokasi: "Zoom Meeting" },
  { id: "a2", nama: "Workshop Riset Target Pasar", programId: "p1", programNama: "Rusak Strategi Pemasaran untuk Pemula", type: "mengajar", waktuMulai: daysAgo(3, 9), waktuSelesai: daysAgo(3, 12), jumlahPeserta: 18, status: "belum-mulai", deskripsi: "Praktik riset dan analisis target pasar.", thumbnailColor: "#DBEAFE", thumbnailEmoji: "🔍", modulNama: "Dasar Pemasaran", durasiMenit: 180, lokasi: "Zoom Meeting" },
  // Program A — menilai
  { id: "a3", nama: "Penilaian Strategi Pemasaran", programId: "p1", programNama: "Rusak Strategi Pemasaran untuk Pemula", type: "menilai", waktuMulai: daysAgo(5, 9), waktuSelesai: daysAgo(5, 11), jumlahPeserta: 18, status: "selesai", deskripsi: "Asesmen strategi pemasaran peserta.", thumbnailColor: "#EDE9FE", thumbnailEmoji: "📝", modulNama: "Strategi Lanjutan", durasiMenit: 90, lokasi: "" },
  // Program A — materi
  { id: "a4", nama: "Materi: Dasar Digital Marketing", programId: "p1", programNama: "Rusak Strategi Pemasaran untuk Pemula", type: "materi", waktuMulai: daysAgo(10, 8), waktuSelesai: daysAgo(10, 9), jumlahPeserta: 18, status: "selesai", deskripsi: "Modul digital marketing dasar untuk pemula.", thumbnailColor: "#FEF3C7", thumbnailEmoji: "📚", modulNama: "", durasiMenit: 60, lokasi: "" },
  // Program B — mengajar HARI INI
  { id: "a5", nama: "Analisis Konten Sosial Media", programId: "p2", programNama: "Jadikan Media Sosial Terinspirasi oleh Data", type: "mengajar", waktuMulai: todayAt(9), waktuSelesai: todayAt(12), jumlahPeserta: 12, status: "sedang-berlangsung", deskripsi: "Sesi live analisis performa konten sosial media.", thumbnailColor: "#F3E8FF", thumbnailEmoji: "📊", modulNama: "Analytics Dasar", durasiMenit: 180, lokasi: "Google Meet" },
  // Program B — menilai HARI INI
  { id: "a6", nama: "Tugas Asesmen: Konten Brief", programId: "p2", programNama: "Jadikan Media Sosial Terinspirasi oleh Data", type: "menilai", waktuMulai: todayAt(14), waktuSelesai: todayAt(16), jumlahPeserta: 12, status: "belum-mulai", deskripsi: "Asesmen pembuatan konten brief berbasis data.", thumbnailColor: "#FCE7F3", thumbnailEmoji: "✍️", modulNama: "", durasiMenit: 120, lokasi: "" },
  // Program B — materi
  { id: "a7", nama: "Materi: Social Media Analytics", programId: "p2", programNama: "Jadikan Media Sosial Terinspirasi oleh Data", type: "materi", waktuMulai: daysAgo(2, 8), waktuSelesai: daysAgo(2, 9), jumlahPeserta: 12, status: "selesai", deskripsi: "Pengenalan tools analytics untuk sosial media.", thumbnailColor: "#E0F2FE", thumbnailEmoji: "🛠️", modulNama: "", durasiMenit: 60, lokasi: "" },
  // Program C (selesai)
  { id: "a8", nama: "Leadership Fundamentals", programId: "p3", programNama: "Dasar-Dasar Team Leadership", type: "mengajar", waktuMulai: daysAgo(30, 9), waktuSelesai: daysAgo(30, 12), jumlahPeserta: 15, status: "sudah-diisi", deskripsi: "Fondasi kepemimpinan tim.", thumbnailColor: "#CFFAFE", thumbnailEmoji: "🎯", modulNama: "Leadership", durasiMenit: 180, lokasi: "Offline" },
  { id: "a9", nama: "Decision Making Workshop", programId: "p3", programNama: "Dasar-Dasar Team Leadership", type: "mengajar", waktuMulai: daysAgo(25, 9), waktuSelesai: daysAgo(25, 12), jumlahPeserta: 15, status: "sudah-diisi", deskripsi: "Workshop pengambilan keputusan.", thumbnailColor: "#CFFAFE", thumbnailEmoji: "⚡", modulNama: "Leadership", durasiMenit: 180, lokasi: "Offline" },
  { id: "a10", nama: "Asesmen Kepemimpinan Final", programId: "p3", programNama: "Dasar-Dasar Team Leadership", type: "menilai", waktuMulai: daysAgo(20, 9), waktuSelesai: daysAgo(20, 11), jumlahPeserta: 15, status: "selesai", deskripsi: "Asesmen final kepemimpinan.", thumbnailColor: "#D1FAE5", thumbnailEmoji: "🏆", modulNama: "Final", durasiMenit: 120, lokasi: "" },
];

aktivitasSeed.forEach(a => db.aktivitas.create(a));

// ─── Seed: Peserta (18 di p1, 12 di p2) ─────────────────────────────────────

const NAMES = [
  "Ahmad Fauzi", "Siti Rahayu", "Budi Prayoga", "Dewi Kusuma", "Eko Prasetyo",
  "Fitri Handayani", "Hendra Wijaya", "Indah Permata", "Joko Santoso", "Kartika Dewi",
  "Lukman Hakim", "Maya Anggraini", "Nanda Putra", "Oktavia Sari", "Prabowo Herlambang",
  "Qori Nabilah", "Rendi Kurniawan", "Sari Agustina", "Teguh Wibowo", "Ulfa Ramadhani",
  "Verry Septian", "Wulandari Putri", "Xandro Pratama", "Yeni Susanti", "Zainal Abidin",
  "Amalia Rizki", "Bagas Pramudya", "Citra Maharani", "Diky Firmansyah", "Eka Putranto",
];

NAMES.forEach((nama, i) => {
  const idx = i + 1;
  db.peserta.create({
    id: `ps${idx}`,
    nama,
    email: nama.toLowerCase().replace(/ /g, ".") + "@peserta.co",
    programId: idx <= 18 ? "p1" : "p2",
  });
});

// ─── Seed: Notifikasi (5 total, 3 unread) ────────────────────────────────────

[
  { id: "n1", judul: "Tugas Baru: Konten Brief", konten: "Peserta sudah mulai mengumpulkan tugas Konten Brief. Segera buka dan berikan penilaian.", type: "tugas", read: false, aktivitasId: "a6", createdAt: todayAt(8, 30) },
  { id: "n2", judul: "Presensi Belum Diisi", konten: "Analisis Konten Sosial Media hari ini belum diisi presensinya.", type: "presensi", read: false, aktivitasId: "a5", createdAt: todayAt(7) },
  { id: "n3", judul: "Feedback Diterima", konten: "3 peserta memberikan feedback untuk sesi Analisis Konten Sosial Media.", type: "feedback", read: false, aktivitasId: "a5", createdAt: todayAt(6) },
  { id: "n4", judul: "Pengumuman dari Admin", konten: "Jadwal program bulan Maret 2026 sudah diunggah.", type: "pengumuman", read: true, aktivitasId: "", createdAt: daysAgo(1) },
  { id: "n5", judul: "Program C Selesai", konten: "Program Dasar-Dasar Team Leadership telah selesai. Terima kasih atas kontribusi Anda.", type: "program", read: true, aktivitasId: "", createdAt: daysAgo(7) },
].forEach(n => db.notifikasi.create(n));

// ─── Helpers (exported) ───────────────────────────────────────────────────────

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

export const EXPERT = {
  id: "expert-1",
  name: "Budi Santoso",
  email: "budi.santoso@sekolahmu.co.id",
  roles: ["mengajar", "menilai"],
  avatarUrl: null,
} as const;
