"use client";
import type { CSSProperties } from "react";
import { useSvgId } from "../_shared/ids";

// Cloud Nine — hand-built watercolour sky: puffy clouds with bleeding edges, a sleepy gold-foil crescent,
// hanging nursery stars. Everything is vector so it stays crisp on print and tiny in thumbnails.

const CLOUDS = [
  "M18 128C-2 128-4 96 24 90C18 58 58 44 80 66C90 28 150 18 168 58C184 36 226 42 226 78C258 74 270 112 244 128Z",
  "M14 112C-4 110 2 82 26 82C30 56 64 52 76 70C94 42 130 46 136 72C150 60 176 64 176 86C198 84 204 110 184 112Z",
  "M10 96C-2 92 4 70 24 72C30 50 58 48 66 64C78 44 108 50 110 70C126 64 140 74 136 88C150 90 150 102 136 104Z",
];
const VB = ["0 0 270 140", "0 0 210 124", "0 0 160 112"];

export function Cloud({ v = 0, className = "", style, tint = "#c9d6ec", glow = "#ffffff", stretch = false }: { v?: 0 | 1 | 2; className?: string; style?: CSSProperties; tint?: string; glow?: string; stretch?: boolean }) {
  const id = useSvgId("cnc");
  return (
    <svg viewBox={VB[v]} preserveAspectRatio={stretch ? "none" : undefined} className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={glow} />
          <stop offset=".55" stopColor={glow} stopOpacity=".96" />
          <stop offset="1" stopColor={tint} />
        </linearGradient>
        <radialGradient id={`${id}h`} cx=".4" cy=".35" r=".5">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}w`} x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed={v + 4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation=".7" />
        </filter>
        <filter id={`${id}b`} x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <path d={CLOUDS[v]} fill={tint} opacity=".55" filter={`url(#${id}b)`} transform="translate(0 10)" />
      <g filter={`url(#${id}w)`}>
        <path d={CLOUDS[v]} fill={`url(#${id}g)`} />
        <path d={CLOUDS[v]} fill={`url(#${id}h)`} />
      </g>
    </svg>
  );
}

/** Sleepy crescent moon in gold foil, with closed eye, lashes and a rosy cheek. */
export function Moon({ className = "", style, sheen = true }: { className?: string; style?: CSSProperties; sheen?: boolean }) {
  const id = useSvgId("cnm");
  return (
    <svg viewBox="0 0 140 140" className={className} style={{ filter: "drop-shadow(0 0 14px rgba(255,238,205,.75)) drop-shadow(0 0 40px rgba(255,238,205,.35))", ...style }} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7e3b8" />
          <stop offset=".35" stopColor="#d9b07a" />
          <stop offset=".55" stopColor="#fff2d2" />
          <stop offset=".75" stopColor="#c99a62" />
          <stop offset="1" stopColor="#f0d6a4" />
          {sheen && <animateTransform attributeName="gradientTransform" type="translate" values="-.6 -.6;.6 .6;-.6 -.6" dur="7s" repeatCount="indefinite" />}
        </linearGradient>
        <radialGradient id={`${id}g`} cx=".5" cy=".5" r=".5">
          <stop offset=".3" stopColor="#fff4dc" stopOpacity=".32" />
          <stop offset=".62" stopColor="#ffe9c4" stopOpacity=".1" />
          <stop offset="1" stopColor="#ffe9c4" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}k`}>
          <circle cx="66" cy="72" r="46" fill="#fff" />
          <circle cx="88" cy="58" r="40" fill="#000" />
        </mask>
        <filter id={`${id}e`}><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="9" /><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .35 0 0 0 0 .15 0 0 0 .35 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
      </defs>
            <g mask={`url(#${id}k)`}>
        <rect width="140" height="140" fill={`url(#${id}f)`} />
        <rect width="140" height="140" filter={`url(#${id}e)`} />
      </g>
      {/* sleepy face */}
      <path d="M36 76q7 6 14 0" fill="none" stroke="#9b6f3f" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38 79l-2 3M43 81v3.4M48 79l2 3" stroke="#9b6f3f" strokeWidth="1.1" strokeLinecap="round" />
      <ellipse cx="40" cy="88" rx="5.5" ry="3.2" fill="#f2a7a8" opacity=".55" />
      <path d="M40 96q5 3 10-1" fill="none" stroke="#9b6f3f" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

/** Five-point rounded star in foil. */
export function Star({ className = "", style, hang = 0, tone = "gold" }: { className?: string; style?: CSSProperties; hang?: number; tone?: "gold" | "blue" | "blush" }) {
  const id = useSvgId("cns");
  const c = tone === "gold" ? ["#fbe7bf", "#d6a96a", "#fff6e2"] : tone === "blue" ? ["#e6eefb", "#9fb6dc", "#ffffff"] : ["#fbe3e6", "#e7a9b3", "#fff5f6"];
  return (
    <svg viewBox={`0 ${-hang} 40 ${40 + hang}`} className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c[0]} /><stop offset=".5" stopColor={c[1]} /><stop offset=".7" stopColor={c[2]} /><stop offset="1" stopColor={c[1]} />
        </linearGradient>
      </defs>
      {hang > 0 && <line x1="20" y1={-hang} x2="20" y2="4" stroke="#b9a07c" strokeWidth=".6" strokeDasharray="1 1.6" />}
      <path d="M20 3.5c1 0 1.6.6 2 1.5l3.6 7.6 8.3 1.1c1.9.3 2.6 2.5 1.2 3.8l-6 5.8 1.5 8.2c.3 1.9-1.6 3.3-3.3 2.4L20 30l-7.3 3.9c-1.7.9-3.7-.5-3.3-2.4l1.5-8.2-6-5.8c-1.4-1.3-.6-3.6 1.2-3.8l8.3-1.1L18 5c.4-.9 1-1.5 2-1.5z" fill={`url(#${id})`} stroke={c[1]} strokeWidth=".5" />
    </svg>
  );
}

/** Tiny four-point twinkle. */
export const Twinkle = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden>
    <path d="M10 0c.6 5.4 4 9 10 10-6 1-9.4 4.6-10 10C9.4 14.6 6 11 0 10 6 9 9.4 5.4 10 0z" fill="currentColor" />
  </svg>
);

/** A dreamy sky field of dots (static). */
export function Dots({ n = 40, seed = 1, className = "" }: { n?: number; seed?: number; className?: string }) {
  let s = seed * 9301;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden>
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={r() * 100} cy={r() * 100} r={r() * 0.35 + 0.12} fill="#fff" opacity={0.4 + r() * 0.6} />)}
    </svg>
  );
}
