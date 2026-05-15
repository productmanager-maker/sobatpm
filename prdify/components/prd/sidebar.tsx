"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "./sidebar-context";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
}

interface RecentPRD {
  id: string;
  title: string;
  status: string;
}

const baseNavItems = [
  { href: "/prd", icon: "description", label: "My PRDs", badge: null as string | null, adminOnly: false, exact: false },
  { href: "/prd/brain", icon: "neurology", label: "Brain", badge: null, adminOnly: false, exact: true },
  { href: "/prd/critique", icon: "star_rate_half", label: "Critique", badge: null, adminOnly: false, exact: true },
  { href: "/prd/users", icon: "group", label: "Users", badge: null, adminOnly: true, exact: true },
];

const statusColors: Record<string, string> = {
  Published: "#1F8A5B",
  Generated: "#137A7A",
  "In Progress": "#1B4ED8",
  Draft: "#8C92AD",
};

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [recentPRDs, setRecentPRDs] = useState<RecentPRD[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.id) setSession(data); })
      .catch(() => {});

    fetch("/api/prd")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setRecentPRDs(data.slice(0, 3).map((p: { id: string; title: string; status: string }) => ({
            id: p.id,
            title: p.title,
            status: p.status,
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    close();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || (
      pathname.startsWith("/prd") &&
      !pathname.includes("/brain") &&
      !pathname.includes("/critique") &&
      !pathname.includes("/settings") &&
      !pathname.includes("/users")
    );
  };

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const navItems = baseNavItems.filter(item => !item.adminOnly || session?.role === "ADMIN");

  const initials = session
    ? session.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "..";

  const PRDLogo = () => (
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: "linear-gradient(135deg, #0519B0 0%, #243BBD 60%, #BA8CD9 130%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: 16, color: "#fff",
      fontFamily: "'Satoshi', sans-serif", letterSpacing: "-0.04em",
      boxShadow: "0 4px 16px rgba(5,25,176,0.25), inset 0 0 0 1px rgba(255,255,255,0.10)",
      flexShrink: 0,
    }}>S</div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={close}
      />

      {/* Sidebar */}
      <div
        className={`prd-sidebar-el${isOpen ? " open" : ""} fixed left-0 top-0 h-full flex flex-col z-50`}
        style={{ width: 240, background: "var(--p-sidebar-bg, #000017)" }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 18px 18px" }}>
          <PRDLogo />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", fontFamily: "'Satoshi', sans-serif" }}>
            Sobat PM<span style={{ color: "#BA8CD9" }}>.</span>
          </div>
          {/* Mobile close button */}
          <button
            onClick={close}
            className="md:hidden ml-auto"
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", padding: 4 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Workspace nav */}
        <div style={{ color: "rgba(255,255,255,0.32)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 18px 6px", marginTop: 8 }}>
          Workspace
        </div>
        <nav style={{ padding: "4px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ href, icon, label, badge, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "9px 12px",
                  borderRadius: 8,
                  color: active ? "#fff" : "rgba(255,255,255,0.62)",
                  background: active ? "var(--p-sidebar-active, #0519B0)" : "transparent",
                  boxShadow: active ? "0 4px 12px rgba(5,25,176,0.4)" : "none",
                  fontSize: 14, fontWeight: 600, textDecoration: "none",
                  transition: "background 120ms, color 120ms",
                  userSelect: "none",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.62)"; }}}
              >
                <span className="material-symbols-rounded" style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{ background: active ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)", color: active ? "#fff" : "rgba(255,255,255,0.72)", fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 18px" }} />

        {/* Recent PRDs */}
        {recentPRDs.length > 0 && (
          <>
            <div style={{ color: "rgba(255,255,255,0.32)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 18px 6px" }}>
              Recent
            </div>
            <nav style={{ padding: "4px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
              {recentPRDs.map(p => (
                <Link
                  key={p.id}
                  href={`/prd/${p.id}/coach`}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "7px 12px",
                    borderRadius: 8, color: "rgba(255,255,255,0.62)",
                    fontSize: 13, fontWeight: 500, textDecoration: "none",
                    transition: "background 120ms, color 120ms",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.62)"; }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: 99, flexShrink: 0,
                    background: statusColors[p.status.replace("_", " ")] ?? "#8C92AD",
                  }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{p.title}</span>
                </Link>
              ))}
            </nav>
          </>
        )}

        {/* Bottom */}
        <div style={{ marginTop: "auto", padding: 12 }}>
          <Link
            href="/prd/settings"
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "9px 12px",
              borderRadius: 8, color: "rgba(255,255,255,0.62)",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              transition: "background 120ms, color 120ms", marginBottom: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.62)"; }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 20 }}>settings</span>
            <span>Settings</span>
          </Link>

          {/* User block */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: 8,
            borderRadius: 10, background: "rgba(255,255,255,0.04)", cursor: "default",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #0519B0, #243BBD)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 12, color: "#fff", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session?.name ?? "Loading…"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.50)", fontSize: 11, fontWeight: 500 }}>
                {session?.email?.split("@")[0]} · {session?.role ?? ""}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#EB0B54"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)"; }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
