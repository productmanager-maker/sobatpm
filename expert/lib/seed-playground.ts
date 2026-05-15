/**
 * PLATFORM EXPERT — PLAYGROUND SEED DATA
 * 15 kombinasi program + aktivitas untuk internal team trial
 *
 * Cara update data:
 * - Tambah program baru → push ke PROGRAMS array
 * - Tambah aktivitas → push ke ACTIVITIES array, isi programId yang sesuai
 * - Tambah peserta → push ke PARTICIPANTS array
 * - Tambah expert → push ke EXPERTS array
 * - Assign expert ke program → push ke ASSIGNMENTS array
 * - Enroll peserta ke program → push ke ENROLLMENTS array
 *
 * Untuk generate ID baru: pakai crypto.randomUUID() atau format
 * manual seperti yang ada (ex: "prog-016", "akt-051", "usr-021")
 *
 * Generated: 2026-05
 */

// ─────────────────────────────────────────
// HELPER — tanggal relatif dari hari ini
// ─────────────────────────────────────────
export const d = (offsetDays: number, hour = 9, minute = 0) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, minute, 0, 0);
  return dt.toISOString();
};

// ─────────────────────────────────────────
// EXPERTS — 5 orang, role campuran
// ─────────────────────────────────────────
export const EXPERTS = [
  {
    id: "exp-001",
    nama: "Budi Santoso",
    email: "budi.santoso@sekolahmu.co.id",
    password: "dummy123",
    role: "mengajar+menilai",
    avatarUrl: null,
    inisial: "BS",
  },
  {
    id: "exp-002",
    nama: "Sari Dewi",
    email: "sari.dewi@sekolahmu.co.id",
    password: "dummy123",
    role: "mengajar",
    avatarUrl: null,
    inisial: "SD",
  },
  {
    id: "exp-003",
    nama: "Andi Pratama",
    email: "andi.pratama@sekolahmu.co.id",
    password: "dummy123",
    role: "menilai",
    avatarUrl: null,
    inisial: "AP",
  },
  {
    id: "exp-004",
    nama: "Ratna Wulandari",
    email: "ratna.wulandari@sekolahmu.co.id",
    password: "dummy123",
    role: "mengajar+menilai",
    avatarUrl: null,
    inisial: "RW",
  },
  {
    id: "exp-005",
    nama: "Dimas Kurniawan",
    email: "dimas.kurniawan@sekolahmu.co.id",
    password: "dummy123",
    role: "mengajar",
    avatarUrl: null,
    inisial: "DK",
  },
];

// ─────────────────────────────────────────
// PARTICIPANTS — 30 peserta realistis
// ─────────────────────────────────────────
export const PARTICIPANTS = [
  { id: "usr-001", nama: "Alya Putri Rahma",    kelas: "Kelas 10A", avatarUrl: null, inisial: "AP" },
  { id: "usr-002", nama: "Bagas Saputra",        kelas: "Kelas 10A", avatarUrl: null, inisial: "BS" },
  { id: "usr-003", nama: "Citra Nuraini",        kelas: "Kelas 10A", avatarUrl: null, inisial: "CN" },
  { id: "usr-004", nama: "Dafa Rizky",           kelas: "Kelas 10A", avatarUrl: null, inisial: "DR" },
  { id: "usr-005", nama: "Elisa Handayani",      kelas: "Kelas 10B", avatarUrl: null, inisial: "EH" },
  { id: "usr-006", nama: "Farhan Maulana",       kelas: "Kelas 10B", avatarUrl: null, inisial: "FM" },
  { id: "usr-007", nama: "Ghina Aulia",          kelas: "Kelas 10B", avatarUrl: null, inisial: "GA" },
  { id: "usr-008", nama: "Hendra Wijaya",        kelas: "Kelas 10B", avatarUrl: null, inisial: "HW" },
  { id: "usr-009", nama: "Indah Permata",        kelas: "Kelas 11A", avatarUrl: null, inisial: "IP" },
  { id: "usr-010", nama: "Jaka Santoso",         kelas: "Kelas 11A", avatarUrl: null, inisial: "JS" },
  { id: "usr-011", nama: "Kirana Salsabila",     kelas: "Kelas 11A", avatarUrl: null, inisial: "KS" },
  { id: "usr-012", nama: "Lukman Hakim",         kelas: "Kelas 11A", avatarUrl: null, inisial: "LH" },
  { id: "usr-013", nama: "Mira Agustina",        kelas: "Kelas 11B", avatarUrl: null, inisial: "MA" },
  { id: "usr-014", nama: "Naufal Adi",           kelas: "Kelas 11B", avatarUrl: null, inisial: "NA" },
  { id: "usr-015", nama: "Olivia Tantri",        kelas: "Kelas 11B", avatarUrl: null, inisial: "OT" },
  { id: "usr-016", nama: "Panji Wicaksono",      kelas: "Kelas 11B", avatarUrl: null, inisial: "PW" },
  { id: "usr-017", nama: "Qonita Zahira",        kelas: "Kelas 12A", avatarUrl: null, inisial: "QZ" },
  { id: "usr-018", nama: "Rafi Ardiansyah",      kelas: "Kelas 12A", avatarUrl: null, inisial: "RA" },
  { id: "usr-019", nama: "Salma Fitria",         kelas: "Kelas 12A", avatarUrl: null, inisial: "SF" },
  { id: "usr-020", nama: "Tirta Nugroho",        kelas: "Kelas 12A", avatarUrl: null, inisial: "TN" },
  { id: "usr-021", nama: "Ulfah Rahmawati",      kelas: "Kelas 12B", avatarUrl: null, inisial: "UR" },
  { id: "usr-022", nama: "Vino Aditya",          kelas: "Kelas 12B", avatarUrl: null, inisial: "VA" },
  { id: "usr-023", nama: "Wulan Sulistya",       kelas: "Kelas 12B", avatarUrl: null, inisial: "WS" },
  { id: "usr-024", nama: "Xander Kurnia",        kelas: "Kelas 12B", avatarUrl: null, inisial: "XK" },
  { id: "usr-025", nama: "Yeni Marlina",         kelas: "Grup Mentor A", avatarUrl: null, inisial: "YM" },
  { id: "usr-026", nama: "Zaki Firmansyah",      kelas: "Grup Mentor A", avatarUrl: null, inisial: "ZF" },
  { id: "usr-027", nama: "Aulia Safitri",        kelas: "Grup Mentor A", avatarUrl: null, inisial: "AS" },
  { id: "usr-028", nama: "Bramantyo Hadi",       kelas: "Grup Mentor B", avatarUrl: null, inisial: "BH" },
  { id: "usr-029", nama: "Candra Puspita",       kelas: "Grup Mentor B", avatarUrl: null, inisial: "CP" },
  { id: "usr-030", nama: "Dian Permatasari",     kelas: "Grup Mentor B", avatarUrl: null, inisial: "DP" },
];

// ─────────────────────────────────────────
// PROGRAMS — 15 program (campuran status)
// ─────────────────────────────────────────
export const PROGRAMS = [
  // ── AKTIF ──
  {
    id: "prog-001",
    nama: "Literasi Digital Angkatan 3",
    deskripsi: "Program pengembangan kemampuan literasi digital untuk siswa SMA. Mencakup keamanan digital, media sosial yang sehat, dan dasar-dasar pemrograman.",
    tanggalMulai: d(-20),
    tanggalSelesai: d(30),
    status: "aktif",
    jumlahPeserta: 12,
  },
  {
    id: "prog-002",
    nama: "Kepemimpinan Remaja",
    deskripsi: "Program pembentukan karakter dan kepemimpinan berbasis proyek. Peserta membangun inisiatif sosial di komunitas masing-masing.",
    tanggalMulai: d(-10),
    tanggalSelesai: d(50),
    status: "aktif",
    jumlahPeserta: 8,
  },
  {
    id: "prog-003",
    nama: "Public Speaking Intensif",
    deskripsi: "Pelatihan berbicara di depan umum dengan metode praktik langsung. Setiap sesi peserta tampil dan menerima umpan balik dari Expert.",
    tanggalMulai: d(-5),
    tanggalSelesai: d(25),
    status: "aktif",
    jumlahPeserta: 10,
  },
  {
    id: "prog-004",
    nama: "Matematika Lanjut — Kalkulus",
    deskripsi: "Pendalaman materi kalkulus untuk persiapan ujian masuk perguruan tinggi. Fokus pada limit, turunan, dan integral.",
    tanggalMulai: d(-15),
    tanggalSelesai: d(45),
    status: "aktif",
    jumlahPeserta: 15,
  },
  {
    id: "prog-005",
    nama: "Menulis Kreatif — Fiksi",
    deskripsi: "Workshop menulis fiksi pendek selama 6 minggu. Setiap peserta menghasilkan satu cerita pendek yang siap dipublikasikan.",
    tanggalMulai: d(-8),
    tanggalSelesai: d(34),
    status: "aktif",
    jumlahPeserta: 9,
  },
  {
    id: "prog-006",
    nama: "Desain Grafis Dasar",
    deskripsi: "Pengenalan prinsip desain dan penggunaan tools digital. Cocok untuk pemula yang ingin belajar visual communication.",
    tanggalMulai: d(-3),
    tanggalSelesai: d(39),
    status: "aktif",
    jumlahPeserta: 11,
  },
  {
    id: "prog-007",
    nama: "Bahasa Inggris — IELTS Prep",
    deskripsi: "Persiapan ujian IELTS dengan simulasi tes dan latihan per section. Target band score 7.0.",
    tanggalMulai: d(-25),
    tanggalSelesai: d(14),
    status: "aktif",
    jumlahPeserta: 8,
  },
  {
    id: "prog-008",
    nama: "Kewirausahaan Sosial",
    deskripsi: "Program untuk remaja yang ingin membangun usaha dengan dampak sosial. Dari ide hingga pitch deck.",
    tanggalMulai: d(-12),
    tanggalSelesai: d(48),
    status: "aktif",
    jumlahPeserta: 10,
  },
  {
    id: "prog-009",
    nama: "Coding for Beginners — Python",
    deskripsi: "Belajar pemrograman Python dari nol. Mulai dari variabel, loop, hingga membuat program sederhana yang berguna.",
    tanggalMulai: d(-1),
    tanggalSelesai: d(41),
    status: "aktif",
    jumlahPeserta: 14,
  },
  {
    id: "prog-010",
    nama: "Mindfulness & Kesehatan Mental",
    deskripsi: "Sesi diskusi dan latihan mindfulness untuk remaja. Topik mencakup manajemen stres, regulasi emosi, dan self-care.",
    tanggalMulai: d(-7),
    tanggalSelesai: d(21),
    status: "aktif",
    jumlahPeserta: 7,
  },
  // ── AKAN DATANG ──
  {
    id: "prog-011",
    nama: "Persiapan SNBT 2026",
    deskripsi: "Intensif persiapan Seleksi Nasional Berdasarkan Tes untuk siswa kelas 12. Materi TPS, Literasi, dan penalaran.",
    tanggalMulai: d(7),
    tanggalSelesai: d(90),
    status: "aktif",
    jumlahPeserta: 20,
  },
  {
    id: "prog-012",
    nama: "Fotografi & Storytelling Visual",
    deskripsi: "Belajar bercerita lewat gambar. Teknik komposisi, cahaya, dan narasi visual untuk media sosial dan jurnalisme.",
    tanggalMulai: d(14),
    tanggalSelesai: d(56),
    status: "aktif",
    jumlahPeserta: 8,
  },
  // ── SELESAI ──
  {
    id: "prog-013",
    nama: "Riset Ilmiah Dasar",
    deskripsi: "Pelatihan metode penelitian ilmiah untuk siswa SMA. Mulai dari merumuskan masalah, pengumpulan data, hingga presentasi hasil.",
    tanggalMulai: d(-90),
    tanggalSelesai: d(-10),
    status: "selesai",
    jumlahPeserta: 12,
  },
  {
    id: "prog-014",
    nama: "Persiapan Olimpiade Biologi",
    deskripsi: "Program persiapan OSN Biologi tingkat kabupaten. Materi seluler, genetika, dan ekologi mendalam.",
    tanggalMulai: d(-60),
    tanggalSelesai: d(-5),
    status: "selesai",
    jumlahPeserta: 6,
  },
  {
    id: "prog-015",
    nama: "Drama & Teater Remaja",
    deskripsi: "Workshop teater dengan pementasan akhir. Peserta belajar akting, bloking, dan produksi pertunjukan mini.",
    tanggalMulai: d(-45),
    tanggalSelesai: d(-2),
    status: "selesai",
    jumlahPeserta: 15,
  },
];

// ─────────────────────────────────────────────────────────────────────
// ACTIVITIES — ~4 per program, mix tipe, status, dan waktu
// (termasuk aktivitas HARI INI untuk testing halaman Presensi)
// ─────────────────────────────────────────────────────────────────────
export const ACTIVITIES = [

  // ── PROG-001: Literasi Digital ──────────────────────────────────
  { id: "akt-001", programId: "prog-001", nama: "Kick-off & Orientasi Program",        tipe: "mengajar", waktuMulai: d(-18, 9),  waktuSelesai: d(-18, 11), lokasi: "Zoom Meeting",        status: "sudah-diisi",    deskripsi: "Perkenalan program, peraturan, dan ekspektasi bersama." },
  { id: "akt-002", programId: "prog-001", nama: "Keamanan Digital & Privasi Online",   tipe: "mengajar", waktuMulai: d(-11, 13), waktuSelesai: d(-11, 15), lokasi: "Zoom Meeting",        status: "sudah-diisi",    deskripsi: "Memahami ancaman digital, phishing, dan cara melindungi data pribadi." },
  { id: "akt-003", programId: "prog-001", nama: "Tugas: Analisis Hoaks di Media Sosial", tipe: "menilai",  waktuMulai: d(-4, 9),  waktuSelesai: d(-4, 23),  lokasi: null,                 status: "sudah-diisi",    deskripsi: "Peserta menganalisis 3 konten hoaks dan memberikan argumen klarifikasi.", deadline: d(-4, 23) },
  { id: "akt-004", programId: "prog-001", nama: "Dasar Pemrograman — Sesi 1",          tipe: "mengajar", waktuMulai: d(0, 9),   waktuSelesai: d(0, 11),  lokasi: "Google Meet",        status: "belum-mulai",    deskripsi: "Pengenalan logika pemrograman dan HTML dasar." },

  // ── PROG-002: Kepemimpinan Remaja ────────────────────────────────
  { id: "akt-005", programId: "prog-002", nama: "Diskusi: Apa itu Pemimpin?",          tipe: "mengajar", waktuMulai: d(-8, 14), waktuSelesai: d(-8, 16), lokasi: "Ruang Kelas B2",      status: "sudah-diisi",    deskripsi: "Eksplorasi definisi kepemimpinan dari berbagai perspektif budaya dan sejarah." },
  { id: "akt-006", programId: "prog-002", nama: "Workshop Empati & Komunikasi",        tipe: "mengajar", waktuMulai: d(-1, 14), waktuSelesai: d(-1, 16), lokasi: "Ruang Kelas B2",      status: "sudah-diisi",    deskripsi: "Latihan mendengarkan aktif dan komunikasi non-kekerasan." },
  { id: "akt-007", programId: "prog-002", nama: "Presentasi Proposal Proyek Sosial",   tipe: "menilai",  waktuMulai: d(0, 10),  waktuSelesai: d(0, 12),  lokasi: "Ruang Kelas B2",      status: "sedang-berlangsung", deskripsi: "Setiap peserta mempresentasikan proposal inisiatif sosial selama 7 menit.", deadline: d(0, 12) },
  { id: "akt-008", programId: "prog-002", nama: "Mentoring 1-on-1 Progress Proyek",    tipe: "mengajar", waktuMulai: d(7, 14),  waktuSelesai: d(7, 17),  lokasi: "Zoom Meeting",        status: "belum-mulai",    deskripsi: "Sesi mentoring individual untuk review perkembangan proyek masing-masing." },

  // ── PROG-003: Public Speaking ────────────────────────────────────
  { id: "akt-009", programId: "prog-003", nama: "Ice-breaking & Perkenalan",           tipe: "mengajar", waktuMulai: d(-4, 16), waktuSelesai: d(-4, 18), lokasi: "Aula Sekolah",        status: "sudah-diisi",    deskripsi: "Membangun kepercayaan diri awal dengan ice-breaking games." },
  { id: "akt-010", programId: "prog-003", nama: "Teknik Pernapasan & Artikulasi",      tipe: "mengajar", waktuMulai: d(0, 16),  waktuSelesai: d(0, 18),  lokasi: "Aula Sekolah",        status: "belum-mulai",    deskripsi: "Latihan vokal, intonasi, dan cara mengelola napas saat berbicara." },
  { id: "akt-011", programId: "prog-003", nama: "Latihan Pidato 3 Menit",              tipe: "menilai",  waktuMulai: d(3, 16),  waktuSelesai: d(3, 19),  lokasi: "Aula Sekolah",        status: "belum-mulai",    deskripsi: "Setiap peserta tampil, direkam, dan menerima feedback Expert + sesama.", deadline: d(3, 19) },
  { id: "akt-012", programId: "prog-003", nama: "Materi: Storytelling yang Memukau",   tipe: "materi",   waktuMulai: d(1, 0),   waktuSelesai: d(5, 23),  lokasi: null,                 status: "belum-mulai",    deskripsi: "Modul bacaan tentang struktur narasi, penggunaan analogi, dan memori audiens." },

  // ── PROG-004: Matematika Kalkulus ────────────────────────────────
  { id: "akt-013", programId: "prog-004", nama: "Review Fungsi & Limit",               tipe: "mengajar", waktuMulai: d(-12, 8), waktuSelesai: d(-12, 10), lokasi: "Zoom Meeting",       status: "sudah-diisi",    deskripsi: "Mengulang konsep fungsi dan pengantar limit secara intuitif." },
  { id: "akt-014", programId: "prog-004", nama: "Kuis: Limit dan Kekontinuan",         tipe: "menilai",  waktuMulai: d(-5, 8),  waktuSelesai: d(-5, 9),   lokasi: null,                 status: "sudah-diisi",    deskripsi: "Kuis 10 soal limit, 60 menit.", deadline: d(-5, 9) },
  { id: "akt-015", programId: "prog-004", nama: "Turunan — Aturan Rantai",             tipe: "mengajar", waktuMulai: d(0, 8),   waktuSelesai: d(0, 10),  lokasi: "Zoom Meeting",        status: "belum-mulai",    deskripsi: "Pendalaman aturan rantai dengan latihan soal berjenjang." },
  { id: "akt-016", programId: "prog-004", nama: "Materi: Rangkuman Turunan",           tipe: "materi",   waktuMulai: d(-5, 0),  waktuSelesai: d(5, 23),  lokasi: null,                 status: "belum-mulai",    deskripsi: "PDF rangkuman rumus turunan dan contoh soal SNBT." },

  // ── PROG-005: Menulis Kreatif ─────────────────────────────────────
  { id: "akt-017", programId: "prog-005", nama: "Menulis Tanpa Sensor — Freewriting",  tipe: "mengajar", waktuMulai: d(-6, 15), waktuSelesai: d(-6, 17), lokasi: "Google Meet",         status: "sudah-diisi",    deskripsi: "Latihan menulis bebas selama 10 menit berturut-turut tanpa berhenti." },
  { id: "akt-018", programId: "prog-005", nama: "Workshop Karakter & Konflik",         tipe: "mengajar", waktuMulai: d(1, 15),  waktuSelesai: d(1, 17),  lokasi: "Google Meet",         status: "belum-mulai",    deskripsi: "Membangun tokoh yang believable dan konflik yang menarik pembaca." },
  { id: "akt-019", programId: "prog-005", nama: "Review Draft Cerita — Sesi 1",        tipe: "menilai",  waktuMulai: d(0, 19),  waktuSelesai: d(0, 21),  lokasi: "Google Meet",         status: "belum-mulai",    deskripsi: "Expert memberikan feedback tertulis pada draft 500 kata pertama tiap peserta.", deadline: d(2, 23) },
  { id: "akt-020", programId: "prog-005", nama: "Materi: Panduan Gaya Penulisan",      tipe: "materi",   waktuMulai: d(-6, 0),  waktuSelesai: d(20, 23), lokasi: null,                 status: "belum-mulai",    deskripsi: "Panduan EYD, gaya narasi orang pertama vs ketiga, dan tips dialog." },

  // ── PROG-006: Desain Grafis ───────────────────────────────────────
  { id: "akt-021", programId: "prog-006", nama: "Pengenalan Prinsip Desain",           tipe: "mengajar", waktuMulai: d(-2, 13), waktuSelesai: d(-2, 15), lokasi: "Lab Komputer",        status: "sudah-diisi",    deskripsi: "Kontras, repetisi, alignment, dan proximity — CRAP principles." },
  { id: "akt-022", programId: "prog-006", nama: "Praktik Canva — Poster Kampanye",     tipe: "mengajar", waktuMulai: d(0, 13),  waktuSelesai: d(0, 15),  lokasi: "Lab Komputer",        status: "belum-mulai",    deskripsi: "Peserta membuat poster kampanye sosial menggunakan Canva." },
  { id: "akt-023", programId: "prog-006", nama: "Submit: Poster Final",                tipe: "menilai",  waktuMulai: d(5, 0),   waktuSelesai: d(5, 23),  lokasi: null,                 status: "belum-mulai",    deskripsi: "Upload poster final, dinilai berdasarkan rubrik estetika dan pesan.", deadline: d(5, 23) },

  // ── PROG-007: IELTS Prep ──────────────────────────────────────────
  { id: "akt-024", programId: "prog-007", nama: "Mock Test — Reading Section",         tipe: "menilai",  waktuMulai: d(-20, 9), waktuSelesai: d(-20, 10), lokasi: null,                 status: "sudah-diisi",    deskripsi: "Simulasi IELTS Reading 60 menit, 40 soal.", deadline: d(-20, 10) },
  { id: "akt-025", programId: "prog-007", nama: "Pembahasan Reading + Listening Tips", tipe: "mengajar", waktuMulai: d(-13, 9), waktuSelesai: d(-13, 11), lokasi: "Zoom Meeting",       status: "sudah-diisi",    deskripsi: "Review kesalahan umum mock test dan strategi menjawab soal IELTS." },
  { id: "akt-026", programId: "prog-007", nama: "Mock Test — Writing Task 1 & 2",     tipe: "menilai",  waktuMulai: d(0, 9),   waktuSelesai: d(0, 11),  lokasi: null,                 status: "belum-mulai",    deskripsi: "Simulasi timed writing, dinilai dengan band descriptor resmi IELTS.", deadline: d(0, 11) },
  { id: "akt-027", programId: "prog-007", nama: "Materi: IELTS Band Descriptors",     tipe: "materi",   waktuMulai: d(-25, 0), waktuSelesai: d(14, 23), lokasi: null,                 status: "belum-mulai",    deskripsi: "Dokumen resmi band descriptors untuk Writing dan Speaking." },

  // ── PROG-008: Kewirausahaan Sosial ───────────────────────────────
  { id: "akt-028", programId: "prog-008", nama: "Brainstorming Ide Bisnis Sosial",     tipe: "mengajar", waktuMulai: d(-10, 10), waktuSelesai: d(-10, 12), lokasi: "Ruang Diskusi",     status: "sudah-diisi",    deskripsi: "Design thinking session untuk mengidentifikasi masalah sosial di komunitas." },
  { id: "akt-029", programId: "prog-008", nama: "Konsultasi Ide — Sesi 1",             tipe: "mengajar", waktuMulai: d(-3, 10),  waktuSelesai: d(-3, 13),  lokasi: "Zoom Meeting",      status: "sudah-diisi",    deskripsi: "Expert berdiskusi 1-on-1 dengan tiap kelompok tentang kelayakan ide." },
  { id: "akt-030", programId: "prog-008", nama: "Submit: Business Model Canvas",       tipe: "menilai",  waktuMulai: d(0, 0),    waktuSelesai: d(0, 23),   lokasi: null,                status: "belum-mulai",    deskripsi: "Upload BMC yang sudah diisi, Expert memberikan nilai dan catatan.", deadline: d(0, 23) },
  { id: "akt-031", programId: "prog-008", nama: "Materi: Panduan BMC",                 tipe: "materi",   waktuMulai: d(-10, 0),  waktuSelesai: d(48, 23),  lokasi: null,                status: "belum-mulai",    deskripsi: "Template Business Model Canvas + contoh dari startup sosial Indonesia." },

  // ── PROG-009: Python ──────────────────────────────────────────────
  { id: "akt-032", programId: "prog-009", nama: "Hello World & Variabel",              tipe: "mengajar", waktuMulai: d(0, 15),  waktuSelesai: d(0, 17),  lokasi: "Zoom Meeting",        status: "belum-mulai",    deskripsi: "Sesi pertama: menulis program Python pertama dan memahami variabel." },
  { id: "akt-033", programId: "prog-009", nama: "Tugas: Kalkulator Sederhana",         tipe: "menilai",  waktuMulai: d(3, 0),   waktuSelesai: d(3, 23),  lokasi: null,                 status: "belum-mulai",    deskripsi: "Buat program kalkulator input-output di Python.", deadline: d(3, 23) },
  { id: "akt-034", programId: "prog-009", nama: "Materi: Panduan Instalasi Python",    tipe: "materi",   waktuMulai: d(-1, 0),  waktuSelesai: d(41, 23), lokasi: null,                 status: "belum-mulai",    deskripsi: "Step-by-step instalasi Python 3.12 dan VS Code untuk pemula." },

  // ── PROG-010: Mindfulness ─────────────────────────────────────────
  { id: "akt-035", programId: "prog-010", nama: "Mengenal Stres & Respon Tubuh",       tipe: "mengajar", waktuMulai: d(-5, 16), waktuSelesai: d(-5, 18), lokasi: "Zoom Meeting",        status: "sudah-diisi",    deskripsi: "Psikoeduasi tentang stres, kortisol, dan fight-or-flight response." },
  { id: "akt-036", programId: "prog-010", nama: "Latihan Pernapasan Kotak",            tipe: "mengajar", waktuMulai: d(0, 16),  waktuSelesai: d(0, 17),  lokasi: "Zoom Meeting",        status: "belum-mulai",    deskripsi: "Praktik box breathing dan body scan untuk regulasi emosi." },
  { id: "akt-037", programId: "prog-010", nama: "Jurnal Refleksi Minggu 1",            tipe: "menilai",  waktuMulai: d(-1, 0),  waktuSelesai: d(-1, 23), lokasi: null,                 status: "sudah-diisi",    deskripsi: "Peserta menulis refleksi pengalaman mindfulness selama seminggu.", deadline: d(-1, 23) },

  // ── PROG-011: SNBT (belum mulai) ──────────────────────────────────
  { id: "akt-038", programId: "prog-011", nama: "Kick-off & Tes Diagnostik",           tipe: "mengajar", waktuMulai: d(7, 8),   waktuSelesai: d(7, 10),  lokasi: "Zoom Meeting",        status: "belum-mulai",    deskripsi: "Perkenalan program dan tes awal untuk pemetaan kemampuan peserta." },
  { id: "akt-039", programId: "prog-011", nama: "TPS — Penalaran Umum Sesi 1",         tipe: "mengajar", waktuMulai: d(9, 8),   waktuSelesai: d(9, 10),  lokasi: "Zoom Meeting",        status: "belum-mulai",    deskripsi: "Strategi mengerjakan soal penalaran umum TPS dengan teknik eliminasi." },

  // ── PROG-012: Fotografi (belum mulai) ────────────────────────────
  { id: "akt-040", programId: "prog-012", nama: "Mengenal Komposisi Foto",             tipe: "mengajar", waktuMulai: d(14, 10), waktuSelesai: d(14, 12), lokasi: "Zoom Meeting",        status: "belum-mulai",    deskripsi: "Rule of thirds, leading lines, dan framing — teori dan contoh foto." },
  { id: "akt-041", programId: "prog-012", nama: "Hunting Foto — Tema Keseharian",      tipe: "menilai",  waktuMulai: d(16, 0),  waktuSelesai: d(16, 23), lokasi: null,                 status: "belum-mulai",    deskripsi: "Submit 5 foto bertema 'keseharian' untuk direview Expert.", deadline: d(16, 23) },

  // ── PROG-013: Riset Ilmiah (SELESAI) ─────────────────────────────
  { id: "akt-042", programId: "prog-013", nama: "Pengenalan Metode Ilmiah",            tipe: "mengajar", waktuMulai: d(-85, 9), waktuSelesai: d(-85, 11), lokasi: "Ruang Kelas",        status: "sudah-diisi",    deskripsi: "Siklus penelitian ilmiah dan cara merumuskan pertanyaan riset." },
  { id: "akt-043", programId: "prog-013", nama: "Presentasi Hasil Riset Final",        tipe: "menilai",  waktuMulai: d(-12, 9), waktuSelesai: d(-12, 12), lokasi: "Aula Sekolah",       status: "sudah-diisi",    deskripsi: "Presentasi 10 menit per kelompok, penilaian final.", deadline: d(-12, 12) },

  // ── PROG-014: Olimpiade Biologi (SELESAI) ─────────────────────────
  { id: "akt-044", programId: "prog-014", nama: "Simulasi OSN Biologi",               tipe: "menilai",  waktuMulai: d(-7, 8),  waktuSelesai: d(-7, 11),  lokasi: null,                 status: "sudah-diisi",    deskripsi: "Simulasi penuh OSN Biologi kabupaten — 50 soal, 180 menit.", deadline: d(-7, 11) },
  { id: "akt-045", programId: "prog-014", nama: "Review Simulasi & Pembahasan",        tipe: "mengajar", waktuMulai: d(-6, 9),  waktuSelesai: d(-6, 11),  lokasi: "Zoom Meeting",       status: "sudah-diisi",    deskripsi: "Pembahasan soal, pola kesalahan, dan strategi hari-H." },

  // ── PROG-015: Drama & Teater (SELESAI) ───────────────────────────
  { id: "akt-046", programId: "prog-015", nama: "Latihan Akting Dasar",               tipe: "mengajar", waktuMulai: d(-40, 15), waktuSelesai: d(-40, 18), lokasi: "Aula Sekolah",      status: "sudah-diisi",    deskripsi: "Teknik dasar akting: emosi, gestur, dan ekspresi wajah." },
  { id: "akt-047", programId: "prog-015", nama: "Pementasan Akhir",                   tipe: "mengajar", waktuMulai: d(-3, 17),  waktuSelesai: d(-3, 20),  lokasi: "Aula Sekolah",      status: "sudah-diisi",    deskripsi: "Pementasan final di hadapan orang tua dan tamu undangan." },
  { id: "akt-048", programId: "prog-015", nama: "Penilaian Peran & Penghayatan",      tipe: "menilai",  waktuMulai: d(-3, 0),   waktuSelesai: d(-3, 23),  lokasi: null,                status: "sudah-diisi",    deskripsi: "Expert menilai setiap peserta berdasarkan rubrik akting.", deadline: d(-3, 23) },

  // ── AKTIVITAS HARI INI — untuk testing semua status di tab Presensi ──
  {
    id: "akt-049",
    programId: "prog-001",
    nama: "Dasar Pemrograman — Sesi 1 (PAGI)",
    tipe: "mengajar",
    waktuMulai: d(0, 9),
    waktuSelesai: d(0, 11),
    lokasi: "Google Meet",
    status: "sudah-diisi",
    deskripsi: "Sudah selesai pagi ini. Untuk testing status 'sudah-diisi'.",
  },
  {
    id: "akt-050",
    programId: "prog-002",
    nama: "Presentasi Proposal (SIANG — SEDANG BERLANGSUNG)",
    tipe: "menilai",
    waktuMulai: d(0, 10),
    waktuSelesai: d(0, 12),
    lokasi: "Ruang Kelas B2",
    status: "sedang-berlangsung",
    deskripsi: "Sedang berlangsung. Untuk testing status 'sedang-berlangsung'.",
    deadline: d(0, 12),
  },
  {
    id: "akt-051",
    programId: "prog-003",
    nama: "Teknik Pernapasan (SORE — BELUM MULAI)",
    tipe: "mengajar",
    waktuMulai: d(0, 16),
    waktuSelesai: d(0, 18),
    lokasi: "Aula Sekolah",
    status: "belum-mulai",
    deskripsi: "Belum dimulai. Untuk testing status 'belum-mulai'.",
  },
  {
    id: "akt-052",
    programId: "prog-004",
    nama: "Turunan Rantai (SUDAH LEWAT, BELUM DIISI)",
    tipe: "mengajar",
    waktuMulai: d(0, 7),
    waktuSelesai: d(0, 8, 30),
    lokasi: "Zoom Meeting",
    status: "selesai",
    deskripsi: "Sudah selesai tapi kehadiran belum diisi. Untuk testing edge case.",
  },
];

// ─────────────────────────────────────────────────────────────────
// ASSIGNMENTS — expert mana pegang program mana
// ─────────────────────────────────────────────────────────────────
export const ASSIGNMENTS = [
  // Budi Santoso (exp-001) — expert utama untuk demo
  { expertId: "exp-001", programId: "prog-001" },
  { expertId: "exp-001", programId: "prog-002" },
  { expertId: "exp-001", programId: "prog-003" },
  { expertId: "exp-001", programId: "prog-004" },
  { expertId: "exp-001", programId: "prog-013" }, // program selesai

  // Sari Dewi (exp-002)
  { expertId: "exp-002", programId: "prog-005" },
  { expertId: "exp-002", programId: "prog-006" },
  { expertId: "exp-002", programId: "prog-015" }, // program selesai

  // Andi Pratama (exp-003) — role: menilai
  { expertId: "exp-003", programId: "prog-007" },
  { expertId: "exp-003", programId: "prog-014" }, // program selesai

  // Ratna Wulandari (exp-004)
  { expertId: "exp-004", programId: "prog-008" },
  { expertId: "exp-004", programId: "prog-009" },
  { expertId: "exp-004", programId: "prog-010" },

  // Dimas Kurniawan (exp-005)
  { expertId: "exp-005", programId: "prog-011" }, // akan datang
  { expertId: "exp-005", programId: "prog-012" }, // akan datang
];

// ─────────────────────────────────────────────────────────────────
// ENROLLMENTS — peserta di program mana
// ─────────────────────────────────────────────────────────────────
export const ENROLLMENTS = [
  // prog-001: Literasi Digital — 12 peserta (usr-001 s/d usr-012)
  ...Array.from({ length: 12 }, (_, i) => ({ pesertaId: `usr-00${i + 1}`, programId: "prog-001" })),

  // prog-002: Kepemimpinan — 8 peserta
  ...["usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012"].map(id => ({ pesertaId: id, programId: "prog-002" })),

  // prog-003: Public Speaking — 10 peserta
  ...["usr-001","usr-003","usr-005","usr-007","usr-009","usr-011","usr-013","usr-015","usr-017","usr-019"].map(id => ({ pesertaId: id, programId: "prog-003" })),

  // prog-004: Kalkulus — 15 peserta
  ...Array.from({ length: 15 }, (_, i) => ({ pesertaId: `usr-0${String(i + 1).padStart(2, "0")}`, programId: "prog-004" })),

  // prog-005: Menulis Kreatif — 9 peserta
  ...["usr-013","usr-014","usr-015","usr-016","usr-017","usr-018","usr-019","usr-020","usr-021"].map(id => ({ pesertaId: id, programId: "prog-005" })),

  // prog-006: Desain Grafis — 11 peserta
  ...["usr-001","usr-002","usr-005","usr-006","usr-009","usr-010","usr-013","usr-014","usr-017","usr-018","usr-021"].map(id => ({ pesertaId: id, programId: "prog-006" })),

  // prog-007: IELTS — 8 peserta
  ...["usr-017","usr-018","usr-019","usr-020","usr-021","usr-022","usr-023","usr-024"].map(id => ({ pesertaId: id, programId: "prog-007" })),

  // prog-008: Kewirausahaan — 10 peserta
  ...["usr-021","usr-022","usr-023","usr-024","usr-025","usr-026","usr-027","usr-028","usr-029","usr-030"].map(id => ({ pesertaId: id, programId: "prog-008" })),

  // prog-009: Python — 14 peserta
  ...Array.from({ length: 14 }, (_, i) => ({ pesertaId: `usr-0${String(i + 1).padStart(2, "0")}`, programId: "prog-009" })),

  // prog-010: Mindfulness — 7 peserta
  ...["usr-025","usr-026","usr-027","usr-028","usr-029","usr-030","usr-001"].map(id => ({ pesertaId: id, programId: "prog-010" })),

  // prog-011 & 012: akan datang, peserta sudah terdaftar
  ...["usr-017","usr-018","usr-019","usr-020","usr-021","usr-022","usr-023","usr-024","usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012"].map(id => ({ pesertaId: id, programId: "prog-011" })),
  ...["usr-009","usr-010","usr-011","usr-012","usr-013","usr-014","usr-015","usr-016"].map(id => ({ pesertaId: id, programId: "prog-012" })),

  // prog-013, 014, 015: selesai
  ...Array.from({ length: 12 }, (_, i) => ({ pesertaId: `usr-0${String(i + 1).padStart(2, "0")}`, programId: "prog-013" })),
  ...["usr-009","usr-010","usr-011","usr-012","usr-013","usr-014"].map(id => ({ pesertaId: id, programId: "prog-014" })),
  ...Array.from({ length: 15 }, (_, i) => ({ pesertaId: `usr-0${String(i + 1).padStart(2, "0")}`, programId: "prog-015" })),
];

// ─────────────────────────────────────────────────────────────────
// KEHADIRAN — data presensi yang sudah diisi (aktivitas sudah-diisi)
// ─────────────────────────────────────────────────────────────────
// Helper: generate realistic attendance (mostly hadir, some variations)
const kehadiran = (aktivitasId: string, pesertaIds: string[]) =>
  pesertaIds.map((pesertaId, i) => ({
    aktivitasId,
    pesertaId,
    status: i % 7 === 0 ? "izin" : i % 11 === 0 ? "sakit" : i % 13 === 0 ? "tanpa-keterangan" : "hadir",
    submittedAt: d(-1, 20),
  }));

export const KEHADIRAN_DATA = [
  ...kehadiran("akt-001", ["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012"]),
  ...kehadiran("akt-002", ["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012"]),
  ...kehadiran("akt-005", ["usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012"]),
  ...kehadiran("akt-009", ["usr-001","usr-003","usr-005","usr-007","usr-009","usr-011","usr-013","usr-015","usr-017","usr-019"]),
  ...kehadiran("akt-013", ["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012","usr-013","usr-014","usr-015"]),
  ...kehadiran("akt-017", ["usr-013","usr-014","usr-015","usr-016","usr-017","usr-018","usr-019","usr-020","usr-021"]),
  ...kehadiran("akt-021", ["usr-001","usr-002","usr-005","usr-006","usr-009","usr-010","usr-013","usr-014","usr-017","usr-018","usr-021"]),
  ...kehadiran("akt-025", ["usr-017","usr-018","usr-019","usr-020","usr-021","usr-022","usr-023","usr-024"]),
  ...kehadiran("akt-028", ["usr-021","usr-022","usr-023","usr-024","usr-025","usr-026","usr-027","usr-028","usr-029","usr-030"]),
  ...kehadiran("akt-029", ["usr-021","usr-022","usr-023","usr-024","usr-025","usr-026","usr-027","usr-028","usr-029","usr-030"]),
  ...kehadiran("akt-035", ["usr-025","usr-026","usr-027","usr-028","usr-029","usr-030","usr-001"]),
  ...kehadiran("akt-049", ["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012"]),
];

// ─────────────────────────────────────────────────────────────────
// PENILAIAN — nilai untuk aktivitas tipe menilai yang sudah-diisi
// ─────────────────────────────────────────────────────────────────
const nilai = (aktivitasId: string, pesertaIds: string[]) =>
  pesertaIds.map((pesertaId) => ({
    aktivitasId,
    pesertaId,
    nilai: Math.floor(60 + Math.random() * 40), // 60–99
    catatan: null,
    submittedAt: d(-1, 21),
  }));

export const PENILAIAN_DATA = [
  ...nilai("akt-003", ["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012"]),
  ...nilai("akt-014", ["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012","usr-013","usr-014","usr-015"]),
  ...nilai("akt-024", ["usr-017","usr-018","usr-019","usr-020","usr-021","usr-022","usr-023","usr-024"]),
  ...nilai("akt-037", ["usr-025","usr-026","usr-027","usr-028","usr-029","usr-030","usr-001"]),
  ...nilai("akt-043", ["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012"]),
  ...nilai("akt-044", ["usr-009","usr-010","usr-011","usr-012","usr-013","usr-014"]),
  ...nilai("akt-048", ["usr-001","usr-002","usr-003","usr-004","usr-005","usr-006","usr-007","usr-008","usr-009","usr-010","usr-011","usr-012","usr-013","usr-014","usr-015"]),
];

// ─────────────────────────────────────────────────────────────────
// NOTIFIKASI — 5 notifikasi untuk Budi Santoso (exp-001)
// ─────────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: "notif-001", expertId: "exp-001", judul: "Peserta baru bergabung", isi: "Dian Permatasari baru saja bergabung ke program Literasi Digital Angkatan 3.", dibaca: false, createdAt: d(-1, 8),  linkAktivitas: null },
  { id: "notif-002", expertId: "exp-001", judul: "Pengingat: Kehadiran belum diisi", isi: "Aktivitas 'Dasar Pemrograman Sesi 1' sudah selesai tapi kehadiran belum diisi.", dibaca: false, createdAt: d(0, 8, 30), linkAktivitas: "akt-052" },
  { id: "notif-003", expertId: "exp-001", judul: "Tenggat penilaian hari ini", isi: "Tugas 'Business Model Canvas' dari Program Kewirausahaan Sosial jatuh tempo hari ini pukul 23:59.", dibaca: false, createdAt: d(0, 7), linkAktivitas: "akt-030" },
  { id: "notif-004", expertId: "exp-001", judul: "Program selesai: Riset Ilmiah Dasar", isi: "Program Riset Ilmiah Dasar telah selesai. Laporan akhir tersedia di dashboard program.", dibaca: true, createdAt: d(-10, 9), linkAktivitas: null },
  { id: "notif-005", expertId: "exp-001", judul: "Update sistem: Fitur umpan balik baru", isi: "Sekarang Anda bisa memberikan umpan balik langsung ke peserta dari halaman profil peserta.", dibaca: true, createdAt: d(-3, 10), linkAktivitas: null },
];

// ─────────────────────────────────────────────────────────────────
// EXPORT SEMUA — untuk dipakai di MSW handler atau database seeder
// ─────────────────────────────────────────────────────────────────
export const ALL_SEED_DATA = {
  experts: EXPERTS,
  participants: PARTICIPANTS,
  programs: PROGRAMS,
  activities: ACTIVITIES,
  assignments: ASSIGNMENTS,
  enrollments: ENROLLMENTS,
  kehadiran: KEHADIRAN_DATA,
  penilaian: PENILAIAN_DATA,
  notifications: NOTIFICATIONS,
};

export default ALL_SEED_DATA;

/**
 * ─────────────────────────────────────────────────────────────────
 * CARA UPDATE DATA
 * ─────────────────────────────────────────────────────────────────
 *
 * TAMBAH PROGRAM BARU:
 *   1. Push ke PROGRAMS dengan id unik (prog-016, prog-017, ...)
 *   2. Push aktivitas ke ACTIVITIES dengan programId yang sesuai
 *   3. Push ke ASSIGNMENTS: { expertId, programId }
 *   4. Push ke ENROLLMENTS: { pesertaId, programId } per peserta
 *
 * TAMBAH PESERTA BARU:
 *   1. Push ke PARTICIPANTS dengan id unik (usr-031, ...)
 *   2. Push ke ENROLLMENTS untuk setiap program yang diikuti
 *
 * TAMBAH EXPERT BARU:
 *   1. Push ke EXPERTS dengan id unik (exp-006, ...)
 *   2. Push ke ASSIGNMENTS untuk setiap program yang dipegang
 *
 * UBAH STATUS AKTIVITAS:
 *   - Ganti status di ACTIVITIES: 'belum-mulai' | 'sedang-berlangsung' | 'selesai' | 'sudah-diisi'
 *
 * RESET DATA YANG DIUBAH TIM (setelah trial):
 *   - Hapus semua entry di KEHADIRAN_DATA dan PENILAIAN_DATA
 *   - Reset status aktivitas ke 'belum-mulai'
 *   - Jalankan ulang seeder
 *
 * TAMBAH LEBIH BANYAK KOMBINASI:
 *   - Ping Claude, minta "tambah 10 program lagi dengan tema X"
 *   - File ini akan di-extend, bukan diganti
 * ─────────────────────────────────────────────────────────────────
 */
