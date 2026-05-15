/**
 * PLATFORM EXPERT — MASTER SEED DATA
 * Mengisi SETIAP halaman dan route tanpa empty state
 *
 * Coverage per route:
 *   /presensi                     → aktivitas hari ini (4 status berbeda)
 *   /presensi/[id]                → detail semua tipe (mengajar/menilai/materi)
 *   /presensi/[id]/kehadiran      → 30 peserta, draft + submitted
 *   /presensi/[id]/peserta/[id]   → riwayat kehadiran + penilaian + catatan
 *   /presensi/[id]/umpan-balik    → umpan balik terisi
 *   /presensi/[id]/pengumuman     → pengumuman aktif
 *   /penilaian                    → mix belum/sebagian/selesai + overdue
 *   /penilaian/[id]/nilai         → form penilaian, semua peserta
 *   /program                      → 15+ program aktif + selesai
 *   /program/[id]                 → detail + 3 section terisi
 *   /program/[id]/diskusi-konsultasi → list mengajar
 *   /program/[id]/tugas-asesmen   → list menilai
 *   /program/[id]/materi          → list materi
 *   /program/[id]/umpan-balik     → umpan balik program
 *   /notifikasi                   → 10 notif, 5 unread
 *   /notifikasi/[id]              → detail + CTA kontekstual
 *   /hak-akses                    → roles + permissions
 *   /glossary                     → 20 istilah
 *   /brand-identity               → static (tidak perlu seed)
 *
 * Gunakan: import MASTER_SEED from './master-seed'
 */

// ─────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────
const d = (offsetDays: number, hour = 9, minute = 0): string => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, minute, 0, 0);
  return dt.toISOString();
};

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rng = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// ═══════════════════════════════════════════════════════════════════
// 1. EXPERTS
// ═══════════════════════════════════════════════════════════════════
export const EXPERTS = [
  {
    id: "exp-001",
    nama: "Mega Kurnia",
    email: "mega.kurnia@sekolahmu.co.id",
    password: "dummy",
    role: "expert",
    permissions: ["mengajar", "menilai", "umpan-balik", "pengumuman"],
    avatarUrl: null,
    inisial: "MK",
    jabatan: "Expert Senior — Sains & Matematika",
  },
  {
    id: "exp-002",
    nama: "Reza Firmansyah",
    email: "reza.firmansyah@sekolahmu.co.id",
    password: "dummy",
    role: "expert",
    permissions: ["mengajar", "umpan-balik", "pengumuman"],
    avatarUrl: null,
    inisial: "RF",
    jabatan: "Expert — Bahasa & Seni",
  },
  {
    id: "exp-003",
    nama: "Diana Puspita",
    email: "diana.puspita@sekolahmu.co.id",
    password: "dummy",
    role: "expert",
    permissions: ["menilai", "umpan-balik"],
    avatarUrl: null,
    inisial: "DP",
    jabatan: "Expert Asesmen — Menulis & Literasi",
  },
  {
    id: "exp-004",
    nama: "Sinta Ariani",
    email: "sinta.ariani@sekolahmu.co.id",
    password: "dummy",
    role: "academic_lead",
    permissions: [
      "lihat-semua-program", "isi-kehadiran-semua", "assign-program",
      "assign-aktivitas", "reassign-expert", "kirim-pengumuman-global",
      "lihat-audit-log", "lihat-semua-peserta", "override-kehadiran",
      "mengajar", "menilai", "umpan-balik", "pengumuman",
    ],
    avatarUrl: null,
    inisial: "SA",
    jabatan: "Academic Lead",
  },
];

// ═══════════════════════════════════════════════════════════════════
// 2. PESERTA — 30 orang lengkap
// ═══════════════════════════════════════════════════════════════════
export const PESERTA = [
  { id: "p-01", nama: "Aditya Prayoga",       kelas: "10-A", inisial: "AP", catatanKehadiran: "konsisten" },
  { id: "p-02", nama: "Berliana Safira",       kelas: "10-A", inisial: "BS", catatanKehadiran: "konsisten" },
  { id: "p-03", nama: "Calvin Nugroho",        kelas: "10-A", inisial: "CN", catatanKehadiran: "konsisten" },
  { id: "p-04", nama: "Dinda Maharani",        kelas: "10-A", inisial: "DM", catatanKehadiran: "konsisten" },
  { id: "p-05", nama: "Evan Firmansyah",       kelas: "10-A", inisial: "EF", catatanKehadiran: "konsisten" },
  { id: "p-06", nama: "Farah Aulia",           kelas: "10-B", inisial: "FA", catatanKehadiran: "konsisten" },
  { id: "p-07", nama: "Gibran Ramadhan",       kelas: "10-B", inisial: "GR", catatanKehadiran: "2x izin" },
  { id: "p-08", nama: "Hana Fitriani",         kelas: "10-B", inisial: "HF", catatanKehadiran: "konsisten" },
  { id: "p-09", nama: "Ilham Saputra",         kelas: "10-B", inisial: "IS", catatanKehadiran: "1x sakit" },
  { id: "p-10", nama: "Jessica Tanaka",        kelas: "10-B", inisial: "JT", catatanKehadiran: "konsisten" },
  { id: "p-11", nama: "Kevin Adiputra",        kelas: "10-C", inisial: "KA", catatanKehadiran: "⚠ sering absen" },
  { id: "p-12", nama: "Lestari Ningrum",       kelas: "10-C", inisial: "LN", catatanKehadiran: "konsisten" },
  { id: "p-13", nama: "Muhammad Hafiz",        kelas: "10-C", inisial: "MH", catatanKehadiran: "konsisten" },
  { id: "p-14", nama: "Nadira Putri",          kelas: "10-C", inisial: "NP", catatanKehadiran: "1x tanpa ket" },
  { id: "p-15", nama: "Omar Hadiwijaya",       kelas: "10-C", inisial: "OH", catatanKehadiran: "konsisten" },
  { id: "p-16", nama: "Pingkan Lorenza",       kelas: "10-D", inisial: "PL", catatanKehadiran: "konsisten" },
  { id: "p-17", nama: "Qisthi Amalia",         kelas: "10-D", inisial: "QA", catatanKehadiran: "⚠ sering absen" },
  { id: "p-18", nama: "Rangga Aditya",         kelas: "10-D", inisial: "RA", catatanKehadiran: "2x sakit" },
  { id: "p-19", nama: "Sinta Dewi",            kelas: "10-D", inisial: "SD", catatanKehadiran: "konsisten" },
  { id: "p-20", nama: "Taufan Hidayat",        kelas: "10-D", inisial: "TH", catatanKehadiran: "konsisten" },
  { id: "p-21", nama: "Ulfah Rahmawati",       kelas: "10-E", inisial: "UR", catatanKehadiran: "konsisten" },
  { id: "p-22", nama: "Valentino Santoso",     kelas: "10-E", inisial: "VS", catatanKehadiran: "1x izin" },
  { id: "p-23", nama: "Winda Kusuma",          kelas: "10-E", inisial: "WK", catatanKehadiran: "konsisten" },
  { id: "p-24", nama: "Xena Priyatno",         kelas: "10-E", inisial: "XP", catatanKehadiran: "konsisten" },
  { id: "p-25", nama: "Yoga Pratama",          kelas: "10-E", inisial: "YP", catatanKehadiran: "⚠ 2x tanpa ket" },
  { id: "p-26", nama: "Zahra Nabila",          kelas: "10-F", inisial: "ZN", catatanKehadiran: "konsisten" },
  { id: "p-27", nama: "Ananda Rizky",          kelas: "10-F", inisial: "AR", catatanKehadiran: "konsisten" },
  { id: "p-28", nama: "Badriyah Latif",        kelas: "10-F", inisial: "BL", catatanKehadiran: "1x sakit" },
  { id: "p-29", nama: "Cahyo Wibisono",        kelas: "10-F", inisial: "CW", catatanKehadiran: "konsisten" },
  { id: "p-30", nama: "Dian Ayu Lestari",      kelas: "10-F", inisial: "DA", catatanKehadiran: "konsisten" },
];

const ALL_PESERTA_IDS = PESERTA.map(p => p.id);

// ═══════════════════════════════════════════════════════════════════
// 3. PROGRAMS — 18 program (15 aktif, 3 selesai)
// ═══════════════════════════════════════════════════════════════════
export const PROGRAMS = [
  // ── AKTIF ────────────────────────────────────────────────────────
  {
    id: "prog-01", expertId: "exp-001",
    nama: "Literasi Sains — Kelas 10",
    deskripsi: "Program pengembangan kemampuan berpikir ilmiah untuk siswa kelas 10. Mencakup metode ilmiah, eksperimen virtual, analisis data, dan presentasi hasil penelitian mini.",
    tanggalMulai: d(-120), tanggalSelesai: d(60), status: "aktif", jumlahPeserta: 30,
    totalAktivitas: 14, aktivitasSelesai: 11,
  },
  {
    id: "prog-02", expertId: "exp-001",
    nama: "Matematika Olimpiade — Junior",
    deskripsi: "Persiapan OSN Matematika tingkat kabupaten untuk siswa kelas 10–11. Fokus pada aljabar, kombinatorika, geometri bidang, dan teori bilangan dengan teknik olimpiade.",
    tanggalMulai: d(-90), tanggalSelesai: d(30), status: "aktif", jumlahPeserta: 15,
    totalAktivitas: 7, aktivitasSelesai: 6,
  },
  {
    id: "prog-03", expertId: "exp-001",
    nama: "Bahasa Indonesia — Esai Argumentatif",
    deskripsi: "Melatih kemampuan menulis esai argumentatif yang logis dan persuasif. Setiap sesi peserta menulis, mereview, dan mendapatkan umpan balik langsung dari Expert.",
    tanggalMulai: d(-80), tanggalSelesai: d(20), status: "aktif", jumlahPeserta: 18,
    totalAktivitas: 5, aktivitasSelesai: 4,
  },
  {
    id: "prog-04", expertId: "exp-001",
    nama: "Fisika Modern — Relativitas & Kuantum",
    deskripsi: "Eksplorasi fisika modern untuk siswa kelas 12. Relativitas Einstein, dualitas gelombang-partikel, prinsip ketidakpastian, dan implikasi filosofis mekanika kuantum.",
    tanggalMulai: d(-70), tanggalSelesai: d(50), status: "aktif", jumlahPeserta: 12,
    totalAktivitas: 5, aktivitasSelesai: 3,
  },
  {
    id: "prog-05", expertId: "exp-001",
    nama: "Critical Thinking & Debat",
    deskripsi: "Melatih kemampuan berpikir kritis dan berdebat secara terstruktur. Format debat Australasian, analisis logical fallacy, dan argumentasi berbasis bukti.",
    tanggalMulai: d(-60), tanggalSelesai: d(45), status: "aktif", jumlahPeserta: 14,
    totalAktivitas: 5, aktivitasSelesai: 3,
  },
  {
    id: "prog-06", expertId: "exp-001",
    nama: "Kimia Organik Dasar",
    deskripsi: "Pengenalan kimia organik: gugus fungsi, reaksi substitusi dan eliminasi, identifikasi senyawa, dan sintesis sederhana menggunakan simulasi virtual.",
    tanggalMulai: d(-55), tanggalSelesai: d(35), status: "aktif", jumlahPeserta: 16,
    totalAktivitas: 5, aktivitasSelesai: 3,
  },
  {
    id: "prog-07", expertId: "exp-001",
    nama: "English for Academic Purposes",
    deskripsi: "Kemampuan bahasa Inggris akademik: academic writing, reading comprehension teks ilmiah, dan presentasi formal dalam bahasa Inggris.",
    tanggalMulai: d(-50), tanggalSelesai: d(40), status: "aktif", jumlahPeserta: 20,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  {
    id: "prog-08", expertId: "exp-001",
    nama: "Sejarah & Analisis Peristiwa Dunia",
    deskripsi: "Menelaah peristiwa sejarah abad 20 dengan pendekatan multiperspektif. Mengembangkan kemampuan analisis kausalitas, konteks, dan relevansi masa kini.",
    tanggalMulai: d(-45), tanggalSelesai: d(55), status: "aktif", jumlahPeserta: 22,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  {
    id: "prog-09", expertId: "exp-001",
    nama: "Biologi Sel & Genetika",
    deskripsi: "Pendalaman biologi seluler dan genetika untuk persiapan OSN dan ujian PTN. Mitosis, meiosis, hereditas Mendel, dan mutasi.",
    tanggalMulai: d(-40), tanggalSelesai: d(25), status: "aktif", jumlahPeserta: 13,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  {
    id: "prog-10", expertId: "exp-001",
    nama: "Ekonomi Mikro — Pasar & Harga",
    deskripsi: "Memahami mekanisme pasar, elastisitas permintaan dan penawaran, struktur pasar, dan kebijakan harga menggunakan studi kasus ekonomi Indonesia.",
    tanggalMulai: d(-35), tanggalSelesai: d(65), status: "aktif", jumlahPeserta: 17,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  {
    id: "prog-11", expertId: "exp-001",
    nama: "Statistika & Probabilitas",
    deskripsi: "Dari statistik deskriptif sampai distribusi normal dan uji hipotesis sederhana. Menggunakan spreadsheet sebagai alat bantu analisis data nyata.",
    tanggalMulai: d(-30), tanggalSelesai: d(70), status: "aktif", jumlahPeserta: 15,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  {
    id: "prog-12", expertId: "exp-001",
    nama: "Pemrograman Web — HTML & CSS",
    deskripsi: "Membuat halaman web dari nol. Semantic HTML, CSS modern, flexbox, dan responsif. Setiap peserta menghasilkan portfolio pribadi yang di-deploy ke GitHub Pages.",
    tanggalMulai: d(-25), tanggalSelesai: d(35), status: "aktif", jumlahPeserta: 19,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  {
    id: "prog-13", expertId: "exp-001",
    nama: "Filsafat & Etika Kontemporer",
    deskripsi: "Diskusi filsafat tentang AI, bioetika, dan keadilan sosial. Berbasis teks pendek, diskusi Socratic, dan essay reflektif.",
    tanggalMulai: d(-20), tanggalSelesai: d(80), status: "aktif", jumlahPeserta: 11,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  {
    id: "prog-14", expertId: "exp-001",
    nama: "Sosiologi — Perubahan Sosial",
    deskripsi: "Menganalisis perubahan sosial di era digital: media sosial, kesenjangan ekonomi, gerakan sosial kontemporer, dan aksi kolektif.",
    tanggalMulai: d(-15), tanggalSelesai: d(75), status: "aktif", jumlahPeserta: 14,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  {
    id: "prog-15", expertId: "exp-001",
    nama: "Geografi — Iklim & Lingkungan",
    deskripsi: "Memahami sistem iklim bumi, perubahan iklim, dan dampaknya. Menggunakan data real dari BMKG dan NASA untuk analisis tren suhu dan curah hujan.",
    tanggalMulai: d(-10), tanggalSelesai: d(90), status: "aktif", jumlahPeserta: 16,
    totalAktivitas: 3, aktivitasSelesai: 2,
  },
  // ── SELESAI ──────────────────────────────────────────────────────
  {
    id: "prog-16", expertId: "exp-001",
    nama: "Riset Ilmiah Dasar",
    deskripsi: "Pelatihan metode penelitian ilmiah: merumuskan masalah, pengumpulan dan analisis data, dan presentasi hasil. Program telah selesai dengan 12 peserta mempresentasikan penelitian mini.",
    tanggalMulai: d(-150), tanggalSelesai: d(-30), status: "selesai", jumlahPeserta: 12,
    totalAktivitas: 8, aktivitasSelesai: 8,
  },
  {
    id: "prog-17", expertId: "exp-001",
    nama: "Persiapan Olimpiade Biologi",
    deskripsi: "Persiapan OSN Biologi tingkat kabupaten. Materi seluler, genetika, ekologi. Program selesai — 2 peserta lolos ke tingkat provinsi.",
    tanggalMulai: d(-120), tanggalSelesai: d(-20), status: "selesai", jumlahPeserta: 8,
    totalAktivitas: 6, aktivitasSelesai: 6,
  },
  {
    id: "prog-18", expertId: "exp-001",
    nama: "Drama & Teater Remaja",
    deskripsi: "Workshop teater 6 minggu dengan pementasan akhir. Peserta belajar akting, bloking, dan produksi pertunjukan. Pementasan sukses dihadiri 200 penonton.",
    tanggalMulai: d(-90), tanggalSelesai: d(-10), status: "selesai", jumlahPeserta: 15,
    totalAktivitas: 7, aktivitasSelesai: 7,
  },
];

// ═══════════════════════════════════════════════════════════════════
// 4. AKTIVITAS — lengkap per program, semua tipe, semua status
// ═══════════════════════════════════════════════════════════════════

type AktivitasStatus = "belum-mulai" | "sedang-berlangsung" | "selesai" | "sudah-diisi";
type AktivitasTipe  = "mengajar" | "menilai" | "materi";

interface Aktivitas {
  id: string; programId: string; nama: string; tipe: AktivitasTipe;
  waktuMulai: string; waktuSelesai: string; lokasi: string | null;
  status: AktivitasStatus; deskripsi: string; deadline?: string;
  jumlahPeserta: number;
}

export const AKTIVITAS: Aktivitas[] = [

  // ── PROG-01: Literasi Sains (30 peserta, program utama) ──────────
  { id: "a-001", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "sudah-diisi",
    nama: "Orientasi & Kontrak Belajar",
    waktuMulai: d(-119,8), waktuSelesai: d(-119,10), lokasi: "Zoom Meeting",
    deskripsi: "Perkenalan program, menyepakati kontrak belajar, ekspektasi Expert dan peserta, dan jadwal kegiatan selama satu semester." },
  { id: "a-002", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "sudah-diisi",
    nama: "Metode Ilmiah — Dari Observasi ke Kesimpulan",
    waktuMulai: d(-112,8), waktuSelesai: d(-112,10), lokasi: "Zoom Meeting",
    deskripsi: "Memahami siklus penelitian ilmiah: observasi → pertanyaan → hipotesis → eksperimen → analisis → kesimpulan. Diskusi contoh riset nyata." },
  { id: "a-003", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "sudah-diisi",
    nama: "Eksperimen Virtual 1: Tegangan Permukaan",
    waktuMulai: d(-105,8), waktuSelesai: d(-105,10), lokasi: "Zoom Meeting",
    deskripsi: "Praktikum virtual menggunakan PhET Simulation: mengukur tegangan permukaan air vs larutan sabun. Peserta mencatat data dan membuat grafik." },
  { id: "a-004", programId: "prog-01", jumlahPeserta: 30, tipe: "menilai", status: "sudah-diisi",
    nama: "Tugas: Laporan Eksperimen 1",
    waktuMulai: d(-98,0), waktuSelesai: d(-98,23), lokasi: null,
    deadline: d(-98,23),
    deskripsi: "Upload laporan eksperimen (format PDF): latar belakang, metodologi, hasil, kesimpulan. Penilaian berbasis rubrik metodologi ilmiah (0–100)." },
  { id: "a-005", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "sudah-diisi",
    nama: "Eksperimen 2: Hukum Archimedes",
    waktuMulai: d(-91,8), waktuSelesai: d(-91,10), lokasi: "Zoom Meeting",
    deskripsi: "Praktikum virtual benda tenggelam, terapung, melayang. Perhitungan gaya angkat dan densitas. Koneksi ke kehidupan: kapal laut, balon udara." },
  { id: "a-006", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "sudah-diisi",
    nama: "Presentasi Data & Visualisasi Ilmiah",
    waktuMulai: d(-84,8), waktuSelesai: d(-84,10), lokasi: "Zoom Meeting",
    deskripsi: "Cara membuat grafik ilmiah yang benar: axis label, error bar, trendline. Tools: Google Sheets. Peserta mempresentasikan grafik dari eksperimen sebelumnya." },
  { id: "a-007", programId: "prog-01", jumlahPeserta: 30, tipe: "menilai", status: "sudah-diisi",
    nama: "Tugas Mid: Mini Research Proposal",
    waktuMulai: d(-77,0), waktuSelesai: d(-77,23), lokasi: null,
    deadline: d(-77,23),
    deskripsi: "Proposal penelitian mini 1 halaman: pertanyaan riset, hipotesis, metode yang akan digunakan, dan timeline. Expert menilai kelayakan dan kejelasan." },
  { id: "a-008", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "sudah-diisi",
    nama: "Eksperimen 3: Fotosintesis & Cahaya",
    waktuMulai: d(-70,8), waktuSelesai: d(-70,10), lokasi: "Zoom Meeting",
    deskripsi: "Mengukur laju fotosintesis pada intensitas cahaya berbeda. Diskusi faktor pembatas: CO₂, suhu, klorofil. Perbandingan data antar kelompok." },
  { id: "a-009", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "sudah-diisi",
    nama: "Sesi Konsultasi Proyek — Sesi 1",
    waktuMulai: d(-63,8), waktuSelesai: d(-63,10), lokasi: "Zoom Meeting",
    deskripsi: "Diskusi 1-on-1 progress penelitian mini. Expert membantu merumuskan ulang masalah dan memperkuat metodologi masing-masing peserta." },
  { id: "a-010", programId: "prog-01", jumlahPeserta: 15, tipe: "menilai", status: "sudah-diisi",
    nama: "Presentasi Final — Sesi 1 (Peserta 1–15)",
    waktuMulai: d(-56,8), waktuSelesai: d(-56,11), lokasi: "Zoom Meeting",
    deadline: d(-56,11),
    deskripsi: "Presentasi hasil penelitian mini, 8 menit per peserta + Q&A 3 menit. Penilaian: konten ilmiah, metodologi, visualisasi data, dan kemampuan menjawab pertanyaan." },
  { id: "a-011", programId: "prog-01", jumlahPeserta: 15, tipe: "menilai", status: "sudah-diisi",
    nama: "Presentasi Final — Sesi 2 (Peserta 16–30)",
    waktuMulai: d(-49,8), waktuSelesai: d(-49,11), lokasi: "Zoom Meeting",
    deadline: d(-49,11),
    deskripsi: "Presentasi hasil penelitian mini untuk peserta 16–30. Format sama dengan sesi 1." },
  { id: "a-012", programId: "prog-01", jumlahPeserta: 30, tipe: "materi", status: "belum-mulai",
    nama: "Materi: Panduan Referensi & Sitasi Ilmiah",
    waktuMulai: d(-120,0), waktuSelesai: d(60,23), lokasi: null,
    deskripsi: "Dokumen panduan: cara menulis daftar pustaka (APA 7th), menghindari plagiarisme, dan menggunakan Google Scholar. PDF tersedia sepanjang program." },
  { id: "a-013", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "belum-mulai",
    nama: "Sains di Kehidupan Nyata — Diskusi Penutup",
    waktuMulai: d(0,8), waktuSelesai: d(0,10), lokasi: "Zoom Meeting",
    deskripsi: "Diskusi aplikasi metode ilmiah di luar laboratorium: jurnalisme data, kebijakan publik berbasis bukti, dan karir di bidang sains." },
  { id: "a-014", programId: "prog-01", jumlahPeserta: 30, tipe: "menilai", status: "belum-mulai",
    nama: "Tugas Final: Poster Ilmiah",
    waktuMulai: d(14,0), waktuSelesai: d(14,23), lokasi: null,
    deadline: d(14,23),
    deskripsi: "Buat poster ilmiah dari penelitian mini (format A1 digital). Dinilai: estetika, kepadatan informasi, dan akurasi ilmiah." },

  // ── PROG-02: Matematika Olimpiade ────────────────────────────────
  { id: "a-015", programId: "prog-02", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Aljabar: Persamaan & Pertidaksamaan Olimpiade",
    waktuMulai: d(-89,13), waktuSelesai: d(-89,15), lokasi: "Google Meet",
    deskripsi: "Teknik khusus olimpiade: substitusi cerdas, persamaan simetris, dan AM-GM inequality." },
  { id: "a-016", programId: "prog-02", jumlahPeserta: 15, tipe: "menilai", status: "sudah-diisi",
    nama: "Latihan Soal: Aljabar OSN",
    waktuMulai: d(-82,0), waktuSelesai: d(-82,23), lokasi: null,
    deadline: d(-82,23),
    deskripsi: "10 soal aljabar tingkat OSN. Dikumpulkan dengan penyelesaian lengkap dan dinilai berdasarkan kebenaran dan keeleganan solusi." },
  { id: "a-017", programId: "prog-02", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Kombinatorika: Prinsip Pencacahan Lanjut",
    waktuMulai: d(-75,13), waktuSelesai: d(-75,15), lokasi: "Google Meet",
    deskripsi: "Pigeonhole principle, prinsip inklusi-eksklusi, dan counting arguments." },
  { id: "a-018", programId: "prog-02", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Geometri: Teorema Pythagoras & Lingkaran",
    waktuMulai: d(-68,13), waktuSelesai: d(-68,15), lokasi: "Google Meet",
    deskripsi: "Aplikasi Pythagoras, power of a point, dan sifat-sifat lingkaran dalam soal olimpiade." },
  { id: "a-019", programId: "prog-02", jumlahPeserta: 15, tipe: "menilai", status: "sudah-diisi",
    nama: "Simulasi OSN Kabupaten — Sesi 1",
    waktuMulai: d(-61,8), waktuSelesai: d(-61,11), lokasi: null,
    deadline: d(-61,11),
    deskripsi: "Simulasi penuh 3 jam, 30 soal pilihan ganda + 5 soal isian. Kondisi mendekati hari-H." },
  { id: "a-020", programId: "prog-02", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Review Simulasi & Pembahasan Soal",
    waktuMulai: d(-54,13), waktuSelesai: d(-54,15), lokasi: "Google Meet",
    deskripsi: "Pembahasan soal simulasi: pola kesalahan umum, strategi eliminasi, dan time management." },
  { id: "a-021", programId: "prog-02", jumlahPeserta: 15, tipe: "menilai", status: "belum-mulai",
    nama: "Simulasi Final — H-7 OSN",
    waktuMulai: d(25,8), waktuSelesai: d(25,11), lokasi: null,
    deadline: d(25,11),
    deskripsi: "Simulasi terakhir sebelum hari perlombaan. Suasana didesain persis seperti ujian sesungguhnya." },

  // ── PROG-03: Esai Argumentatif ───────────────────────────────────
  { id: "a-022", programId: "prog-03", jumlahPeserta: 18, tipe: "mengajar", status: "sudah-diisi",
    nama: "Struktur Esai Argumentatif yang Kuat",
    waktuMulai: d(-79,10), waktuSelesai: d(-79,12), lokasi: "Zoom Meeting",
    deskripsi: "Tesis yang tajam, argumen yang didukung bukti, counter-argumen, dan konklusi. Analisis esai juara lomba nasional." },
  { id: "a-023", programId: "prog-03", jumlahPeserta: 18, tipe: "menilai", status: "sudah-diisi",
    nama: "Tugas: Draft Esai Gelombang 1",
    waktuMulai: d(-65,0), waktuSelesai: d(-65,23), lokasi: null,
    deadline: d(-65,23),
    deskripsi: "Draft pertama esai 500 kata tentang isu sosial pilihan peserta. Expert memberikan umpan balik tertulis pada argumen dan struktur." },
  { id: "a-024", programId: "prog-03", jumlahPeserta: 18, tipe: "mengajar", status: "sudah-diisi",
    nama: "Workshop Revisi Bersama",
    waktuMulai: d(-58,10), waktuSelesai: d(-58,12), lokasi: "Zoom Meeting",
    deskripsi: "Peer-review terstruktur: setiap peserta memberikan dan menerima umpan balik. Expert memfasilitasi diskusi tentang perbedaan pendapat yang sehat." },
  { id: "a-025", programId: "prog-03", jumlahPeserta: 18, tipe: "menilai", status: "sudah-diisi",
    nama: "Tugas: Esai Final",
    waktuMulai: d(-30,0), waktuSelesai: d(-30,23), lokasi: null,
    deadline: d(-30,23),
    deskripsi: "Esai final 800 kata setelah revisi. Penilaian dengan rubrik 5 dimensi: tesis, argumen, bukti, counter-argumen, bahasa." },
  { id: "a-026", programId: "prog-03", jumlahPeserta: 18, tipe: "mengajar", status: "belum-mulai",
    nama: "Dari Tulisan ke Presentasi: Argumen Lisan",
    waktuMulai: d(0,10), waktuSelesai: d(0,12), lokasi: "Zoom Meeting",
    deskripsi: "Mengubah argumen tertulis menjadi argumen lisan yang meyakinkan. Teknik public speaking untuk konteks akademik." },

  // ── PROG-04: Fisika Modern ───────────────────────────────────────
  { id: "a-027", programId: "prog-04", jumlahPeserta: 12, tipe: "mengajar", status: "sudah-diisi",
    nama: "Relativitas Khusus: Waktu, Ruang, dan Kecepatan",
    waktuMulai: d(-69,15), waktuSelesai: d(-69,17), lokasi: "Zoom Meeting",
    deskripsi: "Postulat Einstein, dilatasi waktu, kontraksi panjang, dan paradoks kembar. Menggunakan animasi simulasi untuk visualisasi." },
  { id: "a-028", programId: "prog-04", jumlahPeserta: 12, tipe: "menilai", status: "sudah-diisi",
    nama: "Kuis Konseptual: Relativitas",
    waktuMulai: d(-55,0), waktuSelesai: d(-55,23), lokasi: null,
    deadline: d(-55,23),
    deskripsi: "10 soal konseptual relativitas khusus. Penilaian bukan hanya jawaban akhir, tapi kualitas penalaran yang dituliskan." },
  { id: "a-029", programId: "prog-04", jumlahPeserta: 12, tipe: "mengajar", status: "sudah-diisi",
    nama: "Mekanika Kuantum: Dualitas & Ketidakpastian",
    waktuMulai: d(-48,15), waktuSelesai: d(-48,17), lokasi: "Zoom Meeting",
    deskripsi: "Percobaan celah ganda, prinsip superposisi, prinsip ketidakpastian Heisenberg. Interpretasi Copenhagen vs Many Worlds." },
  { id: "a-030", programId: "prog-04", jumlahPeserta: 12, tipe: "mengajar", status: "belum-mulai",
    nama: "Diskusi: Implikasi Filosofis Fisika Kuantum",
    waktuMulai: d(0,15), waktuSelesai: d(0,17), lokasi: "Zoom Meeting",
    deskripsi: "Apa artinya determinisme di era kuantum? Apakah realitas ada sebelum diamati? Diskusi bebas terstruktur." },
  { id: "a-031", programId: "prog-04", jumlahPeserta: 12, tipe: "menilai", status: "belum-mulai",
    nama: "Essay: Fisika Modern & Masa Depan Teknologi",
    waktuMulai: d(45,0), waktuSelesai: d(45,23), lokasi: null,
    deadline: d(45,23),
    deskripsi: "Essay reflektif 1000 kata: bagaimana fisika modern mengubah paradigma teknologi — komputasi kuantum, kriptografi, atau medis." },

  // ── PROG-05: Critical Thinking & Debat ──────────────────────────
  { id: "a-032", programId: "prog-05", jumlahPeserta: 14, tipe: "mengajar", status: "sudah-diisi",
    nama: "Mengenali Logical Fallacies",
    waktuMulai: d(-59,13), waktuSelesai: d(-59,15), lokasi: "Zoom Meeting",
    deskripsi: "20 logical fallacy paling umum: ad hominem, straw man, false dichotomy, slippery slope. Latihan identifikasi dari berita dan debat nyata." },
  { id: "a-033", programId: "prog-05", jumlahPeserta: 14, tipe: "menilai", status: "sudah-diisi",
    nama: "Simulasi Debat Ronde 1: AI & Regulasi",
    waktuMulai: d(-45,13), waktuSelesai: d(-45,16), lokasi: "Zoom Meeting",
    deadline: d(-45,16),
    deskripsi: "Mosi: AI harus diregulasi ketat oleh pemerintah. Format Australasian, 2 tim 3 orang. Penilaian: argumen, rebuttal, dan floor speech." },
  { id: "a-034", programId: "prog-05", jumlahPeserta: 14, tipe: "mengajar", status: "sudah-diisi",
    nama: "Coaching Post-Debat: Analisis Rekaman",
    waktuMulai: d(-38,13), waktuSelesai: d(-38,15), lokasi: "Zoom Meeting",
    deskripsi: "Analisis rekaman debat ronde 1. Feedback individual: kekuatan argumen, kelemahan rebuttal, dan penggunaan bahasa tubuh." },
  { id: "a-035", programId: "prog-05", jumlahPeserta: 14, tipe: "menilai", status: "belum-mulai",
    nama: "Grand Final: Internal Tournament",
    waktuMulai: d(0,13), waktuSelesai: d(0,16), lokasi: "Zoom Meeting",
    deadline: d(0,16),
    deskripsi: "Final tournament internal. Mosi: Media sosial lebih banyak membawa keburukan daripada kebaikan. Penonton: expert lain dan peserta program lain." },
  { id: "a-036", programId: "prog-05", jumlahPeserta: 14, tipe: "materi", status: "belum-mulai",
    nama: "Materi: Panduan Format Debat Australasian",
    waktuMulai: d(-60,0), waktuSelesai: d(45,23), lokasi: null,
    deskripsi: "Dokumen lengkap: struktur sesi, timing, peran pembicara, cara memberikan poin informasi, dan rubrik penilaian resmi." },

  // ── PROG-06: Kimia Organik ───────────────────────────────────────
  { id: "a-037", programId: "prog-06", jumlahPeserta: 16, tipe: "mengajar", status: "sudah-diisi",
    nama: "Gugus Fungsi dan Tata Nama IUPAC",
    waktuMulai: d(-54,8), waktuSelesai: d(-54,10), lokasi: "Zoom Meeting",
    deskripsi: "Alkohol, eter, aldehid, keton, asam karboksilat, ester, amida. Aturan IUPAC untuk penamaan senyawa organik." },
  { id: "a-038", programId: "prog-06", jumlahPeserta: 16, tipe: "mengajar", status: "sudah-diisi",
    nama: "Reaksi Substitusi: SN1 dan SN2",
    waktuMulai: d(-40,8), waktuSelesai: d(-40,10), lokasi: "Zoom Meeting",
    deskripsi: "Mekanisme SN1 vs SN2: perbedaan kinetika, stereokimia, dan faktor pelarut. Simulasi visual menggunakan 3D model." },
  { id: "a-039", programId: "prog-06", jumlahPeserta: 16, tipe: "menilai", status: "sudah-diisi",
    nama: "Kuis: Identifikasi Senyawa dari Spektrum IR",
    waktuMulai: d(-26,0), waktuSelesai: d(-26,23), lokasi: null,
    deadline: d(-26,23),
    deskripsi: "Identifikasi 15 senyawa organik dari spektrum infra-merah. Keterampilan membaca pita IR dan mencocokkan gugus fungsi." },
  { id: "a-040", programId: "prog-06", jumlahPeserta: 16, tipe: "mengajar", status: "belum-mulai",
    nama: "Praktikum Virtual: Sintesis Aspirin",
    waktuMulai: d(0,8), waktuSelesai: d(0,10), lokasi: "Zoom Meeting",
    deskripsi: "Simulasi sintesis aspirin (asam asetilsalisilat) dari asam salisilat. Perhitungan yield teoritis vs aktual." },
  { id: "a-041", programId: "prog-06", jumlahPeserta: 16, tipe: "menilai", status: "belum-mulai",
    nama: "Laporan: Praktikum Sintesis Final",
    waktuMulai: d(30,0), waktuSelesai: d(30,23), lokasi: null,
    deadline: d(30,23),
    deskripsi: "Laporan lengkap: tujuan, mekanisme reaksi, perhitungan yield, dan analisis kesalahan." },

  // ── PROG-07 s/d PROG-15: masing-masing 3 aktivitas ──────────────
  { id: "a-042", programId: "prog-07", jumlahPeserta: 20, tipe: "mengajar", status: "sudah-diisi",
    nama: "Academic Writing: Paragraf yang Kohesif",
    waktuMulai: d(-49,14), waktuSelesai: d(-49,16), lokasi: "Zoom Meeting",
    deskripsi: "Topic sentence, supporting evidence, cohesive devices, dan concluding sentence. Analisis paragraf dari jurnal ilmiah." },
  { id: "a-043", programId: "prog-07", jumlahPeserta: 20, tipe: "menilai", status: "sudah-diisi",
    nama: "Essay Writing Task: Argumentative Essay",
    waktuMulai: d(-28,0), waktuSelesai: d(-28,23), lokasi: null,
    deadline: d(-28,23),
    deskripsi: "Essay 500 kata dalam bahasa Inggris. Dinilai menggunakan adaptasi IELTS band descriptor: task achievement, coherence, lexical resource, grammar." },
  { id: "a-044", programId: "prog-07", jumlahPeserta: 20, tipe: "menilai", status: "belum-mulai",
    nama: "Academic Presentation: 5 Menit dalam Bahasa Inggris",
    waktuMulai: d(0,14), waktuSelesai: d(0,17), lokasi: "Zoom Meeting",
    deadline: d(0,17),
    deskripsi: "Presentasi 5 menit per peserta tentang topik akademik pilihan. Penilaian: fluency, pronunciation, content, dan Q&A handling." },

  { id: "a-045", programId: "prog-08", jumlahPeserta: 22, tipe: "mengajar", status: "sudah-diisi",
    nama: "Imperialisme Eropa: Sebab, Proses, dan Warisan",
    waktuMulai: d(-44,10), waktuSelesai: d(-44,12), lokasi: "Zoom Meeting",
    deskripsi: "Analisis imperialisme abad 19–20: motivasi ekonomi, ideologi superioritas, dan dampak jangka panjang di Asia dan Afrika." },
  { id: "a-046", programId: "prog-08", jumlahPeserta: 22, tipe: "menilai", status: "sudah-diisi",
    nama: "Analisis Dokumen Sejarah Primer",
    waktuMulai: d(-30,0), waktuSelesai: d(-30,23), lokasi: null,
    deadline: d(-30,23),
    deskripsi: "Analisis sumber primer: surat, pidato, atau manifesto bersejarah. Peserta memilih dokumen sendiri dan menuliskan analisis kontekstual 600 kata." },
  { id: "a-047", programId: "prog-08", jumlahPeserta: 22, tipe: "mengajar", status: "belum-mulai",
    nama: "Diskusi: Pola Perang Dingin di Era Digital",
    waktuMulai: d(0,10), waktuSelesai: d(0,12), lokasi: "Zoom Meeting",
    deskripsi: "Apakah dinamika AS-Uni Soviet berulang dalam relasi AS-Tiongkok hari ini? Diskusi berbasis sumber primer dan analisis geopolitik." },

  { id: "a-048", programId: "prog-09", jumlahPeserta: 13, tipe: "mengajar", status: "sudah-diisi",
    nama: "Mitosis vs Meiosis: Perbedaan Kritis",
    waktuMulai: d(-39,8), waktuSelesai: d(-39,10), lokasi: "Zoom Meeting",
    deskripsi: "Tahapan dan perbedaan mitosis vs meiosis menggunakan animasi interaktif. Signifikansi biologis masing-masing proses." },
  { id: "a-049", programId: "prog-09", jumlahPeserta: 13, tipe: "menilai", status: "sudah-diisi",
    nama: "Kuis: Pewarisan Sifat Mendel",
    waktuMulai: d(-25,0), waktuSelesai: d(-25,23), lokasi: null,
    deadline: d(-25,23),
    deskripsi: "15 soal: monohibrid, dihibrid, kodominansi, dan epistasis. Termasuk soal pedigree sederhana." },
  { id: "a-050", programId: "prog-09", jumlahPeserta: 13, tipe: "mengajar", status: "belum-mulai",
    nama: "Mutasi & Penyakit Genetik",
    waktuMulai: d(0,8), waktuSelesai: d(0,10), lokasi: "Zoom Meeting",
    deskripsi: "Tipe mutasi: titik, kromosomal, dan genomik. Hubungan dengan penyakit: Down syndrome, sickle cell anemia, PKU." },

  { id: "a-051", programId: "prog-10", jumlahPeserta: 17, tipe: "mengajar", status: "sudah-diisi",
    nama: "Hukum Permintaan, Penawaran, dan Keseimbangan",
    waktuMulai: d(-34,13), waktuSelesai: d(-34,15), lokasi: "Zoom Meeting",
    deskripsi: "Kurva demand & supply, pergeseran kurva, dan penentuan harga keseimbangan pasar. Contoh: pasar beras Indonesia." },
  { id: "a-052", programId: "prog-10", jumlahPeserta: 17, tipe: "menilai", status: "sudah-diisi",
    nama: "Studi Kasus: Kebijakan Harga BBM Indonesia",
    waktuMulai: d(-20,0), waktuSelesai: d(-20,23), lokasi: null,
    deadline: d(-20,23),
    deskripsi: "Analisis kebijakan subsidi dan kenaikan harga BBM 2022 menggunakan kerangka ekonomi mikro. Laporan 500 kata." },
  { id: "a-053", programId: "prog-10", jumlahPeserta: 17, tipe: "mengajar", status: "belum-mulai",
    nama: "Monopoli vs Pasar Kompetitif: Siapa yang Diuntungkan?",
    waktuMulai: d(0,13), waktuSelesai: d(0,15), lokasi: "Zoom Meeting",
    deskripsi: "Perbandingan struktur pasar: persaingan sempurna, monopoli, oligopoli, monopolistik. Implikasi untuk kebijakan antimonopoli." },

  { id: "a-054", programId: "prog-11", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Statistik Deskriptif: Mean, Median, Modus & Dispersi",
    waktuMulai: d(-29,10), waktuSelesai: d(-29,12), lokasi: "Zoom Meeting",
    deskripsi: "Menggunakan data nilai ujian kelas untuk menghitung dan menginterpretasikan ukuran pemusatan dan penyebaran data." },
  { id: "a-055", programId: "prog-11", jumlahPeserta: 15, tipe: "menilai", status: "sudah-diisi",
    nama: "Latihan: Analisis Dataset 100 Baris",
    waktuMulai: d(-15,0), waktuSelesai: d(-15,23), lokasi: null,
    deadline: d(-15,23),
    deskripsi: "Analisis dataset penjualan 100 baris menggunakan Google Sheets. Hitung rata-rata, median, dan buat visualisasi." },
  { id: "a-056", programId: "prog-11", jumlahPeserta: 15, tipe: "mengajar", status: "belum-mulai",
    nama: "Distribusi Normal & Z-Score",
    waktuMulai: d(0,10), waktuSelesai: d(0,12), lokasi: "Zoom Meeting",
    deskripsi: "Bell curve, z-score, dan area di bawah kurva. Aplikasi: nilai ujian standar dan kontrol kualitas produksi." },

  { id: "a-057", programId: "prog-12", jumlahPeserta: 19, tipe: "mengajar", status: "sudah-diisi",
    nama: "HTML: Semantic Elements & Struktur Dokumen",
    waktuMulai: d(-24,15), waktuSelesai: d(-24,17), lokasi: "Zoom Meeting",
    deskripsi: "Tag HTML semantik: header, nav, main, section, article, footer. Aksesibilitas dan SEO dasar." },
  { id: "a-058", programId: "prog-12", jumlahPeserta: 19, tipe: "mengajar", status: "sudah-diisi",
    nama: "CSS: Box Model, Flexbox, dan Responsif",
    waktuMulai: d(-17,15), waktuSelesai: d(-17,17), lokasi: "Zoom Meeting",
    deskripsi: "CSS box model, flexbox layout, media query dasar, dan mobile-first approach." },
  { id: "a-059", programId: "prog-12", jumlahPeserta: 19, tipe: "menilai", status: "belum-mulai",
    nama: "Submit: Portfolio Pribadi di GitHub Pages",
    waktuMulai: d(30,0), waktuSelesai: d(30,23), lokasi: null,
    deadline: d(30,23),
    deskripsi: "Deploy halaman portfolio HTML+CSS ke GitHub Pages. Penilaian: struktur HTML, estetika, responsivitas, dan konten personal." },

  { id: "a-060", programId: "prog-13", jumlahPeserta: 11, tipe: "mengajar", status: "sudah-diisi",
    nama: "Pengantar Filsafat: Utilitarianisme, Deontologi, Virtue Ethics",
    waktuMulai: d(-19,16), waktuSelesai: d(-19,18), lokasi: "Zoom Meeting",
    deskripsi: "Tiga tradisi etika besar dan cara mengaplikasikannya pada dilema moral kontemporer." },
  { id: "a-061", programId: "prog-13", jumlahPeserta: 11, tipe: "mengajar", status: "sudah-diisi",
    nama: "Diskusi Socratic: Etika Kecerdasan Buatan",
    waktuMulai: d(-5,16), waktuSelesai: d(-5,18), lokasi: "Zoom Meeting",
    deskripsi: "Siapa yang bertanggung jawab ketika mobil otonom mencelakai seseorang? Diskusi terstruktur berbasis teks pendek Trolley Problem versi digital." },
  { id: "a-062", programId: "prog-13", jumlahPeserta: 11, tipe: "menilai", status: "belum-mulai",
    nama: "Essay: Satu Dilema Etika Kontemporer",
    waktuMulai: d(75,0), waktuSelesai: d(75,23), lokasi: null,
    deadline: d(75,23),
    deskripsi: "Essay reflektif 800 kata: peserta memilih 1 dilema etika kontemporer dan menganalisisnya dari minimal 2 perspektif filosofis." },

  { id: "a-063", programId: "prog-14", jumlahPeserta: 14, tipe: "mengajar", status: "sudah-diisi",
    nama: "Perubahan Sosial di Era Digital",
    waktuMulai: d(-14,13), waktuSelesai: d(-14,15), lokasi: "Zoom Meeting",
    deskripsi: "Teori perubahan sosial (Durkheim, Giddens) dan dampak media sosial terhadap identitas, komunitas, dan norma." },
  { id: "a-064", programId: "prog-14", jumlahPeserta: 14, tipe: "menilai", status: "sudah-diisi",
    nama: "Observasi Sosial Mini",
    waktuMulai: d(-3,0), waktuSelesai: d(-3,23), lokasi: null,
    deadline: d(-3,23),
    deskripsi: "Peserta mengobservasi 1 fenomena sosial di sekitarnya selama 3 hari dan menulis laporan observasi 400 kata." },
  { id: "a-065", programId: "prog-14", jumlahPeserta: 14, tipe: "mengajar", status: "belum-mulai",
    nama: "Gerakan Sosial & Aksi Kolektif",
    waktuMulai: d(0,13), waktuSelesai: d(0,15), lokasi: "Zoom Meeting",
    deskripsi: "Dari Fridays for Future hingga #MeToo — anatomi gerakan sosial: pemicu, eskalasi, taktik, dan dampak kebijakan." },

  { id: "a-066", programId: "prog-15", jumlahPeserta: 16, tipe: "mengajar", status: "sudah-diisi",
    nama: "Sistem Iklim Bumi: Atmosfer, Lautan, Daratan",
    waktuMulai: d(-9,8), waktuSelesai: d(-9,10), lokasi: "Zoom Meeting",
    deskripsi: "Interaksi komponen sistem iklim, umpan balik positif dan negatif, dan sensitivitas iklim terhadap CO₂." },
  { id: "a-067", programId: "prog-15", jumlahPeserta: 16, tipe: "menilai", status: "sudah-diisi",
    nama: "Analisis Data Iklim BMKG (10 Tahun)",
    waktuMulai: d(-2,0), waktuSelesai: d(-2,23), lokasi: null,
    deadline: d(-2,23),
    deskripsi: "Analisis dataset suhu dan curah hujan 10 tahun dari BMKG. Temukan tren, anomali, dan interpretasikan dalam konteks perubahan iklim." },
  { id: "a-068", programId: "prog-15", jumlahPeserta: 16, tipe: "mengajar", status: "belum-mulai",
    nama: "Kebijakan Iklim Indonesia: NDC dan Transisi Energi",
    waktuMulai: d(0,8), waktuSelesai: d(0,10), lokasi: "Zoom Meeting",
    deskripsi: "Nationally Determined Contribution Indonesia, target net zero 2060, dan tantangan transisi dari batu bara ke energi terbarukan." },

  // ── PROG-16: Riset Ilmiah (SELESAI) ─────────────────────────────
  { id: "a-069", programId: "prog-16", jumlahPeserta: 12, tipe: "mengajar", status: "sudah-diisi",
    nama: "Pengenalan Metode Ilmiah",
    waktuMulai: d(-148,9), waktuSelesai: d(-148,11), lokasi: "Ruang Kelas",
    deskripsi: "Siklus penelitian dan cara merumuskan pertanyaan riset yang spesifik dan dapat diuji." },
  { id: "a-070", programId: "prog-16", jumlahPeserta: 12, tipe: "mengajar", status: "sudah-diisi",
    nama: "Pengumpulan & Validasi Data",
    waktuMulai: d(-141,9), waktuSelesai: d(-141,11), lokasi: "Ruang Kelas",
    deskripsi: "Teknik pengumpulan data primer dan sekunder. Cara menilai reliabilitas dan validitas sumber." },
  { id: "a-071", programId: "prog-16", jumlahPeserta: 12, tipe: "mengajar", status: "sudah-diisi",
    nama: "Analisis Data Kualitatif & Kuantitatif",
    waktuMulai: d(-134,9), waktuSelesai: d(-134,11), lokasi: "Ruang Kelas",
    deskripsi: "Perbedaan pendekatan kualitatif vs kuantitatif. Kapan menggunakan masing-masing." },
  { id: "a-072", programId: "prog-16", jumlahPeserta: 12, tipe: "menilai", status: "sudah-diisi",
    nama: "Kuis Mid: Metodologi Penelitian",
    waktuMulai: d(-120,0), waktuSelesai: d(-120,23), lokasi: null,
    deadline: d(-120,23),
    deskripsi: "20 soal pilihan ganda tentang metodologi penelitian ilmiah dasar." },
  { id: "a-073", programId: "prog-16", jumlahPeserta: 12, tipe: "mengajar", status: "sudah-diisi",
    nama: "Workshop Penulisan Laporan Ilmiah",
    waktuMulai: d(-55,9), waktuSelesai: d(-55,11), lokasi: "Ruang Kelas",
    deskripsi: "Struktur laporan ilmiah: abstrak, pendahuluan, metode, hasil, diskusi, kesimpulan." },
  { id: "a-074", programId: "prog-16", jumlahPeserta: 12, tipe: "mengajar", status: "sudah-diisi",
    nama: "Sesi Konsultasi Final",
    waktuMulai: d(-40,9), waktuSelesai: d(-40,11), lokasi: "Ruang Kelas",
    deskripsi: "Review draft laporan penelitian masing-masing kelompok sebelum presentasi." },
  { id: "a-075", programId: "prog-16", jumlahPeserta: 12, tipe: "menilai", status: "sudah-diisi",
    nama: "Presentasi Akhir & Penilaian Final",
    waktuMulai: d(-31,9), waktuSelesai: d(-31,12), lokasi: "Aula Sekolah",
    deadline: d(-31,12),
    deskripsi: "Presentasi penelitian 10 menit per kelompok. Penilaian final program." },
  { id: "a-076", programId: "prog-16", jumlahPeserta: 12, tipe: "mengajar", status: "sudah-diisi",
    nama: "Penutupan & Refleksi Program",
    waktuMulai: d(-30,13), waktuSelesai: d(-30,14), lokasi: "Ruang Kelas",
    deskripsi: "Refleksi bersama perjalanan program dan rencana lanjutan peserta." },

  // ── PROG-17: Olimpiade Biologi (SELESAI) ─────────────────────────
  { id: "a-077", programId: "prog-17", jumlahPeserta: 8, tipe: "mengajar", status: "sudah-diisi",
    nama: "Biologi Sel: Struktur & Fungsi Organel",
    waktuMulai: d(-119,8), waktuSelesai: d(-119,10), lokasi: "Zoom Meeting",
    deskripsi: "Ribosom, mitokondria, kloroplas, RE, Golgi — struktur dan fungsi masing-masing dalam konteks OSN." },
  { id: "a-078", programId: "prog-17", jumlahPeserta: 8, tipe: "mengajar", status: "sudah-diisi",
    nama: "Genetika Molekuler: DNA ke Protein",
    waktuMulai: d(-98,8), waktuSelesai: d(-98,10), lokasi: "Zoom Meeting",
    deskripsi: "Replikasi DNA, transkripsi, translasi, dan regulasi ekspresi gen." },
  { id: "a-079", programId: "prog-17", jumlahPeserta: 8, tipe: "menilai", status: "sudah-diisi",
    nama: "Latihan Soal: Bank Soal OSN Biologi",
    waktuMulai: d(-77,0), waktuSelesai: d(-77,23), lokasi: null,
    deadline: d(-77,23),
    deskripsi: "50 soal pilihan ganda dari bank soal OSN 5 tahun terakhir." },
  { id: "a-080", programId: "prog-17", jumlahPeserta: 8, tipe: "mengajar", status: "sudah-diisi",
    nama: "Ekologi: Ekosistem & Daur Biogeokimia",
    waktuMulai: d(-56,8), waktuSelesai: d(-56,10), lokasi: "Zoom Meeting",
    deskripsi: "Rantai makanan, jaring makanan, piramida energi, dan daur karbon, nitrogen, fosfor." },
  { id: "a-081", programId: "prog-17", jumlahPeserta: 8, tipe: "menilai", status: "sudah-diisi",
    nama: "Simulasi OSN Biologi Penuh",
    waktuMulai: d(-21,8), waktuSelesai: d(-21,11), lokasi: null,
    deadline: d(-21,11),
    deskripsi: "Simulasi penuh 3 jam. Kondisi ujian sesungguhnya: no notes, timer, silent mode." },
  { id: "a-082", programId: "prog-17", jumlahPeserta: 8, tipe: "mengajar", status: "sudah-diisi",
    nama: "Review Simulasi & Strategi Hari-H",
    waktuMulai: d(-20,8), waktuSelesai: d(-20,10), lokasi: "Zoom Meeting",
    deskripsi: "Pembahasan soal simulasi, manajemen waktu, dan persiapan mental untuk hari perlombaan." },

  // ── PROG-18: Drama & Teater (SELESAI) ────────────────────────────
  { id: "a-083", programId: "prog-18", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Pengantar Akting: Emosi & Gestur",
    waktuMulai: d(-88,15), waktuSelesai: d(-88,18), lokasi: "Aula Sekolah",
    deskripsi: "Teknik dasar akting: emosi otentik, gestur yang natural, dan ekspresi wajah. Latihan Stanislavski." },
  { id: "a-084", programId: "prog-18", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Bloking & Penggunaan Panggung",
    waktuMulai: d(-74,15), waktuSelesai: d(-74,18), lokasi: "Aula Sekolah",
    deskripsi: "Cara bergerak di panggung: downstage, upstage, blocking yang tidak menutupi aktor lain." },
  { id: "a-085", programId: "prog-18", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Latihan Penuh: Gladi Kotor",
    waktuMulai: d(-25,15), waktuSelesai: d(-25,19), lokasi: "Aula Sekolah",
    deskripsi: "Latihan penuh dengan kostum dan properti. Feedback Expert setelah setiap adegan." },
  { id: "a-086", programId: "prog-18", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Gladi Bersih",
    waktuMulai: d(-11,15), waktuSelesai: d(-11,20), lokasi: "Aula Sekolah",
    deskripsi: "Gladi bersih resmi. Tim teknis hadir: tata cahaya, tata suara, dan prompter." },
  { id: "a-087", programId: "prog-18", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Pementasan Akhir",
    waktuMulai: d(-10,17), waktuSelesai: d(-10,20), lokasi: "Aula Sekolah",
    deskripsi: "Pementasan final di hadapan orang tua, guru, dan tamu undangan. Dihadiri sekitar 200 penonton." },
  { id: "a-088", programId: "prog-18", jumlahPeserta: 15, tipe: "menilai", status: "sudah-diisi",
    nama: "Penilaian Peran & Penghayatan",
    waktuMulai: d(-10,0), waktuSelesai: d(-10,23), lokasi: null,
    deadline: d(-10,23),
    deskripsi: "Expert menilai setiap peserta: penghayatan karakter, blocking, vokal, dan interaksi dengan cast lain." },
  { id: "a-089", programId: "prog-18", jumlahPeserta: 15, tipe: "mengajar", status: "sudah-diisi",
    nama: "Sesi Refleksi & Penutupan Program",
    waktuMulai: d(-10,20), waktuSelesai: d(-10,21), lokasi: "Aula Sekolah",
    deskripsi: "Refleksi bersama setelah pementasan. Foto bersama, pembagian sertifikat." },

  // ── AKTIVITAS HARI INI — 4 status berbeda untuk testing ─────────
  { id: "a-today-1", programId: "prog-01", jumlahPeserta: 30, tipe: "mengajar", status: "sudah-diisi",
    nama: "Sains di Kehidupan Nyata (Selesai Pagi)",
    waktuMulai: d(0,7), waktuSelesai: d(0,8,30), lokasi: "Zoom Meeting",
    deskripsi: "Sudah selesai pagi ini. Kehadiran sudah diisi. Status: sudah-diisi." },
  { id: "a-today-2", programId: "prog-02", jumlahPeserta: 15, tipe: "menilai", status: "sedang-berlangsung",
    nama: "Review Aljabar (Sedang Berlangsung)",
    waktuMulai: d(0,10), waktuSelesai: d(0,12), lokasi: "Google Meet",
    deadline: d(0,12),
    deskripsi: "Sedang berlangsung sekarang. Status: sedang-berlangsung." },
  { id: "a-today-3", programId: "prog-05", jumlahPeserta: 14, tipe: "menilai", status: "belum-mulai",
    nama: "Grand Final Debat (Sore Ini)",
    waktuMulai: d(0,16), waktuSelesai: d(0,19), lokasi: "Zoom Meeting",
    deadline: d(0,19),
    deskripsi: "Belum mulai — sore ini. Status: belum-mulai." },
  { id: "a-today-4", programId: "prog-09", jumlahPeserta: 13, tipe: "mengajar", status: "selesai",
    nama: "Mutasi Genetik (Selesai, Kehadiran Belum Diisi)",
    waktuMulai: d(0,6), waktuSelesai: d(0,7), lokasi: "Zoom Meeting",
    deskripsi: "Sudah selesai dini hari tapi kehadiran BELUM diisi. Edge case: status selesai tanpa kehadiran." },
];

// ═══════════════════════════════════════════════════════════════════
// 5. KEHADIRAN — data presensi untuk semua aktivitas sudah-diisi
// ═══════════════════════════════════════════════════════════════════

const buatKehadiran = (
  aktivitasId: string,
  pesertaIds: string[],
  submittedAt: string,
): KehadiranEntry[] =>
  pesertaIds.map((pesertaId, i) => ({
    aktivitasId,
    pesertaId,
    status: (
      i === 10 ? "tanpa-keterangan" :   // Kevin — sering absen
      i === 16 ? "tanpa-keterangan" :   // Qisthi — sering absen
      i === 24 ? "tanpa-keterangan" :   // Yoga — 2x tanpa ket
      i % 9 === 0 ? "izin" :
      i % 11 === 0 ? "sakit" :
      "hadir"
    ) as "hadir" | "izin" | "sakit" | "tanpa-keterangan",
    submittedAt,
  }));

interface KehadiranEntry {
  aktivitasId: string; pesertaId: string;
  status: "hadir" | "izin" | "sakit" | "tanpa-keterangan";
  submittedAt: string;
}

// Aktivitas yang sudah diisi kehadiran (prog-01 paling lengkap)
const aktivitasDenganKehadiran = [
  "a-001","a-002","a-003","a-005","a-006","a-008","a-009",
  "a-010","a-011","a-015","a-016","a-017","a-018","a-019","a-020",
  "a-022","a-023","a-024","a-025","a-027","a-028","a-029",
  "a-032","a-033","a-034","a-037","a-038","a-039",
  "a-042","a-043","a-045","a-046","a-048","a-049",
  "a-051","a-052","a-054","a-055","a-057","a-058",
  "a-060","a-061","a-063","a-064","a-066","a-067",
  "a-today-1",
  // program selesai
  "a-069","a-070","a-071","a-072","a-073","a-074","a-075","a-076",
  "a-077","a-078","a-079","a-080","a-081","a-082",
  "a-083","a-084","a-085","a-086","a-087","a-088","a-089",
];

export const KEHADIRAN: KehadiranEntry[] = aktivitasDenganKehadiran.flatMap(aktivitasId => {
  const akt = AKTIVITAS.find(a => a.id === aktivitasId);
  if (!akt) return [];
  const pesertaIds = ALL_PESERTA_IDS.slice(0, akt.jumlahPeserta);
  return buatKehadiran(aktivitasId, pesertaIds, d(-1, 20));
});

// ═══════════════════════════════════════════════════════════════════
// 6. PENILAIAN — untuk semua aktivitas tipe menilai yang sudah-diisi
// ═══════════════════════════════════════════════════════════════════

interface PenilaianEntry {
  aktivitasId: string; pesertaId: string;
  nilai: number; catatan: string | null; submittedAt: string;
}

const buatPenilaian = (aktivitasId: string, pesertaIds: string[], submittedAt: string): PenilaianEntry[] =>
  pesertaIds.map((pesertaId, i) => ({
    aktivitasId, pesertaId,
    nilai: [72, 78, 85, 88, 65, 90, 75, 82, 69, 95, 55, 80, 77, 83, 91,
            73, 86, 62, 88, 79, 84, 70, 93, 76, 87, 68, 81, 74, 89, 66][i % 30],
    catatan: i % 4 === 0
      ? ["Penyelesaian sangat runtut dan logis.", "Perlu perbaikan pada bagian kesimpulan.", "Sangat kreatif dalam pendekatan.", "Sudah membaik dibanding tugas sebelumnya."][i % 4]
      : null,
    submittedAt,
  }));

const aktivitasDenganNilai = [
  "a-004","a-007","a-010","a-011","a-014",
  "a-016","a-019","a-022","a-023","a-025",
  "a-028","a-033","a-039","a-043","a-046",
  "a-049","a-052","a-055","a-064","a-067",
  "a-072","a-075","a-079","a-081","a-082","a-088",
];

export const PENILAIAN: PenilaianEntry[] = aktivitasDenganNilai.flatMap(aktivitasId => {
  const akt = AKTIVITAS.find(a => a.id === aktivitasId);
  if (!akt) return [];
  const pesertaIds = ALL_PESERTA_IDS.slice(0, akt.jumlahPeserta);
  return buatPenilaian(aktivitasId, pesertaIds, d(-1, 21));
});

// Penilaian sebagian (untuk testing progress bar "12/15")
export const PENILAIAN_SEBAGIAN: PenilaianEntry[] = [
  ...buatPenilaian("a-021", ALL_PESERTA_IDS.slice(0, 9), d(0, 11)), // 9 dari 15 dinilai
  ...buatPenilaian("a-044", ALL_PESERTA_IDS.slice(0, 12), d(0, 15)), // 12 dari 20 dinilai
];

// ═══════════════════════════════════════════════════════════════════
// 7. RIWAYAT KEHADIRAN PER PESERTA — untuk halaman profil peserta
// ═══════════════════════════════════════════════════════════════════

// Agregat per peserta per program (untuk GET /peserta/:id/riwayat-kehadiran)
export const RIWAYAT_KEHADIRAN_PESERTA = PESERTA.map(peserta => {
  const kehadiranPeserta = KEHADIRAN.filter(k => k.pesertaId === peserta.id);
  return {
    pesertaId: peserta.id,
    programId: "prog-01",
    hadir: kehadiranPeserta.filter(k => k.status === "hadir").length,
    izin: kehadiranPeserta.filter(k => k.status === "izin").length,
    sakit: kehadiranPeserta.filter(k => k.status === "sakit").length,
    tanpaKeterangan: kehadiranPeserta.filter(k => k.status === "tanpa-keterangan").length,
    total: kehadiranPeserta.length,
  };
});

// Riwayat penilaian per peserta (untuk profil peserta)
export const RIWAYAT_PENILAIAN_PESERTA = PESERTA.map(peserta => {
  const nilaiPeserta = PENILAIAN.filter(n => n.pesertaId === peserta.id);
  return {
    pesertaId: peserta.id,
    programId: "prog-01",
    entries: nilaiPeserta.map(n => ({
      aktivitasId: n.aktivitasId,
      aktivitasNama: AKTIVITAS.find(a => a.id === n.aktivitasId)?.nama ?? "–",
      nilai: n.nilai,
      tanggal: n.submittedAt,
    })),
    rataRata: nilaiPeserta.length
      ? Math.round(nilaiPeserta.reduce((s, n) => s + n.nilai, 0) / nilaiPeserta.length)
      : null,
  };
});

// ═══════════════════════════════════════════════════════════════════
// 8. UMPAN BALIK — per aktivitas + per peserta + per program
// ═══════════════════════════════════════════════════════════════════

export const UMPAN_BALIK = [
  // Aktivitas mengajar
  { id: "ub-001", scope: "aktivitas", aktivitasId: "a-001", programId: "prog-01", pesertaId: null,
    konten: "Sesi perdana berjalan sangat lancar. Semua peserta antusias dan aktif bertanya. Beberapa peserta sudah memiliki pengalaman eksperimen sebelumnya — saya akan sesuaikan tingkat kesulitan sesi berikutnya.", createdAt: d(-119,11) },
  { id: "ub-002", scope: "aktivitas", aktivitasId: "a-002", programId: "prog-01", pesertaId: null,
    konten: "Banyak peserta yang masih bingung membedakan hipotesis dan pertanyaan penelitian. Saya tambahkan slide khusus untuk sesi berikutnya. Kehadiran bagus, hanya 1 peserta izin.", createdAt: d(-112,11) },
  { id: "ub-003", scope: "aktivitas", aktivitasId: "a-003", programId: "prog-01", pesertaId: null,
    konten: "Eksperimen berjalan baik. Sebagian besar peserta berhasil mendapatkan data yang konsisten. Kevin dan Qisthi tidak hadir hari ini — perlu follow-up untuk materi yang terlewat.", createdAt: d(-105,11) },
  // Umpan balik per peserta
  { id: "ub-004", scope: "peserta", aktivitasId: "a-003", programId: "prog-01", pesertaId: "p-11",
    konten: "Kevin sudah 2x tidak hadir tanpa keterangan. Sudah saya hubungi via pengumuman program. Perlu eskalasi ke Academic Lead jika berlanjut.", createdAt: d(-105,11) },
  { id: "ub-005", scope: "peserta", aktivitasId: "a-003", programId: "prog-01", pesertaId: "p-17",
    konten: "Qisthi minta izin karena sakit. Sudah saya kirim materi rekaman sesi.", createdAt: d(-105,11) },
  { id: "ub-006", scope: "peserta", aktivitasId: "a-001", programId: "prog-01", pesertaId: "p-01",
    konten: "Aditya sangat aktif di sesi perdana. Pertanyaannya tajam — kandidat kuat untuk proyek riset yang ambisius.", createdAt: d(-119,11) },
  // Umpan balik program
  { id: "ub-007", scope: "program", aktivitasId: null, programId: "prog-01", pesertaId: null,
    konten: "Program berjalan sesuai jadwal. 11 dari 14 aktivitas sudah selesai. Secara keseluruhan kehadiran sangat baik (rata-rata 91%). Peserta yang perlu perhatian: Kevin (p-11), Qisthi (p-17), dan Yoga (p-25). Saya akan buat catatan khusus untuk mereka di laporan akhir.", createdAt: d(-30,9) },
  { id: "ub-008", scope: "program", aktivitasId: null, programId: "prog-02", pesertaId: null,
    konten: "Progres baik. Semua peserta berhasil meningkatkan skor simulasi OSN rata-rata 15 poin dari simulasi pertama ke simulasi terakhir. Target: minimal 3 peserta lolos ke tingkat provinsi.", createdAt: d(-20,9) },
  // Aktivitas lain
  { id: "ub-009", scope: "aktivitas", aktivitasId: "a-019", programId: "prog-02", pesertaId: null,
    konten: "Simulasi pertama: rata-rata skor 62/100. Distribusi normal, tidak ada outlier ekstrem. Peserta paling lemah di bagian geometri — sesi berikutnya akan fokus ke sana.", createdAt: d(-61,12) },
  { id: "ub-010", scope: "aktivitas", aktivitasId: "a-033", programId: "prog-05", pesertaId: null,
    konten: "Debat ronde 1 berlangsung sengit dan substantif. Tim Afirmasi lebih siap secara argumen, tapi Tim Negasi punya floor speech yang lebih kuat. Semua peserta mendapat feedback rekaman.", createdAt: d(-45,17) },
];

// ═══════════════════════════════════════════════════════════════════
// 9. PENGUMUMAN — per aktivitas + per program
// ═══════════════════════════════════════════════════════════════════

export const PENGUMUMAN = [
  // Aktivitas
  { id: "ann-001", scope: "aktivitas", aktivitasId: "a-014", programId: "prog-01",
    judul: "Reminder: Deadline Poster Ilmiah 14 Hari Lagi",
    isi: "Halo semua! Deadline pengumpulan Poster Ilmiah adalah 14 hari dari sekarang. Pastikan format A1 digital (PNG/PDF, min 300dpi). Upload melalui halaman Tugas di aplikasi ini. Kalau ada pertanyaan teknis, tanyakan di sesi konsultasi hari ini.",
    createdAt: d(0,7), createdBy: "exp-001" },
  { id: "ann-002", scope: "aktivitas", aktivitasId: "a-021", programId: "prog-02",
    judul: "Simulasi Final: Persiapan Optimal",
    isi: "Simulasi final H-7 sebelum OSN akan dilaksanakan sesuai jadwal. Tips persiapan: tidur cukup malam sebelumnya, sarapan, dan pastikan koneksi internet stabil. Simulasi ini menentukan urutan peserta yang mewakili sekolah.",
    createdAt: d(20,8), createdBy: "exp-001" },
  { id: "ann-003", scope: "aktivitas", aktivitasId: "a-035", programId: "prog-05",
    judul: "Grand Final Debat: Penonton Diundang!",
    isi: "Grand Final Debat hari ini pukul 16.00 via Zoom. Peserta dari program lain boleh bergabung sebagai penonton dan memberikan pertanyaan di sesi floor speech. Link Zoom sudah di-share via notifikasi.",
    createdAt: d(0,8), createdBy: "exp-001" },
  // Program
  { id: "ann-004", scope: "program", aktivitasId: null, programId: "prog-01",
    judul: "Jadwal Lengkap Sisa Program — Semester Ini",
    isi: "Berikut jadwal aktivitas tersisa di program Literasi Sains:\n\n• Sesi 13: Sains di Kehidupan Nyata — hari ini pukul 08.00\n• Tugas Final (Poster Ilmiah) — deadline 14 hari lagi\n• Penutupan Semester — 55 hari lagi\n\nSemua materi tambahan sudah tersedia di tab Materi. Semangat!",
    createdAt: d(-7,9), createdBy: "exp-001" },
  { id: "ann-005", scope: "program", aktivitasId: null, programId: "prog-01",
    judul: "Rekaman Sesi 11 Sudah Tersedia",
    isi: "Rekaman sesi Presentasi Final Sesi 2 sudah saya upload ke Google Drive program. Link ada di tab Materi. Bagi yang hadir, silakan review presentasi teman-teman untuk inspirasi.",
    createdAt: d(-49,12), createdBy: "exp-001" },
  { id: "ann-006", scope: "program", aktivitasId: null, programId: "prog-02",
    judul: "Materi Tambahan: Soal-Soal OSN 5 Tahun Terakhir",
    isi: "Saya upload 250 soal OSN Matematika dari 2020–2024 beserta pembahasan lengkap. Gunakan sebagai bahan latihan mandiri. Fokus dulu pada topik yang sudah kita pelajari bersama: aljabar dan kombinatorika.",
    createdAt: d(-30,9), createdBy: "exp-001" },
  // Pengumuman global dari Academic Lead
  { id: "ann-007", scope: "global", aktivitasId: null, programId: null,
    judul: "Reminder dari Academic Lead: Input Nilai Segera",
    isi: "Kepada seluruh Expert — mohon pastikan semua nilai sudah diinput sebelum akhir minggu ini. Ada 3 aktivitas yang deadline penilaiannya sudah lewat. Hubungi saya (Sinta) jika ada kendala.",
    createdAt: d(-1,9), createdBy: "exp-004" },
];

// ═══════════════════════════════════════════════════════════════════
// 10. NOTIFIKASI — 10 notifikasi, 5 unread (untuk exp-001)
// ═══════════════════════════════════════════════════════════════════

export const NOTIFIKASI = [
  { id: "notif-01", expertId: "exp-001", dibaca: false, createdAt: d(0,7,30),
    judul: "⚠️ Kehadiran Belum Diisi",
    isi: "Aktivitas 'Mutasi Genetik' (pukul 06:00) sudah selesai tapi kehadiran belum diisi. Segera isi agar rekap kehadiran peserta akurat.",
    tipe: "reminder", linkAktivitas: "a-today-4", linkRoute: "/presensi/a-today-4/kehadiran" },
  { id: "notif-02", expertId: "exp-001", dibaca: false, createdAt: d(0,8),
    judul: "📋 Deadline: Poster Ilmiah 14 Hari Lagi",
    isi: "Tugas Final 'Poster Ilmiah' di program Literasi Sains — Kelas 10 jatuh tempo dalam 14 hari (30 peserta). Pastikan peserta sudah mendapat pengingat.",
    tipe: "deadline", linkAktivitas: "a-014", linkRoute: "/penilaian/a-014" },
  { id: "notif-03", expertId: "exp-001", dibaca: false, createdAt: d(0,9),
    judul: "🔄 Aktivitas Di-reassign oleh Academic Lead",
    isi: "Grand Final Debat (prog-05) telah dipindahkan ke Reza Firmansyah oleh Sinta Ariani (Academic Lead) karena Anda memiliki jadwal bentrok hari ini.",
    tipe: "sistem", linkAktivitas: "a-today-3", linkRoute: "/program/prog-05" },
  { id: "notif-04", expertId: "exp-001", dibaca: false, createdAt: d(-1,15),
    judul: "👤 Peserta Baru: Dian Ayu Lestari",
    isi: "Dian Ayu Lestari baru saja bergabung ke program Literasi Sains — Kelas 10. Total peserta kini 30 orang. Pastikan ia mendapat rekap materi yang terlewat.",
    tipe: "info", linkAktivitas: null, linkRoute: "/program/prog-01" },
  { id: "notif-05", expertId: "exp-001", dibaca: false, createdAt: d(-1,9),
    judul: "📢 Pengumuman dari Academic Lead",
    isi: "Reminder dari Sinta Ariani: semua nilai harus diinput sebelum akhir minggu. Ada 3 aktivitas yang deadline penilaiannya sudah lewat.",
    tipe: "pengumuman", linkAktivitas: null, linkRoute: "/notifikasi/notif-05" },
  { id: "notif-06", expertId: "exp-001", dibaca: true, createdAt: d(-2,20),
    judul: "✅ Penilaian Simulasi OSN Selesai",
    isi: "15 peserta di program Matematika Olimpiade telah menerima nilai untuk Simulasi OSN Kabupaten. Rata-rata: 74/100. Progress dari simulasi pertama: +12 poin.",
    tipe: "info", linkAktivitas: "a-019", linkRoute: "/penilaian/a-019" },
  { id: "notif-07", expertId: "exp-001", dibaca: true, createdAt: d(-3,14),
    judul: "💬 Umpan Balik Peserta Masuk",
    isi: "Aditya Prayoga memberikan umpan balik positif untuk sesi 'Metode Ilmiah — Dari Observasi ke Kesimpulan'. Lihat detail di profil peserta.",
    tipe: "info", linkAktivitas: "a-002", linkRoute: "/presensi/a-002/peserta/p-01" },
  { id: "notif-08", expertId: "exp-001", dibaca: true, createdAt: d(-4,10),
    judul: "👥 3 Peserta Baru: Geografi & Lingkungan",
    isi: "3 peserta baru mendaftar ke program Geografi — Iklim & Lingkungan. Total peserta sekarang: 16 orang.",
    tipe: "info", linkAktivitas: null, linkRoute: "/program/prog-15" },
  { id: "notif-09", expertId: "exp-001", dibaca: true, createdAt: d(-5,16),
    judul: "✅ Semua Peserta Submit Kuis Kimia",
    isi: "Seluruh 16 peserta program Kimia Organik telah mengumpulkan 'Kuis: Identifikasi Senyawa'. Siap untuk proses penilaian.",
    tipe: "reminder", linkAktivitas: "a-039", linkRoute: "/penilaian/a-039" },
  { id: "notif-10", expertId: "exp-001", dibaca: true, createdAt: d(-7,8),
    judul: "🆕 Update Platform: Fitur Umpan Balik Diperbarui",
    isi: "Sekarang Anda bisa menjadwalkan pengumuman untuk dikirim otomatis di waktu tertentu. Coba di halaman Pengumuman pada setiap program.",
    tipe: "sistem", linkAktivitas: null, linkRoute: "/notifikasi/notif-10" },
];

// ═══════════════════════════════════════════════════════════════════
// 11. GLOSSARY — 22 istilah
// ═══════════════════════════════════════════════════════════════════

export const GLOSSARY = [
  { id: "gl-01", istilah: "Expert",              definisi: "Pengajar atau fasilitator yang ditugaskan untuk memandu program dan aktivitas pembelajaran. Expert memiliki akses untuk mengisi kehadiran, memberikan penilaian, dan menulis umpan balik." },
  { id: "gl-02", istilah: "Academic Lead",       definisi: "Pemimpin akademik yang memiliki akses penuh ke semua program dan aktivitas. Dapat melakukan intervensi, reassign Expert, dan memantau keseluruhan jalannya program." },
  { id: "gl-03", istilah: "Program",             definisi: "Serangkaian aktivitas pembelajaran terstruktur dengan tujuan, periode, dan peserta yang jelas. Satu program dapat berisi kombinasi aktivitas mengajar, menilai, dan materi." },
  { id: "gl-04", istilah: "Aktivitas",           definisi: "Satu unit kegiatan dalam program. Ada tiga tipe: Diskusi Konsultasi (Mengajar), Tugas Asesmen (Menilai), dan Materi." },
  { id: "gl-05", istilah: "Mengajar",            definisi: "Tipe aktivitas berupa sesi diskusi, kuliah, atau konsultasi langsung antara Expert dan peserta. Expert mengisi kehadiran setelah sesi selesai." },
  { id: "gl-06", istilah: "Menilai",             definisi: "Tipe aktivitas berupa tugas, kuis, atau asesmen yang dikerjakan peserta dan dinilai oleh Expert. Biasanya memiliki deadline pengumpulan dan batas waktu penilaian." },
  { id: "gl-07", istilah: "Materi",              definisi: "Tipe aktivitas berupa konten statis (dokumen, PDF, video) yang dapat diakses peserta secara mandiri. Expert meng-upload dan Expert dapat memantau siapa yang mengaksesnya." },
  { id: "gl-08", istilah: "Kehadiran",           definisi: "Rekaman status peserta dalam satu sesi mengajar. Status yang tersedia: Hadir, Izin, Sakit, dan Tanpa Keterangan." },
  { id: "gl-09", istilah: "Presensi",            definisi: "Istilah lain untuk kehadiran. Tab Presensi di navigasi bawah menampilkan daftar aktivitas hari ini yang perlu diisi kehadirannya." },
  { id: "gl-10", istilah: "Penilaian",           definisi: "Proses memberikan nilai (0–100) kepada peserta untuk tugas atau asesmen yang telah dikerjakan. Expert juga dapat menambahkan catatan per peserta." },
  { id: "gl-11", istilah: "Peserta",             definisi: "Individu yang terdaftar dalam satu atau lebih program. Peserta memiliki profil yang berisi riwayat kehadiran, penilaian, dan catatan dari Expert." },
  { id: "gl-12", istilah: "Profil Peserta",      definisi: "Halaman yang menampilkan informasi detail seorang peserta: kelas, riwayat kehadiran agregat, riwayat nilai, dan catatan dari Expert." },
  { id: "gl-13", istilah: "Umpan Balik",         definisi: "Catatan atau komentar dari Expert yang dapat ditujukan ke aktivitas tertentu, program secara keseluruhan, atau peserta individu." },
  { id: "gl-14", istilah: "Pengumuman",          definisi: "Informasi dari Expert atau Academic Lead yang ditujukan ke semua peserta dalam program atau aktivitas tertentu." },
  { id: "gl-15", istilah: "Notifikasi",          definisi: "Pemberitahuan sistem yang diterima Expert, seperti reminder deadline, peserta baru bergabung, atau perubahan penugasan dari Academic Lead." },
  { id: "gl-16", istilah: "Hak Akses",           definisi: "Daftar hal yang dapat dilakukan Expert berdasarkan perannya (role). Expert biasa memiliki akses yang lebih terbatas dibanding Academic Lead." },
  { id: "gl-17", istilah: "Draft",               definisi: "Perubahan yang sudah diisi tapi belum disubmit. Sistem menyimpan draft secara otomatis setiap 500ms sehingga data tidak hilang jika koneksi terputus." },
  { id: "gl-18", istilah: "Optimistic Update",   definisi: "Teknis: UI langsung menampilkan perubahan sebelum konfirmasi dari server, agar terasa responsif. Jika server gagal, perubahan di-rollback secara otomatis." },
  { id: "gl-19", istilah: "Sudah Diisi",         definisi: "Status aktivitas yang menandakan kehadiran sudah disubmit oleh Expert. Berbeda dengan 'Selesai' yang berarti waktu aktivitas sudah berakhir tapi kehadiran belum tentu diisi." },
  { id: "gl-20", istilah: "Tanpa Keterangan",    definisi: "Status kehadiran peserta yang tidak hadir tanpa memberikan alasan (izin atau sakit). Disingkat 'TK' di beberapa tampilan." },
  { id: "gl-21", istilah: "Assign",              definisi: "Tindakan Academic Lead untuk menugaskan Expert ke program atau aktivitas tertentu. Setelah di-assign, program/aktivitas tersebut muncul di jadwal Expert." },
  { id: "gl-22", istilah: "Audit Log",           definisi: "Rekaman semua tindakan penting yang dilakukan di sistem, terutama tindakan yang dilakukan Academic Lead seperti intervensi kehadiran dan reassign Expert." },
];

// ═══════════════════════════════════════════════════════════════════
// 12. HAK AKSES — per role
// ═══════════════════════════════════════════════════════════════════

export const HAK_AKSES = [
  {
    roleId: "expert-mengajar-menilai",
    roleLabel: "Expert — Mengajar & Menilai",
    deskripsi: "Expert dengan akses penuh untuk aktivitas mengajar dan menilai. Dapat mengisi kehadiran, memberikan penilaian, menulis umpan balik, dan membuat pengumuman di program yang ditugaskan.",
    permissions: [
      { kode: "mengajar",     label: "Mengajar",           deskripsi: "Mengakses dan mengisi kehadiran untuk aktivitas Diskusi Konsultasi." },
      { kode: "menilai",      label: "Menilai",            deskripsi: "Mengakses form penilaian dan memberikan nilai 0–100 untuk Tugas Asesmen." },
      { kode: "umpan-balik",  label: "Umpan Balik",        deskripsi: "Menulis catatan dan umpan balik per aktivitas, per peserta, atau per program." },
      { kode: "pengumuman",   label: "Pengumuman",         deskripsi: "Membuat dan mengirimkan pengumuman ke peserta dalam program yang ditugaskan." },
    ],
    tidakBisa: [
      "Melihat program dari Expert lain",
      "Mengisi kehadiran di program yang bukan miliknya",
      "Menugaskan Expert ke program",
      "Melihat audit log",
    ],
  },
  {
    roleId: "expert-menilai",
    roleLabel: "Expert — Menilai Saja",
    deskripsi: "Expert yang hanya bertugas sebagai penilai. Tidak memiliki akses untuk mengisi kehadiran atau membuat pengumuman.",
    permissions: [
      { kode: "menilai",      label: "Menilai",            deskripsi: "Mengakses form penilaian dan memberikan nilai 0–100." },
      { kode: "umpan-balik",  label: "Umpan Balik",        deskripsi: "Menulis catatan dan umpan balik per peserta." },
    ],
    tidakBisa: [
      "Mengisi kehadiran",
      "Membuat pengumuman",
      "Melihat program dari Expert lain",
    ],
  },
  {
    roleId: "academic_lead",
    roleLabel: "Academic Lead",
    deskripsi: "Pemimpin akademik dengan akses penuh ke seluruh sistem. Dapat memantau, mengintervensi, dan merekonfigurasi penugasan Expert di semua program.",
    permissions: [
      { kode: "lihat-semua-program",      label: "Lihat Semua Program",   deskripsi: "Mengakses program milik Expert mana pun." },
      { kode: "isi-kehadiran-semua",      label: "Isi Kehadiran Semua",   deskripsi: "Mengisi kehadiran di program mana pun, termasuk milik Expert lain." },
      { kode: "override-kehadiran",       label: "Override Kehadiran",    deskripsi: "Mengubah status kehadiran yang sudah diisi Expert. Perubahan dicatat di audit log." },
      { kode: "assign-program",           label: "Assign Program",        deskripsi: "Menugaskan Expert ke program baru." },
      { kode: "assign-aktivitas",         label: "Assign Aktivitas",      deskripsi: "Menugaskan aktivitas tertentu ke Expert yang berbeda dari Expert program." },
      { kode: "reassign-expert",          label: "Reassign Expert",       deskripsi: "Memindahkan penugasan dari satu Expert ke Expert lain." },
      { kode: "kirim-pengumuman-global",  label: "Pengumuman Global",     deskripsi: "Mengirimkan pengumuman ke semua Expert sekaligus." },
      { kode: "lihat-audit-log",          label: "Lihat Audit Log",       deskripsi: "Melihat rekaman semua tindakan penting di sistem." },
      { kode: "lihat-semua-peserta",      label: "Lihat Semua Peserta",   deskripsi: "Mengakses profil peserta dari program mana pun." },
    ],
    tidakBisa: [],
  },
];

// ═══════════════════════════════════════════════════════════════════
// 13. ENROLLMENTS — relasi peserta ↔ program
// ═══════════════════════════════════════════════════════════════════

export const ENROLLMENTS = [
  // prog-01: semua 30 peserta
  ...ALL_PESERTA_IDS.map(id => ({ pesertaId: id, programId: "prog-01" })),
  // prog-02 s/d prog-15: 8–22 peserta (sesuai jumlahPeserta di PROGRAMS)
  ...ALL_PESERTA_IDS.slice(0,15).map(id => ({ pesertaId: id, programId: "prog-02" })),
  ...ALL_PESERTA_IDS.slice(0,18).map(id => ({ pesertaId: id, programId: "prog-03" })),
  ...ALL_PESERTA_IDS.slice(0,12).map(id => ({ pesertaId: id, programId: "prog-04" })),
  ...ALL_PESERTA_IDS.slice(0,14).map(id => ({ pesertaId: id, programId: "prog-05" })),
  ...ALL_PESERTA_IDS.slice(0,16).map(id => ({ pesertaId: id, programId: "prog-06" })),
  ...ALL_PESERTA_IDS.slice(0,20).map(id => ({ pesertaId: id, programId: "prog-07" })),
  ...ALL_PESERTA_IDS.slice(0,22).map(id => ({ pesertaId: id, programId: "prog-08" })),
  ...ALL_PESERTA_IDS.slice(0,13).map(id => ({ pesertaId: id, programId: "prog-09" })),
  ...ALL_PESERTA_IDS.slice(0,17).map(id => ({ pesertaId: id, programId: "prog-10" })),
  ...ALL_PESERTA_IDS.slice(0,15).map(id => ({ pesertaId: id, programId: "prog-11" })),
  ...ALL_PESERTA_IDS.slice(0,19).map(id => ({ pesertaId: id, programId: "prog-12" })),
  ...ALL_PESERTA_IDS.slice(0,11).map(id => ({ pesertaId: id, programId: "prog-13" })),
  ...ALL_PESERTA_IDS.slice(0,14).map(id => ({ pesertaId: id, programId: "prog-14" })),
  ...ALL_PESERTA_IDS.slice(0,16).map(id => ({ pesertaId: id, programId: "prog-15" })),
  // selesai
  ...ALL_PESERTA_IDS.slice(0,12).map(id => ({ pesertaId: id, programId: "prog-16" })),
  ...ALL_PESERTA_IDS.slice(0,8).map(id  => ({ pesertaId: id, programId: "prog-17" })),
  ...ALL_PESERTA_IDS.slice(0,15).map(id => ({ pesertaId: id, programId: "prog-18" })),
];

// ═══════════════════════════════════════════════════════════════════
// 14. ASSIGNMENTS — expert ↔ program
// ═══════════════════════════════════════════════════════════════════

export const ASSIGNMENTS = [
  ...PROGRAMS.map(p => ({ expertId: p.expertId, programId: p.id })),
  { expertId: "exp-002", programId: "prog-16" }, // Reza co-expert di prog selesai
];

// ═══════════════════════════════════════════════════════════════════
// 15. AUDIT LOG — untuk Academic Lead
// ═══════════════════════════════════════════════════════════════════

export const AUDIT_LOG = [
  { id: "log-01", timestamp: d(-5,14), aktor: "Sinta Ariani (Academic Lead)", aksi: "Override Kehadiran",  target: "Aktivitas: Latihan Soal Aljabar (a-016)", detail: "Mengubah status Kevin Adiputra dari 'tanpa-keterangan' ke 'izin' atas permintaan orang tua." },
  { id: "log-02", timestamp: d(-3,10), aktor: "Sinta Ariani (Academic Lead)", aksi: "Reassign Aktivitas",  target: "Grand Final Debat (a-today-3)", detail: "Dipindahkan dari Mega Kurnia ke Reza Firmansyah karena jadwal bentrok." },
  { id: "log-03", timestamp: d(-1,9),  aktor: "Sinta Ariani (Academic Lead)", aksi: "Kirim Pengumuman Global", target: "Semua Expert", detail: "Reminder input nilai: 3 aktivitas sudah melewati deadline penilaian." },
  { id: "log-04", timestamp: d(0,8),   aktor: "Sinta Ariani (Academic Lead)", aksi: "Isi Kehadiran Pengganti", target: "Aktivitas: Mutasi Genetik (a-today-4)", detail: "Mengisi kehadiran menggantikan Mega Kurnia yang belum mengisi." },
  { id: "log-05", timestamp: d(-7,15), aktor: "Sinta Ariani (Academic Lead)", aksi: "Assign Program",      target: "Program: Bahasa Jepang → Reza Firmansyah", detail: "Reza Firmansyah ditambahkan sebagai expert untuk program baru." },
];

// ═══════════════════════════════════════════════════════════════════
// 16. BRAND IDENTITY — static data
// ═══════════════════════════════════════════════════════════════════

export const BRAND_IDENTITY = {
  nama: "Platform Expert — Sekolah.mu",
  tagline: "Ruang kerja Expert yang efisien dan terpadu",
  logo: { text: "Sekolah.mu Expert", format: "text-only (belum ada aset logo final)" },
  warna: [
    { nama: "Primary 600",   hex: "#0F6E56", penggunaan: "CTA utama, tab aktif, teks heading" },
    { nama: "Primary 100",   hex: "#D6F0E8", penggunaan: "Background tab aktif, pill hadir" },
    { nama: "Text Primary",  hex: "#1A1A1A", penggunaan: "Teks utama konten" },
    { nama: "Text Secondary",hex: "#6B6B6B", penggunaan: "Label, metadata, teks sekunder" },
    { nama: "Border",        hex: "#E5E5E5", penggunaan: "Garis pembatas card, input" },
    { nama: "Background",    hex: "#F8F8F8", penggunaan: "Background halaman" },
    { nama: "Danger",        hex: "#C0392B", penggunaan: "Error, overdue, tanpa keterangan" },
    { nama: "Warning",       hex: "#E67E22", penggunaan: "Belum mulai, draft" },
    { nama: "Success",       hex: "#27AE60", penggunaan: "Sudah diisi, hadir" },
  ],
  font: [
    { nama: "Satoshi", tipe: "Primary — semua teks UI", variasi: "400 Regular, 500 Medium, 700 Bold" },
    { nama: "Fallback", tipe: "System font stack", variasi: "-apple-system, BlinkMacSystemFont, sans-serif" },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// EXPORT MASTER — satu objek untuk semua MSW handlers
// ═══════════════════════════════════════════════════════════════════

const MASTER_SEED = {
  experts: EXPERTS,
  peserta: PESERTA,
  programs: PROGRAMS,
  aktivitas: AKTIVITAS,
  enrollments: ENROLLMENTS,
  assignments: ASSIGNMENTS,
  kehadiran: KEHADIRAN,
  penilaian: [...PENILAIAN, ...PENILAIAN_SEBAGIAN],
  riwayatKehadiran: RIWAYAT_KEHADIRAN_PESERTA,
  riwayatPenilaian: RIWAYAT_PENILAIAN_PESERTA,
  umpanBalik: UMPAN_BALIK,
  pengumuman: PENGUMUMAN,
  notifikasi: NOTIFIKASI,
  glossary: GLOSSARY,
  hakAkses: HAK_AKSES,
  auditLog: AUDIT_LOG,
  brandIdentity: BRAND_IDENTITY,

  // helpers untuk MSW query
  getAktivitasHariIni: () =>
    AKTIVITAS.filter(a => {
      const mulai = new Date(a.waktuMulai);
      const hari  = new Date();
      return mulai.toDateString() === hari.toDateString();
    }),

  getAktivitasByProgram: (programId: string, tipe?: AktivitasTipe) =>
    AKTIVITAS.filter(a => a.programId === programId && (!tipe || a.tipe === tipe)),

  getPesertaByProgram: (programId: string) => {
    const ids = ENROLLMENTS.filter(e => e.programId === programId).map(e => e.pesertaId);
    return PESERTA.filter(p => ids.includes(p.id));
  },

  getKehadiranByAktivitas: (aktivitasId: string) =>
    KEHADIRAN.filter(k => k.aktivitasId === aktivitasId),

  getPenilaianByAktivitas: (aktivitasId: string) =>
    [...PENILAIAN, ...PENILAIAN_SEBAGIAN].filter(n => n.aktivitasId === aktivitasId),

  getPenilaianPending: () =>
    AKTIVITAS.filter(a => a.tipe === "menilai" && a.status !== "belum-mulai")
      .map(a => {
        const dinilai = [...PENILAIAN, ...PENILAIAN_SEBAGIAN].filter(n => n.aktivitasId === a.id).length;
        const total   = a.jumlahPeserta;
        return { ...a, dinilai, total,
          statusPenilaian: dinilai === 0 ? "belum" : dinilai < total ? "sebagian" : "selesai" };
      }),

  getNotifikasiByExpert: (expertId: string, unreadOnly = false) =>
    NOTIFIKASI.filter(n => n.expertId === expertId && (!unreadOnly || !n.dibaca)),
};

export default MASTER_SEED;
