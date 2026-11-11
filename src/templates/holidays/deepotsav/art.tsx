import { useId, type CSSProperties } from "react";

// Deepotsav — a Diwali night: brass-rimmed clay diyas (data-flame), a marigold-and-mango-leaf toran,
// hanging akash kandil star lanterns and a lotus kolam drawn in rice-flour dots.

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");

/** One clay diya with a brass rim. `lit` false = an unlit wick (flame scaled to 0 for the lighting moment). */
export function Diya({ className, style, lit = true, flicker = true }: { className?: string; style?: CSSProperties; lit?: boolean; flicker?: boolean }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 120 110" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8642e" /><stop offset=".55" stopColor="#8e3420" /><stop offset="1" stopColor="#4a1810" /></linearGradient>
        <linearGradient id={`b${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8a5a1c" /><stop offset=".4" stopColor="#ffe08a" /><stop offset=".7" stopColor="#c8902e" /><stop offset="1" stopColor="#7a4c14" /></linearGradient>
        <radialGradient id={`f${id}`} cx=".5" cy=".8" r=".7"><stop offset="0" stopColor="#fffdf0" /><stop offset=".35" stopColor="#ffe17a" /><stop offset=".75" stopColor="#ff8c26" /><stop offset="1" stopColor="#e2481e" stopOpacity="0" /></radialGradient>
        <radialGradient id={`g${id}`}><stop offset="0" stopColor="#ffc35e" stopOpacity=".7" /><stop offset=".5" stopColor="#ff8a2a" stopOpacity=".18" /><stop offset="1" stopColor="#ff8a2a" stopOpacity="0" /></radialGradient>
      </defs>
      <g data-glow style={{ opacity: lit ? 1 : 0, transformOrigin: "60px 40px" }}><circle cx="60" cy="40" r="56" fill={`url(#g${id})`} /></g>
      <ellipse cx="60" cy="100" rx="40" ry="5" fill="#000" opacity=".35" />
      <path d="M12 64C16 88 38 98 60 98S104 88 108 64C96 60 24 60 12 64Z" fill={`url(#c${id})`} />
      <path d="M100 62C108 54 114 52 118 50C114 58 110 66 104 70Z" fill="#9e4426" />
      <ellipse cx="60" cy="63" rx="48" ry="8" fill={`url(#b${id})`} />
      <ellipse cx="60" cy="63" rx="42" ry="5.4" fill="#5e2210" />
      <ellipse cx="60" cy="62.6" rx="38" ry="3.6" fill="#e2a43c" opacity=".7" />
      {[24, 38, 52, 66, 80, 94].map((x, i) => <circle key={i} cx={x} cy={80 + (i % 2) * 2} r="2" fill="#ffd27a" opacity=".85" />)}
      <path d="M22 76C40 84 80 84 98 76" fill="none" stroke="#ffd27a" strokeWidth="1.2" strokeDasharray="1 4" strokeLinecap="round" />
      <path d="M106 58L112 55" stroke="#2a1208" strokeWidth="2.4" strokeLinecap="round" />
      <g data-flame style={{ opacity: lit ? 1 : 0 }}>
        <g className={flicker ? "dp-flame" : ""} style={{ transformOrigin: "112px 54px" }}>
          <path d="M112 16C121 31 123 42 112 52C101 42 103 31 112 16Z" fill={`url(#f${id})`} />
          <path d="M112 32C115 38 115 45 112 49C109 45 109 38 112 32Z" fill="#fff" opacity=".9" />
        </g>
      </g>
    </svg>
  );
}

/** A marigold toran: swags of orange and yellow blossoms with mango leaves, for the top edge. */
export function Toran({ className, style, swags = 5 }: { className?: string; style?: CSSProperties; swags?: number }) {
  const W = 1000, sw = W / swags;
  const flowers: React.ReactNode[] = [];
  for (let s = 0; s < swags; s++) {
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const x = s * sw + t * sw;
      const y = 14 + Math.sin(Math.PI * t) * 46;
      const c = (i + s) % 3 === 0 ? "#ffcf3a" : (i + s) % 3 === 1 ? "#f39424" : "#e8661c";
      flowers.push(<g key={`${s}-${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}><circle r="9" fill={c} /><circle r="6" fill={c} stroke="#b84a10" strokeOpacity=".35" strokeDasharray="2 2" /><circle r="2.4" fill="#8a3a0a" opacity=".6" /></g>);
    }
    const hx = s * sw + sw / 2;
    flowers.push(
      <g key={`h${s}`} transform={`translate(${hx} 62)`}>
        {[0, 1, 2, 3].map((k) => <circle key={k} cy={12 + k * 13} r={7 - k * 0.6} fill={k % 2 ? "#ffcf3a" : "#e8661c"} />)}
        <path d="M0 62C-7 72-6 84 0 92C6 84 7 72 0 62Z" fill="#3f7a2c" />
        <path d="M0 64V90" stroke="#a7d27a" strokeWidth="1" />
      </g>,
    );
  }
  const leaves = Array.from({ length: swags * 2 + 1 }, (_, i) => (
    <g key={i} transform={`translate(${(i * sw) / 2} 6) rotate(${i % 2 ? 8 : -8})`}>
      <path d="M0 0C-12 14-12 34 0 46C12 34 12 14 0 0Z" fill={i % 2 ? "#2f6b24" : "#3f8a2e"} />
      <path d="M0 2V44" stroke="#9cd06e" strokeWidth="1.2" />
    </g>
  ));
  return (
    <svg viewBox={`0 0 ${W} 160`} preserveAspectRatio="xMidYMin slice" className={className} style={style} aria-hidden>
      <rect width={W} height="8" fill="#6b3a12" />
      {leaves}
      {flowers}
    </svg>
  );
}

/** An akash kandil — the paper star lantern hung outside homes for Diwali. */
export function Kandil({ className, style, hue = "#e8452c" }: { className?: string; style?: CSSProperties; hue?: string }) {
  const id = useUid();
  const pts = Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 26 : 56; const a = (Math.PI / 5) * i - Math.PI / 2; return `${(60 + r * Math.cos(a)).toFixed(1)},${(110 + r * Math.sin(a)).toFixed(1)}`; }).join(" ");
  return (
    <svg viewBox="0 0 120 230" className={className} style={style} aria-hidden overflow="visible">
      <defs><radialGradient id={`k${id}`}><stop offset="0" stopColor="#fff2b0" /><stop offset=".45" stopColor={hue} /><stop offset="1" stopColor="#5a1020" /></radialGradient></defs>
      <path d="M60 0V54" stroke="#d8b06a" strokeWidth="1.5" />
      <circle cx="60" cy="110" r="70" fill={hue} opacity=".16" className="dp-breathe" />
      <polygon points={pts} fill={`url(#k${id})`} stroke="#ffd27a" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="60" cy="110" r="14" fill="#fff6c8" opacity=".9" />
      {[-14, -5, 4, 13].map((x, i) => <path key={i} d={`M${60 + x} 136C${60 + x * 1.4} 170 ${60 + x * 0.6} 196 ${60 + x * 1.2} ${214 + (i % 2) * 10}`} stroke={i % 2 ? "#ffcf3a" : hue} strokeWidth="2.4" fill="none" strokeLinecap="round" className="dp-sway" />)}
    </svg>
  );
}

/** A lotus kolam in rice-flour dots and strokes, the floor beneath the lamps. */
export function Kolam({ className, style }: { className?: string; style?: CSSProperties }) {
  const ring = (n: number, el: (a: number, i: number) => React.ReactNode) => Array.from({ length: n }, (_, i) => el((i * 360) / n, i));
  return (
    <svg viewBox="-200 -200 400 400" className={className} style={style} aria-hidden>
      <g fill="none" stroke="#fbeed2" strokeLinecap="round" opacity=".9">
        <circle r="186" strokeWidth="1.5" strokeDasharray="1 9" />
        {ring(12, (a, i) => <path key={"o" + i} d="M0-180C30-150 30-112 0-96C-30-112-30-150 0-180Z" transform={`rotate(${a})`} strokeWidth="2.2" stroke={i % 2 ? "#ffcf3a" : "#ff6f8a"} />)}
        {ring(8, (a, i) => <path key={"m" + i} d="M0-118C26-96 26-64 0-46C-26-64-26-96 0-118Z" transform={`rotate(${a + 22.5})`} strokeWidth="2.4" stroke="#fbeed2" />)}
        {ring(8, (a, i) => <path key={"i" + i} d="M0-80C14-66 14-50 0-40C-14-50-14-66 0-80Z" transform={`rotate(${a})`} strokeWidth="2" stroke="#2fc1b0" />)}
        <circle r="34" strokeWidth="2" stroke="#ffcf3a" />
      </g>
      <g fill="#fbeed2">{ring(24, (a, i) => <circle key={i} r="2.6" cx="0" cy="-140" transform={`rotate(${a})`} />)}{ring(16, (a, i) => <circle key={"d" + i} r="2.2" cx="0" cy="-30" transform={`rotate(${a})`} />)}</g>
      <circle r="12" fill="#ff8a2a" />
    </svg>
  );
}

/** The card centrepiece: three lit diyas on a lotus kolam. */
export function DiyaTrio({ className, style, animate = true }: { className?: string; style?: CSSProperties; animate?: boolean }) {
  return (
    <div className={`relative ${className ?? ""}`} style={{ aspectRatio: "1/0.62", ...style }}>
      <Kolam className="absolute inset-x-0 top-[38%] w-full" style={{ transform: "scaleY(.36)", transformOrigin: "50% 0" }} />
      <div className="absolute inset-x-[4%] top-0 flex items-end justify-center">
        <Diya flicker={animate} className="w-[30%] translate-y-[-8%]" />
        <Diya flicker={animate} className="-mx-[3%] w-[38%] translate-y-[-20%]" />
        <Diya flicker={animate} className="w-[30%] translate-y-[-8%] -scale-x-100" />
      </div>
    </div>
  );
}

export const DP_CSS = `
.dp-night{background-color:#1d0f2e;background-image:radial-gradient(70% 40% at 50% 100%,rgba(255,140,40,.28),transparent 70%),radial-gradient(50% 35% at 50% 30%,rgba(140,70,200,.25),transparent 70%),radial-gradient(1.2px 1.2px at 12% 18%,#ffe9b0 60%,transparent),radial-gradient(1px 1px at 72% 12%,#fff 60%,transparent),radial-gradient(1.4px 1.4px at 86% 34%,#ffd27a 60%,transparent),radial-gradient(1px 1px at 30% 40%,#fff 60%,transparent),linear-gradient(180deg,#160a26,#2a1340 60%,#3a1a3a)}
.dp-foil{background:linear-gradient(100deg,#9a6418 0%,#ffe08a 22%,#d29a34 40%,#fff4c6 52%,#b07a22 66%,#ffd77a 84%,#9a6418 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:dpShine 7s ease-in-out infinite}
@keyframes dpShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.dp-flame{animation:dpFl 1.6s ease-in-out infinite}
@keyframes dpFl{0%,100%{transform:scale(1) skewX(0)}30%{transform:scale(.9,1.08) skewX(4deg)}60%{transform:scale(1.05,.94) skewX(-4deg)}}
.dp-sway{animation:dpSway 4s ease-in-out infinite;transform-origin:top}
@keyframes dpSway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
.dp-breathe{animation:dpBr 3.4s ease-in-out infinite}
@keyframes dpBr{0%,100%{opacity:.1}50%{opacity:.28}}
.dp-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.dp-flame,.dp-sway,.dp-breathe,.dp-foil{animation:none!important}}
`;
