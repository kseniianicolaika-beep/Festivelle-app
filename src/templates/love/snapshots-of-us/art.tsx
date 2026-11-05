import { Caveat } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

// Snapshots of Us — five polaroids from the story so far, washi tape, a eucalyptus sprig and marker handwriting.
export const hand = Caveat({ subsets: ["latin", "cyrillic"], weight: ["400", "600", "700"], variable: "--su-hand", preload: false });
export const fontClass = hand.variable;

export const CSS = `
.su{--d:var(--f-display,var(--font-playfair)),var(--font-deva),Georgia,serif;--h:var(--f-script,var(--su-hand)),var(--font-deva),cursive;--b:var(--f-body,var(--font-inter)),var(--font-deva),system-ui,sans-serif;font-family:var(--b)}
.su .d{font-family:var(--d);font-weight:400}
.su .di{font-family:var(--d);font-style:italic}
.su .h{font-family:var(--h);font-weight:600;line-height:1}
.su .cap{text-transform:uppercase;letter-spacing:.28em;font-size:.7em;font-weight:500}
.su:lang(hi) .cap{letter-spacing:.04em}
@keyframes su-drop{0%{opacity:0;transform:translate3d(var(--fx,0),-120vh,0) rotate(calc(var(--r,0deg) - 24deg))}70%{opacity:1;transform:translate3d(0,6px,0) rotate(calc(var(--r,0deg) + 2deg))}100%{transform:rotate(var(--r,0deg))}}
@keyframes su-dropc{0%{opacity:0;transform:translateY(-140cqw) rotate(calc(var(--r,0deg) - 20deg))}70%{opacity:1;transform:translateY(1cqw) rotate(calc(var(--r,0deg) + 2deg))}100%{transform:rotate(var(--r,0deg))}}
@keyframes su-dev{from{filter:brightness(2.2) saturate(0) blur(4px)}to{filter:none}}
@keyframes su-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes su-write{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(-20% -5% -20% 0)}}
@keyframes su-float{0%,100%{transform:rotate(var(--r,0deg)) translateY(0)}50%{transform:rotate(calc(var(--r,0deg) + 1deg)) translateY(-6px)}}
.su .drop{transform:rotate(var(--r,0deg));animation:su-drop 1.2s cubic-bezier(.3,.7,.3,1) both}
.su .dropc{transform:rotate(var(--r,0deg));animation:su-dropc 1.1s cubic-bezier(.3,.7,.3,1) both}
.su .dev{animation:su-dev 2.6s ease-out both}
.su .up{animation:su-up 1s cubic-bezier(.2,.7,.2,1) both}
.su .write{animation:su-write 1.6s cubic-bezier(.5,.1,.3,1) both}
.su .bob{animation:su-float 7s ease-in-out infinite}
.su.still,.su.still *{animation:none!important}
@media (prefers-reduced-motion:reduce){.su *{animation:none!important}}
`;

/** Linen tablecloth texture. */
export const LINEN = "repeating-linear-gradient(0deg, rgba(60,70,55,.045) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(60,70,55,.04) 0 1px, transparent 1px 4px)";

/** Washi tape strip. */
export function Tape({ className = "", style, tone = 0 }: { className?: string; style?: CSSProperties; tone?: number }) {
  const bg = ["rgba(196,214,186,.82)", "rgba(240,214,190,.85)", "rgba(220,206,232,.8)", "rgba(250,236,170,.8)"][tone % 4];
  return <span aria-hidden className={`absolute block ${className}`} style={{ background: `repeating-linear-gradient(45deg, ${bg} 0 6px, rgba(255,255,255,.35) 6px 8px)`, clipPath: "polygon(2% 0,98% 6%,100% 50%,97% 100%,3% 94%,0 50%)", ...style }} />;
}

/** Polaroid frame: square image + caption strip. `cls` controls entry animation. */
export function Polaroid({ children, caption, className = "", style, tape = 0, capSize }: { children: ReactNode; caption?: ReactNode; className?: string; style?: CSSProperties; tape?: number | false; capSize?: string }) {
  return (
    <figure className={`relative bg-[#fdfcf7] p-[5%] pb-[20%] shadow-[0_18px_30px_-14px_rgba(30,40,30,.45),0_2px_4px_rgba(30,40,30,.12)] ${className}`} style={style}>
      <div className="relative aspect-square w-full overflow-hidden bg-[#d9ddd2]">{children}</div>
      {caption && <figcaption className="h absolute inset-x-[3%] bottom-[4%] truncate text-center text-[#3a4a3c]" style={{ fontSize: capSize ?? "1.25em" }}>{caption}</figcaption>}
      {tape !== false && <Tape tone={tape} className="-top-[6%] left-1/2 h-[12%] w-[38%] -translate-x-1/2 rotate-[-4deg]" />}
    </figure>
  );
}

/** Illustrated memory vignettes (used when there aren't enough photos). */
export function Memory({ kind, className = "" }: { kind: number; className?: string }) {
  const k = kind % 5;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} aria-hidden>
      {k === 0 && (
        <g>{/* café awning in the monsoon */}
          <rect width="100" height="100" fill="#8fa3a6" />
          {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${(i * 37) % 100} ${(i * 23) % 70}l-3 9`} stroke="#e6eef0" strokeWidth=".8" opacity=".7" />)}
          <path d="M8 40h84l-6 12H14Z" fill="#c8553d" /><path d="M14 52l6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6" fill="#c8553d" stroke="#a54430" strokeWidth=".6" />
          {[20, 32, 44, 56, 68, 80].map((x) => <path key={x} d={`M${x} 40l-2 12`} stroke="#f3e1c9" strokeWidth="3" />)}
          <rect x="16" y="58" width="68" height="42" fill="#5a4a3e" /><rect x="22" y="64" width="24" height="22" fill="#f2c46d" opacity=".85" /><rect x="54" y="64" width="24" height="22" fill="#f2c46d" opacity=".85" />
          <circle cx="44" cy="92" r="5" fill="#2f2a26" /><circle cx="58" cy="91" r="5" fill="#2f2a26" />
        </g>
      )}
      {k === 1 && (
        <g>{/* two coffee cups */}
          <rect width="100" height="100" fill="#e9dfcf" />
          <rect y="62" width="100" height="38" fill="#b48a62" />
          {[[32, 0], [62, 1]].map(([x, i]) => <g key={i}><ellipse cx={x} cy="64" rx="15" ry="4" fill="#fff" /><path d={`M${x - 13} 50h26l-3 14h-20Z`} fill="#fff" /><ellipse cx={x} cy="50" rx="13" ry="3.4" fill="#6b4226" /><path d={`M${x - 2} 50c-2-5 4-8 1-14M${x + 4} 49c-2-4 3-7 1-11`} stroke="#fff" strokeWidth="1" fill="none" opacity=".8" /><path d={`M${x + 13} 54c6 0 6 7 0 7`} stroke="#fff" strokeWidth="2" fill="none" /></g>)}
          <path d="M44 30c0-4 6-4 6 0 0-4 6-4 6 0 0 5-6 8-6 10 0-2-6-5-6-10Z" fill="#c8553d" />
        </g>
      )}
      {k === 2 && (
        <g>{/* sunset over the Arabian Sea */}
          <rect width="100" height="60" fill="#f3a46a" /><rect width="100" height="30" fill="#e98a6a" />
          <circle cx="50" cy="58" r="16" fill="#ffe2a8" />
          <rect y="58" width="100" height="42" fill="#5b7f8a" />
          {[64, 70, 77, 85].map((y, i) => <path key={y} d={`M${38 - i * 6} ${y}h${24 + i * 12}`} stroke="#ffe2a8" strokeWidth="1.2" opacity={0.8 - i * 0.15} />)}
          <path d="M60 100c2-16 4-22 6-30M66 70c-8-4-16-2-20 4 6-2 12-2 18 0-8 2-12 8-12 14 4-6 9-10 14-12 0 6 2 10 6 14-2-6-2-10 0-14 6 4 12 4 18 2-6-2-10-6-12-10 8-2 14 0 18 4-4-8-14-10-22-6Z" fill="#2c2a2a" />
        </g>
      )}
      {k === 3 && (
        <g>{/* the ring box */}
          <rect width="100" height="100" fill="#cfd8c8" />
          <path d="M22 62h56v24H22Z" fill="#2f4a3a" /><path d="M22 62l6-30h44l6 30Z" fill="#3c5c49" /><path d="M28 36h44l-3 22H31Z" fill="#f4eee4" />
          <ellipse cx="50" cy="50" rx="9" ry="5" fill="none" stroke="#d4af37" strokeWidth="2.4" />
          <path d="M46 42h8l3 3-7 6-7-6Z" fill="#fff" stroke="#bfc8d0" strokeWidth=".5" />
          <path d="M60 38l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" fill="#fff" />
        </g>
      )}
      {k === 4 && (
        <g>{/* a map with a pin */}
          <rect width="100" height="100" fill="#efe9d8" />
          <path d="M0 30C30 26 40 50 70 44S100 60 100 60V100H0Z" fill="#cfe0c4" />
          <path d="M60 0C56 30 70 50 64 100" stroke="#a8c4d6" strokeWidth="7" fill="none" />
          <path d="M0 70h100M30 0v100" stroke="#fff" strokeWidth="2.4" />
          <path d="M50 30a10 10 0 0 1 10 10c0 8-10 18-10 18S40 48 40 40a10 10 0 0 1 10-10Z" fill="#c8553d" /><circle cx="50" cy="40" r="3.4" fill="#fff" />
        </g>
      )}
    </svg>
  );
}

/** Eucalyptus sprig. */
export function Eucalyptus({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const leaves = [[50, 20, 14], [36, 40, 12], [62, 52, 13], [40, 70, 11], [60, 88, 12], [44, 104, 10], [58, 120, 9], [48, 136, 8]];
  return (
    <svg viewBox="0 0 100 160" className={className} style={style} aria-hidden>
      <path d="M52 2C46 50 56 100 50 158" stroke="#7b8a6e" strokeWidth="1.6" fill="none" />
      {leaves.map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.82} fill={i % 2 ? "#9fb09a" : "#b4c2ab"} opacity=".92" />
          <ellipse cx={x - r * 0.3} cy={y - r * 0.3} rx={r * 0.4} ry={r * 0.25} fill="#fff" opacity=".25" />
          <path d={`M${x} ${y - r * 0.8}V${y + r * 0.8}`} stroke="#8a9a80" strokeWidth=".5" opacity=".6" />
        </g>
      ))}
    </svg>
  );
}
