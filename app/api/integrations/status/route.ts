import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/authServer";
import { listTikTokAccounts } from "@/lib/tiktok";
import { listInstagramAccounts } from "@/lib/instagram";

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const [tiktokAccounts, instagramAccounts] = await Promise.all([listTikTokAccounts(), listInstagramAccounts()]);

  return NextResponse.json({
    tiktokAccounts: tiktokAccounts.map((a) => ({ openId: a.openId, username: a.username, connectedAt: a.connectedAt })),
    instagramAccounts: instagramAccounts.map((a) => ({ userId: a.userId, username: a.username, connectedAt: a.connectedAt })),
  });
}
