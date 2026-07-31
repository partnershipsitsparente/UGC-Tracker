"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type Account = { openId: string; username: string; connectedAt: string };

export default function TikTokConnect({ onSynced }: { onSynced: () => void }) {
  const { authedFetch } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkStatus();

    if (searchParams.get("tiktok_connected")) {
      setMessage("TikTok account connected. Click \"Sync all\" to pull in its videos.");
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
    setAccounts(data.tiktokAccounts || []);
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

    const summary = (data.results as { username: string; syncedVideos: number; error?: string }[])
      .map((r) => (r.error ? `${r.username}: failed (${r.error})` : `${r.username}: ${r.syncedVideos} video${r.syncedVideos === 1 ? "" : "s"}`))
      .join(" · ");
    setMessage(summary);
    onSynced();
  }

  async function handleDisconnect(openId: string) {
    await authedFetch(`/api/integrations/tiktok/${openId}`, { method: "DELETE" });
    checkStatus();
  }

  if (accounts === null) return null;

  return (
    <div className="panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: accounts.length ? 16 : 0 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>TikTok accounts</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {accounts.length === 0
              ? "No accounts connected yet."
              : `${accounts.length} account${accounts.length === 1 ? "" : "s"} connected.`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {accounts.length > 0 && (
            <button className="btn-ghost" onClick={handleSync} disabled={syncing}>
              {syncing ? "Syncing…" : "Sync all"}
            </button>
          )}
          <a className="btn" href="/api/auth/tiktok" style={{ textDecoration: "none" }}>
            + Connect account
          </a>
        </div>
      </div>

      {accounts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {accounts.map((a) => (
            <div
              key={a.openId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "var(--surface-raised)",
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              <span>{a.username}</span>
              <button className="btn-danger" onClick={() => handleDisconnect(a.openId)}>
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}

      {message && <div style={{ fontSize: 13, color: "var(--success)", marginTop: 12 }}>{message}</div>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
