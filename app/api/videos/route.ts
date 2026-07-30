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

  const snap = await adminDb.collection("videos").orderBy("postedAt", "desc").get();
  const videos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const body = await req.json();

  const doc = await adminDb.collection("videos").add({
    platform: body.platform,
    url: body.url,
    caption: body.caption || null,
    brand: body.brand || null,
    postedAt: body.postedAt || null,
    views: Number(body.views) || 0,
    likes: Number(body.likes) || 0,
    comments: Number(body.comments) || 0,
    shares: Number(body.shares) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const created = await doc.get();
  return NextResponse.json({ id: created.id, ...created.data() }, { status: 201 });
}
