"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function OTPContent() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type") || "first-login";
  const email = params.get("email") || "u***@perusahaan.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  function handleChange(idx: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    setError("");
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      inputRefs.current[5]?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) { setError("Masukkan 6 digit kode verifikasi."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (code === "000000") { setError("Kode verifikasi tidak sesuai."); return; }
    if (type === "first-login") {
      router.push("/set-password");
    } else {
      router.push("/home");
    }
  }

  function handleResend() {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  }

  const isComplete = otp.every(d => d !== "");

  return (
    <div className="app-shell">
      <div className="app-scroll" style={{ padding: "0 24px 40px" }}>
        {/* Back */}
        <div style={{ paddingTop: 16, paddingBottom: 8 }}>
          <button
            onClick={() => router.back()}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontSize: 14, fontWeight: 600, padding: 0 }}
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>

        {/* Lock icon */}
        <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "var(--yellow-light)", border: "3px solid var(--yellow)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" fill="#F5C842" stroke="#D97706" strokeWidth="1.5"/>
              <path d="M8 11V7a4 4 0 018 0v4" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="#D97706"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Verifikasi Akun</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Kami telah mengirimkan kode 6 digit ke<br />
            <strong style={{ color: "var(--text)" }}>{email}</strong>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="otp-grid" style={{ marginBottom: 8 }} onPaste={handlePaste}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              className={`otp-box ${d ? "filled" : ""}`}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
            />
          ))}
        </div>

        {error && (
          <p style={{ fontSize: 13, color: "var(--red)", textAlign: "center", marginBottom: 12 }}>{error}</p>
        )}

        {/* Resend */}
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
          Belum menerima kode?{" "}
          {canResend ? (
            <button onClick={handleResend} style={{ color: "var(--blue)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
              Kirim Ulang
            </button>
          ) : (
            <span style={{ color: "var(--text-subtle)" }}>Kirim Ulang ({resendTimer}s)</span>
          )}
        </p>

        <button
          className="btn-primary"
          onClick={handleVerify}
          disabled={loading || !isComplete}
        >
          {loading ? <span className="spinner" /> : "Verifikasi"}
        </button>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense>
      <OTPContent />
    </Suspense>
  );
}
