import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const [justBack, setJustBack] = useState(false);

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      setJustBack(true);
      window.setTimeout(() => setJustBack(false), 3000);
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online && !justBack) return null;
  if (!online) {
    return (
      <div className="flex items-center justify-center gap-2 bg-amber-500/15 px-4 py-1.5 text-xs text-amber-700 dark:text-amber-300">
        <WifiOff className="h-3.5 w-3.5" />
        You're offline — changes will sync when reconnected.
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 bg-emerald-500/15 px-4 py-1.5 text-xs text-emerald-700 dark:text-emerald-300">
      <Wifi className="h-3.5 w-3.5" />
      Back online — all changes saved ✓
    </div>
  );
}
