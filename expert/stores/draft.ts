import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StatusKehadiran = "hadir" | "izin" | "sakit" | "tanpa-keterangan";

export interface KehadiranEntry {
  pesertaId: string;
  status: StatusKehadiran;
}

export interface PenilaianEntry {
  pesertaId: string;
  nilai: number;     // integer 0-100
  catatan?: string;
}

interface DraftStore {
  kehadiran: Record<string, KehadiranEntry[]>;     // key: aktivitasId
  penilaian: Record<string, PenilaianEntry[]>;     // key: aktivitasId
  setKehadiran: (aktivitasId: string, entries: KehadiranEntry[]) => void;
  clearKehadiran: (aktivitasId: string) => void;
  setPenilaian: (aktivitasId: string, entries: PenilaianEntry[]) => void;
  clearPenilaian: (aktivitasId: string) => void;
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      kehadiran: {},
      penilaian: {},
      setKehadiran: (id, entries) =>
        set(s => ({ kehadiran: { ...s.kehadiran, [id]: entries } })),
      clearKehadiran: (id) =>
        set(s => {
          const { [id]: _, ...rest } = s.kehadiran;
          return { kehadiran: rest };
        }),
      setPenilaian: (id, entries) =>
        set(s => ({ penilaian: { ...s.penilaian, [id]: entries } })),
      clearPenilaian: (id) =>
        set(s => {
          const { [id]: _, ...rest } = s.penilaian;
          return { penilaian: rest };
        }),
    }),
    { name: "expert-drafts" }
  )
);
