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

  const snap = await adminDb.collection("followerSnapshots").orderBy("recordedAt", "desc").get();
  const snapshots = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const latestByPlatform: Record<string, number> = {};
  for (const s of snapshots as { platform: string; count: number }[]) {
    if (latestByPlatform[s.platform] === undefined) latestByPlatform[s.platform] = s.count;
  }

  return NextResponse.json(latestByPlatform);
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const body = await req.json();

  const doc = await adminDb.collection("followerSnapshots").add({
    platform: body.platform,
    count: Number(body.count),
    recordedAt: new Date().toISOString(),
  });

  const created = await doc.get();
  return NextResponse.json({ id: created.id, ...created.data() }, { status: 201 });
}
