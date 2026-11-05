import { useId, type CSSProperties, type ReactNode } from "react";
import { r2, rng } from "./kit";

// Parametric, seeded botanical painting in SVG. Every bloom is built petal by petal so no two match;
// a turbulence + displacement filter gives the wet edges of watercolour.

export const petal = (l: number, w: number) =>
  `M0 0C${r2(-w)} ${r2(-l * 0.2)} ${r2(-w * 1.05)} ${r2(-l * 0.8)} ${r2(-w * 0.45)} ${r2(-l * 0.98)}Q0 ${r2(-l * 0.88)} ${r2(w * 0.45)} ${r2(-l * 0.98)}C${r2(w * 1.05)} ${r2(-l * 0.8)} ${r2(w)} ${r2(-l * 0.2)} 0 0Z`;
export const leaf = (l: number, w: number) => `M0 0C${r2(w)} ${r2(-l * 0.25)} ${r2(w * 0.7)} ${r2(-l * 0.75)} 0 ${r2(-l)}C${r2(-w * 0.7)} ${r2(-l * 0.75)} ${r2(-w)} ${r2(-l * 0.25)} 0 0Z`;
const arc = (r: number, a0: number, sweep: number) => {
  const p = (a: number) => `${r2(Math.cos((a * Math.PI) / 180) * r)} ${r2(Math.sin((a * Math.PI) / 180) * r)}`;
  return `M${p(a0)}A${r2(r)} ${r2(r)} 0 ${sweep > 180 ? 1 : 0} 1 ${p(a0 + sweep)}`;
};

export type Pal = { light: string; mid: string; deep: string; leaf: string; leafDeep: string };

export function WcDefs({ id, pal, scale = 7 }: { id: string; pal: Pal; scale?: number }) {
  return (
    <defs>
      <filter id={`${id}wc`} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="0.35" />
      </filter>
      <filter id={`${id}bleed`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
      <linearGradient id={`${id}p`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={pal.deep} /><stop offset=".55" stopColor={pal.mid} /><stop offset="1" stopColor={pal.light} /></linearGradient>
      <linearGradient id={`${id}pi`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={pal.deep} /><stop offset="1" stopColor={pal.mid} /></linearGradient>
      <linearGradient id={`${id}l`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={pal.leafDeep} /><stop offset="1" stopColor={pal.leaf} /></linearGradient>
    </defs>
  );
}

/** A garden rose / peony bloom. */
export function Bloom({ id, x, y, r, seed, rot = 0, pal, ruffle = false }: { id: string; x: number; y: number; r: number; seed: number; rot?: number; pal: Pal; ruffle?: boolean }) {
  const R = rng(seed);
  const ring = (n: number, len: number, wid: number, off: number, op: number, fill: string, key: string) =>
    Array.from({ length: n }, (_, k) => {
      const a = off + (k * 360) / n + (R() - 0.5) * 18;
      const l = len * (0.86 + R() * 0.24);
      return <path key={key + k} d={petal(l, wid * l)} transform={`rotate(${r2(a)})`} fill={fill} opacity={op} stroke={pal.deep} strokeOpacity=".22" strokeWidth={r2(r * 0.012)} style={{ mixBlendMode: "multiply" }} />;
    });
  const spins = Array.from({ length: 5 }, (_, i) => <path key={"s" + i} d={arc(r * (0.36 - i * 0.06), R() * 360, 150 + R() * 110)} fill="none" stroke={pal.deep} strokeWidth={r2(r * (0.05 - i * 0.006))} strokeLinecap="round" opacity={0.55 + i * 0.07} />);
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${rot})`}>
      <circle r={r * 1.15} fill={pal.mid} opacity=".22" filter={`url(#${id}bleed)`} />
      <g filter={`url(#${id}wc)`}>
        {ring(ruffle ? 9 : 7, r, 0.62, 0, 0.5, `url(#${id}p)`, "a")}
        {ring(ruffle ? 8 : 6, r * 0.78, 0.6, 24, 0.62, `url(#${id}p)`, "b")}
        {ring(5, r * 0.55, 0.64, 9, 0.72, `url(#${id}pi)`, "c")}
        <circle r={r * 0.3} fill={pal.mid} opacity=".55" />
        {spins}
      </g>
    </g>
  );
}

export function Bud({ id, x, y, s, rot, pal }: { id: string; x: number; y: number; s: number; rot: number; pal: Pal }) {
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`} filter={`url(#${id}wc)`}>
      <path d={`M0 0Q${-s * 0.1} ${-s * 0.9} 0 ${-s * 1.6}`} stroke={pal.leafDeep} strokeWidth={s * 0.08} fill="none" />
      <path d={petal(s * 0.75, s * 0.5)} transform={`translate(0 ${-s * 1.5}) rotate(180)`} fill={`url(#${id}pi)`} opacity=".8" />
      <path d={leaf(s * 0.6, s * 0.22)} transform={`translate(0 ${-s * 1.45}) rotate(150)`} fill={`url(#${id}l)`} opacity=".85" />
      <path d={leaf(s * 0.6, s * 0.22)} transform={`translate(0 ${-s * 1.45}) rotate(-150)`} fill={`url(#${id}l)`} opacity=".85" />
    </g>
  );
}

export function Leaf({ id, x, y, l, rot, pal, op = 0.8 }: { id: string; x: number; y: number; l: number; rot: number; pal: Pal; op?: number }) {
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`} filter={`url(#${id}wc)`}>
      <path d={leaf(l, l * 0.3)} fill={`url(#${id}l)`} opacity={op} style={{ mixBlendMode: "multiply" }} />
      <path d={`M0 0Q${r2(l * 0.05)} ${r2(-l * 0.5)} 0 ${r2(-l * 0.92)}`} stroke={pal.leafDeep} strokeWidth={l * 0.025} fill="none" opacity=".55" />
    </g>
  );
}

/** A branch of small leaves (eucalyptus / olive) following a curve. */
export function Branch({ id, d, x, y, len, rot, n = 9, pal, round = false, seed = 3 }: { id: string; d?: string; x: number; y: number; len: number; rot: number; n?: number; pal: Pal; round?: boolean; seed?: number }) {
  const R = rng(seed);
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`} filter={`url(#${id}wc)`}>
      <path d={d ?? `M0 0Q${r2(len * 0.12)} ${r2(-len * 0.5)} 0 ${r2(-len)}`} stroke={pal.leafDeep} strokeWidth={len * 0.012} fill="none" opacity=".7" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.6) / n;
        const side = i % 2 ? 1 : -1;
        const l = len * (round ? 0.11 : 0.16) * (1.1 - t * 0.5) * (0.85 + R() * 0.3);
        return round ? (
          <ellipse key={i} cx={r2(side * l * 0.7 + len * 0.06 * Math.sin(t * 3))} cy={r2(-len * t)} rx={r2(l * 0.8)} ry={r2(l * 0.7)} fill={`url(#${id}l)`} opacity={0.55 + R() * 0.3} style={{ mixBlendMode: "multiply" }} />
        ) : (
          <path key={i} d={leaf(l, l * 0.32)} transform={`translate(${r2(len * 0.05 * Math.sin(t * 3))} ${r2(-len * t)}) rotate(${side * (50 + R() * 15)})`} fill={`url(#${id}l)`} opacity={0.6 + R() * 0.3} style={{ mixBlendMode: "multiply" }} />
        );
      })}
    </g>
  );
}

/** Baby's-breath style filler dots. */
export function Filler({ x, y, s, seed, color }: { x: number; y: number; s: number; seed: number; color: string }) {
  const R = rng(seed);
  return (
    <g transform={`translate(${r2(x)} ${r2(y)})`} opacity=".85">
      {Array.from({ length: 9 }, (_, i) => {
        const a = R() * Math.PI * 2;
        const d = s * (0.3 + R() * 0.8);
        const px = Math.cos(a) * d;
        const py = Math.sin(a) * d;
        return (
          <g key={i}>
            <path d={`M0 0L${r2(px)} ${r2(py)}`} stroke={color} strokeOpacity=".35" strokeWidth={s * 0.02} />
            <circle cx={r2(px)} cy={r2(py)} r={r2(s * (0.06 + R() * 0.05))} fill={color} />
          </g>
        );
      })}
    </g>
  );
}

/** An svg wrapper that gives its children a unique filter/gradient namespace. */
export function Paint({ pal, viewBox, className, style, children, scale }: { pal: Pal; viewBox: string; className?: string; style?: CSSProperties; scale?: number; children: (id: string) => ReactNode }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox={viewBox} className={className} style={style} aria-hidden overflow="visible">
      <WcDefs id={id} pal={pal} scale={scale} />
      {children(id)}
    </svg>
  );
}
