import { useId } from "react";
import { polar, r2 } from "../_shared/geo";

// Eclipse — a cinematic product launch: a total eclipse whose corona ignites (data-corona), a diamond-ring flare
// (data-flare) and a slow star field. Champagne light on near-black.

export function Eclipse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  const spikes = Array.from({ length: 36 }, (_, i) => {
    const a = (i * Math.PI * 2) / 36;
    const len = 118 + ((i * 37) % 11) * 4;
    return `M${polar(150, 150, 92, a - 0.03)}L${polar(150, 150, len, a)}L${polar(150, 150, 92, a + 0.03)}Z`;
  });
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`c${id}`}><stop offset=".55" stopColor="#fff4d6" stopOpacity=".9" /><stop offset=".68" stopColor="#e4c58e" stopOpacity=".55" /><stop offset="1" stopColor="#e4c58e" stopOpacity="0" /></radialGradient>
        <radialGradient id={`f${id}`}><stop offset="0" stopColor="#ffffff" /><stop offset=".3" stopColor="#fff4d6" stopOpacity=".9" /><stop offset="1" stopColor="#e4c58e" stopOpacity="0" /></radialGradient>
        <filter id={`b${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <g data-corona style={{ transformOrigin: "150px 150px" }}>
        <circle cx="150" cy="150" r="150" fill={`url(#c${id})`} />
        <g filter={`url(#b${id})`} opacity=".55">{spikes.map((d, i) => <path key={i} d={d} fill="#fff4d6" />)}</g>
      </g>
      <circle cx="150" cy="150" r="90" fill="#0b0a0b" />
      <circle cx="150" cy="150" r="90" fill="none" stroke="#fff4d6" strokeWidth="1.6" opacity=".9" />
      <g data-flare style={{ transformOrigin: `${r2(150 + Math.cos(-0.7) * 90)}px ${r2(150 + Math.sin(-0.7) * 90)}px` }}>
        <circle cx={r2(150 + Math.cos(-0.7) * 90)} cy={r2(150 + Math.sin(-0.7) * 90)} r="22" fill={`url(#f${id})`} />
        <path d={`M${r2(150 + Math.cos(-0.7) * 90) - 40} ${r2(150 + Math.sin(-0.7) * 90)}H${r2(150 + Math.cos(-0.7) * 90) + 40}M${r2(150 + Math.cos(-0.7) * 90)} ${r2(150 + Math.sin(-0.7) * 90) - 40}V${r2(150 + Math.sin(-0.7) * 90) + 40}`} stroke="#fff" strokeWidth="1" opacity=".8" />
      </g>
    </svg>
  );
}

/** Deterministic star field (no Math.random → stable SSR). */
export function Stars({ className = "", n = 70 }: { className?: string; n?: number }) {
  const pts = Array.from({ length: n }, (_, i) => ({ x: r2(((i * 97) % 1000) / 10), y: r2(((i * 61 + 17) % 1000) / 10), r: 0.15 + ((i * 13) % 5) * 0.08, d: (i % 7) * 0.6 }));
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden>
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={r2(p.r)} fill="#f5ebdd" className="ec-twinkle" style={{ animationDelay: `${p.d}s` }} />)}
    </svg>
  );
}

export const EC_CSS = `
.ec-night{background-color:#0b0a0b;background-image:radial-gradient(50% 40% at 50% 40%,rgba(228,197,142,.10),transparent 70%)}
.ec-gold{background:linear-gradient(100deg,#b8955a,#fff4d6 45%,#e4c58e 60%,#b8955a);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.ec-shine{animation:ecShine 9s ease-in-out infinite}
@keyframes ecShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.ec-twinkle{animation:ecTw 4s ease-in-out infinite}
@keyframes ecTw{0%,100%{opacity:.25}50%{opacity:.9}}
.ec-pulse [data-corona]{animation:ecPulse 6s ease-in-out infinite}
@keyframes ecPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
.ec-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.ec-shine,.ec-twinkle,.ec-pulse [data-corona]{animation:none!important}}
`;
