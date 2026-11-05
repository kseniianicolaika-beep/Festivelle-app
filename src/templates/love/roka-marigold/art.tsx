// Roka Marigold — genda phool torans, mango leaves, a brass roka thali and a cusped jharokha. All hand-built SVG.
import type { CSSProperties } from "react";

const PETAL = "M0 0C-3-1.6-3.6-5.6-2.5-8-1.8-9.2-1-8.4-.4-9.4.2-8.5.9-9.3 1.6-8.6 2.6-8.8 3.6-5.6 3-2.2 2.2-.8 1-.2 0 0Z";
const ring = (r: number, n: number, k: number, a: string, b: string, line: string, rot = 0) =>
  Array.from({ length: n }, (_, i) => (
    <path key={i} d={PETAL} fill={i % 3 ? a : b} stroke={line} strokeWidth={0.35 / k} strokeOpacity=".55" transform={`rotate(${rot + (i * 360) / n + ((i * 37) % 9) - 4}) translate(0 ${-r + 8.6 * k}) scale(${k * (0.92 + ((i * 13) % 5) * 0.03)})`} />
  ));

/** Shared symbols — render once inside each piece (identical ids are harmless). */
export function RokaDefs() {
  const flower = (id: string, a: string, b: string, c: string) => (
    <symbol id={id} viewBox="-12 -12 24 24" overflow="visible">
      <circle r="10.4" fill={c} />
      {ring(11, 18, 1, a, b, c)}
      {ring(9, 16, 0.86, b, a, c, 11)}
      {ring(7, 14, 0.72, a, b, c, 4)}
      {ring(5, 11, 0.58, b, a, c, 17)}
      {ring(3.2, 8, 0.44, a, b, c, 30)}
      <circle r="1.6" fill={c} />
      <circle r="11" fill="url(#rk-shade)" />
    </symbol>
  );
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="rk-shade" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#fff" stopOpacity=".25" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#5a1a00" stopOpacity=".35" />
        </radialGradient>
        <linearGradient id="rk-brass" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#8a5a12" />
          <stop offset=".35" stopColor="#f6d27a" />
          <stop offset=".6" stopColor="#b67c1e" />
          <stop offset="1" stopColor="#f2c661" />
        </linearGradient>
        <linearGradient id="rk-leaf" x1="0" x2="1">
          <stop offset="0" stopColor="#2f6b2a" />
          <stop offset=".5" stopColor="#5c9a3c" />
          <stop offset="1" stopColor="#2a5a24" />
        </linearGradient>
        {flower("rk-mo", "#f08a1c", "#f6a523", "#c4500f")}
        {flower("rk-my", "#f7c531", "#ffd95a", "#d98b12")}
        {flower("rk-mr", "#e2452b", "#f06a35", "#a8240f")}
        <symbol id="rk-leafs" viewBox="-6 0 12 30" overflow="visible">
          <path d="M0 0C6 6 7 18 0 30-7 18-6 6 0 0Z" fill="url(#rk-leaf)" />
          <path d="M0 2V28" stroke="#b9d68a" strokeWidth=".5" opacity=".7" />
        </symbol>
      </defs>
    </svg>
  );
}

const F = ["rk-mo", "rk-my", "rk-mo", "rk-mr"];

/** A hanging lari: a strand of marigolds ending in a leaf + bell. */
export function Lari({ x, y, n, size = 18, seed = 0, cls = "rk-sway", style }: { x: number; y: number; n: number; size?: number; seed?: number; cls?: string; style?: CSSProperties }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={cls} style={{ transformOrigin: "0 0", transformBox: "view-box", animationDelay: `${(seed % 5) * -0.7}s`, ...style }}>
        <path d={`M0 0V${n * size * 0.86}`} stroke="#7a3b0c" strokeWidth=".6" />
        {Array.from({ length: n }, (_, i) => <use key={i} href={`#${F[(i + seed) % F.length]}`} x={-size / 2} y={i * size * 0.86} width={size} height={size} />)}
        <use href="#rk-leafs" x={-size * 0.25} y={n * size * 0.86 + size * 0.2} width={size * 0.5} height={size * 1.25} />
      </g>
    </g>
  );
}

/** The toran: a sagging swag of marigolds with mango leaves and hanging laris. Width 1000 units. */
export function Toran({ className = "", laris = true, id = "t" }: { className?: string; laris?: boolean; id?: string }) {
  const pts = Array.from({ length: 41 }, (_, i) => { const t = i / 40; return [Math.round(t * 1000), Math.round(30 + Math.sin(t * Math.PI * 4) ** 2 * 40)] as const; });
  return (
    <svg viewBox="0 0 1000 260" preserveAspectRatio="xMidYMin slice" className={className} aria-hidden data-id={id}>
      {Array.from({ length: 25 }, (_, i) => <use key={`l${i}`} href="#rk-leafs" x={i * 42 - 4} y={18} width={16} height={40} transform={`rotate(${(i % 2 ? 8 : -8)} ${i * 42 + 4} 18)`} />)}
      <path d="M0 14H1000" stroke="#7a3b0c" strokeWidth="2" />
      {laris && [60, 190, 310, 440, 560, 690, 810, 940].map((x, i) => <Lari key={i} x={x} y={40} n={i % 2 ? 3 : 5} size={18} seed={i} />)}
      {pts.map(([x, y], i) => <use key={i} href={`#${F[i % 4]}`} x={x - 15} y={y - 15} width={30} height={30} />)}
      {pts.filter((_, i) => i % 2).map(([x, y], i) => <use key={`b${i}`} href={`#${F[(i + 1) % 4]}`} x={x - 11} y={y - 30} width={22} height={22} />)}
    </svg>
  );
}

/** A single marigold head for bullets & accents. */
export function Bloom({ className = "", tone = 0, style }: { className?: string; tone?: number; style?: CSSProperties }) {
  return <svg viewBox="-12 -12 24 24" className={className} style={style} aria-hidden><use href={`#${F[tone % 4]}`} x="-12" y="-12" width="24" height="24" /></svg>;
}

/** Cusped (Mughal/Rajput) jharokha arch outline; stretch-to-fit with non-scaling strokes. */
export function Jharokha({ className = "", fill = "none" }: { className?: string; fill?: string }) {
  const d = "M20 600V230C20 200 34 190 46 182C40 160 52 140 72 136C72 112 92 96 114 100C122 74 148 60 172 70C186 44 216 34 240 50C254 26 282 16 300 6C318 16 346 26 360 50C384 34 414 44 428 70C452 60 478 74 486 100C508 96 528 112 528 136C548 140 560 160 554 182C566 190 580 200 580 230V600Z";
  return (
    <svg viewBox="0 0 600 600" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={d} fill={fill} stroke="var(--t-gold)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke="var(--t-accent)" strokeWidth="1" vectorEffect="non-scaling-stroke" transform="translate(30 30) scale(.9)" />
    </svg>
  );
}

/** The roka thali: brass plate, diya, kumkum & haldi, rice, coconut in a red chunni, mishri. */
export function Thali({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 190" className={className} aria-hidden>
      <defs>
        <radialGradient id="rk-flame" cx=".5" cy=".7" r=".6"><stop offset="0" stopColor="#fff7c2" /><stop offset=".5" stopColor="#ffc23a" /><stop offset="1" stopColor="#ff7a1a" stopOpacity="0" /></radialGradient>
        <radialGradient id="rk-glow"><stop offset="0" stopColor="#ffcc66" stopOpacity=".55" /><stop offset="1" stopColor="#ffcc66" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="150" cy="150" rx="142" ry="34" fill="#6b3a08" opacity=".25" />
      <ellipse cx="150" cy="140" rx="140" ry="36" fill="url(#rk-brass)" />
      <ellipse cx="150" cy="136" rx="122" ry="28" fill="#c98d2a" />
      <ellipse cx="150" cy="136" rx="122" ry="28" fill="none" stroke="#fff1b8" strokeOpacity=".6" strokeDasharray="2 4" />
      {/* kumkum, haldi, rice */}
      <ellipse cx="78" cy="132" rx="20" ry="8" fill="#b8860b" /><path d="M62 132q16-14 32 0Z" fill="#c4161c" />
      <ellipse cx="116" cy="146" rx="20" ry="8" fill="#b8860b" /><path d="M100 146q16-14 32 0Z" fill="#f2b400" />
      <ellipse cx="226" cy="146" rx="22" ry="8" fill="#b8860b" />{Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={210 + (i * 7) % 32} cy={141 - (i % 3) * 2} rx="2" ry="1" fill="#fffaf0" transform={`rotate(${i * 40} ${210 + (i * 7) % 32} ${141 - (i % 3) * 2})`} />)}
      {/* coconut in red chunni with gota border */}
      <path d="M150 128c-26 0-34-20-30-40 4-22 18-34 30-34s26 12 30 34c4 20-4 40-30 40Z" fill="#c4161c" />
      <path d="M126 74c10 8 38 8 48 0" fill="none" stroke="#f6d27a" strokeWidth="3" />
      <path d="M121 104c14 10 44 10 58 0" fill="none" stroke="#f6d27a" strokeWidth="2" strokeDasharray="1 3" />
      <path d="M150 54c-4-10-2-18 6-24" stroke="#7a4a1c" strokeWidth="3" fill="none" />
      {/* diya */}
      <g transform="translate(196 110)">
        <circle cx="0" cy="-26" r="26" fill="url(#rk-glow)" />
        <path d="M-22 4c4 12 40 12 44 0-6-6-38-6-44 0Z" fill="#a3471b" />
        <path d="M-22 4c10-3 34-3 44 0" stroke="#e4a24a" strokeWidth="1.2" fill="none" />
        <path className="rk-flame" d="M0-22c5 8 7 12 7 16a7 7 0 0 1-14 0c0-4 2-8 7-16Z" fill="url(#rk-flame)" style={{ transformOrigin: "0 0", transformBox: "fill-box" }} />
      </g>
      {/* marigold heads on the plate */}
      <use href="#rk-mo" x="40" y="138" width="22" height="22" />
      <use href="#rk-my" x="246" y="126" width="20" height="20" />
      <use href="#rk-mr" x="168" y="148" width="18" height="18" />
    </svg>
  );
}

/** Bandhani tie-dye dot field as a CSS background. */
export const bandhani = (c = "rgba(210,69,43,.18)") => `radial-gradient(circle at 25% 25%, ${c} 1.4px, transparent 2px), radial-gradient(circle at 75% 25%, ${c} 1.4px, transparent 2px), radial-gradient(circle at 50% 70%, ${c} 1.4px, transparent 2px)`;
