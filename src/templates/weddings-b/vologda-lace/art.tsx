"use client";
import type { CSSProperties } from "react";
import { useGid } from "../_shared/kit";
import { VL } from "./look";

// Hand-drawn Vologda bobbin lace, Orthodox domes, wedding crowns and bells. Thread strokes carry data-draw;
// solid lace (cloth stitch) is cream with even-odd holes, so whatever stock sits behind shows through.

const f = (n: number) => n.toFixed(2);
const pol = (cx: number, cy: number, r: number, deg: number) => { const a = (deg * Math.PI) / 180; return [cx + Math.sin(a) * r, cy - Math.cos(a) * r] as const; };
type P = { className?: string; style?: CSSProperties };

/** One lace tile (36×46): header braid, net ground, scallop with a hole, tallies and picots. */
function Tile({ x = 0, draw = true }: { x?: number; draw?: boolean }) {
  const D = draw ? { "data-draw": true } : {};
  const picots = [20, 50, 80, 110, 140, 160].map((d) => pol(18, 20, 19.6, 90 + d));
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="0" y="0" width="36" height="5" fill={VL.cream} />
      <path {...D} d="M0 1H36M0 5H36" stroke={VL.thread} strokeWidth="0.6" />
      <path {...D} d="M0 5L18 20L36 5M0 20L18 5L36 20" stroke={VL.thread} strokeWidth="0.45" />
      <circle cx="18" cy="12.5" r="1.7" fill={VL.cream} stroke={VL.thread} strokeWidth="0.45" />
      <path d={`M0 20A18 18 0 0 0 36 20ZM${18 - 4.4} 27a4.4 4.4 0 1 0 8.8 0a4.4 4.4 0 1 0 -8.8 0Z`} fill={VL.cream} fillRule="evenodd" stroke={VL.thread} strokeWidth="0.6" />
      <path {...D} d="M5 20A13 13 0 0 0 31 20" stroke={VL.thread} strokeWidth="0.45" />
      <ellipse cx="8.6" cy="25" rx="1.4" ry="3.2" transform="rotate(-48 8.6 25)" fill={VL.cream} stroke={VL.thread} strokeWidth="0.4" />
      <ellipse cx="27.4" cy="25" rx="1.4" ry="3.2" transform="rotate(48 27.4 25)" fill={VL.cream} stroke={VL.thread} strokeWidth="0.4" />
      {picots.map(([px, py], i) => <circle key={i} cx={f(px)} cy={f(py)} r="1.25" fill="none" stroke={VL.thread} strokeWidth="0.45" />)}
    </g>
  );
}

/** Scalloped lace edging. `tiles` → scales with the container (cards); otherwise a px-height repeating pattern (site). */
export function LaceBand({ className, style, tiles, height = 46 }: P & { tiles?: number; height?: number }) {
  const id = useGid("lb");
  if (tiles) {
    return (
      <svg viewBox={`0 0 ${tiles * 36} 46`} className={className} style={style} aria-hidden fill="none">
        {Array.from({ length: tiles }, (_, i) => <Tile key={i} x={i * 36} />)}
      </svg>
    );
  }
  const k = height / 46;
  return (
    <svg className={className} style={{ height, width: "100%", ...style }} aria-hidden fill="none">
      <defs>
        <pattern id={id} width={36 * k} height={height} patternUnits="userSpaceOnUse">
          <g transform={`scale(${k})`}><Tile draw={false} /></g>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}

/** A lace snowflake rosette (8-fold). */
export function Rosette({ className, style, petals = 8 }: P & { petals?: number }) {
  const step = 360 / petals;
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden fill="none">
      <g stroke={VL.thread} strokeWidth="0.7">
        <circle data-draw r="70" strokeWidth="0.5" />
        <circle data-draw r="76" />
        {Array.from({ length: petals }, (_, i) => (
          <g key={i} transform={`rotate(${i * step})`}>
            <path data-petal d="M0 -18C13 -30 13 -50 0 -60C-13 -50 -13 -30 0 -18ZM-3.6 -39a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0 -7.2 0Z" fill={VL.cream} fillRule="evenodd" />
            <path data-draw d="M0 -24V-33M0 -45V-55" strokeWidth="0.5" />
            <g transform={`rotate(${step / 2})`}>
              <path data-draw d="M0 -20V-74" strokeWidth="0.45" />
              <circle cx="0" cy="-64" r="2.4" fill={VL.cream} />
              <path data-petal d={`M${f(pol(0, 0, 76, -step / 2)[0])} ${f(pol(0, 0, 76, -step / 2)[1])}Q0 -100 ${f(pol(0, 0, 76, step / 2)[0])} ${f(pol(0, 0, 76, step / 2)[1])}A76 76 0 0 0 ${f(pol(0, 0, 76, -step / 2)[0])} ${f(pol(0, 0, 76, -step / 2)[1])}Z`} fill={VL.cream} stroke="none" />
              <path data-draw d={`M${f(pol(0, 0, 76, -step / 2)[0])} ${f(pol(0, 0, 76, -step / 2)[1])}Q0 -100 ${f(pol(0, 0, 76, step / 2)[0])} ${f(pol(0, 0, 76, step / 2)[1])}`} />
              {[-14, -7, 0, 7, 14].map((d) => { const [x, y] = pol(0, 0, d === 0 ? 92 : 90, d); return <circle key={d} cx={f(x)} cy={f(y)} r="1.6" />; })}
            </g>
          </g>
        ))}
        <circle r="15" fill={VL.cream} />
        {Array.from({ length: 6 }, (_, i) => { const [x, y] = pol(0, 0, 8, i * 60); return <circle key={i} cx={f(x)} cy={f(y)} r="2.2" />; })}
        <circle r="2.4" />
      </g>
    </svg>
  );
}

/** Lace ring around an oval portrait: scallops + picots along an ellipse (viewBox matches the oval box). */
export function OvalLace({ className, style, n = 44 }: P & { n?: number }) {
  const a = 100, b = 130, cx = 110, cy = 140;
  const pts = Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * Math.PI * 2; return [cx + Math.cos(t) * a, cy + Math.sin(t) * b] as const; });
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i <= n; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const r = Math.hypot(x1 - x0, y1 - y0) / 2; d += `A${f(r)} ${f(r)} 0 0 0 ${f(x1)} ${f(y1)}`; }
  const pic = pts.slice(0, n).map(([x, y], i) => { const t = ((i + 0.5) / n) * Math.PI * 2; return [cx + Math.cos(t) * (a + 9), cy + Math.sin(t) * (b + 9)] as const; });
  return (
    <svg viewBox="0 0 220 280" className={className} style={style} aria-hidden fill="none">
      <path d={d} fill={VL.cream} stroke={VL.thread} strokeWidth="0.6" />
      <ellipse cx={cx} cy={cy} rx={a - 4} ry={b - 4} stroke={VL.thread} strokeWidth="0.5" />
      {pic.map(([x, y], i) => <circle key={i} cx={f(x)} cy={f(y)} r="1.4" stroke={VL.thread} strokeWidth="0.5" />)}
    </svg>
  );
}

function GoldDefs({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f3dca4" />
      <stop offset="0.45" stopColor="#c99a52" />
      <stop offset="1" stopColor="#8f6a33" />
    </linearGradient>
  );
}
const cross = (x: number, top: number, s = 1) => `M${x} ${top + 30 * s}V${top}M${x - 5 * s} ${top + 6 * s}H${x + 5 * s}M${x - 9 * s} ${top + 12 * s}H${x + 9 * s}M${x - 5 * s} ${top + 24 * s}L${x + 5 * s} ${top + 19 * s}`;
const onion = (x: number, base: number, w: number, h: number) => `M${x - w / 2} ${base}C${x - w / 2 - w * 0.12} ${base - h * 0.32} ${x - w * 0.1} ${base - h * 0.55} ${x} ${base - h}C${x + w * 0.1} ${base - h * 0.55} ${x + w / 2 + w * 0.12} ${base - h * 0.32} ${x + w / 2} ${base}Z`;

/** A white-stone church with gilded onion domes, a tented bell tower and a refectory. */
export function Church({ className, style }: P) {
  const g = useGid("ch");
  const stroke = VL.thread;
  return (
    <svg viewBox="0 0 340 270" className={className} style={style} aria-hidden fill="none">
      <defs><GoldDefs id={g} /></defs>
      <g stroke={stroke} strokeWidth="1" strokeLinejoin="round">
        <path data-draw d="M4 262H336" strokeWidth="1.3" />
        {/* main church */}
        <path data-draw d="M110 262V160H230V262" />
        <path data-draw d="M104 160H236M110 168H230" strokeWidth="0.6" />
        {[130, 170, 210].map((x) => <path key={x} data-draw d={`M${x - 8} 222V196A8 8 0 0 1 ${x + 8} 196V222`} strokeWidth="0.8" />)}
        <path data-draw d="M156 262V238A14 14 0 0 1 184 238V262" />
        <path data-draw d="M110 160Q122 146 134 160Q146 146 158 160Q170 146 182 160Q194 146 206 160Q218 146 230 160" strokeWidth="0.8" />
        {/* drum */}
        <path data-draw d="M150 146V112H190V146" />
        {[160, 170, 180].map((x) => <path key={x} data-draw d={`M${x - 3} 138V126A3 3 0 0 1 ${x + 3} 126V138`} strokeWidth="0.6" />)}
        {/* side drums */}
        <path data-draw d="M118 150V132H134V150M206 150V132H222V150" strokeWidth="0.8" />
        {/* bell tower */}
        <path data-draw d="M24 262V170H70V262" />
        <path data-draw d="M28 170V136H66V170" />
        <path data-draw d="M34 166V146A6 6 0 0 1 46 146V166M48 166V146A6 6 0 0 1 60 146V166" strokeWidth="0.7" />
        <path data-draw d="M26 136L47 70L68 136" />
        <path data-draw d="M36 136L47 100L58 136" strokeWidth="0.5" />
        <path data-draw d="M32 212V194A6 6 0 0 1 44 194V212M50 212V194A6 6 0 0 1 62 194V212" strokeWidth="0.6" />
        {/* refectory */}
        <path data-draw d="M236 262V200H322V262M232 200L279 180L326 200" />
        {[254, 279, 304].map((x) => <path key={x} data-draw d={`M${x - 6} 236V220A6 6 0 0 1 ${x + 6} 220V236`} strokeWidth="0.6" />)}
      </g>
      {/* gilded domes + crosses */}
      <g stroke={VL.gold} strokeWidth="0.9">
        <path data-dome d={onion(170, 112, 50, 62)} fill={`url(#${g})`} />
        <path data-dome d={onion(126, 132, 22, 30)} fill={`url(#${g})`} />
        <path data-dome d={onion(214, 132, 22, 30)} fill={`url(#${g})`} />
        <path data-dome d={onion(47, 70, 14, 18)} fill={`url(#${g})`} />
        <path data-draw d={cross(170, 18, 0.9)} strokeLinecap="round" />
        <path data-draw d={cross(126, 82, 0.55)} strokeLinecap="round" />
        <path data-draw d={cross(214, 82, 0.55)} strokeLinecap="round" />
        <path data-draw d={cross(47, 32, 0.6)} strokeLinecap="round" />
        <path d="M38 146q9-10 18 0v4h-18z" fill={`url(#${g})`} />
      </g>
    </svg>
  );
}

/** A wedding crown (venets) — gilt arches, jewelled band, orb and cross. */
export function Crown({ className, style }: P) {
  const g = useGid("cr");
  return (
    <svg viewBox="0 0 120 112" className={className} style={style} aria-hidden fill="none">
      <defs><GoldDefs id={g} /></defs>
      <g stroke={VL.gold} strokeWidth="1.1" strokeLinejoin="round">
        <path d="M18 88Q60 100 102 88V76Q60 88 18 76Z" fill={`url(#${g})`} />
        <path data-draw d="M20 78C18 46 44 30 60 28C76 30 102 46 100 78" />
        <path data-draw d="M38 82C38 56 50 40 60 34C70 40 82 56 82 82" />
        <path data-draw d="M60 28V84" strokeWidth="0.8" />
        <path data-draw d="M29 80C30 62 40 52 47 48M91 80C90 62 80 52 73 48" strokeWidth="0.6" />
        <circle cx="60" cy="22" r="5.5" fill={`url(#${g})`} />
        <path data-draw d="M60 17V3M54 9H66" strokeLinecap="round" />
      </g>
      {[28, 44, 60, 76, 92].map((x, i) => <circle key={x} cx={x} cy={i === 2 ? 88 : 86.5} r={i % 2 ? 2 : 2.8} fill={i % 2 ? VL.blue : VL.rose} stroke="#fff8ea" strokeWidth="0.6" />)}
    </svg>
  );
}

/** A church bell on its thread. */
export function Bell({ className, style, rope = 40 }: P & { rope?: number }) {
  const g = useGid("bl");
  return (
    <svg viewBox={`-22 ${-rope} 44 ${rope + 34}`} className={className} style={style} aria-hidden fill="none">
      <defs><GoldDefs id={g} /></defs>
      <path data-draw d={`M0 ${-rope}V-14`} stroke={VL.thread} strokeWidth="0.8" />
      <path d="M-15 20C-15 2 -10 -12 0 -14C10 -12 15 2 15 20L19 24H-19Z" fill={`url(#${g})`} stroke={VL.gold} strokeWidth="0.8" />
      <path d="M-9 4C-8 -4 -5 -9 0 -10" stroke="#fff3d0" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
      <circle cx="0" cy="27" r="3.4" fill={VL.gold} />
      <circle cx="0" cy="-16" r="3" stroke={VL.gold} strokeWidth="1.2" />
    </svg>
  );
}

/** A birch twig with catkins and a few young leaves. */
export function Birch({ className, style }: P) {
  const leaf = (x: number, y: number, r: number, s = 1) => <path key={`${x}${y}`} data-leaf d="M0 0C6 -4 12 -12 6 -20C2 -14 -4 -10 0 0Z" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill="#a9b493" fillOpacity="0.75" stroke="#7f8c6b" strokeWidth="0.5" />;
  const catkin = (x: number, y: number, r: number) => (
    <g key={`c${x}`} transform={`translate(${x} ${y}) rotate(${r})`}>
      {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx="0" cy={i * 3.4} rx={2.6 - i * 0.18} ry="2.1" fill="#c8b48c" stroke="#9c8660" strokeWidth="0.4" />)}
    </g>
  );
  return (
    <svg viewBox="0 0 240 120" className={className} style={style} aria-hidden fill="none">
      <path data-draw d="M4 96C50 84 90 70 130 52S206 20 236 14" stroke="#8b7a68" strokeWidth="1.4" strokeLinecap="round" />
      <path data-draw d="M70 78C80 64 84 52 82 40M150 44C162 36 170 26 172 14M196 28C204 34 214 36 226 34" stroke="#8b7a68" strokeWidth="0.9" strokeLinecap="round" />
      {catkin(100, 66, 12)}{catkin(132, 52, -6)}{catkin(206, 26, 18)}
      {leaf(82, 40, 10)}{leaf(172, 14, 30, 0.9)}{leaf(226, 34, 70, 0.8)}{leaf(52, 86, 160, 0.85)}{leaf(160, 46, 200, 0.7)}
    </svg>
  );
}

/** Small ornament: thread line · rosette dot · thread line (Old Russian divider). */
export function Divider({ className, style }: P) {
  return (
    <svg viewBox="0 0 240 20" className={className} style={style} aria-hidden fill="none">
      <g stroke={VL.gold} strokeWidth="0.8">
        <path data-draw d="M0 10H96M144 10H240" />
        <path data-draw d="M104 10C108 4 114 4 120 10C126 16 132 16 136 10M104 10C108 16 114 16 120 10C126 4 132 4 136 10" />
        <path d="M120 3l3 7-3 7-3-7z" fill={VL.gold} />
        <circle cx="100" cy="10" r="1.6" fill={VL.gold} /><circle cx="140" cy="10" r="1.6" fill={VL.gold} />
      </g>
    </svg>
  );
}
