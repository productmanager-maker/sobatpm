"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/prd/topbar";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  isActive: boolean;
  createdAt: string;
  _count: { prds: number };
}

function Avatar({ name, isSelf }: { name: string; isSelf: boolean }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: isSelf ? "linear-gradient(135deg, #0519B0, #243BBD)" : "#E6EAF8",
      color: isSelf ? "#fff" : "#0519B0",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: 12, flexShrink: 0,
    }}>{initials}</div>
  );
}

function StatCard({ label, value, icon, iconBg, iconColor }: { label: string; value: number; icon: string; iconBg: string; iconColor: string }) {
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

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (u: UserRow) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "TempPass2026!", role: "MEMBER" });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Gagal"); return; }
      onInvite({ ...data, _count: { prds: 0 } });
    } finally { setSaving(false); }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,15,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(20,25,50,0.15)", width: "100%", maxWidth: 480, padding: 20, margin: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, margin: 0, fontWeight: 700, color: "#141932" }}>Invite Member Baru</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#8C92AD", display: "flex" }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Nama Lengkap", key: "name", type: "text", placeholder: "Galang Aulia" },
            { label: "Email", key: "email", type: "email", placeholder: "galang@sekolahmu.co.id" },
          ].map(f => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#141932" }}>{f.label}</label>
              <input
                type={f.type}
                value={(form as Record<string, string>)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #DCDCDC", fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#0519B0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(5,25,176,0.12)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#DCDCDC"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#141932" }}>Password Sementara</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ width: "100%", padding: "9px 40px 9px 12px", borderRadius: 8, border: "1px solid #DCDCDC", fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#0519B0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(5,25,176,0.12)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#DCDCDC"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#8C92AD" }}>
                <span className="material-symbols-rounded" style={{ fontSize: 18 }}>{showPw ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            <div style={{ fontSize: 12, color: "#8C92AD" }}>User akan diminta ganti password saat first login.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#141932" }}>Role</label>
            <select
              value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="prd-select"
            >
              <option value="MEMBER">Member — edit PRD sendiri</option>
              <option value="ADMIN">Admin — edit semua + manage users</option>
            </select>
          </div>
          {error && <div style={{ fontSize: 13, color: "#C40048", background: "#FFE6EA", border: "1px solid #FFB0C0", borderRadius: 8, padding: "10px 12px" }}>{error}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={onClose} style={{ flex: 1, height: 40, border: "1px solid #DCDCDC", borderRadius: 8, background: "#fff", color: "#4A4F6A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" }}>Batal</button>
            <button
              onClick={submit}
              disabled={saving || !form.name || !form.email || !form.password}
              style={{ flex: 1, height: 40, border: "none", borderRadius: 8, background: saving || !form.name ? "#E0E0E0" : "#0519B0", color: saving || !form.name ? "#999" : "#fff", fontSize: 14, fontWeight: 700, cursor: saving || !form.name ? "not-allowed" : "pointer", fontFamily: "'Satoshi', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 16 }}>send</span>
              {saving ? "Menyimpan…" : "Invite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then(r => r.ok ? r.json() : []),
      fetch("/api/auth/me").then(r => r.ok ? r.json() : null),
    ]).then(([u, me]) => {
      if (Array.isArray(u)) setUsers(u);
      else router.push("/prd");
      setCurrentUser(me);
      setLoading(false);
    });
  }, [router]);

  async function toggleRole(user: UserRow) {
    const newRole = user.role === "ADMIN" ? "MEMBER" : "ADMIN";
    const res = await fetch(`/api/users/${user.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: newRole }) });
    if (res.ok) setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
  }

  async function deleteUser(id: string) {
    if (!confirm("Hapus user ini?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers(prev => prev.filter(u => u.id !== id));
  }

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <TopBar
        title="User Management"
        subtitle="Kelola akses anggota tim"
        actions={
          <button onClick={() => setShowInvite(true)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 36, padding: "0 16px", borderRadius: 8,
            background: "#0519B0", color: "#fff",
            fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
            fontFamily: "'Satoshi', sans-serif",
          }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>person_add</span>
            Invite Member
          </button>
        }
      />

      <div className="prd-page-pad" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Stats */}
          <div className="prd-grid-4">
            <StatCard label="Total Members" value={users.length} icon="group" iconBg="#E6EAF8" iconColor="#0519B0" />
            <StatCard label="Admin" value={users.filter(u => u.role === "ADMIN").length} icon="admin_panel_settings" iconBg="#FAF1FF" iconColor="#7B3DA0" />
            <StatCard label="Active" value={users.filter(u => u.isActive).length} icon="check_circle" iconBg="#E6F4ED" iconColor="#1F8A5B" />
            <StatCard label="PRDs This Month" value={users.reduce((s, u) => s + u._count.prds, 0)} icon="description" iconBg="#DDEFEF" iconColor="#137A7A" />
          </div>

          {/* Table */}
          <div className="prd-table-scroll" style={{ background: "#fff", border: "1px solid var(--p-card-border,#EAEAEA)", borderRadius: 12 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--p-card-border,#EAEAEA)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: "#141932" }}>Team Members</h3>
              <input
                placeholder="Search members…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #DCDCDC", fontSize: 13, width: "min(200px, 100%)", outline: "none", fontFamily: "'Satoshi', sans-serif" }}
              />
            </div>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#FAFAFA" }}>
                  {["Member", "Role", "PRDs", "Status", "Joined", ""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8C92AD", padding: "12px 16px", borderBottom: "1px solid var(--p-card-border,#EAEAEA)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding: 48, textAlign: "center", color: "#8C92AD", fontSize: 14 }}>Memuat…</td></tr>
                ) : filtered.map(u => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} style={{ transition: "background 120ms" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#FAFAFA"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar name={u.name} isSelf={isSelf} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#141932" }}>
                              {u.name}{isSelf && <span style={{ marginLeft: 6, fontSize: 12, color: "#8C92AD", fontWeight: 500 }}>(you)</span>}
                            </div>
                            <div style={{ fontSize: 12, color: "#8C92AD", fontFamily: "'JetBrains Mono', monospace" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                        <button
                          onClick={() => !isSelf && toggleRole(u)}
                          disabled={isSelf}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "2px 10px", borderRadius: 999, height: 22, border: "1px solid",
                            fontSize: 11, fontWeight: 700, cursor: isSelf ? "default" : "pointer",
                            background: u.role === "ADMIN" ? "#FAF1FF" : "#F2F2F2",
                            color: u.role === "ADMIN" ? "#7B3DA0" : "#4A4F6A",
                            borderColor: u.role === "ADMIN" ? "#E1CBEF" : "#DCDCDC",
                            opacity: isSelf ? 1 : 1,
                          }}
                        >
                          {u.role}
                          {!isSelf && <span className="material-symbols-rounded" style={{ fontSize: 12 }}>swap_horiz</span>}
                        </button>
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)", fontWeight: 700, color: "#141932" }}>{u._count.prds}</td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "2px 10px", borderRadius: 999, height: 22,
                          fontSize: 11, fontWeight: 700,
                          background: u.isActive ? "#E6F4ED" : "#F2F2F2",
                          color: u.isActive ? "#1F8A5B" : "#4A4F6A",
                          border: `1px solid ${u.isActive ? "#BFE3D0" : "#DCDCDC"}`,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: 99, background: "currentColor" }} />
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)", fontSize: 13, color: "#8C92AD" }}>
                        {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--p-card-border)" }}>
                        {!isSelf && (
                          <button onClick={() => deleteUser(u.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#DCDCDC", display: "flex", alignItems: "center", padding: 4, borderRadius: 6, transition: "color 150ms" }}
                            onMouseEnter={e => { e.currentTarget.style.color = "#EB0B54"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "#DCDCDC"; }}>
                            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvite={u => { setUsers(prev => [...prev, u]); setShowInvite(false); }}
        />
      )}
    </div>
  );
}
