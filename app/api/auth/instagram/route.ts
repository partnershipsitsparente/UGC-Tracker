import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { buildAuthUrl } from "@/lib/instagram";

export async function GET(req: NextRequest) {
  const redirectUri = `${req.nextUrl.origin}/api/auth/instagram/callback`;
  const state = crypto.randomBytes(16).toString("hex");

  const authUrl = buildAuthUrl({ redirectUri, state });

  const res = NextResponse.redirect(authUrl);
  res.cookies.set("instagram_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
