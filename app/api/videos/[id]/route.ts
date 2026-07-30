import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireUser, AuthError } from "@/lib/authServer";


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const body = await req.json();
  const data: Record<string, unknown> = { updatedAt: new Date().toISOString() };

  for (const field of ["caption", "brand", "url", "platform", "postedAt"]) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  for (const field of ["views", "likes", "comments", "shares"]) {
    if (body[field] !== undefined) data[field] = Number(body[field]);
  }

  await adminDb.collection("videos").doc(params.id).update(data);
  const updated = await adminDb.collection("videos").doc(params.id).get();
  return NextResponse.json({ id: updated.id, ...updated.data() });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  await adminDb.collection("videos").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
