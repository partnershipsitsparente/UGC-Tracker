import { formatCompactNumber, formatDate, PLATFORM_LABEL } from "@/lib/format";

type Video = {
  id: string;
  platform: string;
  caption: string | null;
  brand: string | null;
  postedAt: string | Date | null;
  views: number;
  likes: number;
  comments: number;
  tiktokAccountName?: string | null;
  instagramAccountName?: string | null;
};

export default function VideoRow({ video, onDelete }: { video: Video; onDelete?: (id: string) => void }) {
  const subline = video.tiktokAccountName || video.instagramAccountName || video.brand || "No brand tagged";

  return (
    <div className="video-row">
      <span className="platform-tag">{PLATFORM_LABEL[video.platform] || video.platform}</span>
      <div className="video-meta">
        <div className="video-brand">
          {subline} · {formatDate(video.postedAt)}
        </div>
        <div className="video-caption">{video.caption || "Untitled video"}</div>
      </div>
      <div className="video-stats">
        <span>
          <strong>{formatCompactNumber(video.views)}</strong> views
        </span>
        <span>
          <strong>{formatCompactNumber(video.likes)}</strong> likes
        </span>
        <span>
          <strong>{formatCompactNumber(video.comments)}</strong> comments
        </span>
        {onDelete && (
          <button className="btn-danger" onClick={() => onDelete(video.id)}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
