import { darken, lighten } from "../_shared/color";

// Princess Castle — blush stone, rose cone roofs, gold line-work and a shy unicorn.
export const PR = { blush: "#FBF0F0", stone: "#F6DCE0", rose: "#E9A9B6", deep: "#C0617A", plum: "#4A2230", gold: "#C9A27A", goldL: "#E9CFA6", lilac: "#C9B6E4", night: "#5B3A6E", cream: "#FFF8F3" };

export function Flag({ x = 0, y = 0, s = 1, c = PR.deep }: { x?: number; y?: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 V-46" stroke={PR.gold} strokeWidth="2.5" />
      <circle cy="-48" r="3" fill={PR.gold} />
      <path className="pr-flag" d="M1 -44 C12 -48 22 -40 34 -44 L30 -34 L34 -24 C22 -20 12 -28 1 -24Z" fill={c} />
    </g>
  );
}

/** Tower: base centre at (x, y), width w, wall height h, cone roof. */
export function Tower({ x, y, w, h, roof = 1.3, c = PR.stone, rc = PR.rose, flag = true }: { x: number; y: number; w: number; h: number; roof?: number; c?: string; rc?: string; flag?: boolean }) {
  const top = y - h;
  const rh = w * roof;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h} fill={c} stroke={darken(c, 0.15)} strokeWidth="2" />
      <rect x={x - w / 2} y={top} width={w * 0.22} height={h} fill="#fff" opacity=".25" />
      {Array.from({ length: Math.floor(h / 34) }, (_, i) => <path key={i} d={`M${x - w / 2} ${top + 30 + i * 34} H${x + w / 2}`} stroke={darken(c, 0.08)} strokeWidth="1.5" />)}
      <path d={`M${x - w * 0.12} ${top + h * 0.42} v-${w * 0.18} a${w * 0.12} ${w * 0.12} 0 0 1 ${w * 0.24} 0 v${w * 0.18}Z`} fill={PR.night} />
      <path d={`M${x - w * 0.12} ${top + h * 0.42} v-${w * 0.18} a${w * 0.12} ${w * 0.12} 0 0 1 ${w * 0.24} 0 v${w * 0.18}Z`} fill="none" stroke={PR.gold} strokeWidth="2" />
      <circle className="pr-win" cx={x} cy={top + h * 0.42 - w * 0.12} r={w * 0.05} fill="#FBE3A0" />
      <path d={`M${x - w / 2 - 8} ${top} L${x} ${top - rh} L${x + w / 2 + 8} ${top}Z`} fill={rc} stroke={darken(rc, 0.2)} strokeWidth="2" strokeLinejoin="round" />
      <path d={`M${x - w * 0.18} ${top - rh * 0.25} L${x} ${top - rh} `} stroke="#fff" strokeOpacity=".45" strokeWidth="5" strokeLinecap="round" />
      <path d={`M${x - w / 2 - 8} ${top} Q ${x} ${top + 14} ${x + w / 2 + 8} ${top}`} fill="none" stroke={PR.gold} strokeWidth="2.5" />
      {flag && <Flag x={x} y={top - rh} s={w / 110} />}
    </g>
  );
}

/** Castle facade with an arched gate hole: viewBox 760×900; gate x 137..623, spring y 543, bottom 900. */
export function Facade({ id }: { id: string }) {
  const crenel = (x0: number, x1: number, y: number) => {
    const n = Math.floor((x1 - x0) / 34);
    return Array.from({ length: n }, (_, i) => <rect key={i} x={x0 + i * 34 + 4} y={y - 18} width="22" height="20" fill={PR.stone} stroke={darken(PR.stone, 0.15)} strokeWidth="2" />);
  };
  return (
    <g>
      <defs>
        <mask id={`${id}-gate`}>
          <rect x="-50" y="-50" width="900" height="1000" fill="#fff" />
          <path d="M137 900 V543 A243 243 0 0 1 623 543 V900Z" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${id}-gate)`}>
        <rect x="90" y="250" width="580" height="660" fill={PR.stone} stroke={darken(PR.stone, 0.15)} strokeWidth="2" />
        {crenel(90, 670, 250)}
        <Tower x={380} y={260} w={120} h={110} roof={1.15} rc={PR.deep} />
      </g>
      <path d="M137 900 V543 A243 243 0 0 1 623 543 V900" fill="none" stroke={PR.gold} strokeWidth="5" />
      <path d="M115 900 V543 A265 265 0 0 1 645 543 V900" fill="none" stroke={PR.rose} strokeWidth="14" />
      <path d="M115 900 V543 A265 265 0 0 1 645 543 V900" fill="none" stroke={PR.gold} strokeWidth="2" strokeDasharray="1 12" strokeLinecap="round" />
      <g transform="translate(380 270)"><Crown s={0.6} /></g>
      <Tower x={70} y={900} w={140} h={560} roof={1.25} />
      <Tower x={690} y={900} w={140} h={560} roof={1.25} />
      {[[70, 600], [690, 600]].map(([x, y]) => <g key={x}>{crenel(x - 70, x + 72, y)}</g>)}
      <path d="M0 900 H760" stroke={darken(PR.stone, 0.2)} strokeWidth="3" />
    </g>
  );
}

export function Crown({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pr-crown">
        <path d="M-46 20 L-52 -24 L-26 0 L0 -36 L26 0 L52 -24 L46 20Z" fill={PR.goldL} stroke={darken(PR.gold, 0.25)} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M-46 20 H46 V30 H-46Z" fill={PR.gold} stroke={darken(PR.gold, 0.25)} strokeWidth="2.5" />
        <circle cx="0" cy="-36" r="6" fill={PR.deep} /><circle cx="-52" cy="-24" r="5" fill={PR.lilac} /><circle cx="52" cy="-24" r="5" fill={PR.lilac} />
        <circle cx="-22" cy="25" r="3.5" fill={PR.deep} /><circle cx="0" cy="25" r="3.5" fill="#7FB9D6" /><circle cx="22" cy="25" r="3.5" fill={PR.deep} />
        <path d="M-34 6 L-30 -8 M30 -8 L34 6" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Shy unicorn head + neck, neck base at (0,0), looking right. */
export function Unicorn({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="pr-uni">
        <path d="M-30 0 C-34 -40 -20 -70 4 -86 L30 -60 C20 -40 16 -20 20 0Z" fill="#fff" stroke={PR.plum} strokeOpacity=".3" strokeWidth="2" />
        <path d="M4 -86 C30 -98 60 -88 66 -64 C70 -50 62 -40 50 -40 C36 -40 30 -50 22 -50 C16 -50 18 -56 14 -62Z" fill="#fff" stroke={PR.plum} strokeOpacity=".3" strokeWidth="2" />
        <ellipse cx="56" cy="-50" rx="11" ry="9" fill="#FCE4EA" />
        <circle cx="60" cy="-52" r="1.6" fill={PR.plum} />
        <path d="M28 -72 C32 -66 38 -66 42 -72" stroke={PR.plum} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M30 -70 l-2 4 M35 -68 l0 4 M40 -70 l2 4" stroke={PR.plum} strokeWidth="1.4" strokeLinecap="round" />
        <ellipse cx="40" cy="-58" rx="6" ry="3.5" fill={PR.rose} opacity=".7" />
        <path d="M10 -92 L0 -116 L20 -96Z" fill="#fff" stroke={PR.plum} strokeOpacity=".3" strokeWidth="2" strokeLinejoin="round" />
        <path className="pr-horn" d="M22 -96 L36 -140 L34 -92Z" fill={PR.goldL} stroke={darken(PR.gold, 0.2)} strokeWidth="2" strokeLinejoin="round" />
        <path d="M25 -106 L33 -108 M27 -118 L34 -120" stroke={darken(PR.gold, 0.2)} strokeWidth="1.5" />
        <path className="pr-mane" d="M6 -96 C-14 -96 -22 -76 -18 -60 C-30 -54 -36 -36 -30 -20 C-40 -12 -40 0 -34 6 C-48 -4 -52 -30 -40 -48 C-46 -70 -30 -98 6 -96Z" fill={PR.lilac} />
        <path d="M4 -98 C-8 -92 -10 -80 -6 -70 C-14 -66 -18 -54 -16 -44" fill="none" stroke={PR.rose} strokeWidth="8" strokeLinecap="round" />
        <path d="M14 -98 C8 -104 0 -104 -4 -98" fill="none" stroke="#9EC9E8" strokeWidth="7" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Sparkle({ x = 0, y = 0, s = 1, c = PR.gold, cls = "pr-tw" }: { x?: number; y?: number; s?: number; c?: string; cls?: string }) {
  return <path className={cls} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -10 Q0 0 10 0 Q0 0 0 10 Q0 0 -10 0 Q0 0 0 -10Z" fill={c} />;
}

export function Hill({ w, h, c = "#E8D3E6" }: { w: number; h: number; c?: string }) {
  return (
    <g>
      <path d={`M0 ${h * 0.4} C ${w * 0.25} ${h * 0.05} ${w * 0.75} ${h * 0.05} ${w} ${h * 0.4} L${w} ${h} L0 ${h}Z`} fill={c} />
      <path d={`M0 ${h * 0.65} C ${w * 0.3} ${h * 0.45} ${w * 0.7} ${h * 0.45} ${w} ${h * 0.65} L${w} ${h} L0 ${h}Z`} fill={lighten(c, 0.3)} />
    </g>
  );
}
