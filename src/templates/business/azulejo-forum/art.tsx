import { useId } from "react";
import { polar } from "../_shared/geo";

// Azulejo Forum — a heritage & design forum in Panjim: hand-painted cobalt tiles (each tile = quarter motif,
// four make a rosette), a blue-and-white street-sign plaque for the title, and a tile border.

/** One 100×100 azulejo tile: corner quarter-rosettes + a central star-flower. data-az for flip-in. */
export function Tile({ className = "", style, variant = 0 }: { className?: string; style?: React.CSSProperties; variant?: number }) {
  const petals = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  const ink = "#1f4e9c";
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <rect width="100" height="100" fill="#f8f6f0" />
      {[[0, 0], [100, 0], [0, 100], [100, 100]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="26" fill="none" stroke={ink} strokeWidth="3" />
          <circle cx={x} cy={y} r="15" fill={ink} />
          <circle cx={x} cy={y} r="7" fill="#f8f6f0" />
        </g>
      ))}
      <g>
        {petals.map((a, i) => <path key={i} d={`M50 50Q${polar(50, 50, 20, a - 0.35)} ${polar(50, 50, 24, a)}Q${polar(50, 50, 20, a + 0.35)} 50 50Z`} fill={variant % 2 ? "#13294b" : ink} />)}
        <circle cx="50" cy="50" r="6" fill="#d9a441" />
      </g>
      {[[50, 4], [96, 50], [50, 96], [4, 50]].map(([x, y], i) => <path key={i} d={`M${x - 5} ${y}L${x} ${y - 4}L${x + 5} ${y}L${x} ${y + 4}Z`} fill={ink} />)}
      <rect width="100" height="100" fill="none" stroke="#c9d3e6" strokeWidth="1" />
    </svg>
  );
}

/** Tile wall — n×m tiles, each wrapped for animation. */
export function TileWall({ cols = 6, rows = 3, className = "" }: { cols?: number; rows?: number; className?: string }) {
  return (
    <div aria-hidden className={`grid ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols * rows }, (_, i) => <div key={i} data-az className="aspect-square [perspective:600px]"><Tile variant={i} className="h-full w-full" /></div>)}
    </div>
  );
}

/** Rope-and-bead tile border strip. viewBox 400×24. */
export function Border({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 24" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <defs><pattern id={`p${id}`} width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#1f4e9c" /><circle cx="12" cy="12" r="6" fill="#f8f6f0" /><circle cx="12" cy="12" r="2.5" fill="#d9a441" /><path d="M0 0L6 6M24 0L18 6M0 24L6 18M24 24L18 18" stroke="#f8f6f0" strokeWidth="1.5" /></pattern></defs>
      <rect width="400" height="24" fill={`url(#p${id})`} />
    </svg>
  );
}

export const AZ_CSS = `
.az-paper{background-color:#f8f6f0;background-image:radial-gradient(70% 40% at 50% 0%,rgba(31,78,156,.06),transparent 70%)}
.az-plaque{background:#f8f6f0;box-shadow:0 0 0 3px #f8f6f0,0 0 0 6px #1f4e9c,0 0 0 8px #f8f6f0,0 0 0 9px #1f4e9c,0 30px 60px -30px rgba(19,41,75,.5)}
.az-still *{animation:none!important}
`;
