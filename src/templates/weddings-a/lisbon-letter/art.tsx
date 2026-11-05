"use client";
import { useId, type CSSProperties } from "react";
import { r1, rng } from "../_shared/data";

// Lisbon Letter — a Goan Catholic wedding told as a letter. Hand-painted azulejo (cobalt on tin-glaze white),
// the whitewashed Immaculate Conception church of Panjim with its criss-cross stair, bougainvillea, a wax seal.

const COB = "var(--t-accent)";
const uidOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

/** Brush filter: wobbly hand-painted edge + pooled pigment. */
function BrushDefs({ id, scale = 1.6 }: { id: string; scale?: number }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="5" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="2" result="m" />
      <feColorMatrix in="m" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.7 1.2" result="mask" />
      <feComposite in="d" in2="mask" operator="in" />
    </filter>
  );
}

/** One 100×100 azulejo, 4-fold symmetric. Variant "rosa" = rosette field tile, "estrela" = star tile. */
export function TileArt({ variant = "rosa" }: { variant?: "rosa" | "estrela" }) {
  const q = (rot: number) => (
    <g key={rot} transform={`rotate(${rot} 50 50)`}>
      {/* corner motif: quarter rosette + linking arc (forms a flower where four tiles meet) */}
      <path d="M0 0 L7 0 A7 7 0 0 1 0 7Z" fill={COB} />
      <ellipse cx="13" cy="13" rx="4" ry="8.5" transform="rotate(-45 13 13)" fill={COB} fillOpacity=".9" />
      <path d="M0 17 C6 17 10 21 10 28 C4 28 0 24 0 17Z M17 0 C17 6 21 10 28 10 C28 4 24 0 17 0Z" fill={COB} fillOpacity=".5" />
      <path d="M32 0 A32 32 0 0 1 0 32" fill="none" stroke={COB} strokeWidth="1.1" />
      {/* diagonal acanthus curl toward the corner */}
      <path d="M38 38 C30 36 28 30 31 26 C33 30 36 31 39 30 M38 38 C36 30 30 28 26 31 C30 33 31 36 30 39" fill={COB} fillOpacity=".55" stroke={COB} strokeWidth="1.1" />
      <circle cx="27" cy="27" r="2.2" fill={COB} />
      {/* edge half-fleur at the midpoint */}
      {variant === "rosa" ? (
        <path d="M50 0 C46 6 44 10 50 16 C56 10 54 6 50 0Z M50 16 L50 22 M43 4 C44 9 46 11 50 12 M57 4 C56 9 54 11 50 12" fill={COB} fillOpacity=".8" stroke={COB} strokeWidth="1" />
      ) : (
        <path d="M38 0 L50 13 L62 0 M44 0 L50 7 L56 0" fill="none" stroke={COB} strokeWidth="1.6" />
      )}
    </g>
  );
  return (
    <g>
      <rect width="100" height="100" fill="#fbfcff" />
      {[0, 90, 180, 270].map(q)}
      {variant === "rosa" ? (
        <g>
          <circle cx="50" cy="50" r="23" fill="none" stroke={COB} strokeWidth="1" strokeOpacity=".6" />
          {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={r1(50 + Math.cos(i * 0.3927) * 23)} cy={r1(50 + Math.sin(i * 0.3927) * 23)} r="1.3" fill={COB} />)}
          {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="50" cy="39" rx="4.6" ry="10" fill={COB} fillOpacity={i % 2 ? 0.45 : 0.9} transform={`rotate(${i * 45} 50 50)`} />)}
          <circle cx="50" cy="50" r="5" fill="#fbfcff" stroke={COB} strokeWidth="1.4" />
          <circle cx="50" cy="50" r="2" fill={COB} />
        </g>
      ) : (
        <g>
          <path d={Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8 - Math.PI / 2, r = i % 2 ? 11 : 26; return `${i ? "L" : "M"}${r1(50 + Math.cos(a) * r)} ${r1(50 + Math.sin(a) * r)}`; }).join("") + "Z"} fill={COB} fillOpacity=".85" />
          <circle cx="50" cy="50" r="9" fill="#fbfcff" />
          <path d="M50 42 L52 48 L58 50 L52 52 L50 58 L48 52 L42 50 L48 48Z" fill={COB} />
          <circle cx="50" cy="50" r="30" fill="none" stroke={COB} strokeWidth=".8" strokeDasharray="1.5 3" />
        </g>
      )}
    </g>
  );
}

/** A field of tiles (tin-glaze sheen + grout lines), filling its box. */
export function TileField({ size = 120, variant = "rosa", className = "", style, brush = true }: { size?: number; variant?: "rosa" | "estrela"; className?: string; style?: CSSProperties; brush?: boolean }) {
  const u = uidOf(useId());
  return (
    <svg className={className} style={style} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <BrushDefs id={`${u}b`} />
        <pattern id={`${u}p`} width={size} height={size} patternUnits="userSpaceOnUse">
          <g transform={`scale(${size / 100})`} filter={brush ? `url(#${u}b)` : undefined}><TileArt variant={variant} /></g>
          <path d={`M0 0H${size}V${size}`} fill="none" stroke="#c9d3e3" strokeWidth="1.2" />
        </pattern>
        <linearGradient id={`${u}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#0b1a3a" stopOpacity=".08" /></linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${u}p)`} />
      <rect width="100%" height="100%" fill={`url(#${u}g)`} />
    </svg>
  );
}

/** A single tile, e.g. a stamp or medallion. */
export function Tile({ variant = "estrela", className = "", style }: { variant?: "rosa" | "estrela"; className?: string; style?: CSSProperties }) {
  const u = uidOf(useId());
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <defs><BrushDefs id={`${u}b`} scale={1.2} /></defs>
      <g filter={`url(#${u}b)`}><TileArt variant={variant} /></g>
    </svg>
  );
}

/** Igreja de Nossa Senhora da Imaculada Conceição, Panjim — whitewashed baroque facade + criss-cross stair. */
export function Church({ className = "", style, stroke = "currentColor", draw = false }: { className?: string; style?: CSSProperties; stroke?: string; draw?: boolean }) {
  const win = (x: number, y: number, w = 12, h = 22) => `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;
  const steps = (x1: number, y1: number, x2: number, y2: number, n: number) => {
    let d = "";
    for (let i = 1; i < n; i++) { const t = i / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; d += `M${r1(x)} ${r1(y)}l0 9`; }
    return d;
  };
  return (
    <svg viewBox="0 0 400 440" className={className} style={style} aria-hidden fill="none" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
      <g data-draw={draw ? "" : undefined}>
        {/* towers */}
        <path d="M112 300V96H162V300 M238 300V96H288V300" />
        <path d="M108 96H166 M234 96H292 M112 160H162 M238 160H288 M108 222H166 M234 222H292" />
        <path d="M118 96V78H156V96 M244 96V78H282V96" />
        <path d="M120 78C120 56 154 56 154 78 M246 78C246 56 280 56 280 78" />
        <path d="M137 60V40 M131 47H143 M263 60V40 M257 47H269" />
        <path d={`${win(130, 112, 14, 30)} ${win(256, 112, 14, 30)} ${win(131, 176, 12, 28)} ${win(257, 176, 12, 28)} ${win(131, 238, 12, 26)} ${win(257, 238, 12, 26)}`} />
        {/* central body and gable with the great bell */}
        <path d="M162 300V128H238V300" />
        <path d="M162 128C170 112 176 104 182 98H218C224 104 230 112 238 128" />
        <path d="M182 98C182 80 190 66 200 58C210 66 218 80 218 98" />
        <path d="M200 58V30 M192 38H208" />
        <path d="M188 120V104A12 12 0 0 1 212 104V120Z" />
        <path d="M193 106C193 100 207 100 207 106L209 114H191Z M200 114v3" />
        <path d="M162 196H238 M162 250H238" />
        <path d={`${win(174, 140, 14, 34)} ${win(212, 140, 14, 34)} M190 150a10 10 0 1 0 20 0a10 10 0 1 0 -20 0`} />
        <path d="M184 300V262A16 16 0 0 1 216 262V300 M200 246V300" />
        <path d="M172 214h12v22h-12z M216 214h12v22h-12z" />
        {/* terrace + balustrade */}
        <path d="M64 300H336 M64 312H336 M64 300V312 M336 300V312" />
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${r1(72 + i * 12.2)} 300v-9`} />)}
        <path d="M68 291H332" />
        {/* criss-cross stairs (the zig-zag flights the church is known for) */}
        <path d="M64 312L18 360H118L64 312 M336 312L382 360H282L336 312" />
        <path d="M118 360L200 312L282 360 M18 360V372H382V360" />
        <path d="M18 372L110 430H290L382 372" />
        <path d={steps(64, 312, 18, 360, 7) + steps(336, 312, 382, 360, 7) + steps(118, 360, 200, 312, 9) + steps(282, 360, 200, 312, 9)} strokeOpacity=".55" />
        <path d={steps(18, 372, 110, 430, 10) + steps(382, 372, 290, 430, 10)} strokeOpacity=".5" />
        {/* palm hints either side */}
        <path d="M30 300C34 260 40 230 52 206 M52 206C40 198 28 200 18 210 M52 206C46 192 36 186 24 186 M52 206C58 192 70 188 82 190 M52 206C62 200 74 204 82 214" strokeOpacity=".6" />
        <path d="M370 300C366 268 360 244 350 224 M350 224C362 216 374 218 384 228 M350 224C356 212 366 206 378 206 M350 224C344 212 334 208 322 210 M350 224C340 218 328 222 320 232" strokeOpacity=".6" />
      </g>
    </svg>
  );
}

/** Bougainvillea sprig — papery magenta bracts in threes, deep leaves. */
export function Bougainvillea({ className = "", style, seed = 3, flip = false }: { className?: string; style?: CSSProperties; seed?: number; flip?: boolean }) {
  const R = rng(seed);
  const u = uidOf(useId());
  const stem = "M10 190 C 50 160, 70 120, 110 100 C 140 86, 160 60, 190 40";
  const nodes: [number, number, number][] = [[40, 165, 0.8], [70, 128, 1], [105, 103, 1.1], [140, 82, 0.9], [168, 58, 1], [188, 40, 0.8], [88, 118, 0.7]];
  const bract = (x: number, y: number, s: number, a: number) => (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      {[0, 120, 240].map((r) => (
        <path key={r} transform={`rotate(${r})`} d="M0 0 C -9 -6 -10 -18 -4 -22 C -1 -24 1 -24 4 -22 C 10 -18 9 -6 0 0Z" fill="#c2306f" fillOpacity={0.55 + R() * 0.35} stroke="#8e1450" strokeWidth=".6" strokeOpacity=".5" />
      ))}
      <circle r="1.8" fill="#f6ecd2" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 200" className={className} style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }} aria-hidden>
      <defs><filter id={`${u}w`}><feTurbulence baseFrequency=".05" numOctaves="2" seed={seed} /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></defs>
      <path d={stem} fill="none" stroke="#5b4a2e" strokeWidth="2" strokeLinecap="round" />
      <g filter={`url(#${u}w)`}>
        {nodes.map(([x, y], i) => (
          <path key={`l${i}`} transform={`translate(${x} ${y}) rotate(${-40 + R() * 80 + (i % 2 ? 160 : 0)})`} d="M0 0 C 6 -6 18 -6 24 0 C 18 6 6 6 0 0Z" fill="#2f5a3a" fillOpacity=".85" />
        ))}
        {nodes.map(([x, y, s], i) => <g key={`b${i}`}>{bract(x + 6, y - 6, s, R() * 360)}</g>)}
        {nodes.slice(0, 4).map(([x, y], i) => <g key={`c${i}`}>{bract(x - 10, y + 6, 0.6, R() * 360 + i)}</g>)}
      </g>
    </svg>
  );
}

/** Circular postmark with wavy cancel lines. */
export function Postmark({ top = "PANJIM · GOA", mid = "", className = "", style }: { top?: string; mid?: string; className?: string; style?: CSSProperties }) {
  const u = uidOf(useId());
  return (
    <svg viewBox="0 0 220 110" className={className} style={style} aria-hidden fill="none" stroke="currentColor">
      <defs><path id={`${u}a`} d="M22 55 A33 33 0 0 1 88 55" /><path id={`${u}b`} d="M18 58 A37 37 0 0 0 92 58" /></defs>
      <circle cx="55" cy="55" r="44" strokeWidth="1.6" /><circle cx="55" cy="55" r="27" strokeWidth=".9" />
      <text fontSize="10" letterSpacing="2.5" fill="currentColor" stroke="none"><textPath href={`#${u}a`} startOffset="50%" textAnchor="middle">{top}</textPath></text>
      <text x="55" y="59" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none" letterSpacing="1">{mid}</text>
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M104 ${31 + i * 12} q14 -7 28 0 t28 0 t28 0 t28 0`} strokeWidth="1.5" />)}
    </svg>
  );
}

/** Perforated postage stamp holding a tile. */
export function Stamp({ className = "", style, value = "₹ 2027" }: { className?: string; style?: CSSProperties; value?: string }) {
  return (
    <div className={`lis-stamp bg-[#fbfcff] p-[7%] ${className}`} style={style}>
      <div className="relative h-full w-full overflow-hidden border border-[color-mix(in_oklab,var(--t-accent)_40%,transparent)]">
        <TileField size={48} className="absolute inset-0 h-full w-full" variant="rosa" />
        <span className="absolute bottom-[3%] right-[5%] bg-[#fbfcff]/85 px-[4%] text-[9px] leading-tight tracking-wider text-[var(--t-accent)]" style={{ fontSize: "max(7px, 0.9em)" }}>{value}</span>
      </div>
    </div>
  );
}

/** Wax seal with initials. `split` renders two halves for the crack animation. */
export function WaxSeal({ initials, className = "", style, split = false }: { initials: string; className?: string; style?: CSSProperties; split?: boolean }) {
  const u = uidOf(useId());
  const body = (
    <>
      <path d="M100 8C126 6 140 20 158 30C178 42 192 60 192 92C194 124 184 150 160 170C140 188 118 194 96 192C68 192 44 182 28 162C10 140 6 118 8 94C8 68 20 46 40 30C58 14 78 8 100 8Z" fill={`url(#${u}g)`} filter={`url(#${u}e)`} />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#0a1840" strokeOpacity=".55" strokeWidth="5" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#9fb6ea" strokeOpacity=".35" strokeWidth="1.2" transform="translate(-1.5 -1.5)" />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={r1(100 + Math.cos(i * 0.2618) * 72)} cy={r1(100 + Math.sin(i * 0.2618) * 72)} r="2.2" fill="#0a1840" fillOpacity=".45" />)}
      <text x="100" y="116" textAnchor="middle" fontSize={initials.length > 3 ? 40 : 52} fill="#0b1c4a" style={{ fontFamily: "var(--wa-pinyon), var(--wa-vibes), cursive" }}>{initials}</text>
      <text x="99" y="114.5" textAnchor="middle" fontSize={initials.length > 3 ? 40 : 52} fill="#8ea8e0" fillOpacity=".45" style={{ fontFamily: "var(--wa-pinyon), var(--wa-vibes), cursive" }}>{initials}</text>
      <ellipse cx="70" cy="56" rx="26" ry="12" fill="#fff" fillOpacity=".18" transform="rotate(-30 70 56)" />
    </>
  );
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`${u}g`} cx=".38" cy=".32" r=".8">
          <stop offset="0" stopColor="#4d72c8" />
          <stop offset=".45" style={{ stopColor: "color-mix(in oklab, var(--t-accent) 85%, #0d2563)" }} />
          <stop offset="1" stopColor="#0a1a48" />
        </radialGradient>
        <filter id={`${u}e`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="d" />
          <feGaussianBlur in="d" stdDeviation="2" result="b" />
          <feSpecularLighting in="b" surfaceScale="4" specularConstant=".7" specularExponent="18" lightingColor="#cfdcff" result="s"><feDistantLight azimuth="235" elevation="48" /></feSpecularLighting>
          <feComposite in="s" in2="d" operator="in" result="s2" />
          <feMerge><feMergeNode in="d" /><feMergeNode in="s2" /></feMerge>
        </filter>
        <clipPath id={`${u}l`}><path d="M0 0H104L92 40L110 70L90 104L108 136L94 170L102 200H0Z" /></clipPath>
        <clipPath id={`${u}r`}><path d="M200 0H104L92 40L110 70L90 104L108 136L94 170L102 200H200Z" /></clipPath>
      </defs>
      {split ? (
        <>
          <g data-seal-l clipPath={`url(#${u}l)`}>{body}</g>
          <g data-seal-r clipPath={`url(#${u}r)`}>{body}</g>
        </>
      ) : body}
    </svg>
  );
}

/** Small cross-and-heart flourish for headings. */
export function Flourish({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 160 30" className={className} style={style} aria-hidden fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <path d="M4 15C30 15 40 6 56 10C66 13 64 22 58 22C52 22 52 14 60 13C68 12 72 15 80 15C88 15 92 12 100 13C108 14 108 22 102 22C96 22 94 13 104 10C120 6 130 15 156 15" />
      <path d="M80 4V26M74 10H86" strokeWidth="1.2" />
    </svg>
  );
}
