"use client";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/prd/topbar";
import Link from "next/link";

interface PRD {
  id: string;
  title: string;
  quality: number | null;
  status: string;
}

function QualityRing({ score, size = 36 }: { score: number | null; size?: number }) {
  if (score == null) return <div style={{ width: size, height: size, borderRadius: 99, border: "1.5px dashed #C0C0C0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 11 }}>—</div>;
  const stroke = 3, r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c - (score / 100) * c;
  const fill = score >= 85 ? "#1F8A5B" : score >= 70 ? "#B07112" : "#EB0B54";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg className="prd-qring" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} className="prd-qring-track" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} stroke={fill}
          strokeDasharray={`${c} ${c}`} strokeDashoffset={off} strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, color: "#141932" }}>{score}</div>
    </div>
  );
}

const DIMS = [
  { name: "Completeness", max: 20, desc: "Problem statement, user stories, scope, desired outcome, target user" },
  { name: "Clarity", max: 15, desc: "Kejelasan problem statement — konkret, berbasis data, bebas jargon" },
  { name: "Stakeholder Coverage", max: 15, desc: "RACI stakeholders + user stories yang lengkap" },
  { name: "Edge Cases", max: 15, desc: "Skenario non-happy path: error, timeout, data invalid" },
  { name: "Risk & Security", max: 15, desc: "Risk table + RBAC matrix" },
  { name: "Tech Feasibility", max: 10, desc: "Stack, effort estimate, flow diagram Mermaid" },
  { name: "Testability", max: 10, desc: "Test strategy + success metrics" },
];

function StatCard({ label, value, icon, iconBg, iconColor }: { label: string; value: string | number; icon: string; iconBg: string; iconColor: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)", borderRadius: 14, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: iconColor }}>{icon}</span>
        </div>
      </div>
      <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 32, fontWeight: 700, color: "#141932", lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#8C92AD", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function CritiquePage() {
  const [prds, setPrds] = useState<PRD[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prd").then(r => r.ok ? r.json() : []).then(data => { if (Array.isArray(data)) setPrds(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const withQ = prds.filter(p => p.quality != null);
  const avg = withQ.length ? Math.round(withQ.reduce((s, p) => s + (p.quality ?? 0), 0) / withQ.length) : 0;
  const published = prds.filter(p => p.status === "PUBLISHED").length;

  const getTier = (q: number) =>
    q >= 85 ? { label: "Excellent", bg: "#E6F4ED", color: "#1F8A5B", border: "#BFE3D0", icon: "trending_up" }
    : q >= 70 ? { label: "Good", bg: "#DDEFEF", color: "#137A7A", border: "#A4D2D2", icon: "trending_flat" }
    : { label: "Needs Work", bg: "#FCF1DC", color: "#B07112", border: "#F1D8A0", icon: "trending_down" };

  const distRanges = [
    { range: "85–100", label: "Excellent", count: withQ.filter(p => (p.quality ?? 0) >= 85).length, color: "#1F8A5B" },
    { range: "70–84",  label: "Good",      count: withQ.filter(p => { const q = p.quality ?? 0; return q >= 70 && q < 85; }).length, color: "#137A7A" },
    { range: "50–69",  label: "Needs Work",count: withQ.filter(p => { const q = p.quality ?? 0; return q >= 50 && q < 70; }).length, color: "#B07112" },
    { range: "<50",    label: "Poor",      count: withQ.filter(p => (p.quality ?? 0) < 50).length, color: "#EB0B54" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <TopBar title="Critique" subtitle="Review kualitas PRD kamu — 7 dimensi penilaian" />
      <div className="prd-page-pad" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Stats */}
          <div className="prd-grid-3">
            <StatCard label="Avg Quality Score" value={avg || "—"} icon="workspace_premium" iconBg="#FCF1DC" iconColor="#B07112" />
            <StatCard label="PRDs Scored" value={withQ.length} icon="rule" iconBg="#E6EAF8" iconColor="#0519B0" />
            <StatCard label="Published" value={published} icon="public" iconBg="#E6F4ED" iconColor="#1F8A5B" />
          </div>

          <div className="prd-flex-stack">
            {/* Scoring dimensions */}
            <div style={{ flex: 1, background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: "#141932" }}>Scoring Dimensions</h3>
                <span style={{ fontSize: 12, color: "#8C92AD" }}>Total 100 pts</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {DIMS.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#FAFAFA", borderRadius: 8 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#0519B0", flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 13 }}>{d.max}<span style={{ fontSize: 9, fontWeight: 600, opacity: 0.6 }}>pt</span></span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#141932" }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: "#8C92AD" }}>{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality distribution */}
            <div style={{ flexShrink: 0, background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)", borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 16, margin: "0 0 16px", fontWeight: 700, color: "#141932" }}>Quality Distribution</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {distRanges.map(r => {
                  const maxCount = withQ.length || 1;
                  return (
                    <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 99, background: r.color, display: "inline-block" }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#141932" }}>{r.label}</span>
                          <span style={{ fontSize: 12, color: "#8C92AD", fontFamily: "monospace" }}>{r.range}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{r.count}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: "#EFEFEF", overflow: "hidden" }}>
                        <div style={{ width: `${(r.count / maxCount) * 100}%`, height: "100%", background: r.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PRD list */}
          <div className="prd-table-scroll" style={{ background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)", borderRadius: 12 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--p-card-border,#EAEAEA)" }}>
              <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: "#141932" }}>PRD Quality List</h3>
            </div>
            {loading ? (
              <div style={{ padding: 48, textAlign: "center", color: "#8C92AD", fontSize: 14 }}>Memuat…</div>
            ) : withQ.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: "#8C92AD", fontSize: 14 }}>
                Belum ada PRD dengan quality score. Generate sections di Coach page dulu.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#FAFAFA" }}>
                    {["Title", "Trend", "Score", "Tier", "Status", ""].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8C92AD", padding: "12px 16px", borderBottom: "1px solid var(--p-card-border,#EAEAEA)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...withQ].sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0)).map(prd => {
                    const tier = getTier(prd.quality ?? 0);
                    return (
                      <tr key={prd.id} style={{ cursor: "pointer", transition: "background 120ms" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#FAFAFA"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#141932" }}>{prd.title}</div>
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                          <span className="material-symbols-rounded" style={{ fontSize: 20, color: tier.color }}>{tier.icon}</span>
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                          <QualityRing score={prd.quality} />
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: tier.bg, color: tier.color, border: `1px solid ${tier.border}`, height: 22 }}>{tier.label}</span>
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#8C92AD" }}>{prd.status.replace("_", " ")}</span>
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                          <Link href={`/prd/${prd.id}/publish`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "transparent", color: "#8C92AD", textDecoration: "none" }}>
                            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>arrow_forward</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
