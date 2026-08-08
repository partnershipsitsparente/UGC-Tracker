// Pure CSS — see .pf-sticker / .pf-diamond rules in portfolio.css.
// maxTilt kept as a prop so existing call sites don't need touching,
// but it's not used (rotation amount is fixed in CSS now).
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
      <div className="pf-diamond">{children}</div>
    </div>
  );
}
