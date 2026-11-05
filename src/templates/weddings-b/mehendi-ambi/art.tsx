"use client";
import type { CSSProperties } from "react";
import { useGid } from "../_shared/kit";

// Mehendi Ambi — henna-cone line art. Every stroke is the stain colour; paths carry data-pipe so the stage
// can "pipe" them in with DrawSVG. The markup alone is the finished drawing.

export const HENNA = "#7a3112";
export const HENNA_2 = "#b4521d";
const f = (n: number) => n.toFixed(2);
const P = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r] as const;
type SvgP = { className?: string; style?: CSSProperties };

/** The ambi (paisley / keri): outline, dotted halo, scalloped inner, a little flower and a curled tip. */
export function Paisley({ className, style, fill = false }: SvgP & { fill?: boolean }) {
  const g = useGid("pz");
  const body = "M50 132C16 130 4 98 14 72C24 46 54 40 60 18C62 10 70 8 74 16C92 46 96 80 88 104C82 122 68 132 50 132Z";
  const petals = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return `M${f(52 + Math.cos(a) * 4)} ${f(98 + Math.sin(a) * 4)}Q${f(52 + Math.cos(a + 0.4) * 13)} ${f(98 + Math.sin(a + 0.4) * 13)} ${f(52 + Math.cos(a) * 14)} ${f(98 + Math.sin(a) * 14)}Q${f(52 + Math.cos(a - 0.4) * 13)} ${f(98 + Math.sin(a - 0.4) * 13)} ${f(52 + Math.cos(a) * 4)} ${f(98 + Math.sin(a) * 4)}`;
  });
  return (
    <svg viewBox="-6 -4 112 144" className={className} style={style} aria-hidden fill="none">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={HENNA} /><stop offset="1" stopColor={HENNA_2} /></linearGradient>
      </defs>
      <g stroke={`url(#${g})`} strokeLinecap="round" strokeLinejoin="round">
        {fill && <path d={body} fill={HENNA_2} fillOpacity="0.06" stroke="none" />}
        <path data-pipe d={body} strokeWidth="1.6" />
        <path d={body} transform="translate(50 92) scale(1.1) translate(-50 -92)" strokeWidth="2" strokeDasharray="0 5.5" />
        <path data-pipe d={body} transform="translate(52 94) scale(0.78) translate(-50 -92)" strokeWidth="0.9" strokeDasharray="5 2.5" />
        <path data-pipe d={body} transform="translate(52 96) scale(0.6) translate(-50 -92)" strokeWidth="0.9" />
        <path data-pipe d="M60 18C58 6 48 4 44 11C41 17 47 22 52 18" strokeWidth="1.3" />
        {petals.map((d, i) => <path key={i} data-pipe d={d} strokeWidth="0.8" />)}
        <circle cx="52" cy="98" r="2.2" fill={HENNA} stroke="none" />
        <path data-pipe d="M40 70C46 62 54 62 60 56M36 80C44 74 58 72 66 64" strokeWidth="0.7" />
        <path d="M30 60L33 56M70 52L73 48M36 52l3-3" strokeWidth="1.6" strokeDasharray="0 4" />
      </g>
    </svg>
  );
}

/** A henna mandala: petal rings, scallops and dotted halos around a core (empty when a photo sits inside). */
export function Mandala({ className, style, core = 30, center = true }: SvgP & { core?: number; center?: boolean }) {
  const g = useGid("md");
  const c = core;
  const ring = (n: number, r0: number, r1: number, w: number, off = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + off;
      const da = (Math.PI / n) * w;
      const [x0, y0] = P(r0, a);
      const [xl, yl] = P((r0 + r1) / 2 + 1, a - da);
      const [xr, yr] = P((r0 + r1) / 2 + 1, a + da);
      const [x1, y1] = P(r1, a);
      return `M${f(x0)} ${f(y0)}Q${f(xl)} ${f(yl)} ${f(x1)} ${f(y1)}Q${f(xr)} ${f(yr)} ${f(x0)} ${f(y0)}`;
    });
  const veins = (n: number, r0: number, r1: number, off = 0) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + off; const [x0, y0] = P(r0, a); const [x1, y1] = P(r1, a); return `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`; }).join("");
  const scallops = (n: number, r: number) => {
    const rr = r * Math.sin(Math.PI / n);
    return Array.from({ length: n }, (_, i) => { const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2; const [x0, y0] = P(r, a0); const [x1, y1] = P(r, a1); return `M${f(x0)} ${f(y0)}A${f(rr)} ${f(rr)} 0 0 0 ${f(x1)} ${f(y1)}`; }).join("");
  };
  const k = (100 - c) / 70; // compress rings when the core grows
  const r = (n: number) => c + n * k;
  return (
    <svg viewBox="-104 -104 208 208" className={className} style={style} aria-hidden fill="none">
      <defs>
        <radialGradient id={g}><stop offset="0.3" stopColor={HENNA} /><stop offset="1" stopColor={HENNA_2} /></radialGradient>
      </defs>
      <g stroke={`url(#${g})`} strokeLinecap="round" strokeLinejoin="round">
        <circle data-pipe r={c} strokeWidth="1.4" />
        <circle r={c - 4} strokeWidth="1.8" strokeDasharray="0 4.2" />
        {center && c <= 32 && (
          <>
            {ring(8, 4, c - 9, 0.55).map((d, i) => <path key={i} data-pipe d={d} strokeWidth="0.9" />)}
            <circle r="3" fill={HENNA} stroke="none" />
          </>
        )}
        {ring(12, r(2), r(16), 0.62).map((d, i) => <path key={i} data-pipe d={d} strokeWidth="1.1" />)}
        <path data-pipe d={veins(12, r(4), r(13))} strokeWidth="0.6" />
        <circle data-pipe r={r(20)} strokeWidth="1.2" />
        <path data-pipe d={scallops(24, r(20))} strokeWidth="1" />
        <circle r={r(31)} strokeWidth="2" strokeDasharray="0 4.6" />
        {ring(24, r(36), r(62), 0.5, Math.PI / 24).map((d, i) => <path key={i} data-pipe d={d} strokeWidth="1.1" />)}
        {ring(24, r(40), r(55), 0.3, Math.PI / 24).map((d, i) => <path key={i} d={d} strokeWidth="0.6" />)}
        {ring(24, r(36), r(50), 0.36, 0).map((d, i) => <path key={i} data-pipe d={d} strokeWidth="0.8" />)}
        <circle data-pipe r={r(66)} strokeWidth="0.8" />
        <circle r={r(70)} strokeWidth="2.2" strokeDasharray="0 5" />
      </g>
      <g fill={HENNA}>
        {Array.from({ length: 24 }, (_, i) => { const [x, y] = P(r(65), (i / 24) * Math.PI * 2 + Math.PI / 24); return <circle key={i} cx={f(x)} cy={f(y)} r="1.6" />; })}
      </g>
    </svg>
  );
}

/** A trailing vine of leaves, tendrils and dots (horizontal, 400×60). */
export function Vine({ className, style, leaves = 9 }: SvgP & { leaves?: number }) {
  const n = leaves;
  const pts = Array.from({ length: 81 }, (_, i) => [i * 5, 30 + Math.sin((i / 80) * Math.PI * n) * 10] as const);
  const d = "M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L");
  const items = Array.from({ length: n }, (_, i) => {
    const x = ((i + 0.5) / n) * 400;
    const up = i % 2 === 0;
    const y = 30 + (up ? -10 : 10);
    const s = up ? -1 : 1;
    return { x, y, s };
  });
  return (
    <svg viewBox="0 0 400 60" className={className} style={style} aria-hidden fill="none">
      <g stroke={HENNA} strokeLinecap="round">
        <path data-pipe d={d} strokeWidth="1.3" />
        {items.map(({ x, y, s }, i) => (
          <g key={i}>
            <path data-pipe d={`M${f(x)} ${f(y)}Q${f(x - 10)} ${f(y + s * 12)} ${f(x - 2)} ${f(y + s * 22)}Q${f(x + 6)} ${f(y + s * 10)} ${f(x)} ${f(y)}`} strokeWidth="0.9" fill={i % 3 === 0 ? "#5f7a3a" : "none"} fillOpacity="0.18" />
            <path d={`M${f(x)} ${f(y)}L${f(x - 2)} ${f(y + s * 17)}`} strokeWidth="0.5" />
            <path data-pipe d={`M${f(x + 6)} ${f(y - s * 1)}c6 ${-s * 4} 10 ${-s * 1} 8 ${-s * 7}c-1 -3 -5 -2 -4 ${s > 0 ? -1 : 1}`} strokeWidth="0.7" />
            <circle cx={f(x + 14)} cy={f(y - s * 12)} r="1.4" fill={HENNA} stroke="none" />
            <circle cx={f(x - 12)} cy={f(y - s * 6)} r="1" fill={HENNA} stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** A marigold bloom (genda phool): ruffled rings in saffron and orange. */
export function Marigold({ cx, cy, r, tone = 0 }: { cx: number; cy: number; r: number; tone?: number }) {
  const cols = [["#f29b1d", "#e8740e", "#c4500c"], ["#f6c33b", "#f29b1d", "#d97b0e"]][tone % 2];
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={cols[0]} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={cols[1]} strokeWidth={r * 0.5} strokeDasharray={`${r * 0.25} ${r * 0.18}`} />
      <circle cx={cx} cy={cy} r={r * 0.62} fill={cols[1]} stroke={cols[2]} strokeWidth={r * 0.3} strokeDasharray={`${r * 0.16} ${r * 0.12}`} />
      <circle cx={cx} cy={cy} r={r * 0.22} fill={cols[2]} />
    </g>
  );
}

/** A toran garland — marigold strings and mango leaves swagged from a cord (400×120). */
export function Toran({ className, style }: SvgP) {
  const strands = [30, 90, 150, 200, 250, 310, 370];
  return (
    <svg viewBox="0 0 400 130" className={className} style={style} aria-hidden fill="none">
      <path data-pipe d="M0 8Q100 34 200 8Q300 34 400 8" stroke={HENNA} strokeWidth="1.4" />
      {strands.map((x, i) => {
        const top = 8 + Math.sin((x / 200) * Math.PI) * 13;
        const len = i % 2 ? 4 : 6;
        return (
          <g key={x} data-strand>
            <path d={`M${x} ${f(top)}V${f(top + len * 13)}`} stroke={HENNA} strokeWidth="0.6" />
            {Array.from({ length: len }, (_, j) => <Marigold key={j} cx={x} cy={top + 8 + j * 13} r={6} tone={(i + j) % 2} />)}
            <path d={`M${x} ${f(top + len * 13 + 4)}q-4 8 0 16q4 -8 0 -16`} fill="#c0392b" />
          </g>
        );
      })}
      {Array.from({ length: 13 }, (_, i) => {
        const x = 15 + i * 30;
        const y = 8 + Math.abs(Math.sin((x / 200) * Math.PI)) * 13 + 2;
        return <path key={i} d={`M${x} ${f(y)}q-7 10 0 24q7 -14 0 -24z`} fill={i % 2 ? "#4f7a2b" : "#6b9a36"} stroke="#3c5a20" strokeWidth="0.5" />;
      })}
    </svg>
  );
}

/** The henna cone — follows the line being piped. */
export function Cone({ className, style }: SvgP) {
  return (
    <svg viewBox="0 0 40 90" className={className} style={style} aria-hidden>
      <path d="M8 4L32 4L21 80L19 80Z" fill="#f4ead8" stroke="#a88d6a" strokeWidth="1" />
      <path d="M12 10L28 10L22 56L18 56Z" fill="#6e2a0e" opacity="0.85" />
      <path d="M19 80L21 80L20.4 88L19.6 88Z" fill="#4a1d0a" />
      <path d="M8 4L32 4" stroke="#c9b48e" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 20L28 18M11 30L29 28" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

/** Rose petal + marigold petal shapes for the falling shower. */
export function Petal({ kind, className, style }: SvgP & { kind: number }) {
  if (kind % 3 === 0) return <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden><circle cx="10" cy="10" r="7" fill="#f29b1d" /><circle cx="10" cy="10" r="7" fill="none" stroke="#e0700c" strokeWidth="3" strokeDasharray="2 1.4" /><circle cx="10" cy="10" r="2.4" fill="#c4500c" /></svg>;
  return <svg viewBox="0 0 20 24" className={className} style={style} aria-hidden><path d="M10 1C17 6 19 15 10 23C1 15 3 6 10 1Z" fill={kind % 3 === 1 ? "#d9455f" : "#ef8aa0"} /><path d="M10 4V20" stroke="#fff" strokeOpacity="0.3" strokeWidth="0.8" /></svg>;
}

/** A henna-drawn card frame sized to the piece's ratio (viewBox 100 × 100·ratio). */
export function HennaFrame({ ratio, className }: { ratio: number; className?: string }) {
  const W = 100, H = 100 * ratio;
  const i1 = 4, i2 = 5.6, i3 = 7.2;
  const rect = (i: number) => `M${i} ${i}H${W - i}V${H - i}H${i}Z`;
  const corner = (cx: number, cy: number, rot: number) => (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      {Array.from({ length: 5 }, (_, k) => { const a = (k / 4) * (Math.PI / 2); const [x, y] = P(9, a); const [xl, yl] = P(6, a - 0.25); const [xr, yr] = P(6, a + 0.25); return <path key={k} data-pipe d={`M0 0Q${f(xl)} ${f(yl)} ${f(x)} ${f(y)}Q${f(xr)} ${f(yr)} 0 0`} strokeWidth="0.35" />; })}
      <path data-pipe d={`M11 0A11 11 0 0 1 0 11`} strokeWidth="0.3" />
      <path d={`M13.5 0A13.5 13.5 0 0 1 0 13.5`} strokeWidth="0.7" strokeDasharray="0 1.4" />
      <circle r="1.2" fill={HENNA} stroke="none" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${f(H)}`} className={className} preserveAspectRatio="none" aria-hidden fill="none">
      <g stroke={HENNA} strokeLinecap="round">
        <path data-pipe d={rect(i1)} strokeWidth="0.45" />
        <path d={rect(i2)} strokeWidth="0.75" strokeDasharray="0 1.25" />
        <path data-pipe d={rect(i3)} strokeWidth="0.22" />
        {corner(i3, i3, 0)}
        {corner(W - i3, i3, 90)}
        {corner(W - i3, H - i3, 180)}
        {corner(i3, H - i3, 270)}
      </g>
    </svg>
  );
}

/** Jaal (lattice net) background tile as a data URI. */
export const jaal = (alpha = 0.16) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='rgba(150,62,20,${alpha})' stroke-width='0.8'><path d='M28 0C34 10 46 22 56 28C46 34 34 46 28 56C22 46 10 34 0 28C10 22 22 10 28 0Z'/><path d='M28 20q3 5 0 8q-3-3 0-8zM28 36q3-5 0-8q-3 3 0 8zM20 28q5 3 8 0q-3-3-8 0zM36 28q-5 3-8 0q3-3 8 0z'/></g><g fill='rgba(150,62,20,${alpha * 1.4})'><circle cx='28' cy='28' r='1.3'/><circle cx='0' cy='0' r='1.6'/><circle cx='56' cy='0' r='1.6'/><circle cx='0' cy='56' r='1.6'/><circle cx='56' cy='56' r='1.6'/></g></svg>`)}")`;
