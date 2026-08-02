import { adminDb } from "./firebaseAdmin";

const AUTH_URL = "https://www.instagram.com/oauth/authorize";
const TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const GRAPH_URL = "https://graph.instagram.com";
const SCOPES = "instagram_business_basic";

export function buildAuthUrl({ redirectUri, state }: { redirectUri: string; state: string }) {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

type ShortLivedTokenResponse = { access_token: string; user_id: string; permissions?: string };
type LongLivedTokenResponse = { access_token: string; token_type: string; expires_in: number };

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const body = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID || "",
    client_secret: process.env.INSTAGRAM_APP_SECRET || "",
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetch(TOKEN_URL, { method: "POST", body });
  const json = await res.json();
  console.log("Instagram code->token response:", JSON.stringify(json));
  if (!res.ok || json.error_message) {
    throw new Error(json.error_message || "Instagram token exchange failed");
  }

  // Instagram wraps this response in a `data` array: { data: [{ access_token, user_id, permissions }] }
  const entry = Array.isArray(json.data) ? json.data[0] : json;
  if (!entry?.user_id || !entry?.access_token) {
    throw new Error("Instagram token exchange returned an unexpected response shape: " + JSON.stringify(json));
  }
  return entry as ShortLivedTokenResponse;
}

export async function exchangeForLongLivedToken(shortLivedToken: string) {
  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: process.env.INSTAGRAM_APP_SECRET || "",
    access_token: shortLivedToken,
  });

  const res = await fetch(`${GRAPH_URL}/v21.0/access_token?${params.toString()}`);
  const data = await res.json();
  console.log("Instagram long-lived token response:", JSON.stringify(data));
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Instagram long-lived token exchange failed");
  }
  return data as LongLivedTokenResponse;
}

export async function refreshLongLivedToken(longLivedToken: string) {
  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: longLivedToken,
  });

  const res = await fetch(`${GRAPH_URL}/refresh_access_token?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Instagram token refresh failed");
  }
  return data as LongLivedTokenResponse;
}

async function fetchUsername(accessToken: string): Promise<string> {
  try {
    const res = await fetch(`${GRAPH_URL}/me?fields=username&access_token=${accessToken}`);
    const data = await res.json();
    console.log("Instagram /me response:", JSON.stringify(data));
    return data?.username || "Connected account";
  } catch (e) {
    console.error("Instagram fetchUsername error:", e);
    return "Connected account";
  }
}

export type InstagramAccount = {
  userId: string;
  username: string;
  accessToken: string;
  expiresAt: number;
  connectedAt: string;
};

// Each connected Instagram account gets its own doc, keyed by its
// Instagram-scoped user ID, so multiple accounts can be connected at once.
export async function saveInstagramAccount(shortLived: ShortLivedTokenResponse) {
  console.log("saveInstagramAccount shortLived:", JSON.stringify(shortLived));
  const longLived = await exchangeForLongLivedToken(shortLived.access_token);
  const username = await fetchUsername(longLived.access_token);
  console.log("saveInstagramAccount doc id:", shortLived.user_id);

  await adminDb
    .collection("instagramAccounts")
    .doc(shortLived.user_id)
    .set(
      {
        userId: shortLived.user_id,
        username,
        accessToken: longLived.access_token,
        expiresAt: Date.now() + longLived.expires_in * 1000,
        connectedAt: new Date().toISOString(),
      },
      { merge: true }
    );
}

export async function listInstagramAccounts(): Promise<InstagramAccount[]> {
  const snap = await adminDb.collection("instagramAccounts").get();
  return snap.docs.map((d) => d.data() as InstagramAccount);
}

export async function removeInstagramAccount(userId: string) {
  await adminDb.collection("instagramAccounts").doc(userId).delete();
}

// Returns a valid access token for one account, refreshing it first if it's
// within 5 days of expiring (long-lived tokens last 60 days and must be
// refreshed periodically to stay alive).
export async function getValidAccessTokenFor(userId: string): Promise<string | null> {
  const doc = await adminDb.collection("instagramAccounts").doc(userId).get();
  if (!doc.exists) return null;

  const data = doc.data() as InstagramAccount;

  if (Date.now() > data.expiresAt - 5 * 24 * 60 * 60 * 1000) {
    const refreshed = await refreshLongLivedToken(data.accessToken);
    await adminDb
      .collection("instagramAccounts")
      .doc(userId)
      .update({
        accessToken: refreshed.access_token,
        expiresAt: Date.now() + refreshed.expires_in * 1000,
      });
    return refreshed.access_token;
  }

  return data.accessToken;
}
