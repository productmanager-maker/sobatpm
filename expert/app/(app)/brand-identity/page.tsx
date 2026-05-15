"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const COLORS = [
  { name: "Primary 600",   hex: "#0519B0", label: "Brand utama — tombol, ikon aktif, highlight" },
  { name: "Primary 100",   hex: "#E8EAFE", label: "Background ringan — chip, badge, fill sekunder" },
  { name: "Danger 600",    hex: "#EB0B54", label: "Error, status kritis, alert merah" },
  { name: "Neutral 100",   hex: "#FFFFFF", label: "Background halaman & card" },
  { name: "Neutral 500",   hex: "#E5E7EB", label: "Border & divider" },
  { name: "Neutral 800",   hex: "#1F2937", label: "Teks utama" },
  { name: "Success",       hex: "#15803D", label: "Konfirmasi berhasil, kehadiran hadir" },
  { name: "Gamboge",       hex: "#C97A24", label: "Warning, belum selesai, izin" },
  { name: "Teal",          hex: "#008387", label: "Selesai tepat waktu" },
];

export default function BrandIdentityPage() {
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <div style={{
        background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)",
        padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center",
        gap: "var(--space-3)", flexShrink: 0, height: 56,
      }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>Brand Identity</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {/* Logo */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-200)", marginBottom: "var(--space-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Logo
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", background: "#f5f5f5" }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#f5f5f5" />
                  <path d="M16 23 Q32 12 48 23 Q32 34 16 23Z" fill="#0519B0" />
                  <path d="M16 41 Q32 30 48 41 Q32 52 16 41Z" fill="#F5A623" />
                </svg>
              </div>
              <p style={{ fontSize: 10, color: "var(--text-300)" }}>Circular</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden" }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#f5f5f5" />
                  <path d="M10 14 Q20 7 30 14 Q20 21 10 14Z" fill="#0519B0" />
                  <path d="M10 26 Q20 19 30 26 Q20 33 10 26Z" fill="#F5A623" />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-100)", letterSpacing: 0.5 }}>CORPORATE IPSUM</p>
                <p style={{ fontSize: 11, color: "var(--text-300)" }}>Platform Expert</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-200)", marginBottom: "var(--space-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Tipografi
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[
              { name: "Satoshi", role: "Display / Heading", family: "var(--font-display)", sample: "Aa Bb Cc 123" },
              { name: "Inter",   role: "Body / Label",      family: "var(--font-body)",    sample: "Aa Bb Cc 123" },
            ].map(f => (
              <div key={f.name} style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-lg)", padding: "var(--space-3) var(--space-4)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2 }}>{f.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-300)" }}>{f.role}</p>
                </div>
                <p style={{ fontFamily: f.family, fontSize: 18, color: "var(--text-200)" }}>{f.sample}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-200)", marginBottom: "var(--space-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Palet Warna
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {COLORS.map(c => (
              <div key={c.hex} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: c.hex, flexShrink: 0, border: "1px solid rgba(0,0,0,0.08)" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)", marginBottom: 2 }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-300)" }}>{c.hex} — {c.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Design System */}
        <div style={{ background: "var(--primary-100)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--primary-600)", marginBottom: "var(--space-2)" }}>LERN Design System</p>
          <p style={{ fontSize: 13, color: "var(--primary-600)", lineHeight: 1.6, opacity: 0.85 }}>
            Semua komponen dan token di Platform Expert menggunakan LERN DS. Token tersedia sebagai CSS custom properties di <code style={{ fontFamily: "monospace", fontSize: 12 }}>styles/tokens.css</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
