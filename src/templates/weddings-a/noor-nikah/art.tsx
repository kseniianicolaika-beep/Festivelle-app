"use client";
import { useId, type CSSProperties } from "react";
import { r1 } from "../_shared/data";

// Noor — lantern-light for a nikah. Strictly geometric: 8-point khatam stars, star-and-cross girih,
// Mughal ogee (pointed) arches, pierced brass fanoos lanterns, a crescent. No florals.

const uidOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

/** Mughal four-centred / ogee arch: jambs, then curves that swell then tuck into a pointed apex. */
export function ogeePath(x: number, y: number, w: number, h: number, k = 0.58) {
  const aH = w * k, ysp = y + aH, cx = x + w / 2;
  return `M${r1(x)} ${r1(y + h)}L${r1(x)} ${r1(ysp)}C${r1(x)} ${r1(ysp - aH * 0.62)} ${r1(cx - w * 0.16)} ${r1(y + aH * 0.3)} ${r1(cx)} ${r1(y)}C${r1(cx + w * 0.16)} ${r1(y + aH * 0.3)} ${r1(x + w)} ${r1(ysp - aH * 0.62)} ${r1(x + w)} ${r1(ysp)}L${r1(x + w)} ${r1(y + h)}Z`;
}
export function ogeeMask(w = 300, h = 400) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'><path d='${ogeePath(0, 0, w, h)}'/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return { WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" } as CSSProperties;
}

/** 8-point star polygon (khatam) path. */
export function starPath(cx: number, cy: number, R: number, ri = 0.62) {
  let d = "";
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 2 ? R * ri : R;
    d += `${i ? "L" : "M"}${r1(cx + Math.cos(a) * rr)} ${r1(cy + Math.sin(a) * rr)}`;
  }
  return d + "Z";
}
/** Rub el hizb style: two overlapping squares. */
export function khatamPath(cx: number, cy: number, R: number) {
  const sq = (rot: number) => Array.from({ length: 4 }, (_, i) => { const a = rot + (i * Math.PI) / 2; return `${i ? "L" : "M"}${r1(cx + Math.cos(a) * R)} ${r1(cy + Math.sin(a) * R)}`; }).join("") + "Z";
  return sq(0) + sq(Math.PI / 4);
}

/** Star-and-cross girih tile, used as an SVG <pattern>. */
export function GirihDefs({ id, size = 60, stroke = "var(--t-gold)", width = 1, fillStar }: { id: string; size?: number; stroke?: string; width?: number; fillStar?: string }) {
  const s = size, c = s / 2;
  const cross = `M0 ${r1(c * 0.38)}L${r1(c * 0.38)} 0M${s - c * 0.38} 0L${s} ${r1(c * 0.38)}M${s} ${s - c * 0.38}L${s - c * 0.38} ${s}M${r1(c * 0.38)} ${s}L0 ${s - c * 0.38}`;
  return (
    <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
      <path d={starPath(c, c, c * 0.98, 0.66)} fill={fillStar ?? "none"} stroke={stroke} strokeWidth={width} />
      <path d={khatamPath(c, c, c * 0.42)} fill="none" stroke={stroke} strokeWidth={width * 0.7} opacity=".8" />
      <path d={cross} fill="none" stroke={stroke} strokeWidth={width} />
      <circle cx={c} cy={c} r={s * 0.04} fill={stroke} />
    </pattern>
  );
}

/** Full-bleed faint girih wall. */
export function GirihWall({ className = "", opacity = 0.1, size = 64 }: { className?: string; opacity?: number; size?: number }) {
  const uid = uidOf(useId());
  return (
    <svg className={className} width="100%" height="100%" aria-hidden style={{ opacity }}>
      <defs><GirihDefs id={`${uid}g`} size={size} /></defs>
      <rect width="100%" height="100%" fill={`url(#${uid}g)`} />
    </svg>
  );
}

/** Horizontal geometric band (border) — interlaced stars between double rules. */
export function GirihBand({ className = "", h = 22 }: { className?: string; h?: number }) {
  const uid = uidOf(useId());
  return (
    <svg className={className} width="100%" height={h} preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={`${uid}b`} width={h * 1.6} height={h} patternUnits="userSpaceOnUse">
          <path d={starPath(h * 0.8, h / 2, h * 0.36, 0.55)} fill="none" stroke="var(--t-gold)" strokeWidth="1" />
          <circle cx={h * 0.8} cy={h / 2} r="1.4" fill="var(--t-gold)" />
          <path d={`M0 ${h / 2}h${h * 0.36}M${h * 1.24} ${h / 2}h${h * 0.36}`} stroke="var(--t-gold)" strokeWidth=".8" />
        </pattern>
      </defs>
      <rect y="0" width="100%" height="1" fill="var(--t-gold)" />
      <rect y={h - 1} width="100%" height="1" fill="var(--t-gold)" />
      <rect y="0" width="100%" height={h} fill={`url(#${uid}b)`} />
    </svg>
  );
}

/** One carved jaali door leaf: dark lacquered wood, pierced girih letting the lamp-light through. */
export function DoorLeaf({ side, className = "", style }: { side: "l" | "r"; className?: string; style?: CSSProperties }) {
  const uid = uidOf(useId());
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 150 400" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}w`} x1={side === "l" ? "0" : "1"} x2={side === "l" ? "1" : "0"}>
            <stop offset="0" stopColor="#06150f" /><stop offset=".7" stopColor="#0d2a22" /><stop offset="1" stopColor="#123a2f" />
          </linearGradient>
          <radialGradient id={`${uid}l`} cx={side === "l" ? "1" : "0"} cy=".45" r="1"><stop offset="0" stopColor="#ffe6a3" /><stop offset=".5" stopColor="#e2a540" /><stop offset="1" stopColor="#7a4a10" /></radialGradient>
          <pattern id={`${uid}p`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d={starPath(15, 15, 11, 0.55)} fill={`url(#${uid}l)`} />
            <path d={`M0 0l5 5M30 0l-5 5M0 30l5-5M30 30l-5-5`} stroke={`url(#${uid}l)`} strokeWidth="2.2" />
          </pattern>
        </defs>
        <rect width="150" height="400" fill={`url(#${uid}w)`} />
        <rect x="14" y="40" width="122" height="250" fill={`url(#${uid}p)`} opacity=".85" />
        <rect x="14" y="40" width="122" height="250" fill="none" stroke="var(--t-gold)" strokeWidth="2" />
        <rect x="8" y="8" width="134" height="384" fill="none" stroke="var(--t-gold)" strokeWidth="1.2" opacity=".7" />
        <rect x="14" y="306" width="122" height="78" fill="none" stroke="var(--t-gold)" strokeWidth="1.2" opacity=".7" />
        <path d={khatamPath(75, 345, 22)} fill="none" stroke="var(--t-gold)" strokeWidth="1.4" />
        <circle cx={side === "l" ? 140 : 10} cy="200" r="5" fill="var(--t-gold)" />
      </svg>
    </div>
  );
}

/** Brass fanoos lantern on its chain, pierced with stars. `chain` = chain length in viewBox units. */
export function Lantern({ className = "", chain = 120, still = false, delay = 0, style }: { className?: string; chain?: number; still?: boolean; delay?: number; style?: CSSProperties }) {
  const uid = uidOf(useId());
  const H = chain + 190;
  const links = Math.floor(chain / 12);
  return (
    <svg viewBox={`0 0 100 ${H}`} className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <linearGradient id={`${uid}b`} x1="0" x2="1"><stop offset="0" stopColor="#6a4a14" /><stop offset=".35" stopColor="#f2d58a" /><stop offset=".6" stopColor="#c8962e" /><stop offset="1" stopColor="#5a3a0c" /></linearGradient>
        <radialGradient id={`${uid}g`}><stop offset="0" stopColor="#ffe9b0" stopOpacity=".95" /><stop offset=".35" stopColor="#ffc35a" stopOpacity=".45" /><stop offset="1" stopColor="#ffb040" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${uid}in`} cy=".55"><stop offset="0" stopColor="#fff6d6" /><stop offset=".6" stopColor="#ffcf6a" /><stop offset="1" stopColor="#d9862a" /></radialGradient>
      </defs>
      <g style={still ? undefined : { transformOrigin: "50px 0px", animation: `noor-swing ${6 + delay}s ease-in-out ${-delay * 1.7}s infinite` }}>
        {Array.from({ length: links }, (_, i) => <ellipse key={i} cx="50" cy={i * 12 + 6} rx={i % 2 ? 1.6 : 3.2} ry="6" fill="none" stroke={`url(#${uid}b)`} strokeWidth="1.6" />)}
        <g transform={`translate(0 ${chain})`}>
          <circle cx="50" cy="105" r="95" fill={`url(#${uid}g)`} style={still ? undefined : { transformOrigin: "50px 105px", animation: `wa-flicker 3.4s ease-in-out ${delay}s infinite` }} />
          <path d="M50 0v10" stroke={`url(#${uid}b)`} strokeWidth="2" />
          <circle cx="50" cy="12" r="3.5" fill={`url(#${uid}b)`} />
          {/* dome cap */}
          <path d="M28 44C28 28 40 18 50 15C60 18 72 28 72 44Z" fill={`url(#${uid}b)`} />
          <path d="M22 44h56l-4 8H26Z" fill={`url(#${uid}b)`} />
          {/* lit body: tall hexagonal profile with pierced stars + arched windows */}
          <path d="M26 52L18 82L24 132L34 146H66L76 132L82 82L74 52Z" fill={`url(#${uid}in)`} />
          <path d="M26 52L18 82L24 132L34 146H66L76 132L82 82L74 52Z" fill="none" stroke={`url(#${uid}b)`} strokeWidth="2.4" />
          <path d="M18 82H82M24 132H76M38 52L34 146M62 52L66 146M50 52V146" stroke={`url(#${uid}b)`} strokeWidth="1.6" fill="none" />
          <path d={starPath(29, 106, 6, 0.5)} fill="#7a4a10" opacity=".55" /><path d={starPath(71, 106, 6, 0.5)} fill="#7a4a10" opacity=".55" />
          <path d={starPath(44, 66, 4.5, 0.5)} fill="#7a4a10" opacity=".45" /><path d={starPath(56, 66, 4.5, 0.5)} fill="#7a4a10" opacity=".45" />
          <path d="M44 128v-22a6 6 0 0 1 12 0v22z" fill="#fff8e0" opacity=".85" />
          {/* base + drop finial */}
          <path d="M34 146h32l-6 12H40Z" fill={`url(#${uid}b)`} />
          <path d="M44 158h12l-6 14Z" fill={`url(#${uid}b)`} />
          <circle cx="50" cy="176" r="3" fill={`url(#${uid}b)`} />
        </g>
      </g>
    </svg>
  );
}

/** Crescent moon with a small star. */
export function Crescent({ className = "", glow = true }: { className?: string; glow?: boolean }) {
  const uid = uidOf(useId());
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs><radialGradient id={`${uid}h`}><stop offset="0" stopColor="#ffe9a8" stopOpacity=".4" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient></defs>
      {glow && <circle cx="60" cy="60" r="58" fill={`url(#${uid}h)`} />}
      <path d="M70 22a40 40 0 1 0 0 76A34 34 0 1 1 70 22z" fill="var(--t-gold)" />
      <path d={starPath(84, 46, 9, 0.45)} fill="var(--t-gold)" />
    </svg>
  );
}

/** Section mark: a small 8-point star between rules. */
export function StarRule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 24" className={className} aria-hidden fill="none" stroke="var(--t-gold)">
      <path d="M0 12h78M122 12h78" strokeWidth=".8" />
      <path d={starPath(100, 12, 11, 0.6)} strokeWidth="1" />
      <path d={khatamPath(100, 12, 5)} strokeWidth=".8" />
      <circle cx="84" cy="12" r="1.6" fill="var(--t-gold)" /><circle cx="116" cy="12" r="1.6" fill="var(--t-gold)" />
    </svg>
  );
}

/** Wall of pierced light thrown by the lanterns. */
export function LightThrow({ className = "" }: { className?: string }) {
  const uid = uidOf(useId());
  return (
    <svg className={className} width="100%" height="100%" aria-hidden>
      <defs>
        <pattern id={`${uid}t`} width="46" height="46" patternUnits="userSpaceOnUse"><path d={starPath(23, 23, 9, 0.5)} fill="#ffd27a" /></pattern>
        <radialGradient id={`${uid}m`} cx=".5" cy=".42" r=".6"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <mask id={`${uid}k`}><rect width="100%" height="100%" fill={`url(#${uid}m)`} /></mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}t)`} mask={`url(#${uid}k)`} />
    </svg>
  );
}
