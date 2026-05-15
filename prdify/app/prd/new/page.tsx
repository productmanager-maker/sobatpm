"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/prd/topbar";
import Link from "next/link";

function extractGDriveFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

export default function NewPRDPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [gdriveUrl, setGdriveUrl] = useState("");
  const [gdriveError, setGdriveError] = useState("");
  const [gdriveValid, setGdriveValid] = useState(false);
  const [gdriveFileId, setGdriveFileId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [activeTab, setActiveTab] = useState("gdrive");

  function handleGdriveUrlChange(url: string) {
    setGdriveUrl(url);
    setGdriveError("");
    setGdriveValid(false);
    setGdriveFileId("");
    if (!url) return;
    const fileId = extractGDriveFileId(url);
    if (!fileId) {
      if (url.includes("google.com")) setGdriveError("URL tidak valid. Pastikan URL Google Drive mengandung /d/FILE_ID/");
      return;
    }
    setGdriveFileId(fileId);
    setGdriveValid(true);
  }

  async function handleCreate() {
    setLoading(true);
    setUploadError("");
    try {
      let rawContext = "";
      if (activeTab === "upload" && uploadFile) {
        setLoadingStep("Membaca isi file...");
        const form = new FormData();
        form.append("file", uploadFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: form });
        const upData = await upRes.json();
        if (!upRes.ok) { setUploadError(upData.error ?? "Gagal membaca file."); return; }
        rawContext = upData.text;
      }

      setLoadingStep("Membuat PRD...");
      const payload: Record<string, string> = { title: title || "Untitled PRD" };
      if (activeTab === "gdrive" && gdriveValid) {
        payload.gdriveUrl = gdriveUrl;
        payload.gdriveFileId = gdriveFileId;
        payload.gdriveTitle = `Google Doc (${gdriveFileId.substring(0, 12)}...)`;
      } else if (activeTab === "upload" && uploadFile) {
        payload.uploadedFile = uploadFile.name;
      }

      const res = await fetch("/api/prd", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) return;
      const prd = await res.json();
      await fetch(`/api/prd/${prd.id}/sections`, { method: "POST" });

      if (activeTab === "gdrive" && gdriveValid && gdriveUrl) {
        setLoadingStep("Menghubungkan dokumen...");
        rawContext = `Google Drive document URL: ${gdriveUrl}\nTitle: ${title || "Untitled PRD"}\nExtract a structured PRD brief from this document.`;
      }
      if (rawContext) {
        setLoadingStep("AI sedang mengekstrak brief...");
        await fetch(`/api/prd/${prd.id}/extract`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rawContext }) }).catch(() => {});
      }

      router.push(`/prd/${prd.id}/coach`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  const canProceed = activeTab === "gdrive" ? gdriveValid : activeTab === "upload" ? !!uploadFile : true;

  const inputStyle = (focused?: boolean) => ({
    width: "100%", padding: "10px 12px", fontSize: 14,
    border: `1px solid ${focused ? "#0519B0" : "#DCDCDC"}`, borderRadius: 8,
    background: "#fff", color: "#141932",
    fontFamily: "'Satoshi', sans-serif", outline: "none",
    transition: "border-color 150ms",
    boxSizing: "border-box" as const,
  });

  const TABS = [
    { value: "gdrive", icon: "link", label: "Google Drive" },
    { value: "upload", icon: "upload_file", label: "Upload File" },
    { value: "manual", icon: "description", label: "Mulai Manual" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <TopBar
        title="New PRD"
        subtitle="Buat Product Requirements Document baru"
        breadcrumb={["My PRDs", "New PRD"]}
        actions={
          <Link href="/prd" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 12px", borderRadius: 8, background: "transparent", color: "#0519B0", fontSize: 14, fontWeight: 700, textDecoration: "none", border: "none" }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>arrow_back</span>
            Back
          </Link>
        }
      />

      <div className="prd-page-pad" style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 720, width: "100%" }}>

          {/* Title card */}
          <div style={{ background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)", borderRadius: 12, padding: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#141932", marginBottom: 8, display: "block" }}>Judul PRD</label>
            <input
              type="text"
              placeholder="Contoh: Fitur Notifikasi Push untuk Siswa"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ ...inputStyle(), fontSize: 16, padding: "12px 14px" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#0519B0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(5,25,176,0.12)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#DCDCDC"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <div style={{ fontSize: 12, color: "#8C92AD", marginTop: 6 }}>Singkat dan deskriptif. Bisa diedit kapan saja.</div>
          </div>

          {/* Context source card */}
          <div style={{ background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)", borderRadius: 12, padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#141932" }}>Context Source</div>
              <div style={{ fontSize: 13, color: "#8C92AD", marginTop: 2 }}>Pilih dari mana AI akan menarik konteks awal.</div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, padding: 4, background: "#EFEFEF", borderRadius: 10, marginBottom: 20 }}>
              {TABS.map(t => (
                <button key={t.value} onClick={() => setActiveTab(t.value)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "7px 8px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                  color: activeTab === t.value ? "#141932" : "#4A4F6A",
                  background: activeTab === t.value ? "#fff" : "transparent",
                  boxShadow: activeTab === t.value ? "0 1px 2px rgba(20,25,50,0.08)" : "none",
                  border: "none", cursor: "pointer", fontFamily: "'Satoshi', sans-serif",
                  whiteSpace: "nowrap", minWidth: 0,
                }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 16, flexShrink: 0 }}>{t.icon}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</span>
                </button>
              ))}
            </div>

            {/* GDrive */}
            {activeTab === "gdrive" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 13, color: "#4A4F6A" }}>
                  Paste link dokumen yang sudah di-share ke{" "}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", background: "#F2F2F2", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>
                    product.manager@sekolahmu.co.id
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="https://docs.google.com/document/d/…"
                  value={gdriveUrl}
                  onChange={e => handleGdriveUrlChange(e.target.value)}
                  style={{
                    ...inputStyle(),
                    borderColor: gdriveValid ? "#1F8A5B" : gdriveError ? "#EB0B54" : "#DCDCDC",
                  }}
                  onFocus={e => { if (!gdriveValid && !gdriveError) { e.currentTarget.style.borderColor = "#0519B0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(5,25,176,0.12)"; } }}
                  onBlur={e => { if (!gdriveValid && !gdriveError) { e.currentTarget.style.borderColor = "#DCDCDC"; e.currentTarget.style.boxShadow = "none"; } }}
                />
                {gdriveError && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#C40048", background: "#FFE6EA", border: "1px solid #FFB0C0", borderRadius: 8, padding: "10px 12px" }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 16 }}>error</span>
                    {gdriveError}
                  </div>
                )}
                {gdriveValid && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#1F8A5B", background: "#E6F4ED", border: "1px solid #BFE3D0", borderRadius: 8, padding: "10px 12px", fontWeight: 600 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 18 }}>check_circle</span>
                    GDrive berhasil dihubungkan!
                    <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#666" }}>File ID: {gdriveFileId.substring(0, 14)}…</span>
                  </div>
                )}
              </div>
            )}

            {/* Upload */}
            {activeTab === "upload" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                  className="prd-dropzone"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input id="file-input" type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }}
                    onChange={e => { setUploadFile(e.target.files?.[0] || null); setUploadError(""); }} />
                  <span className="material-symbols-rounded" style={{ fontSize: 32, color: "#0519B0", display: "block", marginBottom: 10 }}>upload_file</span>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Drop file atau click untuk upload</div>
                  <div style={{ fontSize: 13, color: "#8C92AD" }}>PDF, DOCX, TXT · Max 10MB</div>
                </div>
                {uploadFile && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#F5F8FF", border: "1px solid #C2CDF1", borderRadius: 8 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 24, color: "#EB0B54" }}>picture_as_pdf</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{uploadFile.name}</div>
                      <div style={{ fontSize: 12, color: "#8C92AD" }}>{(uploadFile.size / 1024).toFixed(1)} KB · Ready</div>
                    </div>
                    <button onClick={() => setUploadFile(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#8C92AD", display: "flex" }}>
                      <span className="material-symbols-rounded" style={{ fontSize: 18 }}>close</span>
                    </button>
                  </div>
                )}
                {uploadError && (
                  <div style={{ fontSize: 13, color: "#C40048", background: "#FFE6EA", border: "1px solid #FFB0C0", borderRadius: 8, padding: "10px 12px" }}>{uploadError}</div>
                )}
              </div>
            )}

            {/* Manual */}
            {activeTab === "manual" && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 16, background: "#F5F8FF", border: "1px solid #C2CDF1", borderRadius: 10 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 22, color: "#0519B0", marginTop: 2 }}>auto_awesome</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "#141932" }}>PRD Coach akan membantumu</div>
                  <div style={{ fontSize: 13, color: "#4A4F6A", lineHeight: 1.55 }}>
                    Tidak punya brief atau dokumen sumber? Tidak masalah. Coach AI akan tanya step-by-step untuk mengisi 9 field brief secara interaktif.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "#8C92AD" }}>Step 1 dari 4</div>
            <button
              onClick={handleCreate}
              disabled={loading || !canProceed}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 44, padding: "0 20px", borderRadius: 8,
                background: canProceed && !loading ? "#0519B0" : "#E0E0E0",
                color: canProceed && !loading ? "#fff" : "#999",
                fontSize: 16, fontWeight: 700, border: "none",
                cursor: canProceed && !loading ? "pointer" : "not-allowed",
                fontFamily: "'Satoshi', sans-serif",
                transition: "background 150ms",
              }}
              onMouseEnter={e => { if (canProceed && !loading) e.currentTarget.style.background = "#243BBD"; }}
              onMouseLeave={e => { if (canProceed && !loading) e.currentTarget.style.background = "#0519B0"; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(153,153,153,0.4)", borderTopColor: "#999", borderRadius: 99, animation: "prd-spin .7s linear infinite", display: "inline-block" }} />
                  {loadingStep || "Memproses..."}
                </>
              ) : (
                <>
                  Mulai Coaching
                  <span className="material-symbols-rounded" style={{ fontSize: 18 }}>arrow_forward</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
