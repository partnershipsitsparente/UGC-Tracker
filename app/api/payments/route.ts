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

  const snap = await adminDb.collection("payments").orderBy("createdAt", "desc").get();
  const payments = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: 401 });
    throw e;
  }

  const body = await req.json();

  const doc = await adminDb.collection("payments").add({
    videoId: body.videoId || null,
    brand: body.brand,
    amount: Number(body.amount),
    status: body.status || "PENDING",
    dueDate: body.dueDate || null,
    paidDate: body.paidDate || null,
    notes: body.notes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const created = await doc.get();
  return NextResponse.json({ id: created.id, ...created.data() }, { status: 201 });
}
