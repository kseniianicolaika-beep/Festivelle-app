import { useId, type CSSProperties } from "react";
import { Bloom, Branch, Bud, Filler, Leaf, Paint, petal, type Pal } from "../_shared/botanic";
import { r2, rng } from "../_shared/kit";

export const ROSE: Pal = { light: "#FBE6DF", mid: "#E9A5A8", deep: "#A64459", leaf: "#B4C1A2", leafDeep: "#5E7457" };
const BLUSH: Pal = { light: "#FFF3EC", mid: "#F2C7BF", deep: "#C77F84", leaf: "#B4C1A2", leafDeep: "#6C805F" };

/** Watercolour roses spilling from a corner (origin top-left of a 400×400 box). */
export function RoseCorner({ className, style, seed = 1 }: { className?: string; style?: CSSProperties; seed?: number }) {
  return (
    <Paint pal={ROSE} viewBox="0 0 400 400" className={className} style={style}>
      {(id) => (
        <g className="ll-paint">
          <Branch id={id} x={150} y={120} len={250} rot={62} n={13} pal={ROSE} round seed={seed + 2} />
          <Branch id={id} x={110} y={150} len={230} rot={152} n={12} pal={ROSE} round seed={seed + 4} />
          <Leaf id={id} x={150} y={95} l={90} rot={78} pal={ROSE} />
          <Leaf id={id} x={120} y={150} l={86} rot={160} pal={ROSE} />
          <Leaf id={id} x={175} y={140} l={70} rot={120} pal={ROSE} op={0.65} />
          <Leaf id={id} x={70} y={160} l={74} rot={200} pal={ROSE} op={0.7} />
          <Bud id={id} x={238} y={70} s={40} rot={70} pal={ROSE} />
          <Bud id={id} x={58} y={250} s={38} rot={196} pal={ROSE} />
          <Bloom id={id} x={196} y={64} r={42} seed={seed + 11} rot={20} pal={BLUSH} />
          <Bloom id={id} x={62} y={188} r={40} seed={seed + 12} rot={-30} pal={BLUSH} />
          <Bloom id={id} x={96} y={92} r={70} seed={seed + 13} pal={ROSE} ruffle />
          <Filler x={260} y={120} s={26} seed={seed + 5} color="#E9DCCB" />
          <Filler x={120} y={262} s={24} seed={seed + 6} color="#E9DCCB" />
          <Filler x={190} y={170} s={18} seed={seed + 7} color="#D9A3A0" />
        </g>
      )}
    </Paint>
  );
}

/** A small sprig used as a divider / on the letter. */
export function Sprig({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <Paint pal={ROSE} viewBox="0 0 240 120" className={className} style={style}>
      {(id) => (
        <g>
          <Branch id={id} x={120} y={70} len={110} rot={-78} n={8} pal={ROSE} round seed={21} />
          <Branch id={id} x={120} y={70} len={110} rot={78} n={8} pal={ROSE} round seed={22} />
          <Bloom id={id} x={120} y={64} r={24} seed={31} pal={ROSE} />
          <Bud id={id} x={146} y={78} s={16} rot={40} pal={ROSE} />
        </g>
      )}
    </Paint>
  );
}

/** Silk ribbon bow with tails. */
export function Bow({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 220 170" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E7B7B3" /><stop offset=".28" stopColor="#F7DCD6" /><stop offset=".46" stopColor="#D4949A" /><stop offset=".7" stopColor="#F2CEC8" /><stop offset="1" stopColor="#B9727D" />
        </linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D79CA0" /><stop offset=".5" stopColor="#F4D3CD" /><stop offset="1" stopColor="#C27E87" /></linearGradient>
        <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#5a2a2a" floodOpacity=".22" /></filter>
      </defs>
      <g filter={`url(#${id}sh)`}>
        <path d="M108 74C96 104 82 132 58 166L80 160L88 168C104 136 114 106 116 78Z" fill={`url(#${id}t)`} />
        <path d="M112 74C126 102 142 128 170 158L148 156L144 166C126 138 112 108 104 80Z" fill={`url(#${id}t)`} />
        <path d="M110 70C86 34 34 14 18 44C4 72 44 96 108 78Z" fill={`url(#${id}s)`} />
        <path d="M110 70C134 30 188 12 204 42C218 70 178 96 112 78Z" fill={`url(#${id}s)`} />
        <path d="M104 72C80 52 50 40 34 48M116 72C140 50 172 38 188 46" stroke="#A65F6B" strokeOpacity=".35" strokeWidth="1.4" fill="none" />
        <path d="M30 58C50 74 80 78 104 76M190 56C170 74 140 78 116 76" stroke="#fff" strokeOpacity=".4" strokeWidth="1.2" fill="none" />
        <rect x="97" y="62" width="26" height="24" rx="9" fill={`url(#${id}t)`} />
        <path d="M101 68C108 66 114 66 119 68" stroke="#fff" strokeOpacity=".55" strokeWidth="1.4" fill="none" />
      </g>
    </svg>
  );
}

/** A straight band of silk (use with a CSS width/height). */
export const silk = "linear-gradient(90deg,#C88890 0%,#F3D2CC 22%,#DFA9AA 40%,#F7DFDA 58%,#D59AA0 78%,#B77580 100%)";

/** Burgundy wax seal with an embossed initial. */
export function WaxSeal({ letter, className, style }: { letter: string; className?: string; style?: CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const R = rng(9);
  const pts = Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2;
    const r = 46 + (R() - 0.5) * 6 + (i % 7 === 0 ? 3 : 0);
    return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
  });
  const d = pts.map((p, i) => { const n = pts[(i + 1) % pts.length]; return `${i ? "" : `M${r2((p[0] + n[0]) / 2)} ${r2((p[1] + n[1]) / 2)}`}Q${r2(n[0])} ${r2(n[1])} ${r2((n[0] + pts[(i + 2) % pts.length][0]) / 2)} ${r2((n[1] + pts[(i + 2) % pts.length][1]) / 2)}`; }).join("") + "Z";
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}w`} cx=".38" cy=".32" r=".75"><stop offset="0" stopColor="#C4475A" /><stop offset=".55" stopColor="#8E2034" /><stop offset="1" stopColor="#5C0F1E" /></radialGradient>
        <filter id={`${id}e`}><feDropShadow dx="0" dy="2.5" stdDeviation="2.4" floodColor="#3a0a12" floodOpacity=".45" /></filter>
      </defs>
      <path d={d} fill={`url(#${id}w)`} filter={`url(#${id}e)`} />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#4E0B18" strokeOpacity=".55" strokeWidth="2.4" />
      <circle cx="49.4" cy="49.2" r="33" fill="none" stroke="#E07F8C" strokeOpacity=".45" strokeWidth="1" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={petal(6, 2.4)} transform={`rotate(${i * 22.5} 50 50) translate(50 22)`} fill="#5C0F1E" opacity=".35" />
      ))}
      <text x="51" y="64" textAnchor="middle" fontSize="40" fill="#4A0A16" fillOpacity=".7" style={{ fontFamily: "var(--gf-vibes), var(--font-script), cursive" }}>{letter}</text>
      <text x="50" y="62.8" textAnchor="middle" fontSize="40" fill="#E58A96" fillOpacity=".55" style={{ fontFamily: "var(--gf-vibes), var(--font-script), cursive" }}>{letter}</text>
      <ellipse cx="36" cy="30" rx="12" ry="6" fill="#fff" opacity=".16" transform="rotate(-30 36 30)" />
    </svg>
  );
}

/** Deckled (torn cotton) edge as a clip-path polygon. */
export function deckle(seed: number, steps = 48, amp = 0.7) {
  const R = rng(seed);
  const j = () => r2(R() * amp);
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) pts.push(`${r2((i / steps) * 100)}% ${j()}%`);
  for (let i = 0; i <= steps; i++) pts.push(`${r2(100 - j())}% ${r2((i / steps) * 100)}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${r2((i / steps) * 100)}% ${r2(100 - j())}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${j()}% ${r2((i / steps) * 100)}%`);
  return `polygon(${pts.join(",")})`;
}

/** Loose petals scattered on the linen. */
export function Petals({ className, style, seed = 4, n = 9 }: { className?: string; style?: CSSProperties; seed?: number; n?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const R = rng(seed);
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#B85466" /><stop offset="1" stopColor="#F4C9C4" /></linearGradient>
        <filter id={`${id}f`}><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale="6" /><feDropShadow dx="2" dy="5" stdDeviation="4" floodOpacity=".18" /></filter>
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const edge = i % 4;
        const t = R();
        const x = edge === 0 ? 40 + R() * 180 : edge === 1 ? 780 + R() * 180 : 80 + t * 840;
        const y = edge === 2 ? 30 + R() * 140 : edge === 3 ? 830 + R() * 140 : 120 + R() * 760;
        return <path key={i} d={petal(30 + R() * 18, 22 + R() * 10)} transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(R() * 360)})`} fill={`url(#${id}g)`} opacity={0.7 + R() * 0.25} filter={`url(#${id}f)`} />;
      })}
    </svg>
  );
}
