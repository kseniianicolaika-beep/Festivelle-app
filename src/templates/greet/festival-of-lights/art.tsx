import { useId, type CSSProperties } from "react";
import { petal, leaf } from "../_shared/botanic";
import { r2, rng } from "../_shared/kit";

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
export const MARIGOLD = ["#F7B733", "#F39C34", "#E8762A", "#FFD066"];

/** A hand-thrown clay diya with a living flame. `lit` false = an unlit wick. */
export function Diya({ className, style, lit = true, seed = 1 }: { className?: string; style?: CSSProperties; lit?: boolean; seed?: number }) {
  const id = useUid();
  const R = rng(seed);
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D9733A" /><stop offset=".5" stopColor="#A9442A" /><stop offset="1" stopColor="#5E1E16" /></linearGradient>
        <radialGradient id={`${id}f`} cx=".5" cy=".75" r=".65"><stop offset="0" stopColor="#FFFDF0" /><stop offset=".3" stopColor="#FFE38A" /><stop offset=".7" stopColor="#FF9A2E" /><stop offset="1" stopColor="#E2481E" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}g`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#FFC766" stopOpacity=".75" /><stop offset=".45" stopColor="#FF9A3A" stopOpacity=".22" /><stop offset="1" stopColor="#FF8A2A" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}o`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE7A0" /><stop offset="1" stopColor="#C77A24" /></linearGradient>
      </defs>
      {lit && <circle className="fl-glow" cx="60" cy="52" r="58" fill={`url(#${id}g)`} />}
      <ellipse cx="60" cy="104" rx="38" ry="5" fill="#000" opacity=".35" />
      <path d="M14 74C18 96 40 104 60 104S102 96 106 74C108 70 98 68 60 68S12 70 14 74Z" fill={`url(#${id}c)`} />
      <path d="M96 72C104 64 112 62 116 60C112 68 108 76 102 80Z" fill="#B24E2C" />
      <ellipse cx="60" cy="72" rx="46" ry="7.5" fill="#6A2414" />
      <ellipse cx="60" cy="72" rx="40" ry="5.5" fill={`url(#${id}o)`} opacity=".9" />
      <path d="M22 84C40 92 80 92 98 84" fill="none" stroke="#F7C266" strokeWidth="1.6" strokeDasharray="1 5" strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={petal(7, 3.6)} transform={`translate(${32 + i * 14} 94) rotate(${180 + (R() - 0.5) * 10})`} fill="#F2E3C2" opacity=".75" />)}
      <path d="M104 66L110 63" stroke="#3a1a0e" strokeWidth="2.4" strokeLinecap="round" />
      {lit && <path className="fl-flame" d="M110 30C118 44 120 54 110 62C100 54 102 44 110 30Z" fill={`url(#${id}f)`} />}
      {lit && <path className="fl-flame" d="M110 44C113 50 113 56 110 59C107 56 107 50 110 44Z" fill="#fff" opacity=".85" />}
    </svg>
  );
}

const ring = (n: number, r: number, el: (a: number, i: number) => React.ReactNode) => Array.from({ length: n }, (_, i) => el((i * 360) / n, i));

/** A chalk-and-powder rangoli. Lines (for drawing) live in .fl-rl, colour fields in .fl-rc. */
export function Rangoli({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  const C = { pink: "#E23D7B", mari: "#F7A928", teal: "#1FA6A0", white: "#FBF1DE", red: "#C8282E", violet: "#7B3FB2" };
  return (
    <svg viewBox="-200 -200 400 400" className={className} style={style} aria-hidden>
      <defs>
        <filter id={`${id}p`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" result="d" />
          <feComposite in="d" in2="n" operator="in" />
        </filter>
      </defs>
      <g className="fl-rc" filter={`url(#${id}p)`}>
        {ring(16, 0, (a, i) => <path key={"o" + i} d={petal(196, 52)} transform={`rotate(${a + 11.25})`} fill={i % 2 ? C.violet : C.pink} opacity=".9" />)}
        <circle r="150" fill="#2a1238" />
        {ring(16, 0, (a, i) => <path key={"m" + i} d={petal(150, 34)} transform={`rotate(${a})`} fill={i % 2 ? C.mari : C.red} />)}
        <circle r="104" fill={C.white} />
        <circle r="98" fill="#2a1238" />
        {ring(8, 0, (a, i) => <path key={"l" + i} d={petal(96, 40)} transform={`rotate(${a + 22.5})`} fill={C.teal} />)}
        {ring(8, 0, (a, i) => <path key={"k" + i} d={petal(86, 32)} transform={`rotate(${a})`} fill={C.mari} />)}
        <circle r="44" fill={C.pink} />
        {ring(8, 0, (a, i) => <path key={"c" + i} d={petal(40, 16)} transform={`rotate(${a + 22.5})`} fill={C.white} />)}
        <circle r="13" fill={C.mari} />
        {ring(32, 0, (a, i) => <circle key={"d" + i} cx={r2(Math.cos((a * Math.PI) / 180) * 124)} cy={r2(Math.sin((a * Math.PI) / 180) * 124)} r="3.4" fill={C.white} />)}
      </g>
      <g className="fl-rl" fill="none" stroke="#FFF4DC" strokeWidth="1.3" strokeLinecap="round" opacity=".85">
        <circle r="150" /><circle r="104" /><circle r="44" />
        {ring(8, 0, (a, i) => <path key={"x" + i} d={petal(96, 40)} transform={`rotate(${a + 22.5})`} />)}
        {ring(16, 0, (a, i) => <path key={"y" + i} d={petal(196, 52)} transform={`rotate(${a + 11.25})`} />)}
      </g>
    </svg>
  );
}

/** Marigold toran: swags of marigold with mango leaves and little bells, across the top. */
export function Toran({ className, style, swags = 4, seed = 2 }: { className?: string; style?: CSSProperties; swags?: number; seed?: number }) {
  const id = useUid();
  const R = rng(seed);
  const W = 1000;
  const sw = W / swags;
  const balls: React.ReactNode[] = [];
  const leaves: React.ReactNode[] = [];
  for (let s = 0; s < swags; s++) {
    const x0 = s * sw;
    for (let k = 0; k <= 14; k++) {
      const t = k / 14;
      const x = x0 + t * sw;
      const y = 14 + Math.sin(t * Math.PI) * 70;
      const r = 13 + R() * 3;
      balls.push(
        <g key={`b${s}-${k}`} transform={`translate(${r2(x)} ${r2(y)})`}>
          <circle r={r} fill={MARIGOLD[(k + s) % 4]} />
          {Array.from({ length: 9 }, (_, j) => <circle key={j} cx={r2(Math.cos(j * 0.7) * r * 0.62)} cy={r2(Math.sin(j * 0.7) * r * 0.62)} r={r * 0.42} fill={MARIGOLD[(j + k) % 4]} opacity=".9" />)}
          <circle r={r * 0.35} fill="#C85A12" opacity=".6" />
        </g>,
      );
    }
    const lx = x0 + sw / 2;
    leaves.push(
      <g key={`l${s}`} transform={`translate(${r2(lx)} 84)`}>
        <path d="M0 0V40" stroke="#D8A440" strokeWidth="1.4" />
        <path d={`M-9 40h18l-3 12h-12z`} fill={`url(#${id}b)`} />
        <circle cy="54" r="3" fill="#B98A2E" />
      </g>,
    );
  }
  for (let k = 0; k <= swags; k++) {
    const x = k * sw;
    leaves.push(
      <g key={`m${k}`} transform={`translate(${r2(x)} 16)`}>
        {[-24, 0, 24].map((a) => <path key={a} d={leaf(54, 14)} transform={`rotate(${180 + a})`} fill={a ? "#2F7A3A" : "#3E9246"} stroke="#1E5228" strokeWidth=".8" />)}
      </g>,
    );
  }
  return (
    <svg viewBox="0 -10 1000 150" className={className} style={style} aria-hidden preserveAspectRatio="xMidYMin meet">
      <defs><linearGradient id={`${id}b`} x1="0" x2="1"><stop offset="0" stopColor="#9C6B1E" /><stop offset=".5" stopColor="#F6D27A" /><stop offset="1" stopColor="#9C6B1E" /></linearGradient></defs>
      <path d="M0 4H1000" stroke="#C99A3A" strokeWidth="3" />
      {leaves.slice(0, swags)}
      {balls}
      {leaves.slice(swags)}
    </svg>
  );
}

/** Cusped (multifoil) Mughal-Rajput arch path in a w×h box, open at the bottom. */
export function archPath(w: number, h: number, lobes = 9) {
  const spring = h * 0.42;
  const pts: [number, number][] = [];
  for (let i = 0; i <= lobes; i++) {
    const t = i / lobes;
    const a = Math.PI * (1 - t);
    const x = w / 2 + Math.cos(a) * (w / 2);
    let y = spring - Math.sin(a) * spring * 0.92;
    if (Math.abs(t - 0.5) < 0.12) y -= spring * 0.1 * (1 - Math.abs(t - 0.5) / 0.12);
    pts.push([x, y]);
  }
  let d = `M0 ${h}L0 ${r2(spring)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    const seg = Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1]);
    d += `A${r2(seg * 0.56)} ${r2(seg * 0.56)} 0 0 1 ${r2(x)} ${r2(y)}`;
  }
  return d + `L${w} ${h}`;
}

export function Jharokha({ className, style, w = 600, h = 900 }: { className?: string; style?: CSSProperties; w?: number; h?: number }) {
  const id = useUid();
  return (
    <svg viewBox={`-20 -20 ${w + 40} ${h + 40}`} className={className} style={style} aria-hidden preserveAspectRatio="none">
      <defs><linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B88A2E" /><stop offset=".5" stopColor="#FFE6A3" /><stop offset="1" stopColor="#B88A2E" /></linearGradient></defs>
      <g fill="none" stroke={`url(#${id}g)`} vectorEffect="non-scaling-stroke">
        <path className="fl-arch" d={archPath(w, h)} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <path className="fl-arch" d={archPath(w, h)} transform={`translate(${w * 0.03} ${h * 0.025}) scale(.94 .975)`} strokeWidth=".8" opacity=".55" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/** Small diya-and-lotus ornament divider. */
export function LotusRule({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 260 60" className={className} style={style} aria-hidden>
      <g fill="none" stroke="#E6B556" strokeWidth="1.1">
        <path d="M0 40H90M170 40H260" />
        <circle cx="96" cy="40" r="2" fill="#E6B556" /><circle cx="164" cy="40" r="2" fill="#E6B556" />
      </g>
      {[-50, -25, 0, 25, 50].map((a) => <path key={a} d={petal(30 - Math.abs(a) * 0.18, 9)} transform={`translate(130 46) rotate(${a})`} fill={a ? "#E23D7B" : "#F7A928"} opacity={a ? 0.8 : 1} />)}
    </svg>
  );
}
