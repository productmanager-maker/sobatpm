/**
 * In-memory store for playground mutations.
 * Initialized from MASTER_SEED. Resets on server/browser restart.
 */
import MASTER_SEED from "@/lib/master-seed";

export type StatusKehadiran = "hadir" | "izin" | "sakit" | "tanpa-keterangan";

export interface KehadiranEntry {
  pesertaId: string;
  status: StatusKehadiran;
  submittedAt: string;
  overrideBy?: string;
  overrideAt?: string;
}

export interface PenilaianEntry {
  pesertaId: string;
  nilai: number;
  catatan: string | null;
  submittedAt: string;
}

export interface UmpanBalikEntry {
  id: string;
  konten: string;
  scope: "aktivitas" | "peserta";
  pesertaId: string;
  expertId: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  aktor: string;
  aksi: string;
  detail: string;
  targetId: string | null;
}

export interface NotifEntry {
  id: string;
  expertId: string;
  judul: string;
  isi: string;
  dibaca: boolean;
  createdAt: string;
  linkAktivitas: string | null;
}

// ─── Mutable stores ───────────────────────────────────────────────────────────
export const kehadiranStore = new Map<string, KehadiranEntry[]>();
export const penilaianStore = new Map<string, PenilaianEntry[]>();
export const umpanBalikStore = new Map<string, UmpanBalikEntry[]>();
export const notifReadStore = new Map<string, boolean>();
export const aktStatusStore = new Map<string, string>();
export const auditLogStore: AuditLogEntry[] = [];

// Dynamic assignments: key = expertId, value = Set of programIds
export const assignmentStore = new Map<string, Set<string>>();

// ─── Hasil Karya ─────────────────────────────────────────────────────────────
export interface KaryaEntry {
  id: string;
  aktivitasId: string;
  pesertaId: string;
  pesertaNama: string;
  namaFile: string;
  ukuranFile: string;
  waktuSubmit: string;
  catatanPeserta?: string;
  status: "BELUM_DIREVIEW" | "DIREVIEW";
  reviewNilai?: number;
  reviewCatatan?: string;
}

// key = aktivitasId
export const karyaStore = new Map<string, KaryaEntry[]>();

// ─── Pengumuman ───────────────────────────────────────────────────────────────
export interface PengumumanEntry {
  id: string;
  aktivitasId: string;
  judul: string;
  isi: string;
  createdAt: string;
  penulis: string;
}

// key = aktivitasId
export const pengumumanStore = new Map<string, PengumumanEntry[]>();

// ─── Expert Karya (multi-file per peserta, expert-uploaded) ───────────────────
export interface ExpertKaryaFile {
  id: string;
  nama: string;
  tipe: "image" | "video" | "file";
  ukuranFormatted: string;
  uploadedAt: string;
  taggedTo: string[]; // pesertaId[]
}

export interface ExpertKaryaPerPeserta {
  aktivitasId: string;
  pesertaId: string;
  pesertaNama: string;
  files: ExpertKaryaFile[];
}

// key = aktivitasId
export const expertKaryaStore = new Map<string, ExpertKaryaPerPeserta[]>();

// ─── Seed initialization ──────────────────────────────────────────────────────

for (const k of MASTER_SEED.kehadiran) {
  const list = kehadiranStore.get(k.aktivitasId) ?? [];
  list.push({ pesertaId: k.pesertaId, status: k.status as StatusKehadiran, submittedAt: k.submittedAt });
  kehadiranStore.set(k.aktivitasId, list);
}

for (const p of MASTER_SEED.penilaian) {
  const list = penilaianStore.get(p.aktivitasId) ?? [];
  list.push({ pesertaId: p.pesertaId, nilai: p.nilai, catatan: p.catatan, submittedAt: p.submittedAt });
  penilaianStore.set(p.aktivitasId, list);
}

for (const n of MASTER_SEED.notifikasi) {
  notifReadStore.set(n.id, n.dibaca);
}

for (const a of MASTER_SEED.assignments) {
  const set = assignmentStore.get(a.expertId) ?? new Set<string>();
  set.add(a.programId);
  assignmentStore.set(a.expertId, set);
}

for (const entry of MASTER_SEED.auditLog) {
  auditLogStore.push({
    id: entry.id,
    timestamp: entry.timestamp,
    aktor: entry.aktor,
    aksi: entry.aksi,
    detail: entry.detail,
    targetId: null,
  });
}

for (const ub of MASTER_SEED.umpanBalik) {
  if (!ub.aktivitasId || (ub.scope as string) === "program") continue;
  const list = umpanBalikStore.get(ub.aktivitasId) ?? [];
  list.push({
    id: ub.id,
    konten: ub.konten,
    scope: ub.scope as UmpanBalikEntry["scope"],
    pesertaId: (ub.pesertaId as string | null) ?? "",
    expertId: "exp-001",
    createdAt: ub.createdAt,
  });
  umpanBalikStore.set(ub.aktivitasId, list);
}

for (const pg of MASTER_SEED.pengumuman) {
  if (pg.scope !== "aktivitas" || !pg.aktivitasId) continue;
  const expert = MASTER_SEED.experts.find(e => e.id === (pg as { createdBy?: string }).createdBy);
  const list = pengumumanStore.get(pg.aktivitasId) ?? [];
  list.push({
    id: pg.id,
    aktivitasId: pg.aktivitasId,
    judul: pg.judul,
    isi: pg.isi,
    createdAt: pg.createdAt,
    penulis: expert?.nama ?? "Expert",
  });
  pengumumanStore.set(pg.aktivitasId, list);
}
