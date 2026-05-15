"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="app-shell" style={{ background: "var(--neutral-100)" }}>
      <div className="app-scroll" style={{ background: "var(--neutral-100)", padding: "var(--space-5) var(--space-5) var(--space-10)" }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-200)", fontSize: 14, fontWeight: 600,
            fontFamily: "var(--font-body)", padding: 0, marginBottom: "var(--space-8)",
          }}
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        {!sent ? (
          <>
            {/* Icon */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "var(--primary-100)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "var(--space-5)",
            }}>
              <Mail size={32} color="var(--primary-600)" />
            </div>

            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "var(--font-heading-6-size)", color: "var(--text-100)",
              marginBottom: "var(--space-1)",
            }}>
              Lupa Kata Sandi?
            </p>
            <p style={{
              fontSize: 13, color: "var(--text-300)", marginBottom: "var(--space-6)", lineHeight: 1.6,
            }}>
              Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
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
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !email.trim()}
                style={{ marginTop: "var(--space-1)" }}
              >
                {loading ? <span className="spinner" /> : "Kirim Tautan Reset"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "var(--space-8)" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "#DCFCE7",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto var(--space-5)",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "var(--font-heading-6-size)", color: "var(--text-100)",
              marginBottom: "var(--space-2)",
            }}>
              Email Terkirim!
            </p>
            <p style={{ fontSize: 13, color: "var(--text-300)", lineHeight: 1.6, marginBottom: "var(--space-8)" }}>
              Tautan reset kata sandi telah dikirim ke<br />
              <strong style={{ color: "var(--text-100)" }}>{email}</strong>.<br />
              Periksa kotak masuk Anda (cek juga folder spam).
            </p>

            <p style={{ fontSize: 12, color: "var(--text-300)", marginBottom: "var(--space-3)" }}>
              Belum menerima email?
            </p>
            <button
              onClick={() => setSent(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--primary-600)", fontWeight: 700,
                fontFamily: "var(--font-display)", fontSize: 13,
                marginBottom: "var(--space-5)",
              }}
            >
              Kirim ulang
            </button>

            <button
              className="btn btn-outline"
              onClick={() => router.push("/login")}
              style={{ width: "100%" }}
            >
              Kembali ke Halaman Masuk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
