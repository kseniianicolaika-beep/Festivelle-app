"use client";
import type { CSSProperties } from "react";
import { useSvgId } from "../_shared/ids";

// Little Star — chubby nursery stars, a striped baby rattle with a bow, star bunting and a monogram wreath.
// Flat, friendly shapes with one soft highlight each (picture-book, never clip-art gradients).

export const LS = { butter: "#F6C94E", peach: "#F4A99A", mint: "#9ED6C3", sky: "#9DB9E6", lilac: "#C8B6E8", navy: "var(--t-ink)" };
const TONES = [LS.butter, LS.sky, LS.peach, LS.mint, LS.lilac];

/** Chubby rounded star, optional sleepy face. */
export function Chubby({ c = LS.butter, face = false, className = "", style, onClick }: { c?: string; face?: boolean; className?: string; style?: CSSProperties; onClick?: () => void }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden onClick={onClick} overflow="visible">
      <path d="M20 2.8c1.4 0 2.3.8 2.9 2l3.7 7.4 8.1 1.2c2.7.4 3.7 3.6 1.8 5.5l-5.9 5.7 1.4 8.1c.5 2.7-2.3 4.7-4.7 3.4L20 32.3l-7.3 3.8c-2.4 1.3-5.2-.7-4.7-3.4l1.4-8.1-5.9-5.7c-1.9-1.9-.9-5.1 1.8-5.5l8.1-1.2 3.7-7.4c.6-1.2 1.5-2 2.9-2z" fill={c} />
      <path d="M14 14.5c1.5-.6 3-1 4.4-1.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
      {face && <g stroke="#3b3550" strokeWidth="1.1" strokeLinecap="round" fill="none"><path d="M15.5 21q1.5 1.4 3 0M21.5 21q1.5 1.4 3 0" /><path d="M18.2 25q1.8 1.2 3.6 0" /></g>}
      {face && <g fill="#f08c8c" opacity=".55"><ellipse cx="14.2" cy="24" rx="1.7" ry="1" /><ellipse cx="25.8" cy="24" rx="1.7" ry="1" /></g>}
    </svg>
  );
}

/** Four-point sparkle. */
export const Spark = ({ className = "", style, c = "currentColor" }: { className?: string; style?: CSSProperties; c?: string }) => (
  <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden><path d="M10 0c.8 5 4.2 8.6 10 10-5.8 1.4-9.2 5-10 10C9.2 15 5.8 11.4 0 10 5.8 8.6 9.2 5 10 0z" fill={c} /></svg>
);

/** Classic baby rattle: striped ball with star beads, handle, ring and a ribbon bow. */
export function Rattle({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useSvgId("lsr");
  return (
    <svg viewBox="0 0 120 200" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <clipPath id={`${id}c`}><circle cx="60" cy="56" r="46" /></clipPath>
        <radialGradient id={`${id}s`} cx=".35" cy=".3" r=".75"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#2e3a55" stopOpacity=".12" /></radialGradient>
      </defs>
      {/* handle */}
      <rect x="53" y="98" width="14" height="70" rx="7" fill={LS.sky} />
      <rect x="53" y="98" width="5" height="70" rx="2.5" fill="#fff" opacity=".35" />
      <circle cx="60" cy="178" r="17" fill="none" stroke={LS.peach} strokeWidth="9" />
      <circle cx="60" cy="178" r="17" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 50" opacity=".6" />
      {/* ball */}
      <g clipPath={`url(#${id}c)`}>
        <rect x="0" y="0" width="120" height="120" fill="#fffaf0" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 20 - 6} y="0" width="10" height="120" fill={i % 2 ? LS.butter : LS.mint} transform="rotate(-18 60 56)" opacity=".95" />)}
      </g>
      <circle cx="60" cy="56" r="46" fill={`url(#${id}s)`} />
      <circle cx="60" cy="56" r="46" fill="none" stroke="#2e3a55" strokeOpacity=".08" strokeWidth="1.5" />
      <path d="M30 34a38 38 0 0 1 22-14" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".7" />
      {/* collar */}
      <rect x="44" y="96" width="32" height="10" rx="5" fill={LS.butter} />
      {/* bow */}
      <g transform="translate(60 120)">
        <path d="M0 0C-10-10-24-8-22 2-20 10-8 8 0 0Z" fill={LS.peach} />
        <path d="M0 0C10-10 24-8 22 2 20 10 8 8 0 0Z" fill={LS.peach} />
        <path d="M-2 2l-8 18M2 2l9 17" stroke={LS.peach} strokeWidth="4" strokeLinecap="round" />
        <circle r="4.5" fill="#f08c7c" />
      </g>
    </svg>
  );
}

/** Ring of chubby stars around a monogram. */
export function Wreath({ n = 18, className = "", style, pop = true }: { n?: number; className?: string; style?: CSSProperties; pop?: boolean }) {
  return (
    <div className={`relative ${className}`} style={style} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const t = (i / n) * Math.PI * 2 - Math.PI / 2;
        const s = i % 3 === 0 ? 13 : i % 3 === 1 ? 9 : 7;
        return (
          <div key={i} className="absolute" style={{ left: `${(50 + Math.cos(t) * 44).toFixed(2)}%`, top: `${(50 + Math.sin(t) * 44).toFixed(2)}%`, width: `${s}%`, transform: "translate(-50%,-50%)" }}>
            <div className={pop ? "ls-pop" : ""} style={{ "--dl": `${0.35 + i * 0.07}s` } as CSSProperties}>
              <Chubby c={TONES[i % TONES.length]} className="w-full" style={{ transform: `rotate(${i * 23}deg)` }} />
            </div>
          </div>
        );
      })}
      {Array.from({ length: n }, (_, i) => {
        const t = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
        return <span key={`d${i}`} className="absolute block rounded-full bg-[var(--t-ink)]" style={{ left: `${(50 + Math.cos(t) * 44).toFixed(2)}%`, top: `${(50 + Math.sin(t) * 44).toFixed(2)}%`, width: "1.2%", aspectRatio: "1", opacity: 0.35, transform: "translate(-50%,-50%)" }} />;
      })}
    </div>
  );
}

/** Star bunting: pennants on a drooping string. */
export function Bunting({ n = 9, className = "", style }: { n?: number; className?: string; style?: CSSProperties }) {
  const W = 600;
  return (
    <svg viewBox={`0 0 ${W} 90`} className={className} style={style} aria-hidden preserveAspectRatio="xMidYMin slice">
      <path d={`M-10 6Q${W / 2} 46 ${W + 10} 6`} fill="none" stroke="var(--t-ink)" strokeOpacity=".35" strokeWidth="1.2" />
      {Array.from({ length: n }, (_, i) => {
        const u = (i + 0.5) / n, x = u * W, y = 6 + 4 * u * (1 - u) * 40 - 2;
        const c = TONES[i % TONES.length];
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(u - 0.5) * -14})`}>
            <path d="M-22 0H22L0 40Z" fill={c} />
            <path d="M-22 0H22L18 6H-18Z" fill="#fff" opacity=".35" />
            <path d="M0 11.5l2 4.1 4.5.6-3.3 3.2.8 4.5L0 21.8l-4 2.1.8-4.5-3.3-3.2 4.5-.6z" fill="#fff" />
          </g>
        );
      })}
    </svg>
  );
}

/** Scattered confetti dots + tiny stars (static, deterministic). */
export function Confetti({ n = 26, seed = 2, className = "" }: { n?: number; seed?: number; className?: string }) {
  let s = seed * 7919;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const x = r() * 100, y = r() * 100, sz = 0.6 + r() * 1.2, c = TONES[Math.floor(r() * TONES.length)];
        return i % 3 === 0
          ? <Spark key={i} c={c} className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: `${sz * 1.6}%` }} />
          : <span key={i} className="absolute block rounded-full" style={{ left: `${x}%`, top: `${y}%`, width: `${sz * 0.7}%`, aspectRatio: "1", background: c }} />;
      })}
    </div>
  );
}
