"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type Account = { userId: string; username: string; connectedAt: string };

export default function InstagramConnect({ onSynced }: { onSynced: () => void }) {
  const { authedFetch } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkStatus();

    if (searchParams.get("instagram_connected")) {
      setMessage("Instagram account connected. Click \"Sync all\" to pull in its posts.");
      router.replace("/videos");
    }
    if (searchParams.get("instagram_error")) {
      setError(`Instagram connection failed: ${searchParams.get("instagram_error")}`);
      router.replace("/videos");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkStatus() {
    const res = await authedFetch("/api/integrations/status");
    const data = await res.json();
    setAccounts(data.instagramAccounts || []);
  }

  async function handleSync() {
    setSyncing(true);
    setError("");
    setMessage("");
    const res = await authedFetch("/api/sync/instagram", { method: "POST" });
    const data = await res.json();
    setSyncing(false);

    if (!res.ok) {
      setError(data.error || "Sync failed.");
      return;
    }

    const summary = (data.results as { username: string; syncedMedia: number; error?: string }[])
      .map((r) => (r.error ? `${r.username}: failed (${r.error})` : `${r.username}: ${r.syncedMedia} post${r.syncedMedia === 1 ? "" : "s"}`))
      .join(" · ");
    setMessage(summary);
    onSynced();
  }

  async function handleDisconnect(userId: string) {
    await authedFetch(`/api/integrations/instagram/${userId}`, { method: "DELETE" });
    checkStatus();
  }

  if (accounts === null) return null;

  return (
    <div className="panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: accounts.length ? 16 : 0 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Instagram accounts</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {accounts.length === 0
              ? "No accounts connected yet."
              : `${accounts.length} account${accounts.length === 1 ? "" : "s"} connected. Likes and comments sync automatically — view counts aren't available through this login method.`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {accounts.length > 0 && (
            <button className="btn-ghost" onClick={handleSync} disabled={syncing}>
              {syncing ? "Syncing…" : "Sync all"}
            </button>
          )}
          <a className="btn" href="/api/auth/instagram" style={{ textDecoration: "none" }}>
            + Connect account
          </a>
        </div>
      </div>

      {accounts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {accounts.map((a) => (
            <div
              key={a.userId}
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
              <button className="btn-danger" onClick={() => handleDisconnect(a.userId)}>
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
