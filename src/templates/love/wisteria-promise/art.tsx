import { Comforter_Brush, EB_Garamond } from "next/font/google";
import type { CSSProperties } from "react";

// Wisteria Promise — watercolour wisteria cascading from a pergola vine, dusk washes and brush calligraphy.
export const display = EB_Garamond({ subsets: ["latin", "cyrillic"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--wp-display", preload: false });
export const brush = Comforter_Brush({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--wp-brush", preload: false });
export const fontClass = `${display.variable} ${brush.variable}`;

export const CSS = `
.wp{--d:var(--f-display,var(--wp-display)),var(--font-deva),Georgia,serif;--s:var(--f-script,var(--wp-brush)),var(--font-deva),cursive;font-family:var(--d)}
.wp .d{font-family:var(--d);font-weight:400}
.wp .di{font-family:var(--d);font-style:italic}
.wp .br{font-family:var(--s);font-weight:400;line-height:.9}
.wp .cap{font-family:var(--d);text-transform:uppercase;letter-spacing:.32em;font-size:.72em}
.wp:lang(hi) .cap{letter-spacing:.04em}
.wp .inkc{color:color-mix(in oklab,var(--t-accent) 55%,var(--t-ink))}
.wp-grow{transform-origin:top center;animation:wp-grow 2.4s cubic-bezier(.2,.7,.2,1) both}
@keyframes wp-grow{from{transform:scaleY(0) scaleX(.6);opacity:0}to{transform:none;opacity:1}}
.wp-sway{transform-origin:top center;animation:wp-sway 7s ease-in-out infinite alternate}
@keyframes wp-sway{from{transform:rotate(-1.6deg)}to{transform:rotate(1.6deg)}}
@keyframes wp-bleed{from{clip-path:circle(0% at 50% 45%);filter:blur(20px)}to{clip-path:circle(140% at 50% 45%);filter:blur(0)}}
@keyframes wp-ink{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 -10% 0 0)}}
@keyframes wp-up{from{opacity:0;transform:translateY(20px);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}
@keyframes wp-fall{0%{transform:translate3d(0,-10vh,0) rotate(0);opacity:0}10%{opacity:.9}100%{transform:translate3d(var(--x,40px),110vh,0) rotate(var(--r,300deg));opacity:0}}
.wp .bleed{animation:wp-bleed 2.6s cubic-bezier(.5,0,.2,1) .1s both}
.wp .ink{animation:wp-ink 2.2s cubic-bezier(.6,.1,.3,1) both}
.wp .up{animation:wp-up 1.3s cubic-bezier(.2,.7,.2,1) both}
.wp .fall{animation:wp-fall linear infinite}
.wp.still,.wp.still *{animation:none!important}.wp.still .fall{display:none}
@media (prefers-reduced-motion:reduce){.wp *{animation:none!important}.wp .fall{display:none}}
`;

const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Shared watercolour filters + gradients. Render once per piece. */
export function WpDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="wp-wc" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="8" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation=".35" />
        </filter>
        <filter id="wp-wash" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="4" seed="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="B" result="d" />
          <feGaussianBlur in="d" stdDeviation="6" />
        </filter>
      </defs>
    </svg>
  );
}

const SHADES = ["#4b2f7a", "#6a49a0", "#8b6cc0", "#a98ad4", "#c6b0e6", "#e2d6f3"];

/** One hanging wisteria raceme: dense violet florets tapering to pale tips. Units: 60×h. */
export function Raceme({ h = 220, seed = 1, className = "", style }: { h?: number; seed?: number; className?: string; style?: CSSProperties }) {
  const n = Math.round(h / 2.5);
  return (
    <svg viewBox={`-30 0 60 ${h + 10}`} className={className} style={style} aria-hidden overflow="visible">
      <g filter="url(#wp-wc)">
        <path d={`M0 0Q${r2(4 - rnd(seed) * 8)} ${h / 2} 0 ${h}`} stroke="#5b6b4a" strokeWidth="1.2" fill="none" />
        {Array.from({ length: n }, (_, i) => {
          const t = i / n;
          const w = 17 * (1 - t * 0.8) * (0.7 + rnd(seed * 31 + i) * 0.45);
          const x = r2((rnd(seed * 7 + i) - 0.5) * 2 * w);
          const y = r2(t * h + rnd(seed + i * 3) * 4);
          const shade = SHADES[Math.min(5, Math.floor(t * 5.2 + rnd(i + seed) * 1.2))];
          const s = r2(4 * (1 - t * 0.5));
          const rot = Math.round(rnd(i * 5 + seed) * 360);
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
              <ellipse rx={s * 1.25} ry={s} fill={shade} opacity={0.82} />
              <ellipse cx={r2(s * 0.3)} cy={r2(-s * 0.2)} rx={r2(s * 0.55)} ry={r2(s * 0.42)} fill="#fff" opacity=".35" />
              {i % 3 === 0 && <ellipse cx={r2(-s * 0.4)} rx={r2(s * 0.4)} ry={r2(s * 0.3)} fill="#f4e7a0" opacity=".55" />}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** Pinnate leaf spray. */
export function Leaves({ className = "", style, seed = 1 }: { className?: string; style?: CSSProperties; seed?: number }) {
  return (
    <svg viewBox="0 0 80 120" className={className} style={style} aria-hidden>
      <g filter="url(#wp-wc)">
        <path d="M40 0Q42 60 38 118" stroke="#6b7a55" strokeWidth="1" fill="none" />
        {Array.from({ length: 9 }, (_, i) => {
          const y = 10 + i * 12, side = i % 2 ? 1 : -1, len = 22 - i * 1.2;
          return <path key={i} d={`M40 ${y}q${r2(side * len * 0.6)} ${r2(-4 + rnd(seed + i) * 3)} ${r2(side * len)} 8q${r2(-side * len * 0.5)} 4 ${r2(-side * len)} -8Z`} fill={i % 3 ? "#8a9b72" : "#a3b38a"} opacity=".75" />;
        })}
      </g>
    </svg>
  );
}

/** A pergola vine with racemes hanging at staggered lengths. width = 1000 units. */
export function Canopy({ className = "", count = 13, grow = true, seed = 3, cq = false }: { className?: string; count?: number; grow?: boolean; seed?: number; cq?: boolean }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className={`absolute inset-x-0 top-0 w-full ${cq ? "h-[8cqw]" : "h-[60px]"}`}>
        <g filter="url(#wp-wc)" fill="none" stroke="#6a5a48" strokeLinecap="round">
          <path d="M-10 18C120 40 240 4 380 24S640 44 760 18 940 30 1010 14" strokeWidth="5" />
          <path d="M-10 26C160 8 300 46 470 22S760 6 1010 34" strokeWidth="2.4" opacity=".7" />
        </g>
      </svg>
      {Array.from({ length: count }, (_, i) => {
        const left = (i + 0.5) / count * 100 + (rnd(i + seed) - 0.5) * 4;
        const h = 110 + rnd(i * 3 + seed) * 170;
        return (
          <div key={i} className={`wp-sway absolute ${cq ? "top-[1.4cqw]" : "top-[10px]"}`} style={{ left: `${r2(left)}%`, animationDelay: `${r2(-rnd(i) * 6)}s` }}>
            <div className={grow ? "wp-grow" : ""} style={{ animationDelay: `${r2(0.4 + rnd(i + 9) * 1.2)}s` }}>
              <Raceme h={Math.round(h)} seed={i + seed} className="-translate-x-1/2" style={{ height: cq ? `${r2(h / 7)}cqw` : `min(${r2(h * 1.45)}px, ${r2(h * 0.18)}vw + 40px)`, width: "auto" }} />
            </div>
            {i % 2 === 0 && <Leaves seed={i} className={`absolute -rotate-[24deg] ${cq ? "-left-[6cqw] top-0 w-[9cqw]" : "-left-8 top-0 w-12"}`} />}
          </div>
        );
      })}
    </div>
  );
}

/** Soft dusk watercolour wash (lilac → peach) behind content. */
export function Wash({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <g filter="url(#wp-wash)">
        <ellipse cx="300" cy="380" rx="420" ry="260" fill="#cdb8e8" opacity=".55" />
        <ellipse cx="760" cy="520" rx="380" ry="240" fill="#f6cdbf" opacity=".5" />
        <ellipse cx="520" cy="760" rx="460" ry="220" fill="#e4d7f3" opacity=".6" />
        <ellipse cx="820" cy="220" rx="260" ry="160" fill="#b9a2df" opacity=".35" />
      </g>
    </svg>
  );
}

/** Falling florets (CSS), decorative only. */
export function Florets({ n = 14 }: { n?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="fall absolute top-0 block rounded-[50%_50%_50%_0]" style={{ left: `${r2(rnd(i + 4) * 100)}%`, width: 7 + (i % 3) * 3, height: 6 + (i % 3) * 2, background: SHADES[2 + (i % 4)], opacity: 0.8, animationDuration: `${r2(9 + rnd(i) * 8)}s`, animationDelay: `${r2(-rnd(i + 2) * 14)}s`, ["--x" as string]: `${Math.round((rnd(i + 7) - 0.5) * 160)}px`, ["--r" as string]: `${Math.round(rnd(i) * 600)}deg` } as CSSProperties} />
      ))}
    </div>
  );
}
