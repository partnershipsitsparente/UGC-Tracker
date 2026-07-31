import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/authServer";
import { removeTikTokAccount } from "@/lib/tiktok";

export async function DELETE(req: NextRequest, { params }: { params: { openId: string } }) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  await removeTikTokAccount(params.openId);
  return NextResponse.json({ ok: true });
}
