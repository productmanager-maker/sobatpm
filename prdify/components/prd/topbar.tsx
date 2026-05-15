"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "./sidebar-context";

interface TopBarProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
  savedState?: string;
}

export function TopBar({ title, subtitle, breadcrumb, actions, savedState }: TopBarProps) {
  const [initials, setInitials] = useState("IN");
  const { toggle } = useSidebar();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.name) {
          setInitials(data.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase());
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{
      height: 56, background: "#fff",
      borderBottom: "1px solid var(--p-card-border, #EAEAEA)",
      display: "flex", alignItems: "center",
      padding: "0 16px", gap: 12, flexShrink: 0,
      position: "sticky", top: 0, zIndex: 5,
    }}>
      {/* Hamburger — mobile only */}
      <button
        onClick={toggle}
        className="md:hidden"
        style={{
          width: 36, height: 36, borderRadius: 8, border: "none",
          background: "transparent", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--p-text-100)", flexShrink: 0,
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 22 }}>menu</span>
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb && breadcrumb.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--p-text-300)", marginBottom: 2, flexWrap: "wrap" }}>
            {breadcrumb.map((b, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {i > 0 && <span className="material-symbols-rounded" style={{ fontSize: 14 }}>chevron_right</span>}
                <span style={{ color: i === breadcrumb.length - 1 ? "var(--p-text-100)" : "var(--p-text-300)", fontWeight: i === breadcrumb.length - 1 ? 600 : 500 }}>{b}</span>
              </span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 17, color: "var(--p-text-100)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </div>
          {savedState && (
            <span className="prd-saved" style={{ flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: "currentColor", display: "inline-block" }} />
              {savedState}
            </span>
          )}
        </div>
        {subtitle && !breadcrumb && (
          <div style={{ fontSize: 12, color: "var(--p-text-300)", marginTop: 1 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {actions}
        <button
          title="Notifications"
          style={{
            width: 36, height: 36, borderRadius: 8, border: "1px solid transparent",
            background: "transparent", cursor: "pointer", position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--p-text-300)", transition: "background 150ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F2F2F2"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 20 }}>notifications</span>
          <span style={{
            position: "absolute", top: 7, right: 7,
            width: 8, height: 8, borderRadius: 99,
            background: "#EB0B54", border: "2px solid #fff",
          }} />
        </button>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #0519B0, #243BBD)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 12, color: "#fff", flexShrink: 0,
        }}>
          {initials}
        </div>
      </div>
    </div>
  );
}
