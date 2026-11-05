// Ring Ceremony — emerald & gold sagai: hanging brass lanterns, a cusped Mughal arch, jaali lattice, two rings interlocked.
import type { CSSProperties } from "react";

/** Two gold rings interlocked, one set with a stone — the strokes draw themselves (.rc-draw). */
export function Rings({ className = "", id = "rr" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 200 130" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--foil-a)" }} />
          <stop offset=".45" style={{ stopColor: "var(--foil-b)" }} />
          <stop offset=".7" style={{ stopColor: "var(--foil-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--foil-b)" }} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id}-g)`} strokeLinecap="round" className="rc-draw">
        <ellipse cx="78" cy="78" rx="44" ry="40" strokeWidth="7" pathLength="1" />
        <ellipse cx="122" cy="78" rx="44" ry="40" strokeWidth="5" pathLength="1" />
        <ellipse cx="78" cy="78" rx="44" ry="40" strokeWidth="1" stroke="#fff6d0" strokeOpacity=".6" pathLength="1" transform="translate(-1.5 -1.5)" />
      </g>
      {/* re-draw the overlap so ring 1 passes over ring 2 at the right crossing */}
      <path d="M118 46a44 40 0 0 1 4 32" fill="none" stroke={`url(#${id}-g)`} strokeWidth="7" strokeLinecap="round" className="rc-fade" />
      <g className="rc-fade" transform="translate(78 30)">
        <path d="M-10 0h20l6 8-16 16-16-16Z" fill="#e9fff6" stroke={`url(#${id}-g)`} strokeWidth="1.2" />
        <path d="M-10 0l4 8h12l4-8M-16 8h32M-6 8l6 16 6-16" fill="none" stroke="#9ccfb8" strokeWidth=".7" />
        <path className="rc-twinkle" d="M12-14l1.5 6 6 1.5-6 1.5-1.5 6-1.5-6-6-1.5 6-1.5Z" fill="#fff" style={{ transformOrigin: "12px -6.5px" }} />
      </g>
    </svg>
  );
}

/** Brass Mughal lantern with pierced pattern and a glowing core. */
export function Lantern({ className = "", style, chain = 80 }: { className?: string; style?: CSSProperties; chain?: number }) {
  return (
    <svg viewBox={`0 0 60 ${chain + 110}`} className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id="rc-core" cx=".5" cy=".55" r=".55"><stop offset="0" stopColor="#fff2c4" /><stop offset=".45" stopColor="#ffc95a" /><stop offset="1" stopColor="#c47a12" stopOpacity="0" /></radialGradient>
        <radialGradient id="rc-halo"><stop offset="0" stopColor="#ffd77a" stopOpacity=".5" /><stop offset="1" stopColor="#ffd77a" stopOpacity="0" /></radialGradient>
        <linearGradient id="rc-brass" x1="0" x2="1"><stop offset="0" stopColor="#6e4a12" /><stop offset=".4" stopColor="#f1cf72" /><stop offset=".7" stopColor="#a8761c" /><stop offset="1" stopColor="#5a3a0c" /></linearGradient>
      </defs>
      <path d={`M30 0V${chain}`} stroke="#b08a3a" strokeWidth="1.2" strokeDasharray="3 2" />
      <g transform={`translate(0 ${chain})`}>
        <circle className="rc-glow" cx="30" cy="58" r="44" fill="url(#rc-halo)" />
        <path d="M30 0l3 6h-6Z" fill="url(#rc-brass)" />
        <path d="M14 22C14 10 22 6 30 6s16 4 16 16Z" fill="url(#rc-brass)" />
        <path d="M10 22h40v4H10Z" fill="url(#rc-brass)" />
        <path d="M13 26h34l-2 50H15Z" fill="url(#rc-core)" />
        <path d="M13 26h34l-2 50H15Z" fill="none" stroke="url(#rc-brass)" strokeWidth="2" />
        <g stroke="url(#rc-brass)" strokeWidth="1.6" fill="none">
          <path d="M22 26v50M30 26v50M38 26v50" />
          <path d="M14 40c5 4 11 4 16 0 5 4 11 4 16 0M14 56c5 4 11 4 16 0 5 4 11 4 16 0" />
        </g>
        <path d="M12 76h36l-4 8H16Z" fill="url(#rc-brass)" />
        <path d="M22 84h16l-8 16Z" fill="url(#rc-brass)" />
        <circle cx="30" cy="104" r="2.4" fill="#d4af37" />
      </g>
    </svg>
  );
}

/** Pointed, cusped Mughal arch (stretchable, non-scaling strokes). */
export function MughalArch({ className = "", fill = "none", double = true }: { className?: string; fill?: string; double?: boolean }) {
  const d = "M20 600V250C20 210 40 196 60 190C56 168 70 150 92 148C96 124 116 110 140 116C150 90 176 78 200 86C214 58 250 44 274 30L300 4L326 30C350 44 386 58 400 86C424 78 450 90 460 116C484 110 504 124 508 148C530 150 544 168 540 190C560 196 580 210 580 250V600Z";
  return (
    <svg viewBox="0 0 600 600" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={d} fill={fill} stroke="var(--t-gold)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      {double && <path d={d} fill="none" stroke="var(--t-gold)" strokeOpacity=".4" strokeWidth="1" vectorEffect="non-scaling-stroke" transform="translate(24 24) scale(.92)" />}
    </svg>
  );
}

/** Jaali lattice (8-point stars) as a CSS background data-URI. */
export const JAALI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='.7' opacity='.55'%3E%3Cpath d='M28 6l6 16 16 6-16 6-6 16-6-16-16-6 16-6Z'/%3E%3Cpath d='M28 14l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z'/%3E%3Cpath d='M0 0l10 10M56 0L46 10M0 56l10-10M56 56L46 46'/%3E%3C/g%3E%3C/svg%3E")`;

/** Emerald silk curtain panel with zari border (CSS). */
export const silk = (side: "l" | "r"): CSSProperties => ({
  background: `linear-gradient(${side === "l" ? "270deg" : "90deg"}, #d4af37 0 6px, #8a6a1c 6px 8px, transparent 8px), repeating-linear-gradient(90deg, #0a241f 0, #134a3f 22px, #1d6a58 34px, #0f3a31 50px, #072019 64px)`,
  boxShadow: side === "l" ? "inset -40px 0 70px rgba(0,0,0,.55)" : "inset 40px 0 70px rgba(0,0,0,.55)",
});
