import { useId, type CSSProperties } from "react";
import { r2, rng } from "../_shared/kit";

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
const GREENS = ["#1F4A3A", "#2C5E46", "#3B7354", "#4F8A63", "#24503F"];

/** A hand-tied fir wreath: hundreds of needles, holly berries, pine cones, gold bells and a velvet bow. */
export function Wreath({ className, style, seed = 5, bow = true }: { className?: string; style?: CSSProperties; seed?: number; bow?: boolean }) {
  const id = useUid();
  const R = rng(seed);
  const C = 500;
  const RAD = 360;
  const sprigs: React.ReactNode[] = [];
  const N = 130;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + R() * 0.05;
    const rr = RAD + (R() - 0.5) * 70;
    const x = C + Math.cos(a) * rr;
    const y = C + Math.sin(a) * rr;
    const tang = (a * 180) / Math.PI + 90 + (R() - 0.5) * 50;
    const len = 70 + R() * 50;
    const col = GREENS[Math.floor(R() * GREENS.length)];
    const needles: string[] = [];
    for (let k = 0; k < 11; k++) {
      const t = (k / 10) * len;
      const nl = 16 + R() * 10 - k * 0.6;
      needles.push(`M0 ${r2(-t)}l${r2(-nl * 0.8)} ${r2(-nl * 0.55)}M0 ${r2(-t)}l${r2(nl * 0.8)} ${r2(-nl * 0.55)}`);
    }
    sprigs.push(
      <g key={i} transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(tang)})`}>
        <path d={`M0 0L0 ${r2(-len)}${needles.join("")}`} stroke={col} strokeWidth={r2(2.4 + R() * 1.6)} strokeLinecap="round" fill="none" />
      </g>,
    );
  }
  const decor: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.25;
    const x = C + Math.cos(a) * (RAD + (R() - 0.5) * 30);
    const y = C + Math.sin(a) * (RAD + (R() - 0.5) * 30);
    if (i % 3 === 0) {
      decor.push(
        <g key={"c" + i} transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(R() * 360)})`}>
          <ellipse rx="22" ry="34" fill="#5A3A22" />
          {Array.from({ length: 12 }, (_, k) => <path key={k} d={`M${(k % 3) * 12 - 12} ${Math.floor(k / 3) * 16 - 26}q6 8 12 0`} stroke="#2E1C10" strokeWidth="2.4" fill="none" />)}
        </g>,
      );
    } else {
      decor.push(
        <g key={"b" + i} transform={`translate(${r2(x)} ${r2(y)})`}>
          {[0, 1, 2, 3].map((k) => {
            const bx = (R() - 0.5) * 40;
            const by = (R() - 0.5) * 40;
            return (
              <g key={k}>
                <circle cx={r2(bx)} cy={r2(by)} r={r2(9 + R() * 4)} fill={`url(#${id}b)`} />
                <circle cx={r2(bx - 3)} cy={r2(by - 3)} r="2.4" fill="#fff" opacity=".7" />
              </g>
            );
          })}
        </g>,
      );
    }
  }
  return (
    <svg viewBox="0 0 1000 1000" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}b`} cx=".35" cy=".35" r=".7"><stop offset="0" stopColor="#F2574D" /><stop offset=".6" stopColor="#B8322F" /><stop offset="1" stopColor="#6E1414" /></radialGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7E1620" /><stop offset=".4" stopColor="#C2343A" /><stop offset=".7" stopColor="#8F1C24" /><stop offset="1" stopColor="#5C0D14" /></linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8A6630" /><stop offset=".5" stopColor="#F4DEA2" /><stop offset="1" stopColor="#A37A36" /></linearGradient>
        <filter id={`${id}s`}><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity=".45" /></filter>
      </defs>
      <g filter={`url(#${id}s)`}>
        <circle cx={C} cy={C} r={RAD} fill="none" stroke="#183C30" strokeWidth="70" />
        <g className="mc-needles">{sprigs}</g>
        {decor}
        {[0.95, 2.2, 4.1].map((a, i) => (
          <g key={"bell" + i} transform={`translate(${r2(C + Math.cos(a) * RAD)} ${r2(C + Math.sin(a) * RAD)}) rotate(${i * 20 - 15})`}>
            <path d="M-18 14C-18-14-10-24 0-24S18-14 18 14L24 20H-24Z" fill={`url(#${id}g)`} />
            <circle cy="24" r="6" fill={`url(#${id}g)`} />
            <circle cy="-27" r="4" fill="none" stroke={`url(#${id}g)`} strokeWidth="2.4" />
          </g>
        ))}
        {bow && (
          <g transform={`translate(${C} ${C + RAD + 10})`}>
            <path d="M-6 0C-30 40-50 110-70 170L-40 160L-28 178C-14 110 -2 50 6 4Z" fill={`url(#${id}v)`} />
            <path d="M6 0C30 40 50 110 70 170L40 160L28 178C14 110 2 50 -6 4Z" fill={`url(#${id}v)`} />
            <path d="M0 0C-40-50-120-70-128-20C-134 20-60 30 0 6Z" fill={`url(#${id}v)`} />
            <path d="M0 0C40-50 120-70 128-20C134 20 60 30 0 6Z" fill={`url(#${id}v)`} />
            <path d="M-110-30C-80-36-40-20-6 0M110-30C80-36 40-20 6 0" stroke="#F2A0A0" strokeOpacity=".35" strokeWidth="3" fill="none" />
            <rect x="-22" y="-20" width="44" height="38" rx="12" fill={`url(#${id}v)`} />
          </g>
        )}
      </g>
    </svg>
  );
}

/** A pillar candle with a living flame. */
export function Candle({ className, style, h = 1, seed = 0 }: { className?: string; style?: CSSProperties; h?: number; seed?: number }) {
  const id = useUid();
  const H = 140 * h;
  return (
    <svg viewBox={`0 0 80 ${H + 90}`} className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}w`} x1="0" x2="1"><stop offset="0" stopColor="#D9CDB4" /><stop offset=".45" stopColor="#FBF5E8" /><stop offset="1" stopColor="#BFAF92" /></linearGradient>
        <radialGradient id={`${id}f`} cx=".5" cy=".75" r=".65"><stop offset="0" stopColor="#FFFDF0" /><stop offset=".35" stopColor="#FFE08A" /><stop offset=".8" stopColor="#FF9A2E" /><stop offset="1" stopColor="#E2481E" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor="#FFCE7A" stopOpacity=".6" /><stop offset="1" stopColor="#FFCE7A" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="40" cy="58" r="70" fill={`url(#${id}g)`} className="mc-glow" style={{ animationDelay: `${seed * 0.4}s` }} />
      <rect x="14" y="88" width="52" height={H} rx="4" fill={`url(#${id}w)`} />
      <path d="M14 92C24 98 30 90 40 96S58 90 66 94V88H14Z" fill="#FFFBF1" />
      <path d="M40 88V76" stroke="#2a2018" strokeWidth="2" />
      <path className="mc-flame" style={{ animationDelay: `${seed * 0.3}s` }} d="M40 38C48 54 50 66 40 78C30 66 32 54 40 38Z" fill={`url(#${id}f)`} />
      <path className="mc-flame" d="M40 56C43 62 43 70 40 74C37 70 37 62 40 56Z" fill="#fff" opacity=".8" />
    </svg>
  );
}

/** Ice-fern frost crystals growing from a corner (top-left of a 400 box). */
export function Frost({ className, style, seed = 3 }: { className?: string; style?: CSSProperties; seed?: number }) {
  const R = rng(seed);
  const branches: string[] = [];
  const grow = (x: number, y: number, a: number, len: number, depth: number) => {
    const x2 = x + Math.cos(a) * len;
    const y2 = y + Math.sin(a) * len;
    branches.push(`M${r2(x)} ${r2(y)}L${r2(x2)} ${r2(y2)}`);
    if (depth <= 0) return;
    const n = 4;
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 1);
      const px = x + Math.cos(a) * len * t;
      const py = y + Math.sin(a) * len * t;
      const sub = len * (0.42 - t * 0.2) * (0.8 + R() * 0.4);
      grow(px, py, a - 0.9 + (R() - 0.5) * 0.2, sub, depth - 1);
      grow(px, py, a + 0.9 + (R() - 0.5) * 0.2, sub, depth - 1);
    }
  };
  for (let i = 0; i < 6; i++) grow(0, 0, 0.12 + i * 0.25 + (R() - 0.5) * 0.1, 200 + R() * 140, 2);
  return (
    <svg viewBox="0 0 400 400" className={className} style={style} aria-hidden overflow="visible">
      <path d={branches.join("")} stroke="#F3FAFF" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".75" />
    </svg>
  );
}

/** Holly sprig divider. */
export function Holly({ className, style }: { className?: string; style?: CSSProperties }) {
  const leaf = "M0 0C8-6 10-2 16-8C18-2 24-2 28-8C30-2 36 0 40-4C34 6 26 8 20 6C14 10 6 8 0 0Z";
  return (
    <svg viewBox="0 0 240 60" className={className} style={style} aria-hidden>
      <path d="M0 34H80M160 34H240" stroke="#D8B66A" strokeWidth="1" />
      <path d={leaf} transform="translate(120 34) rotate(200) scale(1.3)" fill="#2C5E46" stroke="#173c2c" />
      <path d={leaf} transform="translate(120 34) rotate(-20) scale(1.3)" fill="#3B7354" stroke="#173c2c" />
      {[[-6, -4], [4, -8], [6, 2]].map(([x, y], i) => <circle key={i} cx={120 + x} cy={30 + y} r="5.5" fill="#B8322F" stroke="#6E1414" />)}
    </svg>
  );
}
