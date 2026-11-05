import { useId } from "react";

// Pearl Years artwork: lustrous pearls (layered radial gradients = nacre + orient), a hand-knotted silk strand,
// a locket ring of pearls and a pair of line-drawn doves.

/** Round for SSR/CSR-identical attributes. */
export const rd = (v: number) => Math.round(v * 100) / 100;

/** One set of gradient defs per SVG (ids are namespaced). */
export function PearlDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-n`} cx="36%" cy="30%" r="75%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".28" stopColor="#fbf6ef" />
        <stop offset=".62" stopColor="#e9dfd2" />
        <stop offset=".9" stopColor="#c9bba8" />
        <stop offset="1" stopColor="#b3a38d" />
      </radialGradient>
      <radialGradient id={`${id}-o`} cx="70%" cy="78%" r="60%">
        <stop offset="0" stopColor="#f3c9cf" stopOpacity=".75" />
        <stop offset=".45" stopColor="#d9e4ea" stopOpacity=".45" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-h`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-s`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation=".8" />
        <feOffset dx=".5" dy="1.2" />
        <feComponentTransfer><feFuncA type="linear" slope=".28" /></feComponentTransfer>
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}

export function Pearl({ id, x, y, r, className, style }: { id: string; x: number; y: number; r: number; className?: string; style?: React.CSSProperties }) {
  return (
    <g className={className} style={{ transformOrigin: "center", transformBox: "fill-box", ...style }} filter={`url(#${id}-s)`}>
      <circle cx={x} cy={y} r={r} fill={`url(#${id}-n)`} />
      <circle cx={x} cy={y} r={r} fill={`url(#${id}-o)`} />
      <ellipse cx={x - r * 0.32} cy={y - r * 0.38} rx={r * 0.32} ry={r * 0.2} fill={`url(#${id}-h)`} opacity=".9" />
    </g>
  );
}

/** Points along a hanging strand (catenary-ish), evenly spaced by arc length. */
export function strandPoints(n: number, x0: number, x1: number, y: number, sag: number) {
  const S = 400;
  const pts: [number, number][] = [];
  for (let i = 0; i <= S; i++) {
    const t = i / S;
    const x = x0 + (x1 - x0) * t;
    const u = 2 * t - 1;
    pts.push([x, y + sag * (1 - (Math.cosh(u * 1.3) - 1) / (Math.cosh(1.3) - 1))]);
  }
  const len: number[] = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = len[len.length - 1];
  const out: [number, number][] = [];
  for (let k = 0; k < n; k++) {
    const target = (total * (k + 0.5)) / n;
    let j = 1;
    while (j < len.length - 1 && len[j] < target) j++;
    const f = (target - len[j - 1]) / (len[j] - len[j - 1] || 1);
    out.push([rd(pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * f), rd(pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * f)]);
  }
  const d = "M" + pts.filter((_, i) => i % 8 === 0 || i === S).map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
  return { pts: out, d };
}

/** The signature swag of pearls. `count` pearls; `animate` = CSS string-on choreography. */
export function Strand({ count = 30, width = 1000, sag = 120, r = 11, animate = true, className = "", delay = 0.4, graduated = true }: { count?: number; width?: number; sag?: number; r?: number; animate?: boolean; className?: string; delay?: number; graduated?: boolean }) {
  const id = useId().replace(/:/g, "");
  const { pts, d } = strandPoints(count, r * 2, width - r * 2, r * 2, sag);
  const h = sag + r * 5;
  return (
    <svg viewBox={`0 0 ${width} ${h}`} className={className} aria-hidden overflow="visible">
      <PearlDefs id={id} />
      <path d={d} fill="none" stroke="#b9a68a" strokeWidth="1.1" className={animate ? "py-thread" : ""} pathLength={1} style={{ strokeDasharray: 1 }} />
      {pts.map(([x, y], i) => {
        const mid = Math.abs(i - (count - 1) / 2) / ((count - 1) / 2);
        const rr = rd(graduated ? r * (1.18 - mid * 0.38) : r);
        return <Pearl key={i} id={id} x={x} y={y} r={rr} className={animate ? "py-pearl" : ""} style={animate ? { animationDelay: `${delay + i * 0.045}s` } : undefined} />;
      })}
    </svg>
  );
}

/** A ring of pearls around an oval locket. */
export function LocketRing({ count = 44, rx = 180, ry = 240, r = 7, animate = true, className = "" }: { count?: number; rx?: number; ry?: number; r?: number; animate?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  const W = rx * 2 + r * 6, H = ry * 2 + r * 6;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
      <PearlDefs id={id} />
      <ellipse cx={W / 2} cy={H / 2} rx={rx - r * 2.2} ry={ry - r * 2.2} fill="none" stroke="#c5b394" strokeWidth=".8" />
      {Array.from({ length: count }, (_, i) => {
        const t = (i / count) * Math.PI * 2 - Math.PI / 2;
        const x = rd(W / 2 + Math.cos(t) * rx), y = rd(H / 2 + Math.sin(t) * ry);
        return <Pearl key={i} id={id} x={x} y={y} r={r} className={animate ? "py-pearl" : ""} style={animate ? { animationDelay: `${0.9 + i * 0.03}s` } : undefined} />;
      })}
    </svg>
  );
}

/** Two doves carrying a single pearl between them — fine pen line. */
export function Doves({ className = "", draw = false }: { className?: string; draw?: boolean }) {
  const dove = "M6 40 C16 38 24 33 32 33 C38 33 42 36 48 34 C53 32 56 28 61 28 C65 28 67 30 68 32 L74 32 L68 34.5 C66 40 58 46 46 47 C36 48 24 46 14 44 Z M30 34 C27 22 31 10 44 2 C44 12 46 22 52 31 M36 33.5 C38 24 45 16 56 13 C52 21 51 27 53 31";
  return (
    <svg viewBox="0 0 220 70" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round" data-draw={draw ? "" : undefined}>
      <path d={dove} />
      <path d={dove} transform="translate(220 0) scale(-1 1)" />
      <path d="M74 33 C92 46 128 46 146 33" strokeDasharray="1 3" />
      <circle cx="110" cy="44" r="4.2" fill="#f4eee6" stroke="#b9a68a" />
      <circle cx="108.6" cy="42.6" r="1.2" fill="#fff" stroke="none" />
    </svg>
  );
}
