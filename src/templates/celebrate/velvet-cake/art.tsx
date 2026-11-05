import { useId } from "react";

// Velvet Cake — a three-tier buttercream cake on a gilt stand: claret drips, piped pearls, gold leaf, sugar roses,
// taper candles (data-flame / data-smoke for the wish). Plus a velvet drape.

export function Cake({ className = "", style, lit = true, candles = 5 }: { className?: string; style?: React.CSSProperties; lit?: boolean; candles?: number }) {
  const id = useId().replace(/:/g, "");
  const tiers = [
    { y: 250, w: 220, h: 78 },
    { y: 182, w: 170, h: 70 },
    { y: 122, w: 120, h: 62 },
  ];
  const drip = (x0: number, w: number, y: number, seed: number) => {
    let d = `M${x0} ${y}`;
    const n = Math.round(w / 14);
    for (let i = 0; i < n; i++) {
      const x = x0 + (i + 0.5) * (w / n);
      const len = 8 + ((i * 7 + seed * 3) % 5) * 5;
      d += `L${x - 4} ${y}C${x - 4} ${y + len} ${x + 4} ${y + len} ${x + 4} ${y}`;
    }
    return d + `L${x0 + w} ${y}L${x0 + w} ${y - 10}L${x0} ${y - 10}Z`;
  };
  const cx = 150;
  const top = tiers[2];
  const cs = Array.from({ length: candles }, (_, i) => cx - 36 + (i * 72) / Math.max(1, candles - 1));
  return (
    <svg viewBox="0 0 300 380" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`cr${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#e7cdb4" />
          <stop offset=".3" stopColor="#fbefe2" />
          <stop offset=".7" stopColor="#f6e4cf" />
          <stop offset="1" stopColor="#d8b799" />
        </linearGradient>
        <linearGradient id={`dr${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7d1430" /><stop offset="1" stopColor="#4a0a1c" /></linearGradient>
        <linearGradient id={`au${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8b5e22" /><stop offset=".35" stopColor="#f5d58f" /><stop offset=".6" stopColor="#c99a4a" /><stop offset="1" stopColor="#7a521c" /></linearGradient>
        <radialGradient id={`fh${id}`}><stop offset="0" stopColor="#ffd27a" stopOpacity=".65" /><stop offset="1" stopColor="#ff9d2e" stopOpacity="0" /></radialGradient>
        <linearGradient id={`fl${id}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fffbe8" /><stop offset=".45" stopColor="#ffcb52" /><stop offset="1" stopColor="#e5611f" /></linearGradient>
        <radialGradient id={`ro${id}`} cx=".4" cy=".35"><stop offset="0" stopColor="#f3a7b5" /><stop offset=".6" stopColor="#c23a58" /><stop offset="1" stopColor="#7d1430" /></radialGradient>
      </defs>
      {/* stand */}
      <ellipse cx={cx} cy="334" rx="130" ry="12" fill={`url(#au${id})`} />
      <path d="M138 344h24l10 26h-44z" fill={`url(#au${id})`} />
      <ellipse cx={cx} cy="372" rx="44" ry="7" fill={`url(#au${id})`} />
      {/* tiers */}
      {tiers.map((t, i) => {
        const x = cx - t.w / 2;
        return (
          <g key={i}>
            <rect x={x} y={t.y} width={t.w} height={t.h} rx="6" fill={`url(#cr${id})`} />
            <path d={drip(x, t.w, t.y + 10, i)} fill={`url(#dr${id})`} />
            <ellipse cx={cx} cy={t.y} rx={t.w / 2} ry="7" fill="#5e0d24" />
            {Array.from({ length: Math.round(t.w / 9) }, (_, k) => <circle key={k} cx={x + 4 + k * 9} cy={t.y + t.h - 2} r="3.4" fill="#fff8ee" stroke="#e2c9ae" strokeWidth=".5" />)}
            {/* gold leaf flecks */}
            {[0.2, 0.55, 0.8].map((f, k) => <path key={k} d={`M${x + t.w * f} ${t.y + 34 + k * 6}l6-3 4 5-5 4-6-1z`} fill={`url(#au${id})`} opacity=".9" />)}
          </g>
        );
      })}
      {/* sugar roses cascading */}
      {[[96, 252], [110, 240], [204, 184], [190, 176], [118, 124]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={i % 2 ? 9 : 11} fill={`url(#ro${id})`} />
          <path d="M-5 -1c2-5 9-5 10 0-3-2-7-2-10 0zM-6 3c3 3 9 3 12 0" stroke="#5e0d24" strokeWidth=".9" fill="none" />
          <path d="M8 6c8 2 12 8 12 12-6-2-10-6-12-12z" fill="#3e5a3a" />
        </g>
      ))}
      {/* candles */}
      {cs.map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y={top.y - 46} width="6" height="46" rx="1.5" fill="#fbefe2" />
          <path d={`M${x - 3} ${top.y - 40}l6 6M${x - 3} ${top.y - 28}l6 6M${x - 3} ${top.y - 16}l6 6`} stroke="#c99a4a" strokeWidth="1.2" />
          <path d={`M${x} ${top.y - 46}v-5`} stroke="#3a2a20" strokeWidth="1" />
          <g data-flame style={{ opacity: lit ? 1 : 0, transformOrigin: `${x}px ${top.y - 50}px`, transformBox: "view-box" }}>
            <circle cx={x} cy={top.y - 60} r="16" fill={`url(#fh${id})`} />
            <path className="vc-flame" style={{ animationDelay: `${i * 0.27}s`, transformOrigin: `${x}px ${top.y - 50}px` }} d={`M${x} ${top.y - 50}c-4.5-5-4.5-12 0-20 4.5 8 4.5 15 0 20z`} fill={`url(#fl${id})`} />
          </g>
          <path data-smoke d={`M${x} ${top.y - 52}c-6-8 6-14 0-22s6-14 0-22`} stroke="#e8d8d0" strokeOpacity=".7" strokeWidth="1.4" fill="none" strokeLinecap="round" style={{ opacity: 0 }} />
        </g>
      ))}
    </svg>
  );
}

/** Velvet drape — heavy folds for the sides of a stage. viewBox 160×600. */
export function Drape({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 160 600" preserveAspectRatio="none" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <defs>
        <linearGradient id={`v${id}`} x1="0" x2="1">
          {[0, 0.12, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 1].map((o, i) => <stop key={i} offset={o} stopColor={i % 2 ? "#7d1430" : "#2f0612"} />)}
        </linearGradient>
        <linearGradient id={`t${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8b5e22" /><stop offset=".5" stopColor="#f5d58f" /><stop offset="1" stopColor="#8b5e22" /></linearGradient>
      </defs>
      <path d="M0 0h160c-10 120-40 250-46 380-4 80 6 160 16 220H0z" fill={`url(#v${id})`} />
      <path d="M100 360c20 6 36 0 44-8" stroke={`url(#t${id})`} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="146" cy="352" r="6" fill={`url(#t${id})`} />
    </svg>
  );
}

export const VC_CSS = `
.vc-velvet{background-color:#2b0b14;background-image:radial-gradient(60% 50% at 50% 38%,rgba(255,170,150,.16),transparent 70%),repeating-linear-gradient(115deg,rgba(255,255,255,.018) 0 2px,transparent 2px 5px),radial-gradient(120% 90% at 50% 120%,#4a0f22,#1c050c 70%)}
.vc-foil{background:linear-gradient(100deg,#8b5e22 0%,#f5d58f 22%,#c99a4a 40%,#fff1c9 52%,#a77a33 66%,#f1cf86 84%,#8b5e22 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.vc-shine{animation:vcShine 7s ease-in-out infinite}
@keyframes vcShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.vc-flame{animation:vcFl 1.7s ease-in-out infinite}
@keyframes vcFl{0%,100%{transform:scale(1) skewX(0)}30%{transform:scale(.92,1.08) skewX(3deg)}60%{transform:scale(1.05,.95) skewX(-3deg)}}
.vc-iris{animation:vcIris 1.8s cubic-bezier(.7,0,.25,1) .4s both}
@keyframes vcIris{from{clip-path:circle(0% at 50% 46%)}to{clip-path:circle(150% at 50% 46%)}}
.vc-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.vc-shine,.vc-flame{animation:none!important}.vc-iris{animation:none!important;clip-path:none!important}}
`;
