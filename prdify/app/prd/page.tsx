"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/prd/topbar";
import Link from "next/link";

type PRDStatus = "DRAFT" | "IN_PROGRESS" | "GENERATED" | "PUBLISHED";

interface PRD {
  id: string;
  title: string;
  status: PRDStatus;
  quality: number | null;
  author: string;
  authorId?: string;
  updatedAt: string;
  currentStep: string;
  sectionsDone?: number;
  sectionsTotal?: number;
}

interface SessionUser {
  id: string;
  name: string;
}

const statusMap: Record<PRDStatus, { label: string; dotColor: string; bg: string; text: string; border: string }> = {
  DRAFT:       { label: "Draft",       dotColor: "#8C92AD", bg: "#F2F2F2",                  text: "#4A4F6A",  border: "#DCDCDC" },
  IN_PROGRESS: { label: "In Progress", dotColor: "#1B4ED8", bg: "var(--p-info-bg,#E6ECFB)",  text: "#1B4ED8",  border: "var(--p-info-bd,#C2CDF1)" },
  GENERATED:   { label: "Generated",   dotColor: "#137A7A", bg: "var(--p-teal-bg,#DDEFEF)",  text: "#137A7A",  border: "var(--p-teal-bd,#A4D2D2)" },
  PUBLISHED:   { label: "Published",   dotColor: "#1F8A5B", bg: "var(--p-success-bg,#E6F4ED)",text: "#1F8A5B", border: "var(--p-success-bd,#BFE3D0)" },
};

function StatusBadge({ status }: { status: PRDStatus }) {
  const s = statusMap[status] ?? statusMap.DRAFT;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      height: 22, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: s.dotColor, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function QualityRing({ score }: { score: number | null }) {
  if (score == null) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 99,
        border: "1.5px dashed #C0C0C0",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#999", fontSize: 11,
      }}>—</div>
    );
  }
  const size = 36, stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const fillColor = score >= 85 ? "#1F8A5B" : score >= 70 ? "#B07112" : "#EB0B54";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg className="prd-qring" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="prd-qring-track" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          stroke={fillColor} strokeDasharray={`${c} ${c}`} strokeDashoffset={off}
          strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 10, color: "#141932", letterSpacing: "-0.02em",
      }}>
        {score}
      </div>
    </div>
  );
}

function Sparkline({ values, color = "#0519B0", width = 72, height = 24 }: { values: number[]; color?: string; width?: number; height?: number }) {
  if (!values || values.length < 2) return null;
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`).join(" ");
  const last = values[values.length - 1];
  const lastY = height - ((last - min) / range) * height;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={width} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

function StatCard({ label, value, icon, iconBg, iconColor, delta, deltaDir, spark }:
  { label: string; value: string | number; icon: string; iconBg: string; iconColor: string; delta?: string; deltaDir?: "up" | "down" | "flat"; spark?: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--p-card-border, #EAEAEA)",
      borderRadius: 14, padding: 18,
      display: "flex", flexDirection: "column", gap: 12,
      position: "relative", overflow: "hidden",
      transition: "transform 200ms, box-shadow 200ms",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(20,25,50,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: iconColor }}>{icon}</span>
        </div>
        {delta && (
          <span style={{
            fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 2,
            color: deltaDir === "up" ? "#1F8A5B" : deltaDir === "down" ? "#C40048" : "#8C92AD",
          }}>
            {deltaDir === "up" && <span className="material-symbols-rounded" style={{ fontSize: 14 }}>arrow_upward</span>}
            {deltaDir === "down" && <span className="material-symbols-rounded" style={{ fontSize: 14 }}>arrow_downward</span>}
            {delta}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 32, fontWeight: 700, color: "#141932", lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#8C92AD", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{label}</div>
      </div>
      {spark && (
        <div style={{ position: "absolute", right: 12, bottom: 12, opacity: 0.9 }}>{spark}</div>
      )}
    </div>
  );
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffH < 1) return "Baru saja";
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return "Kemarin";
  if (diffD < 7) return `${diffD} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function getPRDLink(prd: PRD): string {
  switch (prd.currentStep) {
    case "BRIEF_COACH": return `/prd/${prd.id}/coach`;
    case "CONTEXT_SCAN": return `/prd/${prd.id}/context`;
    case "DRAFT_PRD": return `/prd/${prd.id}/draft`;
    case "PUBLISH": return `/prd/${prd.id}/publish`;
    default: return `/prd/${prd.id}/coach`;
  }
}

function UserAvatar({ name, isSelf, size = 28 }: { name: string; isSelf: boolean; size?: number }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: isSelf ? "linear-gradient(135deg, #0519B0, #243BBD)" : "#E6EAF8",
      color: isSelf ? "#fff" : "#0519B0",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

const SPARK_DATA = {
  total: [4, 5, 6, 6, 8, 9, 10, 11, 12],
  inProg: [3, 5, 4, 6, 7, 6, 8, 7, 7],
  gen: [1, 1, 2, 2, 3, 3, 3, 4, 4],
  pub: [0, 0, 0, 0, 1, 1, 1, 1, 1],
  avg: [78, 79, 80, 82, 81, 83, 84, 85, 86],
};

export default function PRDDashboard() {
  const router = useRouter();
  const [prds, setPRDs] = useState<PRD[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<PRD | null>(null);
  const [renameTarget, setRenameTarget] = useState<PRD | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameSaving, setRenameSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.ok ? r.json() : null).then(d => { if (d?.id) setSession(d); }).catch(() => {});
    fetchPRDs();
  }, []);

  async function fetchPRDs() {
    setLoading(true);
    try {
      const res = await fetch("/api/prd");
      if (res.ok) setPRDs(await res.json());
    } catch {}
    finally { setLoading(false); }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/prd/${id}`, { method: "DELETE" });
      setPRDs(prev => prev.filter(p => p.id !== id));
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  }

  async function handleRename() {
    if (!renameTarget || !renameValue.trim()) return;
    setRenameSaving(true);
    try {
      const res = await fetch(`/api/prd/${renameTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: renameValue.trim() }),
      });
      if (res.ok) {
        setPRDs(prev => prev.map(p => p.id === renameTarget.id ? { ...p, title: renameValue.trim() } : p));
        setRenameTarget(null);
      }
    } finally { setRenameSaving(false); }
  }

  const stats = useMemo(() => {
    const total = prds.length;
    const inProg = prds.filter(p => p.status === "IN_PROGRESS" || p.status === "DRAFT").length;
    const gen = prds.filter(p => p.status === "GENERATED").length;
    const pub = prds.filter(p => p.status === "PUBLISHED").length;
    const qs = prds.filter(p => p.quality != null).map(p => p.quality!);
    const avg = qs.length ? Math.round(qs.reduce((a, b) => a + b, 0) / qs.length) : 0;
    return { total, inProg, gen, pub, avg };
  }, [prds]);

  const filtered = prds.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchTab = activeTab === "all" || (activeTab === "review" && (p.status === "GENERATED" || p.status === "PUBLISHED")) || activeTab === "all";
    return matchSearch && matchStatus && matchTab;
  });

  const tabs = [
    { value: "all", label: "PRD", count: prds.length },
    { value: "review", label: "Need Review", count: prds.filter(p => p.status === "GENERATED").length },
  ];

  const firstName = session?.name?.split(" ")[0] ?? "PM";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <TopBar
        title="My PRDs"
        subtitle={`Workspace SID Product Team`}
        actions={
          <Link href="/prd/new" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 36, padding: "0 16px", borderRadius: 8,
            background: "#0519B0", color: "#fff",
            fontSize: 14, fontWeight: 700, textDecoration: "none",
            fontFamily: "'Satoshi', sans-serif",
          }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>add</span>
            New PRD
          </Link>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }} className="prd-content-pad">

        {/* Welcome banner */}
        <div style={{
          background: "radial-gradient(ellipse 600px 200px at 80% 0%, rgba(186,140,217,0.20), transparent 60%), radial-gradient(ellipse 800px 300px at -10% 100%, rgba(36,59,189,0.40), transparent 60%), linear-gradient(135deg, #000563 0%, #0519B0 100%)",
          borderRadius: 18, padding: "20px 20px", color: "#fff",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20, position: "relative", overflow: "hidden",
          flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.015em", margin: "0 0 4px", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
              Selamat datang, {firstName} <span style={{ display: "inline-block", transform: "rotate(15deg)" }}>👋</span>
            </h1>
            <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, fontWeight: 500 }}>
              Apa yang sedang kamu build hari ini?
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/prd/brain" className="prd-hide-mobile" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              height: 36, padding: "0 14px", borderRadius: 8,
              background: "rgba(255,255,255,0.10)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>neurology</span>
              Brain Settings
            </Link>
            <Link href="/prd/new" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              height: 36, padding: "0 14px", borderRadius: 8,
              background: "#fff", color: "#0519B0",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>add</span>
              New PRD
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="prd-stat-grid">
          <StatCard label="Total PRDs" value={stats.total} icon="description" iconBg="#E6EAF8" iconColor="#0519B0" delta="+3 vs last week" deltaDir="up"
            spark={<Sparkline values={SPARK_DATA.total} color="#0519B0" />} />
          <StatCard label="In Progress" value={stats.inProg} icon="schedule" iconBg="#E6ECFB" iconColor="#1B4ED8" delta="+1" deltaDir="up"
            spark={<Sparkline values={SPARK_DATA.inProg} color="#1B4ED8" />} />
          <StatCard label="Generated" value={stats.gen} icon="auto_awesome" iconBg="#DDEFEF" iconColor="#137A7A" delta="+2" deltaDir="up"
            spark={<Sparkline values={SPARK_DATA.gen} color="#137A7A" />} />
          <StatCard label="Published" value={stats.pub} icon="public" iconBg="#E6F4ED" iconColor="#1F8A5B" delta="0 vs last" deltaDir="flat"
            spark={<Sparkline values={SPARK_DATA.pub} color="#1F8A5B" />} />
          <StatCard label="Avg Quality" value={stats.avg || "—"} icon="workspace_premium" iconBg="#FCF1DC" iconColor="#B07112" delta="+2 pt" deltaDir="up"
            spark={<Sparkline values={SPARK_DATA.avg} color="#B07112" />} />
        </div>

        {/* Tabs + filters */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "inline-flex", gap: 4, padding: 4, background: "#EFEFEF", borderRadius: 10 }}>
            {tabs.map(t => (
              <button key={t.value} onClick={() => setActiveTab(t.value)} style={{
                padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600,
                color: activeTab === t.value ? "#141932" : "#4A4F6A",
                background: activeTab === t.value ? "#fff" : "transparent",
                boxShadow: activeTab === t.value ? "0 1px 2px rgba(20,25,50,0.08)" : "none",
                border: "none", cursor: "pointer", transition: "all 120ms",
                fontFamily: "'Satoshi', sans-serif",
              }}>
                {t.label}
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{t.count}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <span className="material-symbols-rounded" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#8C92AD" }}>search</span>
              <input
                placeholder="Search PRDs…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  paddingLeft: 36, paddingRight: 12, height: 36, width: 200,
                  border: "1px solid #DCDCDC", borderRadius: 8, fontSize: 14,
                  background: "#fff", color: "#141932", outline: "none",
                  fontFamily: "'Satoshi', sans-serif",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "#0519B0"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#DCDCDC"; }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="prd-select"
              style={{ width: 140, height: 36 }}
            >
              <option value="all">All status</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="GENERATED">Generated</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid var(--p-card-border, #EAEAEA)", borderRadius: 12, overflow: "hidden", overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <span className="material-symbols-rounded" style={{ fontSize: 32, color: "#DCDCDC", animation: "prd-spin 1s linear infinite", display: "inline-block" }}>refresh</span>
              <div style={{ color: "#8C92AD", fontSize: 14, marginTop: 12 }}>Loading PRDs…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 64, textAlign: "center" }}>
              <span className="material-symbols-rounded" style={{ fontSize: 40, color: "#DCDCDC", display: "block", marginBottom: 12 }}>description</span>
              <div style={{ color: "#4A4F6A", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Belum ada PRD</div>
              <div style={{ color: "#8C92AD", fontSize: 13, marginBottom: 20 }}>Buat PRD pertamamu sekarang!</div>
              <Link href="/prd/new" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                height: 36, padding: "0 16px", borderRadius: 8,
                background: "#0519B0", color: "#fff",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
              }}>
                <span className="material-symbols-rounded" style={{ fontSize: 18 }}>add</span>
                New PRD
              </Link>
            </div>
          ) : (
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "separate", borderSpacing: 0, fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#FAFAFA" }}>
                  {["Title", "Quality", "Status", "Sections", "Author", "Last Edited", ""].map((h, i) => (
                    <th key={i} style={{
                      textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: "0.06em", color: "#8C92AD",
                      padding: "12px 16px", borderBottom: "1px solid var(--p-card-border, #EAEAEA)",
                      width: i === 0 ? "32%" : i === 6 ? 56 : i === 3 ? 100 : i === 1 ? 80 : "auto",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(prd => (
                  <tr
                    key={prd.id}
                    onMouseEnter={() => setHoverRow(prd.id)}
                    onMouseLeave={() => setHoverRow(null)}
                    onClick={() => router.push(getPRDLink(prd))}
                    style={{
                      cursor: "pointer",
                      background: hoverRow === prd.id ? "#FAFAFA" : "transparent",
                      transition: "background 120ms",
                    }}
                  >
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border, #EAEAEA)", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="prd-tag">PRD</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#141932" }}>{prd.title}</div>
                          <div style={{ fontSize: 12, color: "#8C92AD", marginTop: 2 }}>
                            {prd.currentStep?.replace("_", " ").toLowerCase().replace(/^./, c => c.toUpperCase())}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)", verticalAlign: "middle" }}>
                      <QualityRing score={prd.quality} />
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)", verticalAlign: "middle" }}>
                      <StatusBadge status={prd.status} />
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)", verticalAlign: "middle" }}>
                      {prd.sectionsTotal ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 56, height: 4, borderRadius: 99, background: "#EFEFEF", overflow: "hidden" }}>
                              <div style={{
                                width: `${((prd.sectionsDone ?? 0) / (prd.sectionsTotal)) * 100}%`,
                                height: "100%",
                                background: prd.status === "PUBLISHED" ? "#1F8A5B" : "#0519B0",
                              }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#8C92AD" }}>{prd.sectionsDone ?? 0}/{prd.sectionsTotal}</span>
                          </div>
                        </div>
                      ) : <span style={{ color: "#DCDCDC", fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <UserAvatar name={prd.author} isSelf={prd.authorId === session?.id} size={26} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#141932" }}>{prd.author.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)", verticalAlign: "middle", color: "#8C92AD", fontSize: 13 }}>
                      {formatRelative(prd.updatedAt)}
                    </td>
                    <td
                      style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)", verticalAlign: "middle", width: 80 }}
                      onClick={e => e.stopPropagation()}
                    >
                      {hoverRow === prd.id && (
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            onClick={() => { setRenameTarget(prd); setRenameValue(prd.title); }}
                            title="Rename"
                            style={{
                              width: 32, height: 32, borderRadius: 6, border: "none",
                              background: "transparent", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#4A4F6A", transition: "background 150ms",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#E6EAF8"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                          >
                            <span className="material-symbols-rounded" style={{ fontSize: 17 }}>edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(prd)}
                            disabled={deleting === prd.id}
                            title="Hapus"
                            style={{
                              width: 32, height: 32, borderRadius: 6, border: "none",
                              background: "transparent", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#EB0B54", transition: "background 150ms",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#FFE6EA"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                          >
                            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(10,15,40,0.45)", backdropFilter: "blur(2px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setDeleteConfirm(null)}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: "28px 28px 24px",
            width: 400, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(10,15,40,0.18)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFE6EA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span className="material-symbols-rounded" style={{ fontSize: 24, color: "#EB0B54" }}>delete</span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#141932", margin: "0 0 8px", fontFamily: "'Satoshi', sans-serif" }}>
              Hapus PRD ini?
            </h3>
            <p style={{ fontSize: 14, color: "#4A4F6A", margin: "0 0 6px" }}>
              <strong>&ldquo;{deleteConfirm.title}&rdquo;</strong> akan dihapus permanen.
            </p>
            <p style={{ fontSize: 13, color: "#8C92AD", margin: "0 0 24px" }}>
              Semua section, pesan coach, dan data terkait ikut terhapus. Aksi ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  height: 38, padding: "0 18px", borderRadius: 8, border: "1px solid #DCDCDC",
                  background: "#fff", color: "#4A4F6A", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deleting === deleteConfirm.id}
                style={{
                  height: 38, padding: "0 18px", borderRadius: 8, border: "none",
                  background: "#EB0B54", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  opacity: deleting === deleteConfirm.id ? 0.6 : 1,
                  fontFamily: "'Satoshi', sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {deleting === deleteConfirm.id
                  ? <><span className="material-symbols-rounded" style={{ fontSize: 16, animation: "prd-spin 1s linear infinite" }}>refresh</span> Menghapus…</>
                  : <><span className="material-symbols-rounded" style={{ fontSize: 16 }}>delete</span> Ya, hapus</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename modal */}
      {renameTarget && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(10,15,40,0.45)", backdropFilter: "blur(2px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setRenameTarget(null)}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: "28px 28px 24px",
            width: 460, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(10,15,40,0.18)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#E6EAF8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span className="material-symbols-rounded" style={{ fontSize: 24, color: "#0519B0" }}>edit</span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#141932", margin: "0 0 16px", fontFamily: "'Satoshi', sans-serif" }}>
              Rename PRD
            </h3>
            <input
              autoFocus
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenameTarget(null); }}
              placeholder="Judul PRD"
              style={{
                width: "100%", height: 42, padding: "0 14px",
                border: "1px solid #DCDCDC", borderRadius: 8, fontSize: 14,
                color: "#141932", outline: "none", marginBottom: 20,
                fontFamily: "'Satoshi', sans-serif", boxSizing: "border-box",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "#0519B0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(5,25,176,0.10)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#DCDCDC"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setRenameTarget(null)}
                style={{
                  height: 38, padding: "0 18px", borderRadius: 8, border: "1px solid #DCDCDC",
                  background: "#fff", color: "#4A4F6A", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleRename}
                disabled={renameSaving || !renameValue.trim() || renameValue.trim() === renameTarget.title}
                style={{
                  height: 38, padding: "0 18px", borderRadius: 8, border: "none",
                  background: "#0519B0", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  opacity: (renameSaving || !renameValue.trim() || renameValue.trim() === renameTarget.title) ? 0.5 : 1,
                  fontFamily: "'Satoshi', sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {renameSaving
                  ? <><span className="material-symbols-rounded" style={{ fontSize: 16, animation: "prd-spin 1s linear infinite" }}>refresh</span> Menyimpan…</>
                  : <><span className="material-symbols-rounded" style={{ fontSize: 16 }}>check</span> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
