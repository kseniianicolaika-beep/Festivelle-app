"use client";
import type { CSSProperties, ReactNode } from "react";
import { useGid } from "../_shared/kit";
import { s } from "./styles";

// Scrapbook art for Our Polaroids: washi tape, polaroid frames, red-pen doodles, stamps, a calendar page.
// Doodle paths carry data-draw so the stage can "write" them; static markup is the finished drawing.

const f = (n: number) => n.toFixed(1);
/** Deterministic wobble so server and client draw the same "hand". */
const rnd = (seed: number) => { const x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x); };

export const TAPES = [
  { bg: "#f3b9b4", img: "repeating-linear-gradient(45deg, rgba(255,255,255,.45) 0 6px, transparent 6px 12px)" },
  { bg: "#b9d8c6", img: "radial-gradient(circle at 3px 3px, rgba(255,255,255,.75) 1.6px, transparent 2px)", size: "10px 10px" },
  { bg: "#eac16b", img: "repeating-linear-gradient(90deg, rgba(255,255,255,.35) 0 2px, transparent 2px 9px)" },
  { bg: "#a9c1e0", img: "repeating-linear-gradient(-45deg, rgba(255,255,255,.4) 0 3px, transparent 3px 11px)" },
  { bg: "#d9cbe8", img: "radial-gradient(circle at 5px 5px, rgba(210,70,46,.35) 1.4px, transparent 2px)", size: "12px 12px" },
] as { bg: string; img: string; size?: string }[];

/** A strip of washi tape with torn, zig-zag ends. */
export function Tape({ i = 0, className = "", style }: { i?: number; className?: string; style?: CSSProperties }) {
  const t = TAPES[i % TAPES.length];
  return <span data-tape aria-hidden className={`${s.tape} ${className}`} style={{ backgroundColor: t.bg, backgroundImage: t.img, backgroundSize: t.size, ...style }} />;
}

/** A polaroid: thick white bottom for a handwritten caption; children = the photo (or a placeholder). */
export function Polaroid({ children, caption, className = "", style, tape = 0, tapes = 1, captionClass = "", develop = false }: { children: ReactNode; caption?: ReactNode; className?: string; style?: CSSProperties; tape?: number; tapes?: 0 | 1 | 2; captionClass?: string; develop?: boolean }) {
  return (
    <figure data-polaroid className={`${s.polaroid} ${className}`} style={style}>
      <div className={`${s.photo}`}>
        {children}
        {develop && <span data-develop aria-hidden className={s.develop} />}
        <span aria-hidden className={s.gloss} />
      </div>
      {caption != null && <figcaption className={`${s.caption} ${captionClass}`}>{caption}</figcaption>}
      {tapes >= 1 && <Tape i={tape} className={s.tapeTop} />}
      {tapes === 2 && <Tape i={tape + 2} className={s.tapeCorner} />}
    </figure>
  );
}

/** Empty-frame placeholder: soft film fog with a doodled heart. */
export function NoPhoto({ seed = 1 }: { seed?: number }) {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: `radial-gradient(120% 90% at ${30 + rnd(seed) * 40}% 30%, #e9ddd0, #c9b9a8 70%, #a8988a)` }}>
      <Heart className="w-1/3 opacity-70" />
    </div>
  );
}

/** Red-pen heart (double stroke for a hand-drawn feel). */
export function Heart({ className, style, color = "var(--pen)" }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 100 92" className={className} style={style} aria-hidden fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path data-draw strokeWidth="3.4" d="M50 84C30 66 8 52 9 30 10 14 24 6 36 9c8 2 12 9 14 15 2-7 7-14 16-15 13-2 25 8 24 23-1 21-24 36-40 52" />
      <path data-draw strokeWidth="1.6" opacity=".6" d="M47 80C28 63 12 50 13 31 14 18 26 11 37 13" />
    </svg>
  );
}

/** A hand-drawn loop around something (date, word). */
export function Scribble({ className, style, turns = 1.25, seed = 3, color = "var(--pen)", width = 2.6 }: { className?: string; style?: CSSProperties; turns?: number; seed?: number; color?: string; width?: number }) {
  const n = Math.round(60 * turns);
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const a = -Math.PI * 0.62 + (i / 60) * Math.PI * 2;
    const w = 1 + (rnd(seed + i * 0.37) - 0.5) * 0.06 + (i / n) * 0.05;
    return [100 + Math.cos(a) * 92 * w, 50 + Math.sin(a) * 42 * w];
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join("");
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" className={className} style={style} aria-hidden fill="none">
      <path data-draw d={d} stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Curly hand-drawn arrow. */
export function Arrow({ className, style, color = "var(--ink)" }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} style={style} aria-hidden fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path data-draw d="M6 62C22 70 44 66 52 50 58 38 48 26 38 34 28 42 42 60 62 56 84 52 98 34 108 16" />
      <path data-draw d="M94 18L109 14 106 30" />
    </svg>
  );
}

/** Wavy underline. */
export function Underline({ className, style, color = "var(--pen)" }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" className={className} style={style} aria-hidden fill="none">
      <path data-draw d="M4 12C40 4 70 16 104 10S170 4 206 11 270 14 296 7" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path data-draw d="M30 16C80 11 150 15 240 12" stroke={color} strokeWidth="1.4" opacity=".55" strokeLinecap="round" />
    </svg>
  );
}

/** Little doodle star / sparkle. */
export function Star({ className, style, color = "var(--ink)" }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path data-draw d="M20 3V37M3 20H37M8 8L32 32M32 8L8 32" />
    </svg>
  );
}

/** Postage stamp with perforated edge; children go in the picture area. */
export function Stamp({ children, value = "♥", className = "", style }: { children: ReactNode; value?: string; className?: string; style?: CSSProperties }) {
  return (
    <div className={`${s.stamp} ${className}`} style={style}>
      <div className={s.stampInner}>
        {children}
        <span className={s.stampValue}>{value}</span>
      </div>
    </div>
  );
}

/** Circular postmark with wavy cancellation lines. */
export function Postmark({ top, bottom, mid, className, style }: { top: string; bottom: string; mid: string; className?: string; style?: CSSProperties }) {
  const id = useGid("pm");
  return (
    <svg viewBox="0 0 220 120" className={className} style={style} aria-hidden fill="none">
      <defs>
        <path id={`${id}t`} d="M22 60a38 38 0 0 1 76 0" />
        <path id={`${id}b`} d="M18 60a42 42 0 0 0 84 0" />
      </defs>
      <g stroke="var(--stampink)" strokeWidth="1.6" opacity=".8">
        <circle cx="60" cy="60" r="46" />
        <circle cx="60" cy="60" r="31" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M112 ${36 + i * 16}c12-8 24 8 36 0s24-8 36 0 24 8 34 0`} />)}
      </g>
      <g fill="var(--stampink)" opacity=".85" fontFamily="var(--wb-mono), monospace" fontSize="10" letterSpacing="2">
        <text><textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">{top}</textPath></text>
        <text dy="9"><textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">{bottom}</textPath></text>
        <text x="60" y="64" textAnchor="middle" fontSize="11">{mid}</text>
      </g>
    </svg>
  );
}

/** Line-drawn Fontainhas-style balcão house for the venue postcard. */
export function Casa({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 240 150" className={className} style={style} aria-hidden fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path data-draw d="M8 142H232" />
      <path data-draw d="M24 142V58L120 22 216 58V142" />
      <path data-draw d="M14 62L120 18 226 62" />
      <path data-draw d="M104 142V104C104 94 136 94 136 104V142" />
      {[44, 76, 156, 188].map((x) => <path key={x} data-draw d={`M${x} 118V96C${x} 86 ${x + 20} 86 ${x + 20} 96V118ZM${x + 10} 90V118`} />)}
      {[44, 76, 156, 188].map((x) => <path key={x + 1} data-draw d={`M${x} 70H${x + 20}V84H${x}Z`} />)}
      <path data-draw d="M110 60a10 10 0 1 0 20 0 10 10 0 1 0-20 0" />
      <path data-draw d="M38 124H90M150 124H202M38 124V130M90 124V130M150 124V130M202 124V130" />
      <path data-draw d="M182 22c6-10 18-8 20 0M196 16c4-6 12-4 12 2" opacity=".6" />
    </svg>
  );
}

/** A month page with the wedding day circled in red pen. */
export function CalendarPage({ iso, lang, className = "", style, big = false }: { iso?: string; lang: "en" | "ru" | "hi"; className?: string; style?: CSSProperties; big?: boolean }) {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
  const loc = lang === "ru" ? "ru-RU" : lang === "hi" ? "hi-IN" : "en-GB";
  const first = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7; // Monday first
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const wk = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(loc, { weekday: "narrow", timeZone: "UTC" }));
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const month = d.toLocaleDateString(loc, { month: "long", timeZone: "UTC" });
  return (
    <div className={`${s.calendar} ${className}`} style={style}>
      <div className={s.calRings} aria-hidden>{Array.from({ length: 7 }, (_, i) => <span key={i} />)}</div>
      <p className={s.calMonth}>{month} <span>{y}</span></p>
      <div className={s.calGrid} style={{ fontSize: big ? "1em" : undefined }}>
        {wk.map((w, i) => <span key={`w${i}`} className={s.calWk}>{w}</span>)}
        {cells.map((n, i) => (
          <span key={i} className={`${s.calDay} ${n === day ? s.calOn : ""}`}>
            {n}
            {n === day && <Scribble className={s.calCircle} seed={day} turns={1.3} />}
            {n === day && <Heart className={s.calHeart} />}
          </span>
        ))}
      </div>
    </div>
  );
}
