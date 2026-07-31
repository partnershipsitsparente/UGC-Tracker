import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/authServer";
import { listTikTokAccounts } from "@/lib/tiktok";

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const accounts = await listTikTokAccounts();

  return NextResponse.json({
    tiktokAccounts: accounts.map((a) => ({ openId: a.openId, username: a.username, connectedAt: a.connectedAt })),
  });
}
