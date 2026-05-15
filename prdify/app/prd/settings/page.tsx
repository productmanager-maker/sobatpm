"use client";
import { useState } from "react";
import { TopBar } from "@/components/prd/topbar";
import { Bell, Palette, Database, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Ihsan Nugraha");
  const email = "product.manager@sekolahmu.co.id";
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sections = [
    { icon: Bell, label: "Notifikasi", desc: "Email dan in-app notifications" },
    { icon: Palette, label: "Tampilan", desc: "Tema, bahasa, density" },
    { icon: Database, label: "Integrasi", desc: "ClickUp, Notion, Jira, Google Drive" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Settings" subtitle="Kelola preferensi dan konfigurasi akun" />
      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        <div className="max-w-2xl space-y-4">
          {/* Profile card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-sm text-slate-900 mb-4">Profile</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">IN</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{name}</p>
                <p className="text-sm text-slate-500">{email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Nama</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0519B0] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Email</label>
                <input
                  value={email}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-slate-100 rounded-lg bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Organisasi</label>
                <input
                  defaultValue="SID / Sekolah.mu"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0519B0] focus:border-transparent"
                />
              </div>
              <button
                onClick={save}
                className="px-4 py-2 bg-[#0519B0] text-white text-sm font-medium rounded-lg hover:bg-[#000B8A] transition-colors"
              >
                {saved ? "✓ Tersimpan" : "Simpan"}
              </button>
            </div>
          </div>

          {/* Other settings sections */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {sections.map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-left"
              >
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </button>
            ))}
          </div>

          {/* Version info */}
          <div className="text-center">
            <p className="text-xs text-slate-400">Sobat PM v1.0.0 · Built for SID/Sekolah.mu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
