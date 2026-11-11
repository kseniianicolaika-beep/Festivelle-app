import { useId } from "react";

// Hello Badge — a friendly founders' breakfast / meetup: a conference lanyard badge that swings in on its strap
// (data-badge), two coffee cups with curling steam (data-steam) and a dotted sage backdrop.

/** The lanyard strap + clip, drawn above the badge. viewBox 120×200. */
export function Strap({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 200" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <path d="M20 0L52 176M100 0L68 176" stroke="#7d1d3a" strokeWidth="14" strokeLinecap="square" />
      <path d="M20 0L52 176M100 0L68 176" stroke="#f6efe4" strokeWidth="2" strokeDasharray="2 8" />
      <rect x="46" y="170" width="28" height="22" rx="4" fill="#b8a27a" />
      <rect x="54" y="186" width="12" height="14" rx="3" fill="none" stroke="#8a7650" strokeWidth="3" />
    </svg>
  );
}

/** Two cups with steam. viewBox 200×120. */
export function Coffee({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  const cup = (x: number, c: string) => (
    <g transform={`translate(${x} 0)`}>
      <path d="M10 60H70L64 108C63 114 58 118 52 118H28C22 118 17 114 16 108Z" fill={c} />
      <path d="M70 70C86 70 86 96 66 96" fill="none" stroke={c} strokeWidth="7" />
      <ellipse cx="40" cy="60" rx="30" ry="6" fill="#5b3a2a" />
      <path data-steam d="M30 50C24 40 36 32 30 20M48 50C42 40 54 32 48 18" stroke={`url(#s${id})`} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 120" className={className} style={style} aria-hidden overflow="visible">
      <defs><linearGradient id={`s${id}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#5e7d63" stopOpacity=".7" /><stop offset="1" stopColor="#5e7d63" stopOpacity="0" /></linearGradient></defs>
      {cup(12, "#f6efe4")}
      {cup(104, "#7d1d3a")}
    </svg>
  );
}

export const HB_CSS = `
.hb-sage{background-color:#eef1ea;background-image:radial-gradient(rgba(94,125,99,.22) 1.2px,transparent 1.3px);background-size:22px 22px}
.hb-card{background:#fffdf8;box-shadow:0 1px 0 #e3e6dd,0 30px 60px -30px rgba(38,51,42,.35)}
.hb-steam [data-steam]{animation:hbSteam 3.2s ease-in-out infinite}
@keyframes hbSteam{0%{opacity:0;transform:translateY(6px)}40%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
.hb-swing{animation:hbSwing 5s ease-in-out infinite;transform-origin:50% 0}
@keyframes hbSwing{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}
.hb-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.hb-steam [data-steam],.hb-swing{animation:none!important}}
`;
