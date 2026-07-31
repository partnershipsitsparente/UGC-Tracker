import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { buildAuthUrl, generateCodeVerifier, codeChallengeFromVerifier } from "@/lib/tiktok";

export async function GET(req: NextRequest) {
  const redirectUri = `${req.nextUrl.origin}/api/auth/tiktok/callback`;
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = codeChallengeFromVerifier(codeVerifier);

  const authUrl = buildAuthUrl({ redirectUri, state, codeChallenge });

  const res = NextResponse.redirect(authUrl);
  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    maxAge: 600,
    path: "/",
  };
  res.cookies.set("tiktok_oauth_state", state, cookieOpts);
  res.cookies.set("tiktok_code_verifier", codeVerifier, cookieOpts);
  return res;
}
