import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, saveTikTokAccount } from "@/lib/tiktok";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const errorParam = req.nextUrl.searchParams.get("error");

  const savedState = req.cookies.get("tiktok_oauth_state")?.value;
  const codeVerifier = req.cookies.get("tiktok_code_verifier")?.value;

  if (errorParam) {
    return NextResponse.redirect(`${req.nextUrl.origin}/videos?tiktok_error=${encodeURIComponent(errorParam)}`);
  }

  if (!code || !state || !codeVerifier || state !== savedState) {
    return NextResponse.redirect(`${req.nextUrl.origin}/videos?tiktok_error=invalid_state`);
  }

  try {
    const redirectUri = `${req.nextUrl.origin}/api/auth/tiktok/callback`;
    const tokens = await exchangeCodeForToken(code, redirectUri, codeVerifier);
    await saveTikTokAccount(tokens);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.redirect(`${req.nextUrl.origin}/videos?tiktok_error=${encodeURIComponent(message)}`);
  }

  const res = NextResponse.redirect(`${req.nextUrl.origin}/videos?tiktok_connected=1`);
  res.cookies.delete("tiktok_oauth_state");
  res.cookies.delete("tiktok_code_verifier");
  return res;
}
