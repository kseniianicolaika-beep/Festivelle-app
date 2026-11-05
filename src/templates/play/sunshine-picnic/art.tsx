import { darken, lighten } from "../_shared/color";

// Sunshine Picnic — marigold toran, patang kites, gulmohar trees and a gingham blanket.
export const PC = { cream: "#FFF5E8", paper: "#FFFBF3", marigold: "#F7B733", saffron: "#F39C34", flame: "#D2452B", leaf: "#6FA05A", leafDark: "#4E7F45", sky: "#BFE6EC", ink: "#4A2310", pink: "#F28AA0", teal: "#3FA7A3", violet: "#7C5CC4" };
const line = "#4A2310";

export function Sun({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pc-sun">
        <g className="pc-rays">
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d="M0 -76 C8 -92 6 -104 0 -116 C-6 -104 -8 -92 0 -76Z" fill={i % 2 ? PC.saffron : PC.marigold} transform={`rotate(${(i * 360) / 14})`} />
          ))}
        </g>
        <circle r="66" fill={PC.marigold} stroke={darken(PC.marigold, 0.2)} strokeWidth="2.5" />
        <circle r="56" fill={lighten(PC.marigold, 0.25)} />
        <g className="pc-sun-eyes">
          <path d="M-26 -8 C-22 -16 -12 -16 -8 -8" stroke={line} strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M8 -8 C12 -16 22 -16 26 -8" stroke={line} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        </g>
        <ellipse cx="-30" cy="8" rx="9" ry="5.5" fill={PC.flame} opacity=".35" />
        <ellipse cx="30" cy="8" rx="9" ry="5.5" fill={PC.flame} opacity=".35" />
        <path d="M-16 12 C-8 26 8 26 16 12 C6 16 -6 16 -16 12Z" fill={PC.flame} stroke={line} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Patang kite: diamond centred at (0,0) with bridle at (0,10); tail ribbons below. */
export function Kite({ x = 0, y = 0, s = 1, r = 0, a = PC.flame, b = PC.marigold, cls = "" }: { x?: number; y?: number; s?: number; r?: number; a?: string; b?: string; cls?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className={`pc-kite ${cls}`}>
        <path className="pc-tail" d="M0 58 C-10 76 10 92 0 110 C-10 128 8 140 2 156" fill="none" stroke={line} strokeOpacity=".5" strokeWidth="1.4" />
        {[80, 104, 128].map((ty, i) => <path key={ty} d={`M${i % 2 ? 2 : -4} ${ty} l-10 -6 l2 12Z M${i % 2 ? 2 : -4} ${ty} l10 -6 l-2 12Z`} fill={i % 2 ? b : a} />)}
        <path d="M0 -58 L44 0 L0 58 L-44 0Z" fill={b} stroke={darken(b, 0.3)} strokeWidth="2" strokeLinejoin="round" />
        <path d="M0 -58 L44 0 L0 0Z M0 58 L-44 0 L0 0Z" fill={a} />
        <path d="M0 -24 L18 0 L0 24 L-18 0Z" fill={PC.paper} opacity=".9" />
        <circle r="6" fill={a} />
        <path d="M0 -58 V58 M-44 0 Q0 -18 44 0" stroke={darken(b, 0.45)} strokeOpacity=".45" strokeWidth="1.6" fill="none" />
        <path d="M-40 54 L-30 64 L-46 66Z" fill={a} />
      </g>
    </g>
  );
}

/** A string of marigolds with mango leaves across w — a festive toran. */
export function Toran({ w = 1000, y = 0, sag = 40, n = 18 }: { w?: number; y?: number; sag?: number; n?: number }) {
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    return { x: +(t * w).toFixed(1), y: +(y + Math.sin(t * Math.PI) * sag).toFixed(1) };
  });
  return (
    <g>
      <path d={`M0 ${y} Q ${w / 2} ${y + sag * 2} ${w} ${y}`} fill="none" stroke={darken(PC.saffron, 0.3)} strokeWidth="2" />
      {pts.map((q, i) => (
        <g key={i} transform={`translate(${q.x} ${q.y})`}>
          <g className="pc-drop">
            {i % 3 === 1 && <path d="M0 4 C-12 18 -10 40 0 52 C10 40 12 18 0 4Z" fill={i % 2 ? PC.leaf : PC.leafDark} />}
            {i % 3 !== 1 && <>
              <path d="M0 0 L0 30" stroke={darken(PC.saffron, 0.3)} strokeWidth="1.4" />
              <Marigold y={34} s={0.75} c={i % 2 ? PC.saffron : PC.marigold} />
            </>}
            <Marigold s={0.9} c={i % 2 ? PC.marigold : PC.saffron} />
          </g>
        </g>
      ))}
    </g>
  );
}

export function Marigold({ x = 0, y = 0, s = 1, c = PC.marigold }: { x?: number; y?: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="12" fill={darken(c, 0.12)} />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => <ellipse key={a} cx="0" cy="-8" rx="4.5" ry="6" fill={c} transform={`rotate(${a})`} />)}
      {[20, 80, 140, 200, 260, 320].map((a) => <ellipse key={a} cx="0" cy="-4.5" rx="3.4" ry="4.5" fill={lighten(c, 0.2)} transform={`rotate(${a})`} />)}
      <circle r="3" fill={darken(c, 0.3)} />
    </g>
  );
}

/** Gulmohar tree, trunk base at (0,0). */
export function Tree({ x = 0, y = 0, s = 1, flowers = true }: { x?: number; y?: number; s?: number; flowers?: boolean }) {
  const blobs = [[-60, -170, 56], [0, -200, 66], [60, -170, 56], [-30, -130, 50], [36, -130, 50], [-90, -130, 40], [90, -130, 40]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-12 0 C-8 -40 -10 -80 -4 -120 L4 -120 C10 -80 8 -40 14 0Z" fill="#8B5A3C" />
      <path d="M-2 -90 C-20 -110 -40 -120 -54 -130 M4 -100 C20 -116 40 -126 58 -132" stroke="#8B5A3C" strokeWidth="6" strokeLinecap="round" />
      <g className="pc-canopy">
        {blobs.map(([bx, by, r], i) => <circle key={i} cx={bx} cy={by} r={r} fill={i % 2 ? PC.leaf : "#7DB065"} />)}
        {flowers && blobs.map(([bx, by], i) => <g key={i}>{[[-14, -10], [12, 6], [0, 18], [18, -16]].map(([dx, dy], j) => <circle key={j} cx={bx + dx} cy={by + dy} r={j % 2 ? 5 : 6.5} fill={j % 2 ? PC.flame : "#E86A3A"} />)}</g>)}
      </g>
    </g>
  );
}

/** Gingham blanket in perspective, centred at (0,0). */
export function Blanket({ x = 0, y = 0, s = 1, id }: { x?: number; y?: number; s?: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <pattern id={`${id}-g`} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#fff" />
          <rect width="12" height="24" fill={PC.flame} opacity=".55" />
          <rect width="24" height="12" fill={PC.flame} opacity=".55" />
        </pattern>
      </defs>
      <path d="M-150 -40 L150 -40 L200 40 L-200 40Z" fill={`url(#${id}-g)`} stroke={darken(PC.flame, 0.2)} strokeWidth="2" />
      <path d="M-200 40 L200 40 L196 50 L-196 50Z" fill={darken(PC.flame, 0.15)} />
    </g>
  );
}

export function Basket({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-44 -40 C-44 -84 44 -84 44 -40" fill="none" stroke="#B5803F" strokeWidth="7" />
      <circle cx="-16" cy="-46" r="13" fill="#E8402E" /><circle cx="10" cy="-50" r="12" fill={PC.marigold} /><path d="M24 -44 C34 -60 46 -54 40 -40Z" fill="#9CC84A" />
      <path d="M-50 -40 L50 -40 L42 0 L-42 0Z" fill="#D9A15A" stroke="#9A6A2F" strokeWidth="2" />
      {[-30, -10, 10, 30].map((x1) => <path key={x1} d={`M${x1} -40 L${x1 * 0.85} 0`} stroke="#B5803F" strokeWidth="2" />)}
      <path d="M-46 -24 H46 M-44 -10 H44" stroke="#B5803F" strokeWidth="2" />
      <path d="M-50 -40 L50 -40" stroke={PC.flame} strokeWidth="6" />
    </g>
  );
}

/** Indian palm squirrel, sitting, feet at (0,0). */
export function Squirrel({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  const fur = "#A88466";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="pc-squirrel">
        <path className="pc-tailq" d="M-14 -6 C-50 -10 -60 -60 -40 -90 C-30 -104 -14 -100 -20 -84 C-30 -60 -20 -36 -4 -24Z" fill="#BFA084" stroke={line} strokeOpacity=".3" strokeWidth="1.4" />
        <path d="M-20 0 C-26 -30 -14 -46 2 -46 C18 -46 24 -26 18 0Z" fill={fur} stroke={line} strokeOpacity=".3" strokeWidth="1.4" />
        <path d="M-6 -44 C-8 -30 -6 -14 -2 -2 M2 -44 C2 -30 4 -14 6 -2" stroke="#F3E3CC" strokeWidth="2.4" fill="none" />
        <ellipse cx="6" cy="-58" rx="16" ry="15" fill={fur} stroke={line} strokeOpacity=".3" strokeWidth="1.4" />
        <path d="M-4 -70 L-6 -82 L4 -72Z M10 -72 L14 -84 L18 -70Z" fill={fur} stroke={line} strokeOpacity=".3" />
        <ellipse cx="18" cy="-54" rx="7" ry="6" fill="#E9D3BA" />
        <circle cx="10" cy="-61" r="2.6" fill={line} /><circle cx="10.8" cy="-62" r=".8" fill="#fff" />
        <circle cx="24" cy="-56" r="2" fill={line} />
        <ellipse cx="2" cy="-52" rx="4" ry="2.4" fill={PC.pink} opacity=".5" />
        <ellipse cx="14" cy="-30" rx="6" ry="5" fill="#E9D3BA" />
        <circle cx="16" cy="-34" r="5" fill="#A0602F" />
      </g>
    </g>
  );
}

export function Grass({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <path d={`M0 ${h * 0.3} C ${w * 0.25} ${h * 0.05} ${w * 0.5} ${h * 0.35} ${w * 0.75} ${h * 0.15} S ${w} ${h * 0.2} ${w} ${h * 0.2} L${w} ${h} L0 ${h}Z`} fill="#A9CF7A" />
      <path d={`M0 ${h * 0.5} C ${w * 0.3} ${h * 0.32} ${w * 0.6} ${h * 0.6} ${w} ${h * 0.42} L${w} ${h} L0 ${h}Z`} fill="#8EBF63" />
    </g>
  );
}
