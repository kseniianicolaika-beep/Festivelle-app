import { useId, type CSSProperties } from "react";
import { r2, rng } from "../_shared/kit";

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
export const GOLDS = ["#8A6630", "#F4DEA2", "#C99A4A", "#FFF1C9", "#A37A36"];

export function GoldGrad({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      {GOLDS.map((c, i) => <stop key={i} offset={i / (GOLDS.length - 1)} stopColor={c} />)}
    </linearGradient>
  );
}

const star5 = (r: number, ri = r * 0.42) =>
  "M" + Array.from({ length: 10 }, (_, i) => { const a = (i * Math.PI) / 5 - Math.PI / 2; const rr = i % 2 ? ri : r; return `${r2(Math.cos(a) * rr)} ${r2(Math.sin(a) * rr)}`; }).join("L") + "Z";

/** Six-fold lace snowflake (Vologda-lace delicacy). */
export function Flake({ className, style, seed = 1, color = "#E2C278", sw = 1.6 }: { className?: string; style?: CSSProperties; seed?: number; color?: string; sw?: number }) {
  const R = rng(seed);
  const b1 = 0.3 + R() * 0.2;
  const b2 = 0.55 + R() * 0.2;
  const l1 = 14 + R() * 10;
  const l2 = 10 + R() * 8;
  const arm = `M0 0V-46M0 ${-46 * b1}l${-l1 * 0.7} ${-l1}M0 ${-46 * b1}l${l1 * 0.7} ${-l1}M0 ${-46 * b2}l${-l2 * 0.7} ${-l2}M0 ${-46 * b2}l${l2 * 0.7} ${-l2}M-4 -42l4 -6 4 6`;
  return (
    <svg viewBox="-50 -50 100 100" className={className} style={style} aria-hidden>
      <g stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none">
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={arm} transform={`rotate(${i * 60})`} />)}
        <path d="M0-12L10.4-6V6L0 12L-10.4 6V-6Z" />
        <circle r="3" fill={color} />
      </g>
    </svg>
  );
}

/** The New Year fir — yolka — with Soviet-style glass baubles, a ruby star and twinkling garland. */
export function Yolka({ className, style, seed = 4 }: { className?: string; style?: CSSProperties; seed?: number }) {
  const id = useUid();
  const R = rng(seed);
  const tiers = 6;
  const tierPaths: React.ReactNode[] = [];
  for (let t = 0; t < tiers; t++) {
    const top = 70 + t * 70;
    const bot = top + 130;
    const half = 60 + t * 44;
    const teeth = 5 + t;
    let d = `M300 ${top}`;
    for (let k = 0; k <= teeth; k++) {
      const x = 300 + half - (k / teeth) * half * 2;
      const y = bot + (k % 2 ? -14 : 0) + (R() - 0.5) * 6;
      if (k === 0) d += `Q${300 + half * 0.5} ${top + 50} ${r2(x)} ${r2(y)}`;
      else d += `Q${r2(x + half / teeth)} ${r2(y + 18)} ${r2(x)} ${r2(y)}`;
    }
    d += `Q${300 - half * 0.5} ${top + 50} 300 ${top}Z`;
    tierPaths.push(<path key={t} d={d} fill={`url(#${id}t)`} stroke="#0A2A22" strokeWidth="1.5" />);
    tierPaths.push(<path key={"s" + t} d={`M${300 - half * 0.85} ${bot - 6}Q300 ${bot + 6} ${300 + half * 0.85} ${bot - 6}`} stroke="#EAF4FF" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55" />);
  }
  const balls = [
    [250, 230, "#D23C3C"], [352, 262, "#2F6FD0"], [300, 330, "#E2C278"], [214, 360, "#C0C8D8"], [392, 380, "#D23C3C"], [262, 440, "#2F6FD0"],
    [350, 470, "#E2C278"], [178, 500, "#D23C3C"], [430, 520, "#C0C8D8"], [300, 560, "#D23C3C"], [222, 580, "#E2C278"], [392, 600, "#2F6FD0"],
  ] as const;
  const lights: React.ReactNode[] = [];
  for (let s = 0; s < 5; s++) {
    const y0 = 190 + s * 88;
    const w = 70 + s * 44;
    for (let k = 0; k <= 9; k++) {
      const t = k / 9;
      const x = 300 - w + t * w * 2;
      const y = y0 + Math.sin(t * Math.PI) * 30 + t * 30;
      lights.push(<circle key={`${s}-${k}`} className="ny-light" cx={r2(x)} cy={r2(y)} r="4.2" fill={["#FFE7A0", "#FF8A8A", "#9FD0FF", "#FFD27A"][k % 4]} style={{ animationDelay: `${r2(R() * 2.4)}s` }} />);
    }
  }
  return (
    <svg viewBox="0 0 600 760" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}t`} x1="0" x2="1"><stop offset="0" stopColor="#0F3D30" /><stop offset=".45" stopColor="#1E6048" /><stop offset="1" stopColor="#0B2E24" /></linearGradient>
        <GoldGrad id={`${id}g`} />
        <radialGradient id={`${id}st`} cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#FF6B6B" /><stop offset=".6" stopColor="#C61F2C" /><stop offset="1" stopColor="#7A0C16" /></radialGradient>
        <filter id={`${id}glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="282" y="560" width="36" height="90" fill="#4A2E1C" />
      <path d="M220 650H380L366 730H234Z" fill="#B8322F" stroke={`url(#${id}g)`} strokeWidth="2" />
      <path d="M232 690H368" stroke={`url(#${id}g)`} strokeWidth="2" strokeDasharray="2 8" />
      {tierPaths}
      <g filter={`url(#${id}glow)`}>{lights}</g>
      {balls.map(([x, y, c], i) => (
        <g key={i} className="ny-ball" style={{ animationDelay: `${-i * 0.6}s`, transformOrigin: `${x}px ${y - 22}px` }}>
          <path d={`M${x} ${y - 30}V${y - 20}`} stroke="#C9A24A" strokeWidth="1.2" />
          <rect x={x - 5} y={y - 23} width="10" height="7" rx="1.5" fill={`url(#${id}g)`} />
          <circle cx={x} cy={y} r="17" fill={c} />
          <circle cx={x} cy={y} r="17" fill={`url(#${id}sh)`} />
          <path d={`M${x - 15} ${y + 2}Q${x} ${y + 9} ${x + 15} ${y + 2}`} stroke="#fff" strokeOpacity=".35" strokeWidth="1.4" fill="none" />
          <ellipse cx={x - 6} cy={y - 6} rx="5" ry="3.5" fill="#fff" opacity=".55" transform={`rotate(-30 ${x - 6} ${y - 6})`} />
        </g>
      ))}
      <radialGradient id={`${id}sh`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".25" /><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".35" /></radialGradient>
      {[[205, 300], [395, 310], [300, 420], [170, 450], [440, 460]].map(([x, y], i) => (
        <path key={"ic" + i} d={`M${x - 4} ${y}h8l-4 34z`} fill="#DDE8F6" opacity=".9" />
      ))}
      <g transform="translate(300 52)" className="ny-star">
        <circle r="46" fill="#FF4A4A" opacity=".18" />
        <path d={star5(40)} fill={`url(#${id}g)`} />
        <path d={star5(32)} fill={`url(#${id}st)`} />
        <path d={star5(32)} fill="none" stroke="#FFB0B0" strokeOpacity=".5" />
      </g>
    </svg>
  );
}

/** A mandarin with a leaf — the scent of a Russian New Year. */
export function Mandarin({ className, style, rot = 0, leaf = true }: { className?: string; style?: CSSProperties; rot?: number; leaf?: boolean }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}m`} cx=".38" cy=".35" r=".75"><stop offset="0" stopColor="#FFC15A" /><stop offset=".55" stopColor="#F28C28" /><stop offset="1" stopColor="#B4520E" /></radialGradient>
        <filter id={`${id}p`}><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .25 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
      </defs>
      <g transform={`rotate(${rot} 50 55)`}>
        <ellipse cx="50" cy="56" rx="40" ry="35" fill={`url(#${id}m)`} />
        <ellipse cx="50" cy="56" rx="40" ry="35" fill="#000" filter={`url(#${id}p)`} />
        <ellipse cx="38" cy="44" rx="9" ry="5" fill="#fff" opacity=".35" transform="rotate(-25 38 44)" />
        <circle cx="50" cy="22" r="3" fill="#6B4A1E" />
        {leaf && <path d="M52 22C62 8 80 6 90 12C80 22 64 26 52 22Z" fill="#3E7A3A" stroke="#22501f" strokeWidth="1" />}
      </g>
    </svg>
  );
}

/** Kremlin-chime clock face. Hands are separate groups (.ny-hh / .ny-mh) for animation. */
export function ClockFace({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  const roman = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  return (
    <svg viewBox="-200 -200 400 400" className={className} style={style} aria-hidden>
      <defs>
        <GoldGrad id={`${id}g`} />
        <radialGradient id={`${id}d`}><stop offset="0" stopColor="#1A2C5E" /><stop offset="1" stopColor="#081333" /></radialGradient>
      </defs>
      <circle r="196" fill={`url(#${id}g)`} />
      <circle r="184" fill={`url(#${id}d)`} />
      <circle r="176" fill="none" stroke={`url(#${id}g)`} strokeWidth="1.5" />
      <circle r="118" fill="none" stroke={`url(#${id}g)`} strokeWidth="1" opacity=".6" />
      {Array.from({ length: 60 }, (_, i) => <path key={i} d={i % 5 ? "M0-176V-168" : "M0-176V-160"} stroke={`url(#${id}g)`} strokeWidth={i % 5 ? 1.5 : 3} transform={`rotate(${i * 6})`} />)}
      {roman.map((n, i) => (
        <text key={n} x="0" y="-130" textAnchor="middle" fontSize="26" fill="#E9C978" transform={`rotate(${i * 30})`} style={{ fontFamily: "var(--gf-oldstd), Georgia, serif" }}>{n}</text>
      ))}
      {Array.from({ length: 12 }, (_, i) => <path key={"o" + i} d="M0-104c6 8 6 14 0 20c-6-6-6-12 0-20Z" fill={`url(#${id}g)`} opacity=".7" transform={`rotate(${i * 30 + 15})`} />)}
      <g className="ny-hh"><path d="M-6 16L-3-80C-10-88-6-100 0-108C6-100 10-88 3-80L6 16Z" fill={`url(#${id}g)`} /></g>
      <g className="ny-mh"><path d="M-4 22L-2-138C-8-144-5-154 0-162C5-154 8-144 2-138L4 22Z" fill={`url(#${id}g)`} /></g>
      <circle r="12" fill={`url(#${id}g)`} />
      <circle r="5" fill="#081333" />
    </svg>
  );
}

/** A short garland of glass baubles for dividers. */
export function Baubles({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 260 70" className={className} style={style} aria-hidden>
      <path d="M0 8Q130 40 260 8" stroke="#E2C278" fill="none" strokeWidth="1.2" />
      {[[60, "#D23C3C", 34], [130, "#E2C278", 46], [200, "#2F6FD0", 34]].map(([x, c, y]) => (
        <g key={x as number}>
          <path d={`M${x} ${(y as number) - 22}V${(y as number) - 12}`} stroke="#E2C278" />
          <circle cx={x as number} cy={y as number} r="11" fill={c as string} />
          <ellipse cx={(x as number) - 4} cy={(y as number) - 4} rx="3.4" ry="2.2" fill="#fff" opacity=".6" />
        </g>
      ))}
    </svg>
  );
}
