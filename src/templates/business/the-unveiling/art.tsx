import { useId } from "react";

// The Unveiling — a gallery-style launch: a cream plinth under a blush silk cloth (data-silk) that lifts away to
// reveal a glowing faceted object (data-gem). Champagne, blush and burgundy on warm ivory.

/** viewBox 300×340. `veiled` = draw the silk over the object (still for cards). */
export function Plinth({ className = "", style, veiled = true }: { className?: string; style?: React.CSSProperties; veiled?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 300 340" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`p${id}`} x1="0" x2="1"><stop offset="0" stopColor="#e9dccb" /><stop offset=".45" stopColor="#fbf5ec" /><stop offset="1" stopColor="#d8c6ae" /></linearGradient>
        <linearGradient id={`t${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf2" /><stop offset="1" stopColor="#efe2cf" /></linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff4d6" /><stop offset=".5" stopColor="#d9b57a" /><stop offset="1" stopColor="#7d1d3a" /></linearGradient>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#fff4d6" stopOpacity=".9" /><stop offset="1" stopColor="#fff4d6" stopOpacity="0" /></radialGradient>
        <linearGradient id={`s${id}`} x1="0" x2="1"><stop offset="0" stopColor="#d99aa0" /><stop offset=".3" stopColor="#f6d3cf" /><stop offset=".55" stopColor="#e7b2b1" /><stop offset=".8" stopColor="#f8dcd6" /><stop offset="1" stopColor="#c9848c" /></linearGradient>
      </defs>
      <ellipse cx="150" cy="330" rx="120" ry="8" fill="#3e2418" opacity=".12" />
      <path d="M70 200H230V330H70Z" fill={`url(#p${id})`} />
      <path d="M60 188H240V204H60Z" fill={`url(#t${id})`} stroke="#d8c6ae" strokeWidth=".8" />
      <path d="M70 318H230V330H70Z" fill="#d8c6ae" />
      <g data-gem>
        <circle cx="150" cy="128" r="80" fill={`url(#h${id})`} />
        <path d="M150 64L196 116L150 186L104 116Z" fill={`url(#g${id})`} />
        <path d="M150 64L172 116L150 186L128 116Z" fill="#fff4d6" opacity=".45" />
        <path d="M104 116H196" stroke="#fffaf2" strokeWidth="1.2" opacity=".8" />
        <path d="M128 116L150 64L172 116" fill="none" stroke="#fffaf2" strokeWidth=".8" opacity=".7" />
      </g>
      {veiled && (
        <g data-silk style={{ transformOrigin: "150px 40px" }}>
          <path d="M150 40C112 44 92 92 84 140C78 172 66 188 52 206C80 214 110 200 150 208C190 200 220 214 248 206C234 188 222 172 216 140C208 92 188 44 150 40Z" fill={`url(#s${id})`} />
          <path d="M150 42C138 70 130 120 128 204M150 42C162 76 170 126 174 204M150 42C124 70 104 130 96 196" stroke="#b86b77" strokeWidth="1" fill="none" opacity=".35" />
          <circle cx="150" cy="40" r="5" fill="#d9b57a" />
        </g>
      )}
    </svg>
  );
}

export const UV_CSS = `
.uv-ivory{background-color:#faf4ec;background-image:radial-gradient(55% 45% at 50% 30%,rgba(246,211,207,.45),transparent 70%),radial-gradient(40% 30% at 90% 90%,rgba(217,181,122,.18),transparent 70%)}
.uv-gold{background:linear-gradient(100deg,#7d1d3a,#b8955a 40%,#d9b57a 55%,#7d1d3a);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.uv-shine{animation:uvShine 8s ease-in-out infinite}
@keyframes uvShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.uv-float [data-gem]{animation:uvFloat 5s ease-in-out infinite}
@keyframes uvFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.uv-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.uv-shine,.uv-float [data-gem]{animation:none!important}}
`;
