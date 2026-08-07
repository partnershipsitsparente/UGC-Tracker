// No JS needed for this effect anymore — it's pure CSS (see .pf-sticker /
// .pf-diamond / .pf-glow rules in portfolio.css). maxTilt is kept as a prop
// so existing call sites don't need touching, but it's no longer used.
export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  return (
    <div className={`pf-sticker ${className}`}>
      <span className="pf-glow" aria-hidden="true" />
      <div className="pf-diamond">{children}</div>
    </div>
  );
}
