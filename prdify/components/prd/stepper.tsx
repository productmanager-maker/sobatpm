"use client";

import { useRouter } from "next/navigation";

const STEPS = [
  { key: "BRIEF_COACH", label: "Brief Coach", shortLabel: "Brief", path: "coach" },
  { key: "CONTEXT_SCAN", label: "Context Scan", shortLabel: "Context", path: "context" },
  { key: "DRAFT_PRD", label: "Draft PRD", shortLabel: "Draft", path: "draft" },
  { key: "PUBLISH", label: "Publish", shortLabel: "Publish", path: "publish" },
];

export function PRDStepper({ currentStep, prdId }: { currentStep: string; prdId: string }) {
  const router = useRouter();
  const currentIdx = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "10px 16px", background: "#fff",
      borderBottom: "1px solid var(--p-card-border, #EAEAEA)",
      gap: 0, overflowX: "auto",
    }}>
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <button
              onClick={() => (done || active) ? router.push(`/prd/${prdId}/${step.path}`) : undefined}
              disabled={!done && !active}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 8px", borderRadius: 8, border: "none",
                background: "transparent", cursor: (done || active) ? "pointer" : "default",
                transition: "background 120ms", minWidth: 0, flexShrink: 0,
              }}
              onMouseEnter={e => { if (done || active) e.currentTarget.style.background = "#F2F2F2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                transition: "all 200ms",
                background: active ? "#0519B0" : done ? "#1F8A5B" : "#EFEFEF",
                color: active || done ? "#fff" : "#8C92AD",
                boxShadow: active ? "0 0 0 3px rgba(5,25,176,0.18)" : "none",
                border: !active && !done ? "1px solid #DCDCDC" : "none",
              }}>
                {done
                  ? <span className="material-symbols-rounded" style={{ fontSize: 14 }}>check</span>
                  : i + 1}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: active ? "#141932" : done ? "#141932" : "#8C92AD",
              }} className="prd-step-label">
                {step.shortLabel}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? "#1F8A5B" : "#DCDCDC", margin: "0 4px", minWidth: 16 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
