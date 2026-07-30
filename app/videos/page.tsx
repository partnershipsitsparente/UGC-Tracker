"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import VideoRow from "@/components/VideoRow";

type Video = {
  id: string;
  platform: string;
  url: string;
  caption: string | null;
  brand: string | null;
  postedAt: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

const EMPTY_FORM = {
  platform: "TIKTOK",
  url: "",
  caption: "",
  brand: "",
  postedAt: "",
  views: "",
  likes: "",
  comments: "",
  shares: "",
};

export default function VideosPage() {
  const { authedFetch } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await authedFetch("/api/videos");
    const data = await res.json();
    setVideos(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url) {
      setError("A video link is required.");
      return;
    }
    setSaving(true);
    setError("");

    const res = await authedFetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Couldn't save that video. Try again.");
      return;
    }

    setForm(EMPTY_FORM);
    load();
  }

  async function handleDelete(id: string) {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    await authedFetch(`/api/videos/${id}`, { method: "DELETE" });
  }

  return (
    <>
      <div className="section-heading">
        <h2>Add a video</h2>
      </div>
      <form className="panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="platform">Platform</label>
            <select
              id="platform"
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
            >
              <option value="TIKTOK">TikTok</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="YOUTUBE">YouTube</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="url">Video link</label>
            <input
              id="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="field">
            <label htmlFor="brand">Brand / client</label>
            <input
              id="brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <div className="field">
            <label htmlFor="postedAt">Date posted</label>
            <input
              id="postedAt"
              type="date"
              value={form.postedAt}
              onChange={(e) => setForm({ ...form, postedAt: e.target.value })}
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="caption">Caption</label>
            <input
              id="caption"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <div className="field">
            <label htmlFor="views">Views</label>
            <input
              id="views"
              type="number"
              min="0"
              value={form.views}
              onChange={(e) => setForm({ ...form, views: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="likes">Likes</label>
            <input
              id="likes"
              type="number"
              min="0"
              value={form.likes}
              onChange={(e) => setForm({ ...form, likes: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="comments">Comments</label>
            <input
              id="comments"
              type="number"
              min="0"
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
            />
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Add video"}
        </button>
      </form>

      <div className="section-heading">
        <h2>All videos</h2>
      </div>
      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : videos.length === 0 ? (
        <div className="empty-state">No videos yet. Add your first one above.</div>
      ) : (
        <div className="video-list">
          {videos.map((v) => (
            <VideoRow key={v.id} video={v} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}
