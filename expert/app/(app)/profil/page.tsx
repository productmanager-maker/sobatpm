"use client";

import { useRouter } from "next/navigation";
import { Mail, Shield, BookOpen, Star, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MeData {
  id: string;
  nama: string;
  email: string;
  role: string;
  permissions: string[];
  avatarUrl: string | null;
  inisial: string;
  jabatan?: string;
  programCount: number;
  programs: { id: string; nama: string; status: string }[];
}

const ROLE_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  "expert":        { label: "Expert",        color: "var(--primary-700)", bg: "var(--primary-100)" },
  "academic_lead": { label: "Academic Lead", color: "#5d4037",            bg: "#efebe9" },
  "guest":         { label: "Tamu",          color: "#616161",            bg: "#f5f5f5" },
};

const PERM_LABEL: Record<string, string> = {
  "mengajar":            "Isi presensi",
  "menilai":             "Nilai peserta",
  "umpan-balik":         "Tulis catatan / umpan balik",
  "pengumuman":          "Kirim pengumuman",
  "lihat-semua-program": "Lihat semua program",
  "isi-kehadiran-semua": "Override kehadiran",
  "assign-program":      "Assign program",
  "assign-aktivitas":    "Assign aktivitas",
  "reassign-expert":     "Reassign expert",
  "kirim-pengumuman-global": "Pengumuman global",
  "lihat-audit-log":     "Lihat audit log",
  "lihat-semua-peserta": "Lihat semua peserta",
  "override-kehadiran":  "Override kehadiran",
};

export default function ProfilPage() {
  const router = useRouter();

  const { data: me, isLoading } = useQuery<MeData>({
    queryKey: ["me"],
    queryFn: async () => {
      const r = await fetch("/api/v1/me");
      if (!r.ok) return null as unknown as MeData;
      return (await r.json()).data;
    },
    staleTime: 30_000,
  });

  const roleInfo = ROLE_LABEL[me?.role ?? ""] ?? ROLE_LABEL["expert"];

  function handleLogout() {
    document.cookie = "expert_token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* Header */}
      <div style={{ background: "var(--primary-600)", flexShrink: 0 }}>
        <div style={{ padding: "var(--space-3) var(--space-4) var(--space-4)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 2 }}>
            Profil Saya
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            {me ? me.email : "Memuat..."}
          </p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", background: "var(--neutral-400)" }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-12)" }}>
            <span className="spinner" />
          </div>
        ) : me ? (
          <>
            {/* Avatar card */}
            <div style={{ background: "var(--neutral-100)", padding: "var(--space-6) var(--space-4)", borderBottom: "1px solid var(--neutral-400)", textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "var(--primary-100)", border: "3px solid var(--primary-300)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto var(--space-3)",
              }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--primary-700)" }}>
                  {me.inisial}
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-100)", marginBottom: 4 }}>
                {me.nama}
              </p>
              {me.jabatan && (
                <p style={{ fontSize: 12, color: "var(--text-300)", marginBottom: 8 }}>
                  {me.jabatan}
                </p>
              )}
              <span style={{
                display: "inline-block", padding: "3px 12px", borderRadius: 100,
                background: roleInfo.bg, color: roleInfo.color,
                fontSize: 11, fontWeight: 700,
              }}>
                {roleInfo.label}
              </span>
            </div>

            {/* Info rows */}
            <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-400)" }}>
              <InfoRow icon={<Mail size={15} />} label="Email" value={me.email || "—"} />
              <InfoRow icon={<Shield size={15} />} label="Role" value={roleInfo.label} />
              <InfoRow icon={<BookOpen size={15} />} label="Program" value={`${me.programCount} program ditugaskan`} last />
            </div>

            {/* Hak Akses */}
            {me.permissions && me.permissions.length > 0 && (
              <>
                <div style={{ padding: "var(--space-4) var(--space-4) var(--space-2)", background: "var(--neutral-400)" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Hak Akses</p>
                </div>
                <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {me.permissions.map(p => (
                      <span key={p} style={{
                        padding: "4px 12px", borderRadius: 100,
                        background: "var(--primary-100)", color: "var(--primary-700)",
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {PERM_LABEL[p] ?? p}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Program list */}
            {me.programs && me.programs.length > 0 && (
              <>
                <div style={{ padding: "var(--space-4) var(--space-4) var(--space-2)", background: "var(--neutral-400)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Star size={13} color="var(--text-300)" />
                    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Program Saya</p>
                  </div>
                </div>
                <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-400)" }}>
                  {me.programs.map((p, i) => (
                    <div key={p.id} style={{
                      padding: "var(--space-3) var(--space-4)",
                      borderBottom: i < me.programs.length - 1 ? "1px solid var(--neutral-400)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)",
                    }}>
                      <p style={{ fontSize: 13, color: "var(--text-100)", fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.nama}
                      </p>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, flexShrink: 0,
                        background: p.status === "aktif" ? "#e8f5e9" : "var(--neutral-300)",
                        color: p.status === "aktif" ? "#1b5e20" : "var(--text-300)",
                      }}>
                        {p.status === "aktif" ? "Aktif" : "Selesai"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Logout */}
            <div style={{ padding: "var(--space-5) var(--space-4)" }}>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)",
                  padding: "var(--space-3)", borderRadius: "var(--radius-md)",
                  background: "#fff0f0", border: "1px solid #fca5a5", cursor: "pointer",
                  color: "#dc2626", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                }}
              >
                <LogOut size={16} />
                Keluar dari Akun
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: "var(--space-12)", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--text-300)" }}>Data profil tidak tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, last = false }: { icon: React.ReactNode; label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "var(--space-3)",
      padding: "var(--space-3) var(--space-4)",
      borderBottom: last ? "none" : "1px solid var(--neutral-400)",
    }}>
      <span style={{ color: "var(--text-300)", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 12, color: "var(--text-300)", width: 68, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-100)", fontWeight: 500, flex: 1 }}>{value}</span>
    </div>
  );
}
