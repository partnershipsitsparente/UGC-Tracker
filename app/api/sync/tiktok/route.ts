import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireUser, AuthError } from "@/lib/authServer";
import { listTikTokAccounts, getValidAccessTokenFor } from "@/lib/tiktok";

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

  const accounts = await listTikTokAccounts();
  if (accounts.length === 0) {
    return NextResponse.json({ error: "No TikTok accounts connected yet." }, { status: 400 });
  }

  const results: { username: string; syncedVideos: number; followerCount: number | null; error?: string }[] = [];

  for (const account of accounts) {
    const accessToken = await getValidAccessTokenFor(account.openId);
    if (!accessToken) {
      results.push({ username: account.username, syncedVideos: 0, followerCount: null, error: "Token unavailable" });
      continue;
    }

    try {
      // 1. Pull this account's video list.
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
        results.push({
          username: account.username,
          syncedVideos: 0,
          followerCount: null,
          error: videoData.error?.message || "Failed to fetch videos",
        });
        continue;
      }

      const videos: TikTokVideo[] = videoData.data?.videos || [];
      let synced = 0;

      for (const v of videos) {
        const existing = await adminDb.collection("videos").where("tiktokVideoId", "==", v.id).limit(1).get();

        const payload = {
          platform: "TIKTOK",
          tiktokVideoId: v.id,
          tiktokAccountId: account.openId,
          tiktokAccountName: account.username,
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

      // 2. Pull this account's follower count.
      let followerCount: number | null = null;
      const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=follower_count", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();
      if (userRes.ok && userData.data?.user) {
        followerCount = userData.data.user.follower_count;
        await adminDb.collection("followerSnapshots").add({
          platform: "TIKTOK",
          accountId: account.openId,
          accountName: account.username,
          count: followerCount,
          recordedAt: new Date().toISOString(),
        });
      }

      results.push({ username: account.username, syncedVideos: synced, followerCount });
    } catch (e) {
      results.push({
        username: account.username,
        syncedVideos: 0,
        followerCount: null,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({ results });
}
