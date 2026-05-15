"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function PRDLogo({ size = 44 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: "linear-gradient(135deg, #0519B0 0%, #243BBD 60%, #BA8CD9 130%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: size * 0.48, color: "#fff",
      fontFamily: "'Satoshi', sans-serif", letterSpacing: "-0.04em",
      boxShadow: "0 4px 16px rgba(5,25,176,0.25), inset 0 0 0 1px rgba(255,255,255,0.10)",
      flexShrink: 0,
    }}>P</div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = res.ok || res.status < 500 ? await res.json().catch(() => ({})) : {};
      if (!res.ok) { setError(data.error ?? "Login gagal. Coba lagi."); return; }
      router.push("/prd");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100dvh", width: "100vw",
      background: "radial-gradient(ellipse 700px 500px at 80% 0%, rgba(186,140,217,0.18), transparent 70%), radial-gradient(ellipse 800px 600px at 0% 100%, rgba(5,25,176,0.12), transparent 70%), #F7F7F7",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px",
      fontFamily: "'Satoshi', system-ui, sans-serif",
    }}>
      <div className="prd-login-grid" style={{ alignItems: "center" }}>

        {/* Left: Marketing copy — hidden on mobile */}
        <div className="prd-login-marketing">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <PRDLogo size={44} />
            <div>
              <div style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 900, fontSize: 28, letterSpacing: "-0.02em", color: "#141932" }}>
                Sobat PM<span style={{ color: "#BA8CD9" }}>.</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--p-text-300, #8C92AD)" }}>by SID Product Team Internal Tools</div>
            </div>
          </div>

          <h1 style={{ fontSize: 42, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 16px", maxWidth: 480, color: "#141932", fontWeight: 700 }}>
            Dari dokumen kasar ke <span style={{ color: "#0519B0" }}>PRD siap review</span> — dalam hitungan menit.
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--p-text-200, #4A4F6A)", maxWidth: 460, margin: "0 0 28px" }}>
            AI coach yang membimbing Product Manager menulis 18 sections PRD yang lengkap, terstruktur, dan dipahami oleh Stakeholder, UI/UX, dan Tech.
          </p>

          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            {["12+ PRDs published", "4 PMs aktif", "86 avg quality"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--p-text-200)", fontWeight: 600 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 16, color: "#1F8A5B" }}>check_circle</span>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login form */}
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid #EAEAEA",
          boxShadow: "0 8px 32px rgba(20,25,50,0.10)",
          padding: "28px 24px", maxWidth: 420, width: "100%",
        }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, margin: "0 0 4px", fontWeight: 700, color: "#141932" }}>Sign in</h2>
            <div style={{ fontSize: 13, color: "var(--p-text-300)" }}>Masuk dengan akun Sekolahmu kamu</div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--p-text-100)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="kamu@sekolahmu.co.id"
                required
                style={{
                  width: "100%", padding: "10px 12px", fontSize: 14,
                  border: "1px solid #DCDCDC", borderRadius: 8,
                  background: "#fff", color: "#141932",
                  fontFamily: "'Satoshi', sans-serif",
                  outline: "none", transition: "border-color 150ms",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "#0519B0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(5,25,176,0.12)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#DCDCDC"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--p-text-100)" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%", padding: "10px 40px 10px 12px", fontSize: 14,
                    border: "1px solid #DCDCDC", borderRadius: 8,
                    background: "#fff", color: "#141932",
                    fontFamily: "'Satoshi', sans-serif",
                    outline: "none", transition: "border-color 150ms",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#0519B0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(5,25,176,0.12)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#DCDCDC"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "var(--p-text-300)", display: "flex", padding: 4,
                  }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 13, color: "#C40048", background: "#FFE6EA", border: "1px solid #FFB0C0", borderRadius: 8, padding: "10px 12px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: loading ? "#E0E0E0" : "#0519B0",
                color: loading ? "#999" : "#fff",
                border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer",
                fontSize: 16, fontWeight: 700, fontFamily: "'Satoshi', sans-serif",
                transition: "background 150ms",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#243BBD"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#0519B0"; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(153,153,153,0.4)", borderTopColor: "#999", borderRadius: 99, animation: "prd-spin .7s linear infinite", display: "inline-block" }} />
                  Memverifikasi…
                </>
              ) : (
                <>
                  Masuk
                  <span className="material-symbols-rounded" style={{ fontSize: 18 }}>arrow_forward</span>
                </>
              )}
            </button>

            <div style={{ fontSize: 12, color: "var(--p-text-300)", textAlign: "center" }}>
              Akun dibuat oleh admin. Hubungi Ican
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
