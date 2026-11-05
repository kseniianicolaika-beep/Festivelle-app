"use client";
import type { CSSProperties } from "react";
import { useGid } from "../_shared/kit";
import { GZ } from "./look";

// Gzhel brushwork: every petal and leaf is a single loaded-brush stroke — saturated cobalt on one edge,
// fading to porcelain white on the other (objectBoundingBox gradient in each stroke's local frame).
// Hooks for the stage: data-stroke (petals), data-leaf, data-draw (lines), data-dot, data-band, data-ring.

type P = { className?: string; style?: CSSProperties };
const f = (n: number) => n.toFixed(2);
const pt = (r: number, deg: number) => { const a = (deg * Math.PI) / 180; return [Math.cos(a) * r, Math.sin(a) * r] as const; };

function Ink({ id }: { id: string }) {
  return (
    <>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={GZ.deep} />
        <stop offset="0.32" stopColor={GZ.cobalt} />
        <stop offset="0.68" stopColor="#5f86e0" stopOpacity="0.85" />
        <stop offset="1" stopColor="#c9d7f6" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id={`${id}h`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7d9be6" stopOpacity="0.2" />
        <stop offset="0.45" stopColor={GZ.cobalt} />
        <stop offset="0.6" stopColor={GZ.deep} />
        <stop offset="1" stopColor="#7d9be6" stopOpacity="0.15" />
      </linearGradient>
    </>
  );
}

const crescent = (w: number, h: number) => `M${-w} 0C${f(-w * 0.8)} ${-h} ${f(w * 0.8)} ${-h} ${w} 0C${f(w * 0.45)} ${f(-h * 0.42)} ${f(-w * 0.45)} ${f(-h * 0.42)} ${-w} 0Z`;
const HALF_LEAF = "M0 0C12 -13 32 -15 50 -2C32 -5 14 -3 0 0Z";

function Petal({ g, x, y, r, w, h }: { g: string; x: number; y: number; r: number; w: number; h: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${r})`}><path data-stroke d={crescent(w, h)} fill={`url(#${g})`} /></g>;
}
function Leaf({ g, x, y, r, s = 1 }: { g: string; x: number; y: number; r: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path data-leaf d={HALF_LEAF} fill={`url(#${g})`} transform="translate(0 -1.2)" />
      <path data-leaf d={HALF_LEAF} fill={`url(#${g})`} transform="translate(0 1.2) scale(1 -1)" opacity="0.8" />
    </g>
  );
}
function Berries({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <circle data-dot r="3.4" fill={GZ.cobalt} /><circle data-dot cx="7" cy="-4" r="2.6" fill={GZ.bright} /><circle data-dot cx="6" cy="5" r="2.1" fill="#5f86e0" />
    </g>
  );
}
const Tendril = ({ x, y, r, s = 1 }: { x: number; y: number; r: number; s?: number }) => (
  <path data-draw d="M0 0C10 -7 22 -5 24 4C25 11 17 13 15 7" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} stroke={GZ.cobalt} strokeWidth="1.3" strokeLinecap="round" fill="none" />
);

/** The agashka — a frontal Gzhel rose: rings of single loaded-brush strokes (dark outer edge fading to
 *  porcelain toward the heart) around a deep cobalt bud. Centred on 0,0 (≈ 110 wide). */
function Rose({ g }: { g: string }) {
  const ring = (n: number, r: number, w: number, h: number, off: number) =>
    Array.from({ length: n }, (_, i) => {
      const deg = off + (360 / n) * i;
      const [x, y] = pt(r, deg - 90);
      return <Petal key={`${r}-${i}`} g={g} x={+f(x)} y={+f(y)} r={deg} w={w} h={h} />;
    });
  return (
    <g>
      {ring(7, 36, 22, 24, 0)}
      {ring(6, 22, 16, 17, 26)}
      {ring(4, 10, 11, 12, 45)}
      <Petal g={g} x={0} y={4} r={180} w={9} h={10} />
      <circle data-dot cx="0" cy="-1" r="4.2" fill={GZ.deep} />
      <circle data-dot cx="1.4" cy="-2.4" r="1.1" fill="#fbfcff" opacity="0.8" />
    </g>
  );
}

/** A sprig: rose, leaves, tendrils and berries (viewBox -130 -90 260 180). */
export function Sprig({ className, style, flip = false }: P & { flip?: boolean }) {
  const g = useGid("gs");
  return (
    <svg viewBox="-130 -90 260 180" className={className} style={style} aria-hidden fill="none">
      <defs><Ink id={g} /></defs>
      <g transform={flip ? "scale(-1 1)" : undefined}>
        <SprigBody g={g} />
      </g>
    </svg>
  );
}
function SprigBody({ g }: { g: string }) {
  return (
    <>
      <path data-draw d="M-118 46C-80 40 -50 30 -36 18M40 -30C66 -50 90 -56 120 -52" stroke={GZ.cobalt} strokeWidth="1.6" strokeLinecap="round" />
      <Leaf g={g} x={-40} y={24} r={168} s={1.05} />
      <Leaf g={g} x={-74} y={40} r={200} s={0.7} />
      <Leaf g={g} x={44} y={-26} r={-24} s={1} />
      <Leaf g={g} x={80} y={-50} r={-8} s={0.66} />
      <Leaf g={g} x={36} y={30} r={30} s={0.8} />
      <Leaf g={g} x={-36} y={-34} r={-150} s={0.62} />
      <Tendril x={-96} y={44} r={150} s={1.1} />
      <Tendril x={100} y={-54} r={-40} />
      <Tendril x={58} y={52} r={60} s={0.8} />
      <Berries x={-64} y={-44} r={-20} />
      <Berries x={82} y={30} r={40} />
      <Rose g={g} />
    </>
  );
}

/** Thin flowing brush swash (a painted rule). */
export function Swash({ className, style }: P) {
  const g = useGid("sw");
  return (
    <svg viewBox="0 0 240 16" className={className} style={style} aria-hidden fill="none">
      <defs><Ink id={g} /></defs>
      <path data-stroke d="M4 9C50 2 110 1 236 7C150 11 70 13 4 9Z" fill={`url(#${g}h)`} />
      <circle data-dot cx="120" cy="13.5" r="1.8" fill={GZ.cobalt} />
    </svg>
  );
}

/** The porcelain plate: gilt edge, cobalt band with a white wave, scalloped fringe and a painted rose. */
export function Plate({ className, style, center = "rose" }: P & { center?: "rose" | "none" }) {
  const g = useGid("pl");
  const glaze = `${g}gl`;
  const wave = Array.from({ length: 145 }, (_, i) => { const deg = i * 2.5; const [x, y] = pt(190 + Math.sin((i * Math.PI) / 2.5) * 3.2, deg); return `${i ? "L" : "M"}${f(x)} ${f(y)}`; }).join("") + "Z";
  const N = 40;
  let fringe = "";
  for (let i = 0; i < N; i++) {
    const [x0, y0] = pt(174, (i * 360) / N), [x1, y1] = pt(174, ((i + 1) * 360) / N);
    const r = Math.hypot(x1 - x0, y1 - y0) / 2;
    fringe += `M${f(x0)} ${f(y0)}A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y1)}`;
  }
  const dots = Array.from({ length: N }, (_, i) => pt(160, ((i + 0.5) * 360) / N));
  return (
    <svg viewBox="-212 -212 424 424" className={className} style={style} aria-hidden fill="none">
      <defs>
        <Ink id={g} />
        <radialGradient id={glaze} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f6f8fe" />
          <stop offset="1" stopColor="#e3eaf8" />
        </radialGradient>
      </defs>
      <circle r="206" fill={`url(#${glaze})`} />
      <circle data-ring r="205" stroke={GZ.gold} strokeWidth="2" />
      <circle data-band r="190" stroke={GZ.cobalt} strokeWidth="13" />
      <path data-draw d={wave} stroke="#ffffff" strokeWidth="1.3" />
      <circle data-ring r="178" stroke={GZ.cobalt} strokeWidth="1.2" />
      <path data-draw d={fringe} stroke={GZ.cobalt} strokeWidth="1.1" />
      {dots.map(([x, y], i) => <circle key={i} data-dot cx={f(x)} cy={f(y)} r="1.9" fill={GZ.cobalt} />)}
      <circle data-ring r="146" stroke={GZ.pale} strokeWidth="0.8" />
      <ellipse cx="-70" cy="-96" rx="70" ry="26" transform="rotate(-32 -70 -96)" fill="#ffffff" opacity="0.55" />
      {center === "rose" && <g transform="scale(1.08)"><SprigBody g={g} /></g>}
    </svg>
  );
}

/** Plate rim only, sized to frame a round photo (use with an absolutely-placed circle at 15.5% inset). */
export function Rim({ className, style }: P) {
  return <Plate className={className} style={style} center="none" />;
}

/** Arkhangelskoye-style manor: portico, pediment, belvedere and wings, drawn in cobalt brush lines. */
export function Manor({ className, style }: P) {
  const g = useGid("mn");
  const cols = [132, 159, 186, 214, 241, 268];
  const win = (x: number, y: number) => `M${x} ${y}h10v18h-10zM${x} ${y + 6}h10`;
  return (
    <svg viewBox="0 0 400 236" className={className} style={style} aria-hidden fill="none">
      <defs><Ink id={g} /></defs>
      <g stroke={GZ.cobalt} strokeLinejoin="round" strokeLinecap="round">
        <path data-draw d="M2 224H398" strokeWidth="1.8" />
        <path data-draw d="M18 224V146H112M382 224V146H288M14 146H112M386 146H288" strokeWidth="1.3" />
        <path data-draw d="M14 152H112M386 152H288" strokeWidth="0.6" />
        {[30, 54, 78].flatMap((x) => [win(x, 162), win(x, 194), win(400 - x - 10, 162), win(400 - x - 10, 194)]).map((d, i) => <path key={i} data-draw d={d} strokeWidth="0.8" />)}
        <path data-draw d="M112 224V120H288V224" strokeWidth="1.4" />
        <path data-draw d="M118 140H282M118 130H282" strokeWidth="1" />
        <path data-draw d="M116 130L200 98L284 130Z" strokeWidth="1.4" />
        <path data-draw d="M136 126L200 104L264 126" strokeWidth="0.6" />
        {cols.map((x) => <path key={x} data-draw d={`M${x - 3} 212V142M${x + 3} 212V142M${x - 5} 142h10M${x - 5} 212h10`} strokeWidth="0.9" />)}
        <path data-draw d="M120 212H280M114 218H286M108 224H292" strokeWidth="0.9" />
        <path data-draw d="M172 98V70H228V98" strokeWidth="1.1" />
        {[180, 192, 204, 216].map((x) => <path key={x} data-draw d={`M${x} 94V74`} strokeWidth="0.6" />)}
        <path data-draw d="M166 70H234" strokeWidth="1" />
        <path data-draw d="M170 70A30 30 0 0 1 230 70" strokeWidth="1.4" />
        <path data-draw d="M196 42V34H204V42M200 34V20" strokeWidth="1" />
      </g>
      <path data-stroke d="M171 69A29 29 0 0 1 229 69C214 62 186 62 171 69Z" fill={`url(#${g})`} />
      <circle data-dot cx="200" cy="18" r="2.6" fill={GZ.gold} />
    </svg>
  );
}

/** A leafy corner spray for tiles and cards. */
export function Corner({ className, style }: P) {
  const g = useGid("co");
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden fill="none">
      <defs><Ink id={g} /></defs>
      <path data-draw d="M6 6C40 12 70 30 88 60" stroke={GZ.cobalt} strokeWidth="1.3" strokeLinecap="round" />
      <Leaf g={g} x={22} y={12} r={20} s={0.62} />
      <Leaf g={g} x={44} y={22} r={58} s={0.58} />
      <Leaf g={g} x={64} y={38} r={30} s={0.5} />
      <Petal g={g} x={14} y={14} r={-45} w={14} h={14} />
      <Petal g={g} x={18} y={20} r={135} w={16} h={13} />
      <Berries x={86} y={66} r={30} />
      <Tendril x={30} y={34} r={90} s={0.7} />
    </svg>
  );
}
