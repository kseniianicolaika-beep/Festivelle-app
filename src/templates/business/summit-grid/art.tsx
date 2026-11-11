// Summit Grid — Swiss-modern conference identity: a 4×4 module of circles, quarter-arcs and squares in
// burgundy, blush and champagne on cream. Each tile carries data-tile so it can be dealt in on load.

const C = { wine: "#7d1d3a", blush: "#e9b8b4", champ: "#d9b57a", ink: "#231a1c", cream: "#f6efe4" };

type Tile = "circle" | "q1" | "q2" | "q3" | "q4" | "square" | "half" | "ring" | "blank" | "dot";
const LAYOUT: { t: Tile; c: string }[] = [
  { t: "q3", c: C.wine }, { t: "circle", c: C.blush }, { t: "blank", c: "" }, { t: "square", c: C.champ },
  { t: "ring", c: C.wine }, { t: "q1", c: C.champ }, { t: "half", c: C.wine }, { t: "dot", c: C.ink },
  { t: "blank", c: "" }, { t: "square", c: C.wine }, { t: "q2", c: C.blush }, { t: "circle", c: C.wine },
  { t: "q4", c: C.blush }, { t: "dot", c: C.wine }, { t: "circle", c: C.champ }, { t: "q3", c: C.ink },
];

function shape(t: Tile, c: string) {
  switch (t) {
    case "circle": return <circle cx="50" cy="50" r="46" fill={c} />;
    case "ring": return <circle cx="50" cy="50" r="38" fill="none" stroke={c} strokeWidth="14" />;
    case "dot": return <circle cx="50" cy="50" r="14" fill={c} />;
    case "square": return <rect x="6" y="6" width="88" height="88" fill={c} />;
    case "half": return <path d="M4 50A46 46 0 0 1 96 50Z" fill={c} />;
    case "q1": return <path d="M4 4H96A92 92 0 0 1 4 96Z" fill={c} />;
    case "q2": return <path d="M96 4V96A92 92 0 0 1 4 4Z" fill={c} />;
    case "q3": return <path d="M4 96V4A92 92 0 0 1 96 96Z" fill={c} />;
    case "q4": return <path d="M96 96H4A92 92 0 0 1 96 4Z" fill={c} />;
    default: return null;
  }
}

/** The 4×4 module. viewBox 400×400. `cells` trims to the first n tiles (rows of four). */
export function Module({ className = "", style, cells = 16 }: { className?: string; style?: React.CSSProperties; cells?: number }) {
  const rows = Math.ceil(cells / 4);
  return (
    <svg viewBox={`0 0 400 ${rows * 100}`} className={className} style={style} aria-hidden>
      {LAYOUT.slice(0, cells).map((x, i) => (
        <g key={i} transform={`translate(${(i % 4) * 100} ${Math.floor(i / 4) * 100})`}>
          <g data-tile style={{ transformOrigin: "50px 50px", transformBox: "fill-box" }}>{shape(x.t, x.c)}</g>
        </g>
      ))}
    </svg>
  );
}

/** A thin 12-column grid overlay; lines carry data-gridline. */
export function GridLines({ className = "", cols = 12 }: { className?: string; cols?: number }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 grid ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }, (_, i) => <span key={i} data-gridline className="border-l border-[var(--t-ink)]/[0.07] last:border-r" />)}
    </div>
  );
}

export const SG_CSS = `
.sg-paper{background-color:#f6efe4}
.sg-still *{animation:none!important}
.sg-spin{animation:sgSpin 40s linear infinite;transform-origin:50% 50%}
@keyframes sgSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){.sg-spin{animation:none!important}}
`;
export const SG_COLORS = C;
