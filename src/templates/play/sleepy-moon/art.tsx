import { darken, lighten } from "../_shared/color";

// Sleepy Moon — a felt nursery mobile. Soft shapes with hand-stitched edges.
export const SM = { sky: "#EEF3FA", powder: "#DCE7F5", blue: "#9DB5DA", ink: "#2E3A55", moon: "#F7E2A3", gold: "#D9B98A", pink: "#F2C4CC", lilac: "#D9D0F0", mint: "#CFE8E0", cream: "#FFFBF2" };
const stitch = { fill: "none", strokeDasharray: "3 4", strokeLinecap: "round" as const, strokeWidth: 1.4 };

const STAR = (R: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const k = i % 2 ? r : R;
    return `${(Math.cos(a) * k).toFixed(1)},${(Math.sin(a) * k).toFixed(1)}`;
  }).join(" ");

/** A felt star hanging from (0,0) by a thread of length len. */
export function HangStar({ x = 0, y = 0, len = 120, s = 1, c = SM.moon, cls = "" }: { x?: number; y?: number; len?: number; s?: number; c?: string; cls?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`sm-hang ${cls}`}>
        <path d={`M0 0 L0 ${len}`} stroke={SM.ink} strokeOpacity=".3" strokeWidth="1.2" />
        <g transform={`translate(0 ${len + 26 * s}) scale(${s})`} className="sm-star">
          <polygon points={STAR(28, 13)} fill={c} stroke={darken(c, 0.18)} strokeWidth="5" strokeLinejoin="round" />
          <polygon points={STAR(28, 13)} fill={c} strokeLinejoin="round" />
          <polygon points={STAR(22, 10)} {...stitch} stroke={darken(c, 0.35)} strokeOpacity=".55" />
          <path d="M-8 -10 L-4 -16" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** Felt cloud, centred. */
export function FeltCloud({ x = 0, y = 0, s = 1, c = "#FFFFFF", o = 1, cls = "" }: { x?: number; y?: number; s?: number; c?: string; o?: number; cls?: string }) {
  const d = "M-62 18 C-80 18 -84 -4 -66 -10 C-68 -32 -40 -42 -28 -26 C-20 -50 16 -52 24 -28 C38 -42 66 -32 60 -10 C80 -8 80 18 60 18Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <g className={cls}>
        <path d={d} fill={c} stroke={darken(c, 0.08)} strokeWidth="2" />
        <path d={d} transform="scale(.86) translate(0 1)" {...stitch} stroke={SM.blue} strokeOpacity=".55" />
      </g>
    </g>
  );
}

/** The sleepy crescent moon in a nightcap, centred near (0,0), ~ 260 tall. */
export function SleepyMoon({ x = 0, y = 0, s = 1, id }: { x?: number; y?: number; s?: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}-m`} cx="30%" cy="40%" r="80%">
          <stop offset="0" stopColor={lighten(SM.moon, 0.5)} />
          <stop offset=".6" stopColor={SM.moon} />
          <stop offset="1" stopColor={darken(SM.moon, 0.12)} />
        </radialGradient>
      </defs>
      <g className="sm-moon">
        <circle r="150" fill="#FFFFFF" opacity=".35" className="sm-glow" />
        <path d="M30 -118 C-50 -110 -96 -40 -88 26 C-80 92 -20 130 44 122 C-6 104 -40 58 -40 0 C-40 -60 -6 -104 30 -118Z" fill={`url(#${id}-m)`} stroke={darken(SM.moon, 0.2)} strokeWidth="2" />
        <path d="M22 -106 C-40 -96 -78 -36 -72 22 C-66 80 -18 112 30 112" {...stitch} stroke={darken(SM.moon, 0.4)} strokeOpacity=".5" />
        {/* face, on the inner curve */}
        <g className="sm-eye">
          <path d="M-58 -8 C-52 0 -42 0 -36 -8" stroke={SM.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M-56 -4 l-3 4 M-50 -2 l-1 5 M-43 -2 l1 5" stroke={SM.ink} strokeWidth="1.6" strokeLinecap="round" />
        </g>
        <ellipse cx="-58" cy="14" rx="9" ry="5.5" fill={SM.pink} opacity=".8" />
        <path d="M-48 30 C-44 36 -36 36 -32 30" stroke={SM.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* nightcap */}
        <path d="M-4 -112 C10 -150 60 -170 104 -150 C120 -142 128 -120 120 -96 C110 -110 90 -120 70 -114 C50 -108 30 -104 -4 -112Z" fill="#AFC3E6" stroke={darken("#AFC3E6", 0.2)} strokeWidth="2" />
        <path d="M30 -140 C50 -150 76 -150 96 -138 M18 -126 C40 -136 70 -138 100 -126" stroke="#fff" strokeOpacity=".7" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M-8 -116 C20 -100 48 -100 74 -110" stroke={SM.cream} strokeWidth="12" fill="none" strokeLinecap="round" />
        <g className="sm-pom"><circle cx="122" cy="-92" r="13" fill={SM.cream} stroke={darken(SM.cream, 0.12)} strokeWidth="2" /></g>
      </g>
    </g>
  );
}

/** Wooden mobile arm across w at y. */
export function MobileBar({ w, y = 30 }: { w: number; y?: number }) {
  return (
    <g>
      <path d={`M${w / 2} -10 L${w / 2} ${y - 6}`} stroke={SM.ink} strokeOpacity=".3" strokeWidth="1.4" />
      <path d={`M${w * 0.1} ${y + 14} Q ${w / 2} ${y - 18} ${w * 0.9} ${y + 14}`} fill="none" stroke="#C9A77A" strokeWidth="7" strokeLinecap="round" />
      <path d={`M${w * 0.1} ${y + 14} Q ${w / 2} ${y - 18} ${w * 0.9} ${y + 14}`} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" transform="translate(0 -2)" />
      <circle cx={w / 2} cy={y - 2} r="7" fill="#C9A77A" />
      <circle cx={w * 0.1} cy={y + 14} r="6" fill="#E9C9A8" /><circle cx={w * 0.9} cy={y + 14} r="6" fill="#E9C9A8" />
    </g>
  );
}

export function Zzz({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={SM.blue} style={{ fontFamily: "var(--pf-infant), serif", fontStyle: "italic", fontWeight: 600 }}>
      <text className="sm-z" x="0" y="0" fontSize="22">z</text>
      <text className="sm-z" x="14" y="-18" fontSize="28">z</text>
      <text className="sm-z" x="32" y="-42" fontSize="36">Z</text>
    </g>
  );
}

/** Cosy little house with a lit window (venue). */
export function House({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-70 0 L-70 -80 L0 -140 L70 -80 L70 0Z" fill={SM.cream} stroke={SM.ink} strokeOpacity=".25" strokeWidth="2" />
      <path d="M-84 -74 L0 -150 L84 -74" fill="none" stroke="#E2A6B0" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="-18" y="-50" width="36" height="50" rx="18" fill="#C9A77A" />
      <circle cx="10" cy="-24" r="2.5" fill={SM.cream} />
      <rect x="-56" y="-72" width="28" height="28" rx="6" fill="#FBE3A0" className="sm-win" />
      <rect x="28" y="-72" width="28" height="28" rx="6" fill="#FBE3A0" className="sm-win" />
      <path d="M-42 -72 v28 M-56 -58 h28 M42 -72 v28 M28 -58 h28" stroke={SM.cream} strokeWidth="2.5" />
      <rect x="30" y="-150" width="16" height="36" fill={SM.cream} stroke={SM.ink} strokeOpacity=".25" strokeWidth="2" />
    </g>
  );
}
