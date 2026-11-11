import { useId } from "react";
import { r2 } from "../_shared/geo";

// Sunset Terrace — a team sundowner on a Goan rooftop: a banded setting sun over a striped Arabian Sea,
// a terrace balustrade and two silhouetted palms. Clean, editorial, warm.

/** The sun, sliced by horizontal bands (retro-modern). data-sun moves on scroll. viewBox 400×260. */
export function SunSea({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  const bands = [150, 162, 172, 180, 186];
  return (
    <svg viewBox="0 0 400 260" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6b26b" /><stop offset=".55" stopColor="#e2683f" /><stop offset="1" stopColor="#b23a52" /></linearGradient>
        <linearGradient id={`w${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8553d" stopOpacity=".4" /><stop offset="1" stopColor="#c8553d" stopOpacity="0" /></linearGradient>
        <clipPath id={`k${id}`}><rect x="0" y="0" width="400" height="190" /></clipPath>
        <mask id={`m${id}`}>
          <rect width="400" height="260" fill="#fff" />
          {bands.map((y, i) => <rect key={y} x="0" y={y} width="400" height={2 + i * 1.2} fill="#000" />)}
        </mask>
      </defs>
      <g clipPath={`url(#k${id})`}>
        <g data-sun><circle cx="200" cy="150" r="96" fill={`url(#s${id})`} mask={`url(#m${id})`} /></g>
      </g>
      <rect x="0" y="190" width="400" height="70" fill={`url(#w${id})`} />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={r2(130 - i * 14)} y={196 + i * 10} width={r2(140 + i * 28)} height={i < 2 ? 3 : 2} rx="1" fill="#e2683f" opacity={r2(0.75 - i * 0.1)} />)}
      <path d="M0 190H400" stroke="#3e2418" strokeWidth="1.4" />
    </svg>
  );
}

/** Palm silhouette. viewBox 120×220. */
export function Palm({ className = "", style, flip = false }: { className?: string; style?: React.CSSProperties; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className={className} style={{ ...style, ...(flip ? { transform: "scaleX(-1)" } : {}) }} aria-hidden>
      <path d="M62 218C60 170 56 120 64 70" stroke="#3e2418" strokeWidth="5" fill="none" strokeLinecap="round" />
      {[
        "M64 70C44 52 20 54 4 66C24 58 44 62 64 72",
        "M64 70C52 44 30 32 10 34C32 40 50 52 64 72",
        "M64 70C66 42 82 24 104 22C86 34 74 50 64 72",
        "M64 70C86 56 106 60 118 74C100 66 82 66 64 72",
        "M64 70C62 48 58 30 44 14C58 30 64 48 66 70",
      ].map((d, i) => <path key={i} d={d} fill="#3e2418" />)}
    </svg>
  );
}

/** Terrace balustrade — a row of turned balusters. viewBox 400×60. */
export function Balustrade({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 400 60" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <rect x="0" y="0" width="400" height="7" fill="#3e2418" />
      <rect x="0" y="54" width="400" height="6" fill="#3e2418" />
      {Array.from({ length: 20 }, (_, i) => {
        const x = 10 + i * 20;
        return <path key={i} d={`M${x - 3} 7h6v6c4 4 4 10 0 14 5 4 5 14 0 18v9h-6v-9c-5-4-5-14 0-18-4-4-4-10 0-14z`} fill="#3e2418" opacity=".9" />;
      })}
    </svg>
  );
}

export const ST_CSS = `
.st-paper{background-color:#fbf3ea;background-image:radial-gradient(70% 50% at 70% 0%,rgba(246,178,107,.28),transparent 70%),radial-gradient(60% 40% at 0% 100%,rgba(178,58,82,.10),transparent 70%)}
.st-grad{background:linear-gradient(90deg,#b23a52,#e2683f 55%,#f6b26b);-webkit-background-clip:text;background-clip:text;color:transparent}
.st-still *{animation:none!important}
.st-shimmer{animation:stShim 6s ease-in-out infinite}
@keyframes stShim{0%,100%{opacity:1}50%{opacity:.82}}
@media (prefers-reduced-motion: reduce){.st-shimmer{animation:none!important}}
`;
