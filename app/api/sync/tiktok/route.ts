import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireUser, AuthError } from "@/lib/authServer";
import { getValidTikTokAccessToken } from "@/lib/tiktok";

type TikTokVideo = {
  id: string;
  title?: string;
  share_url?: string;
  cover_image_url?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
};

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const accessToken = await getValidTikTokAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "TikTok isn't connected yet." }, { status: 400 });
  }

  // 1. Pull the video list.
  const videoRes = await fetch(
    "https://open.tiktokapis.com/v2/video/list/?fields=id,title,share_url,cover_image_url,view_count,like_count,comment_count,share_count",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ max_count: 20 }),
    }
  );
  const videoData = await videoRes.json();

  if (!videoRes.ok || videoData.error?.code !== "ok") {
    return NextResponse.json(
      { error: videoData.error?.message || "Failed to fetch TikTok videos" },
      { status: 502 }
    );
  }

  const videos: TikTokVideo[] = videoData.data?.videos || [];
  let synced = 0;

  for (const v of videos) {
    const existing = await adminDb.collection("videos").where("tiktokVideoId", "==", v.id).limit(1).get();

    const payload = {
      platform: "TIKTOK",
      tiktokVideoId: v.id,
      url: v.share_url || "",
      caption: v.title || "",
      views: v.view_count || 0,
      likes: v.like_count || 0,
      comments: v.comment_count || 0,
      shares: v.share_count || 0,
      autoSynced: true,
      lastSyncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existing.empty) {
      await adminDb.collection("videos").add({
        ...payload,
        brand: null,
        postedAt: null,
        createdAt: new Date().toISOString(),
      });
    } else {
      await adminDb.collection("videos").doc(existing.docs[0].id).update(payload);
    }
    synced++;
  }

  // 2. Pull follower count.
  let followerCount: number | null = null;
  const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=follower_count", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const userData = await userRes.json();
  if (userRes.ok && userData.data?.user) {
    followerCount = userData.data.user.follower_count;
    await adminDb.collection("followerSnapshots").add({
      platform: "TIKTOK",
      count: followerCount,
      recordedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ syncedVideos: synced, followerCount });
}
