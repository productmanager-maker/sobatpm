# API-CONTRACT.md — Endpoint & Payload

**STATUS: MSW mock — swap base URL saat BE siap.**

Dev mock dilayani oleh MSW. Endpoint tersedia di `/api/v1/...`.

## Konvensi umum

- Base URL (dev/mock): `/api/v1`
- Base URL (prod): `https://api.platform-expert.sekolahmu.co.id/v1` *(konfirmasi ke BE)*
- Auth: cookie httpOnly `expert_token` (di-set oleh `POST /api/auth/login`)
- Response envelope:
  ```json
  { "data": { ... }, "meta": { "page": 1, "total": 50 } }
  ```
- Error envelope:
  ```json
  { "error": { "code": "UNAUTHORIZED", "message": "Token tidak valid" } }
  ```
- Timestamps: ISO 8601 UTC (`2026-05-12T08:00:00Z`)

---

## Auth (FINAL — Dummy Login)

```
POST /api/auth/login
  body: { identifier: string, password: string }
  → Set-Cookie: expert_token=<hardcoded>; httpOnly
  → { data: { token, expert: Expert } }
  NOTE: Menerima kredensial apapun. AuthProvider interface tersisa untuk SSO.

POST /api/auth/logout
  → Clear cookie expert_token
  → { data: { ok: true } }

GET /api/auth/me
  → { data: { expert: Expert } }
```

Interface AuthProvider (swap untuk Sekolahmu SSO):
```ts
export interface AuthProvider {
  login(identifier: string, password: string): Promise<{ token: string; expert: Expert }>;
  logout(): Promise<void>;
  getMe(): Promise<Expert>;
}

export interface Expert {
  id: string;
  name: string;
  email: string;
  roles: ("mengajar" | "menilai")[];
  avatarUrl?: string | null;
}
```

---

## Aktivitas

```
GET /api/v1/aktivitas?filter=today|week|all&type=mengajar|menilai|materi
  → { data: Aktivitas[] }

GET /api/v1/aktivitas/:id
  → { data: Aktivitas }

GET /api/v1/aktivitas/:id/peserta
  → { data: Peserta[] }
```

Type Aktivitas:
```ts
{
  id: string;
  nama: string;
  programId: string;
  programNama: string;
  type: 'mengajar' | 'menilai' | 'materi';
  waktuMulai: string;      // ISO
  waktuSelesai: string;
  lokasi?: string;
  linkMeeting?: string;
  jumlahPeserta: number;
  status: 'belum-mulai' | 'sedang-berlangsung' | 'selesai' | 'sudah-diisi';
  deskripsi: string;
  deadline?: string;
}
```

---

## Kehadiran (Presensi)

```
GET /api/v1/aktivitas/:id/kehadiran
  → { data: { entries: { pesertaId, status }[], submittedAt: string | null } }

POST /api/v1/aktivitas/:id/kehadiran
  body: { entries: { pesertaId, status }[] }
  → { data: { ok: true, submittedAt } }

PATCH /api/v1/aktivitas/:id/kehadiran
  body: { entries: { pesertaId, status }[] }
  → { data: { ok: true, lastEditedAt } }
```

Status kehadiran **(FINAL — tidak ada status lain)**:
```ts
type StatusKehadiran = 'hadir' | 'izin' | 'sakit' | 'tanpa-keterangan';
```

---

## Penilaian

```
GET /api/v1/penilaian?filter=pending|done
  → { data: Aktivitas[] }

GET /api/v1/aktivitas/:id/penilaian
  → { data: { entries: PenilaianEntry[], submittedAt } }

POST /api/v1/aktivitas/:id/penilaian
  body: { entries: PenilaianEntry[] }
  → { data: { ok, submittedAt } }
```

Type PenilaianEntry **(FINAL)**:
```ts
{
  pesertaId: string;
  nilai: number;     // integer, min: 0, max: 100, required
  catatan?: string;  // opsional
}
```

---

## Peserta

```
GET /api/v1/peserta/:id
  → { data: Peserta }

GET /api/v1/peserta/:id/riwayat-kehadiran?programId=...
  → { data: { hadir: number, izin: number, sakit: number, tk: number, total } }

GET /api/v1/peserta/:id/riwayat-penilaian?programId=...
  → { data: { entries: { aktivitasId, nilai, tanggal }[] } }
```

---

## Program

```
GET /api/v1/program?filter=aktif|selesai
  → { data: Program[] }

GET /api/v1/program/:id
  → { data: Program }

GET /api/v1/program/:id/aktivitas?type=mengajar|menilai|materi
  → { data: Aktivitas[] }

GET /api/v1/program/:id/progres
  → { data: { rataRata: number, peserta: { pesertaId, nama, persentase }[] } }
```

---

## Umpan Balik & Catatan

```
GET /api/v1/aktivitas/:id/umpan-balik
GET /api/v1/program/:id/umpan-balik

POST /api/v1/aktivitas/:id/umpan-balik
  body: { konten: string, scope: 'aktivitas' | 'peserta', pesertaId?: string }
```

---

## Pengumuman

```
GET /api/v1/pengumuman?scope=aktivitas&aktivitasId=...
GET /api/v1/pengumuman?scope=program&programId=...
GET /api/v1/pengumuman/:id
```

---

## Notifikasi

```
GET /api/v1/notifikasi?unreadOnly=true
GET /api/v1/notifikasi/:id
PATCH /api/v1/notifikasi/:id    body: { read: true }
PATCH /api/v1/notifikasi/read-all
```

---

## Fase 3 Tambahan

```
GET /api/v1/aktivitas/:id/hasil-karya
  → { data: KaryaEntry[] }

GET /api/v1/hasil-karya/:karyaId
  → { data: KaryaDetail }

POST /api/v1/hasil-karya/:karyaId/review
  body: { nilai: number, catatan?: string }  // nilai: integer 0-100
  → { data: { ok, reviewedAt } }

GET /api/v1/progres/peserta/:pesertaId?programId=...
  → { data: { persentase, aktivitasTerakhir: [...] } }
```

---

## Glossary & Hak Akses

```
GET /api/v1/glossary
  → { data: { istilah: string, definisi: string }[] }

GET /api/v1/me/hak-akses
  → { data: { roles: string[], permissions: string[] } }
```
