// Champagne Toast — art-deco gold on onyx: a coupe tower with a pour, a sunburst, stepped deco corners, velvet.
import type { CSSProperties } from "react";

const s = (c: string): CSSProperties => ({ stopColor: c });

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-gold`} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" style={s("var(--foil-a)")} />
        <stop offset=".45" style={s("var(--foil-b)")} />
        <stop offset=".7" style={s("var(--foil-a)")} />
        <stop offset="1" style={s("var(--foil-b)")} />
      </linearGradient>
      <linearGradient id={`${id}-wine`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff3c8" stopOpacity=".95" />
        <stop offset="1" stopColor="#d9a64a" stopOpacity=".9" />
      </linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".05" />
        <stop offset=".3" stopColor="#fff" stopOpacity=".35" />
        <stop offset=".55" stopColor="#fff" stopOpacity=".06" />
        <stop offset="1" stopColor="#fff" stopOpacity=".22" />
      </linearGradient>
    </defs>
  );
}

/** One coupe at (x,y) = rim centre. */
function Coupe({ x, y, id, w = 40 }: { x: number; y: number; id: string; w?: number }) {
  const h = w / 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-h} 0Q${-h} ${w * 0.32} 0 ${w * 0.32}Q${h} ${w * 0.32} ${h} 0Z`} fill={`url(#${id}-glass)`} stroke={`url(#${id}-gold)`} strokeWidth=".8" />
      <path d={`M${-h + 2} 2Q${-h + 3} ${w * 0.3} 0 ${w * 0.3}Q${h - 3} ${w * 0.3} ${h - 2} 2Z`} fill={`url(#${id}-wine)`} opacity=".85" />
      <ellipse cx="0" cy="0" rx={h} ry={w * 0.06} fill="none" stroke={`url(#${id}-gold)`} strokeWidth=".8" />
      <ellipse cx="0" cy="1.2" rx={h - 2} ry={w * 0.045} fill="#fff6d8" opacity=".55" />
      <path d={`M0 ${w * 0.32}V${w * 0.78}`} style={{ stroke: "var(--foil-b)" }} strokeWidth="1.3" />
      <ellipse cx="0" cy={w * 0.8} rx={w * 0.22} ry={w * 0.045} fill={`url(#${id}-gold)`} />
      <path d={`M${-h + 5} 4Q${-h + 7} ${w * 0.22} -4 ${w * 0.27}`} stroke="#fff" strokeOpacity=".6" strokeWidth=".9" fill="none" />
    </g>
  );
}

/** The coupe tower (4·3·2·1) with a pour stream and spill. */
export function Tower({ className = "", id = "ct", pour = true }: { className?: string; id?: string; pour?: boolean }) {
  const rows = [4, 3, 2, 1];
  const W = 40, gap = 44, rowH = 34;
  return (
    <svg viewBox="0 0 200 230" className={className} aria-hidden>
      <Defs id={id} />
      {pour && (
        <g className="ct-pour">
          <path d="M132 0C120 10 104 40 101 86" fill="none" stroke={`url(#${id}-wine)`} strokeWidth="2.4" strokeLinecap="round" className="ct-stream" />
          <path d="M101 98c-14 2-22 8-22 24M101 98c14 2 22 8 22 24M57 132c-8 3-12 10-12 22M145 132c8 3 12 10 12 22" fill="none" stroke="#f6dca0" strokeOpacity=".7" strokeWidth="1.2" className="ct-spill" />
        </g>
      )}
      {rows.map((n, r) => {
        const y = 222 - (r + 1) * rowH - 10;
        return Array.from({ length: n }, (_, i) => <Coupe key={`${r}-${i}`} id={id} w={W} x={100 + (i - (n - 1) / 2) * gap} y={y} />);
      })}
      <path d="M10 222h180" stroke={`url(#${id}-gold)`} strokeWidth="1" />
      <path d="M24 227h152" stroke={`url(#${id}-gold)`} strokeWidth=".5" opacity=".6" />
    </svg>
  );
}

/** A single raised coupe for small marks. */
export function Glass({ className = "", id = "cg" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="-30 -8 60 50" className={className} aria-hidden>
      <Defs id={id} />
      <Coupe x={0} y={0} id={id} w={50} />
      {[[-6, -4, 1.4], [3, -6, 1], [8, -2, 1.2], [-1, -9, .8]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="var(--foil-b)" strokeWidth=".5" className="ct-fizz" style={{ animationDelay: `${i * 0.5}s` }} />)}
    </svg>
  );
}

/** Deco sunburst rays fanning from the bottom centre. */
export function Sunburst({ className = "", rays = 36 }: { className?: string; rays?: number }) {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" className={className} style={{ maskImage: "radial-gradient(75% 100% at 50% 100%, #000 25%, transparent 85%)", WebkitMaskImage: "radial-gradient(75% 100% at 50% 100%, #000 25%, transparent 85%)" }} aria-hidden>
      {Array.from({ length: rays }, (_, i) => {
        const a = Math.PI * (i / (rays - 1));
        const x = 200 - Math.cos(a) * 400, y = 200 - Math.sin(a) * 400;
        return <path key={i} d={`M200 200L${x.toFixed(1)} ${y.toFixed(1)}`} stroke="var(--t-gold)" strokeWidth={i % 2 ? 0.35 : 0.8} opacity={i % 2 ? 0.35 : 0.6} />;
      })}
      {[60, 90, 120].map((r) => <path key={r} d={`M${200 - r} 200a${r} ${r} 0 0 1 ${r * 2} 0`} fill="none" stroke="var(--t-gold)" strokeWidth=".6" opacity=".5" />)}
    </svg>
  );
}

/** Stepped deco corner; rotate for each corner. */
export function Corner({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 60" className={className} style={style} aria-hidden fill="none" stroke="var(--t-gold)" strokeWidth="1">
      <path d="M2 58V2h56" />
      <path d="M8 58V14h6V8h44" />
      <path d="M14 58V22h8v-8h36" strokeOpacity=".55" />
      <path d="M2 2l12 12" strokeOpacity=".7" />
      <circle cx="14" cy="14" r="2" fill="var(--t-gold)" />
    </svg>
  );
}

/** Deco fan crest. */
export function Fan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" className={className} aria-hidden fill="none" stroke="var(--t-gold)" strokeWidth=".9">
      {Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (0.1 + 0.8 * (i / 8)); return <path key={i} d={`M60 60L${(60 - Math.cos(a) * 54).toFixed(1)} ${(60 - Math.sin(a) * 54).toFixed(1)}`} />; })}
      <path d="M6 60a54 54 0 0 1 108 0" />
      <path d="M24 60a36 36 0 0 1 72 0" />
      <path d="M44 60a16 16 0 0 1 32 0" fill="var(--t-gold)" fillOpacity=".25" />
      <path d="M0 62h120" />
    </svg>
  );
}

/** Velvet curtain panel (CSS pleats) — used for the opening. */
export const velvet = (side: "l" | "r"): CSSProperties => ({
  background: `repeating-linear-gradient(90deg, #1a0a0f 0px, #3a0f1c 18px, #5a1a2b 30px, #2a0b14 46px, #12060a 60px), linear-gradient(${side === "l" ? "90deg" : "270deg"}, rgba(0,0,0,.6), transparent 40%)`,
  backgroundBlendMode: "multiply",
  boxShadow: side === "l" ? "inset -30px 0 60px rgba(0,0,0,.7)" : "inset 30px 0 60px rgba(0,0,0,.7)",
});
