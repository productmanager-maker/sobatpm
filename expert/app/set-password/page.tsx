"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check } from "lucide-react";

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["#EF4444", "#F97316", "#EAB308", "#22C55E"];
  const labels = ["Lemah", "Cukup", "Baik", "Kuat"];

  if (!password) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < score ? colors[score - 1] : "#E5E7EB",
            transition: "background 300ms",
          }} />
        ))}
      </div>
      <p style={{ fontSize: 12, color: colors[score - 1] || "var(--text-subtle)" }}>
        {score > 0 ? labels[score - 1] : ""}
      </p>
    </div>
  );
}

export default function SetPasswordPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rules = [
    { label: "Minimal 8 karakter", ok: pw.length >= 8 },
    { label: "Huruf besar (A-Z)", ok: /[A-Z]/.test(pw) },
    { label: "Angka (0-9)", ok: /[0-9]/.test(pw) },
    { label: "Karakter khusus (!@#...)", ok: /[^A-Za-z0-9]/.test(pw) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== confirm) { setError("Kata sandi tidak cocok."); return; }
    if (pw.length < 8) { setError("Kata sandi terlalu pendek."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    router.push("/home");
  }

  return (
    <div className="app-shell">
      <div className="app-scroll" style={{ padding: "24px 24px 40px" }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6, background: "var(--blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "var(--blue)", letterSpacing: 0.5 }}>Sekolah Murid Merdeka</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Buat Kata Sandi Baru</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
          Buat kata sandi baru untuk mengamankan akun Anda.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Kata Sandi Baru</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                className="input-field"
                placeholder="Minimal 8 karakter"
                value={pw}
                onChange={e => { setPw(e.target.value); setError(""); }}
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <StrengthBar password={pw} />
          </div>

          {/* Rules checklist */}
          {pw && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {rules.map(r => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: r.ok ? "#DCFCE7" : "#F3F4F6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Check size={11} color={r.ok ? "#16A34A" : "#D1D5DB"} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 13, color: r.ok ? "#16A34A" : "var(--text-muted)" }}>{r.label}</span>
                </div>
              ))}
            </div>
          )}

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Konfirmasi Kata Sandi</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                className={`input-field ${error ? "error" : ""}`}
                placeholder="Ulangi kata sandi"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(""); }}
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{error}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner" /> : "Buat Kata Sandi"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-subtle)", marginTop: 32 }}>
          © 2026 Sekolah Murid Merdeka. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
