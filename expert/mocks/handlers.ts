import { http, HttpResponse } from "msw";
import MASTER_SEED from "@/lib/master-seed";
import {
  kehadiranStore,
  penilaianStore,
  umpanBalikStore,
  notifReadStore,
  aktStatusStore,
  assignmentStore,
  auditLogStore,
  karyaStore,
  pengumumanStore,
  expertKaryaStore,
  type StatusKehadiran,
  type UmpanBalikEntry,
  type AuditLogEntry,
  type NotifEntry,
  type KaryaEntry,
  type PengumumanEntry,
  type ExpertKaryaFile,
} from "./state";

// ─── Data arrays ──────────────────────────────────────────────────────────────
const ALL_EXPERTS      = MASTER_SEED.experts;
const ALL_PROGRAMS     = MASTER_SEED.programs;
const ALL_ACTIVITIES   = MASTER_SEED.aktivitas;
const ALL_PARTICIPANTS = MASTER_SEED.peserta;
const ALL_ENROLLMENTS  = MASTER_SEED.enrollments;
// mutable copy so pushNotif can append during session
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALL_NOTIFICATIONS: any[] = [...MASTER_SEED.notifikasi];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isToday(iso: string): boolean {
  const d = new Date(iso), now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function getExpertId(_request: Request): string {
  // MSW v2 browser mode: service worker strips Cookie header before passing to main thread.
  // Handlers run in the main thread, so document.cookie is accessible (cookie is non-httpOnly).
  const cookie = typeof document !== "undefined" ? document.cookie : "";
  const match = cookie.match(/expert_token=([^;]+)/);
  const token = match?.[1] ?? "";
  return token.startsWith("dummy-token-") ? token.slice("dummy-token-".length) : "exp-001";
}

function getExpert(expertId: string) {
  return ALL_EXPERTS.find(e => e.id === expertId) ?? ALL_EXPERTS[0];
}

function isAcademicLead(expertId: string): boolean {
  return getExpert(expertId).role === "academic_lead";
}

function getExpertProgramIds(expertId: string): string[] {
  if (isAcademicLead(expertId)) return ALL_PROGRAMS.map(p => p.id);
  return Array.from(assignmentStore.get(expertId) ?? new Set());
}

function getProgramPesertaIds(programId: string): string[] {
  return ALL_ENROLLMENTS.filter(e => e.programId === programId).map(e => e.pesertaId);
}

function enrichActivity(a: typeof ALL_ACTIVITIES[number], overrideStatus?: string) {
  const prog = ALL_PROGRAMS.find(p => p.id === a.programId);
  const jumlahPeserta = ALL_ENROLLMENTS.filter(e => e.programId === a.programId).length;
  return {
    id: a.id,
    nama: a.nama,
    programId: a.programId,
    programNama: prog?.nama ?? "",
    type: a.tipe,
    waktuMulai: a.waktuMulai,
    waktuSelesai: a.waktuSelesai,
    lokasi: a.lokasi ?? null,
    deadline: "deadline" in a ? (a as { deadline?: string }).deadline ?? null : null,
    jumlahPeserta,
    status: overrideStatus ?? aktStatusStore.get(a.id) ?? a.status,
    deskripsi: a.deskripsi,
    penilaianSelesai: (penilaianStore.get(a.id) ?? []).length,
    kehadiranSelesai: (kehadiranStore.get(a.id) ?? []).length,
  };
}

function enrichProgram(p: typeof ALL_PROGRAMS[number]) {
  const progAktivitas = ALL_ACTIVITIES.filter(a => a.programId === p.id);
  const selesai = progAktivitas.filter(a => {
    const s = aktStatusStore.get(a.id) ?? a.status;
    return s === "sudah-diisi" || s === "selesai";
  }).length;
  return {
    ...p,
    jumlahAktivitas: progAktivitas.length,
    selesaiAktivitas: selesai,
    tanggalMulai: new Date(p.tanggalMulai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    tanggalSelesai: new Date(p.tanggalSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
  };
}

function pushNotif(notif: NotifEntry) {
  notifReadStore.set(notif.id, notif.dibaca);
  ALL_NOTIFICATIONS.push(notif);
}

function addAuditLog(entry: Omit<AuditLogEntry, "id">) {
  auditLogStore.push({ id: `log-${Date.now()}`, ...entry });
}

// ─── Lazy seeding helpers ─────────────────────────────────────────────────────

function seedKarya(aktivitasId: string) {
  if (karyaStore.has(aktivitasId)) return;
  const a = ALL_ACTIVITIES.find(x => x.id === aktivitasId);
  if (!a || a.tipe !== "menilai") { karyaStore.set(aktivitasId, []); return; }

  const pesertaIds = ALL_ENROLLMENTS.filter(e => e.programId === a.programId).map(e => e.pesertaId).slice(0, a.jumlahPeserta);
  const files = ["Laporan_Eksperimen.pdf", "Tugas_Esai.docx", "Presentasi_Final.pptx", "Analisis_Data.xlsx", "Karya_Ilmiah.pdf"];
  const sizes = ["1.2 MB", "845 KB", "2.3 MB", "1.8 MB", "3.1 MB"];
  const scores = [72, 78, 85, 88, 65, 90, 75, 82, 69, 95, 55, 80, 77, 83, 91, 73, 86, 62, 88, 79];
  const reviewedCount = Math.floor(pesertaIds.length * 0.4);

  const entries: KaryaEntry[] = pesertaIds.map((pid, i) => {
    const p = ALL_PARTICIPANTS.find(x => x.id === pid);
    const isReviewed = i < reviewedCount;
    return {
      id: `karya-${aktivitasId}-${pid}`,
      aktivitasId,
      pesertaId: pid,
      pesertaNama: p?.nama ?? pid,
      namaFile: files[i % files.length],
      ukuranFile: sizes[i % sizes.length],
      waktuSubmit: new Date(Date.now() - (pesertaIds.length - i) * 3_600_000).toISOString(),
      catatanPeserta: i % 3 === 0 ? "Sudah saya revisi sesuai feedback sesi sebelumnya." : undefined,
      status: isReviewed ? "DIREVIEW" : "BELUM_DIREVIEW",
      reviewNilai: isReviewed ? scores[i % scores.length] : undefined,
      reviewCatatan: isReviewed ? "Pengerjaan baik, lanjutkan." : undefined,
    };
  });
  karyaStore.set(aktivitasId, entries);
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const handlers = [

  // ─── Auth ────────────────────────────────────────────────────────────────

  http.get("/api/auth/me", ({ request }) => {
    const expertId = getExpertId(request);
    const expert = getExpert(expertId);
    return HttpResponse.json({
      data: {
        expert: {
          id: expert.id,
          nama: expert.nama,
          email: expert.email,
          role: "role" in expert ? expert.role : "expert",
          permissions: "permissions" in expert ? expert.permissions : [],
          avatarUrl: expert.avatarUrl,
          inisial: expert.inisial,
          programCount: getExpertProgramIds(expertId).length,
        },
      },
    });
  }),

  http.get("/api/v1/me", ({ request }) => {
    const expertId = getExpertId(request);
    const expert = getExpert(expertId);
    const programIds = getExpertProgramIds(expertId);
    return HttpResponse.json({
      data: {
        id: expert.id,
        nama: expert.nama,
        email: expert.email,
        role: "role" in expert ? expert.role : "expert",
        permissions: "permissions" in expert ? expert.permissions : [],
        avatarUrl: expert.avatarUrl,
        inisial: expert.inisial,
        programCount: programIds.length,
        programs: ALL_PROGRAMS.filter(p => programIds.includes(p.id)).map(p => ({ id: p.id, nama: p.nama, status: p.status })),
      },
    });
  }),

  // ─── Aktivitas ────────────────────────────────────────────────────────────

  http.get("/api/v1/aktivitas", ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter") ?? "all";
    const type = url.searchParams.get("type");
    const expertId = getExpertId(request);
    const programIds = getExpertProgramIds(expertId);

    let list = ALL_ACTIVITIES.filter(a => programIds.includes(a.programId));
    if (filter === "today") list = list.filter(a => isToday(a.waktuMulai));
    if (type) list = list.filter(a => a.tipe === type);
    list = [...list].sort((a, b) => new Date(a.waktuMulai).getTime() - new Date(b.waktuMulai).getTime());

    return HttpResponse.json({ data: list.map(a => enrichActivity(a)) });
  }),

  http.get("/api/v1/aktivitas/:id", ({ params }) => {
    const a = ALL_ACTIVITIES.find(a => a.id === params.id);
    if (!a) return HttpResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    return HttpResponse.json({ data: enrichActivity(a) });
  }),

  http.get("/api/v1/aktivitas/:id/peserta", ({ params }) => {
    const a = ALL_ACTIVITIES.find(a => a.id === params.id);
    if (!a) return HttpResponse.json({ data: [] });

    const pesertaIds = getProgramPesertaIds(a.programId);
    const peserta = pesertaIds
      .map(id => ALL_PARTICIPANTS.find(p => p.id === id))
      .filter(Boolean)
      .map(p => ({ id: p!.id, nama: p!.nama, kelas: p!.kelas, email: `${p!.id}@peserta.co`, avatarUrl: ("avatarUrl" in p! ? p!.avatarUrl : null), inisial: p!.inisial }));

    return HttpResponse.json({ data: peserta });
  }),

  // ─── Kehadiran ────────────────────────────────────────────────────────────

  http.get("/api/v1/aktivitas/:id/kehadiran", ({ params }) => {
    const id = params.id as string;
    const entries = kehadiranStore.get(id) ?? [];
    return HttpResponse.json({
      data: { entries: entries.map(e => ({ pesertaId: e.pesertaId, status: e.status })), submittedAt: entries[0]?.submittedAt ?? null },
    });
  }),

  http.post("/api/v1/aktivitas/:id/kehadiran", async ({ params, request }) => {
    const id = params.id as string;
    const expertId = getExpertId(request);
    const body = await request.json() as { entries: { pesertaId: string; status: string }[] };
    const now = new Date().toISOString();
    const isLead = isAcademicLead(expertId);

    const existing = kehadiranStore.get(id) ?? [];
    for (const e of body.entries) {
      const idx = existing.findIndex(x => x.pesertaId === e.pesertaId);
      const entry = {
        pesertaId: e.pesertaId,
        status: e.status as StatusKehadiran,
        submittedAt: now,
        ...(isLead ? { overrideBy: expertId, overrideAt: now } : {}),
      };
      if (idx >= 0) existing[idx] = entry;
      else existing.push(entry);
    }
    kehadiranStore.set(id, existing);
    aktStatusStore.set(id, "sudah-diisi");

    if (isLead) {
      const expert = getExpert(expertId);
      addAuditLog({ timestamp: now, aktor: `${expert.nama} (Academic Lead)`, aksi: "Isi kehadiran", detail: `Override kehadiran aktivitas ${id}`, targetId: id });
    }

    const response: Record<string, unknown> = { ok: true, submittedAt: now };
    if (isLead) { response.overrideBy = expertId; response.overrideAt = now; }
    return HttpResponse.json({ data: response });
  }),

  http.patch("/api/v1/aktivitas/:id/kehadiran", async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json() as { entries: { pesertaId: string; status: string }[] };
    const now = new Date().toISOString();
    const existing = kehadiranStore.get(id) ?? [];
    for (const e of body.entries) {
      const idx = existing.findIndex(x => x.pesertaId === e.pesertaId);
      if (idx >= 0) existing[idx] = { ...existing[idx], status: e.status as StatusKehadiran, submittedAt: now };
    }
    kehadiranStore.set(id, existing);
    return HttpResponse.json({ data: { ok: true, lastEditedAt: now } });
  }),

  // ─── Penilaian ────────────────────────────────────────────────────────────

  http.get("/api/v1/penilaian", ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter");
    const expertId = getExpertId(request);
    const programIds = getExpertProgramIds(expertId);

    let list = ALL_ACTIVITIES.filter(a => a.tipe === "menilai" && programIds.includes(a.programId));
    if (filter === "pending") list = list.filter(a => { const s = aktStatusStore.get(a.id) ?? a.status; return s !== "selesai" && s !== "sudah-diisi"; });
    if (filter === "done") list = list.filter(a => { const s = aktStatusStore.get(a.id) ?? a.status; return s === "selesai" || s === "sudah-diisi"; });

    return HttpResponse.json({ data: list.map(a => enrichActivity(a)) });
  }),

  http.get("/api/v1/aktivitas/:id/penilaian", ({ params }) => {
    const id = params.id as string;
    const entries = penilaianStore.get(id) ?? [];
    return HttpResponse.json({ data: { entries, submittedAt: entries[0]?.submittedAt ?? null } });
  }),

  http.post("/api/v1/aktivitas/:id/penilaian", async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json() as { entries: { pesertaId: string; nilai: number; catatan?: string }[] };
    const now = new Date().toISOString();
    const existing = penilaianStore.get(id) ?? [];
    for (const e of body.entries) {
      const idx = existing.findIndex(x => x.pesertaId === e.pesertaId);
      const entry = { pesertaId: e.pesertaId, nilai: Math.min(100, Math.max(0, Math.round(e.nilai))), catatan: e.catatan ?? null, submittedAt: now };
      if (idx >= 0) existing[idx] = entry; else existing.push(entry);
    }
    penilaianStore.set(id, existing);
    aktStatusStore.set(id, "selesai");
    return HttpResponse.json({ data: { ok: true, submittedAt: now } });
  }),

  // ─── Program ─────────────────────────────────────────────────────────────

  http.get("/api/v1/program", ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter");
    const expertId = getExpertId(request);
    const programIds = getExpertProgramIds(expertId);

    let list = ALL_PROGRAMS.filter(p => programIds.includes(p.id));
    if (filter === "aktif") list = list.filter(p => p.status === "aktif");
    if (filter === "selesai") list = list.filter(p => p.status === "selesai");

    return HttpResponse.json({ data: list.map(enrichProgram) });
  }),

  http.get("/api/v1/program/:id", ({ params }) => {
    const p = ALL_PROGRAMS.find(p => p.id === params.id);
    if (!p) return HttpResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    return HttpResponse.json({ data: enrichProgram(p) });
  }),

  http.get("/api/v1/program/:id/aktivitas", ({ params, request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    let list = ALL_ACTIVITIES.filter(a => a.programId === params.id);
    if (type) list = list.filter(a => a.tipe === type);
    return HttpResponse.json({ data: list.map(a => enrichActivity(a)) });
  }),

  http.get("/api/v1/program/:id/progres", ({ params }) => {
    const pesertaIds = getProgramPesertaIds(params.id as string);
    const progAktivitas = ALL_ACTIVITIES.filter(a => a.programId === params.id);
    const total = progAktivitas.length;

    const peserta = pesertaIds.map(id => {
      const ps = ALL_PARTICIPANTS.find(p => p.id === id);
      let selesai = 0;
      for (const a of progAktivitas) {
        const entries = a.tipe === "menilai" ? penilaianStore.get(a.id) ?? [] : kehadiranStore.get(a.id) ?? [];
        if (entries.some(e => e.pesertaId === id)) selesai++;
      }
      return { pesertaId: id, nama: ps?.nama ?? id, kelas: ps?.kelas ?? "", inisial: ps?.inisial ?? "??", persentase: total > 0 ? Math.round((selesai / total) * 100) : 0 };
    });

    const rataRata = peserta.length > 0 ? Math.round(peserta.reduce((s, p) => s + p.persentase, 0) / peserta.length) : 0;
    return HttpResponse.json({ data: { rataRata, peserta } });
  }),

  // ─── Peserta ─────────────────────────────────────────────────────────────

  http.get("/api/v1/peserta/:id", ({ params }) => {
    const p = ALL_PARTICIPANTS.find(p => p.id === params.id);
    if (!p) return HttpResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    return HttpResponse.json({ data: p });
  }),

  http.get("/api/v1/peserta/:id/riwayat-kehadiran", ({ params }) => {
    const pesertaId = params.id as string;
    const result = { hadir: 0, izin: 0, sakit: 0, tk: 0, total: 0 };
    for (const [, entries] of kehadiranStore) {
      for (const e of entries) {
        if (e.pesertaId !== pesertaId) continue;
        result.total++;
        if (e.status === "hadir") result.hadir++;
        else if (e.status === "izin") result.izin++;
        else if (e.status === "sakit") result.sakit++;
        else result.tk++;
      }
    }
    return HttpResponse.json({ data: result });
  }),

  http.get("/api/v1/peserta/:id/riwayat-penilaian", ({ params }) => {
    const pesertaId = params.id as string;
    const entries: { aktivitasId: string; aktivitasNama: string; nilai: number; tanggal: string }[] = [];
    for (const [aktivitasId, list] of penilaianStore) {
      const entry = list.find(e => e.pesertaId === pesertaId);
      if (entry) {
        const a = ALL_ACTIVITIES.find(a => a.id === aktivitasId);
        entries.push({ aktivitasId, aktivitasNama: a?.nama ?? aktivitasId, nilai: entry.nilai, tanggal: a?.waktuMulai ?? "" });
      }
    }
    return HttpResponse.json({ data: { entries } });
  }),

  http.get("/api/v1/peserta/:id/kehadiran-detail", ({ params }) => {
    const pesertaId = params.id as string;
    const result: { aktivitasId: string; aktivitasNama: string; programNama: string; waktuMulai: string; status: string }[] = [];
    for (const [aktivitasId, entries] of kehadiranStore) {
      const entry = entries.find(e => e.pesertaId === pesertaId);
      if (entry) {
        const a = ALL_ACTIVITIES.find(x => x.id === aktivitasId);
        const prog = a ? ALL_PROGRAMS.find(p => p.id === a.programId) : null;
        result.push({ aktivitasId, aktivitasNama: a?.nama ?? aktivitasId, programNama: prog?.nama ?? "", waktuMulai: a?.waktuMulai ?? "", status: entry.status });
      }
    }
    result.sort((a, b) => new Date(b.waktuMulai).getTime() - new Date(a.waktuMulai).getTime());
    return HttpResponse.json({ data: result });
  }),

  http.get("/api/v1/peserta/:id/umpan-balik", ({ params }) => {
    const pesertaId = params.id as string;
    const result: { id: string; konten: string; expertNama: string; aktivitasId: string; aktivitasNama: string; createdAt: string }[] = [];
    for (const [aktivitasId, entries] of umpanBalikStore) {
      const filtered = entries.filter(e => e.pesertaId === pesertaId && e.scope === "peserta");
      const a = ALL_ACTIVITIES.find(x => x.id === aktivitasId);
      for (const e of filtered) {
        const expert = ALL_EXPERTS.find(x => x.id === e.expertId);
        result.push({ id: e.id, konten: e.konten, expertNama: expert?.nama ?? e.expertId, aktivitasId, aktivitasNama: a?.nama ?? aktivitasId, createdAt: e.createdAt });
      }
    }
    // Seed demo catatan when store is empty, so Catatan tab always has content
    if (result.length === 0) {
      const p = ALL_PARTICIPANTS.find(x => x.id === pesertaId);
      const firstName = p?.nama.split(" ")[0] ?? "Peserta";
      const hash = pesertaId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const now = Date.now();
      const seedCatatan = [
        `${firstName} menunjukkan partisipasi aktif dan antusiasme yang tinggi selama sesi. Pertanyaan yang diajukan relevan dan mencerminkan pemahaman yang berkembang. Pertahankan semangat ini.`,
        `Perkembangan ${firstName} terlihat positif dibanding sesi sebelumnya. Kemampuan analisis mulai terlihat lebih tajam. Perlu ditingkatkan pada bagian penerapan konsep ke situasi nyata.`,
        `${firstName} menyelesaikan semua tugas dengan baik dan tepat waktu. Kualitas jawaban diskusi di atas rata-rata. Rekomendasikan untuk mencoba soal-soal pengayaan di sesi berikutnya.`,
      ];
      const seedExperts = ALL_EXPERTS.slice(0, 3);
      const seedActivities = ALL_ACTIVITIES.filter(a => ALL_ENROLLMENTS.some(e => e.pesertaId === pesertaId && e.programId === a.programId)).slice(0, 3);
      seedExperts.forEach((exp, i) => {
        const akt = seedActivities[i % seedActivities.length];
        if (!akt) return;
        result.push({
          id: `seed-ub-${pesertaId}-${i}`,
          konten: seedCatatan[(hash + i) % seedCatatan.length],
          expertNama: exp.nama,
          aktivitasId: akt.id,
          aktivitasNama: akt.nama,
          createdAt: new Date(now - (i + 1) * 2 * 86400000).toISOString(),
        });
      });
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return HttpResponse.json({ data: result });
  }),

  http.get("/api/v1/progres/peserta/:id", ({ params, request }) => {
    const url = new URL(request.url);
    const programId = url.searchParams.get("programId") ?? "";
    const pesertaId = params.id as string;
    const progAktivitas = ALL_ACTIVITIES.filter(a => !programId || a.programId === programId);
    const total = progAktivitas.length;
    const selesai = progAktivitas.filter(a => {
      const entries = a.tipe === "menilai" ? penilaianStore.get(a.id) ?? [] : kehadiranStore.get(a.id) ?? [];
      return entries.some(e => e.pesertaId === pesertaId);
    }).length;
    return HttpResponse.json({ data: { persentase: total > 0 ? Math.round((selesai / total) * 100) : 0, total, selesai } });
  }),

  // ─── Umpan Balik ─────────────────────────────────────────────────────────

  http.get("/api/v1/aktivitas/:id/umpan-balik", ({ params }) => {
    return HttpResponse.json({ data: umpanBalikStore.get(params.id as string) ?? [] });
  }),

  http.post("/api/v1/aktivitas/:id/umpan-balik", async ({ params, request }) => {
    const id = params.id as string;
    const expertId = getExpertId(request);
    const body = await request.json() as { konten: string; scope: string; pesertaId?: string };
    const entry: UmpanBalikEntry = {
      id: `ub-${Date.now()}`,
      konten: body.konten,
      scope: (body.scope ?? "aktivitas") as UmpanBalikEntry["scope"],
      pesertaId: body.pesertaId ?? "",
      expertId,
      createdAt: new Date().toISOString(),
    };
    const list = umpanBalikStore.get(id) ?? [];
    list.push(entry);
    umpanBalikStore.set(id, list);
    return HttpResponse.json({ data: { ok: true } });
  }),

  // ─── Hasil Karya ─────────────────────────────────────────────────────────

  http.get("/api/v1/aktivitas/:id/hasil-karya", ({ params }) => {
    const id = params.id as string;
    seedKarya(id);
    return HttpResponse.json({ data: karyaStore.get(id) ?? [] });
  }),

  http.get("/api/v1/aktivitas/:id/hasil-karya/:karyaId", ({ params }) => {
    const id = params.id as string;
    const karyaId = params.karyaId as string;
    seedKarya(id);
    const karya = (karyaStore.get(id) ?? []).find(k => k.id === karyaId);
    if (!karya) return HttpResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    return HttpResponse.json({ data: karya });
  }),

  http.patch("/api/v1/aktivitas/:id/hasil-karya/:karyaId", async ({ params, request }) => {
    const id = params.id as string;
    const karyaId = params.karyaId as string;
    seedKarya(id);
    const body = await request.json() as { reviewNilai?: number; reviewCatatan?: string };
    const list = karyaStore.get(id) ?? [];
    const idx = list.findIndex(k => k.id === karyaId);
    if (idx < 0) return HttpResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    list[idx] = { ...list[idx], status: "DIREVIEW", reviewNilai: body.reviewNilai, reviewCatatan: body.reviewCatatan };
    karyaStore.set(id, list);
    return HttpResponse.json({ data: list[idx] });
  }),

  // ─── Pengumuman ───────────────────────────────────────────────────────────

  http.get("/api/v1/aktivitas/:id/pengumuman", ({ params }) => {
    const id = params.id as string;
    return HttpResponse.json({ data: pengumumanStore.get(id) ?? [] });
  }),

  http.post("/api/v1/aktivitas/:id/pengumuman", async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json() as { judul: string; isi: string };
    const expertId = getExpertId(request);
    const expert = getExpert(expertId);
    const entry: PengumumanEntry = {
      id: `pg-${id}-${Date.now()}`,
      aktivitasId: id,
      judul: body.judul,
      isi: body.isi,
      createdAt: new Date().toISOString(),
      penulis: expert.nama,
    };
    const list = pengumumanStore.get(id) ?? [];
    list.unshift(entry);
    pengumumanStore.set(id, list);
    return HttpResponse.json({ data: entry });
  }),

  // ─── Notifikasi ──────────────────────────────────────────────────────────

  http.get("/api/v1/notifikasi", ({ request }) => {
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";
    const expertId = getExpertId(request);

    let list = ALL_NOTIFICATIONS.filter(n => n.expertId === expertId).map(n => ({
      ...n,
      dibaca: notifReadStore.get(n.id) ?? n.dibaca,
    }));
    if (unreadOnly) list = list.filter(n => !n.dibaca);
    list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return HttpResponse.json({ data: list });
  }),

  http.get("/api/v1/notifikasi/:id", ({ params }) => {
    const n = ALL_NOTIFICATIONS.find(n => n.id === params.id);
    if (!n) return HttpResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    return HttpResponse.json({ data: { ...n, dibaca: notifReadStore.get(n.id) ?? n.dibaca } });
  }),

  http.patch("/api/v1/notifikasi/read-all", ({ request }) => {
    const expertId = getExpertId(request);
    ALL_NOTIFICATIONS.filter(n => n.expertId === expertId).forEach(n => notifReadStore.set(n.id, true));
    return HttpResponse.json({ data: { ok: true } });
  }),

  http.patch("/api/v1/notifikasi/:id", async ({ params, request }) => {
    const body = await request.json() as { read: boolean };
    notifReadStore.set(params.id as string, body.read);
    return HttpResponse.json({ data: { ok: true } });
  }),

  // ─── Academic Lead: Experts list ─────────────────────────────────────────

  http.get("/api/v1/experts", ({ request }) => {
    const expertId = getExpertId(request);
    if (!isAcademicLead(expertId)) {
      return HttpResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
    }
    return HttpResponse.json({
      data: ALL_EXPERTS.map(e => ({
        id: e.id,
        nama: e.nama,
        email: e.email,
        role: e.role,
        inisial: e.inisial,
        avatarUrl: e.avatarUrl,
        programCount: (assignmentStore.get(e.id)?.size ?? 0),
      })),
    });
  }),

  // ─── Academic Lead: Assign / Reassign ────────────────────────────────────

  http.patch("/api/v1/assignments", async ({ request }) => {
    const expertId = getExpertId(request);
    if (!isAcademicLead(expertId)) {
      return HttpResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
    }

    const body = await request.json() as { expertId: string; programId?: string; aktivitasId?: string; action?: "assign" | "unassign" };
    const targetExpertId = body.expertId;
    const now = new Date().toISOString();
    const leadExpert = getExpert(expertId);

    if (body.programId) {
      const programId = body.programId;
      const set = assignmentStore.get(targetExpertId) ?? new Set<string>();
      if (body.action === "unassign") set.delete(programId); else set.add(programId);
      assignmentStore.set(targetExpertId, set);

      const prog = ALL_PROGRAMS.find(p => p.id === programId);
      const notifId = `notif-assign-${Date.now()}`;
      pushNotif({
        id: notifId,
        expertId: targetExpertId,
        judul: "Penugasan baru dari Academic Lead",
        isi: `${leadExpert.nama} menugaskan Anda ke program "${prog?.nama ?? programId}".`,
        dibaca: false,
        createdAt: now,
        linkAktivitas: null,
      });

      addAuditLog({ timestamp: now, aktor: `${leadExpert.nama} (Academic Lead)`, aksi: "Assign program", detail: `Menugaskan program ${programId} ke ${targetExpertId}`, targetId: programId });
    }

    if (body.aktivitasId) {
      const akt = ALL_ACTIVITIES.find(a => a.id === body.aktivitasId);
      if (akt) {
        const set = assignmentStore.get(targetExpertId) ?? new Set<string>();
        set.add(akt.programId);
        assignmentStore.set(targetExpertId, set);

        const notifId = `notif-assign-akt-${Date.now()}`;
        pushNotif({
          id: notifId,
          expertId: targetExpertId,
          judul: "Penugasan aktivitas baru",
          isi: `${leadExpert.nama} menugaskan aktivitas "${akt.nama}" ke Anda.`,
          dibaca: false,
          createdAt: now,
          linkAktivitas: akt.id,
        });

        addAuditLog({ timestamp: now, aktor: `${leadExpert.nama} (Academic Lead)`, aksi: "Assign aktivitas", detail: `Menugaskan aktivitas ${body.aktivitasId} ke ${targetExpertId}`, targetId: body.aktivitasId });
      }
    }

    return HttpResponse.json({ data: { ok: true } });
  }),

  // ─── Academic Lead: Audit Log ─────────────────────────────────────────────

  http.get("/api/v1/audit-log", ({ request }) => {
    const expertId = getExpertId(request);
    if (!isAcademicLead(expertId)) {
      return HttpResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
    }
    const sorted = [...auditLogStore].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return HttpResponse.json({ data: sorted });
  }),

  // ─── Peserta List (global, filtered by expert's programs) ───────────────────

  http.get("/api/v1/peserta", ({ request }) => {
    const expertId = getExpertId(request);
    const programIds = getExpertProgramIds(expertId);
    const seen = new Set<string>();
    const result: { id: string; nama: string; kelas: string; inisial: string; programId: string; programNama: string }[] = [];
    for (const programId of programIds) {
      const prog = ALL_PROGRAMS.find(p => p.id === programId);
      const pesertaIds = ALL_ENROLLMENTS.filter(e => e.programId === programId).map(e => e.pesertaId);
      for (const pid of pesertaIds) {
        if (seen.has(pid)) continue;
        seen.add(pid);
        const p = ALL_PARTICIPANTS.find(x => x.id === pid);
        if (p) result.push({ id: p.id, nama: p.nama, kelas: p.kelas, inisial: p.inisial, programId, programNama: prog?.nama ?? "" });
      }
    }
    result.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
    return HttpResponse.json({ data: result });
  }),

  // ─── Expert Karya (multi-file per peserta) ──────────────────────────────────

  http.get("/api/v1/aktivitas/:id/karya-expert", ({ params }) => {
    const id = params.id as string;
    return HttpResponse.json({ data: expertKaryaStore.get(id) ?? [] });
  }),

  http.post("/api/v1/aktivitas/:id/karya-expert/:pesertaId/files", async ({ params, request }) => {
    const aktivitasId = params.id as string;
    const pesertaId = params.pesertaId as string;
    const body = await request.json() as { files: { nama: string; tipe: string; ukuranFormatted: string }[] };

    const list = expertKaryaStore.get(aktivitasId) ?? [];
    let entry = list.find(e => e.pesertaId === pesertaId);
    if (!entry) {
      const p = ALL_PARTICIPANTS.find(x => x.id === pesertaId);
      entry = { aktivitasId, pesertaId, pesertaNama: p?.nama ?? pesertaId, files: [] };
      list.push(entry);
    }
    const newFiles: ExpertKaryaFile[] = (body.files ?? []).map(f => ({
      id: `ekf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nama: f.nama,
      tipe: f.tipe as ExpertKaryaFile["tipe"],
      ukuranFormatted: f.ukuranFormatted,
      uploadedAt: new Date().toISOString(),
      taggedTo: [],
    }));
    entry.files.push(...newFiles);
    expertKaryaStore.set(aktivitasId, list);
    return HttpResponse.json({ data: newFiles });
  }),

  http.post("/api/v1/aktivitas/:id/karya-expert/:pesertaId/files/:fileId/tag", async ({ params, request }) => {
    const { id: aktivitasId, pesertaId, fileId } = params as Record<string, string>;
    const body = await request.json() as { targetPesertaId: string };
    const list = expertKaryaStore.get(aktivitasId) ?? [];
    const entry = list.find(e => e.pesertaId === pesertaId);
    const file = entry?.files.find(f => f.id === fileId);
    if (!file) return HttpResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    if (!file.taggedTo.includes(body.targetPesertaId)) file.taggedTo.push(body.targetPesertaId);
    expertKaryaStore.set(aktivitasId, list);
    return HttpResponse.json({ data: { ok: true } });
  }),

  http.delete("/api/v1/aktivitas/:id/karya-expert/:pesertaId/files/:fileId/tag/:targetId", ({ params }) => {
    const { id: aktivitasId, pesertaId, fileId, targetId } = params as Record<string, string>;
    const list = expertKaryaStore.get(aktivitasId) ?? [];
    const entry = list.find(e => e.pesertaId === pesertaId);
    const file = entry?.files.find(f => f.id === fileId);
    if (file) file.taggedTo = file.taggedTo.filter(id => id !== targetId);
    expertKaryaStore.set(aktivitasId, list);
    return HttpResponse.json({ data: { ok: true } });
  }),

  http.delete("/api/v1/aktivitas/:id/karya-expert/:pesertaId/files/:fileId", ({ params }) => {
    const { id: aktivitasId, pesertaId, fileId } = params as Record<string, string>;
    const list = expertKaryaStore.get(aktivitasId) ?? [];
    const entry = list.find(e => e.pesertaId === pesertaId);
    if (entry) entry.files = entry.files.filter(f => f.id !== fileId);
    expertKaryaStore.set(aktivitasId, list);
    return HttpResponse.json({ data: { ok: true } });
  }),

  http.get("/api/v1/peserta/:id/tagged-karya", ({ params }) => {
    const pesertaId = params.id as string;
    const result: { aktivitasId: string; aktivitasNama: string; originalPesertaId: string; originalPesertaNama: string; file: ExpertKaryaFile }[] = [];
    for (const [aktivitasId, entries] of expertKaryaStore) {
      const a = ALL_ACTIVITIES.find(x => x.id === aktivitasId);
      for (const entry of entries) {
        for (const file of entry.files) {
          if (file.taggedTo.includes(pesertaId)) {
            result.push({ aktivitasId, aktivitasNama: a?.nama ?? aktivitasId, originalPesertaId: entry.pesertaId, originalPesertaNama: entry.pesertaNama, file });
          }
        }
      }
    }
    return HttpResponse.json({ data: result });
  }),

  // ─── Peserta Aggregate (for Tab Peserta) ─────────────────────────────────────

  http.get("/api/v1/aktivitas/:id/peserta-aggregate", ({ params }) => {
    const aktivitasId = params.id as string;
    const a = ALL_ACTIVITIES.find(x => x.id === aktivitasId);
    if (!a) return HttpResponse.json({ data: [] });

    const programId = a.programId;
    const pesertaIds = getProgramPesertaIds(programId);
    const progAktivitas = ALL_ACTIVITIES.filter(x => x.programId === programId && x.tipe === "mengajar");

    const result = pesertaIds.map(pesertaId => {
      const p = ALL_PARTICIPANTS.find(x => x.id === pesertaId);

      // Kehadiran list across all mengajar aktivitas
      const kehadiranList = progAktivitas.map(akt => {
        const entries = kehadiranStore.get(akt.id) ?? [];
        const entry = entries.find(e => e.pesertaId === pesertaId);
        return { aktivitasId: akt.id, aktivitasNama: akt.nama, status: entry?.status ?? null };
      }).filter(k => k.status !== null);

      // Catatan count from umpan balik
      let catatanCount = 0;
      for (const [, entries] of umpanBalikStore) {
        catatanCount += entries.filter(e => e.pesertaId === pesertaId && e.scope === "peserta").length;
      }

      // Karya count from expert karya
      const karyaFiles = (expertKaryaStore.get(aktivitasId) ?? []).find(e => e.pesertaId === pesertaId)?.files ?? [];

      // Kehadiran status for this specific aktivitas
      const thisKehadiran = (kehadiranStore.get(aktivitasId) ?? []).find(e => e.pesertaId === pesertaId);

      // Nilai (if any penilaian for this aktivitas)
      const nilaiEntry = (penilaianStore.get(aktivitasId) ?? []).find(e => e.pesertaId === pesertaId);

      return {
        id: p?.id ?? pesertaId,
        nama: p?.nama ?? pesertaId,
        kelas: p?.kelas ?? "-",
        inisial: p?.inisial ?? "??",
        kehadiranStatus: thisKehadiran?.status ?? null,
        kehadiranCount: kehadiranList.length,
        kehadiranList,
        catatanCount,
        karyaCount: karyaFiles.length,
        nilai: nilaiEntry?.nilai ?? null,
      };
    });

    return HttpResponse.json({ data: result });
  }),

  // ─── AI Generate Catatan ─────────────────────────────────────────────────

  http.post("/api/v1/ai/generate-catatan", async ({ request }) => {
    const body = await request.json() as { pesertaNama: string; aktivitasNama?: string; programNama?: string; scope?: string };
    const nama = body.pesertaNama.split(" ")[0];
    const hash = body.pesertaNama.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

    const catatanTemplates = [
      `${body.pesertaNama} menunjukkan antusiasme yang tinggi selama sesi berlangsung. Pertanyaan yang diajukan mencerminkan rasa ingin tahu yang kuat dan pemahaman yang semakin berkembang. Pertahankan semangat ini dan terus aktif berdiskusi di sesi berikutnya.`,
      `${nama} hadir dan mengikuti seluruh rangkaian aktivitas dengan baik. Kemampuan menyerap materi terlihat dari respons yang diberikan saat diskusi. Disarankan untuk memperkuat pemahaman dengan latihan mandiri sebelum sesi berikutnya.`,
      `Perkembangan ${nama} dalam sesi ini sangat positif. Terlihat kemajuan dibanding sesi sebelumnya, terutama dalam hal keaktifan dan kedalaman analisis. Perlu ditingkatkan pada bagian penerapan konsep ke contoh nyata.`,
      `${body.pesertaNama} berpartisipasi aktif dan menunjukkan pemahaman yang solid terhadap materi yang dibahas. Ada beberapa poin yang masih perlu diperdalam, namun progres secara keseluruhan sudah sangat baik. Terus pertahankan.`,
      `Sesi berjalan baik untuk ${nama}. Fokus dan konsentrasi terjaga selama pembelajaran. Ke depannya, dorong untuk lebih berani menyampaikan pendapat dan mengajukan pertanyaan saat ada yang belum dipahami.`,
      `${nama} menyelesaikan aktivitas dengan tepat waktu dan hasilnya memuaskan. Kualitas pemahaman terlihat dari cara menjawab pertanyaan diskusi. Rekomendasikan untuk mulai mengerjakan latihan tambahan agar kesiapan semakin tinggi.`,
    ];

    const internalTemplates = [
      `Perlu perhatian lebih di sesi berikutnya. Pantau apakah ada hambatan belajar yang tidak tersampaikan secara langsung.`,
      `Progres bagus, tapi pastikan materi dasar sudah benar-benar dipahami sebelum lanjut ke topik lanjutan.`,
      `Peserta tampak sudah siap untuk tantangan yang lebih tinggi. Pertimbangkan memberikan tugas pengayaan.`,
      `Perhatikan kehadiran di sesi mendatang. Konsistensi kehadiran berpengaruh pada pemahaman berkelanjutan.`,
      `Catat untuk difollow-up: peserta menyebutkan kesulitan di bagian konsep X. Siapkan penjelasan alternatif.`,
    ];

    const catatan = catatanTemplates[hash % catatanTemplates.length];
    const internal = internalTemplates[(hash + 2) % internalTemplates.length];

    return HttpResponse.json({
      data: {
        catatan: body.scope === "internal" ? internal : catatan,
        catatanInternal: internal,
      },
    });
  }),

  // ─── Hak Akses & Glossary ────────────────────────────────────────────────

  http.get("/api/v1/me/hak-akses", ({ request }) => {
    const expertId = getExpertId(request);
    const expert = getExpert(expertId);
    const role = expert.role as string;
    const permissions = role === "academic_lead"
      ? ["program:read", "program:read-all", "presensi:read", "presensi:write", "presensi:override", "penilaian:read", "penilaian:write", "assign:write", "audit-log:read"]
      : [
          "program:read",
          ...("permissions" in expert ? (expert.permissions as string[]).includes("mengajar") ? ["presensi:read", "presensi:write"] : [] : []),
          ...("permissions" in expert ? (expert.permissions as string[]).includes("menilai") ? ["penilaian:read", "penilaian:write"] : [] : []),
        ];
    return HttpResponse.json({ data: { role, permissions } });
  }),

  http.get("/api/v1/glossary", () => {
    return HttpResponse.json({ data: MASTER_SEED.glossary });
  }),
];
