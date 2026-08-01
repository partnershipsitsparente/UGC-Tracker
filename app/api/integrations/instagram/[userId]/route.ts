import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/authServer";
import { removeInstagramAccount } from "@/lib/instagram";

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  await removeInstagramAccount(params.userId);
  return NextResponse.json({ ok: true });
}
