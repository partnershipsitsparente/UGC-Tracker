"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function TikTokConnect({ onSynced }: { onSynced: () => void }) {
  const { authedFetch } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [connected, setConnected] = useState<boolean | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkStatus();

    if (searchParams.get("tiktok_connected")) {
      setMessage("TikTok connected. Click \"Sync now\" to pull in your videos.");
      router.replace("/videos");
    }
    if (searchParams.get("tiktok_error")) {
      setError(`TikTok connection failed: ${searchParams.get("tiktok_error")}`);
      router.replace("/videos");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkStatus() {
    const res = await authedFetch("/api/integrations/status");
    const data = await res.json();
    setConnected(!!data.tiktok);
  }

  async function handleSync() {
    setSyncing(true);
    setError("");
    setMessage("");
    const res = await authedFetch("/api/sync/tiktok", { method: "POST" });
    const data = await res.json();
    setSyncing(false);

    if (!res.ok) {
      setError(data.error || "Sync failed.");
      return;
    }

    setMessage(`Synced ${data.syncedVideos} video${data.syncedVideos === 1 ? "" : "s"}.`);
    onSynced();
  }

  if (connected === null) return null;

  return (
    <div className="panel" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>TikTok</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {connected ? "Connected — syncs your views, likes, comments, and follower count." : "Not connected yet."}
        </div>
        {message && <div style={{ fontSize: 13, color: "var(--success)", marginTop: 6 }}>{message}</div>}
        {error && <p className="error-text">{error}</p>}
      </div>
      {connected ? (
        <button className="btn-ghost" onClick={handleSync} disabled={syncing}>
          {syncing ? "Syncing…" : "Sync now"}
        </button>
      ) : (
        <a className="btn" href="/api/auth/tiktok" style={{ textDecoration: "none" }}>
          Connect TikTok
        </a>
      )}
    </div>
  );
}
