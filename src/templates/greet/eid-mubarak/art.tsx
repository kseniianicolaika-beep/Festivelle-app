import { useId, type CSSProperties } from "react";
import { r2, rng } from "../_shared/kit";

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");

/** Eight-pointed khatam star path centred on 0,0. */
export const star8 = (r: number) => {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const rr = i % 2 ? r * 0.72 : r;
    return `${r2(Math.cos(a) * rr)} ${r2(Math.sin(a) * rr)}`;
  });
  return `M${pts.join("L")}Z`;
};

/** Pointed (Islamic) arch in a w×h box. */
export const pointed = (w: number, h: number, spring = 0.36) => {
  const s = h * spring;
  const r = w * 0.82;
  return `M0 ${h}V${r2(s)}A${r2(r)} ${r2(r)} 0 0 1 ${w / 2} 0A${r2(r)} ${r2(r)} 0 0 1 ${w} ${r2(s)}V${h}Z`;
};

/** Girih lattice as an SVG pattern id (place inside <defs>). */
export function Girih({ id, color = "#D4AF37", size = 60, op = 0.5, sw = 1 }: { id: string; color?: string; size?: number; op?: number; sw?: number }) {
  const h = size / 2;
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      <g fill="none" stroke={color} strokeWidth={sw} opacity={op}>
        <path d={star8(h * 0.62)} transform={`translate(${h} ${h})`} />
        <path d={star8(h * 0.62)} transform="translate(0 0)" />
        <path d={star8(h * 0.62)} transform={`translate(${size} 0)`} />
        <path d={star8(h * 0.62)} transform={`translate(0 ${size})`} />
        <path d={star8(h * 0.62)} transform={`translate(${size} ${size})`} />
        <path d={`M${h} ${h * 0.38}L${h} 0M${h} ${h * 1.62}L${h} ${size}M${h * 0.38} ${h}L0 ${h}M${h * 1.62} ${h}L${size} ${h}`} />
      </g>
    </pattern>
  );
}

/** Golden crescent moon with soft halo. */
export function Crescent({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`${id}h`}><stop offset="0" stopColor="#FCE7A6" stopOpacity=".35" /><stop offset="1" stopColor="#FCE7A6" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF4CC" /><stop offset=".45" stopColor="#E9C766" /><stop offset="1" stopColor="#A9822C" /></linearGradient>
        <mask id={`${id}m`}><rect width="200" height="200" fill="#fff" /><circle cx="128" cy="78" r="66" fill="#000" /></mask>
      </defs>
      <circle cx="100" cy="100" r="98" fill={`url(#${id}h)`} className="em-halo" />
      <circle cx="100" cy="100" r="70" fill={`url(#${id}g)`} mask={`url(#${id}m)`} />
      <path d={star8(12)} transform="translate(150 132) rotate(12)" fill="#FFF0BA" />
    </svg>
  );
}

/** A Ramadan fanous lantern with glowing coloured glass and fretwork. */
export function Lantern({ className, style, glass = "#FFB547", seed = 0 }: { className?: string; style?: CSSProperties; glass?: string; seed?: number }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 100 240" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}b`} x1="0" x2="1"><stop offset="0" stopColor="#8A6A22" /><stop offset=".45" stopColor="#F2D27A" /><stop offset="1" stopColor="#7A5A1A" /></linearGradient>
        <radialGradient id={`${id}l`} cx=".5" cy=".55" r=".6"><stop offset="0" stopColor="#FFF6D6" /><stop offset=".4" stopColor={glass} /><stop offset="1" stopColor="#7A2E10" /></radialGradient>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor={glass} stopOpacity=".55" /><stop offset="1" stopColor={glass} stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="50" cy="150" r="70" fill={`url(#${id}g)`} className="em-lglow" style={{ animationDelay: `${seed * 0.7}s` }} />
      <circle cx="50" cy="8" r="6" fill="none" stroke={`url(#${id}b)`} strokeWidth="2.4" />
      <path d="M50 14V30" stroke={`url(#${id}b)`} strokeWidth="2" />
      <path d="M30 70C30 46 42 32 50 30C58 32 70 46 70 70Z" fill={`url(#${id}b)`} />
      <path d={star8(5)} transform="translate(50 54)" fill="#3a2a0a" opacity=".6" />
      <rect x="24" y="70" width="52" height="7" fill={`url(#${id}b)`} />
      <path d="M26 77H74L80 170H20Z" fill={`url(#${id}l)`} />
      <g fill="none" stroke={`url(#${id}b)`} strokeWidth="2">
        <path d="M26 77L20 170M74 77L80 170M42 77L40 170M58 77L60 170" />
        <path d="M23 112H77M21 140H79" />
      </g>
      <g fill="#5a3d0d" opacity=".55">
        <path d={pointed(10, 26)} transform="translate(28 84)" />
        <path d={pointed(10, 26)} transform="translate(45 84)" />
        <path d={pointed(10, 26)} transform="translate(62 84)" />
        <path d={star8(6)} transform="translate(33 127)" />
        <path d={star8(6)} transform="translate(50 127)" />
        <path d={star8(6)} transform="translate(67 127)" />
      </g>
      <rect x="18" y="170" width="64" height="7" fill={`url(#${id}b)`} />
      <path d="M22 177H78L56 206H44Z" fill={`url(#${id}b)`} />
      <path d="M50 206V224" stroke={`url(#${id}b)`} strokeWidth="2" />
      <circle cx="50" cy="228" r="4.5" fill={`url(#${id}b)`} />
    </svg>
  );
}

/** Domes and minarets skyline (fills the bottom of a 1000-wide box). */
export function Skyline({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  const minaret = (x: number, h: number) => `M${x - 9} 300V${300 - h}h3l3-14h6l3 14h3V300ZM${x - 7} ${300 - h - 14}L${x} ${300 - h - 40}L${x + 7} ${300 - h - 14}Z`;
  const dome = (x: number, r: number, base: number) => `M${x - r} ${base}C${x - r} ${base - r * 1.1} ${x - r * 0.2} ${base - r * 1.3} ${x} ${base - r * 1.7}C${x + r * 0.2} ${base - r * 1.3} ${x + r} ${base - r * 1.1} ${x + r} ${base}Z`;
  return (
    <svg viewBox="0 0 1000 300" className={className} style={style} aria-hidden preserveAspectRatio="xMidYMax slice">
      <defs><linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B3029" /><stop offset="1" stopColor="#061915" /></linearGradient></defs>
      <g fill={`url(#${id}s)`} stroke="#D4AF37" strokeOpacity=".55" strokeWidth="1.2">
        <path d={`${minaret(150, 200)}${minaret(850, 200)}`} />
        <path d={`${dome(500, 120, 200)}${dome(330, 60, 230)}${dome(670, 60, 230)}`} />
        <path d="M250 300V230H750V300ZM380 230V200H620V230Z" />
        <path d={`${minaret(250, 120)}${minaret(750, 120)}`} />
        <path d="M0 300V270H1000V300Z" />
      </g>
      <path d="M500 64V30M492 40a8 8 0 1 0 16 0" stroke="#D4AF37" strokeWidth="2" fill="none" />
      <g fill="#FFD27A" opacity=".75">
        {[420, 470, 530, 580].map((x) => <path key={x} d={pointed(14, 26)} transform={`translate(${x - 7} 254)`} />)}
      </g>
    </svg>
  );
}

/** Star divider. */
export function StarRule({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 260 40" className={className} style={style} aria-hidden>
      <g fill="none" stroke="#D4AF37" strokeWidth="1">
        <path d="M0 20H100M160 20H260" />
        <path d={star8(16)} transform="translate(130 20)" />
        <path d={star8(9)} transform="translate(130 20) rotate(22.5)" fill="#D4AF37" fillOpacity=".25" />
        <path d={star8(5)} transform="translate(108 20)" />
        <path d={star8(5)} transform="translate(152 20)" />
      </g>
    </svg>
  );
}

/** One carved door leaf: lattice panel inside a pointed half-arch. side = "l" | "r". */
export function DoorLeaf({ side, className, style }: { side: "l" | "r"; className?: string; style?: CSSProperties }) {
  const id = useUid();
  const flip = side === "r" ? "translate(500 0) scale(-1 1)" : undefined;
  return (
    <svg viewBox="0 0 500 1000" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <defs>
        <Girih id={`${id}p`} size={70} op={0.75} sw={1.4} color="#C9A24A" />
        <linearGradient id={`${id}w`} x1="0" x2="1"><stop offset="0" stopColor="#0A2520" /><stop offset=".7" stopColor="#0F322B" /><stop offset="1" stopColor="#071A16" /></linearGradient>
      </defs>
      <g transform={flip}>
        <rect width="500" height="1000" fill={`url(#${id}w)`} />
        <rect width="500" height="1000" fill={`url(#${id}p)`} />
        <rect x="40" y="40" width="420" height="920" fill="none" stroke="#D4AF37" strokeOpacity=".7" strokeWidth="2" />
        <rect x="56" y="56" width="388" height="888" fill="none" stroke="#D4AF37" strokeOpacity=".3" strokeWidth="1" />
        <path d="M500 0V2" />
        <circle cx="470" cy="520" r="16" fill="none" stroke="#E9C766" strokeWidth="4" />
        <circle cx="470" cy="500" r="5" fill="#E9C766" />
      </g>
    </svg>
  );
}

export function Stars({ n = 70, seed = 3 }: { n?: number; seed?: number }) {
  const R = rng(seed);
  return (
    <svg className="em-stars" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={r2(R() * 1000)} cy={r2(R() * 420)} r={r2(0.6 + R() * 1.6)} fill="#FFF3CF" style={{ animationDelay: `${r2(R() * 4)}s`, animationDuration: `${r2(3 + R() * 4)}s` }} />)}
    </svg>
  );
}

