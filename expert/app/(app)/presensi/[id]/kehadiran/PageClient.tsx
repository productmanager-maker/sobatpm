"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type KehadiranStatus = "hadir" | "izin" | "sakit" | "tanpa-keterangan";

const STATUS_OPTIONS: { value: KehadiranStatus; label: string; color: string; bg: string }[] = [
  { value: "hadir",            label: "Hadir", color: "var(--primary-600)", bg: "var(--primary-100)" },
  { value: "izin",             label: "Izin",  color: "#6b6b6b",            bg: "#f2f2f2" },
  { value: "sakit",            label: "Sakit", color: "#c97a24",            bg: "#fff5de" },
  { value: "tanpa-keterangan", label: "Alpa",  color: "#eb0b54",            bg: "#ffe6ea" },
];

function StatusChip({ value, onSelect }: { value: KehadiranStatus | ""; onSelect: (v: KehadiranStatus) => void }) {
  const [open, setOpen] = useState(false);
  const current = STATUS_OPTIONS.find(o => o.value === value);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(p => !p); }}
        style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "4px 10px", borderRadius: "var(--radius-pill)",
          background: current ? current.bg : "var(--neutral-300)",
          color: current ? current.color : "var(--text-300)",
          border: "none", cursor: "pointer",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap",
        }}
      >
        {current ? current.label : "Pilih Status"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50,
            background: "var(--neutral-100)", borderRadius: "var(--radius-lg)",
            border: "1px solid var(--neutral-500)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            overflow: "hidden", minWidth: 130,
          }}
          onClick={e => e.stopPropagation()}
        >
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "10px 14px",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                color: opt.color, background: value === opt.value ? opt.bg : "transparent",
                border: "none", cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Peserta { id: string; nama: string; kelas: string; email: string; inisial: string; }
interface AktDetail { id: string; nama: string; programNama: string; jumlahPeserta: number; }

export default function KehadiranPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: a } = useQuery<AktDetail | null>({
    queryKey: ["aktivitas", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: peserta = [], isLoading: pesertaLoading } = useQuery<Peserta[]>({
    queryKey: ["aktivitas", id, "peserta"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/peserta`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
  });

  const { data: existingKehadiran } = useQuery<{ entries: { pesertaId: string; status: string }[] }>({
    queryKey: ["aktivitas", id, "kehadiran"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/kehadiran`);
      return r.ok ? (await r.json()).data : { entries: [] };
    },
  });

  const queryClient = useQueryClient();
  const [data, setData] = useState<Record<string, KehadiranStatus | "">>({});
  const initializedRef = useRef(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [showMassal, setShowMassal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (peserta.length > 0 && existingKehadiran !== undefined && !initializedRef.current) {
      const initial: Record<string, KehadiranStatus | ""> = {};
      for (const p of peserta) {
        const existing = existingKehadiran?.entries?.find(e => e.pesertaId === p.id);
        initial[p.id] = (existing?.status as KehadiranStatus) ?? "";
      }
      setData(initial);
      initializedRef.current = true;
    }
  }, [peserta, existingKehadiran]);

  const filtered = query
    ? peserta.filter(p => p.nama.toLowerCase().includes(query.toLowerCase()))
    : peserta;

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));

  function toggleSelect(pid: string) {
    setSelected(prev => { const next = new Set(prev); if (next.has(pid)) next.delete(pid); else next.add(pid); return next; });
  }
  function toggleAll() {
    if (allSelected) {
      setSelected(prev => { const next = new Set(prev); filtered.forEach(p => next.delete(p.id)); return next; });
    } else {
      setSelected(prev => { const next = new Set(prev); filtered.forEach(p => next.add(p.id)); return next; });
    }
  }
  function setStatus(pid: string, status: KehadiranStatus) {
    setData(prev => ({ ...prev, [pid]: status }));
  }
  function applyMassal(status: KehadiranStatus) {
    setData(prev => { const next = { ...prev }; selected.forEach(pid => { next[pid] = status; }); return next; });
    setSelected(new Set()); setShowMassal(false);
  }

  const terisi = peserta.filter(p => data[p.id] !== "").length;
  const hadir  = peserta.filter(p => data[p.id] === "hadir").length;
  const izin   = peserta.filter(p => data[p.id] === "izin").length;
  const sakit  = peserta.filter(p => data[p.id] === "sakit").length;
  const alpa   = peserta.filter(p => data[p.id] === "tanpa-keterangan").length;

  async function handleSubmit() {
    setLoading(true);
    const entries = peserta.map(p => ({
      pesertaId: p.id,
      status: data[p.id] || "hadir",
    }));
    try {
      const isUpdate = (existingKehadiran?.entries?.length ?? 0) > 0;
      await fetch(`/api/v1/aktivitas/${id}/kehadiran`, {
        method: isUpdate ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      queryClient.invalidateQueries({ queryKey: ["aktivitas", id] });
      setSubmitted(true);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", padding: "var(--space-6)", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Check size={36} color="#15803D" strokeWidth={2.5} />
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", marginBottom: 8 }}>Presensi Tersimpan!</p>
        <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-300)", marginBottom: 32, lineHeight: 1.6 }}>
          <strong style={{ color: "var(--primary-600)" }}>{hadir}</strong> dari {peserta.length} peserta hadir.
        </p>
        <button className="btn btn-primary" onClick={() => router.push(`/presensi?sheet=${id}`)}>Kembali</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} onClick={() => setShowMassal(false)}>
      {/* App bar */}
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)", flexShrink: 0, height: 56 }}>
        <button onClick={() => router.push(`/presensi?sheet=${id}`)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Isi Presensi
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Activity title card */}
        {a && (
          <div style={{ background: "var(--neutral-100)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-2)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.nama}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-300)", lineHeight: 1.4 }}>{a.programNama}</p>
          </div>
        )}

        {/* Stats bar */}
        <div style={{ background: "var(--neutral-100)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-2)" }}>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {[
              { label: "Hadir", count: hadir, color: "var(--primary-600)", bg: "var(--primary-100)" },
              { label: "Izin",  count: izin,  color: "#6b6b6b", bg: "#f2f2f2" },
              { label: "Sakit", count: sakit, color: "#c97a24", bg: "#fff5de" },
              { label: "Alpa",  count: alpa,  color: "#eb0b54", bg: "#ffe6ea" },
            ].map(s => (
              <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, background: s.bg, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: s.color }}>
                {s.label}: {s.count}
              </span>
            ))}
          </div>
        </div>

        {/* Search + massal */}
        <div style={{ background: "var(--neutral-100)", padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-2)", display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-300)" }} />
            <input type="search" className="input" placeholder="Cari peserta" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 38, height: 38, borderRadius: 8 }} />
          </div>
          {selected.size > 0 && (
            <div style={{ position: "relative" }}>
              <button
                onClick={e => { e.stopPropagation(); setShowMassal(p => !p); }}
                style={{ height: 38, padding: "0 12px", borderRadius: 8, background: "var(--primary-600)", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Isi {selected.size} ▾
              </button>
              {showMassal && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, background: "var(--neutral-100)", borderRadius: "var(--radius-lg)", border: "1px solid var(--neutral-500)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: 130 }} onClick={e => e.stopPropagation()}>
                  {STATUS_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => applyMassal(opt.value)} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: opt.color, background: "transparent", border: "none", cursor: "pointer" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Peserta list */}
        {pesertaLoading ? (
          <div style={{ padding: 24, color: "var(--text-300)", textAlign: "center" }}>Memuat peserta...</div>
        ) : (
          <div style={{ background: "var(--neutral-100)", padding: "0 var(--space-4)" }}>
            {/* Select all */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--neutral-400)" }}>
              <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ width: 16, height: 16, cursor: "pointer" }} />
              <p style={{ flex: 1, fontSize: 12, color: "var(--text-300)" }}>Pilih semua ({filtered.length})</p>
            </div>

            {filtered.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--neutral-400)" }}>
                <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} style={{ width: 16, height: 16, cursor: "pointer" }} />
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--primary-600)" }}>
                  {p.inisial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nama}</p>
                  <p style={{ fontSize: 11, color: "var(--text-300)" }}>{p.kelas}</p>
                </div>
                <StatusChip value={data[p.id] ?? ""} onSelect={s => setStatus(p.id, s)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submit CTA — sticky di atas bottom navbar ── */}
      <div style={{ background: "var(--neutral-100)", borderTop: "1px solid var(--neutral-500)", padding: "var(--space-3) var(--space-4)", flexShrink: 0, display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, color: "var(--text-300)" }}>
            <strong style={{ fontFamily: "var(--font-display)", color: "var(--text-100)" }}>{terisi}</strong>
            {" / "}
            <strong style={{ fontFamily: "var(--font-display)", color: "var(--text-100)" }}>{peserta.length}</strong>
            {" peserta diisi"}
          </p>
          {terisi > 0 && (
            <div style={{ marginTop: 4, height: 3, background: "var(--neutral-400)", borderRadius: 100 }}>
              <div style={{ height: "100%", background: "var(--primary-600)", borderRadius: 100, width: `${Math.round((terisi / peserta.length) * 100)}%`, transition: "width 0.2s" }} />
            </div>
          )}
        </div>
        <button
          className="btn btn-primary"
          disabled={terisi === 0}
          onClick={() => setShowConfirm(true)}
          style={{ flexShrink: 0, minWidth: 140, width: "auto" }}
        >
          Submit Presensi
        </button>
      </div>

      {showConfirm && (
        <div className="modal-backdrop" onClick={() => setShowConfirm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-5)" }} />
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", marginBottom: 8 }}>Konfirmasi Presensi</p>
            <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-300)", marginBottom: "var(--space-5)", lineHeight: 1.6 }}>
              Submit presensi untuk <strong>{hadir}</strong> hadir, <strong>{izin}</strong> izin, <strong>{sakit}</strong> sakit, <strong>{alpa}</strong> alpa?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" /> : "Ya, Submit"}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
