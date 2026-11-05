import { useId } from "react";

// Fifty in the Garden — watercolour silver-dollar eucalyptus, a linen-laid long table, botanical ink.

const LEAF = [["#9fb5aa", "#6f8c80"], ["#b8c8be", "#7f998d"], ["#8aa596", "#5d7a6d"], ["#c7d3c9", "#8ea398"]];
const rnd = (i: number) => {
  const x = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

/** Watercolour filter defs (edge bleed + pigment pooling). */
export function WashDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`wc${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" result="d" />
        <feGaussianBlur in="d" stdDeviation=".35" />
      </filter>
      {LEAF.map(([a, b], i) => (
        <radialGradient key={i} id={`lf${id}${i}`} cx=".35" cy=".35" r=".8">
          <stop offset="0" stopColor={a} stopOpacity=".55" />
          <stop offset=".7" stopColor={b} stopOpacity=".8" />
          <stop offset="1" stopColor={b} stopOpacity=".95" />
        </radialGradient>
      ))}
    </defs>
  );
}

type Pt = [number, number];
const qb = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
const qd = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => [2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])];

/** A eucalyptus branch drawn along a quadratic stem in a 300×300 box. */
export function Eucalyptus({ className = "", style, seed = 1, from = [20, 290] as Pt, ctrl = [80, 120] as Pt, to = [270, 30] as Pt, leaves = 18, size = 1 }: { className?: string; style?: React.CSSProperties; seed?: number; from?: Pt; ctrl?: Pt; to?: Pt; leaves?: number; size?: number }) {
  const id = useId().replace(/:/g, "");
  const items: React.ReactNode[] = [];
  for (let i = 0; i < leaves; i++) {
    const t = 0.08 + (i / leaves) * 0.9;
    const [x, y] = qb(from, ctrl, to, t);
    const [dx, dy] = qd(from, ctrl, to, t);
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    const side = i % 2 ? 1 : -1;
    const r = (17 + rnd(seed * 31 + i) * 9) * size * (1 - t * 0.4);
    const off = r * 0.75;
    const nx = -dy / Math.hypot(dx, dy), ny = dx / Math.hypot(dx, dy);
    const cx = x + nx * off * side, cy = y + ny * off * side;
    const g = Math.floor(rnd(seed * 7 + i) * LEAF.length);
    items.push(
      <g key={i} data-leaf transform={`rotate(${ang + side * 20} ${cx} ${cy})`}>
        <path data-stalk d={`M${x} ${y}L${cx} ${cy}`} stroke="#6d7f73" strokeWidth=".8" fill="none" />
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.86} fill={`url(#lf${id}${g})`} filter={`url(#wc${id})`} />
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.86} fill="none" stroke="#4f6a5e" strokeOpacity=".35" strokeWidth=".6" data-ink />
        <path d={`M${cx - r * 0.75} ${cy}Q${cx} ${cy - r * 0.12} ${cx + r * 0.75} ${cy}`} stroke="#f4f6f1" strokeOpacity=".55" strokeWidth=".7" fill="none" />
      </g>,
    );
  }
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden overflow="visible">
      <WashDefs id={id} />
      <path data-stem d={`M${from[0]} ${from[1]}Q${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`} stroke="#6d7f73" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {items}
    </svg>
  );
}

/** A long lunch table in botanical ink: linen drape, bud vases, candles and glasses. viewBox 600×220. */
export function LongTable({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const ink = "#3d5045";
  return (
    <svg viewBox="0 0 600 220" className={className} aria-hidden>
      <WashDefs id={id} />
      <ellipse cx="300" cy="206" rx="290" ry="10" fill="#9fb5aa" opacity=".18" />
      <path d="M30 130h540l-8 62H38z" fill="#fbfaf5" stroke={ink} strokeWidth="1" />
      <path d="M38 192c40-6 80 6 130 0s90 6 130 0 90 6 130 0 90 6 132 0" fill="none" stroke={ink} strokeWidth=".8" />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${70 + i * 46} 132c-4 20-2 42 2 58`} stroke={ink} strokeOpacity=".25" strokeWidth=".7" fill="none" />)}
      <path d="M44 192v14M556 192v14" stroke={ink} strokeWidth="1.2" />
      {[90, 210, 390, 510].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 6} 128c-2-10 0-18 6-22 6 4 8 12 6 22z`} fill="#dfe7e0" stroke={ink} strokeWidth=".8" />
          <path d={`M${x} 106c-2-14-8-26-16-34M${x} 106c2-16 8-28 14-36M${x} 108c0-18 2-30 0-44`} stroke="#6d7f73" fill="none" strokeWidth=".8" />
          {[[x - 16, 72], [x + 14, 70], [x, 64], [x - 9, 86], [x + 9, 84]].map(([a, b], k) => <ellipse key={k} cx={a} cy={b} rx="5.5" ry="4.6" fill={`url(#lf${id}${(i + k) % 4})`} filter={`url(#wc${id})`} />)}
        </g>
      ))}
      {[150, 300, 450].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="78" width="6" height="50" fill="#f6efe0" stroke={ink} strokeWidth=".7" />
          <path className="fg-flame" d={`M${x} 77c-4-5-3-10 0-16 3 6 4 11 0 16z`} fill="#f2c56b" style={{ transformOrigin: `${x}px 77px` }} />
          <path d={`M${x - 10} 128h20`} stroke={ink} strokeWidth="1" />
        </g>
      ))}
      {[60, 120, 180, 240, 270, 330, 360, 420, 480, 540].map((x, i) => (
        <path key={x} d={`M${x - 6} ${100 + (i % 2) * 2}c0 10 3 14 6 14s6-4 6-14M${x} 114v13M${x - 5} 128h10`} stroke={ink} strokeWidth=".7" fill={i % 3 ? "none" : "#e9d9b5"} fillOpacity=".5" />
      ))}
    </svg>
  );
}

export const FG_CSS = `
.fg-linen{background-color:var(--t-bg);background-image:repeating-linear-gradient(0deg,rgba(60,80,69,.035) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(60,80,69,.03) 0 1px,transparent 1px 4px)}
.fg-sway{animation:fgSway 7s ease-in-out infinite;transform-origin:0% 100%}
@keyframes fgSway{0%,100%{transform:rotate(-1.4deg)}50%{transform:rotate(1.4deg)}}
.fg-flame{animation:fgFl 1.8s ease-in-out infinite}
@keyframes fgFl{0%,100%{transform:scale(1)}50%{transform:scale(.88,1.1)}}
@media (prefers-reduced-motion: reduce){.fg-sway,.fg-flame{animation:none!important}}
`;
