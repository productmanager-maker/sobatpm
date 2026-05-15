/**
 * PLATFORM EXPERT — TEST CREDENTIALS & USE CASES
 * 4 akun dengan skenario berbeda untuk internal testing
 *
 * Semua akun: password bebas (dummy login, tidak divalidasi)
 * Login dengan email di bawah → langsung masuk sebagai role tersebut
 *
 * Generated: 2026-05
 */

import { d } from "@/lib/seed-playground"; // helper tanggal relatif

// ═══════════════════════════════════════════════════════════════════
//
//  AKUN 1 — MEGA KURNIA
//  Expert Penuh: 15 Program, 1 Semester, 1 Program dengan 30 Peserta
//
// ═══════════════════════════════════════════════════════════════════
//
//  EMAIL   : mega.kurnia@sekolahmu.co.id
//  PASSWORD: (bebas, tidak divalidasi)
//  ROLE    : expert — mengajar + menilai
//
//  SKENARIO YANG BISA DIUJI:
//  ✓ Tab Presensi: ada 3–4 aktivitas hari ini, semua status berbeda
//  ✓ Tab Penilaian: ada tugas menumpuk (sebagian sudah, sebagian belum)
//  ✓ Tab Program: 15 program aktif, scroll panjang, ada filter aktif/selesai
//  ✓ 1 program (prog-mega-01) dengan 30 peserta → form kehadiran panjang
//  ✓ Jadwal padat selama 1 semester (Jan–Jun 2026), ~3–4 aktivitas/minggu
//  ✓ Ada aktivitas overdue (sudah selesai, kehadiran belum diisi)
//  ✓ Ada peserta yang sering absen → profil peserta menarik untuk dilihat
//  ✓ Notifikasi penuh (10 notifikasi, 5 unread)
//
// ═══════════════════════════════════════════════════════════════════

export const EXPERT_MEGA = {
  id: "exp-mega",
  nama: "Mega Kurnia",
  email: "mega.kurnia@sekolahmu.co.id",
  password: "dummy",
  role: "expert",
  permissions: ["mengajar", "menilai", "umpan-balik", "pengumuman"],
  avatarUrl: null,
  inisial: "MK",
};

// 15 program Mega untuk 1 semester (Januari–Juni 2026)
export const PROGRAMS_MEGA = [
  { id: "prog-mega-01", nama: "Literasi Sains — Kelas 10",         deskripsi: "Program pengembangan kemampuan berpikir ilmiah untuk siswa kelas 10. Mencakup metode ilmiah, eksperimen sederhana, dan presentasi data.",                              tanggalMulai: d(-120), tanggalSelesai: d(60),   status: "aktif",  jumlahPeserta: 30 },
  { id: "prog-mega-02", nama: "Matematika Olimpiade — Junior",      deskripsi: "Persiapan OSN Matematika tingkat kabupaten untuk siswa kelas 10–11. Fokus pada aljabar, kombinatorika, dan geometri.",                                                    tanggalMulai: d(-90),  tanggalSelesai: d(30),   status: "aktif",  jumlahPeserta: 15 },
  { id: "prog-mega-03", nama: "Bahasa Indonesia — Esai Argumentatif", deskripsi: "Melatih kemampuan menulis esai argumentatif yang logis dan persuasif. Setiap sesi peserta menulis, mereview, dan diulas oleh Expert.",                                  tanggalMulai: d(-80),  tanggalSelesai: d(20),   status: "aktif",  jumlahPeserta: 18 },
  { id: "prog-mega-04", nama: "Fisika Modern — Relativitas & Kuantum", deskripsi: "Eksplorasi fisika modern untuk siswa kelas 12 dan mahasiswa. Materi meliputi relativitas Einstein dan dasar mekanika kuantum secara konseptual.",                      tanggalMulai: d(-70),  tanggalSelesai: d(50),   status: "aktif",  jumlahPeserta: 12 },
  { id: "prog-mega-05", nama: "Critical Thinking & Debat",           deskripsi: "Melatih kemampuan berpikir kritis dan berdebat secara terstruktur. Format debat Australasian digunakan sebagai kerangka latihan.",                                       tanggalMulai: d(-60),  tanggalSelesai: d(45),   status: "aktif",  jumlahPeserta: 14 },
  { id: "prog-mega-06", nama: "Kimia Organik Dasar",                 deskripsi: "Pengenalan kimia organik: gugus fungsi, reaksi substitusi, dan eliminasi. Dilengkapi praktikum virtual menggunakan simulasi online.",                                     tanggalMulai: d(-55),  tanggalSelesai: d(35),   status: "aktif",  jumlahPeserta: 16 },
  { id: "prog-mega-07", nama: "English for Academic Purposes",       deskripsi: "Kemampuan bahasa Inggris akademik: academic writing, reading comprehension, dan presentasi formal dalam bahasa Inggris.",                                                  tanggalMulai: d(-50),  tanggalSelesai: d(40),   status: "aktif",  jumlahPeserta: 20 },
  { id: "prog-mega-08", nama: "Sejarah & Analisis Peristiwa Dunia",  deskripsi: "Menelaah peristiwa sejarah dunia abad 20 dengan pendekatan multiperspektif. Mengembangkan kemampuan analisis kausalitas dan konteks.",                                    tanggalMulai: d(-45),  tanggalSelesai: d(55),   status: "aktif",  jumlahPeserta: 22 },
  { id: "prog-mega-09", nama: "Biologi Sel & Genetika",              deskripsi: "Pendalaman biologi seluler dan genetika untuk persiapan OSN dan ujian masuk PTN. Termasuk simulasi pembelahan sel dan hereditas.",                                        tanggalMulai: d(-40),  tanggalSelesai: d(25),   status: "aktif",  jumlahPeserta: 13 },
  { id: "prog-mega-10", nama: "Ekonomi Mikro — Pasar & Harga",       deskripsi: "Memahami mekanisme pasar, elastisitas, dan teori harga. Menggunakan studi kasus dari ekonomi Indonesia.",                                                                 tanggalMulai: d(-35),  tanggalSelesai: d(65),   status: "aktif",  jumlahPeserta: 17 },
  { id: "prog-mega-11", nama: "Statistika & Probabilitas",           deskripsi: "Dari mean/median/modus sampai distribusi normal dan uji hipotesis sederhana. Menggunakan spreadsheet sebagai alat bantu.",                                                 tanggalMulai: d(-30),  tanggalSelesai: d(70),   status: "aktif",  jumlahPeserta: 15 },
  { id: "prog-mega-12", nama: "Pemrograman Web — HTML & CSS",        deskripsi: "Membuat halaman web dari nol. Peserta menghasilkan portfolio pribadi di akhir program.",                                                                                   tanggalMulai: d(-25),  tanggalSelesai: d(35),   status: "aktif",  jumlahPeserta: 19 },
  { id: "prog-mega-13", nama: "Filsafat & Etika Kontemporer",        deskripsi: "Diskusi filsafat tentang AI, bioetika, dan keadilan sosial. Berbasis teks pendek dan diskusi Socratic.",                                                                   tanggalMulai: d(-20),  tanggalSelesai: d(80),   status: "aktif",  jumlahPeserta: 11 },
  { id: "prog-mega-14", nama: "Sosiologi — Perubahan Sosial",        deskripsi: "Menganalisis perubahan sosial di era digital. Topik: media sosial, kesenjangan, dan gerakan sosial kontemporer.",                                                          tanggalMulai: d(-15),  tanggalSelesai: d(75),   status: "aktif",  jumlahPeserta: 14 },
  { id: "prog-mega-15", nama: "Geografi — Iklim & Lingkungan",       deskripsi: "Memahami sistem iklim bumi, perubahan iklim, dan dampaknya terhadap kehidupan. Menggunakan data real dari BMKG dan NASA.",                                                tanggalMulai: d(-10),  tanggalSelesai: d(90),   status: "aktif",  jumlahPeserta: 16 },
];

// 30 Peserta untuk prog-mega-01 (Literasi Sains)
export const PESERTA_MEGA_01 = [
  { id: "pm01-001", nama: "Aditya Prayoga",      kelas: "10-A", inisial: "AP", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-002", nama: "Berliana Safira",      kelas: "10-A", inisial: "BS", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-003", nama: "Calvin Nugroho",       kelas: "10-A", inisial: "CN", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-004", nama: "Dinda Maharani",       kelas: "10-A", inisial: "DM", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-005", nama: "Evan Firmansyah",      kelas: "10-A", inisial: "EF", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-006", nama: "Farah Aulia",          kelas: "10-B", inisial: "FA", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-007", nama: "Gibran Ramadhan",      kelas: "10-B", inisial: "GR", catatanKehadiran: "2x izin" },
  { id: "pm01-008", nama: "Hana Fitriani",        kelas: "10-B", inisial: "HF", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-009", nama: "Ilham Saputra",        kelas: "10-B", inisial: "IS", catatanKehadiran: "1x sakit" },
  { id: "pm01-010", nama: "Jessica Tanaka",       kelas: "10-B", inisial: "JT", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-011", nama: "Kevin Adiputra",       kelas: "10-C", inisial: "KA", catatanKehadiran: "sering absen" }, // ⚠ perlu perhatian
  { id: "pm01-012", nama: "Lestari Ningrum",      kelas: "10-C", inisial: "LN", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-013", nama: "Muhammad Hafiz",       kelas: "10-C", inisial: "MH", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-014", nama: "Nadira Putri",         kelas: "10-C", inisial: "NP", catatanKehadiran: "1x tanpa ket" },
  { id: "pm01-015", nama: "Omar Hadiwijaya",      kelas: "10-C", inisial: "OH", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-016", nama: "Pingkan Lorenza",      kelas: "10-D", inisial: "PL", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-017", nama: "Qisthi Amalia",        kelas: "10-D", inisial: "QA", catatanKehadiran: "sering absen" }, // ⚠ perlu perhatian
  { id: "pm01-018", nama: "Rangga Aditya",        kelas: "10-D", inisial: "RA", catatanKehadiran: "2x sakit" },
  { id: "pm01-019", nama: "Sinta Dewi",           kelas: "10-D", inisial: "SD", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-020", nama: "Taufan Hidayat",       kelas: "10-D", inisial: "TH", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-021", nama: "Ummu Kultsum",         kelas: "10-E", inisial: "UK", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-022", nama: "Valentino Santoso",    kelas: "10-E", inisial: "VS", catatanKehadiran: "1x izin" },
  { id: "pm01-023", nama: "Winda Kusuma",         kelas: "10-E", inisial: "WK", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-024", nama: "Xena Priyatno",        kelas: "10-E", inisial: "XP", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-025", nama: "Yoga Pratama",         kelas: "10-E", inisial: "YP", catatanKehadiran: "2x tanpa ket" }, // ⚠ perlu perhatian
  { id: "pm01-026", nama: "Zahra Nabila",         kelas: "10-F", inisial: "ZN", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-027", nama: "Ananda Rizky",         kelas: "10-F", inisial: "AR", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-028", nama: "Badriyah Latif",       kelas: "10-F", inisial: "BL", catatanKehadiran: "1x sakit" },
  { id: "pm01-029", nama: "Cahyo Wibisono",       kelas: "10-F", inisial: "CW", catatanKehadiran: "konsisten hadir" },
  { id: "pm01-030", nama: "Dian Ayu Lestari",     kelas: "10-F", inisial: "DA", catatanKehadiran: "konsisten hadir" },
];

// Jadwal 1 semester Mega — ~4 aktivitas/minggu selama 20 minggu
// Setiap program dapat 5–8 sesi, tersebar merata
export const AKTIVITAS_MEGA: Array<{
  id: string; programId: string; nama: string; tipe: "mengajar" | "menilai" | "materi";
  waktuMulai: string; waktuSelesai: string; lokasi: string | null;
  status: "belum-mulai" | "sedang-berlangsung" | "selesai" | "sudah-diisi";
  deskripsi: string; deadline?: string;
}> = [
  // ── PROG-MEGA-01: Literasi Sains (program utama, 30 peserta) ──────
  { id: "am-001", programId: "prog-mega-01", nama: "Orientasi & Kontrak Belajar",           tipe: "mengajar", waktuMulai: d(-119,8),  waktuSelesai: d(-119,10), lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Perkenalan program dan kontrak belajar bersama." },
  { id: "am-002", programId: "prog-mega-01", nama: "Metode Ilmiah — Teori",                 tipe: "mengajar", waktuMulai: d(-112,8),  waktuSelesai: d(-112,10), lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Memahami siklus penelitian ilmiah dari observasi ke kesimpulan." },
  { id: "am-003", programId: "prog-mega-01", nama: "Eksperimen 1: Tegangan Permukaan",      tipe: "mengajar", waktuMulai: d(-105,8),  waktuSelesai: d(-105,10), lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Praktikum virtual: mengukur tegangan permukaan air vs sabun." },
  { id: "am-004", programId: "prog-mega-01", nama: "Tugas: Laporan Eksperimen 1",           tipe: "menilai",  waktuMulai: d(-98,0),   waktuSelesai: d(-98,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Upload laporan eksperimen, dinilai berdasarkan metodologi dan kesimpulan.", deadline: d(-98,23) },
  { id: "am-005", programId: "prog-mega-01", nama: "Eksperimen 2: Hukum Archimedes",        tipe: "mengajar", waktuMulai: d(-91,8),   waktuSelesai: d(-91,10),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Praktikum virtual: benda tenggelam, terapung, melayang." },
  { id: "am-006", programId: "prog-mega-01", nama: "Presentasi Data & Grafik",              tipe: "mengajar", waktuMulai: d(-84,8),   waktuSelesai: d(-84,10),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Cara membuat grafik ilmiah yang benar dan membacanya." },
  { id: "am-007", programId: "prog-mega-01", nama: "Tugas Mid: Mini Research Proposal",     tipe: "menilai",  waktuMulai: d(-77,0),   waktuSelesai: d(-77,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Proposal penelitian mini: masalah, hipotesis, metode.", deadline: d(-77,23) },
  { id: "am-008", programId: "prog-mega-01", nama: "Eksperimen 3: Fotosintesis",            tipe: "mengajar", waktuMulai: d(-70,8),   waktuSelesai: d(-70,10),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Mengukur laju fotosintesis pada kondisi cahaya berbeda." },
  { id: "am-009", programId: "prog-mega-01", nama: "Sesi Konsultasi Proyek",                tipe: "mengajar", waktuMulai: d(-63,8),   waktuSelesai: d(-63,10),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Diskusi 1-on-1 progress penelitian masing-masing peserta." },
  { id: "am-010", programId: "prog-mega-01", nama: "Presentasi Akhir — Sesi 1",             tipe: "menilai",  waktuMulai: d(-56,8),   waktuSelesai: d(-56,11),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Presentasi hasil penelitian peserta 1–15.", deadline: d(-56,11) },
  { id: "am-011", programId: "prog-mega-01", nama: "Presentasi Akhir — Sesi 2",             tipe: "menilai",  waktuMulai: d(-49,8),   waktuSelesai: d(-49,11),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Presentasi hasil penelitian peserta 16–30.", deadline: d(-49,11) },
  { id: "am-012", programId: "prog-mega-01", nama: "Sains di Kehidupan Nyata",              tipe: "mengajar", waktuMulai: d(0,8),     waktuSelesai: d(0,10),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Diskusi aplikasi sains dalam teknologi dan kehidupan sehari-hari." },
  { id: "am-013", programId: "prog-mega-01", nama: "Tugas Final: Poster Ilmiah",            tipe: "menilai",  waktuMulai: d(14,0),    waktuSelesai: d(14,23),   lokasi: null,             status: "belum-mulai",       deskripsi: "Buat poster ilmiah dari penelitian mini yang sudah dilakukan.", deadline: d(14,23) },
  { id: "am-014", programId: "prog-mega-01", nama: "Penutupan & Refleksi Semester",         tipe: "mengajar", waktuMulai: d(55,8),    waktuSelesai: d(55,10),   lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Refleksi perjalanan belajar dan rencana pengembangan ke depan." },

  // ── PROG-MEGA-02: Matematika Olimpiade ──────────────────────────
  { id: "am-015", programId: "prog-mega-02", nama: "Aljabar — Persamaan & Pertidaksamaan",  tipe: "mengajar", waktuMulai: d(-89,13),  waktuSelesai: d(-89,15),  lokasi: "Google Meet",    status: "sudah-diisi",       deskripsi: "Teknik olimpiade untuk aljabar tingkat SMA." },
  { id: "am-016", programId: "prog-mega-02", nama: "Latihan Soal Aljabar",                  tipe: "menilai",  waktuMulai: d(-82,0),   waktuSelesai: d(-82,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "10 soal aljabar OSN, dikumpulkan dengan penyelesaian lengkap.", deadline: d(-82,23) },
  { id: "am-017", programId: "prog-mega-02", nama: "Kombinatorika Dasar",                   tipe: "mengajar", waktuMulai: d(-75,13),  waktuSelesai: d(-75,15),  lokasi: "Google Meet",    status: "sudah-diisi",       deskripsi: "Permutasi, kombinasi, dan prinsip pencacahan." },
  { id: "am-018", programId: "prog-mega-02", nama: "Geometri — Teorema Pythagoras Lanjut",  tipe: "mengajar", waktuMulai: d(-68,13),  waktuSelesai: d(-68,15),  lokasi: "Google Meet",    status: "sudah-diisi",       deskripsi: "Aplikasi Pythagoras dalam soal olimpiade." },
  { id: "am-019", programId: "prog-mega-02", nama: "Simulasi OSN Kabupaten",                tipe: "menilai",  waktuMulai: d(-61,8),   waktuSelesai: d(-61,11),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Simulasi penuh 3 jam, 30 soal.", deadline: d(-61,11) },
  { id: "am-020", programId: "prog-mega-02", nama: "Review Simulasi & Strategi",            tipe: "mengajar", waktuMulai: d(-54,13),  waktuSelesai: d(-54,15),  lokasi: "Google Meet",    status: "sudah-diisi",       deskripsi: "Pembahasan soal simulasi dan strategi hari-H." },
  { id: "am-021", programId: "prog-mega-02", nama: "Simulasi Final Sebelum OSN",            tipe: "menilai",  waktuMulai: d(25,8),    waktuSelesai: d(25,11),   lokasi: null,             status: "belum-mulai",       deskripsi: "Simulasi OSN terakhir sebelum hari perlombaan.", deadline: d(25,11) },

  // ── PROG-MEGA-03: Esai Argumentatif ──────────────────────────────
  { id: "am-022", programId: "prog-mega-03", nama: "Struktur Esai Argumentatif",            tipe: "mengajar", waktuMulai: d(-79,10),  waktuSelesai: d(-79,12),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Tesis, argumen, dan counter-argumen." },
  { id: "am-023", programId: "prog-mega-03", nama: "Review Draft Esai — Gelombang 1",       tipe: "menilai",  waktuMulai: d(-65,0),   waktuSelesai: d(-65,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Expert menilai dan memberikan umpan balik draft pertama.", deadline: d(-65,23) },
  { id: "am-024", programId: "prog-mega-03", nama: "Workshop Revisi Bersama",               tipe: "mengajar", waktuMulai: d(-58,10),  waktuSelesai: d(-58,12),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Peer-review dan sesi revisi terbimbing." },
  { id: "am-025", programId: "prog-mega-03", nama: "Review Draft Esai — Final",             tipe: "menilai",  waktuMulai: d(-30,0),   waktuSelesai: d(-30,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Penilaian esai final dengan rubrik lengkap.", deadline: d(-30,23) },
  { id: "am-026", programId: "prog-mega-03", nama: "Teknik Debat dari Esai",                tipe: "mengajar", waktuMulai: d(0,10),    waktuSelesai: d(0,12),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Mengubah argumen tertulis menjadi argumen lisan." },

  // ── PROG-MEGA-04: Fisika Modern ──────────────────────────────────
  { id: "am-027", programId: "prog-mega-04", nama: "Relativitas Khusus — Pengantar",        tipe: "mengajar", waktuMulai: d(-69,15),  waktuSelesai: d(-69,17),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Postulat Einstein, dilatasi waktu, kontraksi panjang." },
  { id: "am-028", programId: "prog-mega-04", nama: "Kuis: Relativitas",                     tipe: "menilai",  waktuMulai: d(-55,0),   waktuSelesai: d(-55,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "10 soal konseptual relativitas.", deadline: d(-55,23) },
  { id: "am-029", programId: "prog-mega-04", nama: "Mekanika Kuantum — Dualitas Gelombang", tipe: "mengajar", waktuMulai: d(-48,15),  waktuSelesai: d(-48,17),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Percobaan celah ganda dan interpretasi Copenhagen." },
  { id: "am-030", programId: "prog-mega-04", nama: "Diskusi: Implikasi Filosofis",          tipe: "mengajar", waktuMulai: d(0,15),    waktuSelesai: d(0,17),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Apa artinya determinisme di era kuantum?" },
  { id: "am-031", programId: "prog-mega-04", nama: "Essay: Fisika & Masa Depan Teknologi",  tipe: "menilai",  waktuMulai: d(45,0),    waktuSelesai: d(45,23),   lokasi: null,             status: "belum-mulai",       deskripsi: "Essay 1000 kata: bagaimana fisika modern mengubah teknologi.", deadline: d(45,23) },

  // ── PROG-MEGA-05: Critical Thinking ──────────────────────────────
  { id: "am-032", programId: "prog-mega-05", nama: "Logical Fallacies",                     tipe: "mengajar", waktuMulai: d(-59,13),  waktuSelesai: d(-59,15),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Mengenali 20 fallacy paling umum dalam argumen sehari-hari." },
  { id: "am-033", programId: "prog-mega-05", nama: "Simulasi Debat — Ronde 1",              tipe: "menilai",  waktuMulai: d(-45,13),  waktuSelesai: d(-45,16),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Debat format Australasian, mosi: AI harus diregulasi pemerintah.", deadline: d(-45,16) },
  { id: "am-034", programId: "prog-mega-05", nama: "Review & Coaching Post-Debat",          tipe: "mengajar", waktuMulai: d(-38,13),  waktuSelesai: d(-38,15),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Analisis rekaman debat, feedback individual." },
  { id: "am-035", programId: "prog-mega-05", nama: "Simulasi Debat — Grand Final",          tipe: "menilai",  waktuMulai: d(0,13),    waktuSelesai: d(0,16),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Final tournament internal program.", deadline: d(0,16) },
  { id: "am-036", programId: "prog-mega-05", nama: "Materi: Panduan Format Debat",          tipe: "materi",   waktuMulai: d(-60,0),   waktuSelesai: d(45,23),   lokasi: null,             status: "belum-mulai",       deskripsi: "Dokumen panduan format Australasian + contoh transkrip debat juara." },

  // ── PROG-MEGA-06: Kimia Organik ──────────────────────────────────
  { id: "am-037", programId: "prog-mega-06", nama: "Pengenalan Gugus Fungsi",               tipe: "mengajar", waktuMulai: d(-54,8),   waktuSelesai: d(-54,10),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Alkohol, asam karboksilat, amina, dan turunannya." },
  { id: "am-038", programId: "prog-mega-06", nama: "Reaksi Substitusi Nukleofilik",         tipe: "mengajar", waktuMulai: d(-40,8),   waktuSelesai: d(-40,10),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Mekanisme SN1 dan SN2 dengan simulasi visual." },
  { id: "am-039", programId: "prog-mega-06", nama: "Kuis: Identifikasi Senyawa",            tipe: "menilai",  waktuMulai: d(-26,0),   waktuSelesai: d(-26,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Identifikasi 15 senyawa organik dari spektrum IR.", deadline: d(-26,23) },
  { id: "am-040", programId: "prog-mega-06", nama: "Praktikum Virtual: Sintesis Aspirin",   tipe: "mengajar", waktuMulai: d(0,8),     waktuSelesai: d(0,10),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Simulasi sintesis aspirin menggunakan ChemSketch." },
  { id: "am-041", programId: "prog-mega-06", nama: "Laporan Praktikum Final",               tipe: "menilai",  waktuMulai: d(30,0),    waktuSelesai: d(30,23),   lokasi: null,             status: "belum-mulai",       deskripsi: "Laporan lengkap sintesis, yield, dan analisis.", deadline: d(30,23) },

  // ── PROG-MEGA-07 s/d 15: masing-masing 3 aktivitas ──────────────
  { id: "am-042", programId: "prog-mega-07", nama: "Academic Writing — Paragraf",           tipe: "mengajar", waktuMulai: d(-49,14),  waktuSelesai: d(-49,16),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Topic sentence, supporting details, dan concluding sentence." },
  { id: "am-043", programId: "prog-mega-07", nama: "Essay Writing Task",                    tipe: "menilai",  waktuMulai: d(-28,0),   waktuSelesai: d(-28,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Essay 500 kata, dinilai dengan IELTS band descriptor.", deadline: d(-28,23) },
  { id: "am-044", programId: "prog-mega-07", nama: "Academic Presentation Practice",        tipe: "menilai",  waktuMulai: d(0,14),    waktuSelesai: d(0,17),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Presentasi 5 menit dalam bahasa Inggris, dinilai Expert.", deadline: d(0,17) },

  { id: "am-045", programId: "prog-mega-08", nama: "Imperialisme & Dampaknya",              tipe: "mengajar", waktuMulai: d(-44,10),  waktuSelesai: d(-44,12),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Analisis imperialisme Eropa di Asia dan Afrika abad 19–20." },
  { id: "am-046", programId: "prog-mega-08", nama: "Analisis Dokumen Sejarah",              tipe: "menilai",  waktuMulai: d(-30,0),   waktuSelesai: d(-30,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Analisis sumber primer: surat, pidato, dan manifesto bersejarah.", deadline: d(-30,23) },
  { id: "am-047", programId: "prog-mega-08", nama: "Diskusi: Perang Dingin & Relevansinya", tipe: "mengajar", waktuMulai: d(0,10),    waktuSelesai: d(0,12),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Apakah pola Perang Dingin berulang di era digital?" },

  { id: "am-048", programId: "prog-mega-09", nama: "Pembelahan Sel — Mitosis & Meiosis",   tipe: "mengajar", waktuMulai: d(-39,8),   waktuSelesai: d(-39,10),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Tahapan dan perbedaan mitosis vs meiosis, animasi interaktif." },
  { id: "am-049", programId: "prog-mega-09", nama: "Kuis Genetika Mendel",                  tipe: "menilai",  waktuMulai: d(-25,0),   waktuSelesai: d(-25,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "15 soal pewarisan sifat Mendel.", deadline: d(-25,23) },
  { id: "am-050", programId: "prog-mega-09", nama: "Mutasi & Penyakit Genetik",             tipe: "mengajar", waktuMulai: d(0,8),     waktuSelesai: d(0,10),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Tipe mutasi dan hubungannya dengan penyakit genetik." },

  { id: "am-051", programId: "prog-mega-10", nama: "Hukum Permintaan & Penawaran",          tipe: "mengajar", waktuMulai: d(-34,13),  waktuSelesai: d(-34,15),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Kurva D & S, keseimbangan pasar, dan pergeseran." },
  { id: "am-052", programId: "prog-mega-10", nama: "Studi Kasus: Harga BBM Indonesia",      tipe: "menilai",  waktuMulai: d(-20,0),   waktuSelesai: d(-20,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Analisis kebijakan subsidi BBM dengan kerangka ekonomi mikro.", deadline: d(-20,23) },
  { id: "am-053", programId: "prog-mega-10", nama: "Diskusi: Pasar Monopoli vs Kompetitif", tipe: "mengajar", waktuMulai: d(0,13),    waktuSelesai: d(0,15),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Perbandingan struktur pasar dan implikasinya bagi konsumen." },

  { id: "am-054", programId: "prog-mega-11", nama: "Mean, Median, Modus & Dispersi",       tipe: "mengajar", waktuMulai: d(-29,10),  waktuSelesai: d(-29,12),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Statistik deskriptif dengan data real: nilai ujian kelas." },
  { id: "am-055", programId: "prog-mega-11", nama: "Latihan: Analisis Data Spreadsheet",   tipe: "menilai",  waktuMulai: d(-15,0),   waktuSelesai: d(-15,23),  lokasi: null,             status: "sudah-diisi",       deskripsi: "Analisis dataset 100 baris menggunakan Google Sheets.", deadline: d(-15,23) },
  { id: "am-056", programId: "prog-mega-11", nama: "Distribusi Normal & Aplikasi",          tipe: "mengajar", waktuMulai: d(0,10),    waktuSelesai: d(0,12),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Bell curve, z-score, dan aplikasi dalam ujian standar." },

  { id: "am-057", programId: "prog-mega-12", nama: "HTML Dasar — Struktur Halaman",        tipe: "mengajar", waktuMulai: d(-24,15),  waktuSelesai: d(-24,17),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Tag HTML, semantic elements, dan struktur dokumen." },
  { id: "am-058", programId: "prog-mega-12", nama: "CSS — Warna, Font, Layout",            tipe: "mengajar", waktuMulai: d(-17,15),  waktuSelesai: d(-17,17),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Box model, flexbox dasar, dan styling teks." },
  { id: "am-059", programId: "prog-mega-12", nama: "Submit: Halaman Portfolio Pribadi",    tipe: "menilai",  waktuMulai: d(30,0),    waktuSelesai: d(30,23),   lokasi: null,             status: "belum-mulai",       deskripsi: "Deploy halaman portfolio ke GitHub Pages, dinilai Expert.", deadline: d(30,23) },

  { id: "am-060", programId: "prog-mega-13", nama: "Apa itu Etika? — Pengantar",           tipe: "mengajar", waktuMulai: d(-19,16),  waktuSelesai: d(-19,18),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Utilitarianisme, deontologi, dan virtue ethics dalam kehidupan nyata." },
  { id: "am-061", programId: "prog-mega-13", nama: "Diskusi: Etika AI",                    tipe: "mengajar", waktuMulai: d(-5,16),   waktuSelesai: d(-5,18),   lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Siapa yang bertanggung jawab ketika AI membuat kesalahan?" },
  { id: "am-062", programId: "prog-mega-13", nama: "Essay: Dilema Etika Kontemporer",      tipe: "menilai",  waktuMulai: d(75,0),    waktuSelesai: d(75,23),   lokasi: null,             status: "belum-mulai",       deskripsi: "Essay 800 kata tentang dilema etika pilihan peserta.", deadline: d(75,23) },

  { id: "am-063", programId: "prog-mega-14", nama: "Perubahan Sosial di Era Digital",      tipe: "mengajar", waktuMulai: d(-14,13),  waktuSelesai: d(-14,15),  lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Teori perubahan sosial dan dampak media sosial terhadap identitas." },
  { id: "am-064", programId: "prog-mega-14", nama: "Observasi Sosial Mini",                tipe: "menilai",  waktuMulai: d(-3,0),    waktuSelesai: d(-3,23),   lokasi: null,             status: "sudah-diisi",       deskripsi: "Peserta mengobservasi 1 fenomena sosial di sekitarnya, tulis laporan singkat.", deadline: d(-3,23) },
  { id: "am-065", programId: "prog-mega-14", nama: "Gerakan Sosial & Aksi Kolektif",       tipe: "mengajar", waktuMulai: d(0,13),    waktuSelesai: d(0,15),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "Dari Fridays for Future hingga #MeToo — anatomi gerakan sosial modern." },

  { id: "am-066", programId: "prog-mega-15", nama: "Sistem Iklim Bumi",                    tipe: "mengajar", waktuMulai: d(-9,8),    waktuSelesai: d(-9,10),   lokasi: "Zoom",           status: "sudah-diisi",       deskripsi: "Atmosfer, lautan, dan daratan sebagai sistem terintegrasi." },
  { id: "am-067", programId: "prog-mega-15", nama: "Analisis Data Iklim BMKG",             tipe: "menilai",  waktuMulai: d(-2,0),    waktuSelesai: d(-2,23),   lokasi: null,             status: "sudah-diisi",       deskripsi: "Analisis data suhu dan curah hujan 10 tahun terakhir dari dataset BMKG.", deadline: d(-2,23) },
  { id: "am-068", programId: "prog-mega-15", nama: "Diskusi: Kebijakan Iklim Indonesia",   tipe: "mengajar", waktuMulai: d(0,8),     waktuSelesai: d(0,10),    lokasi: "Zoom",           status: "belum-mulai",       deskripsi: "NDC Indonesia dan tantangan transisi energi terbarukan." },

  // ── HARI INI untuk Mega ─────────────────────────────────────────
  { id: "am-today-1", programId: "prog-mega-01", nama: "Sains di Kehidupan Nyata (PAGI)",     tipe: "mengajar", waktuMulai: d(0,8),  waktuSelesai: d(0,10),  lokasi: "Zoom", status: "sudah-diisi",       deskripsi: "Sudah selesai pagi ini." },
  { id: "am-today-2", programId: "prog-mega-02", nama: "Review Aljabar (SIANG - BERLANGSUNG)", tipe: "mengajar", waktuMulai: d(0,10), waktuSelesai: d(0,12),  lokasi: "Google Meet", status: "sedang-berlangsung", deskripsi: "Sedang berlangsung." },
  { id: "am-today-3", programId: "prog-mega-05", nama: "Grand Final Debat (SIANG)",            tipe: "menilai",  waktuMulai: d(0,13), waktuSelesai: d(0,16),  lokasi: "Zoom", status: "belum-mulai", deskripsi: "Belum mulai.", deadline: d(0,16) },
  { id: "am-today-4", programId: "prog-mega-09", nama: "Mutasi Genetik (SUBUH - TERLUPA)",     tipe: "mengajar", waktuMulai: d(0,6),  waktuSelesai: d(0,7,30),lokasi: "Zoom", status: "selesai", deskripsi: "Selesai tapi kehadiran belum diisi — edge case." },
];

// Assignments Mega
export const ASSIGNMENTS_MEGA = PROGRAMS_MEGA.map(p => ({
  expertId: "exp-mega",
  programId: p.id,
}));

// ═══════════════════════════════════════════════════════════════════
//
//  AKUN 2 — REZA FIRMANSYAH
//  Expert Baru: 2 Program, Jadwal Ringan, Baru Mulai
//
// ═══════════════════════════════════════════════════════════════════
//
//  EMAIL   : reza.firmansyah@sekolahmu.co.id
//  PASSWORD: (bebas)
//  ROLE    : expert — mengajar saja
//
//  SKENARIO YANG BISA DIUJI:
//  ✓ Expert baru — tidak banyak history kehadiran
//  ✓ Hanya 2 program, jadwal ringan
//  ✓ Penilaian belum pernah diisi sama sekali → state kosong
//  ✓ 1 notifikasi masuk dari Academic Lead (penugasan baru)
//  ✓ Halaman Hak Akses relevan — menampilkan role "mengajar saja"
//  ✓ Bisa menjadi target assign dari Academic Lead (Akun 4)
//
// ═══════════════════════════════════════════════════════════════════

export const EXPERT_REZA = {
  id: "exp-reza",
  nama: "Reza Firmansyah",
  email: "reza.firmansyah@sekolahmu.co.id",
  password: "dummy",
  role: "expert",
  permissions: ["mengajar", "umpan-balik", "pengumuman"],
  avatarUrl: null,
  inisial: "RF",
};

export const PROGRAMS_REZA = [
  { id: "prog-reza-01", nama: "Bahasa Jepang — Hiragana & Katakana", deskripsi: "Kelas pemula bahasa Jepang. Belajar membaca dan menulis hiragana, katakana, dan 50 kanji dasar.",                  tanggalMulai: d(-5),  tanggalSelesai: d(55), status: "aktif", jumlahPeserta: 8 },
  { id: "prog-reza-02", nama: "Musik — Teori Dasar & Solmisasi",     deskripsi: "Dasar-dasar teori musik: not balok, solmisasi, birama, dan ritme. Cocok untuk pemula yang ingin belajar alat musik.", tanggalMulai: d(-3),  tanggalSelesai: d(45), status: "aktif", jumlahPeserta: 6 },
];

export const AKTIVITAS_REZA = [
  { id: "ar-001", programId: "prog-reza-01", nama: "Hiragana — Baris A-I-U-E-O",       tipe: "mengajar" as const, waktuMulai: d(-4,14),  waktuSelesai: d(-4,16),  lokasi: "Zoom", status: "sudah-diisi" as const,  deskripsi: "Latihan menulis dan membaca 5 karakter hiragana pertama." },
  { id: "ar-002", programId: "prog-reza-01", nama: "Hiragana — Baris Ka-Sa-Ta-Na",     tipe: "mengajar" as const, waktuMulai: d(0,14),   waktuSelesai: d(0,16),   lokasi: "Zoom", status: "belum-mulai" as const, deskripsi: "Melanjutkan hafalan hiragana baris Ka, Sa, Ta, Na." },
  { id: "ar-003", programId: "prog-reza-01", nama: "Kuis: Hiragana A–Na",              tipe: "menilai" as const,  waktuMulai: d(7,0),    waktuSelesai: d(7,23),   lokasi: null,   status: "belum-mulai" as const, deskripsi: "Kuis tulis-baca 40 karakter hiragana.", deadline: d(7,23) },
  { id: "ar-004", programId: "prog-reza-02", nama: "Pengenalan Not Balok",             tipe: "mengajar" as const, waktuMulai: d(-2,16),  waktuSelesai: d(-2,18),  lokasi: "Zoom", status: "sudah-diisi" as const,  deskripsi: "Membaca not pada garis paranada treble clef." },
  { id: "ar-005", programId: "prog-reza-02", nama: "Latihan Solmisasi Do-Re-Mi",       tipe: "mengajar" as const, waktuMulai: d(0,16),   waktuSelesai: d(0,18),   lokasi: "Zoom", status: "belum-mulai" as const, deskripsi: "Latihan solmisasi lagu sederhana bersama." },
];

// ═══════════════════════════════════════════════════════════════════
//
//  AKUN 3 — DIANA PUSPITA
//  Expert Menilai Saja: 3 Program Assessment, Banyak Tugas Menumpuk
//
// ═══════════════════════════════════════════════════════════════════
//
//  EMAIL   : diana.puspita@sekolahmu.co.id
//  PASSWORD: (bebas)
//  ROLE    : expert — menilai saja
//
//  SKENARIO YANG BISA DIUJI:
//  ✓ Tab Presensi: hampir kosong (tidak ada aktivitas mengajar)
//  ✓ Tab Penilaian: penuh — 3 program × banyak tugas, sebagian overdue
//  ✓ Ada tugas dengan 20+ peserta belum dinilai (progress 0/20)
//  ✓ Ada tugas sebagian dinilai (progress 12/20)
//  ✓ Ada tugas overdue dengan badge "Terlambat"
//  ✓ Tidak punya akses Pengumuman (bisa test Hak Akses)
//
// ═══════════════════════════════════════════════════════════════════

export const EXPERT_DIANA = {
  id: "exp-diana",
  nama: "Diana Puspita",
  email: "diana.puspita@sekolahmu.co.id",
  password: "dummy",
  role: "expert",
  permissions: ["menilai", "umpan-balik"],
  avatarUrl: null,
  inisial: "DP",
};

export const PROGRAMS_DIANA = [
  { id: "prog-diana-01", nama: "Asesmen Kompetensi Menulis — Kelas 11",    deskripsi: "Program asesmen kemampuan menulis narasi, deskripsi, dan argumentasi untuk kelas 11.",      tanggalMulai: d(-30), tanggalSelesai: d(30), status: "aktif", jumlahPeserta: 20 },
  { id: "prog-diana-02", nama: "Asesmen Matematika Semester Ganjil",        deskripsi: "Bank soal dan penilaian matematika wajib kelas 10. Diana sebagai penilai tugas dan kuis.", tanggalMulai: d(-45), tanggalSelesai: d(15), status: "aktif", jumlahPeserta: 25 },
  { id: "prog-diana-03", nama: "Portofolio Seni — Semester 1",              deskripsi: "Penilaian portofolio karya seni rupa peserta. Expert menilai 5 karya per peserta.",         tanggalMulai: d(-60), tanggalSelesai: d(-5), status: "selesai", jumlahPeserta: 15 },
];

export const AKTIVITAS_DIANA = [
  // Program 1 — campuran progress
  { id: "ad-001", programId: "prog-diana-01", nama: "Tugas 1: Narasi Pengalaman",       tipe: "menilai" as const, waktuMulai: d(-25,0),  waktuSelesai: d(-25,23), lokasi: null, status: "sudah-diisi" as const,  deskripsi: "Narasi 300 kata pengalaman berkesan.", deadline: d(-25,23) },
  { id: "ad-002", programId: "prog-diana-01", nama: "Tugas 2: Deskripsi Tempat",        tipe: "menilai" as const, waktuMulai: d(-18,0),  waktuSelesai: d(-18,23), lokasi: null, status: "sudah-diisi" as const,  deskripsi: "Deskripsi tempat favorit, 400 kata.", deadline: d(-18,23) },
  { id: "ad-003", programId: "prog-diana-01", nama: "Tugas 3: Esai Argumentatif",       tipe: "menilai" as const, waktuMulai: d(-7,0),   waktuSelesai: d(-7,23),  lokasi: null, status: "sudah-diisi" as const,  deskripsi: "Esai 500 kata tentang isu sosial pilihan.", deadline: d(-7,23) },
  { id: "ad-004", programId: "prog-diana-01", nama: "Tugas 4: Laporan Investigasi",     tipe: "menilai" as const, waktuMulai: d(-3,0),   waktuSelesai: d(-1,23),  lokasi: null, status: "selesai" as const,      deskripsi: "Laporan investigasi, BARU MASUK — belum ada yang dinilai.", deadline: d(-1,23) },
  { id: "ad-005", programId: "prog-diana-01", nama: "Ujian Tengah Program",             tipe: "menilai" as const, waktuMulai: d(0,8),    waktuSelesai: d(0,11),   lokasi: null, status: "belum-mulai" as const,  deskripsi: "Ujian tulis 90 menit.", deadline: d(3,23) },

  // Program 2 — ada yang overdue
  { id: "ad-006", programId: "prog-diana-02", nama: "Kuis 1: Bilangan Bulat",           tipe: "menilai" as const, waktuMulai: d(-40,0),  waktuSelesai: d(-40,23), lokasi: null, status: "sudah-diisi" as const,  deskripsi: "20 soal pilihan ganda.", deadline: d(-40,23) },
  { id: "ad-007", programId: "prog-diana-02", nama: "Kuis 2: Aljabar Dasar",            tipe: "menilai" as const, waktuMulai: d(-30,0),  waktuSelesai: d(-30,23), lokasi: null, status: "sudah-diisi" as const,  deskripsi: "15 soal esai singkat.", deadline: d(-30,23) },
  { id: "ad-008", programId: "prog-diana-02", nama: "Kuis 3: Geometri (OVERDUE)",       tipe: "menilai" as const, waktuMulai: d(-10,0),  waktuSelesai: d(-8,23),  lokasi: null, status: "selesai" as const,      deskripsi: "Batas nilai sudah lewat 8 hari — belum semua dinilai.", deadline: d(-8,23) },
  { id: "ad-009", programId: "prog-diana-02", nama: "Ujian Akhir Semester",             tipe: "menilai" as const, waktuMulai: d(10,0),   waktuSelesai: d(10,23),  lokasi: null, status: "belum-mulai" as const,  deskripsi: "Ujian akhir 40 soal.", deadline: d(12,23) },

  // Program 3 — selesai, semua sudah dinilai
  { id: "ad-010", programId: "prog-diana-03", nama: "Portofolio Sketsa",                tipe: "menilai" as const, waktuMulai: d(-55,0),  waktuSelesai: d(-55,23), lokasi: null, status: "sudah-diisi" as const,  deskripsi: "5 karya sketsa hitam-putih.", deadline: d(-55,23) },
  { id: "ad-011", programId: "prog-diana-03", nama: "Portofolio Warna",                 tipe: "menilai" as const, waktuMulai: d(-40,0),  waktuSelesai: d(-40,23), lokasi: null, status: "sudah-diisi" as const,  deskripsi: "3 karya berwarna, media bebas.", deadline: d(-40,23) },
  { id: "ad-012", programId: "prog-diana-03", nama: "Portofolio Digital Final",         tipe: "menilai" as const, waktuMulai: d(-8,0),   waktuSelesai: d(-8,23),  lokasi: null, status: "sudah-diisi" as const,  deskripsi: "1 karya digital sebagai penutup portofolio.", deadline: d(-8,23) },
];

// ═══════════════════════════════════════════════════════════════════
//
//  AKUN 4 — SINTA ARIANI
//  Academic Lead: Lihat semua program, bisa intervensi & reassign
//
// ═══════════════════════════════════════════════════════════════════
//
//  EMAIL   : sinta.ariani@sekolahmu.co.id
//  PASSWORD: (bebas)
//  ROLE    : academic_lead
//
//  APA YANG BISA DILAKUKAN (use cases lengkap):
//
//  [LIHAT]
//  ✓ Lihat SEMUA program dari semua expert (bukan hanya miliknya)
//  ✓ Lihat siapa expert yang pegang program mana
//  ✓ Lihat status kehadiran dan penilaian di setiap program
//  ✓ Lihat profil peserta lintas program
//  ✓ Dashboard ringkasan: total program, total peserta, total aktivitas hari ini
//
//  [INTERVENSI KEHADIRAN]
//  ✓ Buka form kehadiran program apapun (walau bukan expert-nya)
//  ✓ Isi kehadiran untuk menggantikan expert yang tidak hadir
//  ✓ Override kehadiran yang sudah diisi expert
//  ✓ Log audit: "Diisi oleh Sinta Ariani (Academic Lead) menggantikan Mega Kurnia"
//
//  [ASSIGN & REASSIGN]
//  ✓ Assign program baru ke Expert mana pun
//  ✓ Assign AKTIVITAS TERTENTU ke Expert lain (bukan seluruh program)
//  ✓ Setelah assign, aktivitas otomatis muncul di jadwal Expert tersebut
//  ✓ Expert yang di-assign mendapat notifikasi otomatis
//  ✓ Reassign dari Expert A ke Expert B (Expert A kehilangan akses aktivitas itu)
//  ✓ Unassign: hapus penugasan tanpa menghapus aktivitasnya
//
//  [NOTIFIKASI & PENGUMUMAN]
//  ✓ Kirim pengumuman ke semua Expert sekaligus
//  ✓ Kirim notifikasi individual ke Expert tertentu
//  ✓ Lihat riwayat pengumuman yang sudah terkirim
//
//  [HAK AKSES SINTA vs EXPERT BIASA]
//  | Fitur                          | Expert | Academic Lead |
//  |--------------------------------|--------|---------------|
//  | Lihat program sendiri          |   ✓    |      ✓        |
//  | Lihat program semua Expert     |   ✗    |      ✓        |
//  | Isi kehadiran program sendiri  |   ✓    |      ✓        |
//  | Isi kehadiran program Expert   |   ✗    |      ✓        |
//  | Assign program ke Expert       |   ✗    |      ✓        |
//  | Assign aktivitas ke Expert     |   ✗    |      ✓        |
//  | Lihat semua profil peserta     |   ✗*   |      ✓        |
//  | Kirim pengumuman global        |   ✗    |      ✓        |
//  | Lihat log audit                |   ✗    |      ✓        |
//  (*Expert hanya lihat peserta di programnya sendiri)
//
// ═══════════════════════════════════════════════════════════════════

export const ACADEMIC_LEAD_SINTA = {
  id: "exp-sinta",
  nama: "Sinta Ariani",
  email: "sinta.ariani@sekolahmu.co.id",
  password: "dummy",
  role: "academic_lead",
  permissions: [
    "lihat-semua-program",
    "isi-kehadiran-semua",
    "assign-program",
    "assign-aktivitas",
    "reassign-expert",
    "kirim-pengumuman-global",
    "lihat-audit-log",
    "lihat-semua-peserta",
    "override-kehadiran",
  ],
  avatarUrl: null,
  inisial: "SA",
};

// Skenario pre-built untuk testing Academic Lead
// (inject ke database sebagai state awal yang siap diuji)
export const AKADEMIK_LEAD_SCENARIOS = [
  {
    id: "scenario-001",
    label: "Expert tidak hadir — kehadiran belum diisi",
    deskripsi: "Mega Kurnia tidak hadir hari ini untuk aktivitas am-today-4. Sinta bisa masuk dan isi kehadiran sebagai pengganti.",
    aktivitasId: "am-today-4",
    expertAsliId: "exp-mega",
    statusKehadiran: null, // belum diisi sama sekali
  },
  {
    id: "scenario-002",
    label: "Reassign aktivitas ke Expert lain",
    deskripsi: "Mega Kurnia cuti minggu depan. Aktivitas am-today-3 (Grand Final Debat) perlu di-assign ke Reza Firmansyah.",
    aktivitasId: "am-today-3",
    expertAsliId: "exp-mega",
    expertBaruId: "exp-reza",
    notifKeExpertBaru: "Anda mendapat penugasan baru: Grand Final Debat dari program Critical Thinking & Debat. Silakan cek jadwal Anda.",
  },
  {
    id: "scenario-003",
    label: "Assign seluruh program ke Expert baru",
    deskripsi: "Program prog-reza-01 (Bahasa Jepang) akan ditambah co-Expert. Sinta assign Diana Puspita sebagai co-Expert.",
    programId: "prog-reza-01",
    expertTambahId: "exp-diana",
    notifKeDiana: "Anda ditambahkan sebagai co-Expert pada program Bahasa Jepang — Hiragana & Katakana oleh Academic Lead.",
  },
];

// Audit log contoh — untuk ditampilkan di halaman audit Academic Lead
export const AUDIT_LOG_SAMPLE = [
  { id: "log-001", timestamp: d(-5,14), aktor: "Sinta Ariani (Academic Lead)", aksi: "Isi kehadiran",    detail: "Mengisi kehadiran aktivitas 'Latihan Soal Aljabar' (am-016) menggantikan Mega Kurnia", targetId: "am-016" },
  { id: "log-002", timestamp: d(-3,10), aktor: "Sinta Ariani (Academic Lead)", aksi: "Assign aktivitas", detail: "Menugaskan aktivitas 'Kuis: Hiragana A–Na' (ar-003) ke Reza Firmansyah",               targetId: "ar-003" },
  { id: "log-003", timestamp: d(-1,9),  aktor: "Sinta Ariani (Academic Lead)", aksi: "Kirim pengumuman", detail: "Pengumuman global: 'Reminder: deadline input nilai Kuis Geometri sudah dekat'",        targetId: null },
  { id: "log-004", timestamp: d(0,8),   aktor: "Sinta Ariani (Academic Lead)", aksi: "Override kehadiran",detail: "Mengubah status Yoga Pratama (pm01-025) dari 'tanpa-keterangan' ke 'izin' di aktivitas am-today-1", targetId: "am-today-1" },
];

// Notifikasi untuk Reza (dari Academic Lead — scenario reassign)
export const NOTIFIKASI_REZA = [
  { id: "notif-reza-001", expertId: "exp-reza", judul: "Penugasan baru dari Academic Lead", isi: "Sinta Ariani menugaskan aktivitas 'Grand Final Debat' ke Anda. Aktivitas ini akan tampil di jadwal Anda.", dibaca: false, createdAt: d(0,9), linkAktivitas: "am-today-3" },
];

// Notifikasi untuk Mega (banyak, untuk test notifikasi penuh)
export const NOTIFIKASI_MEGA = [
  { id: "notif-mega-001", expertId: "exp-mega", judul: "Pengingat: kehadiran belum diisi",      isi: "Aktivitas 'Mutasi Genetik' (06:00) sudah selesai — kehadiran belum diisi.",              dibaca: false, createdAt: d(0,7,30),  linkAktivitas: "am-today-4" },
  { id: "notif-mega-002", expertId: "exp-mega", judul: "Tenggat: Poster Ilmiah 14 hari lagi",   isi: "Tugas Poster Ilmiah di program Literasi Sains jatuh tempo dalam 14 hari.",              dibaca: false, createdAt: d(0,8),     linkAktivitas: "am-013" },
  { id: "notif-mega-003", expertId: "exp-mega", judul: "Aktivitas di-reassign oleh Academic Lead", isi: "Grand Final Debat telah dipindahkan ke Reza Firmansyah oleh Sinta Ariani.",        dibaca: false, createdAt: d(0,9),     linkAktivitas: "am-today-3" },
  { id: "notif-mega-004", expertId: "exp-mega", judul: "Peserta baru: Dian Ayu Lestari",        isi: "Peserta baru bergabung ke program Literasi Sains Kelas 10.",                         dibaca: false, createdAt: d(-1,15),   linkAktivitas: null },
  { id: "notif-mega-005", expertId: "exp-mega", judul: "Pengumuman dari Academic Lead",         isi: "Reminder: deadline input nilai Kuis Geometri sudah dekat — mohon segera diselesaikan.", dibaca: true,  createdAt: d(-1,9),    linkAktivitas: null },
  { id: "notif-mega-006", expertId: "exp-mega", judul: "Simulasi OSN selesai dinilai",          isi: "15 peserta di program Matematika Olimpiade sudah menerima nilai simulasi.",             dibaca: true,  createdAt: d(-2,20),   linkAktivitas: "am-019" },
  { id: "notif-mega-007", expertId: "exp-mega", judul: "Ulasan peserta masuk",                  isi: "Alya Putri Rahma memberikan umpan balik untuk sesi 'Metode Ilmiah'.",                  dibaca: true,  createdAt: d(-3,14),   linkAktivitas: "am-002" },
  { id: "notif-mega-008", expertId: "exp-mega", judul: "Program Geografi: peserta bergabung",   isi: "3 peserta baru mendaftar ke program Geografi — Iklim & Lingkungan.",                  dibaca: true,  createdAt: d(-4,10),   linkAktivitas: null },
  { id: "notif-mega-009", expertId: "exp-mega", judul: "Kuis Kimia sudah disubmit semua",       isi: "Seluruh 16 peserta sudah mengumpulkan Kuis: Identifikasi Senyawa. Siap dinilai.",      dibaca: true,  createdAt: d(-5,16),   linkAktivitas: "ad-008" },
  { id: "notif-mega-010", expertId: "exp-mega", judul: "Update platform: fitur pengumuman baru", isi: "Sekarang Anda bisa jadwalkan pengumuman untuk dikirim otomatis di waktu tertentu.",   dibaca: true,  createdAt: d(-7,8),    linkAktivitas: null },
];

// ═══════════════════════════════════════════════════════════════════
// RINGKASAN CREDENTIALS — copy ini untuk tim
// ═══════════════════════════════════════════════════════════════════

export const CREDENTIAL_SUMMARY = `
╔══════════════════════════════════════════════════════════════╗
║         PLATFORM EXPERT — TEST CREDENTIALS                  ║
║         (password bebas, tidak divalidasi)                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1. MEGA KURNIA — Expert Penuh                               ║
║     Email : mega.kurnia@sekolahmu.co.id                     ║
║     Kasus : 15 program, 1 semester, 30 peserta di prog-1    ║
║     Coba  : Tab Presensi (4 aktivitas hari ini)             ║
║             Form kehadiran 30 peserta                        ║
║             Penilaian menumpuk, notifikasi penuh (10)       ║
║                                                              ║
║  2. REZA FIRMANSYAH — Expert Baru                            ║
║     Email : reza.firmansyah@sekolahmu.co.id                 ║
║     Kasus : 2 program ringan, baru mulai                    ║
║             Tidak ada history penilaian                      ║
║     Coba  : State kosong, notifikasi penugasan baru         ║
║             Target assign dari Academic Lead                 ║
║                                                              ║
║  3. DIANA PUSPITA — Expert Penilai Saja                      ║
║     Email : diana.puspita@sekolahmu.co.id                   ║
║     Kasus : 3 program, penilaian menumpuk, ada overdue      ║
║     Coba  : Tab Presensi hampir kosong                       ║
║             Tab Penilaian penuh (progress bervariasi)       ║
║             Badge "Terlambat" pada kuis overdue             ║
║             Hak Akses: tidak bisa Pengumuman                ║
║                                                              ║
║  4. SINTA ARIANI — Academic Lead                             ║
║     Email : sinta.ariani@sekolahmu.co.id                    ║
║     Kasus : Lihat semua program, intervensi, reassign       ║
║     Coba  : Dashboard semua program (bukan hanya miliknya)  ║
║             Isi kehadiran untuk Mega yang tidak hadir       ║
║             Assign aktivitas am-today-3 ke Reza             ║
║             Lihat audit log perubahan                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

// Export semua untuk MSW / database seeder
export const CREDENTIAL_SEED = {
  experts: [EXPERT_MEGA, EXPERT_REZA, EXPERT_DIANA, ACADEMIC_LEAD_SINTA],
  programs: [...PROGRAMS_MEGA, ...PROGRAMS_REZA, ...PROGRAMS_DIANA],
  participants: PESERTA_MEGA_01,
  activities: [...AKTIVITAS_MEGA, ...AKTIVITAS_REZA, ...AKTIVITAS_DIANA],
  assignments: [
    ...ASSIGNMENTS_MEGA,
    { expertId: "exp-reza",  programId: "prog-reza-01" },
    { expertId: "exp-reza",  programId: "prog-reza-02" },
    { expertId: "exp-diana", programId: "prog-diana-01" },
    { expertId: "exp-diana", programId: "prog-diana-02" },
    { expertId: "exp-diana", programId: "prog-diana-03" },
  ],
  enrollments: [
    // prog-mega-01: semua 30 peserta
    ...PESERTA_MEGA_01.map(p => ({ pesertaId: p.id, programId: "prog-mega-01" })),
    // prog-reza-01: peserta 1–8 dari seed utama
    ...["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008"].map(id => ({ pesertaId: id, programId: "prog-reza-01" })),
    // prog-reza-02: peserta 9–14
    ...["usr-009","usr-010","usr-011","usr-012","usr-013","usr-014"].map(id => ({ pesertaId: id, programId: "prog-reza-02" })),
    // prog-diana-01: 20 peserta
    ...Array.from({ length: 20 }, (_, i) => ({ pesertaId: `pm01-0${String(i+1).padStart(2,"0")}`, programId: "prog-diana-01" })),
    // prog-diana-02: 25 peserta (mix)
    ...PESERTA_MEGA_01.slice(0, 25).map(p => ({ pesertaId: p.id, programId: "prog-diana-02" })),
    // prog-diana-03: 15 peserta
    ...PESERTA_MEGA_01.slice(0, 15).map(p => ({ pesertaId: p.id, programId: "prog-diana-03" })),
  ],
  notifications: [...NOTIFIKASI_MEGA, ...NOTIFIKASI_REZA],
  akademikLeadScenarios: AKADEMIK_LEAD_SCENARIOS,
  auditLog: AUDIT_LOG_SAMPLE,
};

export default CREDENTIAL_SEED;
