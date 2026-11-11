import { useId, type CSSProperties } from "react";

// Kupol — a small white Orthodox church with three gilded onion domes (data-dome, a light sweep crosses them on
// open), swinging bells (data-bell), birch branches, and a rushnyk border of red cross-stitch.

function Dome({ x, y, w, id }: { x: number; y: number; w: number; id: string }) {
  const h = w * 1.25;
  return (
    <g data-dome transform={`translate(${x} ${y})`}>
      <path d={`M0 ${-h * 1.3}v${-w * 0.42}M${-w * 0.16} ${-h * 1.3 - w * 0.28}h${w * 0.32}M${-w * 0.1} ${-h * 1.3 - w * 0.12}l${w * 0.2} ${-w * 0.08}`} stroke="#c99a4a" strokeWidth={w * 0.05} strokeLinecap="round" />
      <path d={`M0 ${-h * 1.3}c${w * 0.08} ${h * 0.25} ${w * 0.6} ${h * 0.45} ${w * 0.5} ${h * 0.9}c-${w * 0.04} ${h * 0.25}-${w * 0.25} ${h * 0.38}-${w * 0.5} ${h * 0.4}c-${w * 0.25}-${h * 0.02}-${w * 0.46}-${h * 0.15}-${w * 0.5}-${h * 0.4}C-${w * 0.6} ${-h * 0.85}-${w * 0.08} ${-h * 1.05} 0 ${-h * 1.3}z`} fill={`url(#g${id})`} />
      <path d={`M0 ${-h * 1.28}c${w * 0.05} ${h * 0.3} ${w * 0.18} ${h * 0.6} ${w * 0.12} ${h * 0.86}`} stroke="#fff3cf" strokeOpacity=".7" strokeWidth={w * 0.04} fill="none" />
      <rect x={-w * 0.38} y={-h * 0.02} width={w * 0.76} height={h * 0.5} fill="#fff" stroke="#d8d0c0" />
      {[-0.18, 0.18].map((dx, i) => <rect key={i} x={w * dx - w * 0.07} y={h * 0.1} width={w * 0.14} height={h * 0.26} rx={w * 0.07} fill="#3d5677" />)}
    </g>
  );
}

/** The church. viewBox 320×340. */
export function Church({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 320 340" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`g${u}`} x1="0" x2="1"><stop offset="0" stopColor="#8b5e22" /><stop offset=".35" stopColor="#f5d58f" /><stop offset=".55" stopColor="#d6a84f" /><stop offset="1" stopColor="#7a521c" /></linearGradient>
        <linearGradient id={`w${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#ebe5d8" /></linearGradient>
        <linearGradient id={`sw${u}`} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".85" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <clipPath id={`c${u}`}><rect x="0" y="0" width="320" height="170" /></clipPath>
      </defs>
      {/* body */}
      <rect x="70" y="170" width="180" height="140" fill={`url(#w${u})`} stroke="#d8d0c0" />
      <path d="M70 170l90-40 90 40z" fill="#fff" stroke="#d8d0c0" />
      <path d="M140 310v-56c0-14 10-22 20-22s20 8 20 22v56z" fill="#3d5677" />
      <path d="M140 254c0-14 10-22 20-22s20 8 20 22" fill="none" stroke="#c99a4a" strokeWidth="2" />
      {[96, 208].map((x) => <rect key={x} x={x} y="200" width="16" height="34" rx="8" fill="#3d5677" stroke="#c99a4a" strokeWidth=".8" />)}
      {/* kokoshnik arches */}
      {[100, 160, 220].map((x) => <path key={x} d={`M${x - 24} 176c0-18 48-18 48 0`} fill="none" stroke="#d8d0c0" strokeWidth="1.4" />)}
      {/* bell gable with bells */}
      {[124, 196].map((x) => (
        <g key={x} data-bell style={{ transformOrigin: `${x}px 146px`, transformBox: "view-box" }}>
          <path d={`M${x} 146v6`} stroke="#8b5e22" strokeWidth="1.4" />
          <path d={`M${x - 8} 166c0-10 3-14 8-14s8 4 8 14z`} fill={`url(#g${u})`} />
          <circle cx={x} cy={168} r="2" fill="#8b5e22" />
        </g>
      ))}
      {/* domes */}
      <Dome x={160} y={128} w={64} id={u} />
      <Dome x={92} y={170} w={40} id={u} />
      <Dome x={228} y={170} w={40} id={u} />
      {/* light sweep across the domes */}
      <g clipPath={`url(#c${u})`}><rect data-sweep x="-120" y="0" width="70" height="170" fill={`url(#sw${u})`} transform="skewX(-18)" opacity="0" /></g>
      {/* ground + birch */}
      <path d="M20 312h280" stroke="#d8d0c0" />
      {[[30, 0], [290, 1]].map(([x, f]) => (
        <g key={x} transform={`translate(${x} 0) scale(${f ? -1 : 1} 1)`}>
          <rect x="-5" y="150" width="10" height="162" fill="#f7f3ea" stroke="#cfc6b4" />
          {[170, 196, 224, 252, 282].map((y, i) => <path key={y} d={`M-5 ${y}h${4 + (i % 3) * 2}`} stroke="#3a3a3a" strokeWidth="2" />)}
          {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={6 + (i % 4) * 9} cy={150 + i * 7} rx="5" ry="3" fill={i % 2 ? "#b5c98a" : "#9cb56e"} transform={`rotate(${i * 25} ${6 + (i % 4) * 9} ${150 + i * 7})`} />)}
        </g>
      ))}
    </svg>
  );
}

/** Rushnyk cross-stitch band. viewBox 240×24 — tile it horizontally. */
export function Rushnyk({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const cells: [number, number][] = [];
  for (let k = 0; k < 6; k++) {
    const ox = k * 40;
    [[20, 4], [16, 8], [24, 8], [12, 12], [20, 12], [28, 12], [16, 16], [24, 16], [20, 20], [4, 12], [36, 12]].forEach(([x, y]) => cells.push([ox + x, y]));
  }
  return (
    <svg viewBox="0 0 240 24" preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden>
      {cells.map(([x, y], i) => <path key={i} d={`M${x - 1.6} ${y - 1.6}l3.2 3.2M${x + 1.6} ${y - 1.6}l-3.2 3.2`} stroke="#b3262f" strokeWidth="1.1" />)}
      <path d="M0 1h240M0 23h240" stroke="#b3262f" strokeWidth=".8" />
    </svg>
  );
}

/** Small Orthodox cross with a sprig. viewBox 60×80. */
export function Cross({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 80" className={className} style={style} aria-hidden>
      <path d="M30 6v68M18 22h24M22 12h16M20 54l20-6" stroke="#c99a4a" strokeWidth="3" strokeLinecap="round" />
      {[[16, 66], [44, 66], [12, 58], [48, 58]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="5" ry="2.6" fill="#9cb56e" transform={`rotate(${i % 2 ? 30 : -30} ${x} ${y})`} />)}
    </svg>
  );
}

export const KK_CSS = `
.evkk-root{background-color:#fbf7ee;background-image:radial-gradient(70% 50% at 50% 0%,rgba(214,168,79,.18),transparent 70%),radial-gradient(60% 40% at 50% 100%,rgba(93,127,168,.1),transparent 70%)}
.evkk-foil{background:linear-gradient(100deg,#8b5e22 0%,#d6a84f 25%,#2c3b55 50%,#d6a84f 75%,#8b5e22 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.evkk-shine{animation:evkkShine 9s ease-in-out infinite}
@keyframes evkkShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.evkk-band{background-repeat:repeat-x}
@media (prefers-reduced-motion: reduce){.evkk-shine{animation:none!important}}
`;
