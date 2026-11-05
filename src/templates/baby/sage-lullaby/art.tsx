"use client";
import type { CSSProperties } from "react";
import { useSvgId } from "../_shared/ids";

// Sage Lullaby — eucalyptus drawn in ink, then washed with watercolour; a lullaby stave with drifting notes.

type P = [number, number];
const bez = (p0: P, p1: P, p2: P, p3: P, t: number): P => {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
};

/** Silver-dollar eucalyptus branch: ink outline (pathLength=1, drawable) + watercolour wash underneath. */
export function Eucalyptus({ className = "", style, leaves = 13, seed = 3, variant = "dollar", manual = false, stem = [[20, 380], [60, 260], [150, 160], [210, 20]] as [P, P, P, P], delay = 0 }: { className?: string; style?: CSSProperties; leaves?: number; seed?: number; variant?: "dollar" | "willow"; manual?: boolean; stem?: [P, P, P, P]; delay?: number }) {
  const id = useSvgId("sle");
  const [p0, p1, p2, p3] = stem;
  const items = Array.from({ length: leaves }, (_, i) => {
    const t = 0.08 + (i / (leaves - 1)) * 0.9;
    const [x, y] = bez(p0, p1, p2, p3, t);
    const [x2, y2] = bez(p0, p1, p2, p3, Math.min(1, t + 0.01));
    const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    const side = i % 2 ? 1 : -1;
    const size = (variant === "dollar" ? 30 : 34) * (1.05 - t * 0.55);
    const tone = ["#7f9b84", "#93ad94", "#6d8a74", "#a4bba2"][(i + seed) % 4];
    const r2 = (v: number) => Math.round(v * 100) / 100;
    return { x: r2(x), y: r2(y), ang: r2(ang + side * (variant === "dollar" ? 70 : 32)), size: r2(size), tone, side, i };
  });
  const leafD = (s: number) => variant === "dollar"
    ? `M0 0C${s * 0.15} ${-s * 0.55} ${s * 0.95} ${-s * 0.7} ${s * 1.05} ${-s * 0.05}C${s * 1.1} ${s * 0.6} ${s * 0.3} ${s * 0.6} 0 0Z`
    : `M0 0C${s * 0.3} ${-s * 0.28} ${s * 1.2} ${-s * 0.3} ${s * 1.8} ${-s * 0.02}C${s * 1.2} ${s * 0.22} ${s * 0.3} ${s * 0.2} 0 0Z`;
  const stemD = `M${p0}C${p1} ${p2} ${p3}`;
  return (
    <svg viewBox="0 0 240 400" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <filter id={`${id}w`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation=".8" />
        </filter>
      </defs>
      <g className={manual ? "sl-washm" : "sl-wash"} filter={`url(#${id}w)`} style={{ "--dl": `${delay + 1.4}s` } as CSSProperties}>
        {items.map((l) => <path key={l.i} d={leafD(l.size)} fill={l.tone} opacity=".72" transform={`translate(${l.x + l.side * 1.5} ${l.y + 2}) rotate(${l.ang})`} />)}
      </g>
      <g className={manual ? "sl-inkm" : "sl-ink"} fill="none" stroke="#3d4f41" strokeLinecap="round" style={{ "--dl": `${delay}s` } as CSSProperties}>
        <path d={stemD} strokeWidth="1.3" pathLength={1} />
        {items.map((l) => (
          <g key={l.i} transform={`translate(${l.x} ${l.y}) rotate(${l.ang})`}>
            <path d={leafD(l.size)} strokeWidth=".8" pathLength={1} style={{ animationDelay: `${delay + 0.3 + l.i * 0.07}s` }} />
            <path d={`M0 0L${l.size * (variant === "dollar" ? 0.8 : 1.5)} ${-l.size * 0.04}`} strokeWidth=".45" pathLength={1} opacity=".6" style={{ animationDelay: `${delay + 0.5 + l.i * 0.07}s` }} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** A lullaby stave (five lines) with notes, drawn in ink; notes drift when animated. */
export function Stave({ className = "", style, notes = 9 }: { className?: string; style?: CSSProperties; notes?: number }) {
  const ys = [0, 8, 16, 24, 32];
  const N = Array.from({ length: notes }, (_, i) => ({ x: 70 + i * 62, y: [24, 16, 12, 20, 8, 16, 28, 20, 12, 4][i % 10] }));
  return (
    <svg viewBox="0 -14 660 60" className={className} style={style} aria-hidden preserveAspectRatio="xMidYMid meet">
      <g className="sl-ink" fill="none" stroke="currentColor" strokeLinecap="round">
        {ys.map((y, i) => <path key={i} d={`M0 ${y}H660`} strokeWidth=".6" opacity=".55" pathLength={1} style={{ animationDelay: `${0.2 + i * 0.08}s` }} />)}
        <path d="M18 34C10 30 10 18 20 14 28 10 32 20 24 24 16 28 12 16 18 6 22-2 28-6 26-12M22-10C20 4 22 30 24 40 25 46 18 46 18 42" strokeWidth="1.3" pathLength={1} style={{ animationDelay: ".4s" }} />
      </g>
      {N.map((n, i) => (
        <g key={i} className="sl-note" style={{ "--dl": `${1.2 + i * 0.12}s`, "--fl": `${3 + (i % 4)}s` } as CSSProperties}>
          <ellipse cx={n.x} cy={n.y} rx="5.2" ry="3.8" transform={`rotate(-22 ${n.x} ${n.y})`} fill="currentColor" />
          <path d={`M${n.x + 4.6} ${n.y - 1}V${n.y - 26}`} stroke="currentColor" strokeWidth="1.1" />
          {i % 3 === 0 && <path d={`M${n.x + 4.6} ${n.y - 26}q8 5 7 14`} stroke="currentColor" strokeWidth="1.1" fill="none" />}
        </g>
      ))}
    </svg>
  );
}
