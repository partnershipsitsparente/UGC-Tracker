# UGC Ledger

Track views, followers, and payouts across your UGC content — manual entry now, with room to wire up TikTok/Instagram/YouTube auto-sync later.

## What's here (Phase 1)

- **Overview** — total views, videos tracked, amount paid out, amount still owed, latest follower counts per platform.
- **Videos** — add a video (platform, link, brand, stats) and see them all in one list.
- **Payouts** — log payments per brand/video, track status (Pending / Paid / Overdue), filter the ledger.
- **Firebase Auth login** — the app is single-user, gated behind a real sign-in (email/password) since it holds your payment info.

Everything is manual entry for now. Views/likes/comments and follower counts are numbers you type in — Phase 2 (below) wires up the platform APIs to fill those in automatically.

## 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project (Google Analytics is optional, you can skip it).
2. **Authentication** → Get started → enable the **Email/Password** provider.
3. Still in Authentication → **Users** tab → **Add user** → create yourself an account with an email + password. There's no public sign-up page in this app on purpose — you're the only user.
4. **Firestore Database** → Create database → start in **production mode** (the app talks to Firestore only through the server-side Admin SDK, so client-side security rules can stay locked down — see below).
5. **Project settings → General** → scroll to "Your apps" → add a **Web app** → copy the config values (`apiKey`, `authDomain`, `projectId`, `appId`).
6. **Project settings → Service accounts** → **Generate new private key** → this downloads a JSON file with `project_id`, `client_email`, and `private_key`.

### Lock down Firestore's default rules

Since only the server (Admin SDK) ever touches Firestore, deny all direct client access. In Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 2. Run it locally

```bash
npm install
cp .env.example .env
```

Fill in `.env` with the values from steps 5 and 6 above. For `FIREBASE_PRIVATE_KEY`, paste the whole key from the JSON file including the `\n` characters — keep the surrounding quotes.

```bash
npm run dev
```

Visit `http://localhost:3000`, sign in with the user you created, and start adding videos/payments.

## 3. Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. In Vercel, "Add New Project" → import that repo. It auto-detects Next.js.
3. Before the first deploy, add all the environment variables from `.env` under **Settings → Environment Variables**. Vercel's env var UI handles multi-line values fine for `FIREBASE_PRIVATE_KEY` — paste it as-is.
4. Also add your Vercel domain (e.g. `your-app.vercel.app`) to Firebase: **Authentication → Settings → Authorized domains**, or sign-in will be blocked.
5. Deploy. Vercel's Hobby (free) plan and Firebase's free Spark plan both comfortably cover personal use — Firestore's free tier is 50K reads / 20K writes a day.

## Phase 2 — auto-sync views & followers

Once you're ready, each platform gets its own sync route that writes back into the same `videos` and `followerSnapshots` collections. Rough shape for each:

- **YouTube (easiest)** — create a Google Cloud project, enable the YouTube Data API v3, generate an API key. An `/api/sync/youtube` route calls `videos.list` with your video IDs and writes `views`/`likes`/`comments` back onto each video doc. No OAuth needed for public videos.
- **TikTok** — register a TikTok Developer app, enable Login Kit + the `video.list` scope, complete the OAuth flow once to get a long-lived token for your own account, then an `/api/sync/tiktok` route pulls your video list and stats on a schedule.
- **Instagram** — convert your IG account to a Business/Creator account linked to a Facebook Page, register a Meta Developer app, use the Graph API's media insights endpoint the same way.

All three follow the same pattern: a scheduled route (Vercel Cron works well on Hobby) that fetches fresh numbers and updates the matching video docs, plus a write to `followerSnapshots` so the trend shows up on the Overview page. Happy to build any of these out with you once you've got the developer app credentials in hand — that's the one part I can't do for you.

## Tech

Next.js 14 (App Router) + TypeScript, Firebase Auth + Firestore (via `firebase` on the client and `firebase-admin` on the server), no external UI framework — plain CSS in `app/globals.css` so the whole visual system is easy to tweak in one place.
