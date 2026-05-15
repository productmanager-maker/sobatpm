# SPEC.md — Spesifikasi Fungsional

Sumber hierarki: gambar mind map yang dishare user.
Tiap halaman ditandai dengan **fase**-nya — Claude Code build fase 1.1 dulu, lalu 1.2, lalu 2.

---

## Keputusan yang Sudah Dikunci (Jangan Diubah Tanpa Konfirmasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | **AUTH** | Login dummy — siapapun bisa masuk tanpa validasi kredensial. `POST /auth/login` return token hardcoded. Interface `AuthProvider` tersisa untuk swap ke Sekolahmu SSO nanti. |
| 2 | **Status Kehadiran** | `hadir` \| `izin` \| `sakit` \| `tanpa-keterangan` — FINAL, hardcode di enum. |
| 3 | **Format Nilai** | Numerik integer 0–100. Validasi: min 0, max 100, required sebelum submit. Field catatan opsional. |

---

## Hierarki lengkap halaman

```
Halaman
├── Mengajar                            ─┐
│   ├── Detail Aktivitas                 │ Fase 1.1
│   ├── Kehadiran                        │ Fase 1.2
│   ├── Profil Peserta                   │ Fase 1.2
│   ├── Umpan Balik, Catatan (Aktivitas) │ Fase 1.2
│   ├── Hasil Karya                      │ Fase 3 — TIDAK di scope sekarang
│   └── Pengumuman                       │ Fase 1.2
├── Menilai                             ─┤
│   ├── Detail Aktivitas                 │ Fase 1.1
│   ├── Penilaian                        │ Fase 2
│   ├── Profil Peserta                   │ Fase 1.2
│   ├── Umpan Balik, Catatan (Aktivitas) │ Fase 1.2
│   ├── Hasil Karya                      │ Fase 3
│   └── Pengumuman                       │ Fase 1.2
├── Program                             ─┤
│   ├── Detail Program                   │ Fase 1.1
│   ├── Diskusi Konsultasi (→ Mengajar)  │ Fase 1.1
│   │   └── Umpan Balik, Catatan         │ Fase 1.2
│   ├── Tugas Asesmen (→ Menilai)        │ Fase 1.1
│   │   └── Umpan Balik, Catatan         │ Fase 1.2
│   └── Materi                           │
│       ├── Detail Aktivitas             │ Fase 1.1
│       ├── Progres Belajar              │ Fase 3
│       ├── Profil Peserta               │ Fase 1.2
│       ├── Umpan Balik, Catatan         │ Fase 1.2
│       ├── Hasil Karya                  │ Fase 3
│       └── Pengumuman                   │ Fase 1.2
├── Notifikasi                          ─┘ Fase 1.2
├── Detail Notifikasi                       Fase 1.2
├── Hak Akses                               Fase 1.2
├── Glossary                                Fase 1.2
├── Brand Identity (Logo, Warna, Font)      Fase 1.2 — static page
└── Logout                                  Fase 1.1
```

**Catatan penting:** "Mengajar" dan "Menilai" bukan tab tersendiri di bottom nav. Bottom nav hanya 3: **Presensi · Penilaian · Program**.

Mapping aktual:
- **"Mengajar"** = sub-flow yang dimulai dari tab **Presensi** atau dari Program → Diskusi Konsultasi
- **"Menilai"** = sub-flow yang dimulai dari tab **Penilaian** atau dari Program → Tugas Asesmen
- **"Program"** = tab terpisah, daftar program yang dipegang Expert

---

## Bottom Navigation (komponen rangka utama)

3 tab equal-weight:

| Tab | Route | Tujuan |
|---|---|---|
| **Presensi** | `/presensi` | Default landing. List aktivitas hari ini → kehadiran. |
| **Penilaian** | `/penilaian` | List tugas asesmen yang harus dinilai. |
| **Program** | `/program` | Browse program yang dipegang. |

**Behavior:**
- Active state: background `--primary-100`, ikon & label `--primary-600`
- Inactive: ikon outline, label `--text-300`
- Tap tab aktif kembali → scroll to top + pop semua sub-stack
- Persist di semua halaman dalam `(app)/` layout

---

## Halaman per halaman (urut prioritas build)

### 🟦 FASE 1.1 — Struktur platform + detail program & aktivitas

#### 1.1.1 Login
- **AUTH (FINAL):** Login dummy — siapapun bisa masuk tanpa validasi kredensial.
- `POST /api/auth/login` return hardcoded token. Interface `AuthProvider` tersisa untuk integrasi Sekolahmu SSO.
- Sukses → redirect ke `/presensi`.
- Field minimal: identifier (email) + password.

#### 1.1.2 Presensi · List Aktivitas (`/presensi`)
- Landing default.
- Header: tanggal hari ini, sapaan Expert.
- Filter: hari ini (default), semua.
- List card per aktivitas: nama, jam mulai–selesai, program, status, jumlah peserta.
- Tap card → bottom sheet → pilih aksi.
- Empty state: "Belum ada aktivitas untuk hari ini".

#### 1.1.3 Detail Aktivitas
- Mode: `mengajar` | `menilai` | `materi`
- Section umum: header info, deskripsi, tab peserta / kehadiran / umpan balik / pengumuman
- Untuk mode `menilai`: tambah tab Penilaian (Fase 2)

#### 1.1.4 Program · List (`/program`)
- List card: nama program, jumlah aktivitas, periode, progress bar
- Tap → `/program/[id]`

#### 1.1.5 Detail Program (`/program/[id]`)
- Header: nama, deskripsi, periode, jumlah peserta.
- Tab: Diskusi Konsultasi · Tugas Asesmen · Materi

#### 1.1.6 Logout
- Dari dropdown avatar di header.
- Clear token cookie + redirect `/login`.

---

### 🟨 FASE 1.2 — JTBD Aktivitas (Kehadiran) + JTBD Umum

#### 1.2.1 Kehadiran / Form Presensi (`/presensi/[id]/kehadiran`)
- List peserta dengan status pill selectable.
- **Status (FINAL — tidak ada status lain):** Hadir · Izin · Sakit · Tanpa Keterangan
- Bulk action: "Tandai semua hadir".
- Auto-save draft di localStorage setiap perubahan.
- Submit button sticky → konfirmasi modal → POST.
- Setelah submit: read-only, ada tombol "Edit" untuk override.

#### 1.2.2 Profil Peserta
- Header: avatar, nama, kelas/grup.
- Tab: riwayat kehadiran, riwayat penilaian, catatan.

#### 1.2.3 Umpan Balik & Catatan
- Text area per aktivitas atau per peserta.
- Auto-save draft.

#### 1.2.4 Pengumuman
- List card: judul, snippet, tanggal.

#### 1.2.5 Notifikasi (`/notifikasi`)
- Filter: semua / belum dibaca.

---

### 🟧 FASE 2 — JTBD Aktivitas (Penilaian)

#### 2.1 Penilaian · List (`/penilaian`)
- Status: "Belum Dinilai" / "Sebagian Dinilai" / "Selesai Dinilai"
- Progress: `12 / 30 peserta`

#### 2.2 Form Penilaian (`/penilaian/[id]/nilai`)
- **Tipe input: numerik integer 0–100 (FINAL)**
- Field per peserta: nilai (number, min: 0, max: 100, required) + catatan (text, opsional).
- Auto-save draft per peserta (debounce 500ms).
- Submit final di footer sticky → konfirmasi → POST.

---

### 🟫 FASE 3 — Hasil Karya & Progres Belajar

Belum ada Figma final. Referensi: `design-refs/fase-3/Fase 3 Mockup.html`.

#### 3.1 Hasil Karya · List + Detail Review
#### 3.2 Progres Belajar · Per Program + Per Peserta

---

## Komponen UI yang re-used

| Komponen | Dipakai di |
|---|---|
| `<BottomNav>` | `(app)/layout.tsx` |
| `<AppHeader>` | Semua halaman authenticated |
| `<AktivitasCard>` | Presensi list, Penilaian list, Program detail |
| `<PesertaListItem>` | Kehadiran form, Penilaian form, Profil peserta |
| `<StatusPill>` | Aktivitas card, Kehadiran form |
| `<EmptyState>` | Setiap list |
| `<SkeletonLoader>` | Setiap list saat loading |
| `<ConfirmModal>` | Submit kehadiran, logout, dll |
| `<Toast>` | Setiap mutasi |
| `<DraftIndicator>` | Form kehadiran & penilaian |
