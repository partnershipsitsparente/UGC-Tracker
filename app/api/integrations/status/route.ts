import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireUser, AuthError } from "@/lib/authServer";

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const tiktokDoc = await adminDb.collection("integrations").doc("tiktok").get();

  return NextResponse.json({
    tiktok: tiktokDoc.exists,
  });
}
