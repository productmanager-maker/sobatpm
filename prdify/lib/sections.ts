export const SECTION_TYPES = [
  "problem_statement", "target_user", "why_now", "desired_outcome",
  "user_stories", "user_journey", "flow_diagram", "acceptance_criteria",
  "rbac", "scope", "success_metrics", "dependencies", "stakeholders",
  "edge_cases", "tech_feasibility", "risks", "testability", "open_questions",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_LABELS: Record<SectionType, string> = {
  problem_statement: "Problem Statement",
  target_user: "Target User",
  why_now: "Why Now",
  desired_outcome: "Desired Outcome",
  user_stories: "User Stories",
  user_journey: "User Journey",
  flow_diagram: "Flow Diagram",
  acceptance_criteria: "Acceptance Criteria",
  rbac: "Role-Based Access (RBAC)",
  scope: "Scope (In / Out)",
  success_metrics: "Success Metrics",
  dependencies: "Dependencies",
  stakeholders: "Stakeholders",
  edge_cases: "Edge Cases",
  tech_feasibility: "Tech Feasibility",
  risks: "Risks",
  testability: "Testability",
  open_questions: "Open Questions",
};

export const SECTION_GUIDANCE: Record<SectionType, string> = {
  problem_statement: "Friksi konkret yang dihadapi user, sertakan data/insight pendukung. Hindari solusi.",
  target_user: "Persona spesifik: role, konteks, frekuensi, kebutuhan utama.",
  why_now: "Trigger bisnis / kompetitor / kondisi user — kenapa harus sekarang.",
  desired_outcome: "Outcome terukur (bukan output). Contoh: 'Conversion sign-up naik 20%'.",
  user_stories: "Format: Sebagai <role>, saya ingin <kebutuhan>, agar <manfaat>.",
  user_journey: "Step-by-step dari trigger sampai outcome, sertakan touchpoints & emosi user.",
  flow_diagram: "Mermaid syntax. Mulai dengan `flowchart TD`. Tampilkan happy path + branching utama.",
  acceptance_criteria: "Format Given/When/Then. Setiap user story punya AC yang testable.",
  rbac: "Matriks role × aksi. Cantumkan admin / member / guest dan permission CRUD.",
  scope: "Pisahkan In Scope vs Out of Scope. Eksplisit tentang yang TIDAK dikerjakan.",
  success_metrics: "Metric utama (North Star) + leading indicators + guardrails.",
  dependencies: "Service / tim / sistem lain yang harus siap. Sertakan owner & ETA.",
  stakeholders: "Daftar RACI: Responsible, Accountable, Consulted, Informed.",
  edge_cases: "Skenario non-happy path: error, timeout, data invalid, race condition.",
  tech_feasibility: "Stack, estimasi effort, risiko teknis, strategi migration & rollback.",
  risks: "Tabel: Risk | Likelihood | Impact | Mitigasi | Owner.",
  testability: "Strategi test (unit/integration/E2E) + observability + feature flag plan.",
  open_questions: "Pertanyaan belum terjawab + siapa yang harus jawab + deadline.",
};

// Which audiences need each section
export const SECTION_AUDIENCE: Record<SectionType, Array<"Stakeholder" | "UI/UX" | "Tech">> = {
  problem_statement: ["Stakeholder"],
  target_user: ["Stakeholder", "UI/UX"],
  why_now: ["Stakeholder"],
  desired_outcome: ["Stakeholder"],
  user_stories: ["Stakeholder", "UI/UX", "Tech"],
  user_journey: ["UI/UX"],
  flow_diagram: ["UI/UX", "Tech"],
  acceptance_criteria: ["UI/UX", "Tech"],
  rbac: ["Tech"],
  scope: ["Stakeholder", "Tech"],
  success_metrics: ["Stakeholder"],
  dependencies: ["Tech"],
  stakeholders: ["Stakeholder"],
  edge_cases: ["UI/UX", "Tech"],
  tech_feasibility: ["Tech"],
  risks: ["Stakeholder", "Tech"],
  testability: ["Tech"],
  open_questions: ["Stakeholder", "Tech"],
};

// Quality score weights (total = 100)
export const QUALITY_WEIGHTS: Record<string, { sections: SectionType[]; weight: number; label: string }> = {
  completeness: { sections: ["problem_statement", "user_stories", "scope", "desired_outcome", "target_user"], weight: 20, label: "Completeness" },
  clarity: { sections: ["problem_statement"], weight: 15, label: "Clarity" },
  stakeholder_coverage: { sections: ["stakeholders", "user_stories"], weight: 15, label: "Stakeholder Coverage" },
  edge_cases: { sections: ["edge_cases"], weight: 15, label: "Edge Cases" },
  tech_feasibility: { sections: ["tech_feasibility", "flow_diagram"], weight: 10, label: "Tech Feasibility" },
  risk_security: { sections: ["risks", "rbac"], weight: 15, label: "Risk & Security" },
  testability: { sections: ["testability", "success_metrics"], weight: 10, label: "Testability" },
};

export const SECTION_ORDER: SectionType[] = [
  // Stakeholder-facing first
  "problem_statement", "target_user", "why_now", "desired_outcome",
  "user_stories", "scope", "success_metrics", "stakeholders", "risks",
  // UI/UX
  "user_journey", "flow_diagram", "acceptance_criteria", "edge_cases",
  // Tech
  "rbac", "dependencies", "tech_feasibility", "testability", "open_questions",
];
