import { useId, type CSSProperties } from "react";

/** Trig rounded so server and client render identical SVG attributes. */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

// Midnight Toast — a gilded Art Deco clock a minute before midnight (data-hand="h|m" for the sweep), a crescent
// moon in a field of stars, and two champagne flutes that clink (data-flute="l|r").

/** The clock. viewBox 300×300. */
export function Clock({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  const R = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`g${u}`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#8b5e22" /><stop offset=".35" stopColor="#f5d58f" /><stop offset=".6" stopColor="#c99a4a" /><stop offset="1" stopColor="#7a521c" /></linearGradient>
        <radialGradient id={`f${u}`} cx=".5" cy=".4"><stop offset="0" stopColor="#3b1424" /><stop offset="1" stopColor="#1a0710" /></radialGradient>
      </defs>
      {/* deco sunburst behind */}
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const r1 = 128, r2 = i % 2 ? 146 : 158;
        return <line key={i} x1={150 + r3(Math.cos(a)) * r1} y1={150 + r3(Math.sin(a)) * r1} x2={150 + r3(Math.cos(a)) * r2} y2={150 + r3(Math.sin(a)) * r2} stroke={`url(#g${u})`} strokeWidth={i % 2 ? 1 : 2} />;
      })}
      <circle cx="150" cy="150" r="124" fill={`url(#g${u})`} />
      <circle cx="150" cy="150" r="116" fill={`url(#f${u})`} />
      <circle cx="150" cy="150" r="104" fill="none" stroke={`url(#g${u})`} strokeWidth=".8" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const r1 = i % 5 ? 108 : 104;
        return <line key={i} x1={150 + r3(Math.cos(a)) * r1} y1={150 + r3(Math.sin(a)) * r1} x2={150 + r3(Math.cos(a)) * 113} y2={150 + r3(Math.sin(a)) * 113} stroke="#d8b46a" strokeWidth={i % 5 ? 0.6 : 1.6} />;
      })}
      {R.map((r, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return <text key={r} x={150 + r3(Math.cos(a)) * 86} y={150 + r3(Math.sin(a)) * 86 + 5} textAnchor="middle" fontSize="15" fill="#f1d49a" fontFamily="Cinzel, Georgia, serif">{r}</text>;
      })}
      {/* hands: hour pointing at XII, minute one tick before */}
      <g data-hand="h" style={{ transformOrigin: "150px 150px", transformBox: "view-box" }}>
        <path d="M150 150L144 108 150 76 156 108z" fill={`url(#g${u})`} />
      </g>
      <g data-hand="m" style={{ transformOrigin: "150px 150px", transformBox: "view-box", transform: "rotate(-6deg)" }}>
        <path d="M150 160L146 100 150 50 154 100z" fill={`url(#g${u})`} />
        <circle cx="150" cy="84" r="4" fill="none" stroke="#f5d58f" strokeWidth="1.2" />
      </g>
      <circle cx="150" cy="150" r="7" fill={`url(#g${u})`} />
      <circle cx="150" cy="150" r="2.4" fill="#1a0710" />
    </svg>
  );
}

/** Two champagne flutes, leaning in to clink. viewBox 200×200. */
export function Flutes({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  const flute = (side: "l" | "r") => (
    <g data-flute={side} style={{ transformOrigin: side === "l" ? "70px 190px" : "130px 190px", transformBox: "view-box", transform: `rotate(${side === "l" ? 12 : -12}deg)` }}>
      <g transform={side === "l" ? "translate(70 0)" : "translate(130 0)"}>
        <path d="M-16 20h32l-4 70c-2 12-8 18-12 18s-10-6-12-18z" fill={`url(#c${u})`} opacity=".92" />
        <path d="M-16 20h32l-4 70c-2 12-8 18-12 18s-10-6-12-18z" fill="none" stroke="#e7c98a" strokeWidth="1.2" />
        <rect x="-16" y="20" width="32" height="10" fill="#fff6d8" opacity=".55" />
        {[[-6, 70], [4, 54], [-2, 40], [6, 82]].map(([x, y], i) => <circle key={i} className="evmt-bub" style={{ animationDelay: `${i * 0.5 + (side === "l" ? 0 : 0.25)}s` }} cx={x} cy={y} r="1.4" fill="#fff" />)}
        <path d="M0 108v72" stroke="#e7c98a" strokeWidth="2" />
        <ellipse cx="0" cy="182" rx="20" ry="4" fill="none" stroke="#e7c98a" strokeWidth="2" />
      </g>
    </g>
  );
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden overflow="visible">
      <defs><linearGradient id={`c${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbe6b4" /><stop offset="1" stopColor="#d6a656" /></linearGradient></defs>
      {flute("l")}
      {flute("r")}
      <g data-clink opacity="0">
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => <line key={a} x1={100 + r3(Math.cos((a * Math.PI) / 180)) * 10} y1={22 + r3(Math.sin((a * Math.PI) / 180)) * 10} x2={100 + r3(Math.cos((a * Math.PI) / 180)) * 18} y2={22 + r3(Math.sin((a * Math.PI) / 180)) * 18} stroke="#f5d58f" strokeWidth="1.6" strokeLinecap="round" />)}
      </g>
    </svg>
  );
}

/** Crescent moon. viewBox 100×100. */
export function Moon({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <circle cx="50" cy="50" r="40" fill="#f5e3b5" opacity=".14" />
      <path d="M62 14a38 38 0 1 0 24 58A30 30 0 1 1 62 14z" fill="#f5e3b5" />
    </svg>
  );
}

/** Star field (CSS twinkle). */
export function Stars({ n = 40, className = "" }: { n?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="evmt-star" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 92}%`, animationDelay: `${(i % 7) * 0.6}s`, width: `${1 + (i % 3)}px`, height: `${1 + (i % 3)}px` }} />
      ))}
    </div>
  );
}

/** Deco divider. viewBox 160×20. */
export function DecoRule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 20" className={className} aria-hidden>
      <path d="M0 10h62M98 10h62" stroke="#d8b46a" strokeWidth="1" />
      <path d="M80 2l8 8-8 8-8-8z" fill="none" stroke="#d8b46a" strokeWidth="1.2" />
      <path d="M80 6l4 4-4 4-4-4z" fill="#d8b46a" />
      <path d="M62 6v8M66 4v12M94 4v12M98 6v8" stroke="#d8b46a" strokeWidth="1" />
    </svg>
  );
}

export const MT_CSS = `
.evmt-root{background-color:#1d0a12;background-image:radial-gradient(60% 45% at 50% 30%,rgba(216,180,106,.14),transparent 70%),repeating-linear-gradient(90deg,rgba(216,180,106,.03) 0 1px,transparent 1px 64px)}
.evmt-foil{background:linear-gradient(100deg,#8b5e22 0%,#f5d58f 22%,#c99a4a 40%,#fff1c9 52%,#a77a33 66%,#f1cf86 84%,#8b5e22 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.evmt-shine{animation:evmtShine 7s ease-in-out infinite}
@keyframes evmtShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.evmt-star{position:absolute;border-radius:50%;background:#f5e3b5;opacity:.5;animation:evmtTw 3.4s ease-in-out infinite}
@keyframes evmtTw{0%,100%{opacity:.15}50%{opacity:.9}}
.evmt-bub{animation:evmtBub 2.6s ease-in infinite}
@keyframes evmtBub{0%{transform:translateY(0);opacity:0}30%{opacity:.9}100%{transform:translateY(-34px);opacity:0}}
@media (prefers-reduced-motion: reduce){.evmt-shine,.evmt-star,.evmt-bub{animation:none!important}}
`;
