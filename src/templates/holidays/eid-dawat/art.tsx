import { useId, type CSSProperties } from "react";

// Eid Dawat — an emerald-and-gold evening: pierced brass fanoos lanterns (data-lamp glow), a crescent and star,
// a scalloped mihrab arch and an eight-point star lattice.

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
const r2 = (n: number) => Math.round(n * 100) / 100;

/** A brass fanoos on a chain. `lit` false = glass dark, waiting for the tap. */
export function Fanoos({ className, style, lit = true, chain = 40 }: { className?: string; style?: CSSProperties; lit?: boolean; chain?: number }) {
  const id = useUid();
  const y0 = chain;
  return (
    <svg viewBox={`0 0 100 ${y0 + 170}`} className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`b${id}`} x1="0" x2="1"><stop offset="0" stopColor="#7a5a1c" /><stop offset=".45" stopColor="#f3d98a" /><stop offset=".7" stopColor="#b8913e" /><stop offset="1" stopColor="#6e5020" /></linearGradient>
        <radialGradient id={`l${id}`} cx=".5" cy=".55"><stop offset="0" stopColor="#fff6c8" /><stop offset=".5" stopColor="#ffc24a" /><stop offset="1" stopColor="#c86a12" /></radialGradient>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#ffd36a" stopOpacity=".55" /><stop offset="1" stopColor="#ffd36a" stopOpacity="0" /></radialGradient>
      </defs>
      <path d={`M50 0V${y0}`} stroke="#c9a24e" strokeWidth="1.4" strokeDasharray="3 2" />
      <g data-lamp style={{ opacity: lit ? 1 : 0.12 }}>
        <circle cx="50" cy={y0 + 90} r="70" fill={`url(#h${id})`} />
        <path d={`M30 ${y0 + 46}L70 ${y0 + 46}L80 ${y0 + 92}L70 ${y0 + 138}L30 ${y0 + 138}L20 ${y0 + 92}Z`} fill={`url(#l${id})`} />
      </g>
      <path d={`M50 ${y0}L64 ${y0 + 20}H36Z`} fill={`url(#b${id})`} />
      <path d={`M36 ${y0 + 20}H64L72 ${y0 + 46}H28Z`} fill={`url(#b${id})`} />
      <path d={`M30 ${y0 + 46}L70 ${y0 + 46}L80 ${y0 + 92}L70 ${y0 + 138}L30 ${y0 + 138}L20 ${y0 + 92}Z`} fill="none" stroke={`url(#b${id})`} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M50 ${y0 + 46}V${y0 + 138}M20 ${y0 + 92}H80`} stroke={`url(#b${id})`} strokeWidth="2" />
      {[[35, 62], [65, 62], [35, 120], [65, 120]].map(([x, y], i) => <path key={i} d={`M${x} ${y0 + y - 8}l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1Z`} fill="#0f2e28" opacity=".55" />)}
      <path d={`M28 ${y0 + 138}H72L64 ${y0 + 156}H36Z`} fill={`url(#b${id})`} />
      <path d={`M50 ${y0 + 156}V${y0 + 168}`} stroke={`url(#b${id})`} strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy={y0 + 170} r="3" fill="#f3d98a" />
    </svg>
  );
}

/** Crescent moon with a star. */
export function Crescent({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff4c8" /><stop offset=".5" stopColor="#e6c46a" /><stop offset="1" stopColor="#a8822e" /></linearGradient>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#f3d98a" stopOpacity=".35" /><stop offset="1" stopColor="#f3d98a" stopOpacity="0" /></radialGradient>
        <mask id={`m${id}`}><rect width="120" height="120" fill="#fff" /><circle cx="74" cy="48" r="40" fill="#000" /></mask>
      </defs>
      <circle cx="56" cy="60" r="58" fill={`url(#h${id})`} className="ed-glow" />
      <circle cx="56" cy="60" r="46" fill={`url(#g${id})`} mask={`url(#m${id})`} />
      <path d="M92 70l3.4 7.2 7.9.9-5.8 5.4 1.6 7.8L92 87.4l-7.1 3.9 1.6-7.8-5.8-5.4 7.9-.9Z" fill={`url(#g${id})`} />
    </svg>
  );
}

/** An eight-point star lattice tile strip (girih-style) for borders and ornaments. */
export function Lattice({ className, style, n = 9 }: { className?: string; style?: CSSProperties; n?: number }) {
  const star = (cx: number, cy: number, r: number) => {
    const pts = Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8; const rr = i % 2 ? r * 0.62 : r; return `${r2(cx + rr * Math.cos(a))},${r2(cy + rr * Math.sin(a))}`; });
    return pts.join(" ");
  };
  return (
    <svg viewBox={`0 0 ${n * 40} 40`} className={className} style={style} aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <polygon points={star(20 + i * 40, 20, 16)} fill="none" stroke="#d4af37" strokeWidth="1.3" />
          <rect x={14 + i * 40} y="14" width="12" height="12" transform={`rotate(45 ${20 + i * 40} 20)`} fill="none" stroke="#d4af37" strokeWidth=".9" />
          {i < n - 1 && <path d={`M${36 + i * 40} 20H${44 + i * 40}`} stroke="#d4af37" strokeWidth="1.3" />}
        </g>
      ))}
    </svg>
  );
}

/** A scalloped mihrab arch outline. */
export function Mihrab({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <path d="M10 400V170C10 90 70 34 150 6C230 34 290 90 290 170V400" fill="none" stroke="#d4af37" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M24 400V176C24 102 80 52 150 24C220 52 276 102 276 176V400" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** The card centrepiece: a crescent with three lanterns hanging below. */
export function LanternMoon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative ${className ?? ""}`} style={{ aspectRatio: "1/1.05", ...style }}>
      <Fanoos chain={10} className="absolute left-0 top-0 w-[31%]" />
      <Fanoos chain={70} className="absolute left-[34.5%] top-0 w-[31%]" />
      <Fanoos chain={34} className="absolute right-0 top-0 w-[31%]" />
    </div>
  );
}

export const ED_CSS = `
.ed-emerald{background-color:#0f2e28;background-image:radial-gradient(50% 40% at 50% 30%,rgba(243,217,138,.14),transparent 70%),radial-gradient(1px 1px at 18% 22%,#f3e9d2 60%,transparent),radial-gradient(1.4px 1.4px at 78% 14%,#f3d98a 60%,transparent),radial-gradient(1px 1px at 64% 38%,#fff 60%,transparent),radial-gradient(1.2px 1.2px at 32% 10%,#fff 60%,transparent),radial-gradient(120% 90% at 50% 120%,#174a40,#0b231e 70%)}
.ed-foil{background:linear-gradient(100deg,#9c7a22 0%,#fbe7a6 24%,#c9a43a 44%,#fff6d0 56%,#a8822e 70%,#e9d48a 86%,#9c7a22 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:edShine 8s ease-in-out infinite}
@keyframes edShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.ed-swing{animation:edSwing 5s ease-in-out infinite;transform-origin:50% 0}
@keyframes edSwing{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
.ed-glow{animation:edGlow 4s ease-in-out infinite}
@keyframes edGlow{0%,100%{opacity:.6}50%{opacity:1}}
.ed-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.ed-swing,.ed-glow,.ed-foil{animation:none!important}}
`;
