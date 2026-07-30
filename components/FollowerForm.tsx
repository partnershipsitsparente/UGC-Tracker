"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function FollowerForm({ onSaved }: { onSaved: () => void }) {
  const { authedFetch } = useAuth();
  const [platform, setPlatform] = useState("TIKTOK");
  const [count, setCount] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!count) return;
    setSaving(true);
    await authedFetch("/api/followers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, count }),
    });
    setSaving(false);
    setCount("");
    setOpen(false);
    onSaved();
  }

  if (!open) {
    return (
      <button className="btn-ghost" onClick={() => setOpen(true)} style={{ marginBottom: 40 }}>
        + Log follower count
      </button>
    );
  }

  return (
    <form className="panel" onSubmit={handleSubmit} style={{ marginTop: -20 }}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="fp-platform">Platform</label>
          <select id="fp-platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="TIKTOK">TikTok</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="YOUTUBE">YouTube</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="fp-count">Follower count</label>
          <input id="fp-count" type="number" min="0" value={count} onChange={(e) => setCount(e.target.value)} />
        </div>
      </div>
      <button className="btn" type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
