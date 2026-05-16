"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { EXPERTS } from "@/lib/master-seed";

const TEST_ACCOUNTS = [
  { nama: "Mega Kurnia",       email: "mega.kurnia@sekolahmu.co.id",      roleLabel: "Expert Penuh",   kasus: "15 program, 1 semester, 30 peserta di prog-1" },
  { nama: "Reza Firmansyah",   email: "reza.firmansyah@sekolahmu.co.id",  roleLabel: "Expert Baru",    kasus: "2 program ringan, state kosong, notifikasi baru" },
  { nama: "Diana Puspita",     email: "diana.puspita@sekolahmu.co.id",    roleLabel: "Expert Penilai", kasus: "3 program, penilaian menumpuk, ada overdue" },
  { nama: "Sinta Ariani",      email: "sinta.ariani@sekolahmu.co.id",     roleLabel: "Academic Lead",  kasus: "Lihat semua program, reassign, audit log" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAccounts, setShowAccounts] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email dan kata sandi wajib diisi."); return; }
    setLoading(true);

    if (email.includes("baru") || password === "new") {
      setLoading(false);
      router.replace("/otp?type=first-login&email=" + encodeURIComponent(email));
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const expert = EXPERTS.find(e => e.email.toLowerCase() === normalizedEmail)
      ?? { id: "exp-guest", nama: "Tamu", email: normalizedEmail, role: "guest" };
    const token = `dummy-token-${expert.id}`;
    document.cookie = `expert_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;

    if (expert.role === "guest") {
      sessionStorage.setItem("showGuestPopup", "1");
    }
    router.replace("/presensi");
  }

  return (
    <div className="app-shell" style={{ background: "var(--neutral-100)" }}>
      <div className="app-scroll" style={{ background: "var(--neutral-100)", padding: "var(--space-7) var(--space-5)" }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "var(--space-8)" }}>
          <div style={{ marginBottom: "var(--space-3)" }}>
            <Image
              src="/logo.png"
              alt="Sekolah Murid Merdeka"
              width={72}
              height={56}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 15, color: "var(--text-100)", letterSpacing: 0.5,
          }}>
            Sekolah Murid Merdeka
          </p>
          <p style={{ fontSize: 12, color: "var(--text-300)", marginTop: 2 }}>Platform Expert</p>
        </div>

        {/* Heading */}
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "var(--font-heading-6-size)", color: "var(--text-100)", marginBottom: "var(--space-1)",
        }}>
          Masuk
        </p>
        <p style={{ fontSize: 13, color: "var(--text-300)", marginBottom: "var(--space-6)", lineHeight: 1.5 }}>
          Gunakan akun yang sudah didaftarkan oleh Admin.
        </p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Email */}
          <div>
            <label style={{
              display: "block", fontFamily: "var(--font-body)", fontWeight: 600,
              fontSize: 13, color: "var(--text-100)", marginBottom: "var(--space-2)",
            }}>
              Email
            </label>
            <input
              type="email"
              className="input"
              placeholder="email@perusahaan.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
              <label style={{
                fontFamily: "var(--font-body)", fontWeight: 600,
                fontSize: 13, color: "var(--text-100)",
              }}>
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                style={{
                  fontSize: 13, fontWeight: 600, color: "var(--primary-600)",
                  background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
                }}
              >
                Lupa Kata Sandi?
              </button>
            </div>
            <div className="input-wrap">
              <input
                type={showPw ? "text" : "password"}
                className={`input ${error ? "error" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="input-icon-right">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Ingat saya */}
          <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
            <div
              onClick={() => setRememberMe(p => !p)}
              style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                border: `2px solid ${rememberMe ? "var(--primary-600)" : "var(--neutral-600)"}`,
                background: rememberMe ? "var(--primary-600)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {rememberMe && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: "var(--text-200)" }}>Ingat saya</span>
          </label>

          {/* Error */}
          {error && (
            <div style={{
              background: "var(--danger-100)", border: "1px solid var(--danger-200)",
              borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)",
            }}>
              <p style={{ fontSize: 13, color: "var(--danger-600)" }}>{error}</p>
            </div>
          )}

          {/* Cloudflare CAPTCHA placeholder */}
          <div style={{
            border: "1px solid var(--neutral-500)", borderRadius: "var(--radius-md)",
            padding: "var(--space-3) var(--space-4)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--neutral-200)",
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", cursor: "pointer" }}>
              <div style={{
                width: 24, height: 24, borderRadius: 4, flexShrink: 0,
                border: "2px solid var(--neutral-600)", background: "transparent",
              }} />
              <span style={{ fontSize: 13, color: "var(--text-200)" }}>Saya bukan robot</span>
            </label>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 32, height: 32, background: "var(--neutral-300)", borderRadius: 4, marginBottom: 2 }} />
              <p style={{ fontSize: 9, color: "var(--text-300)" }}>reCAPTCHA</p>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: "var(--space-1)" }}
          >
            {loading ? <span className="spinner" /> : "Masuk"}
          </button>
        </form>

        {/* Test accounts collapsible */}
        <div style={{ marginTop: "var(--space-8)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-500)", overflow: "hidden" }}>
          <button
            type="button"
            onClick={() => setShowAccounts(p => !p)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "var(--space-3) var(--space-4)", background: "var(--neutral-200)",
              border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-200)" }}>Akun Uji Coba</span>
            {showAccounts ? <ChevronUp size={14} color="var(--text-300)" /> : <ChevronDown size={14} color="var(--text-300)" />}
          </button>
          {showAccounts && (
            <div style={{ background: "var(--neutral-100)", padding: "var(--space-4)" }}>
              {TEST_ACCOUNTS.map((a, i) => (
                <div key={a.email} style={{ marginBottom: i < TEST_ACCOUNTS.length - 1 ? "var(--space-4)" : 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-100)", marginBottom: 2 }}>
                    {a.nama}
                    <span style={{ fontWeight: 400, color: "var(--text-300)", marginLeft: 6 }}>{a.roleLabel}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setEmail(a.email)}
                    style={{
                      fontSize: 12, color: "var(--primary-600)", background: "none", border: "none",
                      cursor: "pointer", fontFamily: "var(--font-body)", padding: 0, textAlign: "left",
                    }}
                  >
                    {a.email}
                  </button>
                  <p style={{ fontSize: 11, color: "var(--text-300)", marginTop: 2 }}>{a.kasus}</p>
                </div>
              ))}
              <p style={{ fontSize: 10, color: "var(--text-300)", marginTop: "var(--space-3)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--neutral-400)" }}>
                Password bebas (tidak divalidasi)
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: "var(--space-6)", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--text-300)" }}>
            © 2026 Sekolah Murid Merdeka. All Rights Reserved.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-4)", marginTop: "var(--space-2)", flexWrap: "wrap" }}>
            {["Hubungi Kami", "Syarat & Ketentuan", "Kebijakan Privasi"].map(t => (
              <span key={t} style={{ fontSize: 11, color: "var(--primary-600)", cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
