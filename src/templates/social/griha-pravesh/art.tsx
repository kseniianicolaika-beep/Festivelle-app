import { useId, type CSSProperties } from "react";

// Griha Pravesh — the first entry into a new home. A carved teak doorway whose doors swing open (data-door),
// a marigold & mango-leaf toran across the lintel, a copper kalash with coconut, a rangoli at the threshold
// and kumkum footprints stepping in (data-step).

const MARI = ["#f6b21b", "#f08a12", "#e2621d"], LEAF = "#3f6b2f", LEAF_D = "#2a4a20", MAROON = "#6b1420", VERM = "#b8261e";

/** A garland of marigolds with mango leaves hanging between, spanning 0..w. */
export function Toran({ className = "", style, w = 400, drops = 7 }: { className?: string; style?: CSSProperties; w?: number; drops?: number }) {
  const step = w / (drops + 1);
  return (
    <svg viewBox={`0 0 ${w} 90`} className={className} style={style} aria-hidden overflow="visible">
      <path d={`M0 10Q${w / 2} 30 ${w} 10`} stroke="#9c6b1e" strokeWidth="2" fill="none" />
      {Array.from({ length: Math.round(w / 11) }, (_, i) => {
        const x = 6 + i * 11;
        const y = 10 + 20 * (1 - Math.pow((x - w / 2) / (w / 2), 2)) * 0.5;
        return <circle key={i} cx={x} cy={y} r="6" fill={MARI[i % 3]} stroke="#b9580e" strokeWidth=".6" />;
      })}
      {Array.from({ length: drops }, (_, i) => {
        const x = step * (i + 1);
        const y0 = 10 + 20 * (1 - Math.pow((x - w / 2) / (w / 2), 2)) * 0.5;
        return (
          <g key={i}>
            <path d={`M${x - 6} ${y0 + 4}c-6 18 -2 34 6 44 8-10 12-26 6-44z`} fill={i % 2 ? LEAF : LEAF_D} />
            <path d={`M${x} ${y0 + 6}v38`} stroke="#9fbf6a" strokeWidth=".8" />
            {[14, 24, 34].map((dy, k) => <circle key={k} cx={x + (k % 2 ? 7 : -7)} cy={y0 + dy} r="4" fill={MARI[(i + k) % 3]} />)}
          </g>
        );
      })}
    </svg>
  );
}

/** Copper kalash with mango leaves and a coconut wrapped in red thread. viewBox 160×200. */
export function Kalash({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 160 200" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`k${id}`} x1="0" x2="1"><stop offset="0" stopColor="#7a3412" /><stop offset=".35" stopColor="#e9a066" /><stop offset=".55" stopColor="#c46a32" /><stop offset="1" stopColor="#5e260c" /></linearGradient>
        <radialGradient id={`c${id}`} cx=".4" cy=".35"><stop offset="0" stopColor="#a8743e" /><stop offset="1" stopColor="#5a3818" /></radialGradient>
      </defs>
      {[-58, -34, -12, 12, 34, 58].map((a, i) => <path key={a} d="M80 70c-8-20-6-44 0-60 6 16 8 40 0 60z" transform={`rotate(${a} 80 74)`} fill={i % 2 ? LEAF : LEAF_D} />)}
      <ellipse cx="80" cy="56" rx="24" ry="28" fill={`url(#c${id})`} />
      <path d="M58 56c14 6 30 6 44 0M60 66c13 5 27 5 40 0" stroke={VERM} strokeWidth="2.4" fill="none" />
      <path d="M52 82h56l-4 10H56z" fill={`url(#k${id})`} />
      <path d="M56 92c-30 14-34 66 0 84h48c34-18 30-70 0-84z" fill={`url(#k${id})`} />
      <path d="M44 128h72" stroke="#f6d27a" strokeWidth="3" />
      <path d="M46 138h68" stroke={VERM} strokeWidth="2" />
      {[60, 80, 100].map((x) => <circle key={x} cx={x} cy="128" r="2.6" fill={VERM} />)}
      <ellipse cx="80" cy="178" rx="34" ry="5" fill="#5e260c" />
    </svg>
  );
}

/** Rangoli medallion. viewBox 200×200. */
export function Rangoli({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const ring = (n: number, r: number, l: number, w: number, fill: string, rot = 0) =>
    Array.from({ length: n }, (_, i) => <path key={i} d={`M0 0C${w} ${-l * 0.3} ${w * 0.6} ${-l * 0.8} 0 ${-l}C${-w * 0.6} ${-l * 0.8} ${-w} ${-l * 0.3} 0 0Z`} transform={`translate(100 100) rotate(${(360 / n) * i + rot}) translate(0 ${-r})`} fill={fill} />);
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <circle cx="100" cy="100" r="96" fill="#f7e2c0" opacity=".5" />
      {ring(16, 52, 40, 12, MARI[1])}
      {ring(16, 52, 32, 9, VERM, 11.25)}
      {ring(8, 30, 20, 10, "#d94f8a")}
      <circle cx="100" cy="100" r="22" fill={MARI[0]} />
      <circle cx="100" cy="100" r="12" fill={MAROON} />
      <circle cx="100" cy="100" r="5" fill="#fff4d8" />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={100 + 88 * Math.cos((i * Math.PI) / 12)} cy={100 + 88 * Math.sin((i * Math.PI) / 12)} r="3" fill={i % 2 ? VERM : MARI[0]} />)}
    </svg>
  );
}

/** A small kumkum footprint (left or right). viewBox 30×60. */
function Foot({ x, y, flip, i }: { x: number; y: number; flip?: boolean; i: number }) {
  return (
    <g data-step transform={`translate(${x} ${y}) scale(${flip ? -0.5 : 0.5} .5)`} style={{ ["--i" as string]: i } as CSSProperties}>
      <path d="M2 22c0-12 6-20 12-20s10 8 9 20c-1 10-2 18-6 26-3 6-12 6-14-2-2-6-1-14-1-24z" fill={VERM} opacity=".85" />
      {[0, 6, 11, 15, 18].map((dx, k) => <circle key={k} cx={4 + dx} cy={-4 + Math.abs(k - 1.5) * 1.6} r={k === 0 ? 3.2 : 2.2} fill={VERM} opacity=".85" />)}
    </g>
  );
}

/** The carved doorway. viewBox 400×520. Doors open when `open`. */
export function Doorway({ className = "", style, open = false, steps = true }: { className?: string; style?: CSSProperties; open?: boolean; steps?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 520" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`t${id}`} x1="0" x2="1"><stop offset="0" stopColor="#5a2a10" /><stop offset=".5" stopColor="#8f4c1f" /><stop offset="1" stopColor="#4a220c" /></linearGradient>
        <linearGradient id={`d${id}`} x1="0" x2="1"><stop offset="0" stopColor="#7a3a16" /><stop offset=".6" stopColor="#a45a26" /><stop offset="1" stopColor="#6a3010" /></linearGradient>
        <radialGradient id={`in${id}`} cx=".5" cy=".55"><stop offset="0" stopColor="#fff2c8" /><stop offset=".6" stopColor="#ffd27a" /><stop offset="1" stopColor="#f0a03a" /></radialGradient>
        <linearGradient id={`b${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8a6a2c" /><stop offset=".5" stopColor="#f0d79a" /><stop offset="1" stopColor="#8a6a2c" /></linearGradient>
      </defs>
      {/* frame with arch */}
      <path d="M40 470V170C40 80 110 30 200 30s160 50 160 140v300z" fill={`url(#t${id})`} />
      <path d="M70 470V176C70 104 128 64 200 64s130 40 130 112v294z" fill={`url(#in${id})`} />
      {/* warm light spilling */}
      <path d="M70 470L-10 520h420l-80-50z" fill="#ffd27a" opacity={open ? 0.35 : 0} style={{ transition: "opacity 1.4s ease" }} />
      {/* carved dots on frame */}
      {Array.from({ length: 13 }, (_, i) => <circle key={i} cx={200 + 145 * Math.cos(Math.PI + (i * Math.PI) / 12)} cy={170 + 125 * Math.sin(Math.PI + (i * Math.PI) / 12)} r="4" fill="#d7a65a" />)}
      {[200, 260, 320, 380, 440].map((y) => <g key={y}><circle cx="55" cy={y} r="4" fill="#d7a65a" /><circle cx="345" cy={y} r="4" fill="#d7a65a" /></g>)}
      {/* doors */}
      <g data-door="l" style={{ transform: open ? "scaleX(.14) skewY(-8deg)" : undefined, transformOrigin: "70px 300px", transformBox: "view-box", transition: "transform 1.6s cubic-bezier(.6,0,.2,1)" }}>
        <path d="M70 470V176C70 120 104 80 200 66v404z" fill={`url(#d${id})`} stroke="#4a220c" strokeWidth="2" />
        {[200, 300, 400].map((y) => <rect key={y} x="90" y={y - 40} width="92" height="70" rx="4" fill="none" stroke="#d7a65a" strokeWidth="1.6" />)}
        <circle cx="186" cy="320" r="7" fill={`url(#b${id})`} />
      </g>
      <g data-door="r" style={{ transform: open ? "scaleX(.14) skewY(8deg)" : undefined, transformOrigin: "330px 300px", transformBox: "view-box", transition: "transform 1.6s cubic-bezier(.6,0,.2,1)" }}>
        <path d="M330 470V176C330 120 296 80 200 66v404z" fill={`url(#d${id})`} stroke="#4a220c" strokeWidth="2" />
        {[200, 300, 400].map((y) => <rect key={y} x="218" y={y - 40} width="92" height="70" rx="4" fill="none" stroke="#d7a65a" strokeWidth="1.6" />)}
        <circle cx="214" cy="320" r="7" fill={`url(#b${id})`} />
      </g>
      {/* threshold + footprints */}
      <rect x="28" y="466" width="344" height="16" rx="3" fill="#5a2a10" />
      <rect x="28" y="466" width="344" height="4" fill="#d7a65a" />
      {steps && [[178, 500, false], [222, 488, true]].map(([x, y, f], i) => <Foot key={i} x={x as number} y={y as number} flip={f as boolean} i={i} />)}
      {/* toran on the lintel */}
      <g transform="translate(70 92) scale(.65)"><Toran w={400} drops={7} /></g>
    </svg>
  );
}

export const GP_CSS = `
.gp-paper{background-color:#fbf3e3;background-image:radial-gradient(65% 45% at 50% 30%,rgba(255,210,122,.35),transparent 70%),radial-gradient(circle at 12% 20%,rgba(226,98,29,.07) 0 2px,transparent 3px),radial-gradient(circle at 80% 70%,rgba(226,98,29,.06) 0 2px,transparent 3px);background-size:auto,38px 38px,46px 46px}
.gp-border{background:repeating-linear-gradient(90deg,#b8261e 0 10px,#f6b21b 10px 20px,#3f6b2f 20px 30px,#f6b21b 30px 40px)}
.gp-root .ss-h2,.gp-root .ss-venue{font-family:var(--f-display,var(--cf-yatra)),var(--font-rozha),var(--cf-prata),serif;color:#6b1420}
.gp-root .ss-v,.gp-root .ss-ev,.gp-root .ss-lead,.gp-root .ss-num{font-family:var(--cf-corm),Georgia,serif;font-style:italic;color:#6b1420}
.gp-root .ss-script{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#e2621d}
.gp-root .ss-k,.gp-root .ss-time{color:#b9580e}
.gp-root .ss-s,.gp-root .ss-body{color:#5a3a26}
.gp-root .ss-cell{background:#fffaf0;border:1px solid rgba(226,98,29,.35);border-radius:999px 999px 10px 10px;box-shadow:0 20px 40px -30px rgba(120,50,10,.5)}
.gp-root .ss-dots{border-color:rgba(226,98,29,.5)}
.gp-root .ss-btn{background:#6b1420;color:#fbf3e3}
.gp-root .ss-btn-ghost{background:transparent;color:#6b1420;border:1px solid rgba(107,20,32,.4)}
.gp-root .ss-photo{border:6px solid #fffaf0;box-shadow:0 0 0 2px #e2621d,0 30px 60px -30px rgba(120,50,10,.5)}
.gp-root .ss-panel{background:#fffaf0;border:1px solid rgba(226,98,29,.35);border-radius:22px}
.gp-root [data-step]{opacity:0;animation:gpStep .6s ease forwards;animation-delay:calc(1.9s + var(--i) * .5s)}
@keyframes gpStep{to{opacity:1}}
.gp-card .sc-eyebrow,.gp-card .sc-where{font-family:var(--cf-tenor),sans-serif;color:#b9580e}
.gp-card .sc-name,.gp-card .sc-head,.gp-card .sc-num,.gp-card .sc-tag{font-family:var(--f-display,var(--cf-yatra)),var(--font-rozha),var(--cf-prata),serif;color:#6b1420}
.gp-card .sc-date,.gp-card .sc-item-t{font-family:var(--cf-corm),Georgia,serif;font-style:italic;color:#6b1420}
.gp-card .sc-amp,.gp-card .sc-line,.gp-card .sc-foot,.gp-card .sc-host,.gp-card .sc-tagline{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#e2621d}
.gp-card .sc-lead,.gp-card .sc-body,.gp-card .sc-item-d{font-family:var(--cf-corm),Georgia,serif;font-style:italic;color:#5a3a26}
.gp-card .sc-item+.sc-item{border-top:1px dashed rgba(226,98,29,.4)}
.gp-card [data-step]{opacity:1}
@media (prefers-reduced-motion: reduce){.gp-root [data-step]{animation:none;opacity:1}}
`;
