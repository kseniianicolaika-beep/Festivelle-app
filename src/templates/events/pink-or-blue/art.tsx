import { useId, type CSSProperties } from "react";

// Pink or Blue — a balloon bouquet in pastel pink and powder blue around one big champagne-gold "?" balloon
// (data-balloon on each, data-q on the question), soft clouds, and confetti in both colours. Never takes a side.

export const PINK = "#f2a7bf";
export const BLUE = "#9cc6e8";

function Balloon({ x, y, r, c, id, q = false, string = 80 }: { x: number; y: number; r: number; c: "p" | "b" | "g"; id: string; q?: boolean; string?: number }) {
  return (
    <g data-balloon={q ? undefined : c} data-q={q ? "" : undefined} transform={`translate(${x} ${y})`}>
      <path d={`M0 ${r * 1.12}c-6 ${string * 0.3} 6 ${string * 0.6} 0 ${string}`} stroke="#b9a3a8" strokeWidth="1" fill="none" />
      <ellipse rx={r} ry={r * 1.12} fill={`url(#${c}${id})`} />
      <path d={`M${-r * 0.12} ${r * 1.1}l${r * 0.12} ${r * 0.16} ${r * 0.12}-${r * 0.16}z`} fill={c === "p" ? "#e58aa7" : c === "b" ? "#7fb0db" : "#c99a4a"} />
      <ellipse cx={-r * 0.38} cy={-r * 0.45} rx={r * 0.18} ry={r * 0.3} fill="#fff" opacity=".55" transform={`rotate(-25 ${-r * 0.38} ${-r * 0.45})`} />
      {q && <text y={r * 0.36} textAnchor="middle" fontSize={r * 1.15} fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fill="#fffaf0" opacity=".95">?</text>}
    </g>
  );
}

/** The bouquet. viewBox 320×360. */
export function Bouquet({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 320 360" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`p${u}`} cx=".35" cy=".3"><stop offset="0" stopColor="#ffe3ec" /><stop offset=".55" stopColor={PINK} /><stop offset="1" stopColor="#e07d9e" /></radialGradient>
        <radialGradient id={`b${u}`} cx=".35" cy=".3"><stop offset="0" stopColor="#e7f3fc" /><stop offset=".55" stopColor={BLUE} /><stop offset="1" stopColor="#6fa3d2" /></radialGradient>
        <radialGradient id={`g${u}`} cx=".35" cy=".3"><stop offset="0" stopColor="#fff3d0" /><stop offset=".5" stopColor="#e8c27a" /><stop offset="1" stopColor="#b8873a" /></radialGradient>
      </defs>
      <Balloon x={70} y={120} r={34} c="p" id={u} string={170} />
      <Balloon x={250} y={116} r={34} c="b" id={u} string={174} />
      <Balloon x={104} y={64} r={30} c="b" id={u} string={226} />
      <Balloon x={218} y={60} r={30} c="p" id={u} string={230} />
      <Balloon x={60} y={204} r={26} c="b" id={u} string={100} />
      <Balloon x={262} y={200} r={26} c="p" id={u} string={104} />
      <Balloon x={160} y={130} r={56} c="g" id={u} q string={150} />
      {/* bow where the strings meet */}
      <g transform="translate(160 330)">
        <path d="M0 0c-14-12-30-10-30 0s16 10 30 0zM0 0c14-12 30-10 30 0s-16 10-30 0z" fill={PINK} />
        <path d="M0 0c-6 10-12 18-16 28M0 0c6 10 12 18 16 28" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
        <circle r="5" fill="#e8c27a" />
      </g>
    </svg>
  );
}

/** A soft cloud. viewBox 200×90. */
export function Cloud({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 90" className={className} style={style} aria-hidden>
      <path d="M30 80c-20 0-28-24-10-34 0-22 26-30 40-18 8-22 44-26 56-4 18-10 44 2 42 24 22 2 26 32 2 32z" fill="#fff" opacity=".9" />
    </svg>
  );
}

/** Small pair of balloons. viewBox 100×140. */
export function Pair({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 140" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`p${u}`} cx=".35" cy=".3"><stop offset="0" stopColor="#ffe3ec" /><stop offset=".55" stopColor={PINK} /><stop offset="1" stopColor="#e07d9e" /></radialGradient>
        <radialGradient id={`b${u}`} cx=".35" cy=".3"><stop offset="0" stopColor="#e7f3fc" /><stop offset=".55" stopColor={BLUE} /><stop offset="1" stopColor="#6fa3d2" /></radialGradient>
        <radialGradient id={`g${u}`} cx=".35" cy=".3"><stop offset="0" stopColor="#fff3d0" /><stop offset=".5" stopColor="#e8c27a" /><stop offset="1" stopColor="#b8873a" /></radialGradient>
      </defs>
      <Balloon x={32} y={40} r={22} c="p" id={u} string={70} />
      <Balloon x={68} y={36} r={22} c="b" id={u} string={74} />
    </svg>
  );
}

/** Two-colour confetti dots (CSS). */
export function Dots({ n = 26, className = "" }: { n?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="evpk-dot" style={{ left: `${(i * 41) % 100}%`, top: `${(i * 67) % 100}%`, background: i % 2 ? PINK : BLUE, width: `${5 + (i % 4) * 3}px`, height: `${5 + (i % 4) * 3}px`, animationDelay: `${(i % 6) * 0.7}s` }} />
      ))}
    </div>
  );
}

export const PK_CSS = `
.evpk-root{background-color:#fdf6f2;background-image:linear-gradient(115deg,rgba(242,167,191,.22) 0%,rgba(242,167,191,.08) 45%,rgba(156,198,232,.08) 55%,rgba(156,198,232,.24) 100%)}
.evpk-foil{background:linear-gradient(100deg,#d77a98 0%,#c99a4a 48%,#6fa3d2 100%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.evpk-shine{animation:evpkShine 6s ease-in-out infinite}
@keyframes evpkShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.evpk-dot{position:absolute;border-radius:50%;opacity:.55;animation:evpkBob 5s ease-in-out infinite}
@keyframes evpkBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.evpk-float{animation:evpkFloat 6s ease-in-out infinite}
@keyframes evpkFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}}
@media (prefers-reduced-motion: reduce){.evpk-shine,.evpk-dot,.evpk-float{animation:none!important}}
`;
