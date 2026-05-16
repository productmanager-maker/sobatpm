"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface NotifApi {
  id: string;
  judul: string;
  isi: string;
  dibaca: boolean;
  createdAt: string;
  linkAktivitas: string | null;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

export default function DetailNotifikasiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: n, isLoading } = useQuery<NotifApi | null>({
    queryKey: ["notifikasi", id],
    queryFn: async () => {
      const r = await fetch(`/api/v1/notifikasi/${id}`);
      if (!r.ok) return null;
      return (await r.json()).data ?? null;
    },
  });

  if (isLoading) return <div style={{ padding: 24, color: "var(--text-300)", fontSize: 13 }}>Memuat...</div>;
  if (!n) return <div style={{ padding: 24 }}>Notifikasi tidak ditemukan.</div>;

  return (
    <div>
      <div style={{ background: "var(--neutral-100)", borderBottom: "1px solid var(--neutral-500)", padding: "var(--space-3) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <button onClick={() => router.back()} style={{ background: "var(--neutral-400)", border: "none", borderRadius: "var(--radius-md)", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={18} />
        </button>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Detail Notifikasi</p>
      </div>

      <div style={{ padding: "var(--space-5) var(--space-4)" }}>
        <p style={{ fontSize: "var(--font-label-2-size)", color: "var(--text-300)", marginBottom: "var(--space-2)" }}>
          {fmtDate(n.createdAt)}
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--font-heading-6-size)", marginBottom: "var(--space-4)", lineHeight: 1.4 }}>
          {n.judul}
        </p>
        <p style={{ fontSize: "var(--font-body-3-size)", color: "var(--text-200)", lineHeight: 1.65 }}>
          {n.isi}
        </p>

        {n.linkAktivitas && (
          <Link href={`/presensi/${n.linkAktivitas}`} className="btn btn-primary" style={{ textDecoration: "none", display: "flex", marginTop: "var(--space-6)" }}>
            Lihat Aktivitas
          </Link>
        )}
      </div>
    </div>
  );
}
