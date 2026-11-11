import { useId, type CSSProperties } from "react";

/** Trig rounded so server and client render identical SVG attributes. */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

// Mehndi Mimosa — an open palm in fresh henna (every stroke data-draw, so the opening can ink it in), a marigold
// and mango-leaf toran across the top, and a jasmine-and-marigold posy for small spaces.

const HENNA = "#7a2a14";

/** Hennaed palm. viewBox 200×300. */
export function Palm({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  const fingers: [number, number, number, number][] = [
    // x, y(top), height, rotation
    [62, 40, 104, -8],
    [88, 18, 120, -2],
    [114, 22, 116, 4],
    [138, 44, 98, 10],
  ];
  return (
    <svg viewBox="0 0 200 300" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`sk${u}`} cx=".5" cy=".45"><stop offset="0" stopColor="#f7d9bd" /><stop offset="1" stopColor="#e3b28b" /></radialGradient>
      </defs>
      <g fill={`url(#sk${u})`}>
        {fingers.map(([x, y, h, r], i) => <rect key={i} x={x - 11} y={y} width="22" height={h} rx="11" transform={`rotate(${r} ${x} ${y + h})`} />)}
        <rect x="30" y="122" width="22" height="88" rx="11" transform="rotate(-38 41 210)" />
        <path d="M48 130c10-14 100-14 112 0 10 30 8 74-6 104-6 14-12 30-12 66H66c0-36-8-52-14-66-12-30-14-74-4-104z" />
      </g>
      <g stroke={HENNA} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* central mandala */}
        <circle data-draw cx="102" cy="190" r="26" strokeWidth="2" />
        <circle data-draw cx="102" cy="190" r="14" strokeWidth="1.6" />
        <circle cx="102" cy="190" r="5" fill={HENNA} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 102 + r3(Math.cos(a)) * 26, y1 = 190 + r3(Math.sin(a)) * 26;
          const x2 = 102 + r3(Math.cos(a)) * 38, y2 = 190 + r3(Math.sin(a)) * 38;
          const xa = 102 + r3(Math.cos(a - 0.22)) * 30, ya = 190 + r3(Math.sin(a - 0.22)) * 30;
          const xb = 102 + r3(Math.cos(a + 0.22)) * 30, yb = 190 + r3(Math.sin(a + 0.22)) * 30;
          return <path data-draw key={i} d={`M${x1} ${y1}Q${xa} ${ya} ${x2} ${y2}Q${xb} ${yb} ${x1} ${y1}`} strokeWidth="1.4" />;
        })}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <circle key={i} cx={102 + r3(Math.cos(a)) * 20} cy={190 + r3(Math.sin(a)) * 20} r="1.3" fill={HENNA} stroke="none" />;
        })}
        {/* paisley on the lower palm */}
        <path data-draw d="M84 250c-14-6-14-26 4-28 16-2 22 18 10 30-6 6-4 14 4 16" strokeWidth="1.6" />
        <path data-draw d="M120 250c14-6 14-26-4-28-16-2-22 18-10 30 6 6 4 14-4 16" strokeWidth="1.6" />
        {/* wrist bands */}
        <path data-draw d="M66 278c22 6 54 6 76 0M66 288c22 6 54 6 76 0" strokeWidth="1.6" />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={72 + i * 8} cy={283 + r3(Math.sin(i)) * 0.6} r="1.4" fill={HENNA} stroke="none" />)}
        {/* finger tips + bands */}
        {fingers.map(([x, y, h, r], i) => (
          <g key={i} transform={`rotate(${r} ${x} ${y + h})`}>
            <path d={`M${x - 11} ${y + 18}a11 11 0 0 1 22 0z`} fill={HENNA} stroke="none" />
            <path data-draw d={`M${x - 9} ${y + 36}h18M${x - 9} ${y + 42}h18`} strokeWidth="1.3" />
            <path data-draw d={`M${x} ${y + 50}l-6 10 6 10 6-10z`} strokeWidth="1.2" />
            {[0, 1, 2].map((k) => <circle key={k} cx={x} cy={y + 78 + k * 8} r="1.3" fill={HENNA} stroke="none" />)}
          </g>
        ))}
        <g transform="rotate(-38 41 210)">
          <path d="M30 140a11 11 0 0 1 22 0z" fill={HENNA} stroke="none" />
          <path data-draw d="M32 160h18M32 166h18" strokeWidth="1.3" />
        </g>
        {/* vine up to the index finger */}
        <path data-draw d="M102 152c-4-10-10-14-14-24" strokeWidth="1.3" />
        {[[96, 142], [90, 132]].map(([x, y], i) => <path key={i} data-draw d={`M${x} ${y}c-8-2-10-8-8-12 6 0 10 4 8 12z`} strokeWidth="1.1" />)}
      </g>
    </svg>
  );
}

function Marigold({ x, y, r, c = "#f0a024" }: { x: number; y: number; r: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx="0" cy={-r * 0.55} rx={r * 0.32} ry={r * 0.5} transform={`rotate(${i * 26})`} fill={c} stroke="#c66a10" strokeWidth=".5" />)}
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="0" cy={-r * 0.28} rx={r * 0.24} ry={r * 0.32} transform={`rotate(${i * 45 + 12})`} fill="#f7c24a" stroke="#c66a10" strokeWidth=".4" />)}
      <circle r={r * 0.16} fill="#b8560c" />
    </g>
  );
}

/** Marigold & mango-leaf toran: a swag across the top. viewBox 600×120, preserveAspectRatio none-safe. */
export function Toran({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const pts = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14;
    return [20 + t * 560, 18 + r3(Math.sin(t * Math.PI)) * 46] as const;
  });
  return (
    <svg viewBox="0 0 600 130" className={className} style={style} aria-hidden overflow="visible">
      <path d="M20 18Q300 110 580 18" stroke="#6b8a3a" strokeWidth="2" fill="none" />
      {pts.map(([x, y], i) => (
        <g key={i} data-toran>
          {i % 2 === 0 && <path d={`M${x} ${y}c-6 18-4 40 0 52 4-12 6-34 0-52z`} fill="#4f7a2e" stroke="#35571d" strokeWidth=".6" />}
          {i % 2 === 1 && <><line x1={x} y1={y} x2={x} y2={y + 34} stroke="#c66a10" strokeWidth="1" /><Marigold x={x} y={y + 40} r={7} c="#e8962e" /></>}
          <Marigold x={x} y={y} r={11} c={i % 3 === 0 ? "#e8962e" : "#f0a024"} />
        </g>
      ))}
    </svg>
  );
}

/** Small posy: marigolds + jasmine buds. viewBox 120×120. */
export function Posy({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden overflow="visible">
      <path d="M60 64c-24 4-36 24-34 40 14-8 26-20 34-40zM60 64c24 4 36 24 34 40-14-8-26-20-34-40z" fill="#5d8a35" />
      <Marigold x={44} y={52} r={20} c="#e8962e" />
      <Marigold x={78} y={50} r={18} />
      <Marigold x={60} y={30} r={18} c="#f3b13c" />
      {[[30, 76], [92, 74], [60, 74], [24, 40], [96, 34]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 50})`}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-4" rx="2.6" ry="4.6" transform={`rotate(${a})`} fill="#fffaf0" stroke="#d9cbb0" strokeWidth=".4" />)}
          <circle r="1.4" fill="#f3c33c" />
        </g>
      ))}
    </svg>
  );
}

/** Thin paisley border line for dividers. viewBox 140×24. */
export function Paisleys({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 24" className={className} aria-hidden>
      <path d="M4 12h44M92 12h44" stroke="#c99a4a" strokeWidth="1" />
      <path d="M70 4c-8 0-10 10-2 14 6 3 10-2 8-6-1-3-5-3-6 0" fill="none" stroke="#6b1530" strokeWidth="1.4" />
      <circle cx="56" cy="12" r="2" fill="#e8962e" />
      <circle cx="84" cy="12" r="2" fill="#e8962e" />
    </svg>
  );
}

export const MM_CSS = `
.evmm-root{background-color:#fff6e8;background-image:radial-gradient(70% 45% at 50% 0%,rgba(240,160,36,.18),transparent 70%),radial-gradient(50% 40% at 0% 100%,rgba(107,21,48,.08),transparent 70%)}
.evmm-foil{background:linear-gradient(100deg,#6b1530 0%,#a02a4a 28%,#c98a2a 50%,#6b1530 72%,#a02a4a 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.evmm-shine{animation:evmmShine 8s ease-in-out infinite}
@keyframes evmmShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.evmm-sway{transform-origin:50% 0;animation:evmmSway 6s ease-in-out infinite}
@keyframes evmmSway{0%,100%{transform:rotate(-.6deg)}50%{transform:rotate(.6deg)}}
@media (prefers-reduced-motion: reduce){.evmm-shine,.evmm-sway{animation:none!important}}
`;
