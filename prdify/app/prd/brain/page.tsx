import { TopBar } from "@/components/prd/topbar";

function FeatureCard({ icon, title, desc, status, detail }: { icon: string; title: string; desc: string; status: string; detail: string }) {
  const isSoon = status === "Soon";
  const badgeCls = isSoon
    ? { bg: "#F2F2F2", color: "#4A4F6A", border: "#DCDCDC" }
    : { bg: "var(--p-success-bg,#E6F4ED)", color: "#1F8A5B", border: "var(--p-success-bd,#BFE3D0)" };

  return (
    <div style={{
      background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)",
      borderRadius: 12, padding: 20, opacity: isSoon ? 0.72 : 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#E6EAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="material-symbols-rounded" style={{ fontSize: 22, color: "#0519B0" }}>{icon}</span>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 10px", borderRadius: 999, height: 22,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
          background: badgeCls.bg, color: badgeCls.color, border: `1px solid ${badgeCls.border}`,
        }}>
          {!isSoon && <span style={{ width: 5, height: 5, borderRadius: 99, background: "currentColor" }} />}
          {status}
        </span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px", color: "#141932" }}>{title}</h3>
      <p style={{ fontSize: 13, color: "#4A4F6A", margin: "0 0 12px", lineHeight: 1.55 }}>{desc}</p>
      <div style={{
        fontSize: 12, color: "#8C92AD", fontFamily: "'JetBrains Mono', monospace",
        padding: "6px 10px", background: "#FAFAFA",
        borderRadius: 6, border: "1px solid var(--p-card-border,#EAEAEA)",
      }}>{detail}</div>
    </div>
  );
}

const recentActivity = [
  { icon: "auto_awesome", text: 'Generated section "User Stories" untuk Unit Management Dashboard', time: "2m ago" },
  { icon: "sync", text: "Re-scanned ClickUp workspace · 14 new docs indexed", time: "1h ago" },
  { icon: "psychology", text: "Learned 3 new patterns dari published PRD", time: "4h ago" },
  { icon: "bookmark_added", text: 'Knowledge added: "RACI matrix template v2"', time: "yesterday" },
];

export default function BrainPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <TopBar title="Brain" subtitle="Pusat konfigurasi AI dan knowledge" />
      <div className="prd-page-pad" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>

          {/* Hero card */}
          <div style={{
            padding: "20px 20px", borderRadius: 12,
            background: "radial-gradient(ellipse 600px 200px at 80% 0%, rgba(186,140,217,0.30), transparent 60%), linear-gradient(135deg, #000563 0%, #0519B0 70%, #243BBD 130%)",
            color: "#fff", border: "1px solid #000B8A",
            marginBottom: 24, position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="material-symbols-rounded" style={{ fontSize: 36, color: "#fff" }}>neurology</span>
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ color: "#fff", fontSize: 28, margin: "0 0 4px", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Sobat PM Brain</h1>
                <p style={{ color: "rgba(255,255,255,0.78)", margin: 0, fontSize: 15 }}>AI yang makin pintar seiring kamu pakai. Connect workspace, upload knowledge, pilih expert profile.</p>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 999, height: 24,
                fontSize: 11, fontWeight: 700,
                background: "rgba(31,138,91,0.20)", color: "#7DDFA8", border: "1px solid rgba(31,138,91,0.40)",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: "currentColor", animation: "typing-bounce 2s infinite" }} />
                Online
              </span>
            </div>
          </div>

          {/* Feature grid */}
          <div className="prd-grid-2" style={{ marginBottom: 24 }}>
            <FeatureCard icon="hub" title="Workspace Connector" desc="Hubungkan ClickUp, Notion, Jira untuk auto-scan context PRD-related." status="Connected" detail="ClickUp · 142 docs indexed" />
            <FeatureCard icon="bookmark" title="Knowledge Base" desc="Simpan template, glossary, dan standar tim untuk reuse di semua PRD." status="Active" detail="3 templates · 24 glossary terms" />
            <FeatureCard icon="auto_awesome" title="Expert Profiles" desc="Pilih persona AI: PM Senior, Tech Lead, atau UX Researcher." status="Soon" detail="Coming Q4 2026" />
            <FeatureCard icon="psychology" title="Learning Mode" desc="Brain belajar dari PRD published terbaik untuk meningkatkan kualitas draft." status="Soon" detail="Coming Q4 2026" />
          </div>

          {/* Recent activity */}
          <div style={{ background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 14px", fontWeight: 700, color: "#141932" }}>Recent Brain Activity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentActivity.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", background: "#FAFAFA", borderRadius: 8,
                }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 18, color: "#0519B0", flexShrink: 0 }}>{a.icon}</span>
                  <span style={{ fontSize: 13, flex: 1, color: "#141932" }}>{a.text}</span>
                  <span style={{ fontSize: 12, color: "#8C92AD", whiteSpace: "nowrap" }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
