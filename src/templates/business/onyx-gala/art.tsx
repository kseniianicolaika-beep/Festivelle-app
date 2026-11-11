import { useId } from "react";
import { polar } from "../_shared/geo";

// Onyx Gala — a jazz-age year-end gala: a stepped deco arch with a radiating gold sunburst, chevron bands,
// fan medallions and a pair of gilded doors that part on the hero.

export function Sunburst({ className = "", style, rays = 23 }: { className?: string; style?: React.CSSProperties; rays?: number }) {
  const id = useId().replace(/:/g, "");
  const cx = 200, cy = 250;
  const ray = Array.from({ length: rays }, (_, i) => {
    const a = Math.PI + (i * Math.PI) / (rays - 1);
    const a2 = a + Math.PI / (rays - 1) / 2.4;
    const r = 230;
    return `M${cx} ${cy}L${polar(cx, cy, r, a)}L${polar(cx, cy, r, a2)}Z`;
  });
  return (
    <svg viewBox="0 0 400 290" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#7a5a24" /><stop offset=".45" stopColor="#f7e2a8" /><stop offset=".7" stopColor="#c9a050" /><stop offset="1" stopColor="#6f5020" /></linearGradient>
        <radialGradient id={`h${id}`} cx=".5" cy="1" r=".9"><stop offset="0" stopColor="#f7e2a8" stopOpacity=".38" /><stop offset="1" stopColor="#f7e2a8" stopOpacity="0" /></radialGradient>
        <clipPath id={`c${id}`}><path d="M30 250V200A170 170 0 0 1 370 200V250Z" /></clipPath>
      </defs>
      <path d="M30 250V200A170 170 0 0 1 370 200V250Z" fill={`url(#h${id})`} />
      <g clipPath={`url(#c${id})`} data-rays>{ray.map((d, i) => <path key={i} d={d} fill={`url(#g${id})`} opacity={i % 2 ? 0.55 : 0.9} />)}</g>
      {[0, 14, 28].map((o, i) => <path key={i} d={`M${30 - o} 250V${200 - o * 0.2}A${170 + o} ${170 + o} 0 0 1 ${370 + o} ${200 - o * 0.2}V250`} fill="none" stroke={`url(#g${id})`} strokeWidth={i ? 1 : 2.2} opacity={1 - i * 0.25} />)}
      <circle cx={cx} cy={cy} r="34" fill="#0e0e10" stroke={`url(#g${id})`} strokeWidth="2" />
      <circle cx={cx} cy={cy} r="24" fill="none" stroke={`url(#g${id})`} strokeWidth="1" />
      <path d={`M${cx - 16} ${cy}L${cx} ${cy - 18}L${cx + 16} ${cy}`} fill="none" stroke={`url(#g${id})`} strokeWidth="2" />
    </svg>
  );
}

/** Horizontal chevron band — a deco rule. */
export function Chevrons({ className = "", style, n = 14 }: { className?: string; style?: React.CSSProperties; n?: number }) {
  const id = useId().replace(/:/g, "");
  const w = n * 20;
  return (
    <svg viewBox={`0 0 ${w} 16`} className={className} style={style} aria-hidden preserveAspectRatio="none">
      <defs><linearGradient id={`g${id}`} x1="0" x2="1"><stop offset="0" stopColor="#a07a35" /><stop offset=".5" stopColor="#f7e2a8" /><stop offset="1" stopColor="#a07a35" /></linearGradient></defs>
      <path d={Array.from({ length: n }, (_, i) => `M${i * 20} 14L${i * 20 + 10} 2L${i * 20 + 20} 14`).join("")} fill="none" stroke={`url(#g${id})`} strokeWidth="1.4" />
    </svg>
  );
}

/** A fan medallion (for corners and the footer). */
export function Fan({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 70" className={className} style={style} aria-hidden>
      <defs><linearGradient id={`g${id}`} x1="0" x2="1"><stop offset="0" stopColor="#a07a35" /><stop offset=".5" stopColor="#f7e2a8" /><stop offset="1" stopColor="#a07a35" /></linearGradient></defs>
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI + (i * Math.PI) / 8;
        return <path key={i} d={`M60 64L${polar(60, 64, 56, a)}`} stroke={`url(#g${id})`} strokeWidth="1.3" />;
      })}
      <path d="M4 64A56 56 0 0 1 116 64" fill="none" stroke={`url(#g${id})`} strokeWidth="2" />
      <path d="M24 64A36 36 0 0 1 96 64" fill="none" stroke={`url(#g${id})`} strokeWidth="1" />
      <circle cx="60" cy="64" r="5" fill={`url(#g${id})`} />
    </svg>
  );
}

/** One gilded door panel with stepped deco mouldings. viewBox 200×600. */
export function Door({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 600" preserveAspectRatio="none" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <defs>
        <linearGradient id={`b${id}`} x1="0" x2="1"><stop offset="0" stopColor="#0b0b0d" /><stop offset=".8" stopColor="#18181b" /><stop offset="1" stopColor="#0b0b0d" /></linearGradient>
        <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#a07a35" /><stop offset=".5" stopColor="#f7e2a8" /><stop offset="1" stopColor="#a07a35" /></linearGradient>
      </defs>
      <rect width="200" height="600" fill={`url(#b${id})`} />
      <path d="M24 40H176V560H24Z M40 60H160V540H40Z" fill="none" stroke={`url(#g${id})`} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M100 ${150 + i * 50}L${150} ${120 + i * 50}M100 ${150 + i * 50}L50 ${120 + i * 50}`} stroke={`url(#g${id})`} strokeWidth="1" opacity=".6" />)}
      <circle cx="178" cy="300" r="6" fill={`url(#g${id})`} />
    </svg>
  );
}

export const OG_CSS = `
.og-onyx{background-color:#0e0e10;background-image:radial-gradient(60% 40% at 50% 30%,rgba(214,179,106,.10),transparent 70%),repeating-linear-gradient(90deg,rgba(214,179,106,.035) 0 1px,transparent 1px 48px)}
.og-foil{background:linear-gradient(100deg,#a07a35 0%,#f7e2a8 24%,#c9a050 42%,#fff4d6 54%,#a07a35 70%,#f1d896 86%,#a07a35 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.og-shine{animation:ogShine 8s ease-in-out infinite}
@keyframes ogShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.og-rays [data-rays]{transform-origin:200px 250px;animation:ogRays 14s ease-in-out infinite}
@keyframes ogRays{0%,100%{opacity:.85}50%{opacity:1}}
.og-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.og-shine,.og-rays [data-rays]{animation:none!important}}
`;
