import { useId } from "react";

const rd = (v: number) => Math.round(v * 100) / 100;

/** A champagne-coupe tower (4·3·2·1) that fills from the top down, with a pouring bottle. */
export function CoupeTower({ className = "", animate = true, rows = 4, bottle = true }: { className?: string; animate?: boolean; rows?: number; bottle?: boolean }) {
  const id = useId().replace(/:/g, "");
  const W = 110, H = 64, top = bottle ? 150 : 20;
  const coupes: { x: number; y: number; r: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const n = r + 1;
    for (let k = 0; k < n; k++) coupes.push({ x: rd(240 + (k - (n - 1) / 2) * W), y: top + r * H, r });
  }
  const height = top + rows * H + 40;
  return (
    <svg viewBox={`0 0 480 ${height}`} className={className} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbe7b0" /><stop offset=".45" stopColor="#b8913f" /><stop offset=".7" stopColor="#f5dc9a" /><stop offset="1" stopColor="#8f6e2c" /></linearGradient>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff4c9" /><stop offset="1" stopColor="#d9a947" /></linearGradient>
      </defs>
      {bottle && (
        <g transform="translate(300 30) rotate(225)">
          <path d="M-14 -40 h28 v28 q16 12 16 40 v80 h-60 v-80 q0 -28 16 -40z" fill="#1c2a1e" stroke={`url(#${id}-g)`} strokeWidth="1.5" />
          <rect x="-16" y="40" width="32" height="34" fill={`url(#${id}-g)`} opacity=".9" />
          <path d="M-14 -40 h28 v16 h-28z" fill={`url(#${id}-g)`} />
        </g>
      )}
      {bottle && <path d="M270 60 Q248 100 242 146" stroke={`url(#${id}-c)`} strokeWidth="3" fill="none" strokeLinecap="round" className={animate ? "cd-pour" : ""} pathLength={1} style={{ strokeDasharray: 1 }} />}
      {coupes.map((c, i) => (
        <g key={i}>
          <path d={`M${c.x - 44} ${c.y} Q${c.x} ${c.y + 34} ${c.x + 44} ${c.y} Z`} fill={`url(#${id}-c)`} className={animate ? "cd-fill" : ""} style={{ transformOrigin: `${c.x}px ${c.y + 20}px`, transformBox: "view-box", animationDelay: `${1 + c.r * 0.45 + (i % 2) * 0.1}s` }} opacity=".92" />
          <path d={`M${c.x - 46} ${c.y - 1} Q${c.x} ${c.y + 36} ${c.x + 46} ${c.y - 1}`} fill="none" stroke={`url(#${id}-g)`} strokeWidth="1.6" />
          <ellipse cx={c.x} cy={c.y - 1} rx="46" ry="4" fill="none" stroke={`url(#${id}-g)`} strokeWidth="1" />
          <path d={`M${c.x} ${c.y + 17} V${c.y + 50} M${c.x - 16} ${c.y + 54} Q${c.x} ${c.y + 46} ${c.x + 16} ${c.y + 54}`} stroke={`url(#${id}-g)`} strokeWidth="1.6" fill="none" />
        </g>
      ))}
      <path d={`M120 ${height - 10} H360`} stroke={`url(#${id}-g)`} strokeWidth="1" />
    </svg>
  );
}

/** Art-deco fan / sunburst. */
export function Fan({ className = "", rays = 15 }: { className?: string; rays?: number }) {
  return (
    <svg viewBox="0 0 200 104" className={className} aria-hidden fill="none" stroke="currentColor">
      {[96, 80, 64].map((r, i) => <path key={r} d={`M${100 - r} 100 A${r} ${r} 0 0 1 ${100 + r} 100`} strokeWidth={i ? 0.6 : 1} />)}
      {Array.from({ length: rays }, (_, i) => { const a = Math.PI * (i + 0.5) / rays; return <line key={i} x1={rd(100 - Math.cos(a) * 26)} y1={rd(100 - Math.sin(a) * 26)} x2={rd(100 - Math.cos(a) * 92)} y2={rd(100 - Math.sin(a) * 92)} strokeWidth=".6" />; })}
      <path d="M74 100 A26 26 0 0 1 126 100 Z" fill="currentColor" fillOpacity=".9" />
      <line x1="0" y1="100" x2="200" y2="100" strokeWidth="1" />
    </svg>
  );
}

/** Stepped deco frame corner (chevrons). */
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 20" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth=".8">
      <path d="M0 18 L40 2 L80 18 M10 18 L40 6 L70 18 M20 18 L40 10 L60 18" />
    </svg>
  );
}

/** Rising bubbles (CSS). Deterministic. */
export function Bubbles({ count = 26, className = "", animate = true }: { count?: number; className?: string; animate?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const s = 3 + ((i * 7) % 9), l = (i * 37) % 100, d = 7 + ((i * 13) % 9), dl = -((i * 3.7) % 14);
        return <span key={i} className={`absolute rounded-full border border-[#f3dfa8]/60 ${animate ? "cd-bubble" : ""}`} style={{ width: s, height: s, left: `${l}%`, bottom: animate ? -12 : `${(i * 29) % 100}%`, animationDuration: `${d}s`, animationDelay: `${dl}s`, background: "radial-gradient(circle at 35% 30%, rgba(255,250,230,.8), rgba(243,223,168,.08) 60%)" }} />;
      })}
    </div>
  );
}
