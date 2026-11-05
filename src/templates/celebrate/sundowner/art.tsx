import { useId } from "react";

// Sundowner — a striped Goan sun sinking into the Arabian Sea, coconut-palm silhouettes, shimmer on water,
// and a DJ's sound-wave along the horizon.

/** Retro sliced sun. viewBox 200×200. */
export function Sun({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset=".45" stopColor="#ffb85c" />
          <stop offset="1" stopColor="#f0603c" />
        </linearGradient>
        <mask id={`m${id}`}>
          <rect width="200" height="200" fill="#fff" />
          {[118, 134, 148, 160, 171, 181, 190].map((y, i) => <rect key={y} x="0" y={y} width="200" height={2 + i * 0.9} fill="#000" />)}
        </mask>
        <radialGradient id={`g${id}`}><stop offset=".45" stopColor="#ffb85c" stopOpacity=".55" /><stop offset="1" stopColor="#ff7a45" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#g${id})`} />
      <circle cx="100" cy="100" r="66" fill={`url(#s${id})`} mask={`url(#m${id})`} />
    </svg>
  );
}

/** Coconut palm silhouette, leaning. viewBox 200×320, base at bottom-left area. */
export function Palm({ className = "", style, flip = false }: { className?: string; style?: React.CSSProperties; flip?: boolean }) {
  const fr = (a: number, l: number, droop: number) => {
    const r = (a * Math.PI) / 180;
    const ex = 120 + Math.cos(r) * l, ey = 70 + Math.sin(r) * l + droop;
    const mx = 120 + Math.cos(r) * l * 0.5, my = 70 + Math.sin(r) * l * 0.5 - 18;
    const n = 18;
    let leaves = "";
    for (let i = 2; i < n; i++) {
      const t = i / n;
      const px = (1 - t) ** 2 * 120 + 2 * (1 - t) * t * mx + t * t * ex;
      const py = (1 - t) ** 2 * 70 + 2 * (1 - t) * t * my + t * t * ey;
      const len = 30 * Math.sin(t * Math.PI) + 5;
      leaves += `M${px} ${py}l${Math.cos(r + 1.9) * len} ${Math.sin(r + 1.9) * len + len * 0.5}M${px} ${py}l${Math.cos(r - 1.9) * len} ${Math.sin(r - 1.9) * len + len * 0.5}`;
    }
    return <g key={a}><path d={`M120 70Q${mx} ${my} ${ex} ${ey}`} strokeWidth="3" /><path d={leaves} strokeWidth="3" /></g>;
  };
  return (
    <svg viewBox="0 0 200 320" className={className} style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }} aria-hidden overflow="visible">
      <g fill="none" stroke="var(--sd-sil, #1d0f24)" strokeLinecap="round" className="sd-palm" style={{ transformOrigin: "120px 70px" }}>
        {[-160, -120, -75, -30, 10, 50, 140].map((a, i) => fr(a, [80, 95, 90, 95, 85, 70, 70][i], [30, 10, 0, 6, 30, 40, 40][i]))}
      </g>
      <path d="M118 72C110 140 92 220 60 320h14C100 230 120 150 124 72z" fill="var(--sd-sil, #1d0f24)" />
      {[0, 1, 2].map((i) => <circle key={i} cx={116 + i * 5} cy={78 + (i % 2) * 4} r="5" fill="var(--sd-sil, #1d0f24)" />)}
    </svg>
  );
}

/** Water shimmer: horizontal dashes reflecting the sun. */
export function Shimmer({ className = "", lines = 14 }: { className?: string; lines?: number }) {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" className={className} aria-hidden>
      {Array.from({ length: lines }, (_, i) => {
        const y = 4 + i * (92 / lines);
        const w = 70 - i * 3.6;
        return <rect key={i} className="sd-shim" style={{ animationDelay: `${(i * 0.37) % 2}s` }} x={100 - w / 2 + ((i * 13) % 9) - 4} y={y} width={w} height={1.2 + i * 0.12} rx=".6" fill="#ffd38a" opacity={0.85 - i * 0.045} />;
      })}
    </svg>
  );
}

/** DJ sound-wave bars. */
export function Wave({ className = "", bars = 48, live = true }: { className?: string; bars?: number; live?: boolean }) {
  return (
    <div className={`flex items-end justify-center gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: bars }, (_, i) => {
        const h = 20 + Math.abs(Math.sin(i * 0.7) * 60) + ((i * 37) % 20);
        return <span key={i} className={`block w-[3px] rounded-full bg-current ${live ? "sd-bar" : ""}`} style={{ height: `${h}%`, animationDelay: `${-((i * 0.13) % 1.2)}s`, animationDuration: `${0.9 + ((i * 7) % 5) * 0.12}s` }} />;
      })}
    </div>
  );
}

export const SKY = "linear-gradient(180deg,#2a1640 0%,#5a2154 22%,#b33f4f 46%,#ec7a45 64%,#ffc47a 80%,#ffe0a3 100%)";
export const SEA = "linear-gradient(180deg,#3b4f7a 0%,#1f3558 40%,#13233f 100%)";

export const SD_CSS = `
.sd-bar{animation:sdBar 1.1s ease-in-out infinite alternate;transform-origin:bottom}
@keyframes sdBar{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
.sd-party .sd-bar{animation-duration:.35s!important}
.sd-shim{animation:sdShim 2.4s ease-in-out infinite}
@keyframes sdShim{0%,100%{opacity:.25;transform:translateX(-3px)}50%{opacity:.95;transform:translateX(3px)}}
.sd-palm{animation:sdPalm 6s ease-in-out infinite}
@keyframes sdPalm{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2.5deg)}}
.sd-still *{animation:none!important}
.sd-hand{font-family:var(--cf-caveat),cursive}
@media (prefers-reduced-motion: reduce){.sd-bar,.sd-shim,.sd-palm{animation:none!important}}
`;
