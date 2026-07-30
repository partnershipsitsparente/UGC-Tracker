import "./globals.css";
import AppFrame from "@/components/AppFrame";

export const metadata = {
  title: "UGC Ledger",
  description: "Track views, followers, and payouts across your UGC content.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
