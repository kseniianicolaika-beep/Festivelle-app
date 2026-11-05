import { useId } from "react";

// Sixty Blessings — a Shashtiabdapoorthi in temple gold: mango-leaf thoranam, jasmine strands,
// a brass kuthuvilakku (five-wick lamp), a kalasam, a multifoil mandapam arch and kolam dots.

export function BrassDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`br${id}`} x1="0" x2="1">
        <stop offset="0" stopColor="#7a4e17" />
        <stop offset=".3" stopColor="#f4d27e" />
        <stop offset=".5" stopColor="#c8912f" />
        <stop offset=".72" stopColor="#ffe9a8" />
        <stop offset="1" stopColor="#7a4e17" />
      </linearGradient>
      <radialGradient id={`fh${id}`}><stop offset="0" stopColor="#ffd27a" stopOpacity=".7" /><stop offset="1" stopColor="#ff9d2e" stopOpacity="0" /></radialGradient>
      <linearGradient id={`fl${id}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fffbe8" /><stop offset=".45" stopColor="#ffcb52" /><stop offset="1" stopColor="#e5611f" /></linearGradient>
      <linearGradient id={`lf${id}`} x1="0" x2="1"><stop offset="0" stopColor="#1f4a2b" /><stop offset=".5" stopColor="#4f8a45" /><stop offset="1" stopColor="#2b5c33" /></linearGradient>
    </defs>
  );
}

/** Kuthuvilakku — tall brass lamp with five wicks. Flames carry data-flame for the lighting interaction. viewBox 120×300. */
export function Kuthuvilakku({ className = "", style, lit = true }: { className?: string; style?: React.CSSProperties; lit?: boolean }) {
  const id = useId().replace(/:/g, "");
  const wicks = [[22, 92], [41, 86], [60, 84], [79, 86], [98, 92]];
  return (
    <svg viewBox="0 0 120 300" className={className} style={style} aria-hidden overflow="visible">
      <BrassDefs id={id} />
      {/* peacock finial */}
      <path d="M60 6c6 4 8 12 4 18 6 2 8 8 6 14H50c-2-6 0-12 6-14-3-6-1-14 4-18z" fill={`url(#br${id})`} />
      <path d="M60 38v40" stroke={`url(#br${id})`} strokeWidth="5" />
      {/* oil cup with five spouts */}
      <path d="M14 92c8 16 26 22 46 22s38-6 46-22c-12 4-30 6-46 6s-34-2-46-6z" fill={`url(#br${id})`} />
      <path d="M14 92q-6-4-4-8 10 6 50 7 40-1 50-7 2 4-4 8" fill={`url(#br${id})`} />
      {/* stem with knops */}
      <path d="M56 114h8v120h-8z" fill={`url(#br${id})`} />
      {[136, 168, 200].map((y) => <ellipse key={y} cx="60" cy={y} rx="12" ry="5" fill={`url(#br${id})`} />)}
      {/* stepped base */}
      <path d="M40 236h40l8 14H32z" fill={`url(#br${id})`} />
      <path d="M24 250h72c6 0 10 6 10 12v4H14v-4c0-6 4-12 10-12z" fill={`url(#br${id})`} />
      <ellipse cx="60" cy="268" rx="50" ry="7" fill={`url(#br${id})`} />
      {wicks.map(([x, y], i) => (
        <g key={i} data-flame style={{ opacity: lit ? 1 : 0 }}>
          <circle cx={x} cy={y - 10} r="16" fill={`url(#fh${id})`} />
          <path className="sb-flame" style={{ animationDelay: `${i * 0.3}s`, transformOrigin: `${x}px ${y}px` }} d={`M${x} ${y}c-4-5-4-11 0-19 4 8 4 14 0 19z`} fill={`url(#fl${id})`} />
        </g>
      ))}
    </svg>
  );
}

/** Kalasam — brass pot, mango leaves, coconut, kumkum & turmeric marks. viewBox 120×140. */
export function Kalasam({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden>
      <BrassDefs id={id} />
      {[-62, -36, -12, 12, 36, 62].map((a, i) => <path key={i} d="M60 50c-6-12-6-26 0-40 6 14 6 28 0 40z" fill={`url(#lf${id})`} transform={`rotate(${a} 60 52)`} />)}
      <ellipse cx="60" cy="36" rx="17" ry="20" fill="#8a5a2b" />
      <path d="M48 26c8-6 16-6 24 0" stroke="#5e3a17" strokeWidth="1.2" fill="none" />
      <path d="M38 56h44c4 0 6 3 4 6-2 4-6 4-6 6 14 8 22 20 22 34 0 20-18 32-40 32S22 122 22 102c0-14 8-26 22-34 0-2-4-2-6-6-2-3 0-6 4-6z" fill={`url(#br${id})`} />
      <path d="M30 96c18 6 42 6 60 0" stroke="#7a4e17" strokeWidth="1" fill="none" />
      <circle cx="60" cy="104" r="4" fill="#c4161c" />
      <path d="M52 104h-6M68 104h6" stroke="#f2b51d" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** Thoranam: mango leaves on a cord, with jasmine strands hanging between. Tiles horizontally (viewBox 200×120). */
export function Thoranam({ className = "", strands = true }: { className?: string; strands?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMin slice" className={className} aria-hidden>
      <BrassDefs id={id} />
      <path d="M0 6q100 14 200 0" stroke="#c8912f" strokeWidth="1.4" fill="none" />
      {Array.from({ length: 7 }, (_, i) => {
        const x = 14 + i * 28, y = 6 + Math.sin((i / 6) * Math.PI) * 7;
        return <path key={i} d={`M${x} ${y}c-7 10-7 26 0 36 7-10 7-26 0-36z`} fill={`url(#lf${id})`} transform={`rotate(${(i - 3) * 4} ${x} ${y})`} />;
      })}
      {[6, 3].map((k) => <circle key={k} cx={k === 6 ? 0 : 200} cy="6" r="4" fill="#e8a33b" />)}
      {strands && [0, 100, 200].map((x) => (
        <g key={x} data-strand style={{ transformOrigin: `${x}px 8px` }}>
          <path d={`M${x} 8v${x === 100 ? 70 : 104}`} stroke="#e9dcc0" strokeWidth=".5" />
          {Array.from({ length: x === 100 ? 9 : 13 }, (_, j) => (
            <g key={j} transform={`translate(${x} ${16 + j * 7.6})`}>
              <path d="M0 -3.4c1.6 0 2.4 1.4 1.4 2.4L0 0l-1.4-1c-1-1-.2-2.4 1.4-2.4z" fill="#fffaf0" />
              <path d="M-2.4 .4c1.2-1.2 3.6-1.2 4.8 0-1.2 1.6-3.6 1.6-4.8 0z" fill="#f8f1e0" />
            </g>
          ))}
          <circle cx={x} cy={x === 100 ? 82 : 116} r="2.6" fill="#e8a33b" />
        </g>
      ))}
    </svg>
  );
}

/** Multifoil mandapam arch path (fills its box). */
export function MandapamArch({ className = "" }: { className?: string }) {
  const d = "M8 596V214C8 196 18 186 30 186c-4-22 10-40 30-42-2-24 16-42 38-42 2-26 24-44 52-44 28 0 50 18 52 44 22 0 40 18 38 42 20 2 34 20 30 42 12 0 22 10 22 28v382";
  return (
    <svg viewBox="0 0 300 600" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={d} fill="none" stroke="var(--t-gold,#d4a24c)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <path d={d} transform="translate(150 330) scale(.94 .95) translate(-150 -330)" fill="none" stroke="var(--t-gold,#d4a24c)" strokeOpacity=".45" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Kolam: a dot-grid with looping lines, as a tiling background (data URI). */
export const KOLAM_BG = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><g fill="none" stroke="#f3d48b" stroke-opacity=".09" stroke-width="1"><path d="M40 8c18 0 32 14 32 32S58 72 40 72 8 58 8 40 22 8 40 8z"/><path d="M40 20l20 20-20 20-20-20z"/></g><g fill="#f3d48b" fill-opacity=".14"><circle cx="40" cy="40" r="1.6"/><circle cx="0" cy="0" r="1.6"/><circle cx="80" cy="0" r="1.6"/><circle cx="0" cy="80" r="1.6"/><circle cx="80" cy="80" r="1.6"/></g></svg>')}")`;

export const SB_CSS = `
.sb-foil{background:linear-gradient(100deg,#8a5a1c 0%,#ffe6a0 22%,#c8912f 40%,#fff3c9 52%,#b07a27 66%,#f4d27e 84%,#8a5a1c 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.sb-shine{animation:sbShine 7s ease-in-out infinite}
@keyframes sbShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.sb-flame{animation:sbFl 1.6s ease-in-out infinite}
@keyframes sbFl{0%,100%{transform:scale(1) skewX(0)}30%{transform:scale(.9,1.1) skewX(3deg)}60%{transform:scale(1.05,.94) skewX(-3deg)}}
.sb-sway [data-strand]{animation:sbSw 6s ease-in-out infinite}
.sb-sway [data-strand]:nth-of-type(2){animation-delay:-2s}
@keyframes sbSw{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}
@media (prefers-reduced-motion: reduce){.sb-shine,.sb-flame,.sb-sway [data-strand]{animation:none!important}}
`;
