"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Tag, X, Image as ImageIcon, Video, FileText, Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PesertaItem { id: string; nama: string; kelas: string; inisial: string; }
interface ExpertKaryaFile {
  id: string; nama: string; tipe: "image" | "video" | "file";
  ukuranFormatted: string; uploadedAt: string; taggedTo: string[];
}
interface ExpertKaryaEntry { pesertaId: string; pesertaNama: string; files: ExpertKaryaFile[]; }
interface AktDetail { id: string; nama: string; }

const MOCK_FILES = {
  image: ["Foto_Kegiatan_1.jpg", "Foto_Kegiatan_2.jpg", "Dokumentasi.jpg", "Presentasi_Foto.png"],
  video: ["Video_Presentasi.mp4", "Rekaman_Kegiatan.mp4", "Demo_Project.mov"],
  file: ["Laporan_Akhir.pdf", "Karya_Tulis.docx", "Portofolio.pdf", "Data_Riset.xlsx"],
};
const MOCK_SIZES = ["845 KB", "1.2 MB", "2.3 MB", "3.1 MB", "560 KB", "4.7 MB"];

const AVATAR_PALETTE = ["#E8F0FF", "#FFE8F3", "#E8FFF0", "#FFF8E8", "#F3E8FF", "#E8F8FF"];
function avatarBg(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[n % AVATAR_PALETTE.length];
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function FileIcon({ tipe }: { tipe: ExpertKaryaFile["tipe"] }) {
  if (tipe === "image") return <ImageIcon size={16} color="#7C3AED" />;
  if (tipe === "video") return <Video size={16} color="#0369A1" />;
  return <FileText size={16} color="#D97706" />;
}

function FileBg(tipe: ExpertKaryaFile["tipe"]) {
  if (tipe === "image") return { bg: "#F3E8FF", color: "#7C3AED" };
  if (tipe === "video") return { bg: "#E0F2FE", color: "#0369A1" };
  return { bg: "#FEF3C7", color: "#D97706" };
}

export default function HasilKaryaExpertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();

  const [uploadPesertaId, setUploadPesertaId] = useState<string | null>(null);
  const [uploadTipe, setUploadTipe] = useState<"image" | "video" | "file">("image");
  const [uploadLoading, setUploadLoading] = useState(false);

  const [tagFileInfo, setTagFileInfo] = useState<{ pesertaId: string; fileId: string; taggedTo: string[] } | null>(null);
  const [tagSearch, setTagSearch] = useState("");
  const [tagLoading, setTagLoading] = useState(false);

  const { data: a } = useQuery<AktDetail | null>({
    queryKey: ["aktivitas", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}`);
      return r.ok ? (await r.json()).data : null;
    },
  });

  const { data: pesertaList = [] } = useQuery<PesertaItem[]>({
    queryKey: ["aktivitas", id, "peserta"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/peserta`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
  });

  const { data: karyaEntries = [], isLoading: karyaLoading } = useQuery<ExpertKaryaEntry[]>({
    queryKey: ["aktivitas", id, "karya-expert"],
    queryFn: async () => {
      const r = await fetch(`/api/v1/aktivitas/${id}/karya-expert`);
      return r.ok ? (await r.json()).data ?? [] : [];
    },
  });

  function getKaryaForPeserta(pesertaId: string): ExpertKaryaFile[] {
    return karyaEntries.find(e => e.pesertaId === pesertaId)?.files ?? [];
  }

  function getPesertaNama(pesertaId: string) {
    return pesertaList.find(p => p.id === pesertaId)?.nama ?? pesertaId;
  }

  async function handleUpload() {
    if (!uploadPesertaId) return;
    setUploadLoading(true);
    const fileList = MOCK_FILES[uploadTipe];
    const fileName = fileList[Math.floor(Math.random() * fileList.length)];
    const fileSize = MOCK_SIZES[Math.floor(Math.random() * MOCK_SIZES.length)];
    try {
      await fetch(`/api/v1/aktivitas/${id}/karya-expert/${uploadPesertaId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: [{ nama: fileName, tipe: uploadTipe, ukuranFormatted: fileSize }] }),
      });
      qc.invalidateQueries({ queryKey: ["aktivitas", id, "karya-expert"] });
      setUploadPesertaId(null);
    } finally {
      setUploadLoading(false);
    }
  }

  async function removeFile(pesertaId: string, fileId: string) {
    await fetch(`/api/v1/aktivitas/${id}/karya-expert/${pesertaId}/files/${fileId}`, { method: "DELETE" });
    qc.invalidateQueries({ queryKey: ["aktivitas", id, "karya-expert"] });
  }

  async function addTag(pesertaId: string, fileId: string, targetPesertaId: string) {
    setTagLoading(true);
    try {
      await fetch(`/api/v1/aktivitas/${id}/karya-expert/${pesertaId}/files/${fileId}/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPesertaId }),
      });
      qc.invalidateQueries({ queryKey: ["aktivitas", id, "karya-expert"] });
      // update local tagFileInfo
      setTagFileInfo(prev => prev ? { ...prev, taggedTo: [...prev.taggedTo, targetPesertaId] } : prev);
    } finally {
      setTagLoading(false);
    }
  }

  async function removeTag(pesertaId: string, fileId: string, targetId: string) {
    setTagLoading(true);
    try {
      await fetch(`/api/v1/aktivitas/${id}/karya-expert/${pesertaId}/files/${fileId}/tag/${targetId}`, { method: "DELETE" });
      qc.invalidateQueries({ queryKey: ["aktivitas", id, "karya-expert"] });
      setTagFileInfo(prev => prev ? { ...prev, taggedTo: prev.taggedTo.filter(t => t !== targetId) } : prev);
    } finally {
      setTagLoading(false);
    }
  }

  const tagFilteredPeserta = pesertaList.filter(p =>
    (!tagSearch || p.nama.toLowerCase().includes(tagSearch.toLowerCase())) &&
    p.id !== (tagFileInfo ? karyaEntries.find(e => e.files.some(f => f.id === tagFileInfo.fileId))?.pesertaId : null)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* App bar */}
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-2) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)", flexShrink: 0, height: 56 }}>
        <button onClick={() => router.push(`/presensi?sheet=${id}`)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
          <ArrowLeft size={20} color="var(--text-100)" />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-100)", flex: 1 }}>Hasil Karya</p>
        <span style={{ fontSize: 12, color: "var(--text-300)" }}>{karyaEntries.reduce((s, e) => s + e.files.length, 0)} file</span>
      </div>

      {/* Activity label */}
      {a && (
        <div style={{ background: "var(--neutral-200)", padding: "var(--space-2) var(--space-4)", borderBottom: "1px solid var(--neutral-400)" }}>
          <p style={{ fontSize: 12, color: "var(--text-300)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nama}</p>
        </div>
      )}

      {/* Info banner */}
      <div style={{ background: "var(--primary-100)", padding: "var(--space-2) var(--space-4)", borderBottom: "1px solid var(--neutral-500)" }}>
        <p style={{ fontSize: 12, color: "var(--primary-600)", lineHeight: 1.5 }}>
          Upload file per peserta. Setelah upload, bisa <strong>tag</strong> ke peserta lain agar file muncul di profil mereka.
        </p>
      </div>

      {/* Peserta list with their files */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {karyaLoading ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-300)" }}>Memuat...</div>
        ) : pesertaList.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-300)" }}>Tidak ada peserta.</div>
        ) : pesertaList.map((peserta, idx) => {
          const files = getKaryaForPeserta(peserta.id);
          return (
            <div key={peserta.id} style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)" }}>
              {/* Peserta header */}
              <div style={{ padding: "var(--space-3) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: avatarBg(peserta.id), display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-200)",
                }}>
                  {peserta.inisial}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)" }}>{peserta.nama}</p>
                  <p style={{ fontSize: 11, color: "var(--text-300)" }}>{peserta.kelas} · {files.length} file</p>
                </div>
                <button
                  onClick={() => { setUploadPesertaId(peserta.id); setUploadTipe("image"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "5px 12px",
                    borderRadius: 100, background: "var(--primary-100)", color: "var(--primary-600)",
                    border: "none", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
                  }}
                >
                  <Plus size={13} />
                  Tambah
                </button>
              </div>

              {/* Files list */}
              {files.length > 0 && (
                <div style={{ padding: "0 var(--space-4) var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  {files.map(file => {
                    const fbg = FileBg(file.tipe);
                    return (
                      <div key={file.id} style={{
                        background: "var(--neutral-200)", borderRadius: "var(--radius-lg)",
                        padding: "var(--space-3)", display: "flex", gap: "var(--space-3)", alignItems: "flex-start",
                      }}>
                        {/* File icon */}
                        <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: fbg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileIcon tipe={file.tipe} />
                        </div>

                        {/* File info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--text-100)", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {file.nama}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--text-300)" }}>{file.ukuranFormatted} · {fmtTime(file.uploadedAt)}</p>

                          {/* Tags */}
                          {file.taggedTo.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                              {file.taggedTo.map(tagId => (
                                <span key={tagId} style={{
                                  display: "inline-flex", alignItems: "center", gap: 3,
                                  fontSize: 10, fontWeight: 700, fontFamily: "var(--font-display)",
                                  background: "#E0F2FE", color: "#0369A1",
                                  padding: "2px 6px 2px 8px", borderRadius: 100,
                                }}>
                                  @{getPesertaNama(tagId).split(" ")[0]}
                                  <button
                                    onClick={() => removeTag(peserta.id, file.id, tagId)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#0369A1" }}
                                  >
                                    <X size={10} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "var(--space-2)", flexShrink: 0 }}>
                          <button
                            onClick={() => setTagFileInfo({ pesertaId: peserta.id, fileId: file.id, taggedTo: file.taggedTo })}
                            style={{
                              width: 30, height: 30, borderRadius: "var(--radius-md)",
                              background: "var(--primary-100)", border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-600)",
                            }}
                            title="Tag ke peserta lain"
                          >
                            <Tag size={14} />
                          </button>
                          <button
                            onClick={() => removeFile(peserta.id, file.id)}
                            style={{
                              width: 30, height: 30, borderRadius: "var(--radius-md)",
                              background: "#ffe6ea", border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", color: "#eb0b54",
                            }}
                            title="Hapus file"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload bottom sheet */}
      {uploadPesertaId && (
        <div className="modal-backdrop" onClick={() => setUploadPesertaId(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-4)" }} />
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Upload File</p>
            <p style={{ fontSize: 13, color: "var(--text-300)", marginBottom: "var(--space-4)" }}>
              Untuk: <strong style={{ color: "var(--text-100)" }}>{getPesertaNama(uploadPesertaId)}</strong>
            </p>

            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-200)", marginBottom: "var(--space-2)" }}>Tipe File</p>
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
              {([
                { key: "image" as const, label: "Foto/Gambar", icon: <ImageIcon size={16} /> },
                { key: "video" as const, label: "Video", icon: <Video size={16} /> },
                { key: "file" as const, label: "Dokumen", icon: <FileText size={16} /> },
              ]).map(t => (
                <button key={t.key} onClick={() => setUploadTipe(t.key)} style={{
                  flex: 1, padding: "var(--space-3)", borderRadius: "var(--radius-lg)",
                  background: uploadTipe === t.key ? "var(--primary-100)" : "var(--neutral-300)",
                  border: uploadTipe === t.key ? "1.5px solid var(--primary-600)" : "1.5px solid transparent",
                  color: uploadTipe === t.key ? "var(--primary-600)" : "var(--text-300)",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}>
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Simulated file picker */}
            <div style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-xl)", border: "2px dashed var(--neutral-600)", padding: "var(--space-6)", textAlign: "center", marginBottom: "var(--space-4)" }}>
              <Upload size={28} color="var(--text-300)" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-200)", marginBottom: 4 }}>
                Pilih file untuk diupload
              </p>
              <p style={{ fontSize: 12, color: "var(--text-300)" }}>
                {uploadTipe === "image" ? "JPG, PNG, GIF" : uploadTipe === "video" ? "MP4, MOV, AVI" : "PDF, DOCX, XLSX, PPT"}
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleUpload} disabled={uploadLoading}>
              {uploadLoading ? <span className="spinner" /> : "Simulasi Upload File"}
            </button>
            <button className="btn btn-ghost" onClick={() => setUploadPesertaId(null)} style={{ marginTop: "var(--space-2)" }}>
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Tag bottom sheet */}
      {tagFileInfo && (
        <div className="modal-backdrop" onClick={() => { setTagFileInfo(null); setTagSearch(""); }}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "80dvh", display: "flex", flexDirection: "column" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--neutral-500)", margin: "0 auto var(--space-3)" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Tag ke Peserta Lain</p>
              <button onClick={() => { setTagFileInfo(null); setTagSearch(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-300)" }}>
                <X size={20} />
              </button>
            </div>

            {/* Currently tagged */}
            {tagFileInfo.taggedTo.length > 0 && (
              <div style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-300)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>Sudah di-tag</p>
                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                  {tagFileInfo.taggedTo.map(tagId => (
                    <span key={tagId} style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: "#E0F2FE", color: "#0369A1", padding: "4px 10px 4px 12px",
                      borderRadius: 100, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                    }}>
                      {getPesertaNama(tagId)}
                      <button
                        onClick={() => removeTag(tagFileInfo.pesertaId, tagFileInfo.fileId, tagId)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#0369A1", display: "flex" }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ position: "relative", marginBottom: "var(--space-3)" }}>
              <input
                type="search" className="input" placeholder="Cari nama peserta..."
                value={tagSearch} onChange={e => setTagSearch(e.target.value)}
                style={{ height: 40, fontSize: 13, paddingLeft: 12 }}
              />
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {tagFilteredPeserta.filter(p => !tagFileInfo.taggedTo.includes(p.id)).map(p => (
                <button
                  key={p.id}
                  onClick={() => !tagLoading && addTag(tagFileInfo.pesertaId, tagFileInfo.fileId, p.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "var(--space-3)",
                    width: "100%", padding: "var(--space-3) 0",
                    background: "none", border: "none", borderBottom: "1px solid var(--neutral-400)", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: avatarBg(p.id),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-200)", flexShrink: 0,
                  }}>
                    {p.inisial}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-100)" }}>{p.nama}</p>
                    <p style={{ fontSize: 11, color: "var(--text-300)" }}>{p.kelas}</p>
                  </div>
                  <div style={{ marginLeft: "auto", color: "var(--primary-600)" }}>
                    <Plus size={18} />
                  </div>
                </button>
              ))}
              {tagFilteredPeserta.filter(p => !tagFileInfo.taggedTo.includes(p.id)).length === 0 && (
                <p style={{ textAlign: "center", color: "var(--text-300)", fontSize: 13, padding: "var(--space-4) 0" }}>
                  Semua peserta sudah di-tag atau tidak ditemukan.
                </p>
              )}
            </div>

            {/* Info section */}
            <div style={{ background: "var(--neutral-200)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)", marginTop: "var(--space-3)" }}>
              <p style={{ fontSize: 11, color: "var(--text-300)", lineHeight: 1.5 }}>
                File yang di-tag akan muncul di profil peserta tersebut, beserta info: <em>dari peserta mana dan aktivitas apa</em>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
