"use client";
import type { CSSProperties } from "react";
import { useSvgId } from "../_shared/ids";

// Bump Portrait — nine moon phases (nine months), film grain, sprocket film strip, letterbox.

/** One moon, illuminated fraction k (0 = new, 1 = full), waxing from the right. */
export function MoonPhase({ k, className = "", style, lit = "#f3ead9", dark = "rgba(255,255,255,.08)", ring = "rgba(243,234,217,.35)" }: { k: number; className?: string; style?: CSSProperties; lit?: string; dark?: string; ring?: string }) {
  const r = 10;
  const rx = Math.abs(1 - 2 * k) * r;
  const d = k <= 0.001 ? "" : k >= 0.999 ? `M0 ${-r}A${r} ${r} 0 1 1 0 ${r}A${r} ${r} 0 1 1 0 ${-r}Z` : `M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${rx} ${r} 0 0 ${k < 0.5 ? 0 : 1} 0 ${-r}Z`;
  return (
    <svg viewBox="-12 -12 24 24" className={className} style={style} aria-hidden>
      <circle r={r} fill={dark} stroke={ring} strokeWidth=".5" />
      {d && <path d={d} fill={lit} />}
    </svg>
  );
}
export const PHASES = [0, 0.08, 0.2, 0.36, 0.5, 0.64, 0.8, 0.92, 1];

/** Animated film grain overlay (static when animations are off). */
export function FilmGrain({ opacity = 0.18, className = "" }: { opacity?: number; className?: string }) {
  const id = useSvgId("bpg");
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ opacity, mixBlendMode: "overlay" }} aria-hidden>
      <svg className="bp-grain absolute -inset-[20%] h-[140%] w-[140%]">
        <filter id={id}><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1" /></filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  );
}

/** Sprocket holes row for film strips. */
export const Sprockets = ({ className = "" }: { className?: string }) => (
  <div className={`flex justify-between gap-[10px] px-2 ${className}`} aria-hidden>
    {Array.from({ length: 40 }, (_, i) => <span key={i} className="block h-[10px] w-[14px] shrink-0 rounded-[2px] bg-[var(--t-bg)] opacity-80" />)}
  </div>
);

/** Roman numerals for chapter labels. */
export const roman = (n: number) => ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][n] ?? String(n);
