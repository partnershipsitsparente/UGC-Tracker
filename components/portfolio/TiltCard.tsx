"use client";

import { useRef } from "react";

export default function TiltCard({
  children,
  className = "",
  maxTilt = 10,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tiltX", `${(-py * maxTilt).toFixed(2)}deg`);
    el.style.setProperty("--tiltY", `${(px * maxTilt).toFixed(2)}deg`);
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tiltX", "0deg");
    el.style.setProperty("--tiltY", "0deg");
  }

  return (
    <div
      ref={ref}
      className={`pf-sticker ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
