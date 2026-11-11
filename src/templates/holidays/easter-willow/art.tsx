import { useId, type CSSProperties } from "react";

// Easter Willow — porcelain spring morning: hand-painted folk eggs (zig-zag, dots, wheat ears), pussy-willow
// branches (верба), apple blossom and a twig nest. The hero egg splits along its zig-zag (data-top / data-bottom).

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, "");
const r2 = (n: number) => Math.round(n * 100) / 100;

const EGG = "M60 6C88 6 112 52 112 92C112 126 90 150 60 150C30 150 8 126 8 92C8 52 32 6 60 6Z";
const PALETTES = [
  { base: "#c0392b", band: "#f6e7c8", ink: "#2a1a14", dot: "#f2b544" },
  { base: "#8e6bb8", band: "#fbf6ee", ink: "#3b2a3f", dot: "#f2c6d6" },
  { base: "#2f7d6b", band: "#f6e7c8", ink: "#16352d", dot: "#f2b544" },
  { base: "#f2b544", band: "#fff8e8", ink: "#6a3a12", dot: "#c0392b" },
];
const ZIG = (y: number, amp = 6, n = 10) => {
  let d = `M4 ${y}`;
  for (let i = 0; i <= n; i++) d += `L${r2(4 + (i * 112) / n)} ${y + (i % 2 ? -amp : amp)}`;
  return d;
};

/** A painted egg. `split` renders top and bottom halves separately for the cracking moment. */
export function Egg({ className, style, palette = 0, split = false }: { className?: string; style?: CSSProperties; palette?: number; split?: boolean }) {
  const id = useUid();
  const P = PALETTES[palette % PALETTES.length];
  const paint = (
    <>
      <path d={EGG} fill={P.base} />
      <path d={EGG} fill={`url(#s${id})`} />
      <rect x="0" y="62" width="120" height="30" fill={P.band} clipPath={`url(#c${id})`} />
      <path d={ZIG(77, 7, 12)} fill="none" stroke={P.ink} strokeWidth="2" clipPath={`url(#c${id})`} />
      {[20, 40, 60, 80, 100].map((x, i) => <circle key={i} cx={x} cy={i % 2 ? 69 : 85} r="2.4" fill={P.base} clipPath={`url(#c${id})`} />)}
      <path d="M60 20V58M60 28l-8-6M60 36l-9-6M60 44l-10-6M60 28l8-6M60 36l9-6M60 44l10-6" stroke={P.band} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M28 112C40 104 50 112 60 104C70 112 80 104 92 112M24 126C40 118 50 126 60 118C70 126 80 118 96 126" stroke={P.band} strokeWidth="2.2" fill="none" strokeLinecap="round" clipPath={`url(#c${id})`} />
      {[36, 48, 60, 72, 84].map((x, i) => <circle key={"d" + i} cx={x} cy="138" r="2" fill={P.dot} />)}
      <circle cx="40" cy="44" r="3" fill={P.dot} /><circle cx="80" cy="44" r="3" fill={P.dot} />
    </>
  );
  return (
    <svg viewBox="0 0 120 160" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <clipPath id={`c${id}`}><path d={EGG} /></clipPath>
        <clipPath id={`t${id}`}><path d={`${ZIG(77, 7, 12)}L120 0L0 0Z`} /></clipPath>
        <clipPath id={`b${id}`}><path d={`${ZIG(77, 7, 12)}L120 170L0 170Z`} /></clipPath>
        <radialGradient id={`s${id}`} cx=".32" cy=".28" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".45" /><stop offset=".35" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".22" /></radialGradient>
      </defs>
      <ellipse cx="60" cy="154" rx="40" ry="5" fill="#3b2a3f" opacity=".14" />
      {split ? (
        <>
          <g data-bottom clipPath={`url(#b${id})`}>{paint}</g>
          <g data-top clipPath={`url(#t${id})`}>{paint}</g>
        </>
      ) : paint}
    </svg>
  );
}

/** A pussy-willow branch: a thin brown stem with silver catkins. */
export function Willow({ className, style, flip = false }: { className?: string; style?: CSSProperties; flip?: boolean }) {
  const buds = [[60, 40, -30], [96, 58, 20], [130, 70, -25], [168, 92, 24], [204, 104, -20], [240, 128, 22], [272, 140, -18]];
  return (
    <svg viewBox="0 0 320 200" className={className} style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }} aria-hidden overflow="visible">
      <path d="M0 10C80 30 160 70 300 150" stroke="#6b4a32" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M120 64C150 40 180 34 214 30" stroke="#6b4a32" strokeWidth="2" fill="none" strokeLinecap="round" />
      {buds.map(([x, y, a], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
          <path d="M0 0l-4 6h8Z" fill="#8a5a3a" />
          <ellipse cx="0" cy="-12" rx="7" ry="13" fill="#e9e4ea" />
          <ellipse cx="-2" cy="-14" rx="3.5" ry="8" fill="#fff" opacity=".8" />
        </g>
      ))}
      {[[150, 52, -60], [184, 40, -70], [210, 32, -80]].map(([x, y, a], i) => <g key={"u" + i} transform={`translate(${x} ${y}) rotate(${a})`}><ellipse cx="0" cy="-10" rx="6" ry="11" fill="#e9e4ea" /><ellipse cx="-1.5" cy="-12" rx="3" ry="6" fill="#fff" opacity=".8" /></g>)}
    </svg>
  );
}

/** Apple blossom: five petals, a pink blush and gold stamens. */
export function Blossom({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-30 -30 60 60" className={className} style={style} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => <path key={i} d="M0 0C-10-6-12-22 0-26C12-22 10-6 0 0Z" transform={`rotate(${i * 72})`} fill="#fff7f6" stroke="#f2c6d6" strokeWidth="1" />)}
      <circle r="6" fill="#f2c6d6" opacity=".8" />
      {Array.from({ length: 8 }, (_, i) => <circle key={"s" + i} cx={r2(7 * Math.cos((i * Math.PI) / 4))} cy={r2(7 * Math.sin((i * Math.PI) / 4))} r="1.4" fill="#c9a24e" />)}
    </svg>
  );
}

/** A twig nest holding three painted eggs — the card centrepiece. */
export function Nest({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative ${className ?? ""}`} style={{ aspectRatio: "1/0.7", ...style }}>
      <Egg palette={1} className="absolute left-[18%] top-[2%] w-[24%] -rotate-12" />
      <Egg palette={0} className="absolute left-[38%] top-[-6%] w-[26%]" />
      <Egg palette={2} className="absolute right-[16%] top-[4%] w-[23%] rotate-12" />
      <svg viewBox="0 0 300 120" className="absolute inset-x-0 bottom-0 w-full" aria-hidden>
        <path d="M20 40C40 110 260 110 280 40C230 64 70 64 20 40Z" fill="#8a5a3a" />
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${20 + i * 16} ${46 + (i % 3) * 6}C${60 + i * 12} ${90 - (i % 4) * 6} ${120 + i * 8} ${96 - (i % 2) * 8} ${200 + (i % 5) * 16} ${56 + (i % 3) * 8}`} stroke={i % 2 ? "#6b4a32" : "#b07a50"} strokeWidth="2.2" fill="none" />)}
      </svg>
      <Blossom className="absolute bottom-[8%] left-[2%] w-[18%]" />
      <Blossom className="absolute bottom-[20%] right-[0%] w-[14%] rotate-45" />
    </div>
  );
}

export const EW_CSS = `
.ew-porcelain{background-color:#fbf6ee;background-image:radial-gradient(60% 40% at 50% 30%,rgba(242,198,214,.35),transparent 70%),radial-gradient(50% 40% at 90% 90%,rgba(190,215,180,.3),transparent 70%),radial-gradient(40% 30% at 5% 70%,rgba(200,180,230,.25),transparent 70%)}
.ew-foil{background:linear-gradient(100deg,#6a4f8e 0%,#b48fd6 26%,#8e6bb8 46%,#c9a24e 62%,#6a4f8e 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ewShine 9s ease-in-out infinite}
@keyframes ewShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.ew-float{animation:ewFloat 7s ease-in-out infinite}
@keyframes ewFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-10px) rotate(6deg)}}
.ew-sway{animation:ewSway 6s ease-in-out infinite;transform-origin:0 0}
@keyframes ewSway{0%,100%{rotate:0deg}50%{rotate:2deg}}
.ew-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.ew-float,.ew-sway,.ew-foil{animation:none!important}}
`;
