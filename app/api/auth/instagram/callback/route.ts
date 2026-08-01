import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, saveInstagramAccount } from "@/lib/instagram";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const errorParam = req.nextUrl.searchParams.get("error") || req.nextUrl.searchParams.get("error_description");

  const savedState = req.cookies.get("instagram_oauth_state")?.value;

  if (errorParam) {
    return NextResponse.redirect(`${req.nextUrl.origin}/videos?instagram_error=${encodeURIComponent(errorParam)}`);
  }

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${req.nextUrl.origin}/videos?instagram_error=invalid_state`);
  }

  try {
    const redirectUri = `${req.nextUrl.origin}/api/auth/instagram/callback`;
    const shortLived = await exchangeCodeForToken(code, redirectUri);
    await saveInstagramAccount(shortLived);
  } catch (e) {
    console.error("Instagram OAuth callback error:", e);
    const message = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.redirect(`${req.nextUrl.origin}/videos?instagram_error=${encodeURIComponent(message)}`);
  }

  const res = NextResponse.redirect(`${req.nextUrl.origin}/videos?instagram_connected=1`);
  res.cookies.delete("instagram_oauth_state");
  return res;
}
