export default function WaveDivider({ fill, flip = false }: { fill: string; flip?: boolean }) {
  return (
    <div className="pf-wave" style={{ transform: flip ? "scaleY(-1)" : undefined }} aria-hidden="true">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" width="100%" height="60">
        <path
          d="M0,30 C150,60 350,0 600,30 C850,60 1050,0 1200,30 L1200,60 L0,60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
