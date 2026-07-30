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

  for (const field of ["brand", "notes", "videoId", "status"]) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  if (body.amount !== undefined) data.amount = Number(body.amount);
  if (body.dueDate !== undefined) data.dueDate = body.dueDate;
  if (body.paidDate !== undefined) data.paidDate = body.paidDate;

  await adminDb.collection("payments").doc(params.id).update(data);
  const updated = await adminDb.collection("payments").doc(params.id).get();
  return NextResponse.json({ id: updated.id, ...updated.data() });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  await adminDb.collection("payments").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
