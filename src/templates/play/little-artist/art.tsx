import { darken, lighten } from "../_shared/color";
import { rng } from "../_shared/kit";

// Little Artist — cotton paper, watercolour blooms, a cheerful palette and brush.
export const LA = { paper: "#FCFAF5", ink: "#352A45", violet: "#8E6BB8", coral: "#F27C6B", sun: "#F5C44E", teal: "#4DB6AC", pink: "#F29BC0", sky: "#74A9E8", leaf: "#8CC084", wood: "#C9935B" };
export const PAINTS = [LA.coral, LA.sun, LA.teal, LA.sky, LA.violet, LA.pink, LA.leaf];
const line = "#352A45";

/** Shared watercolour filter + gradients. Put once per <svg>. */
export function WcDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-wc`} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="0.8" />
      </filter>
      {PAINTS.map((c, i) => (
        <radialGradient key={i} id={`${id}-p${i}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={lighten(c, 0.35)} stopOpacity=".45" />
          <stop offset=".75" stopColor={c} stopOpacity=".55" />
          <stop offset=".96" stopColor={darken(c, 0.12)} stopOpacity=".8" />
          <stop offset="1" stopColor={darken(c, 0.2)} stopOpacity=".2" />
        </radialGradient>
      ))}
    </defs>
  );
}

/** Lumpy organic blob path radius ~r. */
export function blobPath(r: number, seed: number, lumps = 9) {
  const R = rng(seed);
  const pts = Array.from({ length: lumps }, (_, i) => {
    const a = (i / lumps) * Math.PI * 2;
    const k = r * (0.78 + R() * 0.4);
    return [Math.cos(a) * k, Math.sin(a) * k];
  });
  let d = "";
  for (let i = 0; i < lumps; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % lumps];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += i === 0 ? `M${mx.toFixed(1)} ${my.toFixed(1)} ` : "";
    const [x2, y2] = pts[(i + 1) % lumps];
    const [x3, y3] = pts[(i + 2) % lumps];
    d += `Q${x2.toFixed(1)} ${y2.toFixed(1)} ${((x2 + x3) / 2).toFixed(1)} ${((y2 + y3) / 2).toFixed(1)} `;
  }
  return d + "Z";
}

export function Blob({ id, x = 0, y = 0, r = 80, ci = 0, seed = 1, cls = "" }: { id: string; x?: number; y?: number; r?: number; ci?: number; seed?: number; cls?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`la-blob ${cls}`}>
        <path d={blobPath(r, seed)} fill={`url(#${id}-p${ci % PAINTS.length})`} filter={`url(#${id}-wc)`} />
        <circle cx={r * 0.55} cy={-r * 0.7} r={r * 0.08} fill={PAINTS[ci % PAINTS.length]} opacity=".5" filter={`url(#${id}-wc)`} />
        <circle cx={-r * 0.8} cy={r * 0.6} r={r * 0.05} fill={PAINTS[ci % PAINTS.length]} opacity=".45" />
      </g>
    </g>
  );
}

/** Smiling paint palette, centred. */
export function Palette({ x = 0, y = 0, s = 1, r = 0 }: { x?: number; y?: number; s?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className="la-palette">
        <path d="M-90 10 C-100 -50 -40 -86 20 -80 C80 -74 110 -30 96 14 C86 46 50 42 40 30 C28 16 6 24 10 44 C14 64 -10 80 -40 72 C-70 64 -86 44 -90 10Z" fill="#E8C397" stroke={line} strokeOpacity=".35" strokeWidth="2.5" />
        <path d="M-80 8 C-88 -40 -40 -72 18 -68" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="22" cy="40" rx="12" ry="10" fill="#C79E6C" />
        {[[-58, -20, 0], [-28, -52, 1], [12, -58, 2], [50, -44, 3], [74, -10, 4], [-60, 24, 5]].map(([cx, cy, ci], i) => (
          <g key={i}>
            <path d={blobPath(13, i + 3, 7)} transform={`translate(${cx} ${cy})`} fill={PAINTS[ci]} />
            <circle cx={cx - 4} cy={cy - 4} r="3" fill="#fff" opacity=".5" />
          </g>
        ))}
        <g className="la-eyes">
          <ellipse cx="-24" cy="6" rx="4" ry="5" fill={line} /><ellipse cx="0" cy="4" rx="4" ry="5" fill={line} />
          <circle cx="-23" cy="4.5" r="1.3" fill="#fff" /><circle cx="1" cy="2.5" r="1.3" fill="#fff" />
        </g>
        <path d="M-22 22 C-16 30 -4 30 2 20" stroke={line} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <ellipse cx="-36" cy="18" rx="6" ry="3.5" fill={LA.coral} opacity=".45" /><ellipse cx="14" cy="15" rx="6" ry="3.5" fill={LA.coral} opacity=".45" />
      </g>
    </g>
  );
}

/** Paintbrush; tip at (0,0), handle up-right. */
export function Brush({ x = 0, y = 0, s = 1, r = -35, c = LA.violet }: { x?: number; y?: number; s?: number; r?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className="la-brush">
        <path d="M-8 -150 C-8 -164 8 -164 8 -150 L10 -40 L-10 -40Z" fill={LA.wood} stroke={line} strokeOpacity=".35" strokeWidth="2" />
        <path d="M-4 -150 L-4 -50" stroke="#fff" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
        <path d="M-11 -42 L11 -42 L12 -18 L-12 -18Z" fill="#C9CED6" stroke={line} strokeOpacity=".35" strokeWidth="2" />
        <path d="M-12 -30 H12" stroke="#9AA2AE" strokeWidth="2" />
        <path d="M-12 -18 C-14 -6 -6 4 0 6 C6 4 14 -6 12 -18Z" fill="#8B6A4F" />
        <path d="M-8 -6 C-6 2 -2 6 0 6 C2 6 6 2 8 -6 C4 -2 -4 -2 -8 -6Z" fill={c} />
        <circle cx="-3" cy="-94" r="2.6" fill={line} /><circle cx="5" cy="-94" r="2.6" fill={line} />
        <path d="M-3 -84 C0 -80 4 -80 6 -84" stroke={line} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Crayon({ x = 0, y = 0, s = 1, r = 0, c = LA.coral }: { x?: number; y?: number; s?: number; r?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M-9 0 L9 0 L9 -90 L-9 -90Z" fill={c} stroke={darken(c, 0.25)} strokeWidth="1.5" />
      <path d="M-9 -90 L0 -112 L9 -90Z" fill={darken(c, 0.1)} />
      <rect x="-9" y="-70" width="18" height="44" fill="#fff" opacity=".85" />
      <path d="M-9 -64 H9 M-9 -32 H9" stroke={c} strokeWidth="2" />
      <path d="M-5 -60 l10 0 M-5 -40 l6 0" stroke={darken(c, 0.2)} strokeWidth="1.5" />
    </g>
  );
}

/** Wooden easel with a canvas: canvas inner box 0..200 × 0..240 from (x,y) top-left. */
export function Easel({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M100 -30 L20 340 M100 -30 L180 340 M100 -30 L100 330" stroke={LA.wood} strokeWidth="10" strokeLinecap="round" />
      <rect x="-10" y="246" width="220" height="12" rx="4" fill={darken(LA.wood, 0.1)} />
      <rect x="-6" y="-6" width="212" height="252" rx="4" fill="#fff" stroke={line} strokeOpacity=".2" strokeWidth="2" />
    </g>
  );
}
