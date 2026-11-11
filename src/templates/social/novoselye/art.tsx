import { useId, type CSSProperties } from "react";

// Новоселье — a Russian housewarming. A carved wooden window frame (наличник) whose four panes light up one by one
// (data-pane), the house cat on the sill (tradition: the cat crosses the threshold first), a round karavai with a
// salt cellar on an embroidered rushnyk, and a cross-stitch band.

const RED = "#a3202e", BLUE = "#3a5a9c", IVORY = "#f8f3ea";

function StitchPaths({ w, color }: { w: number; color: string }) {
  const n = Math.floor(w / 24);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = i * 24 + 12;
        return i % 2 ? (
          <path key={i} d={`M${x - 4} 8l8 8M${x + 4} 8l-8 8`} stroke={color} strokeWidth="1.6" />
        ) : (
          <g key={i} fill="none" stroke={color} strokeWidth="1.6">
            <path d={`M${x} 2l10 10-10 10-10-10z`} />
            <path d={`M${x} 8l4 4-4 4-4-4z`} fill={color} />
          </g>
        );
      })}
    </>
  );
}

/** Cross-stitch band (repeating rhombus & cross motif), width w. viewBox w×24. */
export function Stitch({ className = "", style, w = 400, color = RED }: { className?: string; style?: CSSProperties; w?: number; color?: string }) {
  return (
    <svg viewBox={`0 0 ${w} 24`} preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden>
      <StitchPaths w={w} color={color} />
    </svg>
  );
}

/** Carved window frame with a cat on the sill. viewBox 300×400. */
export function Nalichnik({ className = "", style, lit = true }: { className?: string; style?: CSSProperties; lit?: boolean }) {
  const id = useId().replace(/:/g, "");
  const scallop = (y: number, x0: number, x1: number, up = false) => {
    let d = `M${x0} ${y}`;
    for (let x = x0; x < x1; x += 20) d += `q10 ${up ? -14 : 14} 20 0`;
    return d;
  };
  return (
    <svg viewBox="0 0 300 400" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`l${id}`} cx=".5" cy=".6"><stop offset="0" stopColor="#fff2c6" /><stop offset=".6" stopColor="#ffd27a" /><stop offset="1" stopColor="#e8963a" /></radialGradient>
        <linearGradient id={`w${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24365e" /><stop offset="1" stopColor="#1a2440" /></linearGradient>
      </defs>
      {/* crown: kokoshnik pediment */}
      <path d="M20 96C60 30 110 10 150 10s90 20 130 86z" fill={IVORY} stroke={BLUE} strokeWidth="3" />
      <path d="M50 92C80 50 116 34 150 34s70 16 100 58" fill="none" stroke={BLUE} strokeWidth="2" />
      <circle cx="150" cy="62" r="14" fill="none" stroke={RED} strokeWidth="2.4" />
      <path d="M150 48v28M136 62h28" stroke={RED} strokeWidth="1.6" />
      {[-1, 1].map((s) => <path key={s} d={`M150 62c${s * 30}-20 ${s * 52}-6 ${s * 60} 16`} fill="none" stroke={RED} strokeWidth="1.8" />)}
      {/* frame */}
      <rect x="30" y="96" width="240" height="250" fill={IVORY} stroke={BLUE} strokeWidth="3" />
      <path d={scallop(96, 30, 270)} fill="none" stroke={BLUE} strokeWidth="2" />
      {/* panes */}
      <rect x="56" y="118" width="188" height="206" fill={`url(#w${id})`} />
      {[[56, 118], [152, 118], [56, 223], [152, 223]].map(([x, y], i) => (
        <rect key={i} data-pane x={x} y={y} width="92" height="101" fill={`url(#l${id})`} style={{ opacity: lit ? 1 : 0, ["--i" as string]: i } as CSSProperties} />
      ))}
      <path d="M150 118v206M56 221h188" stroke={IVORY} strokeWidth="6" />
      <rect x="56" y="118" width="188" height="206" fill="none" stroke={IVORY} strokeWidth="5" />
      {/* lace curtain corners */}
      <path d="M60 122c30 0 46 24 50 60-16-10-34-14-50-14z" fill="#fff" opacity=".55" />
      <path d="M240 122c-30 0-46 24-50 60 16-10 34-14 50-14z" fill="#fff" opacity=".55" />
      {/* side shutters' carving */}
      {[30, 270].map((x) => [140, 200, 260, 320].map((y) => <path key={`${x}${y}`} d={`M${x} ${y - 14}l${x < 150 ? -10 : 10} 14l${x < 150 ? 10 : -10} 14`} fill="none" stroke={BLUE} strokeWidth="2" />))}
      {/* sill + cat */}
      <path d="M14 346h272l-10 18H24z" fill={IVORY} stroke={BLUE} strokeWidth="3" />
      <path d={scallop(364, 24, 276)} fill="none" stroke={BLUE} strokeWidth="2" />
      <g data-cat transform="translate(176 270)">
        <path d="M10 76c-8-30 2-52 22-58l4-16 9 13c6-1 12-1 17 1l9-13 3 17c16 10 20 34 12 56z" fill="#2a1d1a" />
        <path d="M78 74c18 2 26-8 22-20" stroke="#2a1d1a" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="38" cy="34" r="3" fill="#ffd27a" /><circle cx="54" cy="34" r="3" fill="#ffd27a" />
      </g>
      {/* geranium pot */}
      <g transform="translate(70 300)">
        <path d="M4 22h36l-5 24H9z" fill="#b5562f" />
        {[[12, 10], [24, 4], [34, 12], [20, 14]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill={i % 2 ? RED : "#d6455a"} />)}
        <path d="M22 22v-8M14 22l-4-8M30 22l5-8" stroke="#3f6b2f" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** Karavai on a rushnyk with a salt cellar. viewBox 260×200. */
export function Karavai({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 260 200" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`b${id}`} cx=".45" cy=".3"><stop offset="0" stopColor="#f3c27a" /><stop offset=".6" stopColor="#c98636" /><stop offset="1" stopColor="#8a4f18" /></radialGradient>
      </defs>
      {/* rushnyk hanging */}
      <path d="M20 120h220v40H20z" fill="#fffaf2" stroke="#e5d7c3" />
      <path d="M20 160l8 30h204l8-30" fill="#fffaf2" stroke="#e5d7c3" />
      <svg x="24" y="166" width="212" height="12" viewBox="0 0 432 24"><StitchPaths w={432} color={RED} /></svg>
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${30 + i * 9.4} 190v8`} stroke={RED} strokeWidth="1.4" />)}
      {/* loaf */}
      <ellipse cx="130" cy="122" rx="96" ry="16" fill="#000" opacity=".12" />
      <path d="M38 118c0-50 40-78 92-78s92 28 92 78z" fill={`url(#b${id})`} />
      {/* braided rim + wheat ears */}
      {Array.from({ length: 13 }, (_, i) => <ellipse key={i} cx={46 + i * 14} cy={114} rx="9" ry="6" fill="#d6984a" stroke="#8a4f18" strokeWidth=".8" />)}
      {[-1, 1].map((s) => <g key={s}>{Array.from({ length: 5 }, (_, k) => <ellipse key={k} cx={130 + s * (18 + k * 9)} cy={78 - k * 2} rx="5" ry="3" transform={`rotate(${s * 30} ${130 + s * (18 + k * 9)} ${78 - k * 2})`} fill="#e8b468" stroke="#8a4f18" strokeWidth=".6" />)}</g>)}
      {/* salt cellar */}
      <path d="M116 58c0-10 28-10 28 0l-4 14h-20z" fill="#fff" stroke={BLUE} strokeWidth="1.6" />
      <path d="M118 62h24" stroke={BLUE} strokeWidth="1.2" />
      <ellipse cx="130" cy="56" rx="12" ry="3" fill="#f2f2f2" />
    </svg>
  );
}

/** Birch twig ornament. viewBox 160×40. */
export function BirchTwig({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 160 40" className={className} style={style} aria-hidden>
      <path d="M6 22c40-6 100-6 148 0" stroke="#d9d2c4" strokeWidth="4" strokeLinecap="round" />
      {[20, 46, 74, 104, 132].map((x) => <path key={x} d={`M${x} 21h7`} stroke="#3b302a" strokeWidth="2" />)}
      {[30, 60, 90, 120].map((x, i) => <path key={x} d={`M${x} 20c4-10 12-14 20-12-4 8-12 12-20 12z`} fill={i % 2 ? "#7c9a52" : "#9cb86c"} transform={i % 2 ? `rotate(180 ${x} 22)` : undefined} />)}
    </svg>
  );
}

export const NV_CSS = `
.nv-paper{background-color:#f8f3ea;background-image:radial-gradient(60% 45% at 50% 34%,rgba(255,210,122,.28),transparent 70%),repeating-linear-gradient(45deg,rgba(163,32,46,.025) 0 2px,transparent 2px 12px),repeating-linear-gradient(-45deg,rgba(58,90,156,.02) 0 2px,transparent 2px 12px)}
.nv-root [data-pane]{opacity:0;animation:nvPane .9s ease forwards;animation-delay:calc(.9s + var(--i) * .45s)}
@keyframes nvPane{to{opacity:1}}
.nv-root .ss-h2,.nv-root .ss-venue{font-family:var(--f-display,var(--cf-ruslan)),var(--cf-prata),serif;color:#6e1420}
.nv-root .ss-v,.nv-root .ss-ev,.nv-root .ss-lead,.nv-root .ss-num{font-family:var(--cf-prata),Georgia,serif;color:#6e1420}
.nv-root .ss-lead{font-style:normal}
.nv-root .ss-script{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#3a5a9c}
.nv-root .ss-k,.nv-root .ss-time{color:#3a5a9c}
.nv-root .ss-s,.nv-root .ss-body{color:#4a3a34;font-family:var(--cf-kurale),Georgia,serif}
.nv-root .ss-cell{background:#fffdf8;border:2px solid #3a5a9c;border-radius:2px;box-shadow:inset 0 0 0 4px #fffdf8,inset 0 0 0 5px rgba(163,32,46,.4)}
.nv-root .ss-dots{border-color:rgba(58,90,156,.45)}
.nv-root .ss-btn{background:#a3202e;color:#fffaf2}
.nv-root .ss-btn-ghost{background:transparent;color:#3a5a9c;border:1px solid rgba(58,90,156,.5)}
.nv-root .ss-photo{border:8px solid #fffdf8;outline:2px solid #3a5a9c;box-shadow:0 30px 60px -30px rgba(30,40,80,.4)}
.nv-root .ss-panel{background:#fffdf8;border:2px solid #3a5a9c;border-radius:4px}
.nv-card .sc-eyebrow,.nv-card .sc-where{font-family:var(--cf-tenor),sans-serif;color:#3a5a9c}
.nv-card .sc-name,.nv-card .sc-head,.nv-card .sc-num,.nv-card .sc-tag{font-family:var(--f-display,var(--cf-ruslan)),var(--cf-prata),serif;color:#6e1420}
.nv-card .sc-date,.nv-card .sc-item-t{font-family:var(--cf-prata),Georgia,serif;color:#6e1420}
.nv-card .sc-amp,.nv-card .sc-line,.nv-card .sc-foot,.nv-card .sc-host,.nv-card .sc-tagline{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#a3202e}
.nv-card .sc-lead,.nv-card .sc-body,.nv-card .sc-item-d{font-family:var(--cf-kurale),Georgia,serif;color:#4a3a34}
.nv-card .sc-item+.sc-item{border-top:1px dashed rgba(58,90,156,.45)}
@media (prefers-reduced-motion: reduce){.nv-root [data-pane]{animation:none;opacity:1}}
`;
