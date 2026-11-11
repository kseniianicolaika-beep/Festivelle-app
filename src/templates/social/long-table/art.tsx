import { useId, type CSSProperties } from "react";

// Long Table — a linen-dressed supper table seen from above: terracotta plates, wine glasses, brass tapers
// (data-flame, lit one by one) and an olive garland running down the middle. Plus a single taper and an olive sprig.

const OLIVE = "#6b7a4b", OLIVE_D = "#4b5733", LINEN = "#f7f0e4", TERRA = "#b5562f", WINE = "#6e1e2b";

/** Olive leaf at origin, pointing up. */
const leaf = (l: number, w: number) => `M0 0C${w} ${-l * 0.3} ${w * 0.6} ${-l * 0.8} 0 ${-l}C${-w * 0.6} ${-l * 0.8} ${-w} ${-l * 0.3} 0 0Z`;

function Garland({ x0, x1, y, id }: { x0: number; x1: number; y: number; id: string }) {
  const n = Math.round((x1 - x0) / 22);
  return (
    <g>
      <path d={`M${x0} ${y}C${x0 + (x1 - x0) * 0.3} ${y - 8} ${x0 + (x1 - x0) * 0.7} ${y + 8} ${x1} ${y}`} stroke={OLIVE_D} strokeWidth="1.6" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + (i + 0.5) * ((x1 - x0) / n);
        const up = i % 2 ? 1 : -1;
        return (
          <g key={i}>
            <path d={leaf(18 + (i % 3) * 3, 5)} transform={`translate(${x} ${y}) rotate(${up * (55 + (i % 4) * 8)})`} fill={i % 3 ? OLIVE : `url(#ol${id})`} />
            {i % 5 === 2 && <circle cx={x + 4} cy={y + up * 10} r="3.4" fill={WINE} opacity=".85" />}
          </g>
        );
      })}
    </g>
  );
}

/** Top-down supper table. Horizontal (1000×300) for the hero; `vertical` turns it for tall cards. */
export function Table({ className = "", style, vertical = false, seats = 6, lit = true }: { className?: string; style?: CSSProperties; vertical?: boolean; seats?: number; lit?: boolean }) {
  const id = useId().replace(/:/g, "");
  const L = 1000, H = 300;
  const xs = Array.from({ length: seats }, (_, i) => 120 + (i * (L - 240)) / Math.max(1, seats - 1));
  const candles = xs.slice(0, -1).map((x, i) => (x + xs[i + 1]) / 2);
  return (
    <svg viewBox={vertical ? `0 0 ${H} ${L}` : `0 0 ${L} ${H}`} className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`ln${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe4d2" /><stop offset=".5" stopColor={LINEN} /><stop offset="1" stopColor="#e9dcc6" /></linearGradient>
        <radialGradient id={`pl${id}`}><stop offset=".55" stopColor="#fbf6ee" /><stop offset=".62" stopColor={TERRA} /><stop offset=".72" stopColor="#c8714a" /><stop offset="1" stopColor="#8e3f22" /></radialGradient>
        <radialGradient id={`gl${id}`} cx=".4" cy=".4"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".5" stopColor="#f2e9df" stopOpacity=".35" /><stop offset="1" stopColor="#cbb9a5" stopOpacity=".5" /></radialGradient>
        <radialGradient id={`wn${id}`}><stop offset="0" stopColor="#9a2a3c" /><stop offset="1" stopColor="#4a0f1c" /></radialGradient>
        <radialGradient id={`fh${id}`}><stop offset="0" stopColor="#ffd27a" stopOpacity=".7" /><stop offset="1" stopColor="#ff9d2e" stopOpacity="0" /></radialGradient>
        <linearGradient id={`ol${id}`} x1="0" x2="1"><stop offset="0" stopColor={OLIVE_D} /><stop offset="1" stopColor="#8d9a68" /></linearGradient>
        <linearGradient id={`br${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8a6a2c" /><stop offset=".5" stopColor="#f0d79a" /><stop offset="1" stopColor="#8a6a2c" /></linearGradient>
      </defs>
      <g transform={vertical ? `translate(${H} 0) rotate(90)` : undefined}>
        {/* cloth + drop shadow + runner */}
        <rect x="18" y="62" width={L - 36} height="176" rx="6" fill="#000" opacity=".08" transform="translate(6 10)" />
        <rect x="18" y="62" width={L - 36} height="176" rx="6" fill={`url(#ln${id})`} />
        <path d={`M18 70h${L - 36}M18 230h${L - 36}`} stroke="#d9c7aa" strokeWidth="1" strokeDasharray="2 5" />
        <rect x="40" y="128" width={L - 80} height="44" fill={TERRA} opacity=".14" />
        {/* place settings on both sides */}
        {xs.map((x, i) => (
          <g key={i}>
            {[95, 205].map((y, s) => (
              <g key={s}>
                <circle cx={x} cy={y} r="27" fill={`url(#pl${id})`} />
                <circle cx={x} cy={y} r="15" fill="none" stroke="#e8d7c0" strokeWidth="1" />
                <rect x={x - 42} y={y - 17} width="4" height="34" rx="2" fill={`url(#br${id})`} />
                <rect x={x + 38} y={y - 17} width="4" height="34" rx="2" fill={`url(#br${id})`} />
                <circle cx={x + 30} cy={s ? y - 32 : y + 32} r="9" fill={`url(#gl${id})`} stroke="#d8c8b4" strokeWidth=".6" />
                <circle cx={x + 30} cy={s ? y - 32 : y + 32} r="5" fill={`url(#wn${id})`} />
              </g>
            ))}
          </g>
        ))}
        <Garland x0={52} x1={L - 52} y={150} id={id} />
        {/* tapers in brass holders (seen from above: the flame glows over the holder) */}
        {candles.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy="150" r="11" fill={`url(#br${id})`} />
            <circle cx={x} cy="150" r="5" fill="#fbf3e2" />
            <g data-flame style={{ opacity: lit ? 1 : 0, transformOrigin: `${x}px 150px`, transformBox: "view-box" }}>
              <circle className="lt-glow" style={{ animationDelay: `${i * 0.4}s` }} cx={x} cy="150" r="34" fill={`url(#fh${id})`} />
              <circle cx={x} cy="150" r="3" fill="#fffbe8" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

/** One brass taper with a living flame. viewBox 60×220. */
export function Taper({ className = "", style, lit = true }: { className?: string; style?: CSSProperties; lit?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 220" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`b${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8a6a2c" /><stop offset=".5" stopColor="#f0d79a" /><stop offset="1" stopColor="#8a6a2c" /></linearGradient>
        <linearGradient id={`w${id}`} x1="0" x2="1"><stop offset="0" stopColor="#efe4d2" /><stop offset=".5" stopColor="#fffaf2" /><stop offset="1" stopColor="#e3d4bd" /></linearGradient>
        <linearGradient id={`f${id}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fffbe8" /><stop offset=".45" stopColor="#ffcb52" /><stop offset="1" stopColor="#e5611f" /></linearGradient>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#ffd27a" stopOpacity=".6" /><stop offset="1" stopColor="#ff9d2e" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x="23" y="44" width="14" height="136" rx="3" fill={`url(#w${id})`} />
      <path d="M26 44c2 8 0 14 2 22" stroke="#e7d9c4" strokeWidth="2" fill="none" />
      <path d="M30 44v-6" stroke="#3a2a20" strokeWidth="1.4" />
      <path d="M12 186h36l-6 8H18z M22 194h16l4 18H18z M10 212h40v6H10z" fill={`url(#b${id})`} />
      <g data-flame style={{ opacity: lit ? 1 : 0 }}>
        <circle cx="30" cy="26" r="24" fill={`url(#h${id})`} />
        <path className="lt-flame" style={{ transformOrigin: "30px 38px" }} d="M30 38c-6-6-6-15 0-26 6 11 6 20 0 26z" fill={`url(#f${id})`} />
      </g>
    </svg>
  );
}

/** Olive sprig ornament. viewBox 160×60. */
export function Sprig({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 160 60" className={className} style={style} aria-hidden>
      <path d="M8 34C50 26 110 26 152 30" stroke={OLIVE_D} strokeWidth="1.4" fill="none" />
      {[18, 34, 50, 66, 82, 98, 114, 130, 144].map((x, i) => (
        <path key={x} d={leaf(15 + (i % 3) * 2, 4.4)} transform={`translate(${x} ${31 - Math.sin(i) * 1.5}) rotate(${i % 2 ? 62 : -62})`} fill={i % 3 ? OLIVE : OLIVE_D} />
      ))}
      <circle cx="74" cy="40" r="3.6" fill={WINE} /><circle cx="122" cy="22" r="3.2" fill={WINE} opacity=".85" />
    </svg>
  );
}

export const LT_CSS = `
.lt-linen{background-color:#f6efe4;background-image:repeating-linear-gradient(0deg,rgba(150,120,80,.035) 0 1px,transparent 1px 4px),repeating-linear-gradient(90deg,rgba(150,120,80,.03) 0 1px,transparent 1px 5px),radial-gradient(70% 50% at 50% 0%,#fffaf2,transparent 70%)}
.lt-glow{animation:ltGlow 2.4s ease-in-out infinite}
@keyframes ltGlow{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.75;transform:scale(.9)}}
.lt-flame{animation:ltFl 1.8s ease-in-out infinite}
@keyframes ltFl{0%,100%{transform:scale(1) skewX(0)}30%{transform:scale(.93,1.07) skewX(3deg)}60%{transform:scale(1.04,.96) skewX(-3deg)}}
.lt-root .ss-h2,.lt-root .ss-v,.lt-root .ss-venue,.lt-root .ss-ev,.lt-root .ss-lead{font-family:var(--cf-fraun),var(--cf-corm),Georgia,serif;font-style:italic;color:#6e1e2b;font-weight:400}
.lt-root .ss-script{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#b5562f}
.lt-root .ss-k,.lt-root .ss-s,.lt-root .ss-time{color:#8a6d55}
.lt-root .ss-num{font-family:var(--cf-fraun),Georgia,serif;font-style:italic;color:#b5562f}
.lt-root .ss-cell{background:rgba(255,251,244,.85);border:1px solid rgba(181,86,47,.25);border-radius:4px}
.lt-root .ss-dots{border-color:rgba(181,86,47,.4)}
.lt-root .ss-btn{background:#6e1e2b;color:#f7f0e4}
.lt-root .ss-btn-ghost{background:transparent;color:#6e1e2b;border:1px solid rgba(110,30,43,.4)}
.lt-root .ss-photo{box-shadow:0 0 0 8px #fffaf2,0 0 0 9px rgba(181,86,47,.35),0 30px 60px -30px rgba(80,30,10,.45)}
.lt-root .ss-panel{background:#fffaf2;border:1px solid rgba(181,86,47,.3);border-radius:6px;box-shadow:0 30px 70px -40px rgba(80,30,10,.4)}
.lt-root .ss-body{color:#4a3428}
.lt-card .sc-eyebrow,.lt-card .sc-where{font-family:var(--f-body,var(--cf-tenor)),sans-serif;color:#8a6d55}
.lt-card .sc-name,.lt-card .sc-head,.lt-card .sc-num,.lt-card .sc-date,.lt-card .sc-item-t,.lt-card .sc-tag{font-family:var(--f-display,var(--cf-fraun)),var(--cf-corm),Georgia,serif;font-style:italic;color:#6e1e2b}
.lt-card .sc-amp,.lt-card .sc-line,.lt-card .sc-foot,.lt-card .sc-host,.lt-card .sc-tagline{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#b5562f}
.lt-card .sc-lead,.lt-card .sc-body,.lt-card .sc-item-d{font-family:var(--f-body,var(--cf-corm)),Georgia,serif;font-style:italic;color:#4a3428}
.lt-card .sc-item+.sc-item{border-top:1px solid rgba(181,86,47,.25)}
.lt-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.lt-glow,.lt-flame{animation:none!important}}
`;
