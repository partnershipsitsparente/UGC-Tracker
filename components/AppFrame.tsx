"use client";

import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "./AuthProvider";
import NavBar from "./NavBar";
import LoginForm from "./LoginForm";

const PUBLIC_PATHS = ["/terms", "/privacy"];

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="login-shell">
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="shell">
      <NavBar />
      {children}
    </div>
  );
}

export default function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}
