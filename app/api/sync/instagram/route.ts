import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireUser, AuthError } from "@/lib/authServer";
import { listInstagramAccounts, getValidAccessTokenFor } from "@/lib/instagram";

const GRAPH_URL = "https://graph.instagram.com";

type IgMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

// Instagram's Business Login API (no linked Facebook Page) exposes like_count
// and comments_count directly on each media item, but not view/reach counts —
// those require the Facebook Login + Page-linked setup instead. Views are
// left at 0 for auto-synced Instagram posts as a result.
async function fetchAllMedia(accessToken: string): Promise<{ media: IgMedia[]; error?: string }> {
  const media: IgMedia[] = [];
  let url: string | null =
    `${GRAPH_URL}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&access_token=${accessToken}`;
  let pages = 0;

  while (url && pages < 10) {
    const res: Response = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
      return { media, error: data.error?.message || "Failed to fetch media" };
    }

    media.push(...(data.data || []));
    url = data.paging?.next || null;
    pages++;
  }

  return { media };
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const accounts = await listInstagramAccounts();
  if (accounts.length === 0) {
    return NextResponse.json({ error: "No Instagram accounts connected yet." }, { status: 400 });
  }

  const results: { username: string; syncedMedia: number; followerCount: number | null; error?: string }[] = [];

  for (const account of accounts) {
    const accessToken = await getValidAccessTokenFor(account.userId);
    if (!accessToken) {
      results.push({ username: account.username, syncedMedia: 0, followerCount: null, error: "Token unavailable" });
      continue;
    }

    try {
      // 1. Pull this account's full media list (across all pages).
      const { media, error: mediaError } = await fetchAllMedia(accessToken);

      if (mediaError && media.length === 0) {
        results.push({ username: account.username, syncedMedia: 0, followerCount: null, error: mediaError });
        continue;
      }

      let synced = 0;

      for (const m of media) {
        const existing = await adminDb.collection("videos").where("instagramMediaId", "==", m.id).limit(1).get();

        const payload = {
          platform: "INSTAGRAM",
          instagramMediaId: m.id,
          instagramAccountId: account.userId,
          instagramAccountName: account.username,
          url: m.permalink || "",
          caption: m.caption || "",
          views: 0,
          likes: m.like_count || 0,
          comments: m.comments_count || 0,
          shares: 0,
          autoSynced: true,
          lastSyncedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (existing.empty) {
          await adminDb.collection("videos").add({
            ...payload,
            brand: null,
            postedAt: m.timestamp || null,
            createdAt: new Date().toISOString(),
          });
        } else {
          await adminDb.collection("videos").doc(existing.docs[0].id).update(payload);
        }
        synced++;
      }

      // 2. Pull this account's follower count.
      let followerCount: number | null = null;
      const profileRes = await fetch(`${GRAPH_URL}/me?fields=followers_count&access_token=${accessToken}`);
      const profileData = await profileRes.json();
      if (profileRes.ok && profileData.followers_count !== undefined) {
        followerCount = profileData.followers_count;
        await adminDb.collection("followerSnapshots").add({
          platform: "INSTAGRAM",
          accountId: account.userId,
          accountName: account.username,
          count: followerCount,
          recordedAt: new Date().toISOString(),
        });
      }

      results.push({ username: account.username, syncedMedia: synced, followerCount });
    } catch (e) {
      results.push({
        username: account.username,
        syncedMedia: 0,
        followerCount: null,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({ results });
}
