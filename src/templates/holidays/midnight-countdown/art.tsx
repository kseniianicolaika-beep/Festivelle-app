import { useId, type CSSProperties } from "react";

// Midnight Countdown — art-deco New Year's Eve: a gilded clock at five to twelve (data-hour / data-minute hands),
// champagne coupes with rising bubbles, a deco sunburst and firework blooms.

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
const r2 = (n: number) => Math.round(n * 100) / 100;
const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

/** The gilded clock. Hands sit at 11:55 until the tap sweeps them to midnight. */
export function Clock({ className, style, midnight = false }: { className?: string; style?: CSSProperties; midnight?: boolean }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7a5a22" /><stop offset=".35" stopColor="#f7e2a8" /><stop offset=".6" stopColor="#b8913e" /><stop offset="1" stopColor="#6e5020" /></linearGradient>
        <radialGradient id={`f${id}`} cx=".5" cy=".45"><stop offset="0" stopColor="#24221f" /><stop offset="1" stopColor="#0b0b0c" /></radialGradient>
      </defs>
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M150 150L${r2(150 + 148 * Math.cos((i * Math.PI) / 12 - 0.04))} ${r2(150 + 148 * Math.sin((i * Math.PI) / 12 - 0.04))}L${r2(150 + 148 * Math.cos((i * Math.PI) / 12 + 0.04))} ${r2(150 + 148 * Math.sin((i * Math.PI) / 12 + 0.04))}Z`} fill={`url(#g${id})`} opacity={i % 2 ? 0.35 : 0.7} />)}
      <circle cx="150" cy="150" r="118" fill={`url(#g${id})`} />
      <circle cx="150" cy="150" r="110" fill={`url(#f${id})`} />
      <circle cx="150" cy="150" r="100" fill="none" stroke={`url(#g${id})`} strokeWidth="1" />
      <circle cx="150" cy="150" r="64" fill="none" stroke={`url(#g${id})`} strokeWidth=".8" strokeDasharray="2 4" />
      {Array.from({ length: 60 }, (_, i) => { const a = (i * Math.PI) / 30; const o = i % 5 ? 96 : 92; return <line key={"t" + i} x1={r2(150 + o * Math.sin(a))} y1={r2(150 - o * Math.cos(a))} x2={r2(150 + 100 * Math.sin(a))} y2={r2(150 - 100 * Math.cos(a))} stroke="#e8cf8a" strokeWidth={i % 5 ? 0.8 : 2} />; })}
      {ROMAN.map((n, i) => { const a = (i * Math.PI) / 6; return <text key={n} x={r2(150 + 79 * Math.sin(a))} y={r2(150 - 79 * Math.cos(a) + 5)} textAnchor="middle" fontSize={i === 0 ? 17 : 13} fill="#f1e2b8" style={{ fontFamily: "var(--cf-cinzel), serif" }}>{n}</text>; })}
      <g data-hour style={{ transformOrigin: "150px 150px", transform: `rotate(${midnight ? 360 : 357.5}deg)`, transition: "transform 1.6s cubic-bezier(.65,0,.35,1)" }}>
        <path d="M150 158L146 150L150 92L154 150Z" fill={`url(#g${id})`} />
        <path d="M150 104l5 8-5 6-5-6Z" fill="#f7e2a8" />
      </g>
      <g data-minute style={{ transformOrigin: "150px 150px", transform: `rotate(${midnight ? 360 : 330}deg)`, transition: "transform 1.6s cubic-bezier(.65,0,.35,1)" }}>
        <path d="M150 162L147.5 150L150 62L152.5 150Z" fill="#f7e2a8" />
      </g>
      <circle cx="150" cy="150" r="6" fill={`url(#g${id})`} stroke="#0b0b0c" strokeWidth="1.5" />
      <path d="M150 20l4 8h-8Z" fill="#f7e2a8" />
    </svg>
  );
}

/** Two champagne coupes, raised and touching, with bubbles. */
export function Coupes({ className, style, animate = true }: { className?: string; style?: CSSProperties; animate?: boolean }) {
  const id = useUid();
  const glass = (flip: boolean) => (
    <g transform={flip ? "translate(240 0) scale(-1 1)" : undefined}>
      <g transform="rotate(-12 80 150)">
        <path d="M30 70C34 104 60 116 80 116S126 104 130 70Z" fill={`url(#c${id})`} />
        <path d="M30 70C34 104 60 116 80 116S126 104 130 70" fill="none" stroke="#fff6dc" strokeWidth="2" opacity=".8" />
        <path d="M30 70C30 64 130 64 130 70" fill="none" stroke="#fff6dc" strokeWidth="1.6" opacity=".9" />
        <path d="M38 80C48 96 68 104 80 104" fill="none" stroke="#fff" strokeWidth="2" opacity=".5" strokeLinecap="round" />
        <path d="M78 116L78 176M82 116L82 176" stroke="#f6eccd" strokeWidth="2" opacity=".85" />
        <path d="M54 182C60 174 100 174 106 182Z" fill="#f6eccd" opacity=".85" />
        {[0, 1, 2, 3, 4].map((b) => <circle key={b} className={animate ? "mc-bubble" : ""} style={{ animationDelay: `${b * 0.5}s` }} cx={58 + b * 10} cy={98 - (b % 2) * 8} r={1.6 + (b % 3) * 0.6} fill="#fff" opacity=".85" />)}
      </g>
    </g>
  );
  return (
    <svg viewBox="0 0 240 200" className={className} style={style} aria-hidden overflow="visible">
      <defs><linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7e2a8" stopOpacity=".95" /><stop offset="1" stopColor="#c8962e" stopOpacity=".9" /></linearGradient></defs>
      {glass(false)}
      {glass(true)}
      <g fill="#f7e2a8">{[[120, 40, 3], [108, 26, 2], [134, 20, 2.4], [120, 8, 1.6]].map(([x, y, r], i) => <path key={i} d={`M${x} ${y - r * 2}L${x + r * 0.6} ${y - r * 0.6}L${x + r * 2} ${y}L${x + r * 0.6} ${y + r * 0.6}L${x} ${y + r * 2}L${x - r * 0.6} ${y + r * 0.6}L${x - r * 2} ${y}L${x - r * 0.6} ${y - r * 0.6}Z`} className={animate ? "mc-twinkle" : ""} style={{ animationDelay: `${i * 0.6}s` }} />)}</g>
    </svg>
  );
}

/** A firework bloom: rays and sparks. */
export function Bloom({ className, style, color = "#f7e2a8" }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} aria-hidden>
      {Array.from({ length: 18 }, (_, i) => { const a = (i * Math.PI * 2) / 18; return <g key={i}><line x1={r2(18 * Math.cos(a))} y1={r2(18 * Math.sin(a))} x2={r2(78 * Math.cos(a))} y2={r2(78 * Math.sin(a))} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 6" /><circle cx={r2(88 * Math.cos(a))} cy={r2(88 * Math.sin(a))} r="2.6" fill={color} /></g>; })}
    </svg>
  );
}

/** A deco fan — the section ornament. */
export function Fan({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style} aria-hidden>
      {Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i * Math.PI) / 8; return <line key={i} x1="60" y1="56" x2={r2(60 + 52 * Math.cos(a))} y2={r2(56 + 52 * Math.sin(a))} stroke="#d6b36a" strokeWidth="1.2" />; })}
      <path d="M8 56A52 52 0 0 1 112 56" fill="none" stroke="#d6b36a" strokeWidth="1.6" />
      <path d="M30 56A30 30 0 0 1 90 56" fill="none" stroke="#d6b36a" strokeWidth="1" />
      <circle cx="60" cy="56" r="4" fill="#f7e2a8" />
    </svg>
  );
}

export const MC_CSS = `
.mc-onyx{background-color:#0c0c0e;background-image:radial-gradient(50% 40% at 50% 36%,rgba(214,179,106,.16),transparent 70%),repeating-linear-gradient(90deg,rgba(214,179,106,.035) 0 1px,transparent 1px 64px),radial-gradient(120% 90% at 50% 120%,#1d1a14,#0a0a0b 70%)}
.mc-foil{background:linear-gradient(100deg,#7a5a22 0%,#f7e2a8 22%,#b8913e 40%,#fff4d2 52%,#9c7630 66%,#f1d58e 84%,#7a5a22 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:mcShine 7s ease-in-out infinite}
@keyframes mcShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.mc-bubble{animation:mcBub 2.6s ease-in infinite}
@keyframes mcBub{0%{transform:translateY(0);opacity:0}20%{opacity:.9}100%{transform:translateY(-30px);opacity:0}}
.mc-twinkle{animation:mcTw 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes mcTw{0%,100%{opacity:.3;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}
.mc-bloom{animation:mcBloom 5s ease-out infinite;transform-origin:center}
@keyframes mcBloom{0%{transform:scale(.2);opacity:0}15%{opacity:1}60%{transform:scale(1);opacity:.6}100%{transform:scale(1.1);opacity:0}}
.mc-frame{border:1px solid rgba(214,179,106,.5);box-shadow:inset 0 0 0 6px transparent,inset 0 0 0 7px rgba(214,179,106,.3)}
.mc-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.mc-bubble,.mc-twinkle,.mc-bloom,.mc-foil{animation:none!important}}
`;
