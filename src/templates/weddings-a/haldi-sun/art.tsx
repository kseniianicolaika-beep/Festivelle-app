"use client";
import { useId, type CSSProperties, type ReactNode } from "react";
import { r1, rng } from "../_shared/data";

// Haldi Sun — genda phool (marigold) heads built ring by ring from frilled, three-lobed petals, strung into
// laris (garland strands) and a mango-leaf toran; a turmeric watercolour splash, a paper-cut sun, a brass urli.

const ORANGE = ["#d9560f", "#e8701a", "#f28a22", "#f9a62f", "#fdc04a"];
const YELLOW = ["#e3980c", "#f0b318", "#f7c62a", "#fcd84a", "#ffe97e"];

function head(seed: number, cols: string[]) {
  const R = rng(seed);
  const out: { d: string; fill: string; stroke: string }[] = [];
  const rings = 5;
  for (let k = 0; k < rings; k++) {
    const rr = 20 * (1 - k * 0.17), n = 13 - k * 2, w = rr * 0.42;
    let d = "";
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + k * 0.35 + (R() - 0.5) * 0.2, ca = Math.cos(a), sa = Math.sin(a);
      const pt = (x: number, y: number) => `${r1(x * ca - y * sa)} ${r1(x * sa + y * ca)}`;
      const L = rr * (0.92 + R() * 0.16);
      d += `M${pt(0, 0)}L${pt(-w, -L * 0.78)}Q${pt(-w * 0.75, -L * 1.06)} ${pt(-w * 0.33, -L * 0.9)}Q${pt(0, -L * 1.1)} ${pt(w * 0.33, -L * 0.9)}Q${pt(w * 0.75, -L * 1.06)} ${pt(w, -L * 0.78)}Z`;
    }
    out.push({ d, fill: cols[k], stroke: k < 2 ? "#a8410a" : "#c9750f" });
  }
  return out;
}
const HEAD_O = head(4, ORANGE), HEAD_Y = head(9, YELLOW);

/** Defs: two marigold symbols (orange `o`, yellow `y`), mango leaf `l`, shading. */
export function MarigoldDefs({ id }: { id: string }) {
  const sym = (key: string, rings: typeof HEAD_O) => (
    <symbol id={`${id}${key}`} viewBox="-22 -22 44 44" overflow="visible">
      <circle r="19" fill={rings[0].fill} />
      {rings.map((r, i) => <path key={i} d={r.d} fill={r.fill} stroke={r.stroke} strokeWidth=".55" strokeOpacity=".7" />)}
      <circle r="4" fill={key === "o" ? "#f6b23a" : "#f5d040"} />
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={r1(Math.cos(i) * 2.2)} cy={r1(Math.sin(i) * 2.2)} r=".8" fill="#a85b0c" opacity=".6" />)}
      <circle r="21" fill={`url(#${id}sh)`} />
    </symbol>
  );
  return (
    <defs>
      <radialGradient id={`${id}sh`} cx="45%" cy="40%" r="60%">
        <stop offset=".55" stopColor="#5a1d00" stopOpacity="0" />
        <stop offset="1" stopColor="#5a1d00" stopOpacity=".32" />
      </radialGradient>
      <linearGradient id={`${id}lg`} x1="0" x2="1"><stop offset="0" stopColor="#3f7a22" /><stop offset=".5" stopColor="#6aa63a" /><stop offset="1" stopColor="#2f6519" /></linearGradient>
      {sym("o", HEAD_O)}
      {sym("y", HEAD_Y)}
      <symbol id={`${id}l`} viewBox="-10 0 20 64" overflow="visible">
        <path d="M0 0C9 12 10 40 0 63C-10 40-9 12 0 0Z" fill={`url(#${id}lg)`} />
        <path d="M0 2V60" stroke="#2c5a16" strokeWidth=".7" />
      </symbol>
    </defs>
  );
}

const useUid = (p: string) => p + useId().replace(/[^a-zA-Z0-9]/g, "");

/** A lari: marigolds strung down a thread, alternating orange and yellow, a tassel at the end. */
export function lari(id: string, x: number, y0: number, len: number, s = 1, seed = 1): ReactNode {
  const R = rng(seed);
  const step = 30 * s, n = Math.max(2, Math.floor(len / step));
  return (
    <g data-lari key={`${x}-${seed}`}>
      <path d={`M${x} ${y0}V${y0 + n * step}`} stroke="#8a5a1a" strokeWidth={1.2 * s} />
      {Array.from({ length: n }, (_, i) => {
        const yy = y0 + step * (i + 0.5);
        return <g key={i} data-mg transform={`translate(${r1(x + (R() - 0.5) * 2 * s)} ${r1(yy)}) rotate(${r1(R() * 360)}) scale(${r1(s * (0.72 + R() * 0.08))})`}><use href={`#${id}${(i + seed) % 3 === 0 ? "y" : "o"}`} x="-22" y="-22" width="44" height="44" /></g>;
      })}
      <path d={`M${x} ${y0 + n * step}l${-4 * s} ${14 * s}M${x} ${y0 + n * step}l${4 * s} ${14 * s}M${x} ${y0 + n * step}v${16 * s}`} stroke="#d2452b" strokeWidth={1.4 * s} strokeLinecap="round" />
    </g>
  );
}

/** Toran across the top: a rope, mango leaves hanging, marigold swags between. */
export function toran(id: string, w: number, s = 1, seed = 3): ReactNode {
  const R = rng(seed);
  const gap = 46 * s, n = Math.ceil(w / gap) + 1;
  const swags: ReactNode[] = [], leaves: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x = i * gap;
    leaves.push(<g key={`l${i}`} data-leaf transform={`translate(${r1(x)} ${r1(10 * s)}) rotate(${r1((R() - 0.5) * 14)}) scale(${r1(s * 0.75)})`}><use href={`#${id}l`} x="-10" y="0" width="20" height="64" /></g>);
    if (i % 3 === 0) {
      const x2 = x + gap * 3;
      for (let k = 1; k < 9; k++) {
        const t = k / 9, xx = x + (x2 - x) * t, yy = 12 * s + Math.sin(Math.PI * t) * 34 * s;
        swags.push(<g key={`s${i}-${k}`} data-mg transform={`translate(${r1(xx)} ${r1(yy)}) rotate(${r1(R() * 360)}) scale(${r1(s * 0.42)})`}><use href={`#${id}${k % 2 ? "o" : "y"}`} x="-22" y="-22" width="44" height="44" /></g>);
      }
    }
  }
  return (
    <g data-toran>
      {leaves}
      <path d={`M-10 ${10 * s}H${w + 10}`} stroke="#9b6a24" strokeWidth={2.4 * s} />
      {swags}
    </g>
  );
}

export function MarigoldArt({ viewBox, className = "", style, children, par }: { viewBox: string; className?: string; style?: CSSProperties; children: (id: string) => ReactNode; par?: string }) {
  const id = useUid("m");
  return (
    <svg viewBox={viewBox} preserveAspectRatio={par} className={className} style={style} aria-hidden overflow="visible">
      <MarigoldDefs id={id} />
      {children(id)}
    </svg>
  );
}

/** A ring of marigolds — wreath frame for photos, posts, table numbers. */
export function Wreath({ className = "", style, n = 22 }: { className?: string; style?: CSSProperties; n?: number }) {
  return (
    <MarigoldArt viewBox="-120 -120 240 240" className={className} style={style}>
      {(id) => {
        const R = rng(17);
        return (
          <g data-wreath>
            {Array.from({ length: n }, (_, i) => {
              const a = (i / n) * Math.PI * 2;
              return <g key={`l${i}`} transform={`rotate(${r1((a * 180) / Math.PI + 70)}) translate(0 -104) scale(.4)`}><use href={`#${id}l`} x="-10" y="0" width="20" height="64" /></g>;
            })}
            {Array.from({ length: n }, (_, i) => {
              const a = (i / n) * Math.PI * 2;
              return <g key={i} data-mg transform={`translate(${r1(Math.cos(a) * 100)} ${r1(Math.sin(a) * 100)}) rotate(${r1(R() * 360)}) scale(.62)`}><use href={`#${id}${i % 2 ? "y" : "o"}`} x="-22" y="-22" width="44" height="44" /></g>;
            })}
          </g>
        );
      }}
    </MarigoldArt>
  );
}

/** Paper-cut sun with wavy rays. */
export function Sun({ className = "", style, still = false }: { className?: string; style?: CSSProperties; still?: boolean }) {
  const id = useUid("s");
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2, a2 = a + Math.PI / 16;
    return `M${r1(Math.cos(a - 0.12) * 58)} ${r1(Math.sin(a - 0.12) * 58)}Q${r1(Math.cos(a2 - 0.1) * 86)} ${r1(Math.sin(a2 - 0.1) * 86)} ${r1(Math.cos(a) * 96)} ${r1(Math.sin(a) * 96)}Q${r1(Math.cos(a2) * 76)} ${r1(Math.sin(a2) * 76)} ${r1(Math.cos(a + 0.2) * 58)} ${r1(Math.sin(a + 0.2) * 58)}Z`;
  }).join("");
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden data-hsun>
      <defs>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor="#fff3b0" /><stop offset=".6" stopColor="#ffd34a" /><stop offset="1" stopColor="#f6a823" /></radialGradient>
      </defs>
      <g style={still ? undefined : { transformOrigin: "center", transformBox: "fill-box", animation: "haldi-spin 60s linear infinite" }}>
        <path d={rays} fill="#f39c34" />
        <path d={rays} fill="none" stroke="#d2452b" strokeOpacity=".35" strokeWidth="1" transform="rotate(11) scale(.9)" />
      </g>
      <circle r="60" fill={`url(#${id}g)`} />
      <circle r="60" fill="none" stroke="#e38a1b" strokeWidth="1.5" strokeDasharray="2 5" />
    </svg>
  );
}

/** Turmeric watercolour splash (with speckles). */
export function Splash({ className = "", style, seed = 5, color = "#f7b733" }: { className?: string; style?: CSSProperties; seed?: number; color?: string }) {
  const id = useUid("p");
  const R = rng(seed);
  const dots = Array.from({ length: 26 }, () => { const a = R() * Math.PI * 2, d = 70 + R() * 50; return { x: r1(Math.cos(a) * d), y: r1(Math.sin(a) * d), r: r1(0.8 + R() * 4) }; });
  return (
    <svg viewBox="-130 -130 260 260" className={className} style={style} aria-hidden data-splash>
      <defs>
        <filter id={`${id}f`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="4" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="46" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.2" />
        </filter>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor={color} stopOpacity=".55" /><stop offset=".75" stopColor={color} stopOpacity=".8" /><stop offset="1" stopColor="#e8862a" stopOpacity=".95" /></radialGradient>
      </defs>
      <g filter={`url(#${id}f)`}>
        <circle r="78" fill={`url(#${id}g)`} />
        <circle cx="40" cy="-30" r="30" fill={color} opacity=".6" />
      </g>
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={color} opacity=".75" />)}
    </svg>
  );
}

/** Brass urli filled with haldi paste and floating petals. */
export function Urli({ className = "" }: { className?: string }) {
  const id = useUid("u");
  const R = rng(23);
  return (
    <svg viewBox="0 0 300 150" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" x2="1"><stop offset="0" stopColor="#7d5520" /><stop offset=".3" stopColor="#e2b862" /><stop offset=".5" stopColor="#fff0bf" /><stop offset=".72" stopColor="#c4923f" /><stop offset="1" stopColor="#6e4818" /></linearGradient>
        <radialGradient id={`${id}p`}><stop offset="0" stopColor="#ffd84a" /><stop offset="1" stopColor="#f0a514" /></radialGradient>
      </defs>
      <ellipse cx="150" cy="140" rx="70" ry="7" fill="#7a3f12" opacity=".2" />
      <path d="M20 58C30 120 270 120 280 58Z" fill={`url(#${id}b)`} stroke="#6b4416" strokeWidth="1" />
      <path d="M110 112h80l12 22H98Z" fill={`url(#${id}b)`} stroke="#6b4416" strokeWidth="1" />
      <ellipse cx="150" cy="58" rx="130" ry="16" fill={`url(#${id}b)`} stroke="#6b4416" strokeWidth="1" />
      <ellipse cx="150" cy="60" rx="116" ry="11" fill={`url(#${id}p)`} />
      {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={r1(50 + R() * 200)} cy={r1(55 + R() * 9)} rx={r1(3 + R() * 3)} ry={r1(1.6 + R())} transform={`rotate(${r1(R() * 180)} ${r1(50 + i * 9)} 60)`} fill={i % 3 ? "#e8552f" : "#f39c34"} />)}
    </svg>
  );
}

export const PETAL_COLORS = ["#f39c34", "#f7b733", "#e8552f", "#ffd27a", "#e8701a"];
