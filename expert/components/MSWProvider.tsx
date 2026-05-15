"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(
    // If SW already controls this page (return visit/refresh), render immediately
    typeof navigator !== "undefined" && !!navigator.serviceWorker?.controller
  );

  useEffect(() => {
    if (mswReady) return;
    import("../mocks/browser")
      .then(({ worker }) => worker.start({
        serviceWorker: { url: "/expert/mockServiceWorker.js" },
        onUnhandledRequest: "bypass",
      }))
      .then(() => setMswReady(true));
  }, [mswReady]);

  if (!mswReady) return (
    <div style={{
      height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--neutral-100, #f5f5f5)",
    }}>
      <div style={{ width: 24, height: 24, border: "3px solid #e0e0e0", borderTopColor: "#5C6AC4", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return <>{children}</>;
}
