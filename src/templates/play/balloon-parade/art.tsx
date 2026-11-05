import { darken, lighten } from "../_shared/color";

// Balloon Parade — hand-built picture-book pieces. Coordinates: every balloon is tied at (0,0) and floats up.
export const BP = {
  cream: "#FFF7EA",
  paper: "#FFFCF5",
  ink: "#2F3A56",
  coral: "#F07A62",
  butter: "#F5C35C",
  mint: "#86CDB8",
  sky: "#9DB4F2",
  blush: "#F3AFBE",
  lilac: "#B9A3E3",
  grass: "#9CC98A",
  leaf: "#6FA77A",
};
export const BALLOON_COLORS = [BP.coral, BP.butter, BP.mint, BP.sky, BP.blush, BP.lilac];

export function BalloonGrad({ id, c }: { id: string; c: string }) {
  return (
    <radialGradient id={id} cx="34%" cy="28%" r="78%">
      <stop offset="0" stopColor={lighten(c, 0.55)} />
      <stop offset="0.38" stopColor={lighten(c, 0.12)} />
      <stop offset="0.8" stopColor={c} />
      <stop offset="1" stopColor={darken(c, 0.22)} />
    </radialGradient>
  );
}

const BODY = "M0 0 C-5 -2 -9 -5 -11 -9 C-33 -18 -46 -42 -46 -67 C-46 -97 -26 -119 0 -119 C26 -119 46 -97 46 -67 C46 -42 33 -18 11 -9 C9 -5 5 -2 0 0Z";

/** A latex balloon tied at (0,0); `len` = string length below the knot. */
export function Balloon({ id, c, len = 120, s = 1, x = 0, y = 0, tilt = 0, wiggle = 0, cls = "", label }: { id: string; c: string; len?: number; s?: number; x?: number; y?: number; tilt?: number; wiggle?: number; cls?: string; label?: string }) {
  const w = wiggle || 7;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
      <g className={`bp-balloon ${cls}`} data-color={c} role={label ? "button" : undefined} aria-label={label}>
        <path d={`M0 0 C${w} ${-len * 0.25} ${-w} ${-len * 0.5} ${w * 0.6} ${-len * 0.72} S ${-w * 0.4} ${-len + 8} 0 ${-len}`} fill="none" stroke={darken(c, 0.35)} strokeOpacity=".55" strokeWidth={1.4 / s} strokeLinecap="round" />
        <g className="bp-body" transform={`translate(0 ${-len})`}>
          <path d="M-6 6 L0 -1 L6 6 Q0 9 -6 6Z" fill={darken(c, 0.12)} />
          <path d={BODY} fill={`url(#${id})`} />
          <path d={BODY} fill="none" stroke={darken(c, 0.28)} strokeOpacity=".35" strokeWidth="1.2" />
          <ellipse cx="-19" cy="-86" rx="7.5" ry="15" transform="rotate(28 -19 -86)" fill="#fff" opacity=".55" />
          <circle cx="-8" cy="-103" r="2.6" fill="#fff" opacity=".6" />
          <path d="M22 -40 C30 -52 33 -64 31 -76" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** Bunting: triangle flags along a sagging cord across `w`. */
export function Bunting({ w = 1000, sag = 46, n = 14, y = 8, colors = BALLOON_COLORS, cls = "bp-flag" }: { w?: number; sag?: number; n?: number; y?: number; colors?: string[]; cls?: string }) {
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    return { x: +(t * w).toFixed(2), y: +(y + Math.sin(t * Math.PI) * sag).toFixed(2), a: +(Math.cos(t * Math.PI) * -12).toFixed(2) };
  });
  return (
    <g>
      <path d={`M0 ${y} Q ${w / 2} ${y + sag * 2} ${w} ${y}`} fill="none" stroke={BP.ink} strokeOpacity=".35" strokeWidth="1.5" />
      {pts.map((p, i) => {
        const c = colors[i % colors.length];
        return (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
            <g className={cls}>
              <path d="M-22 0 L22 0 L2 46 Q0 50 -2 46Z" fill={c} />
              <path d="M-22 0 L22 0 L2 46 Q0 50 -2 46Z" fill="none" stroke={darken(c, 0.25)} strokeOpacity=".3" />
              <path d="M-14 6 L10 6" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" />
            </g>
          </g>
        );
      })}
    </g>
  );
}

const line = "#5b4636";
/** Sitting bunny, feet at (0,0). Right paw raised to (30,-74). */
export function Bunny({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="bp-critter">
        <ellipse cx="0" cy="2" rx="38" ry="6" fill="#2f3a56" opacity=".08" />
        <path d="M-30 -30 C-32 -58 -14 -66 0 -66 C14 -66 32 -58 30 -30 C30 -8 18 0 0 0 C-18 0 -30 -8 -30 -30Z" fill="#F6EEE6" stroke={line} strokeOpacity=".35" strokeWidth="1.4" />
        <ellipse cx="0" cy="-24" rx="17" ry="19" fill="#FFFAF4" />
        <ellipse cx="-15" cy="-3" rx="13" ry="6.5" fill="#FFFAF4" stroke={line} strokeOpacity=".3" />
        <ellipse cx="15" cy="-3" rx="13" ry="6.5" fill="#FFFAF4" stroke={line} strokeOpacity=".3" />
        <g className="bp-ear-l" style={{ transformOrigin: "-8px -92px" }}>
          <path d="M-14 -90 C-26 -120 -22 -150 -11 -152 C0 -150 -1 -120 -3 -94Z" fill="#F6EEE6" stroke={line} strokeOpacity=".35" strokeWidth="1.4" />
          <path d="M-12 -96 C-19 -118 -17 -140 -11 -142 C-5 -138 -6 -118 -6 -98Z" fill="#F4B9C2" opacity=".8" />
        </g>
        <g className="bp-ear-r" style={{ transformOrigin: "8px -92px" }}>
          <path d="M4 -94 C10 -124 26 -140 36 -134 C42 -126 26 -108 12 -90Z" fill="#F6EEE6" stroke={line} strokeOpacity=".35" strokeWidth="1.4" />
          <path d="M8 -96 C14 -118 26 -130 32 -128 C34 -122 22 -108 13 -96Z" fill="#F4B9C2" opacity=".8" />
        </g>
        <circle cx="0" cy="-76" r="25" fill="#F6EEE6" stroke={line} strokeOpacity=".35" strokeWidth="1.4" />
        <ellipse cx="-14" cy="-68" rx="5.5" ry="3.4" fill="#F29BA8" opacity=".55" />
        <ellipse cx="14" cy="-68" rx="5.5" ry="3.4" fill="#F29BA8" opacity=".55" />
        <g className="bp-eyes">
          <ellipse cx="-8.5" cy="-78" rx="2.6" ry="3.2" fill="#3a2e2a" />
          <ellipse cx="8.5" cy="-78" rx="2.6" ry="3.2" fill="#3a2e2a" />
          <circle cx="-7.6" cy="-79.2" r=".9" fill="#fff" />
          <circle cx="9.4" cy="-79.2" r=".9" fill="#fff" />
        </g>
        <path d="M-2.6 -71 L2.6 -71 L0 -68Z" fill="#E98C98" />
        <path d="M0 -68 C-1 -64 -4 -63 -5 -64 M0 -68 C1 -64 4 -63 5 -64" fill="none" stroke={line} strokeOpacity=".6" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M20 -44 C26 -52 28 -62 30 -70" fill="none" stroke="#F6EEE6" strokeWidth="11" strokeLinecap="round" />
        <path d="M20 -44 C26 -52 28 -62 30 -70" fill="none" stroke={line} strokeOpacity=".22" strokeWidth="12.5" strokeLinecap="round" style={{ mixBlendMode: "multiply" }} />
        <circle cx="30" cy="-72" r="7" fill="#FFFAF4" stroke={line} strokeOpacity=".35" />
      </g>
    </g>
  );
}

/** Little bear, feet at (0,0). Left paw raised to (-30,-76). */
export function Bear({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  const fur = "#C99B6D";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="bp-critter">
        <ellipse cx="0" cy="2" rx="40" ry="6" fill="#2f3a56" opacity=".08" />
        <path d="M-32 -30 C-34 -60 -16 -68 0 -68 C16 -68 34 -60 32 -30 C32 -8 18 0 0 0 C-18 0 -32 -8 -32 -30Z" fill={fur} stroke={line} strokeOpacity=".35" strokeWidth="1.4" />
        <ellipse cx="0" cy="-26" rx="18" ry="20" fill="#E9C9A2" />
        <ellipse cx="-16" cy="-4" rx="12" ry="7" fill={fur} stroke={line} strokeOpacity=".3" />
        <ellipse cx="16" cy="-4" rx="12" ry="7" fill={fur} stroke={line} strokeOpacity=".3" />
        <circle cx="-18" cy="-100" r="10" fill={fur} stroke={line} strokeOpacity=".35" strokeWidth="1.4" />
        <circle cx="18" cy="-100" r="10" fill={fur} stroke={line} strokeOpacity=".35" strokeWidth="1.4" />
        <circle cx="-18" cy="-100" r="5" fill="#E9B79A" />
        <circle cx="18" cy="-100" r="5" fill="#E9B79A" />
        <circle cx="0" cy="-78" r="27" fill={fur} stroke={line} strokeOpacity=".35" strokeWidth="1.4" />
        <ellipse cx="0" cy="-68" rx="12" ry="9" fill="#EFD4B0" />
        <ellipse cx="-15" cy="-70" rx="5.5" ry="3.4" fill="#E98C80" opacity=".45" />
        <ellipse cx="15" cy="-70" rx="5.5" ry="3.4" fill="#E98C80" opacity=".45" />
        <g className="bp-eyes">
          <circle cx="-9" cy="-82" r="2.8" fill="#3a2e2a" />
          <circle cx="9" cy="-82" r="2.8" fill="#3a2e2a" />
          <circle cx="-8.1" cy="-83" r=".9" fill="#fff" />
          <circle cx="9.9" cy="-83" r=".9" fill="#fff" />
        </g>
        <ellipse cx="0" cy="-71" rx="4" ry="3" fill="#4a3428" />
        <path d="M0 -68 C-1 -64 -4 -63 -6 -64.5 M0 -68 C1 -64 4 -63 6 -64.5" fill="none" stroke="#4a3428" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M-22 -46 C-27 -54 -29 -64 -30 -72" fill="none" stroke={fur} strokeWidth="12" strokeLinecap="round" />
        <circle cx="-30" cy="-74" r="7.5" fill="#E9C9A2" stroke={line} strokeOpacity=".35" />
      </g>
    </g>
  );
}

/** Duckling, feet at (0,0). Wing raised to (28,-56). */
export function Duck({ x = 0, y = 0, s = 1, flip = false }: { x?: number; y?: number; s?: number; flip?: boolean }) {
  const y1 = "#F7D66E";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="bp-critter">
        <ellipse cx="0" cy="2" rx="30" ry="5" fill="#2f3a56" opacity=".08" />
        <path d="M-10 0 l-4 4 M-6 0 l0 5 M8 0 l4 4 M12 0 l0 5" stroke="#E9925A" strokeWidth="3" strokeLinecap="round" />
        <path d="M-28 -22 C-30 -44 -12 -50 2 -50 C20 -50 30 -40 28 -22 C26 -6 14 0 0 0 C-16 0 -27 -8 -28 -22Z" fill={y1} stroke={line} strokeOpacity=".3" strokeWidth="1.4" />
        <circle cx="0" cy="-64" r="20" fill={y1} stroke={line} strokeOpacity=".3" strokeWidth="1.4" />
        <path d="M-2 -84 C-6 -92 0 -96 3 -90 C5 -95 10 -92 6 -84" fill={y1} stroke={line} strokeOpacity=".3" />
        <path d="M-10 -59 C-4 -62 4 -62 10 -59 C6 -54 -6 -54 -10 -59Z" fill="#F0955E" />
        <circle cx="-7" cy="-68" r="2.5" fill="#3a2e2a" />
        <circle cx="7" cy="-68" r="2.5" fill="#3a2e2a" />
        <circle cx="-6.2" cy="-69" r=".8" fill="#fff" />
        <circle cx="7.8" cy="-69" r=".8" fill="#fff" />
        <ellipse cx="-13" cy="-60" rx="4.5" ry="2.8" fill="#F29B7A" opacity=".5" />
        <ellipse cx="13" cy="-60" rx="4.5" ry="2.8" fill="#F29B7A" opacity=".5" />
        <path d="M14 -32 C24 -38 28 -48 28 -58 C20 -54 12 -46 10 -36Z" fill="#F2C657" stroke={line} strokeOpacity=".3" />
      </g>
    </g>
  );
}

export function Cloud({ x = 0, y = 0, s = 1, o = 1 }: { x?: number; y?: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M-60 10 C-74 10 -78 -8 -64 -14 C-66 -32 -42 -40 -32 -28 C-26 -48 4 -50 10 -30 C22 -42 46 -34 42 -16 C60 -16 64 10 44 10Z" fill="#fff" />
      <path d="M-60 10 L44 10" stroke="#e9dccb" strokeWidth="2" strokeLinecap="round" opacity=".7" />
    </g>
  );
}

/** Rolling lawn with tufts and tiny flowers across `w`. */
export function Lawn({ w = 1200, h = 160, seed = 1 }: { w?: number; h?: number; seed?: number }) {
  const flowers = Array.from({ length: Math.round(w / 70) }, (_, i) => ({ x: ((i * 97 + seed * 31) % w), y: h * 0.55 + ((i * 37) % (h * 0.35)), c: BALLOON_COLORS[(i + seed) % 6] }));
  return (
    <g>
      <path d={`M0 ${h * 0.35} C ${w * 0.2} ${h * 0.05} ${w * 0.38} ${h * 0.42} ${w * 0.55} ${h * 0.25} S ${w * 0.85} ${h * 0.02} ${w} ${h * 0.3} L${w} ${h} L0 ${h}Z`} fill="#B5D9A0" />
      <path d={`M0 ${h * 0.55} C ${w * 0.25} ${h * 0.32} ${w * 0.45} ${h * 0.62} ${w * 0.7} ${h * 0.45} S ${w * 0.92} ${h * 0.4} ${w} ${h * 0.5} L${w} ${h} L0 ${h}Z`} fill={BP.grass} />
      {flowers.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y})`}>
          <path d="M0 0 l0 -10" stroke={BP.leaf} strokeWidth="1.6" />
          {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={+(Math.cos((a * Math.PI) / 180) * 3.2).toFixed(2)} cy={+(-12 + Math.sin((a * Math.PI) / 180) * 3.2).toFixed(2)} r="2.6" fill={f.c} />)}
          <circle cx="0" cy="-12" r="1.8" fill="#fff6d8" />
        </g>
      ))}
    </g>
  );
}

export function NumberDefs({ uid, c = BP.coral }: { uid: string; c?: string }) {
  return (
    <linearGradient id={`${uid}-num`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={lighten(c, 0.75)} />
      <stop offset=".3" stopColor={lighten(c, 0.25)} />
      <stop offset=".58" stopColor={c} />
      <stop offset=".78" stopColor={lighten(c, 0.4)} />
      <stop offset="1" stopColor={darken(c, 0.2)} />
    </linearGradient>
  );
}

/** A foil number balloon (the age), tied at (x,y). Needs <NumberDefs uid> in the same SVG. */
export function NumberGlyph({ uid, n, x = 0, y = 0, s = 1, c = BP.coral }: { uid: string; n: number | string; x?: number; y?: number; s?: number; c?: string }) {
  const font = { fontFamily: "var(--pf-fredoka), var(--pf-nunito), sans-serif" };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="bp-num">
        <path d="M0 0 C10 -20 -10 -40 0 -64" fill="none" stroke={darken(c, 0.35)} strokeOpacity=".5" strokeWidth={1.5 / s} />
        <text x="0" y="-58" textAnchor="middle" fontSize="280" fontWeight="700" style={font} fill={darken(c, 0.18)} stroke={darken(c, 0.18)} strokeWidth="26" strokeLinejoin="round">{n}</text>
        <text x="0" y="-64" textAnchor="middle" fontSize="280" fontWeight="700" style={font} fill={`url(#${uid}-num)`} stroke={`url(#${uid}-num)`} strokeWidth="22" strokeLinejoin="round">{n}</text>
        <text x="-6" y="-74" textAnchor="middle" fontSize="280" fontWeight="700" style={font} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeDasharray="34 300" strokeLinecap="round">{n}</text>
      </g>
    </g>
  );
}
