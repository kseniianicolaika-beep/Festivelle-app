"use client";
import type { CSSProperties } from "react";
import { useGid } from "../_shared/kit";

// Lotus Vows — watercolour lotus, a cusped Mughal arch crowned with the ogee both traditions share
// (the kokoshnik and the jharokha), a rushnyk cross-stitch band and the mandap's sacred fire.
type SvgP = { className?: string; style?: CSSProperties };
const f = (n: number) => +n.toFixed(4);

/** Cusped (multifoil) arch with an ogee apex, in any box. Used as SVG path and as an objectBoundingBox clip. */
export function archD(W: number, H: number, spring = 0.42, lobes = 4) {
  const cx = W / 2, cy = H * spring, rx = W / 2, ry = cy - H * 0.06;
  const pt = (t: number) => [cx + rx * Math.cos(t), cy - ry * Math.sin(t)] as const;
  const d0 = 0.2;
  let d = `M0 ${f(H)}L0 ${f(cy)}`;
  const seg = (t0: number, t1: number) => {
    const [x0, y0] = pt(t0), [x1, y1] = pt(t1);
    const ch = Math.hypot(x1 - x0, y1 - y0) * 0.6;
    d += `A${f(ch)} ${f(ch * (H / W) ** 0)} 0 0 1 ${f(x1)} ${f(y1)}`;
    void y0;
  };
  for (let k = 0; k < lobes; k++) seg(Math.PI - (k * (Math.PI / 2 - d0)) / lobes, Math.PI - ((k + 1) * (Math.PI / 2 - d0)) / lobes);
  const [lx, ly] = pt(Math.PI / 2 + d0);
  const [rxp, ryp] = pt(Math.PI / 2 - d0);
  d += `C${f(lx + W * 0.03)} ${f(ly - H * 0.035)} ${f(cx - W * 0.035)} ${f(H * 0.035)} ${f(cx)} 0`;
  d += `C${f(cx + W * 0.035)} ${f(H * 0.035)} ${f(rxp - W * 0.03)} ${f(ryp - H * 0.035)} ${f(rxp)} ${f(ryp)}`;
  for (let k = 0; k < lobes; k++) seg(Math.PI / 2 - d0 - (k * (Math.PI / 2 - d0)) / lobes, Math.PI / 2 - d0 - ((k + 1) * (Math.PI / 2 - d0)) / lobes);
  d += `L${f(W)} ${f(H)}Z`;
  return d;
}

/** Hidden <svg> holding the arch clip (objectBoundingBox) — reference with clip-path:url(#id). */
export function ArchClip({ id, spring = 0.42 }: { id: string; spring?: number }) {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <clipPath id={id} clipPathUnits="objectBoundingBox"><path d={archD(1, 1, spring)} /></clipPath>
    </svg>
  );
}

function Foil({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stopColor="#a5703a" /><stop offset="0.3" stopColor="#f3d6a4" /><stop offset="0.55" stopColor="#b98445" /><stop offset="0.8" stopColor="#f1d09a" /><stop offset="1" stopColor="#a5703a" />
    </linearGradient>
  );
}

/** The arch outline (double gilt line) with a lotus-bud finial, sized to its box via viewBox W×H. */
export function ArchLine({ W = 400, H = 600, spring = 0.42, className, style }: SvgP & { W?: number; H?: number; spring?: number }) {
  const g = useGid("al");
  const inset = (i: number) => `translate(${i} ${i * 1.4}) scale(${(W - 2 * i) / W} ${(H - i * 1.4) / H})`;
  return (
    <svg viewBox={`-6 -40 ${W + 12} ${H + 44}`} className={className} style={style} aria-hidden fill="none" preserveAspectRatio="xMidYMax meet">
      <defs><Foil id={g} /></defs>
      <g stroke={`url(#${g})`} strokeLinejoin="round">
        <path data-draw d={archD(W, H, spring)} strokeWidth="2" />
        <path data-draw d={archD(W, H, spring)} transform={inset(12)} strokeWidth="0.8" />
        <path data-draw d={`M${W / 2} 0V-14`} strokeWidth="1.4" />
      </g>
      <g transform={`translate(${W / 2} -14)`} fill={`url(#${g})`}>
        <path d="M0 0C-7 -6 -6 -16 0 -24C6 -16 7 -6 0 0Z" />
        <path d="M0 0C-10 -2 -15 -9 -15 -14C-8 -12 -3 -7 0 0ZM0 0C10 -2 15 -9 15 -14C8 -12 3 -7 0 0Z" opacity="0.8" />
      </g>
    </svg>
  );
}

/** A watercolour lotus: blush petals with soft bled edges and gilt outlines (200×170, base at 100,150). */
export function Lotus({ className, style, open = 1 }: SvgP & { open?: number }) {
  const g = useGid("lo");
  const petal = "M0 0C-15 -20 -14 -54 0 -74C14 -54 15 -20 0 0Z";
  const back = [-62, -34, 34, 62].map((a) => a * open);
  const side = [-82, 82].map((a) => a * open);
  return (
    <svg viewBox="0 0 200 170" className={className} style={style} aria-hidden>
      <defs>
        <Foil id={`${g}f`} />
        <radialGradient id={`${g}p`} cx="0.5" cy="1" r="1.1"><stop offset="0" stopColor="#fff4f0" /><stop offset="0.5" stopColor="#f5c3c8" /><stop offset="1" stopColor="#d77b8f" /></radialGradient>
        <radialGradient id={`${g}q`} cx="0.5" cy="1" r="1"><stop offset="0" stopColor="#fffaf6" /><stop offset="0.6" stopColor="#f8d4d6" /><stop offset="1" stopColor="#e597a5" /></radialGradient>
        <filter id={`${g}w`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      <ellipse cx="100" cy="152" rx="70" ry="7" fill="#c9a265" opacity="0.18" />
      <g transform="translate(100 150)" filter={`url(#${g}w)`}>
        {side.map((a, i) => <path key={`s${i}`} data-petal d={petal} transform={`rotate(${a}) scale(0.82)`} fill={`url(#${g}p)`} opacity="0.85" />)}
        {back.map((a, i) => <path key={`b${i}`} data-petal d={petal} transform={`rotate(${a})`} fill={`url(#${g}p)`} />)}
        {[-16, 16].map((a, i) => <path key={`m${i}`} data-petal d={petal} transform={`rotate(${a * open}) scale(0.92)`} fill={`url(#${g}q)`} />)}
        <path data-petal d={petal} transform="scale(1.04)" fill={`url(#${g}q)`} />
      </g>
      <g transform="translate(100 150)" fill="none" stroke={`url(#${g}f)`} strokeWidth="0.9">
        {[...side.map((a) => `rotate(${a}) scale(0.82)`), ...back.map((a) => `rotate(${a})`), ...[-16, 16].map((a) => `rotate(${a * open}) scale(0.92)`), "scale(1.04)"].map((t, i) => (
          <g key={i} transform={t}><path data-draw d={petal} /><path data-draw d="M0 -6V-60" strokeWidth="0.4" /></g>
        ))}
      </g>
      <g fill={`url(#${g}f)`}>{[-10, -5, 0, 5, 10].map((x, i) => <circle key={i} cx={100 + x} cy={78 - Math.abs(x) * 0.4} r="1.6" />)}</g>
    </svg>
  );
}

/** Rushnyk — a Slavic cross-stitch band (diamonds & crosses) worked in rose and gold, tiled horizontally. */
export function Rushnyk({ className, style, h = 22 }: SvgP & { h?: number }) {
  const g = useGid("rk");
  const motif: string[] = [
    "....R.......R....",
    "...RRR.....RRR...",
    "..RR.RR.G.RR.RR..",
    ".RR...RRGRR...RR.",
    "RR..G..RGR..G..RR",
    ".RR...RRGRR...RR.",
    "..RR.RR.G.RR.RR..",
    "...RRR.....RRR...",
    "....R.......R....",
  ];
  const cells: { x: number; y: number; c: string }[] = [];
  motif.forEach((row, y) => [...row].forEach((ch, x) => ch !== "." && cells.push({ x, y, c: ch })));
  return (
    <svg className={className} style={{ height: h, width: "100%", ...style }} aria-hidden>
      <defs>
        <pattern id={g} width="18" height="13" patternUnits="userSpaceOnUse" y="0">
          {cells.map((c, i) => (
            <g key={i} stroke={c.c === "R" ? "#b8546f" : "#c9a265"} strokeWidth="0.7">
              <path d={`M${c.x + 0.5} ${c.y + 2.5}l1 1M${c.x + 1.5} ${c.y + 2.5}l-1 1`} />
            </g>
          ))}
        </pattern>
      </defs>
      <line x1="0" x2="100%" y1="1" y2="1" stroke="#b8546f" strokeWidth="0.8" />
      <line x1="0" x2="100%" y1="3" y2="3" stroke="#c9a265" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
      <rect x="0" y="5" width="100%" height="13" fill={`url(#${g})`} />
      <line x1="0" x2="100%" y1="20" y2="20" stroke="#c9a265" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
      <line x1="0" x2="100%" y1="22" y2="22" stroke="#b8546f" strokeWidth="0.8" />
    </svg>
  );
}

/** The mandap: four pillars, a cusped canopy with garlands, and the sacred fire in its kund. */
export function Mandap({ className, style }: SvgP) {
  const g = useGid("mp");
  const fl = useGid("fl");
  return (
    <svg viewBox="0 0 320 260" className={className} style={style} aria-hidden fill="none">
      <defs>
        <Foil id={g} />
        <linearGradient id={fl} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#e2552b" /><stop offset="0.5" stopColor="#f39a32" /><stop offset="1" stopColor="#ffe08a" stopOpacity="0.9" /></linearGradient>
      </defs>
      <g stroke={`url(#${g})`} strokeWidth="1.3" strokeLinejoin="round">
        <path data-draw d={archD(280, 90, 0.9, 3)} transform="translate(20 22)" />
        <path data-draw d="M20 112H300M28 118H292" />
        {[34, 110, 210, 286].map((x) => <path key={x} data-draw d={`M${x} 118V236M${x - 6} 236H${x + 6}M${x - 5} 130H${x + 5}M${x - 5} 222H${x + 5}`} />)}
        <path data-draw d="M10 244H310" strokeWidth="1.6" />
        <path data-draw d="M126 244V228H194V244M134 228V218H186V228" />
      </g>
      {[[34, 110], [110, 210], [210, 286]].map(([a, b], i) => (
        <path key={i} d={`M${a} 124Q${(a + b) / 2} ${i === 1 ? 160 : 150} ${b} 124`} stroke="#e8902a" strokeWidth="3.4" strokeDasharray="0.1 5" strokeLinecap="round" />
      ))}
      <g className="lt-flame" style={{ transformOrigin: "160px 218px" }}>
        <path d="M160 218C140 210 142 186 152 172C152 184 158 186 160 168C166 182 176 186 172 200C178 194 180 190 180 186C186 200 178 214 160 218Z" fill={`url(#${fl})`} />
        <path d="M160 218C152 212 152 200 158 192C160 200 164 202 166 196C170 206 168 214 160 218Z" fill="#fff1b8" opacity="0.9" />
      </g>
      <g fill="#f6c86a">{[[150, 160], [170, 150], [162, 140]].map(([x, y], i) => <circle key={i} className="lt-spark" cx={x} cy={y} r="1.4" style={{ animationDelay: `${i * 0.6}s` }} />)}</g>
    </svg>
  );
}

/** Lotus pond: water lines, lily pads and three blooms. */
export function Pond({ className, style }: SvgP) {
  const g = useGid("pd");
  return (
    <svg viewBox="0 0 400 150" className={className} style={style} aria-hidden fill="none">
      <defs><Foil id={g} /></defs>
      <g stroke={`url(#${g})`} strokeWidth="1" strokeLinecap="round">
        {[100, 116, 132].map((y, i) => <path key={y} data-draw d={`M${20 + i * 20} ${y}q25 -6 50 0t50 0 50 0 50 0 50 0 50 0`} opacity={1 - i * 0.25} />)}
      </g>
      {[[70, 112, 26], [300, 124, 30], [190, 136, 20]].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.32} fill="#a8b98a" opacity="0.35" />
          <path d={`M${x} ${y}L${x + r} ${y - r * 0.1}`} stroke="#8b9b6e" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

/** Wax seal with an embossed lotus, in two halves that can crack apart. */
export function SealHalf({ side, className, style }: SvgP & { side: "l" | "r" }) {
  const g = useGid("sl");
  const clip = useGid("sc");
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={g} cx="0.38" cy="0.32" r="0.8"><stop offset="0" stopColor="#f7e0b0" /><stop offset="0.45" stopColor="#c99a55" /><stop offset="0.8" stopColor="#9a6a32" /><stop offset="1" stopColor="#7a4f22" /></radialGradient>
        <clipPath id={clip}><path d={side === "l" ? "M0 0H52L46 30L54 52L47 74L51 100H0Z" : "M100 0H52L46 30L54 52L47 74L51 100H100Z"} /></clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <path d="M50 3C62 1 72 8 80 12C90 18 98 30 97 44C99 56 95 70 86 80C78 90 64 98 50 97C36 99 22 92 14 82C4 72 1 58 3 46C2 32 10 18 22 11C30 6 40 2 50 3Z" fill={`url(#${g})`} />
        <circle cx="50" cy="50" r="33" fill="none" stroke="#7a4f22" strokeOpacity="0.45" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#fff3d0" strokeOpacity="0.45" strokeWidth="0.8" />
        <g transform="translate(50 64)" fill="none" stroke="#7a4f22" strokeOpacity="0.55" strokeWidth="1.6" strokeLinejoin="round">
          {[-60, -30, 0, 30, 60].map((a) => <path key={a} d="M0 0C-5 -7 -5 -18 0 -26C5 -18 5 -7 0 0Z" transform={`rotate(${a})`} />)}
        </g>
        <g transform="translate(50 64)" fill="none" stroke="#fff2cf" strokeOpacity="0.5" strokeWidth="0.7">
          {[-60, -30, 0, 30, 60].map((a) => <path key={a} d="M0 -1C-5 -8 -5 -19 0 -27C5 -19 5 -8 0 -1Z" transform={`translate(-0.6 -0.6) rotate(${a})`} />)}
        </g>
      </g>
    </svg>
  );
}
