"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/videos", label: "Videos" },
  { href: "/payments", label: "Payouts" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="topnav">
      <div className="wordmark">
        UGC<span>Tracker</span>
      </div>
      <div className="navlinks">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>
            {link.label}
          </Link>
        ))}
        <a href="/portfolio" target="_blank" rel="noopener noreferrer">
          Portfolio ↗
        </a>
        <button className="btn-danger" onClick={() => logout()} style={{ fontSize: 14 }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
