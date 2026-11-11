import { useId, type CSSProperties } from "react";

// Midnight Fir — a Goan Christmas Eve: a tall fir wound with a gold garland, glass baubles and fairy lights
// (data-light), a star on top (data-star), holly sprigs, a beeswax candle and slow falling snow.

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");

const TIERS = [
  { y: 70, w: 70, h: 70 },
  { y: 120, w: 120, h: 80 },
  { y: 180, w: 170, h: 90 },
  { y: 245, w: 220, h: 95 },
];
const scallop = (cx: number, y: number, w: number, h: number) => {
  const n = Math.max(3, Math.round(w / 34));
  let d = `M${cx} ${y - h} L${cx + w / 2} ${y}`;
  for (let i = n; i > 0; i--) {
    const x0 = cx - w / 2 + (i * w) / n, x1 = cx - w / 2 + ((i - 1) * w) / n;
    d += ` Q${(x0 + x1) / 2} ${y + 14} ${x1} ${y}`;
  }
  return d + "Z";
};
/** Lights sit along the garland swags; positions are deterministic so SSR and client agree. */
const LIGHTS = TIERS.flatMap((t, ti) => Array.from({ length: 5 + ti * 2 }, (_, i) => {
  const n = 5 + ti * 2, u = (i + 0.5) / n;
  const x = 150 - t.w * 0.42 + u * t.w * 0.84;
  const y = t.y - t.h * 0.42 + u * t.h * 0.3 + Math.sin(u * Math.PI) * 12;
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, c: ["#ffe9a8", "#ffb9a0", "#fff7e0", "#ffd36a"][(i + ti) % 4] };
}));
const BAUBLES = [
  { x: 132, y: 102, r: 7, c: "#c9443b" }, { x: 172, y: 150, r: 8, c: "#d8b66a" }, { x: 118, y: 178, r: 8, c: "#f2ead8" },
  { x: 186, y: 214, r: 9, c: "#c9443b" }, { x: 100, y: 240, r: 9, c: "#d8b66a" }, { x: 152, y: 230, r: 8, c: "#8fb7c9" },
  { x: 210, y: 286, r: 10, c: "#f2ead8" }, { x: 88, y: 300, r: 10, c: "#c9443b" }, { x: 150, y: 312, r: 10, c: "#d8b66a" },
];

/** The fir. `lit` false = lights and star dimmed, ready for the tap. */
export function Fir({ className, style, lit = true, animate = true }: { className?: string; style?: CSSProperties; lit?: boolean; animate?: boolean }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 300 380" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`t${id}`} x1="0" x2="1"><stop offset="0" stopColor="#0c3a2a" /><stop offset=".55" stopColor="#1f6a48" /><stop offset="1" stopColor="#0a2e22" /></linearGradient>
        <linearGradient id={`g${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8a6a26" /><stop offset=".5" stopColor="#f6e2a6" /><stop offset="1" stopColor="#a8822e" /></linearGradient>
        <radialGradient id={`b${id}`} cx=".35" cy=".3"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".25" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#fff3c4" stopOpacity=".95" /><stop offset=".4" stopColor="#ffd36a" stopOpacity=".35" /><stop offset="1" stopColor="#ffd36a" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="150" cy="364" rx="110" ry="10" fill="#000" opacity=".35" />
      <rect x="138" y="330" width="24" height="30" rx="3" fill="#5a3418" />
      <path d="M112 356h76l-8 18h-60Z" fill="#8c2a24" /><path d="M112 356h76" stroke="#d8b66a" strokeWidth="3" />
      {TIERS.map((t, i) => <path key={i} d={scallop(150, t.y + t.h * 0.5, t.w, t.h + 20)} fill={`url(#t${id})`} stroke="#0a2a1e" strokeWidth="1" />)}
      {TIERS.map((t, i) => <path key={"n" + i} d={`M${150 - t.w * 0.3} ${t.y + t.h * 0.3} q${t.w * 0.08} -10 ${t.w * 0.16} 0 M${150 + t.w * 0.06} ${t.y + t.h * 0.36} q${t.w * 0.08} -10 ${t.w * 0.16} 0`} stroke="#3e8f64" strokeWidth="1.6" fill="none" opacity=".6" />)}
      {TIERS.map((t, i) => <path key={"s" + i} d={`M${150 - t.w * 0.44} ${t.y - t.h * 0.44} Q150 ${t.y - t.h * 0.06} ${150 + t.w * 0.44} ${t.y - t.h * 0.14}`} stroke={`url(#g${id})`} strokeWidth="3" fill="none" strokeLinecap="round" />)}
      {BAUBLES.map((b, i) => (
        <g key={"b" + i}><path d={`M${b.x} ${b.y - b.r - 5}v5`} stroke="#d8b66a" strokeWidth="1.2" /><circle cx={b.x} cy={b.y} r={b.r} fill={b.c} /><circle cx={b.x} cy={b.y} r={b.r} fill={`url(#b${id})`} /></g>
      ))}
      {LIGHTS.map((l, i) => (
        <g key={"l" + i} data-light style={{ opacity: lit ? 1 : 0.18 }}>
          <circle className={animate ? "mf-twinkle" : ""} style={{ animationDelay: `${(i % 7) * 0.37}s` }} cx={l.x} cy={l.y} r="7" fill={`url(#h${id})`} />
          <circle cx={l.x} cy={l.y} r="2.2" fill={l.c} />
        </g>
      ))}
      <g data-star style={{ transformOrigin: "150px 26px", opacity: lit ? 1 : 0.45 }}>
        <circle cx="150" cy="26" r="34" fill={`url(#h${id})`} className={animate ? "mf-halo" : ""} />
        <path d="M150 0l7.6 16.4 17.9 2.1-13.2 12.2 3.5 17.7L150 39.6l-15.8 8.8 3.5-17.7-13.2-12.2 17.9-2.1Z" fill={`url(#g${id})`} stroke="#fff3c4" strokeWidth="1" />
      </g>
    </svg>
  );
}

/** A holly sprig — two serrated leaves and three berries. */
export function Holly({ className, style }: { className?: string; style?: CSSProperties }) {
  const leaf = "M0 0C8-6 14-2 20-8C22 0 30 2 34-2C32 6 38 12 44 12C38 16 34 22 36 28C28 24 22 28 18 34C16 26 8 24 2 26C6 18 2 10 0 0Z";
  return (
    <svg viewBox="-50 -30 100 60" className={className} style={style} aria-hidden>
      <path d={leaf} transform="translate(-46 -16) scale(1 .8) rotate(10)" fill="#1f6a48" stroke="#0c3a2a" strokeWidth="1.2" />
      <path d={leaf} transform="translate(46 -16) scale(-1 .8) rotate(10)" fill="#2c7d56" stroke="#0c3a2a" strokeWidth="1.2" />
      {[[-6, 4], [6, 4], [0, -6]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="6.5" fill="#c9443b" /><circle cx={x - 2} cy={y - 2} r="1.8" fill="#fff" opacity=".7" /></g>)}
    </svg>
  );
}

/** A beeswax pillar candle in a holly ring. */
export function Candle({ className, style, animate = true }: { className?: string; style?: CSSProperties; animate?: boolean }) {
  const id = useUid();
  return (
    <svg viewBox="0 0 120 180" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`w${id}`} x1="0" x2="1"><stop offset="0" stopColor="#d9c8a4" /><stop offset=".5" stopColor="#fbf3df" /><stop offset="1" stopColor="#cbb68e" /></linearGradient>
        <radialGradient id={`f${id}`} cx=".5" cy=".8" r=".7"><stop offset="0" stopColor="#fffdf0" /><stop offset=".4" stopColor="#ffe17a" /><stop offset="1" stopColor="#ff8c26" stopOpacity="0" /></radialGradient>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#ffd36a" stopOpacity=".5" /><stop offset="1" stopColor="#ffd36a" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="60" cy="40" r="50" fill={`url(#h${id})`} />
      <rect x="38" y="62" width="44" height="96" rx="4" fill={`url(#w${id})`} />
      <path d="M38 66c8 6 14 0 22 6s16-2 22 2" fill="none" stroke="#fbf3df" strokeWidth="3" />
      <path d="M60 62v-8" stroke="#3a2a1a" strokeWidth="2" />
      <g className={animate ? "mf-flame" : ""} style={{ transformOrigin: "60px 56px" }}><path d="M60 22C68 36 70 46 60 56C50 46 52 36 60 22Z" fill={`url(#f${id})`} /></g>
      <g transform="translate(60 160)">
        <ellipse rx="56" ry="10" fill="#0c3a2a" />
        {[-44, -26, -8, 10, 28, 44].map((x, i) => <path key={i} d="M0 0C6-8 14-8 20-2C14 2 6 4 0 0Z" transform={`translate(${x - 8} ${i % 2 ? -4 : 2}) rotate(${i % 2 ? -14 : 12})`} fill={i % 2 ? "#2c7d56" : "#1f6a48"} />)}
        {[-30, -4, 22, 40].map((x, i) => <circle key={"b" + i} cx={x} cy={i % 2 ? 2 : -4} r="4" fill="#c9443b" />)}
      </g>
    </svg>
  );
}

/** Slow falling snow — pure CSS, deterministic flakes. */
export function Snow({ className = "", count = 36, fall = true }: { className?: string; count?: number; fall?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37) % 100, size = 2 + (i % 4), dur = 9 + (i % 7) * 1.6, delay = -((i * 1.9) % dur);
        return <i key={i} className={fall ? "mf-flake" : "mf-flake mf-flake-still"} style={{ left: `${left}%`, top: fall ? undefined : `${(i * 53) % 100}%`, width: size, height: size, animationDuration: `${dur}s`, animationDelay: `${delay}s`, opacity: 0.35 + (i % 5) * 0.12 }} />;
      })}
    </div>
  );
}

export const MF_CSS = `
.mf-night{background-color:#0d241e;background-image:radial-gradient(60% 45% at 50% 40%,rgba(255,211,106,.12),transparent 70%),radial-gradient(120% 80% at 50% 120%,#173b30,#0a1d18 70%)}
.mf-foil{background:linear-gradient(100deg,#8a6a26 0%,#f6e2a6 24%,#c7a24e 42%,#fff6d8 54%,#a8822e 68%,#f1d58e 86%,#8a6a26 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:mfShine 8s ease-in-out infinite}
@keyframes mfShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.mf-twinkle{animation:mfTw 2.6s ease-in-out infinite}
@keyframes mfTw{0%,100%{opacity:1}50%{opacity:.35}}
.mf-halo{animation:mfHalo 3.2s ease-in-out infinite;transform-origin:150px 26px}
@keyframes mfHalo{0%,100%{transform:scale(.9);opacity:.8}50%{transform:scale(1.15);opacity:1}}
.mf-flame{animation:mfFl 1.7s ease-in-out infinite}
@keyframes mfFl{0%,100%{transform:scale(1) skewX(0)}35%{transform:scale(.92,1.07) skewX(3deg)}65%{transform:scale(1.04,.95) skewX(-3deg)}}
.mf-flake{position:absolute;top:-10px;border-radius:50%;background:#fff;animation-name:mfFall;animation-timing-function:linear;animation-iteration-count:infinite}
@keyframes mfFall{from{transform:translate3d(0,-10px,0)}50%{transform:translate3d(14px,50vh,0)}to{transform:translate3d(-6px,110vh,0)}}
[data-kind] .mf-flake{animation-name:mfFallCard}
@keyframes mfFallCard{from{transform:translate3d(0,-10px,0)}to{transform:translate3d(8px,200cqw,0)}}
.mf-flake-still{animation:none!important}
.mf-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.mf-twinkle,.mf-halo,.mf-flame,.mf-flake,.mf-foil{animation:none!important}}
`;
