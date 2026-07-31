export const metadata = { title: "Privacy Policy — UGC Tracker" };

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px", fontFamily: "sans-serif", lineHeight: 1.6 }}>
      <h1>Privacy Policy</h1>
      <p>
        UGC Tracker is a personal, single-user tool. Data pulled from connected platforms (such as
        video view counts and follower counts) is used solely to display statistics to the account
        owner within this application, and is not shared with, sold to, or accessed by any third
        party. No other individuals&apos; data is collected or processed.
      </p>
      <p>Last updated: {new Date().getFullYear()}.</p>
    </div>
  );
}
