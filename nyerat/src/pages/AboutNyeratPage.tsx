import { ScrollArea } from "@/components/ui/scroll-area";

const philosophies = [
  { icon: "✍️", title: "Tulis untuk Bertahan", desc: "Ide yang tidak dituliskan akan hilang. Setiap keputusan, diskusi, dan pengetahuan tim terdokumentasi rapi." },
  { icon: "🤝", title: "Kolaborasi Nyata", desc: "Satu halaman, banyak kepala. Real-time collaboration untuk tim yang bergerak cepat." },
  { icon: "🔍", title: "Temukan, Bukan Cari", desc: "Full-text search, tag, notebook, dan database terstruktur." },
  { icon: "🏛️", title: "Milik Tim, Selamanya", desc: "Data di server sendiri. Tidak ada vendor lock-in." },
];

const steps = [
  { n: 1, t: "Buat Akun", d: "Daftar dengan email kantor atau sign-in dengan Google." },
  { n: 2, t: "Halaman Pertama", d: "Klik + di sidebar untuk buat halaman atau database baru." },
  { n: 3, t: "Struktur", d: "Gunakan notebooks dan tags supaya knowledge mudah ditemukan." },
  { n: 4, t: "Kolaborasi", d: "Share halaman, mention rekan, dan kolaborasi real-time." },
];

const shortcuts = [
  ["⌘K", "Command palette / search"],
  ["⌘N", "Buat halaman baru (atau klik + di sidebar)"],
  ["/", "Slash command menu di editor"],
  ["⌘B", "Bold"],
  ["⌘I", "Italic"],
  ["⌘Z", "Undo"],
  ["⌘⇧Z", "Redo"],
];

const featureGroups = [
  { title: "Editor Blok", items: ["Block-based editor (BlockNote)", "Slash commands", "Embed YouTube, Figma, Sheets", "Spreadsheet dengan formula", "Drawing & PDF blocks"] },
  { title: "Organisasi & Navigasi", items: ["Workspaces & notebooks", "Nested pages tree", "Tags & favorites", "Database views (Table, Kanban, Calendar, Gallery)"] },
  { title: "Kolaborasi", items: ["Real-time presence", "Share publik via link", "Komentar & reminders", "Notifikasi tim"] },
  { title: "Produktivitas & AI", items: ["Sobat PM — PRD coach", "AI writing assistant", "Notion & ClickUp integration", "Google Drive backup", "Templates"] },
];

export default function AboutNyeratPage() {
  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-12">
        <header className="text-center">
          <h1 className="font-serif text-6xl text-primary">Nyerat</h1>
          <p className="mt-2 text-xs uppercase tracking-[5px] text-muted-foreground">/ ɲərat /</p>
          <p className="mt-4 italic text-primary">Tulis. Simpan. Temukan.</p>
        </header>

        {/* Etymology */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 font-serif text-2xl">Asal Nama</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            <strong>Nyerat</strong> berasal dari kata dasar <em>serat</em> (tulisan/surat) ditambah awalan aktif <em>ny-</em>,
            membentuk kata kerja yang berarti tindakan menulis dalam Bahasa Jawa Krama (ragam halus).
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Bahasa", value: "Jawa Krama" },
              { label: "Kata Dasar", value: "serat" },
              { label: "Makna", value: "menulis" },
            ].map((c) => (
              <div key={c.label} className="rounded-md border p-4 text-center">
                <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <div className="font-serif text-xl">{c.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Filosofi */}
        <section>
          <h2 className="mb-6 font-serif text-2xl">Empat Filosofi</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {philosophies.map((p) => (
              <div key={p.title} className="rounded-lg border bg-card p-5">
                <div className="mb-2 text-2xl">{p.icon}</div>
                <h3 className="mb-1 font-serif text-lg">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="rounded-lg border bg-card p-8 text-center">
          <blockquote className="font-serif text-2xl italic">"Kulo pun dangu mboten nyerat"</blockquote>
          <p className="mt-3 text-sm text-muted-foreground">— sudah lama saya tidak menulis</p>
        </section>

        {/* Panduan Tim */}
        <section>
          <h2 className="mb-6 font-serif text-2xl">Panduan Tim</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-3 rounded-lg border bg-card p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-medium">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shortcuts */}
        <section>
          <h2 className="mb-6 font-serif text-2xl">Keyboard Shortcuts</h2>
          <div className="grid gap-2 rounded-lg border bg-card p-5 md:grid-cols-2">
            {shortcuts.map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 text-sm">
                <kbd className="min-w-[60px] rounded border bg-background px-2 py-1 text-center text-xs">{k}</kbd>
                <span className="text-muted-foreground">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="mb-6 font-serif text-2xl">Fitur Platform</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featureGroups.map((g) => (
              <div key={g.title} className="rounded-lg border bg-card p-5">
                <h3 className="mb-3 font-serif text-lg text-primary">{g.title}</h3>
                <ul className="space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">·</span> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
