import { useId, type CSSProperties } from "react";

/** Trig rounded so server and client render identical SVG attributes. */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

// Long Table — one long linen table in perspective under a Goan villa arch: an olive-branch runner, terracotta
// bud vases and pairs of taper candles receding into the dusk (each flame data-flame, lit near→far on open).

/** The table scene. viewBox 400×200 (y 100–300). */
export function Table({ className = "", style, lit = true }: { className?: string; style?: CSSProperties; lit?: boolean }) {
  const u = useId().replace(/:/g, "");
  // candle rows: t = depth 0 (near) → 1 (far)
  const rows = [0, 0.22, 0.42, 0.6, 0.76, 0.9];
  const at = (t: number, side: -1 | 1) => {
    const y = 270 - t * 150;
    const half = 150 - t * 110;
    return { x: 200 + side * half * 0.62, y, s: 1 - t * 0.72 };
  };
  return (
    <svg viewBox="0 96 400 206" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`cl${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe2cf" /><stop offset="1" stopColor="#fbf5ea" /></linearGradient>
        <linearGradient id={`dr${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e3d2b8" /><stop offset="1" stopColor="#cdb795" /></linearGradient>
        <radialGradient id={`gl${u}`}><stop offset="0" stopColor="#ffd98a" stopOpacity=".7" /><stop offset="1" stopColor="#ffb347" stopOpacity="0" /></radialGradient>
        <linearGradient id={`fl${u}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fffbe8" /><stop offset=".5" stopColor="#ffc44d" /><stop offset="1" stopColor="#e2601c" /></linearGradient>
      </defs>
      {/* tabletop trapezoid + drop */}
      <path d="M50 280L160 118h80l110 162z" fill={`url(#cl${u})`} />
      <path d="M50 280h300v18H50z" fill={`url(#dr${u})`} />
      <path d="M160 118h80" stroke="#d9c6a8" strokeWidth="1" />
      {/* olive runner */}
      <path d="M200 120C190 160 214 200 196 240S206 280 200 290" stroke="#6f7f4a" strokeWidth="2" fill="none" />
      {Array.from({ length: 22 }, (_, i) => {
        const t = i / 21;
        const y = 122 + t * 166;
        const s = 0.35 + t * 0.85;
        const x = 200 + r3(Math.sin(t * 9)) * 8 * s;
        return <ellipse key={i} cx={x + (i % 2 ? 6 : -6) * s} cy={y} rx={7 * s} ry={2.6 * s} transform={`rotate(${i % 2 ? 30 : -30} ${x} ${y})`} fill={i % 3 ? "#8a9a5b" : "#a7b37a"} />;
      })}
      {[0.3, 0.55, 0.8].map((t, i) => <circle key={i} cx={200 + (i % 2 ? 7 : -7)} cy={122 + t * 166} r={2.4 + t * 2} fill="#3f4a2a" />)}
      {/* terracotta bud vases + plates */}
      {[0.12, 0.5, 0.82].map((t, i) => {
        const L = at(t, -1), R = at(t, 1);
        return (
          <g key={i}>
            {[L, R].map((p, k) => <ellipse key={k} cx={p.x + (k ? -22 : 22) * p.s} cy={p.y + 6 * p.s} rx={18 * p.s} ry={5 * p.s} fill="#fffaf0" stroke="#d9c6a8" strokeWidth=".6" />)}
            {(() => { const y = 270 - t * 150, k = 1 - t * 0.7, x = 200 + (i % 2 ? 14 : -14) * k; return (
              <g transform={`translate(${x} ${y}) scale(${k})`}>
                <path d="M-5 0c-3-6-2-11 2-13h6c4 2 5 7 2 13z" fill="#c0643a" />
                <path d="M0 -13c-2-6-6-10-10-12M0 -13c1-7 4-11 9-13" stroke="#6f7f4a" strokeWidth="1" fill="none" />
                <circle cx="-10" cy="-25" r="3.2" fill="#c8336a" /><circle cx="9" cy="-26" r="3" fill="#e46a96" /><circle cx="0" cy="-17" r="2.4" fill="#c8336a" />
              </g>); })()}
          </g>
        );
      })}
      {/* candle pairs */}
      {rows.map((t, i) => ([-1, 1] as const).map((side) => {
        const p = at(t, side);
        const h = 54 * p.s, w = 5 * p.s;
        return (
          <g key={`${i}${side}`}>
            <ellipse cx={p.x} cy={p.y} rx={7 * p.s} ry={2.2 * p.s} fill="#b78b4a" />
            <rect x={p.x - w / 2} y={p.y - h} width={w} height={h} rx={w / 3} fill="#f8f0e0" />
            <g data-flame data-depth={i} style={{ opacity: lit ? 1 : 0, transformOrigin: `${p.x}px ${p.y - h}px`, transformBox: "view-box" }}>
              <circle cx={p.x} cy={p.y - h - 6 * p.s} r={16 * p.s} fill={`url(#gl${u})`} />
              <path className="evfe-flame" style={{ animationDelay: `${(i + side) * 0.31}s`, transformOrigin: `${p.x}px ${p.y - h}px` }} d={`M${p.x} ${p.y - h}c${-3.5 * p.s} ${-4 * p.s} ${-3.5 * p.s} ${-10 * p.s} 0 ${-16 * p.s} ${3.5 * p.s} ${6 * p.s} ${3.5 * p.s} ${12 * p.s} 0 ${16 * p.s}z`} fill={`url(#fl${u})`} />
            </g>
          </g>
        );
      }))}
    </svg>
  );
}

/** A villa arch with bougainvillea — frames the hero. viewBox 400×520, preserveAspectRatio none-safe. */
export function VillaArch({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 400 520" className={className} style={style} aria-hidden preserveAspectRatio="none">
      <path d="M0 0h400v520H0z M40 520V200C40 100 110 40 200 40s160 60 160 160v320z" fill="#efe1cd" fillRule="evenodd" />
      <path d="M40 520V200C40 100 110 40 200 40s160 60 160 160v320" stroke="#c0643a" strokeWidth="3" fill="none" />
      <path d="M52 520V204C52 112 116 54 200 54s148 58 148 150v316" stroke="#d6b07a" strokeWidth="1" fill="none" />
      {Array.from({ length: 26 }, (_, i) => {
        const a = Math.PI + (i / 25) * Math.PI * 0.55;
        const x = 200 + r3(Math.cos(a)) * 168, y = 200 + r3(Math.sin(a)) * 160;
        return <circle key={i} cx={x + (i % 3) * 4} cy={y - (i % 2) * 6} r={6 + (i % 3) * 2} fill={i % 4 ? "#c8336a" : "#e46a96"} opacity=".9" />;
      })}
      {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={30 + (i % 3) * 8} cy={150 + i * 9} rx="7" ry="4" fill="#5f7a3a" transform={`rotate(${i * 30} ${30 + (i % 3) * 8} ${150 + i * 9})`} />)}
    </svg>
  );
}

/** Olive sprig. viewBox 140×40. */
export function Olive({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 140 40" className={className} style={style} aria-hidden>
      <path d="M8 26C50 18 90 18 132 12" stroke="#6f7f4a" strokeWidth="1.6" fill="none" />
      {[20, 36, 52, 68, 84, 100, 116].map((x, i) => <ellipse key={i} cx={x} cy={i % 2 ? 16 : 30} rx="8" ry="3" fill={i % 2 ? "#8a9a5b" : "#a7b37a"} transform={`rotate(${i % 2 ? -24 : 18} ${x} ${i % 2 ? 16 : 30})`} />)}
      <circle cx="60" cy="25" r="3.4" fill="#3f4a2a" /><circle cx="94" cy="20" r="3" fill="#3f4a2a" />
    </svg>
  );
}

/** One taper candle in a brass holder. viewBox 40×120. */
export function Taper({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 40 120" className={className} style={style} aria-hidden overflow="visible">
      <defs><linearGradient id={`tf${u}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fffbe8" /><stop offset=".5" stopColor="#ffc44d" /><stop offset="1" stopColor="#e2601c" /></linearGradient></defs>
      <circle cx="20" cy="18" r="14" fill="#ffd98a" opacity=".35" />
      <path className="evfe-flame" style={{ transformOrigin: "20px 26px" }} d="M20 26c-5-6-5-14 0-22 5 8 5 16 0 22z" fill={`url(#tf${u})`} />
      <rect x="16" y="26" width="8" height="70" rx="2" fill="#f8f0e0" />
      <path d="M8 100h24l-4 8h-16z" fill="#b78b4a" /><ellipse cx="20" cy="112" rx="14" ry="4" fill="#b78b4a" />
    </svg>
  );
}

export const LT_CSS = `
.evfe-root{background-color:#f6ecdf;background-image:radial-gradient(70% 50% at 50% 0%,rgba(192,100,58,.14),transparent 70%),radial-gradient(60% 40% at 50% 100%,rgba(111,127,74,.12),transparent 70%)}
.evfe-dusk{background:linear-gradient(180deg,#2f2433 0%,#6d3d3a 38%,#c0643a 70%,#e8b07a 100%)}
.evfe-foil{background:linear-gradient(100deg,#8a3a1e 0%,#c0643a 30%,#8a9a5b 55%,#8a3a1e 80%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.evfe-shine{animation:evfeShine 9s ease-in-out infinite}
@keyframes evfeShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.evfe-flame{animation:evfeFl 1.8s ease-in-out infinite}
@keyframes evfeFl{0%,100%{transform:scale(1) skewX(0)}35%{transform:scale(.9,1.08) skewX(3deg)}65%{transform:scale(1.05,.95) skewX(-3deg)}}
@media (prefers-reduced-motion: reduce){.evfe-flame,.evfe-shine{animation:none!important}}
`;
