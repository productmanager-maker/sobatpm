"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_TABS = [
  {
    href: "/presensi",
    label: "Presensi",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={active ? "var(--primary-600)" : "var(--text-300)"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M9 16l2 2 4-4"/>
      </svg>
    ),
  },
  {
    href: "/penilaian",
    label: "Penilaian",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={active ? "var(--primary-600)" : "var(--text-300)"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    href: "/program",
    label: "Program",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={active ? "var(--primary-600)" : "var(--text-300)"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
  {
    href: "/peserta",
    label: "Peserta",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={active ? "var(--primary-600)" : "var(--text-300)"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: "/profil",
    label: "Profil",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke={active ? "var(--primary-600)" : "var(--text-300)"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

const TEST_ACCOUNTS = [
  { nama: "Mega Kurnia",     email: "mega.kurnia@sekolahmu.co.id",     roleLabel: "Expert Penuh",   roleDesc: "Akses mengajar + menilai, 15 program" },
  { nama: "Reza Firmansyah", email: "reza.firmansyah@sekolahmu.co.id", roleLabel: "Expert Baru",    roleDesc: "Akses mengajar, 2 program ringan" },
  { nama: "Diana Puspita",   email: "diana.puspita@sekolahmu.co.id",   roleLabel: "Expert Penilai", roleDesc: "Akses menilai saja, 3 program" },
  { nama: "Sinta Ariani",    email: "sinta.ariani@sekolahmu.co.id",    roleLabel: "Academic Lead",  roleDesc: "Melihat semua program, intervensi, audit log" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showGuestPopup, setShowGuestPopup] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("showGuestPopup") === "1") {
      sessionStorage.removeItem("showGuestPopup");
      setShowGuestPopup(true);
      return;
    }
    // fallback: check on direct page load (e.g. browser refresh)
    fetch("/expert/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.data?.expert?.role === "guest") {
          setShowGuestPopup(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="app-shell">
      <div className="app-scroll">{children}</div>

      <nav className="bottom-nav">
        {NAV_TABS.map(tab => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link key={tab.href} href={tab.href} className={`bottom-nav-item${active ? " active" : ""}`}>
              <div className="bottom-nav-icon-wrap">
                {tab.icon(active)}
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600 }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Unknown user popup */}
      {showGuestPopup && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}>
          <div style={{
            background: "var(--neutral-100)", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            width: "100%", maxWidth: 480, padding: "var(--space-6) var(--space-5)",
            maxHeight: "80vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)" }}>
                  Akun tidak dikenali
                </p>
                <p style={{ fontSize: 13, color: "var(--text-300)", marginTop: 4, lineHeight: 1.5 }}>
                  Akun Anda belum ditugaskan ke program manapun. Gunakan salah satu akun uji coba di bawah untuk menjelajahi platform.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuestPopup(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, marginLeft: "var(--space-3)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {TEST_ACCOUNTS.map(a => (
                <div key={a.email} style={{
                  background: "var(--neutral-200)", borderRadius: "var(--radius-md)",
                  padding: "var(--space-3) var(--space-4)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text-100)" }}>{a.nama}</p>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 8px",
                      borderRadius: "var(--radius-full)", background: "var(--primary-100)", color: "var(--primary-700)",
                    }}>
                      {a.roleLabel}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-300)", marginBottom: 6 }}>{a.roleDesc}</p>
                  <p style={{ fontSize: 12, color: "var(--primary-600)", fontFamily: "monospace" }}>{a.email}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-5)" }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => router.push("/login")}
              >
                Masuk dengan akun lain
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowGuestPopup(false)}
              >
                Lanjutkan melihat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
