import { useId, type CSSProperties } from "react";

// Gulaal — Holi in full colour: soft clouds of powder (feTurbulence-edged), splatter, a brass thali of gulaal
// mounds with marigolds, and a little clay matki. Colours are the classic five: rani pink, saffron, leaf green,
// turquoise and haldi yellow.

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
export const HOLI = { pink: "#e8337f", saffron: "#ff8a1f", green: "#2fae4e", blue: "#1fa7c9", yellow: "#ffd23a", violet: "#8a3ffc" };
const r2 = (n: number) => Math.round(n * 100) / 100;

/** A drifting cloud of powder. */
export function Cloud({ className, style, color = HOLI.pink, seed = 3 }: { className?: string; style?: CSSProperties; color?: string; seed?: number }) {
  const id = useUid();
  const blobs = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + seed;
    const d = 26 + ((i * 7 + seed * 5) % 4) * 9;
    return { x: r2(100 + d * Math.cos(a)), y: r2(100 + d * Math.sin(a) * 0.8), r: 30 + ((i * 11 + seed) % 5) * 7 };
  });
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <filter id={`p${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="5" />
        </filter>
        <radialGradient id={`g${id}`}><stop offset="0" stopColor={color} stopOpacity=".95" /><stop offset=".7" stopColor={color} stopOpacity=".55" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient>
      </defs>
      <g filter={`url(#p${id})`}>{blobs.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={`url(#g${id})`} />)}</g>
      {Array.from({ length: 14 }, (_, i) => { const a = i * 2.4 + seed; const d = 80 + (i % 4) * 14; return <circle key={"s" + i} cx={r2(100 + d * Math.cos(a))} cy={r2(100 + d * Math.sin(a))} r={1.5 + (i % 3) * 1.4} fill={color} opacity=".8" />; })}
    </svg>
  );
}

/** A brass thali with five mounds of gulaal and marigold heads. */
export function Thali({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useUid();
  const mounds = [
    { x: 150, y: 92, c: HOLI.pink }, { x: 96, y: 108, c: HOLI.yellow }, { x: 204, y: 108, c: HOLI.green },
    { x: 118, y: 138, c: HOLI.blue }, { x: 182, y: 138, c: HOLI.saffron },
  ];
  return (
    <svg viewBox="0 0 300 200" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`b${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8a5a1c" /><stop offset=".4" stopColor="#f5d58f" /><stop offset=".7" stopColor="#c8902e" /><stop offset="1" stopColor="#7a4c14" /></linearGradient>
        <radialGradient id={`i${id}`} cx=".5" cy=".4"><stop offset="0" stopColor="#fbe7b0" /><stop offset="1" stopColor="#c8902e" /></radialGradient>
      </defs>
      <ellipse cx="150" cy="176" rx="130" ry="14" fill="#3a1a3a" opacity=".12" />
      <ellipse cx="150" cy="122" rx="140" ry="62" fill={`url(#b${id})`} />
      <ellipse cx="150" cy="116" rx="124" ry="50" fill={`url(#i${id})`} />
      <ellipse cx="150" cy="116" rx="124" ry="50" fill="none" stroke="#8a5a1c" strokeWidth="1.5" strokeDasharray="3 5" />
      {mounds.map((m, i) => (
        <g key={i}>
          <ellipse cx={m.x} cy={m.y + 14} rx="30" ry="9" fill="#5a3410" opacity=".2" />
          <path d={`M${m.x - 30} ${m.y + 12}C${m.x - 24} ${m.y - 10} ${m.x - 8} ${m.y - 24} ${m.x} ${m.y - 24}C${m.x + 8} ${m.y - 24} ${m.x + 24} ${m.y - 10} ${m.x + 30} ${m.y + 12}Z`} fill={m.c} />
          <path d={`M${m.x - 10} ${m.y - 16}C${m.x - 6} ${m.y - 22} ${m.x + 2} ${m.y - 22} ${m.x + 4} ${m.y - 18}`} stroke="#fff" strokeOpacity=".45" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}
      {[[40, 112], [260, 112], [150, 158]].map(([x, y], i) => (
        <g key={"m" + i} transform={`translate(${x} ${y})`}>
          {Array.from({ length: 10 }, (_, k) => <circle key={k} cx={r2(7 * Math.cos(k * 0.63))} cy={r2(7 * Math.sin(k * 0.63))} r="5" fill={k % 2 ? "#ff9a1f" : "#ffb43a"} />)}
          <circle r="4" fill="#d66a0a" />
        </g>
      ))}
    </svg>
  );
}

/** A clay matki splashed with colour — the section ornament. */
export function Matki({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden overflow="visible">
      <path d="M30 22h40l-4 10C84 40 90 56 84 72C78 88 64 94 50 94S22 88 16 72C10 56 16 40 34 32Z" fill="#b5532a" />
      <path d="M30 22h40" stroke="#7a3014" strokeWidth="4" strokeLinecap="round" />
      <path d="M18 60C36 66 64 66 82 60" stroke="#ffd23a" strokeWidth="3" fill="none" />
      <path d="M20 70C38 76 62 76 80 70" stroke="#2fae4e" strokeWidth="2" fill="none" strokeDasharray="2 4" strokeLinecap="round" />
      <circle cx="40" cy="44" r="7" fill={HOLI.pink} opacity=".85" /><circle cx="62" cy="80" r="6" fill={HOLI.blue} opacity=".8" /><circle cx="70" cy="46" r="4" fill={HOLI.yellow} />
      {[[50, 10, HOLI.pink], [38, 4, HOLI.yellow], [62, 2, HOLI.green]].map(([x, y, c], i) => <circle key={i} cx={x as number} cy={y as number} r="4" fill={c as string} />)}
    </svg>
  );
}

export const GL_CSS = `
.gl-paper{background-color:#fffaf3;background-image:radial-gradient(40% 30% at 12% 18%,rgba(232,51,127,.10),transparent 70%),radial-gradient(40% 30% at 88% 28%,rgba(31,167,201,.10),transparent 70%),radial-gradient(50% 35% at 50% 100%,rgba(255,138,31,.12),transparent 70%)}
.gl-ink{background:linear-gradient(95deg,#e8337f 0%,#ff8a1f 30%,#ffb000 48%,#2fae4e 68%,#1fa7c9 86%,#8a3ffc 100%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:glShift 8s ease-in-out infinite}
@keyframes glShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.gl-drift{animation:glDrift 9s ease-in-out infinite}
@keyframes glDrift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(10px,-12px) scale(1.06)}}
.gl-paper [style*="cf-brico"]{font-weight:800;letter-spacing:-.01em}
.gl-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.gl-drift,.gl-ink{animation:none!important}}
`;
