import { useId } from "react";

// День рождения — Gzhel: single-load cobalt brushstrokes on white porcelain. Tonal petals (dark → light in one stroke),
// the Gzhel rose, tendrils with dots, a scalloped plate rim and a porcelain teapot.

const COB = "#1c46b5";
const DEEP = "#0f2a6b";

function StrokeDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`p${id}`} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor={DEEP} />
        <stop offset=".45" stopColor={COB} />
        <stop offset="1" stopColor="#dfe8fb" />
      </linearGradient>
      <linearGradient id={`q${id}`} x1="1" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor={DEEP} />
        <stop offset=".5" stopColor={COB} />
        <stop offset="1" stopColor="#e9effc" />
      </linearGradient>
      <filter id={`b${id}`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
      </filter>
    </defs>
  );
}

const PETAL = "M0 0C-15-8-21-34-4-56C1-60 4-58 6-54C14-34 12-10 0 0Z";

/** The Gzhel rose. viewBox 200×200. data-petal on each stroke for bloom animation. */
export function GzhelRose({ className = "", style, leaves = true }: { className?: string; style?: React.CSSProperties; leaves?: boolean }) {
  const id = useId().replace(/:/g, "");
  const ring = (n: number, s: number, off: number, g: string, r0 = 0) =>
    Array.from({ length: n }, (_, i) => (
      <path key={`${s}-${i}`} data-petal d={PETAL} fill={`url(#${g}${id})`} transform={`translate(100 100) rotate(${off + (i * 360) / n}) translate(0 ${-r0}) scale(${s})`} />
    ));
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden overflow="visible">
      <StrokeDefs id={id} />
      <g filter={`url(#b${id})`}>
        {leaves && (
          <g data-leaves>
            {[[-150, 1.1], [-30, 1.1], [150, 0.9], [30, 0.9], [90, 1]].map(([a, s], i) => (
              <g key={i} transform={`translate(100 100) rotate(${a}) translate(0 -74) scale(${s})`}>
                <path d="M0 0C-10-6-14-26-2-44C10-26 8-6 0 0Z" fill={`url(#${i % 2 ? "q" : "p"}${id})`} />
                <path d="M0 -6C14-20 26-24 38-22" stroke={COB} strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <circle cx="40" cy="-22" r="2.2" fill={COB} /><circle cx="46" cy="-17" r="1.5" fill={COB} />
              </g>
            ))}
          </g>
        )}
        {ring(10, 1, 0, "p", 6)}
        {ring(8, 0.72, 22, "q", 2)}
        {ring(6, 0.46, 0, "p")}
        <path d="M92 100c2-10 14-12 16-2-6-4-12-2-16 2z" fill={DEEP} />
        <circle cx="100" cy="102" r="3.4" fill={DEEP} />
      </g>
    </svg>
  );
}

/** Tendril border: a wavy cobalt vine with tonal brush petals at each crest and berry dots. viewBox 240×30. */
export function GzhelBorder({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  let d = "M0 15";
  for (let i = 0; i < 8; i++) d += `q7.5 ${i % 2 ? 8 : -8} 15 0t15 0`;
  return (
    <svg viewBox="0 0 240 30" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden>
      <StrokeDefs id={id} />
      <path d={d} stroke={COB} strokeWidth="1.2" fill="none" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 7.5 + i * 15;
        const up = (Math.floor(i / 1) % 2 === 0) !== (Math.floor(i / 2) % 2 === 1);
        const y = 15 + (i % 2 ? 0 : up ? -4 : 4);
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M0 0C-4-3-6-10-1-14C4-10 3-3 0 0Z" fill={`url(#${i % 2 ? "p" : "q"}${id})`} transform={`rotate(${i % 2 ? 140 : -40}) scale(.85)`} />
            {i % 2 === 0 && <circle cx="4" cy={up ? 7 : -7} r="1.2" fill={COB} />}
          </g>
        );
      })}
    </svg>
  );
}

/** Scalloped porcelain plate rim with lattice ("сеточка") band — a ring that frames content. viewBox 300×300. */
export function PlateRim({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const scallops = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    return <circle key={i} cx={150 + Math.cos(a) * 138} cy={150 + Math.sin(a) * 138} r="9" fill="#fff" stroke={COB} strokeWidth="1.2" />;
  });
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden>
      <defs>
        <pattern id={`net${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0h7M0 0v7" stroke={COB} strokeWidth=".8" />
        </pattern>
        <radialGradient id={`gl${id}`} cx=".38" cy=".3" r=".8"><stop offset="0" stopColor="#fff" /><stop offset=".85" stopColor="#f2f5fc" /><stop offset="1" stopColor="#dde5f6" /></radialGradient>
        <mask id={`m${id}`}><circle cx="150" cy="150" r="136" fill="#fff" /><circle cx="150" cy="150" r="114" fill="#000" /></mask>
      </defs>
      {scallops}
      <circle cx="150" cy="150" r="138" fill={`url(#gl${id})`} />
      <circle cx="150" cy="150" r="136" fill={`url(#net${id})`} mask={`url(#m${id})`} opacity=".85" />
      <circle cx="150" cy="150" r="136" fill="none" stroke={COB} strokeWidth="2.4" />
      <circle cx="150" cy="150" r="114" fill="none" stroke={COB} strokeWidth="2" />
      <circle cx="150" cy="150" r="108" fill="none" stroke={COB} strokeWidth=".8" />
      <ellipse cx="110" cy="80" rx="40" ry="16" fill="#fff" opacity=".6" transform="rotate(-30 110 80)" />
    </svg>
  );
}

/** Gzhel teapot. viewBox 220×180. */
export function Teapot({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 220 180" className={className} aria-hidden>
      <StrokeDefs id={id} />
      <path d="M150 92c22-8 40-30 58-40-6 14-22 40-50 62z" fill="#fff" stroke={COB} strokeWidth="2" />
      <path d="M52 86c-22-4-34 10-30 26 4 14 18 22 34 22" fill="none" stroke={COB} strokeWidth="7" strokeLinecap="round" />
      <path d="M50 60c0-10 24-18 60-18s60 8 60 18c10 18 10 60-10 82-14 16-36 22-50 22s-36-6-50-22c-20-22-20-64-10-82z" fill="#fff" stroke={COB} strokeWidth="2.4" />
      <path d="M70 44c8-12 72-12 80 0" fill="#fff" stroke={COB} strokeWidth="2" />
      <ellipse cx="110" cy="30" rx="10" ry="8" fill={COB} />
      <path d="M58 70c30 8 74 8 104 0M60 150c28 10 72 10 100 0" stroke={COB} strokeWidth="1.4" fill="none" />
      <g transform="translate(110 108) scale(.32) translate(-100 -100)"><GzhelRoseInner id={id} /></g>
    </svg>
  );
}
function GzhelRoseInner({ id }: { id: string }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={PETAL} fill={`url(#p${id})`} transform={`translate(100 100) rotate(${i * 36}) translate(0 -6)`} />)}
      {Array.from({ length: 7 }, (_, i) => <path key={`b${i}`} d={PETAL} fill={`url(#q${id})`} transform={`translate(100 100) rotate(${20 + i * 51}) scale(.6)`} />)}
      <circle cx="100" cy="100" r="5" fill={DEEP} />
    </g>
  );
}

export const DR_CSS = `
.dr-porcelain{background-color:var(--t-bg);background-image:radial-gradient(120% 80% at 30% 0%,#ffffff 0%,transparent 60%),radial-gradient(90% 60% at 100% 100%,rgba(159,183,238,.18),transparent 70%)}
.dr-ink{color:var(--t-accent)}
.dr-flap{animation:drFlap 1.6s cubic-bezier(.7,0,.25,1) 2.2s forwards;transform-origin:50% 0}
@keyframes drFlap{to{transform:perspective(1400px) rotateX(-100deg);opacity:0}}
.dr-spin{animation:drSpin 80s linear infinite}
@keyframes drSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){.dr-flap{display:none}.dr-spin{animation:none!important}}
`;
