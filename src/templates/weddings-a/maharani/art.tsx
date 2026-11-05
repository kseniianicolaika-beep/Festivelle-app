"use client";
import { useId, type CSSProperties } from "react";
import { r1, rng } from "../_shared/data";

// Maharani — a Rajput courtyard at candle-time. Procedural SVG: cusped (multifoil) jharokha arches,
// a lake palace of chhatris at dusk, marigold-and-mango-leaf torans, clay diyas, jaali screens.

/** Cusped Rajput arch opening as a closed path: jambs + pointed arch whose intrados is scalloped. */
export function archPath(x: number, y: number, w: number, h: number, cusps = 4, k = 0.6) {
  const R = w * k;
  const cosA = (w / 2 - R) / R;
  const thA = Math.acos(cosA);
  const apex = Math.sqrt(R * R - (R - w / 2) ** 2);
  const ysp = y + apex;
  const pts: [number, number][] = [];
  for (let i = 0; i <= cusps; i++) { const th = Math.PI - (Math.PI - thA) * (i / cusps); pts.push([x + R + R * Math.cos(th), ysp - R * Math.sin(th)]); }
  for (let i = cusps - 1; i >= 0; i--) { const [px, py] = pts[i]; pts.push([2 * x + w - px, py]); }
  let d = `M${r1(x)} ${r1(y + h)}L${r1(x)} ${r1(ysp)}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const ch = Math.hypot(bx - ax, by - ay);
    d += `A${r1(ch * 0.56)} ${r1(ch * 0.56)} 0 0 0 ${r1(bx)} ${r1(by)}`;
  }
  return `${d}L${r1(x + w)} ${r1(y + h)}Z`;
}
/** Plain pointed outline (for outer mouldings). */
export function pointedPath(x: number, y: number, w: number, h: number, k = 0.6) {
  const R = w * k, apex = Math.sqrt(R * R - (R - w / 2) ** 2), ysp = y + apex;
  return `M${r1(x)} ${r1(y + h)}L${r1(x)} ${r1(ysp)}A${r1(R)} ${r1(R)} 0 0 1 ${r1(x + w / 2)} ${r1(y)}A${r1(R)} ${r1(R)} 0 0 1 ${r1(x + w)} ${r1(ysp)}L${r1(x + w)} ${r1(y + h)}Z`;
}
/** CSS mask (data URI) of a cusped arch at a given aspect so photos sit inside the arch undistorted. */
export function archMask(w = 300, h = 400) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'><path d='${archPath(0, 0, w, h, 4)}'/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return { WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" } as CSSProperties;
}

function chhatri(cx: number, by: number, s: number) {
  const d = [
    `M${r1(cx - 13 * s)} ${r1(by)}h${r1(26 * s)}v${r1(-2.5 * s)}h${r1(-26 * s)}Z`,
    `M${r1(cx - 11 * s)} ${r1(by - 2.5 * s)}h${r1(2.4 * s)}v${r1(-11 * s)}h${r1(-2.4 * s)}ZM${r1(cx + 8.6 * s)} ${r1(by - 2.5 * s)}h${r1(2.4 * s)}v${r1(-11 * s)}h${r1(-2.4 * s)}ZM${r1(cx - 1.2 * s)} ${r1(by - 2.5 * s)}h${r1(2.4 * s)}v${r1(-11 * s)}h${r1(-2.4 * s)}Z`,
    `M${r1(cx - 15 * s)} ${r1(by - 12 * s)}L${r1(cx - 11 * s)} ${r1(by - 15.5 * s)}h${r1(22 * s)}L${r1(cx + 15 * s)} ${r1(by - 12 * s)}Z`,
    `M${r1(cx - 10 * s)} ${r1(by - 15.5 * s)}C${r1(cx - 12 * s)} ${r1(by - 24 * s)} ${r1(cx - 5 * s)} ${r1(by - 28 * s)} ${r1(cx)} ${r1(by - 29.5 * s)}C${r1(cx + 5 * s)} ${r1(by - 28 * s)} ${r1(cx + 12 * s)} ${r1(by - 24 * s)} ${r1(cx + 10 * s)} ${r1(by - 15.5 * s)}Z`,
    `M${r1(cx - 0.6 * s)} ${r1(by - 29 * s)}h${r1(1.2 * s)}v${r1(-6 * s)}h${r1(-1.2 * s)}Z`,
  ];
  return d.join("");
}

/** Lake palace at dusk (Udaipur), reflected in still water. Portrait or wide. */
export function PalaceLake({ className = "", wide = false, still = false, stars = true, low = false, style }: { className?: string; wide?: boolean; still?: boolean; stars?: boolean; low?: boolean; style?: CSSProperties }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `${uid}${n}`;
  const u = (n: string) => `url(#${id(n)})`;
  const W = wide ? 1200 : 600, H = 800, hz = wide ? 560 : low ? 680 : 610;
  const R = rng(17);
  // build the palace: long body, central block, rhythm of chhatris
  const x0 = W * 0.08, x1 = W * 0.92, bodyTop = hz - 64;
  let sil = `M${r1(x0)} ${hz}V${bodyTop}`;
  for (let x = x0; x < x1 - 8; x += 14) sil += `H${r1(x + 7)}v-6h7v6`;
  sil += `H${r1(x1)}V${hz}Z`;
  const cx = W / 2, cw = W * 0.22;
  sil += `M${r1(cx - cw / 2)} ${r1(bodyTop)}V${r1(bodyTop - 52)}H${r1(cx + cw / 2)}V${r1(bodyTop)}Z`;
  sil += `M${r1(cx - cw * 0.3)} ${r1(bodyTop - 52)}V${r1(bodyTop - 78)}H${r1(cx + cw * 0.3)}V${r1(bodyTop - 52)}Z`;
  const chh: [number, number, number][] = [[cx, bodyTop - 78, 1.5], [cx - cw * 0.36, bodyTop - 52, 1.05], [cx + cw * 0.36, bodyTop - 52, 1.05]];
  const n = wide ? 9 : 5;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t;
    if (Math.abs(x - cx) < cw * 0.62) continue;
    chh.push([x, bodyTop - 6, 0.75 + R() * 0.45]);
  }
  chh.push([x0 + 10, bodyTop - 6, 1.25], [x1 - 10, bodyTop - 6, 1.25]);
  for (const [x, y, s] of chh) sil += chhatri(x, y, s);
  const windows: { x: number; y: number; w: number; h: number; o: number }[] = [];
  for (let row = 0; row < 2; row++) for (let x = x0 + 14; x < x1 - 14; x += 22) {
    if (R() < 0.25) continue;
    windows.push({ x: r1(x), y: r1(bodyTop + 14 + row * 24), w: 6, h: 11, o: r1(0.45 + R() * 0.55) });
  }
  for (let row = 0; row < 2; row++) for (let x = cx - cw / 2 + 12; x < cx + cw / 2 - 8; x += 18) windows.push({ x: r1(x), y: r1(bodyTop - 44 + row * 20), w: 6, h: 12, o: r1(0.6 + R() * 0.4) });
  const st = stars ? Array.from({ length: 46 }, () => ({ x: r1(R() * W), y: r1(R() * hz * 0.6), r: r1(0.5 + R() * 1.3), d: r1(R() * 4) })) : [];
  const anim = (a: string): CSSProperties => (still ? {} : { animation: a });
  const reflGlints = Array.from({ length: 26 }, () => ({ x: r1(x0 + R() * (x1 - x0)), y: r1(hz + 8 + R() * 150), w: r1(8 + R() * 40), d: r1(R() * 3) }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0820" />
          <stop offset=".35" stopColor="#2a1036" />
          <stop offset=".58" stopColor="#6e1c34" />
          <stop offset=".7" style={{ stopColor: "color-mix(in oklab, var(--t-accent) 70%, #c2472c)" }} />
          <stop offset=".74" stopColor="#f0a24a" />
          <stop offset="1" stopColor="#1a0a18" />
        </linearGradient>
        <linearGradient id={id("lake")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a2a30" />
          <stop offset=".3" stopColor="#3a1230" />
          <stop offset="1" stopColor="#120818" />
        </linearGradient>
        <radialGradient id={id("moon")}><stop offset="0" stopColor="#fff6dc" /><stop offset=".6" stopColor="#ffe6a8" /><stop offset="1" stopColor="#f2c66a" /></radialGradient>
        <radialGradient id={id("halo")}><stop offset="0" stopColor="#ffd98a" stopOpacity=".45" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
        <filter id={id("ripple")} x="0" y="-10%" width="100%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".004 .09" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="12" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.6" />
        </filter>
        <filter id={id("glow")}><feGaussianBlur stdDeviation="2.4" /></filter>
      </defs>
      <rect width={W} height={hz} fill={u("sky")} />
      {st.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff1d0" style={anim(`wa-twinkle ${3 + s.d}s ease-in-out ${-s.d}s infinite`)} />)}
      <circle cx={W * (wide ? 0.78 : 0.72)} cy={hz * 0.3} r="120" fill={u("halo")} />
      <circle cx={W * (wide ? 0.78 : 0.72)} cy={hz * 0.3} r="30" fill={u("moon")} />
      <ellipse cx={W / 2} cy={hz} rx={W * 0.55} ry="60" fill="#ffb25a" opacity=".22" filter={u("glow")} />
      <path d={`M0 ${hz}C${W * 0.2} ${hz - 30} ${W * 0.3} ${hz - 22} ${W * 0.45} ${hz - 8}L${W * 0.55} ${hz - 4}C${W * 0.7} ${hz - 26} ${W * 0.85} ${hz - 40} ${W} ${hz - 28}V${hz}Z`} fill="#3a1424" opacity=".8" />
      <rect y={hz} width={W} height={H - hz} fill={u("lake")} />
      <g data-palace>
        <path d={sil} fill="#1c0812" />
        {windows.map((w, i) => <path key={i} d={`M${w.x} ${w.y + w.h}v${-w.h + 3}a3 3 0 0 1 6 0v${w.h - 3}z`} fill="#ffc560" opacity={w.o} style={anim(`wa-twinkle ${5 + (i % 4)}s ease-in-out ${-(i % 6)}s infinite`)} />)}
      </g>
      <g filter={u("ripple")} opacity=".3" transform={`translate(0 ${hz * 2}) scale(1 -1)`}>
        <path d={sil} fill="#0e040a" />
        {windows.map((w, i) => <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill="#ffc560" opacity={w.o * 0.8} />)}
      </g>
      {reflGlints.map((g, i) => <rect key={i} x={g.x} y={g.y} width={g.w} height="1.6" rx=".8" fill="#ffd28a" opacity=".5" style={{ transformOrigin: `${g.x + g.w / 2}px ${g.y}px`, transformBox: "view-box", ...anim(`wa-glint ${2.5 + g.d}s ease-in-out ${-g.d}s infinite`) }} />)}
    </svg>
  );
}

/** Marigold-and-mango-leaf toran (bandhanwar) with hanging ladis; spans its viewBox width. */
export function Toran({ className = "", w = 1200, swags = 5, drops = true, clear = 0, style, still = false }: { className?: string; w?: number; swags?: number; drops?: boolean; clear?: number; style?: CSSProperties; still?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `${uid}${n}`;
  const R = rng(5);
  const H = 220;
  const balls: { x: number; y: number; r: number; c: 0 | 1 }[] = [];
  const leaves: { x: number; y: number; a: number }[] = [];
  const sw = w / swags;
  for (let s = 0; s < swags; s++) {
    for (const [sag, c, top] of [[70, 0, 14], [48, 1, 10]] as const) {
      const n = Math.round(sw / 15);
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = s * sw + t * sw;
        balls.push({ x: r1(x), y: r1(top + sag * 4 * t * (1 - t)), r: c ? 8.5 : 10.5, c });
      }
    }
    for (let i = 0; i < 5; i++) leaves.push({ x: r1(s * sw + sw * (0.15 + i * 0.17)), y: 12, a: r1(-10 + R() * 20) });
  }
  const strands = drops ? Array.from({ length: swags + 1 }, (_, s) => s * sw).filter((x) => Math.abs(x - w / 2) > clear * w) : [];
  for (const x of strands) for (let i = 0; i < 8; i++) balls.push({ x: r1(x + (i % 2 ? 1 : -1)), y: r1(24 + i * 17), r: 9, c: (i % 2) as 0 | 1 });
  return (
    <svg viewBox={`0 0 ${w} ${H}`} preserveAspectRatio="xMidYMin meet" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={id("m0")} cx=".4" cy=".35"><stop offset="0" stopColor="#ffb347" /><stop offset=".6" stopColor="#f07f12" /><stop offset="1" stopColor="#b84a06" /></radialGradient>
        <radialGradient id={id("m1")} cx=".4" cy=".35"><stop offset="0" stopColor="#ffe27a" /><stop offset=".6" stopColor="#f5b70f" /><stop offset="1" stopColor="#b97a05" /></radialGradient>
        <linearGradient id={id("leaf")} x1="0" x2="1"><stop offset="0" stopColor="#2f5d1c" /><stop offset="1" stopColor="#5d8a2a" /></linearGradient>
        <symbol id={id("frill")} viewBox="-10 -10 20 20"><g fill="none" stroke="#000" strokeOpacity=".22" strokeWidth=".9">{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${r1(Math.cos(i * 0.7) * 3)} ${r1(Math.sin(i * 0.7) * 3)}q${r1(Math.cos(i * 0.7 + 0.6) * 4)} ${r1(Math.sin(i * 0.7 + 0.6) * 4)} ${r1(Math.cos(i * 0.7) * 6.5)} ${r1(Math.sin(i * 0.7) * 6.5)}`} />)}</g></symbol>
      </defs>
      <rect x="0" y="0" width={w} height="10" fill="#7a1c1c" />
      <rect x="0" y="8" width={w} height="2" fill="#d9a441" />
      {leaves.map((l, i) => <path key={i} d="M0 0C8 10 9 30 0 46C-9 30-8 10 0 0Z" fill={`url(#${id("leaf")})`} transform={`translate(${l.x} ${l.y}) rotate(${l.a})`} />)}
      {strands.map((x, i) => <line key={i} x1={x} y1="10" x2={x} y2="160" stroke="#6b3a10" strokeWidth="1" />)}
      <g style={still ? undefined : { transformOrigin: "50% 0", transformBox: "view-box", animation: "wa-sway 9s ease-in-out infinite" }}>
        {balls.map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${b.y})`}>
            <circle r={b.r} fill={`url(#${id(b.c ? "m1" : "m0")})`} />
            <use href={`#${id("frill")}`} x={-b.r} y={-b.r} width={b.r * 2} height={b.r * 2} />
          </g>
        ))}
        {strands.map((x, i) => <path key={i} d={`M${x - 6} 166 l6 14 l6 -14 z`} fill="#d9a441" />)}
      </g>
    </svg>
  );
}

/** Clay diya with a living flame. */
export function Diya({ className = "", still = false, delay = 0 }: { className?: string; still?: boolean; delay?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${uid}g`}><stop offset="0" stopColor="#ffd27a" stopOpacity=".75" /><stop offset="1" stopColor="#ff9a3a" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${uid}f`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ff7a1a" /><stop offset=".45" stopColor="#ffc34a" /><stop offset="1" stopColor="#fff6d0" /></linearGradient>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c0602e" /><stop offset="1" stopColor="#6a2410" /></linearGradient>
      </defs>
      <circle cx="40" cy="36" r="30" fill={`url(#${uid}g)`} style={still ? undefined : { transformOrigin: "40px 36px", animation: `wa-flicker 2.6s ease-in-out ${delay}s infinite` }} />
      <g style={still ? undefined : { transformOrigin: "40px 52px", animation: `wa-flicker 1.4s ease-in-out ${delay}s infinite` }}>
        <path d="M40 22C44 30 47 37 45 45C44 50 36 50 35 45C33 37 36 30 40 22Z" fill={`url(#${uid}f)`} />
        <path d="M40 36C42 40 42 44 40 47C38 44 38 40 40 36Z" fill="#fffbe8" />
      </g>
      <path d="M14 52C18 66 62 66 66 52C60 48 48 47 40 49C30 47 20 48 14 52Z" fill={`url(#${uid}c)`} />
      <path d="M14 52C20 49 30 48 40 50C50 48 60 49 66 52" fill="none" stroke="#e6b257" strokeWidth="1.6" />
      <path d="M22 58h36" stroke="#e6b257" strokeOpacity=".5" strokeWidth="1" strokeDasharray="2 3" />
    </svg>
  );
}

/** Damask buta (paisley-lotus) wallpaper pattern for maroon walls. */
export function Damask({ className = "", opacity = 0.12 }: { className?: string; opacity?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg className={className} aria-hidden width="100%" height="100%">
      <defs>
        <pattern id={`${uid}p`} width="90" height="120" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="var(--t-gold)" strokeWidth="1" opacity={opacity}>
            <path d="M45 18C58 30 58 52 45 62C32 52 32 30 45 18ZM45 30C50 36 50 46 45 52C40 46 40 36 45 30Z" />
            <path d="M45 62C45 72 52 78 60 78M45 62C45 72 38 78 30 78M38 70C30 64 22 66 20 72M52 70C60 64 68 66 70 72" />
            <circle cx="0" cy="0" r="3" /><circle cx="90" cy="0" r="3" /><circle cx="0" cy="120" r="3" /><circle cx="90" cy="120" r="3" />
            <path d="M0 100C8 92 8 82 0 74M90 100C82 92 82 82 90 74" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}p)`} />
    </svg>
  );
}

/** Jaali screen panel: interlocking quatrefoil lattice. */
export function Jaali({ className = "", w = 200, h = 400 }: { className?: string; w?: number; h?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
      <defs>
        <pattern id={`${uid}j`} width="28" height="28" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="var(--t-gold)" strokeWidth="1.1">
            <circle cx="0" cy="14" r="10" /><circle cx="28" cy="14" r="10" /><circle cx="14" cy="0" r="10" /><circle cx="14" cy="28" r="10" />
            <circle cx="14" cy="14" r="2" fill="var(--t-gold)" />
          </g>
        </pattern>
        <clipPath id={`${uid}c`}><path d={archPath(0, 0, w, h, 3)} /></clipPath>
      </defs>
      <g clipPath={`url(#${uid}c)`}><rect width={w} height={h} fill="#1a0509" opacity=".55" /><rect width={w} height={h} fill={`url(#${uid}j)`} opacity=".55" /></g>
      <path d={archPath(0, 0, w, h, 3)} fill="none" stroke="var(--t-gold)" strokeWidth="2" opacity=".8" />
    </svg>
  );
}

/** Small cusped-arch emblem with a diya flame — section marks. */
export function ArchMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 70" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d={archPath(6, 4, 48, 62, 3)} />
      <path d={archPath(12, 12, 36, 54, 3)} opacity=".5" />
      <path d="M30 34c3 5 4 9 0 13c-4-4-3-8 0-13z" fill="currentColor" stroke="none" />
      <path d="M22 52c4 4 12 4 16 0" />
    </svg>
  );
}

/** Gold zari/gota ribbon band (horizontal). */
export function ZariBand({ className = "" }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg className={className} aria-hidden width="100%" height="18" preserveAspectRatio="none">
      <defs>
        <pattern id={`${uid}z`} width="24" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 2h24M0 16h24" stroke="var(--t-gold)" strokeWidth="1" />
          <path d="M12 4l5 5-5 5-5-5z" fill="var(--t-gold)" opacity=".85" />
          <circle cx="0" cy="9" r="1.6" fill="var(--t-gold)" /><circle cx="24" cy="9" r="1.6" fill="var(--t-gold)" />
        </pattern>
      </defs>
      <rect width="100%" height="18" fill={`url(#${uid}z)`} />
    </svg>
  );
}
