export function AuthBrandPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 lg:w-[45%] flex-col justify-between bg-zinc-900 p-12 text-zinc-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_30%,rgba(124,106,247,0.18)_0%,transparent_70%)]" />
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📓</span>
          <span className="text-lg font-semibold tracking-tight">Nyerat</span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">Tulis. Simpan. Temukan.</p>
      </div>

      <div className="relative z-10 my-12">
        <h2 className="font-serif text-7xl lg:text-8xl text-zinc-50 leading-none drop-shadow-[0_0_40px_rgba(124,106,247,0.35)]">
          Nyerat
        </h2>
        <p className="mt-3 text-xs uppercase tracking-[5px] text-zinc-400">
          / ɲərat / — Jawa Krama · menulis
        </p>
        <blockquote className="mt-8 font-serif text-xl italic text-zinc-300">
          "Kulo pun dangu mboten nyerat"
        </blockquote>
        <p className="mt-1 text-xs text-zinc-500">— sudah lama saya tidak menulis</p>
      </div>

      <ul className="relative z-10 space-y-2 text-sm text-zinc-300">
        <li>✍️ Tulis untuk Bertahan</li>
        <li>🤝 Kolaborasi Nyata</li>
        <li>🏛️ Milik Tim, Selamanya</li>
      </ul>
    </div>
  );
}
