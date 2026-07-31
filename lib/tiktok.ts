import crypto from "crypto";
import { adminDb } from "./firebaseAdmin";

const TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const SCOPES = "user.info.basic,user.info.stats,video.list";

export function base64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generateCodeVerifier() {
  return base64url(crypto.randomBytes(32));
}

export function codeChallengeFromVerifier(verifier: string) {
  return base64url(crypto.createHash("sha256").update(verifier).digest());
}

export function buildAuthUrl({
  redirectUri,
  state,
  codeChallenge,
}: {
  redirectUri: string;
  state: string;
  codeChallenge: string;
}) {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY || "",
    scope: SCOPES,
    response_type: "code",
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  open_id: string;
  scope: string;
  token_type: string;
};

export async function exchangeCodeForToken(code: string, redirectUri: string, codeVerifier: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY || "",
      client_secret: process.env.TIKTOK_CLIENT_SECRET || "",
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error_description || data.error || "TikTok token exchange failed");
  }
  return data as TokenResponse;
}

export async function refreshTikTokToken(refreshToken: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY || "",
      client_secret: process.env.TIKTOK_CLIENT_SECRET || "",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error_description || data.error || "TikTok token refresh failed");
  }
  return data as TokenResponse;
}

export async function saveTikTokTokens(tokens: TokenResponse) {
  await adminDb
    .collection("integrations")
    .doc("tiktok")
    .set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      openId: tokens.open_id,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      connectedAt: new Date().toISOString(),
    });
}

export async function getValidTikTokAccessToken(): Promise<string | null> {
  const doc = await adminDb.collection("integrations").doc("tiktok").get();
  if (!doc.exists) return null;

  const data = doc.data() as { accessToken: string; refreshToken: string; expiresAt: number };

  // Refresh if the token expires within the next 5 minutes.
  if (Date.now() > data.expiresAt - 5 * 60 * 1000) {
    const refreshed = await refreshTikTokToken(data.refreshToken);
    await saveTikTokTokens(refreshed);
    return refreshed.access_token;
  }

  return data.accessToken;
}
