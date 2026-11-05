import { useId, type CSSProperties } from "react";
import { r2 } from "../_shared/kit";

const GOLD = ["#8A6630", "#F4DEA2", "#B98B3E", "#FFF1C9", "#A37A36", "#E9CD8A"];

export function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
        {GOLD.map((c, i) => <stop key={i} offset={i / (GOLD.length - 1)} stopColor={c} />)}
      </linearGradient>
      <radialGradient id={`${id}f`} cx=".5" cy=".7" r=".6"><stop offset="0" stopColor="#FFF6D8" /><stop offset=".45" stopColor="#FFC65A" /><stop offset="1" stopColor="#FF8A2A" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}h`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#FFD98A" stopOpacity=".55" /><stop offset="1" stopColor="#FFD98A" stopOpacity="0" /></radialGradient>
    </defs>
  );
}
const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");

/** Art-deco sunburst: alternating rays and stepped arcs from a low horizon. */
export function Sunburst({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  const rays = 44;
  return (
    <svg viewBox="0 0 1000 560" className={className} style={style} aria-hidden preserveAspectRatio="xMidYMax meet">
      <GoldDefs id={id} />
      <g stroke={`url(#${id}g)`} fill="none" className="mhr-rays">
        {Array.from({ length: rays + 1 }, (_, i) => {
          const a = Math.PI + (i / rays) * Math.PI;
          const long = i % 2 === 0;
          const r0 = long ? 120 : 190;
          const r1 = long ? 540 : 430;
          return <path key={i} d={`M${r2(500 + Math.cos(a) * r0)} ${r2(560 + Math.sin(a) * r0)}L${r2(500 + Math.cos(a) * r1)} ${r2(560 + Math.sin(a) * r1)}`} strokeWidth={long ? 1.1 : 0.6} opacity={long ? 0.55 : 0.35} />;
        })}
        {[100, 112, 470, 486].map((r, i) => <path key={r} d={`M${500 - r} 560A${r} ${r} 0 0 1 ${500 + r} 560`} strokeWidth={i % 2 ? 0.6 : 1.2} opacity=".7" />)}
      </g>
    </svg>
  );
}

/** Stepped art-deco corner ornament (top-left; rotate for others). */
export function DecoCorner({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      <GoldDefs id={id} />
      <g fill="none" stroke={`url(#${id}g)`} strokeWidth="1.4">
        <path d="M4 116V4H116" />
        <path d="M14 116V30H30V14H116" />
        <path d="M24 70V40H40V24H70" strokeWidth=".8" />
        <path d="M40 40L60 60" strokeWidth=".8" />
        <circle cx="62" cy="62" r="3" fill={`url(#${id}g)`} />
      </g>
    </svg>
  );
}

/** Deco fan divider. */
export function Fan({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 240 70" className={className} style={style} aria-hidden>
      <GoldDefs id={id} />
      <g stroke={`url(#${id}g)`} fill="none" strokeWidth="1">
        <path d="M0 60H86M154 60H240" />
        <path d="M10 66H90M150 66H230" strokeWidth=".5" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI + ((i + 0.5) / 9) * Math.PI;
          return <path key={i} d={`M120 62L${r2(120 + Math.cos(a) * 52)} ${r2(62 + Math.sin(a) * 52)}`} />;
        })}
        <path d="M68 62A52 52 0 0 1 172 62" />
        <path d="M94 62A26 26 0 0 1 146 62" />
        <circle cx="120" cy="62" r="4" fill={`url(#${id}g)`} />
      </g>
    </svg>
  );
}

/** Slender three-tier celebration cake in gold line work with live candle flames. */
export function Cake({ className, style, candles = 5 }: { className?: string; style?: CSSProperties; candles?: number }) {
  const id = useUid();
  const n = Math.max(1, Math.min(candles, 7));
  return (
    <svg viewBox="0 0 220 300" className={className} style={style} aria-hidden overflow="visible">
      <GoldDefs id={id} />
      <g fill="#120E0C" stroke={`url(#${id}g)`} strokeWidth="1.2" className="mhr-cake-lines">
        <path d="M10 288H210" />
        <path d="M30 288L40 296H180L190 288" fill="none" />
        <rect x="26" y="214" width="168" height="74" />
        <rect x="48" y="150" width="124" height="64" />
        <rect x="70" y="96" width="80" height="54" />
      </g>
      <g fill="none" stroke={`url(#${id}g)`} strokeWidth=".8" opacity=".9">
        {Array.from({ length: 12 }, (_, i) => <path key={"s" + i} d={`M${26 + i * 14} 214q7 12 14 0`} />)}
        {Array.from({ length: 11 }, (_, i) => <path key={"v" + i} d={`M${56 + i * 11} 160V206`} strokeWidth=".5" />)}
        <path d="M48 160H172M48 206H172" />
        {Array.from({ length: 7 }, (_, i) => <path key={"c" + i} d={`M${74 + i * 10.5} 132l5.25-10 5.25 10`} />)}
        <path d="M26 250H194M26 256H194" strokeWidth=".5" />
        {Array.from({ length: 6 }, (_, i) => <circle key={"d" + i} cx={45 + i * 26} cy={272} r="2.2" fill={`url(#${id}g)`} stroke="none" />)}
      </g>
      {Array.from({ length: n }, (_, i) => {
        const x = 110 + (i - (n - 1) / 2) * 13;
        return (
          <g key={i}>
            <rect x={x - 2} y={70} width="4" height="26" fill={`url(#${id}g)`} />
            <circle cx={x} cy={58} r="13" fill={`url(#${id}h)`} />
            <path className="mhr-flame" style={{ animationDelay: `${i * 0.23}s` }} d={`M${x} 48C${x + 5} 56 ${x + 4.5} 64 ${x} 66C${x - 4.5} 64 ${x - 5} 56 ${x} 48Z`} fill={`url(#${id}f)`} />
          </g>
        );
      })}
    </svg>
  );
}

/** Champagne coupe pair, for footers. */
export function Coupes({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 200 140" className={className} style={style} aria-hidden>
      <GoldDefs id={id} />
      <g fill="none" stroke={`url(#${id}g)`} strokeWidth="1.3">
        <g transform="rotate(-12 70 80)"><path d="M30 40Q70 76 110 40Z" fill="rgba(244,222,162,.18)" /><path d="M70 62V122M48 124H92" /></g>
        <g transform="rotate(12 130 80)"><path d="M90 40Q130 76 170 40Z" fill="rgba(244,222,162,.18)" /><path d="M130 62V122M108 124H152" /></g>
        <path d="M96 24l4-10 4 10M88 30l-6-6M112 30l6-6" strokeWidth=".9" />
      </g>
    </svg>
  );
}

/** Gold satin bow for the gift box. */
export function GoldBow({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 200 110" className={className} style={style} aria-hidden overflow="visible">
      <GoldDefs id={id} />
      <filter id={`${id}s`}><feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000" floodOpacity=".5" /></filter>
      <g filter={`url(#${id}s)`} fill={`url(#${id}g)`}>
        <path d="M100 78C78 40 30 10 14 34C0 56 40 84 100 82Z" />
        <path d="M100 78C122 40 170 10 186 34C200 56 160 84 100 82Z" />
        <path d="M96 80C88 92 78 100 66 108L84 104L88 110C96 100 102 90 104 82Z" opacity=".9" />
        <path d="M104 80C112 92 122 100 134 108L116 104L112 110C104 100 98 90 96 82Z" opacity=".9" />
        <rect x="88" y="68" width="24" height="20" rx="5" />
      </g>
      <path d="M26 36C50 34 80 56 98 76M174 36C150 34 120 56 102 76" stroke="#6b4c1f" strokeOpacity=".45" fill="none" />
    </svg>
  );
}
