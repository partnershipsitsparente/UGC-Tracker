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
  const snapshots = snap.docs.map((doc) => {
    const data = doc.data() as {
      platform: string;
      count: number;
      recordedAt: string;
      accountId?: string;
      accountName?: string;
    };
    return {
      platform: data.platform,
      count: data.count,
      recordedAt: data.recordedAt,
      accountId: data.accountId || null,
      accountName: data.accountName || null,
    };
  });

  // Keep only the latest snapshot per (platform + account) combination —
  // manual entries with no accountId are grouped by platform alone.
  const seen = new Set<string>();
  const latest: { platform: string; accountId: string | null; accountName: string | null; count: number }[] = [];

  for (const s of snapshots) {
    const key = `${s.platform}:${s.accountId || "manual"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    latest.push({ platform: s.platform, accountId: s.accountId, accountName: s.accountName, count: s.count });
  }

  return NextResponse.json(latest);
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
