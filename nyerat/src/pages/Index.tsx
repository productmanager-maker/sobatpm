import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";

const philosophies = [
  {
    icon: "✍️",
    title: "Tulis untuk Bertahan",
    desc: "Ide yang tidak dituliskan akan hilang. Setiap keputusan, diskusi, dan pengetahuan tim terdokumentasi rapi.",
  },
  {
    icon: "🤝",
    title: "Kolaborasi Nyata",
    desc: "Satu halaman, banyak kepala. Real-time collaboration untuk tim yang bergerak cepat.",
  },
  {
    icon: "🔍",
    title: "Temukan, Bukan Cari",
    desc: "Full-text search, tag, notebook, dan database terstruktur. Informasi datang ke kamu.",
  },
  {
    icon: "🏛️",
    title: "Milik Tim, Selamanya",
    desc: "Data di server sendiri. Tidak ada vendor lock-in. Knowledge tim adalah aset tim.",
  },
];

const featureGroups = [
  {
    title: "Editor Blok",
    items: ["Block-based editor (BlockNote)", "Slash commands", "Embed YouTube, Figma, Sheets", "Spreadsheet dengan formula", "Drawing & PDF blocks"],
  },
  {
    title: "Organisasi & Navigasi",
    items: ["Workspaces & notebooks", "Nested pages tree", "Tags & favorites", "Database views (Table, Kanban, Calendar, Gallery)"],
  },
  {
    title: "Kolaborasi",
    items: ["Real-time presence", "Share publik via link", "Komentar & reminders", "Notifikasi tim"],
  },
  {
    title: "Produktivitas & AI",
    items: ["Sobat PM — PRD coach", "AI writing assistant", "Notion & ClickUp integration", "Google Drive backup", "Templates"],
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,hsl(var(--primary)/0.15)_0%,transparent_65%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="font-serif text-[clamp(64px,14vw,160px)] font-normal leading-none tracking-tight text-primary">
            Nyerat
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[5px] text-muted-foreground">/ ɲərat /</p>
          <p className="mt-6 font-serif text-[clamp(18px,3.5vw,30px)]">
            Kata kerja yang berarti{" "}
            <em className="italic text-yellow-600 dark:text-yellow-400">"menulis"</em>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[3px] text-muted-foreground">
            Bahasa Jawa Krama · Nusantara
          </p>
          <p className="mt-10 text-base italic text-primary">Tulis. Simpan. Temukan.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Mulai Nyerat →
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition hover:bg-accent"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* Asal Nama */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-3 text-center font-serif text-3xl md:text-4xl">Asal Nama</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
          <strong>Nyerat</strong> berasal dari kata dasar <em>serat</em> (tulisan/surat) ditambah awalan aktif <em>ny-</em>,
          membentuk kata kerja yang berarti tindakan menulis dalam Bahasa Jawa Krama (ragam halus).
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Bahasa", value: "Jawa Krama" },
            { label: "Kata Dasar", value: "serat" },
            { label: "Makna", value: "menulis" },
          ].map((c) => (
            <div key={c.label} className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
              <div className="font-serif text-2xl">{c.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filosofi */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center font-serif text-3xl md:text-4xl">Empat Filosofi</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {philosophies.map((p) => (
            <div key={p.title} className="rounded-lg border bg-card p-6 transition hover:border-primary/40">
              <div className="mb-3 text-3xl">{p.icon}</div>
              <h3 className="mb-2 font-serif text-lg">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center font-serif text-3xl md:text-4xl">Fitur Platform</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {featureGroups.map((g) => (
            <div key={g.title} className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 font-serif text-xl text-primary">{g.title}</h3>
              <ul className="space-y-2">
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

      {/* Quote */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <blockquote className="font-serif text-2xl italic md:text-3xl">
          "Kulo pun dangu mboten nyerat"
        </blockquote>
        <p className="mt-4 text-sm text-muted-foreground">— sudah lama saya tidak menulis</p>
      </section>

      {/* CTA bottom */}
      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <h2 className="mb-6 font-serif text-3xl md:text-4xl">Siap mulai nyerat?</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Mulai Nyerat →
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            Masuk
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        Nyerat · Tulis. Simpan. Temukan. · Platform knowledge management internal · 2026
      </footer>
    </div>
  );
}

export default function Index() {
  const { user, loading } = useAuthStore();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (user) return <Navigate to="/app" replace />;
  return <Landing />;
}
