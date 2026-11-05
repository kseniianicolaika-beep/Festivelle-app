"use client";
import { useId, type CSSProperties } from "react";
import { r1, rng } from "../_shared/data";

// Ashwem Dusk — golden hour on a North Goa beach. Everything here is procedural SVG: coconut palms grown
// leaflet by leaflet, a sun-path on the Arabian Sea, Chapora fort on the headland, a rampon fishing canoe.

type P = [number, number];
type PalmSpec = { seed: number; base: P; top: P; bend: number; s: number; fronds?: number };

function palm({ seed, base, top, bend, s, fronds = 12 }: PalmSpec) {
  const R = rng(seed);
  const [bx, by] = base, [tx, ty] = top;
  const cx = (bx + tx) / 2 + bend, cy = (by + ty) / 2;
  const pt = (t: number): P => [(1 - t) * (1 - t) * bx + 2 * (1 - t) * t * cx + t * t * tx, (1 - t) * (1 - t) * by + 2 * (1 - t) * t * cy + t * t * ty];
  const N = 28, L: P[] = [], Rr: P[] = [];
  let rings = "";
  for (let i = 0; i <= N; i++) {
    const t = i / N, [x, y] = pt(t), [x2, y2] = pt(Math.min(1, t + 0.01));
    let nx = -(y2 - y), ny = x2 - x;
    const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
    const w = (1 - t) * 15 * s + 7 * s + (t < 0.08 ? (0.08 - t) * 120 * s : 0);
    L.push([x + nx * w, y + ny * w]); Rr.push([x - nx * w, y - ny * w]);
    if (i % 2 === 0 && i > 1 && i < N) rings += `M${r1(x + nx * w * 0.9)} ${r1(y + ny * w * 0.9)}Q${r1(x + ny * 3)} ${r1(y - nx * 3 + 3)} ${r1(x - nx * w * 0.9)} ${r1(y - ny * w * 0.9)}`;
  }
  const trunk = `M${L.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L")}L${Rr.reverse().map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L")}Z`;
  let leaves = "", rach = "";
  const nuts: P[] = [];
  for (let f = 0; f < fronds; f++) {
    const spread = (f / (fronds - 1) - 0.5) * 2; // -1..1
    const ang = -Math.PI / 2 + Math.sign(spread || 1) * (0.3 + Math.abs(spread) * 2.05) + (R() - 0.5) * 0.25;
    const len = (150 + R() * 70) * s * (1 - Math.abs(spread) * 0.12);
    const dx = Math.cos(ang), dy = Math.sin(ang);
    const grav = (0.45 + Math.abs(spread) * 0.5) * len;
    const p = (t: number): P => [tx + dx * len * t, ty + dy * len * t + grav * t * t];
    const e = p(1), c = p(0.5);
    rach += `M${r1(tx)} ${r1(ty)}Q${r1(2 * c[0] - (tx + e[0]) / 2)} ${r1(2 * c[1] - (ty + e[1]) / 2)} ${r1(e[0])} ${r1(e[1])}`;
    const n = 30;
    for (let k = 2; k <= n; k++) {
      const t = k / n, [x, y] = p(t), [x2, y2] = p(Math.min(1, t + 0.02));
      let ux = x2 - x, uy = y2 - y; const um = Math.hypot(ux, uy) || 1; ux /= um; uy /= um;
      const ll = len * 0.34 * Math.pow(Math.sin(Math.PI * (0.12 + t * 0.82)), 0.7) * (0.85 + R() * 0.3);
      for (const sd of [-1, 1]) {
        const a = sd * (0.95 + R() * 0.25);
        let lx = ux * Math.cos(a) - uy * Math.sin(a), ly = ux * Math.sin(a) + uy * Math.cos(a);
        ly += 1.05; const lm = Math.hypot(lx, ly); lx /= lm; ly /= lm;
        const ex = x + lx * ll, ey = y + ly * ll;
        leaves += `M${r1(x)} ${r1(y)}Q${r1(x + lx * ll * 0.5 + ux * 4)} ${r1(y + ly * ll * 0.35)} ${r1(ex)} ${r1(ey)}`;
      }
    }
  }
  for (let i = 0; i < 5; i++) nuts.push([tx + (R() - 0.5) * 26 * s, ty + 10 * s + R() * 16 * s]);
  return { trunk, rings, leaves, rach, nuts, top };
}

function Palm({ spec, color, id, sway = true }: { spec: PalmSpec; color: string; id: string; sway?: boolean }) {
  const p = palm(spec);
  const crown: CSSProperties = sway ? { transformOrigin: `${p.top[0]}px ${p.top[1]}px`, transformBox: "view-box", animation: `wa-sway ${7 + (spec.seed % 4)}s ease-in-out ${-(spec.seed % 5)}s infinite` } : {};
  return (
    <g data-palm={id}>
      <path d={p.trunk} fill={color} />
      <path d={p.rings} fill="none" stroke="#000" strokeOpacity=".25" strokeWidth={1.4 * spec.s} />
      <g style={crown}>
        <path d={p.rach} fill="none" stroke={color} strokeWidth={3.6 * spec.s} strokeLinecap="round" />
        <path d={p.leaves} fill="none" stroke={color} strokeWidth={2.7 * spec.s} strokeLinecap="round" />
        {p.nuts.map(([x, y], i) => <circle key={i} cx={r1(x)} cy={r1(y)} r={r1(7.5 * spec.s)} fill={color} />)}
      </g>
    </g>
  );
}

const LAYOUTS = {
  wide: { w: 1600, h: 1000, hz: 640, sun: [800, 560, 92] as const, palms: [
    { seed: 11, base: [180, 1040], top: [360, 330], bend: -90, s: 1.25 },
    { seed: 23, base: [40, 1040], top: [150, 500], bend: -40, s: 0.95, fronds: 11 },
    { seed: 37, base: [1520, 1040], top: [1330, 400], bend: 80, s: 1.18 },
    { seed: 41, base: [1640, 1040], top: [1560, 560], bend: 30, s: 0.85, fronds: 10 },
  ] as PalmSpec[] },
  tall: { w: 900, h: 1600, hz: 1060, sun: [450, 975, 78] as const, palms: [
    { seed: 11, base: [60, 1660], top: [190, 820], bend: -80, s: 1.05 },
    { seed: 37, base: [880, 1660], top: [760, 900], bend: 70, s: 0.95 },
  ] as PalmSpec[] },
  square: { w: 1000, h: 1000, hz: 720, sun: [500, 660, 70] as const, palms: [
    { seed: 11, base: [80, 1040], top: [190, 380], bend: -70, s: 0.95 },
    { seed: 37, base: [960, 1040], top: [840, 430], bend: 60, s: 0.88 },
  ] as PalmSpec[] },
  portrait: { w: 1000, h: 1400, hz: 1010, sun: [500, 950, 70] as const, palms: [
    { seed: 11, base: [60, 1460], top: [190, 700], bend: -80, s: 1.05 },
    { seed: 37, base: [950, 1460], top: [830, 780], bend: 70, s: 0.95 },
  ] as PalmSpec[] },
  card: { w: 1000, h: 640, hz: 450, sun: [500, 395, 64] as const, palms: [
    { seed: 11, base: [70, 700], top: [170, 230], bend: -60, s: 0.8 },
    { seed: 37, base: [950, 700], top: [850, 270], bend: 50, s: 0.74 },
  ] as PalmSpec[] },
} as const;
export type SceneLayout = keyof typeof LAYOUTS;

/** The painted golden-hour scene. `dusk` 0..1 deepens the sky toward night (stars appear). */
export function Scene({ layout = "wide", className = "", stars = false, palms = true, still = false, style }: { layout?: SceneLayout; className?: string; stars?: boolean; palms?: boolean; still?: boolean; style?: CSSProperties }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { w, h, hz, sun, palms: P } = LAYOUTS[layout];
  const [sx, sy, sr] = sun;
  const R = rng(7);
  const id = (n: string) => `${uid}${n}`;
  const u = (n: string) => `url(#${id(n)})`;
  const glints = Array.from({ length: 46 }, (_, i) => {
    const t = i / 45, y = hz + 5 + t * t * (h - hz) * 0.8;
    const ww = (sr * 0.5 + t * sr * 1.9) * (0.3 + R() * 0.9);
    return { y: r1(y), x: r1(sx - ww / 2 + (R() - 0.5) * (20 + t * 60)), w: r1(ww), o: r1((0.95 - t * 0.55) * (0.5 + R() * 0.5)), d: r1(R() * 3), th: r1(1 + t * 3.2 * (0.5 + R())) };
  });
  const starPts = stars ? Array.from({ length: 70 }, () => ({ x: r1(R() * w), y: r1(R() * hz * 0.55), r: r1(0.6 + R() * 1.6), d: r1(R() * 4) })) : [];
  const ink = "#1a0f1f";
  const anim = (a: string): CSSProperties => (still ? {} : { animation: a });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMax slice" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1736" />
          <stop offset=".24" stopColor="#47295a" />
          <stop offset=".46" stopColor="#97425f" />
          <stop offset=".66" style={{ stopColor: "color-mix(in oklab, var(--t-accent) 70%, #e9774c)" }} />
          <stop offset=".84" stopColor="#f3a457" />
          <stop offset="1" stopColor="#ffd690" />
        </linearGradient>
        <linearGradient id={id("sea")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d77a5c" />
          <stop offset=".18" stopColor="#9a4a5c" />
          <stop offset=".55" stopColor="#4c2a4c" />
          <stop offset="1" stopColor="#211631" />
        </linearGradient>
        <radialGradient id={id("sun")}>
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset=".55" stopColor="#ffe6a3" />
          <stop offset="1" style={{ stopColor: "color-mix(in oklab, var(--t-gold) 80%, #ffb347)" }} />
        </radialGradient>
        <radialGradient id={id("glow")}>
          <stop offset="0" stopColor="#ffe2a0" stopOpacity=".95" />
          <stop offset=".25" stopColor="#ffb86b" stopOpacity=".5" />
          <stop offset="1" stopColor="#ff9a5a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("cloud")} x1="0" x2="1">
          <stop offset="0" stopColor="#ffc59a" stopOpacity="0" />
          <stop offset=".5" stopColor="#ffc9a0" stopOpacity=".75" />
          <stop offset="1" stopColor="#f08f8a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("col")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf8a" stopOpacity=".55" />
          <stop offset="1" stopColor="#ff9a6a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("sand")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2a3a" />
          <stop offset="1" stopColor="#1c1222" />
        </linearGradient>
        <filter id={id("blur")} x="-20%" y="-80%" width="140%" height="260%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id={id("gl")} x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="1.2" /></filter>
        <filter id={id("wc")} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".012 .05" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="8" />
        </filter>
        <clipPath id={id("above")}><rect x="0" y="0" width={w} height={hz} /></clipPath>
      </defs>

      <rect width={w} height={h} fill={u("sky")} />
      {starPts.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff6e0" style={anim(`wa-twinkle ${3 + s.d}s ease-in-out ${-s.d}s infinite`)} />)}
      {/* soft lit cloud banks + thin bright streaks */}
      <g filter={u("blur")} opacity=".9">
        {[[0.2, 0.36, 0.34, 26], [0.7, 0.3, 0.3, 20], [0.45, 0.5, 0.42, 30], [0.86, 0.55, 0.24, 18], [0.1, 0.62, 0.26, 16]].map(([x, y, rx, ry], i) => (
          <ellipse key={i} cx={x * w} cy={y * hz} rx={rx * w} ry={ry * (h / 1000)} fill={u("cloud")} opacity={0.55} />
        ))}
      </g>
      <g filter={u("gl")} opacity=".3">
        {[[0.24, 0.37, 0.22, 3], [0.66, 0.31, 0.2, 2.5], [0.5, 0.52, 0.3, 3.5], [0.14, 0.6, 0.16, 2]].map(([x, y, rx, ry], i) => (
          <ellipse key={i} cx={x * w} cy={y * hz + 8} rx={rx * w} ry={ry * (h / 1000)} fill="#ffd3a4" />
        ))}
      </g>
      {/* the sun & its halo */}
      <g data-sun clipPath={u("above")}>
        <circle cx={sx} cy={sy} r={sr * 5.2} fill={u("glow")} data-glow />
        <circle cx={sx} cy={sy} r={sr} fill={u("sun")} />
      </g>
      {/* headland with Chapora fort */}
      <path d={`M0 ${hz} L0 ${hz - 46} C${w * 0.05} ${hz - 52} ${w * 0.08} ${hz - 70} ${w * 0.12} ${hz - 66} L${w * 0.12} ${hz - 74} L${w * 0.125} ${hz - 74} L${w * 0.125} ${hz - 70} L${w * 0.14} ${hz - 70} L${w * 0.14} ${hz - 78} L${w * 0.146} ${hz - 78} L${w * 0.146} ${hz - 70} L${w * 0.165} ${hz - 70} L${w * 0.165} ${hz - 74} L${w * 0.17} ${hz - 74} L${w * 0.17} ${hz - 64} C${w * 0.2} ${hz - 54} ${w * 0.24} ${hz - 30} ${w * 0.3} ${hz - 10} C${w * 0.32} ${hz - 4} ${w * 0.34} ${hz} ${w * 0.36} ${hz} Z`} fill="#3a2142" opacity=".9" />
      <path d={`M${w * 0.7} ${hz} C${w * 0.78} ${hz - 16} ${w * 0.88} ${hz - 26} ${w} ${hz - 22} L${w} ${hz} Z`} fill="#5a2f50" opacity=".55" />
      {/* the sea */}
      <rect y={hz} width={w} height={h - hz} fill={u("sea")} />
      <rect y={hz - 1} width={w} height="2.5" fill="#ffd9a0" opacity=".7" />
      <g data-sea>
        <ellipse cx={sx} cy={hz + (h - hz) * 0.35} rx={sr * 1.5} ry={(h - hz) * 0.42} fill={u("col")} filter={u("blur")} />
        <g filter={u("gl")}>{glints.map((g, i) => (
          <rect key={i} x={g.x} y={g.y} width={g.w} height={g.th} rx={g.th / 2} fill="#ffe1a6" opacity={g.o} style={{ transformOrigin: `${sx}px ${g.y}px`, transformBox: "view-box", ...anim(`wa-glint ${2.4 + g.d}s ease-in-out ${-g.d}s infinite`) }} />
        ))}</g>
        {Array.from({ length: 9 }, (_, i) => {
          const y = hz + 30 + i * i * ((h - hz) / 110);
          return <path key={i} d={`M${w * 0.04 + i * 9} ${r1(y)} q${w * 0.1} -5 ${w * 0.2} 0 M${w * 0.62 - i * 7} ${r1(y + 8)} q${w * 0.12} -5 ${w * 0.26} 0`} stroke="#ffd2b0" strokeOpacity={0.1 + i * 0.01} strokeWidth="1.4" fill="none" />;
        })}
      </g>
      {/* rampon canoe with outrigger */}
      <g data-boat transform={`translate(${r1(w * 0.68)} ${hz + 18}) scale(${r1(w / 1600)})`} style={anim("wa-bob 5s ease-in-out infinite")}>
        <path d="M-58 0 Q-40 12 0 12 Q40 12 62 -2 L54 -4 Q20 4 -50 -3Z" fill={ink} />
        <path d="M-6 -4 L-4 -70 M-4 -66 L22 -10 M-4 -62 L-28 -8" stroke={ink} strokeWidth="2.4" fill="none" />
        <path d="M-40 6 L-40 18 M30 6 L30 18 M-48 18 L44 18" stroke={ink} strokeWidth="2" fill="none" />
        <circle cx="-22" cy="-8" r="5" fill={ink} /><path d="M-26 -4 L-18 -4 L-20 6 L-24 6Z" fill={ink} />
      </g>
      {/* birds */}
      <g data-birds fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" opacity=".8">
        {[[0.6, 0.28, 1], [0.64, 0.25, 0.8], [0.57, 0.24, 0.7], [0.67, 0.31, 0.6], [0.3, 0.2, 0.7]].map(([x, y, s], i) => (
          <path key={i} d={`M${r1(x * w - 14 * s)} ${r1(y * hz)} q${7 * s} ${-8 * s} ${14 * s} 0 q${7 * s} ${-8 * s} ${14 * s} 0`} />
        ))}
      </g>
      {/* foreground shore + foam */}
      <path d={`M0 ${h - (h - hz) * 0.22} C${w * 0.3} ${h - (h - hz) * 0.3} ${w * 0.62} ${h - (h - hz) * 0.16} ${w} ${h - (h - hz) * 0.27} L${w} ${h} L0 ${h}Z`} fill={u("sand")} />
      <path d={`M0 ${h - (h - hz) * 0.22} C${w * 0.3} ${h - (h - hz) * 0.3} ${w * 0.62} ${h - (h - hz) * 0.16} ${w} ${h - (h - hz) * 0.27}`} fill="none" stroke="#ffe3c4" strokeOpacity=".55" strokeWidth="2.5" strokeDasharray="60 18 140 30 40 12" style={anim("wa-foam 9s linear infinite")} />
      {palms && <g opacity=".97">{P.map((p) => <Palm key={p.seed} spec={p} color={ink} id={String(p.seed)} sway={!still} />)}</g>}
      <style>{`@keyframes wa-foam { to { stroke-dashoffset: -300; } }`}</style>
    </svg>
  );
}

/** A small sun-on-the-horizon emblem for headers and dividers. */
export function SunMark({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M30 44a30 30 0 0 1 60 0" />
      {Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI; return <path key={i} d={`M${r1(60 + Math.cos(a) * 36)} ${r1(44 + Math.sin(a) * 36)}L${r1(60 + Math.cos(a) * 44)} ${r1(44 + Math.sin(a) * 44)}`} />; })}
      <path d="M4 44h112M20 50h80M38 56h44" />
    </svg>
  );
}

/** North Goa coastline, hand-drawn: Arambol → Mandrem → Ashwem → Morjim → Chapora → Vagator. */
export function CoastMap({ className = "", pin = "Ashwem" }: { className?: string; pin?: string }) {
  const coast = "M210 20 C 205 60, 190 90, 196 130 C 200 160, 214 180, 210 214 C 206 246, 224 270, 232 300 C 240 330, 236 356, 250 384 C 262 410, 292 418, 300 440 C 306 458, 290 470, 296 492 C 302 520, 330 540, 338 580";
  const places: [string, number, number][] = [["Arambol", 196, 60], ["Mandrem", 208, 190], ["Ashwem", 228, 290], ["Morjim", 250, 380], ["Chapora", 300, 455], ["Vagator", 318, 540]];
  return (
    <svg viewBox="0 0 480 600" className={className} aria-hidden>
      <defs>
        <pattern id="wa-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0v8" stroke="currentColor" strokeOpacity=".16" strokeWidth="1" /></pattern>
      </defs>
      <path d={`${coast} L0 600 L0 0 L210 0Z`} fill="url(#wa-hatch)" />
      <path d={coast} fill="none" stroke="currentColor" strokeWidth="1.6" className="wa-coast" />
      <path d="M296 470 C 340 462, 380 470, 430 452 C 452 444, 470 446, 480 440" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" opacity=".7" />
      <text x="400" y="438" fontSize="11" fill="currentColor" opacity=".6" fontStyle="italic">Chapora river</text>
      <text x="60" y="330" fontSize="13" fill="currentColor" opacity=".55" letterSpacing="4" transform="rotate(-80 60 330)">ARABIAN SEA</text>
      {places.map(([n, x, y]) => {
        const on = pin.toLowerCase().includes(n.toLowerCase());
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={on ? 5 : 2.5} fill="currentColor" />
            {on && <circle cx={x} cy={y} r="14" fill="none" stroke="var(--t-accent)" strokeWidth="1.5" className="wa-ping" />}
            <text x={x + 16} y={y + 4} fontSize={on ? 17 : 12} fill={on ? "var(--t-accent)" : "currentColor"} opacity={on ? 1 : 0.7} letterSpacing="2">{n.toUpperCase()}</text>
          </g>
        );
      })}
      <g transform="translate(420 90)" stroke="currentColor" fill="none" strokeWidth="1">
        <circle r="26" opacity=".5" /><path d="M0 -36 L5 0 L0 36 L-5 0Z" fill="currentColor" fillOpacity=".2" /><path d="M-36 0 L0 4 L36 0 L0 -4Z" />
        <text y="-42" fontSize="11" textAnchor="middle" fill="currentColor" stroke="none">N</text>
      </g>
    </svg>
  );
}
