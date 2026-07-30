import { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";

export async function requireUser(req: NextRequest): Promise<string> {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new AuthError("Missing Authorization header");
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    throw new AuthError("Invalid or expired session");
  }
}

export class AuthError extends Error {}
