"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCompactNumber, formatMoney, PLATFORM_LABEL } from "@/lib/format";
import LedgerEntry from "@/components/LedgerEntry";
import VideoRow from "@/components/VideoRow";
import FollowerForm from "@/components/FollowerForm";
import { useAuth } from "@/components/AuthProvider";

type Video = { id: string; platform: string; views: number; likes: number; comments: number; postedAt: string | null; brand: string | null; caption: string | null; tiktokAccountName?: string | null; instagramAccountName?: string | null };
type Payment = { id: string; brand: string; amount: number; status: string; dueDate: string | null; paidDate: string | null; notes: string | null };
type FollowerStat = { platform: string; accountId: string | null; accountName: string | null; count: number };

export default function OverviewPage() {
  const { authedFetch } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [followers, setFollowers] = useState<FollowerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [vRes, pRes, fRes] = await Promise.all([
      authedFetch("/api/videos"),
      authedFetch("/api/payments"),
      authedFetch("/api/followers"),
    ]);
    setVideos(await vRes.json());
    setPayments(await pRes.json());
    setFollowers(await fRes.json());
    setLoading(false);
  }

  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalPaid = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = payments.filter((p) => p.status !== "PAID").reduce((sum, p) => sum + Number(p.amount), 0);

  if (loading) return <div className="empty-state">Loading…</div>;

  return (
    <>
      <div className="stat-row">
        <div className="stat-cell">
          <div className="stat-label">Total views</div>
          <div className="stat-number">{formatCompactNumber(totalViews)}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Videos tracked</div>
          <div className="stat-number">{videos.length}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Paid out</div>
          <div className="stat-number accent">{formatMoney(totalPaid)}</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Owed to you</div>
          <div className="stat-number" style={{ color: totalPending > 0 ? "var(--alert)" : undefined }}>
            {formatMoney(totalPending)}
          </div>
        </div>
      </div>

      {followers.length > 0 && (
        <div className="stat-row">
          {followers.map((f) => (
            <div className="stat-cell" key={`${f.platform}:${f.accountId || "manual"}`}>
              <div className="stat-label">
                {f.accountName ? `${f.accountName} (${PLATFORM_LABEL[f.platform]})` : `${PLATFORM_LABEL[f.platform]} followers`}
              </div>
              <div className="stat-number">{formatCompactNumber(f.count)}</div>
            </div>
          ))}
        </div>
      )}

      <FollowerForm onSaved={load} />

      <div className="section-heading">
        <h2>Recent videos</h2>
        <Link href="/videos" className="btn-ghost" style={{ textDecoration: "none" }}>
          View all
        </Link>
      </div>
      {videos.length === 0 ? (
        <div className="empty-state">No videos yet. Add your first one on the Videos page.</div>
      ) : (
        <div className="video-list">
          {videos.slice(0, 5).map((v) => (
            <VideoRow key={v.id} video={v} />
          ))}
        </div>
      )}

      <div className="section-heading">
        <h2>Recent payouts</h2>
        <Link href="/payments" className="btn-ghost" style={{ textDecoration: "none" }}>
          View all
        </Link>
      </div>
      {payments.length === 0 ? (
        <div className="empty-state">No payments logged yet. Add one on the Payouts page.</div>
      ) : (
        <div className="ledger">
          {payments.slice(0, 5).map((p) => (
            <LedgerEntry key={p.id} payment={p} readOnly />
          ))}
        </div>
      )}
    </>
  );
}
