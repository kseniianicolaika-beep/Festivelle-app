"use client";
import type { CSSProperties, ReactNode } from "react";
import { useGid } from "../_shared/kit";

// Hand-painted watercolour eucalyptus for Sage & Linen — silver-dollar leaves in opposite pairs, seeded
// eucalyptus with pods and willowy blades. Leaves carry data-leaf + data-o (their attachment point) so the
// stage can grow them from the stem; the markup alone is the finished painting.

type Pt = [number, number];
const r1 = (n: number) => Math.round(n * 10) / 10;
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const bez = (p: Pt[], t: number): Pt => {
  const u = 1 - t;
  return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0], u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
};
const tan = (p: Pt[], t: number): Pt => {
  const u = 1 - t;
  const x = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0]);
  const y = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1]);
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};
const stemD = (p: Pt[]) => `M${p[0][0]} ${p[0][1]}C${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]} ${p[3][0]} ${p[3][1]}`;

type Ids = { a: string; b: string; c: string; pod: string; wc: string };

/** Watercolour defs: three leaf washes (centre light, rim pooled darker), pod wash and the bleeding-edge filter. */
function Paints({ ids }: { ids: Ids }) {
  const rad = (id: string, s: string[]) => (
    <radialGradient id={id} cx="0.42" cy="0.4" r="0.7">
      <stop offset="0" stopColor={s[0]} /><stop offset="0.62" stopColor={s[1]} /><stop offset="1" stopColor={s[2]} />
    </radialGradient>
  );
  return (
    <defs>
      {rad(ids.a, ["#d3ded4", "#9db4a6", "#728f81"])}
      {rad(ids.b, ["#e2e8e1", "#b5c4ba", "#8ea596"])}
      {rad(ids.c, ["#b2c3b2", "#7a957f", "#58735f"])}
      {rad(ids.pod, ["#d6d2b8", "#b3b393", "#8f9776"])}
      <filter id={ids.wc} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="11" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
}
function usePaints(): Ids {
  return { a: useGid("sla"), b: useGid("slb"), c: useGid("slc"), pod: useGid("slp"), wc: useGid("slw") };
}

function leafPath(r: number) {
  const k = (n: number) => r1(n * r);
  return `M0 0C${k(-0.1)} ${k(-0.75)} ${k(0.55)} ${k(-1)} ${k(1)} ${k(-0.95)}C${k(1.55)} ${k(-0.88)} ${k(1.86)} ${k(-0.36)} ${k(1.82)} 0C${k(1.85)} ${k(0.38)} ${k(1.5)} ${k(0.9)} ${k(0.95)} ${k(0.96)}C${k(0.5)} ${k(0.98)} ${k(-0.12)} ${k(0.7)} 0 0Z`;
}

/** A silver-dollar eucalyptus stem: round leaves in near-opposite pairs, shrinking toward the tip. */
function dollarStem(p: Pt[], ids: Ids, seed: number, nodes: number, size: number, key: string) {
  const rand = rng(seed);
  const fills = [ids.a, ids.b, ids.c];
  const leaves: ReactNode[] = [];
  for (let i = 0; i < nodes; i++) {
    const t0 = 0.1 + 0.86 * (i / Math.max(1, nodes - 1));
    for (const side of [-1, 1]) {
      const t = Math.min(0.99, t0 + (side > 0 ? 0.03 + 0.04 * rand() : 0));
      const [x, y] = bez(p, t);
      const [tx, ty] = tan(p, t);
      const nx = -ty * side, ny = tx * side;
      const r = (24 - 13 * t) * size * (0.86 + 0.28 * rand());
      const ang = (Math.atan2(ny + ty * 0.35, nx + tx * 0.35) * 180) / Math.PI + (rand() - 0.5) * 18;
      const fill = fills[Math.floor(rand() * 3)];
      leaves.push(
        <g key={`${key}${i}${side}`} data-leaf data-o={`${r1(x)} ${r1(y)}`} transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})`}>
          <path d={leafPath(r)} fill={`url(#${fill})`} fillOpacity={0.88} stroke="#5f7a6b" strokeOpacity={0.4} strokeWidth={0.9} />
          <path d={`M0 0L${r1(r * 1.35)} ${r1((rand() - 0.5) * r * 0.2)}`} stroke="#f4f6f0" strokeOpacity={0.55} strokeWidth={0.7} fill="none" />
        </g>,
      );
    }
  }
  return (
    <g key={key}>
      <path data-stem d={stemD(p)} stroke="#8c7b6c" strokeWidth={1.9} fill="none" strokeLinecap="round" />
      {leaves}
    </g>
  );
}

/** Seeded eucalyptus: a slender branch with clustered pods and willowy blades. */
function seededStem(p: Pt[], ids: Ids, seed: number, size: number, key: string) {
  const rand = rng(seed);
  const parts: ReactNode[] = [];
  [0.18, 0.38, 0.58, 0.78, 0.95].forEach((t, i) => {
    const [x, y] = bez(p, t);
    const [tx, ty] = tan(p, t);
    const side = i % 2 ? 1 : -1;
    const nx = -ty * side, ny = tx * side;
    // blade
    const L = (46 - 18 * t) * size;
    const ang = (Math.atan2(ny + ty * 0.9, nx + tx * 0.9) * 180) / Math.PI;
    parts.push(
      <g key={`${key}b${i}`} data-leaf data-o={`${r1(x)} ${r1(y)}`} transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})`}>
        <path d={`M0 0Q${r1(L * 0.45)} ${r1(-L * 0.16)} ${r1(L)} ${r1(L * 0.06)}Q${r1(L * 0.5)} ${r1(L * 0.12)} 0 0Z`} fill={`url(#${ids.c})`} fillOpacity={0.8} stroke="#5f7a6b" strokeOpacity={0.35} strokeWidth={0.6} />
      </g>,
    );
    // pod cluster on the opposite side
    const cx = x - nx * 10 * size, cy = y - ny * 10 * size;
    const pods = 5 + Math.floor(rand() * 4);
    const g: ReactNode[] = [<path key="s" d={`M${r1(x)} ${r1(y)}L${r1(cx)} ${r1(cy)}`} stroke="#8c7b6c" strokeWidth={0.8} />];
    for (let k = 0; k < pods; k++) {
      const a = rand() * Math.PI * 2, d = rand() * 7 * size;
      const px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d, pr = (2.3 + rand() * 1.6) * size;
      g.push(<circle key={k} cx={r1(px)} cy={r1(py)} r={r1(pr)} fill={`url(#${ids.pod})`} stroke="#7d8566" strokeOpacity={0.55} strokeWidth={0.5} />);
      g.push(<circle key={`d${k}`} cx={r1(px)} cy={r1(py)} r={r1(pr * 0.32)} fill="none" stroke="#6f7559" strokeOpacity={0.6} strokeWidth={0.4} />);
    }
    parts.push(<g key={`${key}p${i}`} data-leaf data-o={`${r1(x)} ${r1(y)}`}>{g}</g>);
  });
  return (
    <g key={key}>
      <path data-stem d={stemD(p)} stroke="#8c7b6c" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      {parts}
    </g>
  );
}

/** The hero bouquet — a tall dollar stem, a seeded branch and a short crossing stem, loosely tied. */
export function Bouquet({ className, style, sway = true }: { className?: string; style?: CSSProperties; sway?: boolean }) {
  const ids = usePaints();
  return (
    <svg viewBox="0 0 360 700" className={`block h-auto w-full ${className ?? ""}`} style={style} aria-hidden fill="none">
      <Paints ids={ids} />
      <g filter={`url(#${ids.wc})`} className={sway ? "sl-sway" : undefined} style={{ transformOrigin: "50% 100%" }}>
        {seededStem([[178, 690], [150, 520], [250, 360], [300, 150]], ids, 7, 1.15, "sd")}
        {seededStem([[176, 690], [120, 560], [40, 470], [20, 330]], ids, 23, 0.95, "sd2")}
        {dollarStem([[176, 690], [230, 520], [40, 330], [130, 40]], ids, 3, 10, 1.3, "d1")}
        {dollarStem([[180, 690], [200, 560], [270, 520], [330, 400]], ids, 19, 5, 1.1, "d2")}
        {dollarStem([[178, 690], [168, 600], [110, 560], [60, 520]], ids, 29, 3, 1, "d3")}
      </g>
      <path d="M160 640q20 8 40-2M162 652q18 7 36-1" stroke="#b4a276" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

/** A single horizontal sprig — section dividers and card corners. */
export function Sprig({ className, style, seed = 5, seeded = false, nodes = 6 }: { className?: string; style?: CSSProperties; seed?: number; seeded?: boolean; nodes?: number }) {
  const ids = usePaints();
  const p: Pt[] = [[8, 92], [110, 100], [190, 40], [292, 52]];
  return (
    <svg viewBox="0 0 300 140" className={`block h-auto w-full ${className ?? ""}`} style={style} aria-hidden fill="none">
      <Paints ids={ids} />
      <g filter={`url(#${ids.wc})`}>{seeded ? seededStem(p, ids, seed, 0.8, "s") : dollarStem(p, ids, seed, nodes, 0.62, "s")}</g>
    </svg>
  );
}

/** A corner spray: two stems fanning from one corner (for cards and the RSVP card). */
export function Spray({ className, style, seed = 9 }: { className?: string; style?: CSSProperties; seed?: number }) {
  const ids = usePaints();
  return (
    <svg viewBox="0 0 320 320" className={`block h-auto w-full ${className ?? ""}`} style={style} aria-hidden fill="none">
      <Paints ids={ids} />
      <g filter={`url(#${ids.wc})`}>
        {seededStem([[318, 8], [230, 30], [150, 90], [40, 120]], ids, seed + 2, 1.05, "a")}
        {dollarStem([[318, 6], [260, 90], [200, 170], [170, 300]], ids, seed, 7, 1.08, "b")}
        {dollarStem([[316, 10], [250, 40], [190, 50], [110, 30]], ids, seed + 5, 5, 0.86, "c")}
        {dollarStem([[318, 8], [300, 70], [280, 110], [250, 160]], ids, seed + 9, 3, 0.8, "d")}
      </g>
    </svg>
  );
}

/** A loose watercolour wash — a pooled puddle of pigment with bleeding edges. */
export function Wash({ className, style, color = "#a9bda9", opacity = 0.28 }: { className?: string; style?: CSSProperties; color?: string; opacity?: number }) {
  const f = useGid("slwash");
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="none" className={`block h-auto w-full ${className ?? ""}`} style={style} aria-hidden>
      <defs>
        <filter id={f} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <g filter={`url(#${f})`}>
        <ellipse cx="200" cy="150" rx="160" ry="104" fill={color} fillOpacity={opacity} />
        <ellipse cx="185" cy="140" rx="110" ry="70" fill={color} fillOpacity={opacity * 0.6} />
        <ellipse cx="200" cy="150" rx="160" ry="104" fill="none" stroke={color} strokeOpacity={opacity * 1.6} strokeWidth="3" />
      </g>
    </svg>
  );
}

/** The long garden table in one-point perspective: linen runner, candles, bud vases, place settings. */
export function LongTable({ className, style }: { className?: string; style?: CSSProperties }) {
  const ids = usePaints();
  const ink = "#3f473d";
  const near = 214, far = 104;
  const L = (t: number) => 46 + (318 - 46) * t, R = (t: number) => 754 - (754 - 482) * t, Y = (t: number) => near - (near - far) * t;
  const ts = [0.08, 0.27, 0.44, 0.59, 0.72, 0.83];
  return (
    <svg viewBox="0 0 800 270" className={`block h-auto w-full ${className ?? ""}`} style={style} aria-hidden fill="none">
      <Paints ids={ids} />
      {/* linen top + runner */}
      <path d={`M${L(0)} ${near}H${R(0)}L${R(1)} ${far}H${L(1)}Z`} fill="#fbfaf6" />
      <path d={`M352 ${near}H448L412 ${far}H388Z`} fill="#a9bda9" fillOpacity={0.35} />
      <g stroke={ink} strokeWidth={1} strokeLinejoin="round" strokeLinecap="round">
        <path data-draw d={`M${L(0)} ${near}H${R(0)}L${R(1)} ${far}H${L(1)}Z`} />
        <path data-draw d={`M${L(0)} ${near}V${near + 16}H${R(0)}V${near}`} />
        <path data-draw d={`M64 ${near + 16}V266M736 ${near + 16}V266M${L(0.55) + 18} ${Y(0.55) + 10}V${Y(0.55) + 34}M${R(0.55) - 18} ${Y(0.55) + 10}V${Y(0.55) + 34}`} strokeWidth={0.9} />
        <path data-draw d={`M352 ${near}L388 ${far}M448 ${near}L412 ${far}`} strokeWidth={0.6} strokeOpacity={0.6} />
        {ts.map((t, i) => {
          const s = 1 - 0.62 * t;
          const y = Y(t), lx = L(t) + 34 * s + 8, rx = R(t) - 34 * s - 8;
          return (
            <g key={i}>
              {/* place settings */}
              <ellipse data-draw cx={r1(lx)} cy={r1(y - 4 * s)} rx={r1(15 * s)} ry={r1(5 * s)} strokeWidth={0.7} />
              <ellipse data-draw cx={r1(rx)} cy={r1(y - 4 * s)} rx={r1(15 * s)} ry={r1(5 * s)} strokeWidth={0.7} />
              {/* candle + flame */}
              <path data-draw d={`M${r1(400 - 3 * s)} ${r1(y - 6 * s)}V${r1(y - 40 * s)}M${r1(400 + 3 * s)} ${r1(y - 6 * s)}V${r1(y - 40 * s)}`} strokeWidth={0.8} />
              <path data-flame d={`M400 ${r1(y - 52 * s)}q${r1(4 * s)} ${r1(7 * s)} 0 ${r1(10 * s)}q${r1(-4 * s)} ${r1(-3 * s)} 0 ${r1(-10 * s)}z`} fill="#e7c98a" stroke="none" />
              {/* bud vase with a stem, alternating sides of the candle */}
              {i % 2 === 0 && (
                <g transform={`translate(${r1(400 + (i % 4 ? -18 : 18) * s)} ${r1(y - 4 * s)}) scale(${r1(s)})`}>
                  <path data-draw d="M-4 0Q-7 -9 -2 -13V-17H2V-13Q7 -9 4 0Z" strokeWidth={0.8} />
                  <path d="M0 -17Q-6 -32 -12 -40M0 -17Q5 -30 10 -44" stroke="#8c7b6c" strokeWidth={0.8} />
                  <circle cx="-12" cy="-40" r="4.5" fill={`url(#${ids.a})`} stroke="none" />
                  <circle cx="-7" cy="-31" r="3.6" fill={`url(#${ids.b})`} stroke="none" />
                  <circle cx="10" cy="-44" r="4" fill={`url(#${ids.c})`} stroke="none" />
                  <circle cx="6" cy="-34" r="3.2" fill={`url(#${ids.a})`} stroke="none" />
                </g>
              )}
            </g>
          );
        })}
        {/* chairs on the near corners */}
        <path data-draw d="M18 266V196Q18 176 38 176H40M780 266V196Q780 176 760 176H758" strokeWidth={0.9} />
        <path data-draw d="M18 214H40M780 214H758" strokeWidth={0.7} />
      </g>
    </svg>
  );
}
