"use client";
import type { CSSProperties } from "react";
import { useSvgId } from "../_shared/ids";

// Godh Bharai — genda-phool (marigold) ladis, an aam-patta bandhanwar, a brass kalash with coconut and mauli,
// clay diyas, green glass bangles and a jharokha arch. All hand-built vector, culturally specific.

/** Ruffled ring path: r(θ) = R(1 + a·sin(nθ)). */
function ruffle(R: number, n: number, a: number, rot = 0) {
  const pts: string[] = [];
  for (let i = 0; i <= 96; i++) {
    const t = (i / 96) * Math.PI * 2;
    const r = R * (1 + a * Math.sin(n * t + rot) + a * 0.4 * Math.sin(n * 2.3 * t));
    pts.push(`${(Math.cos(t) * r).toFixed(2)},${(Math.sin(t) * r).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}
const MG = { outer: ruffle(10, 14, 0.09), mid: ruffle(7.6, 12, 0.11, 1), inner: ruffle(5.2, 10, 0.13, 2), core: ruffle(2.6, 8, 0.15) };

/** <defs> with a marigold symbol in two tones and a mango leaf; include once per <svg>. */
export function GbDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}o`} cx=".45" cy=".4" r=".7"><stop offset="0" stopColor="#ffb52e" /><stop offset=".7" stopColor="#f08a12" /><stop offset="1" stopColor="#c95f08" /></radialGradient>
      <radialGradient id={`${id}y`} cx=".45" cy=".4" r=".7"><stop offset="0" stopColor="#ffe17a" /><stop offset=".7" stopColor="#f6b723" /><stop offset="1" stopColor="#d98d0c" /></radialGradient>
      <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6f9a3c" /><stop offset=".5" stopColor="#3f6f2a" /><stop offset="1" stopColor="#2b5220" /></linearGradient>
      {(["o", "y"] as const).map((t) => (
        <symbol key={t} id={`${id}m${t}`} viewBox="-11 -11 22 22" overflow="visible">
          <path d={MG.outer} fill={`url(#${id}${t})`} stroke="#b4540a" strokeWidth=".35" strokeOpacity=".5" />
          <path d={MG.mid} fill={t === "o" ? "#f59a1c" : "#fbc531"} stroke="#c0650c" strokeWidth=".3" strokeOpacity=".45" />
          <path d={MG.inner} fill={t === "o" ? "#fbb03b" : "#ffd75a"} stroke="#c0650c" strokeWidth=".3" strokeOpacity=".4" />
          <path d={MG.core} fill={t === "o" ? "#e07a10" : "#eaa519"} />
          <circle r="1" fill="#9b4a06" opacity=".55" />
        </symbol>
      ))}
      <symbol id={`${id}leaf`} viewBox="-6 0 12 34" overflow="visible">
        <path d="M0 0C5 6 6.5 16 4.5 24 3 29 1.2 32 0 34-1.2 32-3 29-4.5 24-6.5 16-5 6 0 0Z" fill={`url(#${id}l)`} />
        <path d="M0 2V33" stroke="#a8c66c" strokeWidth=".5" opacity=".7" />
      </symbol>
    </defs>
  );
}

/** A hanging strand (ladi) of marigolds, optionally ending in a tassel. */
export function Ladi({ n = 12, tone = "mix", className = "", style, tassel = true }: { n?: number; tone?: "o" | "y" | "mix"; className?: string; style?: CSSProperties; tassel?: boolean }) {
  const id = useSvgId("gbl");
  const H = n * 17 + (tassel ? 24 : 0);
  return (
    <svg viewBox={`-12 0 24 ${H}`} className={className} style={style} aria-hidden overflow="visible">
      <GbDefs id={id} />
      <line x1="0" y1="0" x2="0" y2={n * 17} stroke="#7a4a12" strokeWidth=".6" />
      {Array.from({ length: n }, (_, i) => (
        <use key={i} href={`#${id}m${tone === "mix" ? (i % 3 === 2 ? "y" : "o") : tone}`} x={-10.5 + (i % 2 ? 0.6 : -0.6)} y={i * 17} width="21" height="21" />
      ))}
      {tassel && <g transform={`translate(0 ${n * 17 + 4})`}><path d="M0 0l-3 16M0 0l0 18M0 0l3 16" stroke="#c9452f" strokeWidth="1.2" /><circle r="2.4" fill="#e0a43a" /></g>}
    </svg>
  );
}

/** Bandhanwar: a swagged toran of mango leaves and marigolds across the top. */
export function Bandhanwar({ className = "", style, swags = 3 }: { className?: string; style?: CSSProperties; swags?: number }) {
  const id = useSvgId("gbb");
  const W = 600, per = W / swags;
  const items: { x: number; y: number; k: "m" | "l"; t: string; r: number }[] = [];
  for (let s = 0; s < swags; s++) {
    for (let i = 0; i <= 10; i++) {
      const u = i / 10, x = Math.round((s * per + u * per) * 100) / 100, y = Math.round((6 + Math.sin(u * Math.PI) * 26) * 100) / 100;
      items.push({ x, y, k: i % 2 ? "l" : "m", t: i % 4 === 0 ? "y" : "o", r: Math.round((u - 0.5) * -2400) / 100 });
    }
  }
  return (
    <svg viewBox={`0 0 ${W} 80`} className={className} style={style} aria-hidden overflow="visible" preserveAspectRatio="xMidYMin meet">
      <GbDefs id={id} />
      <path d={`M0 4H${W}`} stroke="#c9452f" strokeWidth="2.2" />
      <path d={`M0 7H${W}`} stroke="#e0a43a" strokeWidth="1.2" strokeDasharray="3 3" />
      {Array.from({ length: swags }, (_, s) => <path key={s} d={`M${s * per} 6Q${s * per + per / 2} 62 ${(s + 1) * per} 6`} fill="none" stroke="#7a4a12" strokeWidth=".8" />)}
      {items.filter((x) => x.k === "l").map((x, i) => <use key={`l${i}`} href={`#${id}leaf`} x={x.x - 6} y={x.y} width="12" height="34" transform={`rotate(${x.r} ${x.x} ${x.y})`} />)}
      {items.filter((x) => x.k === "m").map((x, i) => <use key={`m${i}`} href={`#${id}m${x.t}`} x={x.x - 9} y={x.y - 3} width="18" height="18" />)}
    </svg>
  );
}

/** Brass kalash with mango leaves, coconut and red-yellow mauli. */
export function Kalash({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useSvgId("gbk");
  return (
    <svg viewBox="0 0 120 150" className={className} style={style} aria-hidden overflow="visible">
      <GbDefs id={id} />
      <defs>
        <linearGradient id={`${id}br`} x1="0" x2="1"><stop offset="0" stopColor="#8a5a1c" /><stop offset=".3" stopColor="#e8b85a" /><stop offset=".45" stopColor="#fff0b8" /><stop offset=".62" stopColor="#d79a3c" /><stop offset="1" stopColor="#7a4c14" /></linearGradient>
        <radialGradient id={`${id}co`} cx=".4" cy=".3" r=".8"><stop offset="0" stopColor="#c08a4e" /><stop offset=".6" stopColor="#8a5a2c" /><stop offset="1" stopColor="#5e3a1a" /></radialGradient>
      </defs>
      {/* mango leaves fanning out */}
      {[-62, -40, -18, 18, 40, 62].map((r, i) => (
        <g key={i} transform={`rotate(${r} 60 60)`}>
          <path d="M60 60C69 48 70 30 60 12 50 30 51 48 60 60Z" fill={`url(#${id}l)`} />
          <path d="M60 58V16" stroke="#a8c66c" strokeWidth=".6" opacity=".7" />
        </g>
      ))}
      {/* coconut with tuft */}
      <ellipse cx="60" cy="38" rx="15" ry="19" fill={`url(#${id}co)`} />
      <path d="M60 18c-3-6-1-10 0-12 1 2 3 6 0 12z" fill="#7a5a32" />
      <path d="M52 30q8-5 16 0M50 40q10-5 20 0" stroke="#5e3a1a" strokeWidth=".6" fill="none" opacity=".5" />
      {/* pot */}
      <path d="M44 58h32l-3 8c14 6 26 18 26 36 0 22-18 38-39 38S21 124 21 102c0-18 12-30 26-36z" fill={`url(#${id}br)`} />
      <path d="M41 56h38v6H41z" fill={`url(#${id}br)`} />
      {/* mauli thread */}
      <path d="M46 70q14 5 28 0" stroke="#c9452f" strokeWidth="2.4" fill="none" />
      <path d="M46 73q14 5 28 0" stroke="#f2b544" strokeWidth="1.4" fill="none" />
      {/* kumkum dots + leaf band */}
      <g fill="#c9452f">{[42, 52, 60, 68, 78].map((x, i) => <circle key={i} cx={x} cy={100 + (i % 2 ? -2 : 2)} r="2.2" />)}</g>
      <path d="M30 112q30 12 60 0" stroke="#7a4c14" strokeWidth=".7" fill="none" opacity=".6" />
      <ellipse cx="45" cy="92" rx="5" ry="13" fill="#fff" opacity=".22" />
      <use href={`#${id}mo`} x="-2" y="126" width="22" height="22" /><use href={`#${id}my`} x="16" y="132" width="18" height="18" />
      <use href={`#${id}mo`} x="100" y="126" width="22" height="22" /><use href={`#${id}my`} x="86" y="132" width="18" height="18" />
    </svg>
  );
}

/** Clay diya with a flickering flame. */
export function Diya({ className = "", style, still = false }: { className?: string; style?: CSSProperties; still?: boolean }) {
  const id = useSvgId("gbd");
  return (
    <svg viewBox="0 0 60 60" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}g`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#ffd66b" stopOpacity=".8" /><stop offset="1" stopColor="#ffb52e" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#e8552f" /><stop offset=".4" stopColor="#ffb52e" /><stop offset="1" stopColor="#fff6c8" /></linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8642e" /><stop offset="1" stopColor="#7c3416" /></linearGradient>
      </defs>
      <circle cx="30" cy="22" r="20" fill={`url(#${id}g)`} className={still ? "" : "gb-glow"} />
      <path className={still ? "" : "gb-flame"} d="M30 6c4 6 6 10 6 14a6 6 0 0 1-12 0c0-4 2-8 6-14z" fill={`url(#${id}f)`} style={{ transformOrigin: "30px 26px" }} />
      <path d="M6 32c8 2 40 2 48 0-2 12-12 18-24 18S8 44 6 32z" fill={`url(#${id}c)`} />
      <path d="M6 32c8 4 40 4 48 0" stroke="#f2b544" strokeWidth="1.4" fill="none" />
      <g fill="#f2b544">{[16, 24, 32, 40].map((x) => <circle key={x} cx={x + 2} cy="40" r="1.2" />)}</g>
    </svg>
  );
}

/** Stack of green glass bangles with gold kadas, in perspective. */
export function Bangles({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useSvgId("gbg");
  return (
    <svg viewBox="0 0 120 110" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}g`} x1="0" x2="1"><stop offset="0" stopColor="#1f6a3a" /><stop offset=".25" stopColor="#7fd09a" /><stop offset=".5" stopColor="#2f8a4c" /><stop offset=".8" stopColor="#a8e6bd" /><stop offset="1" stopColor="#1f6a3a" /></linearGradient>
        <linearGradient id={`${id}a`} x1="0" x2="1"><stop offset="0" stopColor="#8a5a1c" /><stop offset=".4" stopColor="#fff0b8" /><stop offset=".7" stopColor="#d79a3c" /><stop offset="1" stopColor="#7a4c14" /></linearGradient>
      </defs>
      {Array.from({ length: 9 }, (_, i) => {
        const gold = i === 0 || i === 8 || i === 4;
        return <ellipse key={i} cx="60" cy={20 + i * 8} rx="50" ry="14" fill="none" stroke={`url(#${id}${gold ? "a" : "g"})`} strokeWidth={gold ? 4.2 : 3} />;
      })}
      <g fill="#fff" opacity=".7">{[0, 1, 2, 3].map((i) => <circle key={i} cx={22 + i * 3} cy={28 + i * 16} r="1" />)}</g>
    </svg>
  );
}

/** Cusped (multifoil) jharokha arch outline — `fill` paints the window. */
export function Jharokha({ className = "", style, fill = "none", stroke = "var(--t-gold)" }: { className?: string; style?: CSSProperties; fill?: string; stroke?: string }) {
  // 200×280 box; multifoil arch top, straight jambs
  const d = "M10 280V120C10 110 14 104 20 100C18 88 24 78 34 76C34 62 44 52 56 52C58 36 72 26 86 28C90 14 100 6 100 2C100 6 110 14 114 28C128 26 142 36 144 52C156 52 166 62 166 76C176 78 182 88 180 100C186 104 190 110 190 120V280Z";
  return (
    <svg viewBox="0 0 200 280" preserveAspectRatio="none" className={className} style={style} aria-hidden overflow="visible">
      <path d={d} fill={fill} stroke={stroke} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke={stroke} strokeWidth=".6" strokeOpacity=".55" vectorEffect="non-scaling-stroke" transform="translate(100 150) scale(.94 .955) translate(-100 -150)" />
    </svg>
  );
}
export const JHAROKHA_CLIP = "path('M10 280V120C10 110 14 104 20 100C18 88 24 78 34 76C34 62 44 52 56 52C58 36 72 26 86 28C90 14 100 6 100 2C100 6 110 14 114 28C128 26 142 36 144 52C156 52 166 62 166 76C176 78 182 88 180 100C186 104 190 110 190 120V280Z')";

/** Rangoli mandala (lotus petals + dots), drawable. */
export function Rangoli({ className = "", style, petals = 12 }: { className?: string; style?: CSSProperties; petals?: number }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden>
      <g className="gb-draw" fill="none" strokeLinecap="round">
        <circle r="18" stroke="#c9452f" strokeWidth="2.4" />
        <circle r="10" stroke="#e0a43a" strokeWidth="2" />
        {Array.from({ length: petals }, (_, i) => <path key={i} d="M0-22C10-34 10-52 0-64-10-52-10-34 0-22Z" stroke="#f08a12" strokeWidth="2" transform={`rotate(${(360 / petals) * i})`} />)}
        {Array.from({ length: petals }, (_, i) => <path key={`b${i}`} d="M0-62C12-72 14-84 0-94-14-84-12-72 0-62Z" stroke="#3f6f2a" strokeWidth="1.6" transform={`rotate(${(360 / petals) * i + 180 / petals})`} />)}
        <circle r="70" stroke="#e0a43a" strokeWidth="1" strokeDasharray="1 5" />
      </g>
      <g fill="#c9452f">{Array.from({ length: petals }, (_, i) => <circle key={i} r="2.4" transform={`rotate(${(360 / petals) * i}) translate(0 -76)`} />)}</g>
      <circle r="4" fill="#c9452f" />
    </svg>
  );
}

/** Paisley (buta) corner ornament. */
export const Buta = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <svg viewBox="0 0 60 80" className={className} style={style} aria-hidden>
    <path d="M30 76C10 70 4 50 10 34 16 18 34 10 44 2c-2 10 6 16 8 28 3 22-6 42-22 46z" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M30 64C18 60 16 48 20 38 24 28 34 24 40 18c0 8 4 12 4 20 0 14-6 24-14 26z" fill="none" stroke="currentColor" strokeWidth="1" opacity=".7" />
    <circle cx="30" cy="46" r="4" fill="currentColor" opacity=".8" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={8 + i * 2} cy={56 - i * 9} r="1.2" fill="currentColor" />)}
  </svg>
);
