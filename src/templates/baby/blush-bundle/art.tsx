"use client";
import type { CSSProperties } from "react";
import { useSvgId } from "../_shared/ids";

// Blush Bundle — watercolour peonies & sweet peas, a silk ribbon bow, knitted booties and the envelope.

/** Watercolour edge filter + paper bleed, shared by blooms. */
function WcFilter({ id, seed = 2, scale = 7 }: { id: string; seed?: number; scale?: number }) {
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feGaussianBlur in="d" stdDeviation=".5" result="b" />
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed={seed + 3} result="g" />
      <feColorMatrix in="g" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -.9 .9" result="gm" />
      <feComposite in="b" in2="gm" operator="arithmetic" k1="0" k2="1" k3="-.12" k4="0" />
    </filter>
  );
}

/** A loose watercolour peony: layered cupped petals in blush tones. */
export function Peony({ className = "", style, tone = "blush", seed = 1 }: { className?: string; style?: CSSProperties; tone?: "blush" | "rose" | "cream"; seed?: number }) {
  const id = useSvgId("bbp");
  const T = tone === "rose" ? ["#e7a1ad", "#d47d8f", "#f5ccd3", "#b9566c"] : tone === "cream" ? ["#f8e6dc", "#efcfc0", "#fff6ef", "#d9a594"] : ["#f3c3c9", "#e6a0ab", "#fbe1e3", "#c97a89"];
  const petals = [
    { d: "M0 6C-30 10-48-8-40-30-30-50-8-46 0-30 8-46 30-50 40-30 48-8 30 10 0 6Z", c: 0, o: 0.85, s: 1.25 },
    { d: "M0 0C-36-4-46-30-26-44-10-54 0-40 0-34 0-40 10-54 26-44 46-30 36-4 0 0Z", c: 1, o: 0.75, s: 1.05, r: 30 },
    { d: "M0 0C-36-4-46-30-26-44-10-54 0-40 0-34 0-40 10-54 26-44 46-30 36-4 0 0Z", c: 0, o: 0.8, s: 0.95, r: -40 },
    { d: "M0 0C-24 0-34-20-20-32-8-40 0-30 0-26 0-30 8-40 20-32 34-20 24 0 0 0Z", c: 2, o: 0.95, s: 0.9, r: 10 },
    { d: "M0 0C-16 2-24-12-14-22-6-28 0-20 0-18 0-20 6-28 14-22 24-12 16 2 0 0Z", c: 1, o: 0.85, s: 0.85, r: -12 },
  ];
  return (
    <svg viewBox="-70 -80 140 120" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <WcFilter id={`${id}f`} seed={seed} />
        <radialGradient id={`${id}g`} cx=".5" cy=".85" r=".9"><stop offset="0" stopColor={T[3]} stopOpacity=".55" /><stop offset=".6" stopColor={T[0]} stopOpacity="0" /></radialGradient>
      </defs>
      <g filter={`url(#${id}f)`}>
        {petals.map((p, i) => <path key={i} d={p.d} fill={T[p.c]} opacity={p.o} transform={`rotate(${p.r ?? 0}) scale(${p.s})`} />)}
        <path d="M-40-30C-20-20 20-20 40-30 30 4 -30 4 -40-30Z" fill={`url(#${id}g)`} />
        {[-10, -4, 3, 9].map((x, i) => <path key={i} d={`M${x} -14q${i - 1.5} -6 ${i % 2 ? 2 : -2} -12`} stroke="#d6a24e" strokeWidth="1.2" fill="none" strokeLinecap="round" />)}
      </g>
    </svg>
  );
}

/** Sweet pea sprig with buds and tendril. */
export function SweetPea({ className = "", style, seed = 3 }: { className?: string; style?: CSSProperties; seed?: number }) {
  const id = useSvgId("bbs");
  return (
    <svg viewBox="0 0 120 160" className={className} style={style} aria-hidden overflow="visible">
      <defs><WcFilter id={`${id}f`} seed={seed} scale={5} /></defs>
      <g filter={`url(#${id}f)`}>
        <path d="M60 158C58 120 62 80 56 40 54 28 58 16 66 8" stroke="#9fae93" strokeWidth="2.4" fill="none" />
        <path d="M58 100C40 96 26 84 22 70 38 70 52 80 58 100Z" fill="#b5c3a6" opacity=".85" />
        <path d="M60 76C76 70 90 56 92 42 76 46 64 58 60 76Z" fill="#a7b897" opacity=".85" />
        <path d="M60 120q20 -6 26 -20q4 10 -6 14" stroke="#9fae93" strokeWidth="1.2" fill="none" />
        {[[66, 10, "#e9a7b4"], [50, 34, "#f3c3c9"], [72, 50, "#dcb2d6"]].map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${i * 40 - 30})`}>
            <path d="M0 0C-16-4-20-20-8-24 0-26 4-16 0 0Z" fill={c as string} opacity=".9" />
            <path d="M0 0C14-6 18-20 6-22-2-22-4-12 0 0Z" fill={c as string} opacity=".75" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Eucalyptus-grey leaf spray to fill corners. */
export function Leaves({ className = "", style, seed = 5 }: { className?: string; style?: CSSProperties; seed?: number }) {
  const id = useSvgId("bbl");
  return (
    <svg viewBox="0 0 160 80" className={className} style={style} aria-hidden overflow="visible">
      <defs><WcFilter id={`${id}f`} seed={seed} scale={5} /></defs>
      <g filter={`url(#${id}f)`}>
        <path d="M4 70C40 56 90 40 156 10" stroke="#a9b4a0" strokeWidth="1.6" fill="none" />
        {[20, 44, 68, 92, 116, 138].map((x, i) => {
          const y = 70 - x * 0.39;
          return <g key={i}>
            <ellipse cx={x} cy={y - 10} rx="11" ry="6" fill={i % 2 ? "#b8c4ae" : "#a3b29a"} opacity=".8" transform={`rotate(-40 ${x} ${y - 10})`} />
            <ellipse cx={x + 6} cy={y + 8} rx="10" ry="5.5" fill={i % 2 ? "#a3b29a" : "#c3cdb9"} opacity=".75" transform={`rotate(25 ${x + 6} ${y + 8})`} />
          </g>;
        })}
      </g>
    </svg>
  );
}

/** Silk ribbon bow with sheen; `parts` lets the opening animate loops & tails separately. */
export function Bow({ className = "", style, color = "#e6a7b2" }: { className?: string; style?: CSSProperties; color?: string }) {
  const id = useSvgId("bbw");
  return (
    <svg viewBox="-60 -40 120 100" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} /><stop offset=".35" stopColor="#fff3f4" stopOpacity=".95" /><stop offset=".5" stopColor={color} /><stop offset=".8" stopColor="#c47b8a" /><stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <g className="bb-tail-l"><path d="M-3 4C-10 20-20 38-30 54L-20 52-16 60C-8 40-2 22 3 6Z" fill={`url(#${id}s)`} /></g>
      <g className="bb-tail-r"><path d="M3 4C8 22 16 38 28 56L30 46 38 48C26 32 12 18 4 4Z" fill={`url(#${id}s)`} /></g>
      <g className="bb-loop-l"><path d="M-2 0C-14-22-50-34-54-12-58 8-26 12-2 4Z" fill={`url(#${id}s)`} /><path d="M-8-1C-22-10-40-16-46-10" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" fill="none" /></g>
      <g className="bb-loop-r"><path d="M2 0C14-22 50-34 54-12 58 8 26 12 2 4Z" fill={`url(#${id}s)`} /><path d="M8-1C22-10 40-16 46-10" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" fill="none" /></g>
      <ellipse cx="0" cy="2" rx="8" ry="9" fill={`url(#${id}s)`} stroke="#c47b8a" strokeOpacity=".4" />
    </svg>
  );
}

/** A pair of knitted booties tied with ribbon — the "bundle". */
export function Booties({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useSvgId("bbb");
  const one = (x: number, r: number) => (
    <g transform={`translate(${x} 0) rotate(${r} 40 60)`}>
      <path d="M20 10h36v44c14 2 28 10 28 24 0 10-10 14-24 14H22c-10 0-14-6-14-14 0-10 6-16 12-20z" fill={`url(#${id}k)`} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${24 + i * 7} 12v40`} stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeDasharray="3 3" />)}
      <path d="M18 8h40v10H18z" fill="#f7dcdf" />
      <path d="M22 52q18 6 36 0" stroke="#e6a7b2" strokeWidth="3.5" fill="none" />
      <path d="M40 54c-6 6-14 6-14 0s8-4 14 0c6-4 14-6 14 0s-8 6-14 0" fill="#e6a7b2" />
    </g>
  );
  return (
    <svg viewBox="0 0 190 110" className={className} style={style} aria-hidden overflow="visible">
      <defs><linearGradient id={`${id}k`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbecea" /><stop offset="1" stopColor="#f1cfd2" /></linearGradient></defs>
      {one(0, -6)}{one(84, 8)}
    </svg>
  );
}

/** Wax seal with an initial. */
export const Seal = ({ letter, className = "", style }: { letter: string; className?: string; style?: CSSProperties }) => (
  <svg viewBox="0 0 60 60" className={className} style={style} aria-hidden>
    <path d="M30 2c5 0 7 4 11 5s9-1 11 3-1 8 1 12 6 6 5 11-6 6-7 10 1 9-3 11-8 0-12 2-6 6-11 6-7-4-11-5-9 1-11-3 1-8-1-12-6-6-5-11 6-6 7-10-1-9 3-11 8 0 12-2 6-6 11-6z" fill="#c4707f" />
    <circle cx="30" cy="30" r="19" fill="#b25f6f" />
    <circle cx="30" cy="30" r="19" fill="none" stroke="#e7a8b3" strokeOpacity=".6" strokeWidth="1" />
    <text x="30" y="38" textAnchor="middle" fontSize="22" fill="#f6d2d8" style={{ fontFamily: "var(--bb-script)" }}>{letter}</text>
  </svg>
);
