"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface NotifApi {
  id: string;
  expertId: string;
  judul: string;
  isi: string;
  dibaca: boolean;
  createdAt: string;
  linkAktivitas: string | null;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

export default function NotifikasiPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: notifList = [] } = useQuery<NotifApi[]>({
    queryKey: ["notifikasi"],
    queryFn: async () => {
      const r = await fetch("/api/v1/notifikasi");
      if (!r.ok) return [];
      return (await r.json()).data ?? [];
    },
  });

  const displayed = filter === "unread" ? notifList.filter(n => !n.dibaca) : notifList;
  const unreadCount = notifList.filter(n => !n.dibaca).length;

  return (
    <div>
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-3) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <button onClick={() => router.back()} style={{ background: "var(--neutral-400)", border: "none", borderRadius: "var(--radius-md)", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Notifikasi</p>
          {unreadCount > 0 && <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)" }}>{unreadCount} belum dibaca</p>}
        </div>
      </div>

      <div style={{ padding: "var(--space-4)" }}>
        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
          {([{ key: "all", label: "Semua" }, { key: "unread", label: "Belum Dibaca" }] as const).map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "6px 14px", borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--font-label-2-size)",
              background: filter === f.key ? "var(--primary-600)" : "transparent",
              color: filter === f.key ? "white" : "var(--text-300)",
              border: filter === f.key ? "none" : "1px solid var(--neutral-500)",
              cursor: "pointer",
            }}>{f.label}</button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} color="var(--neutral-500)" style={{ display: "block", margin: "0 auto" }} />
            <p style={{ marginTop: 12 }}>Tidak ada notifikasi{filter === "unread" ? " belum dibaca" : ""}.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {displayed.map(n => (
              <Link key={n.id} href={`/notifikasi/${n.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "var(--neutral-100)", borderRadius: "var(--radius-xl)",
                  border: `1.5px solid ${!n.dibaca ? "var(--primary-300)" : "var(--neutral-500)"}`,
                  padding: "var(--space-3) var(--space-4)",
                  display: "flex", gap: "var(--space-3)", alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "var(--radius-md)", flexShrink: 0,
                    background: !n.dibaca ? "var(--primary-600)" : "var(--neutral-400)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Bell size={16} color={!n.dibaca ? "white" : "var(--text-300)"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                      <p style={{
                        fontFamily: "var(--font-display)", fontWeight: !n.dibaca ? 700 : 400,
                        fontSize: "var(--font-body-3-size)", color: "var(--text-100)", lineHeight: 1.35,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>{n.judul}</p>
                      {!n.dibaca && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary-600)", flexShrink: 0, marginTop: 4 }} />
                      )}
                    </div>
                    <p style={{ fontSize: "var(--font-label-3-size)", color: "var(--text-300)" }}>{fmtDate(n.createdAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
