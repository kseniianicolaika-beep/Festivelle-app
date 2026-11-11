import { useId, type CSSProperties } from "react";

// Sealed Secret — a cream envelope crossed by one ribbon that is half pink, half blue, closed with a gold wax
// seal (data-seal) pressed with a heart; a question mark peeks from the flap (data-peek). Soft clouds behind.

/** The envelope. viewBox 320×240. */
export function Envelope({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 320 240" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`pa${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf3" /><stop offset="1" stopColor="#f1e4d6" /></linearGradient>
        <linearGradient id={`rb${u}`} x1="0" x2="1"><stop offset="0" stopColor="#f2a7bf" /><stop offset=".49" stopColor="#f2a7bf" /><stop offset=".51" stopColor="#9cc6e8" /><stop offset="1" stopColor="#9cc6e8" /></linearGradient>
        <radialGradient id={`wx${u}`} cx=".4" cy=".35"><stop offset="0" stopColor="#fff1c9" /><stop offset=".5" stopColor="#d9ad5c" /><stop offset="1" stopColor="#8b5e22" /></radialGradient>
      </defs>
      {/* the peeking question mark, behind the front panel */}
      <g data-peek>
        <rect x="70" y="30" width="180" height="120" rx="6" fill="#fff" stroke="#eadfd2" />
        <text x="160" y="118" textAnchor="middle" fontSize="96" fontFamily="Prata, Georgia, serif" fill="#e7c6d6">?</text>
      </g>
      <rect x="20" y="70" width="280" height="160" rx="8" fill={`url(#pa${u})`} stroke="#e3d3c2" />
      <path d="M20 78l140 92 140-92" fill="none" stroke="#e3d3c2" strokeWidth="1.4" />
      <path d="M20 230l110-80M300 230l-110-80" stroke="#eadfd2" strokeWidth="1.2" />
      {/* ribbon */}
      <rect x="20" y="142" width="280" height="14" fill={`url(#rb${u})`} opacity=".9" />
      <path d="M160 149c-30-24-60-20-60-4 0 14 34 14 60 4zM160 149c30-24 60-20 60-4 0 14-34 14-60 4z" fill={`url(#rb${u})`} />
      {/* seal */}
      <g data-seal style={{ transformOrigin: "160px 150px", transformBox: "view-box" }}>
        <path d="M160 122c10 0 14 6 22 8s12 10 10 20 2 16-6 22-14 8-26 8-20-2-26-8-8-12-6-22-2-16 10-20 12-8 22-8z" fill={`url(#wx${u})`} />
        <circle cx="160" cy="150" r="19" fill="none" stroke="#8b5e22" strokeOpacity=".6" />
        <path d="M160 162c-12-8-18-14-18-21 0-5 4-9 9-9 4 0 7 2 9 6 2-4 5-6 9-6 5 0 9 4 9 9 0 7-6 13-18 21z" fill="#b8873a" stroke="#fff1c9" strokeOpacity=".7" />
      </g>
    </svg>
  );
}

/** Small wax seal on its own. viewBox 80×80. */
export function Seal({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden>
      <defs><radialGradient id={`w${u}`} cx=".4" cy=".35"><stop offset="0" stopColor="#fff1c9" /><stop offset=".5" stopColor="#d9ad5c" /><stop offset="1" stopColor="#8b5e22" /></radialGradient></defs>
      <path d="M40 6c12 0 16 6 24 10s10 12 10 24-2 18-10 24-12 10-24 10-16-4-24-10S6 52 6 40s2-18 10-24 12-10 24-10z" fill={`url(#w${u})`} />
      <circle cx="40" cy="40" r="22" fill="none" stroke="#8b5e22" strokeOpacity=".5" />
      <path d="M40 54c-14-9-20-16-20-24 0-6 4-10 10-10 4 0 8 2 10 7 2-5 6-7 10-7 6 0 10 4 10 10 0 8-6 15-20 24z" fill="#b8873a" />
    </svg>
  );
}

/** Ribbon line divider, pink fading to blue. viewBox 160×20. */
export function RibbonRule({ className = "" }: { className?: string }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 160 20" className={className} aria-hidden>
      <defs><linearGradient id={`r${u}`} x1="0" x2="1"><stop offset="0" stopColor="#f2a7bf" /><stop offset="1" stopColor="#9cc6e8" /></linearGradient></defs>
      <path d="M2 10c30-8 50 8 78 0s48-8 78 0" stroke={`url(#r${u})`} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="10" r="4" fill="#d9ad5c" />
    </svg>
  );
}

export const SS_CSS = `
.evss-root{background-color:#f8f1f3;background-image:radial-gradient(55% 45% at 15% 20%,rgba(242,167,191,.28),transparent 70%),radial-gradient(55% 45% at 85% 70%,rgba(156,198,232,.3),transparent 70%)}
.evss-foil{background:linear-gradient(100deg,#c97895 0%,#b38a4c 50%,#6d9cc8 100%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.evss-shine{animation:evssShine 7s ease-in-out infinite}
@keyframes evssShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.evss-pulse{animation:evssPulse 2.8s ease-in-out infinite}
@keyframes evssPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@media (prefers-reduced-motion: reduce){.evss-shine,.evss-pulse{animation:none!important}}
`;
