"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import LedgerEntry from "@/components/LedgerEntry";

type Payment = {
  id: string;
  brand: string;
  amount: string;
  status: string;
  dueDate: string | null;
  paidDate: string | null;
  notes: string | null;
  videoId: string | null;
};

type VideoOption = { id: string; caption: string | null; brand: string | null };

const EMPTY_FORM = {
  brand: "",
  amount: "",
  status: "PENDING",
  dueDate: "",
  notes: "",
  videoId: "",
};

export default function PaymentsPage() {
  const { authedFetch } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [videos, setVideos] = useState<VideoOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "PAID" | "OVERDUE">("ALL");

  async function load() {
    setLoading(true);
    const [pRes, vRes] = await Promise.all([authedFetch("/api/payments"), authedFetch("/api/videos")]);
    setPayments(await pRes.json());
    setVideos(await vRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand || !form.amount) {
      setError("Brand and amount are required.");
      return;
    }
    setSaving(true);
    setError("");

    const res = await authedFetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, videoId: form.videoId || null }),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Couldn't save that payment. Try again.");
      return;
    }

    setForm(EMPTY_FORM);
    load();
  }

  async function handleStatusChange(id: string, status: string) {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    await authedFetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paidDate: status === "PAID" ? new Date().toISOString() : undefined }),
    });
  }

  async function handleDelete(id: string) {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    await authedFetch(`/api/payments/${id}`, { method: "DELETE" });
  }

  const filtered = filter === "ALL" ? payments : payments.filter((p) => p.status === filter);

  return (
    <>
      <div className="section-heading">
        <h2>Log a payment</h2>
      </div>
      <form className="panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="brand">Brand / client</label>
            <input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="amount">Amount (USD)</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="videoId">Linked video</label>
            <select id="videoId" value={form.videoId} onChange={(e) => setForm({ ...form, videoId: e.target.value })}>
              <option value="">None</option>
              {videos.map((v) => (
                <option key={v.id} value={v.id}>
                  {(v.brand ? `${v.brand} — ` : "") + (v.caption || v.id.slice(0, 8))}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="notes">Notes</label>
            <input
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional"
            />
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Log payment"}
        </button>
      </form>

      <div className="section-heading">
        <h2>Payout ledger</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {(["ALL", "PENDING", "PAID", "OVERDUE"] as const).map((f) => (
            <button
              key={f}
              className="btn-ghost"
              style={{
                borderColor: filter === f ? "var(--accent)" : undefined,
                color: filter === f ? "var(--accent)" : undefined,
              }}
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">Nothing here yet.</div>
      ) : (
        <div className="ledger">
          {filtered.map((p) => (
            <LedgerEntry key={p.id} payment={p} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}
