export const metadata = { title: "Terms of Service — UGC Tracker" };

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px", fontFamily: "sans-serif", lineHeight: 1.6 }}>
      <h1>Terms of Service</h1>
      <p>
        UGC Tracker is a personal, single-user tool used to track content performance and payments for
        one individual&apos;s own social media accounts. It is not offered as a public service, and no
        other accounts or user data are processed by this application.
      </p>
      <p>Last updated: {new Date().getFullYear()}.</p>
    </div>
  );
}
