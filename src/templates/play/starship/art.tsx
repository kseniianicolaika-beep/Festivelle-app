import { darken, lighten } from "../_shared/color";
import { rng } from "../_shared/kit";

// Starship — a retro picture-book space mission.
export const SP = {
  night: "#141833", indigo: "#232A5C", dusk: "#3B3F86", cream: "#FFF4DC", red: "#E8604C", mustard: "#F2B84B", teal: "#6CC6C0", lilac: "#B9A6E8", pink: "#F3A7B6", ink: "#141833",
};
const line = "#141833";

/** Rocket standing at (0,0) = bottom of fins. ~ 250 tall. */
export function Rocket({ x = 0, y = 0, s = 1, id, flame = false }: { x?: number; y?: number; s?: number; id: string; flame?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1">
          <stop offset="0" stopColor="#E9DCC0" />
          <stop offset=".35" stopColor={SP.cream} />
          <stop offset=".55" stopColor="#fff" />
          <stop offset="1" stopColor="#D9C7A4" />
        </linearGradient>
        <linearGradient id={`${id}-red`} x1="0" x2="1">
          <stop offset="0" stopColor={darken(SP.red, 0.15)} />
          <stop offset=".5" stopColor={lighten(SP.red, 0.15)} />
          <stop offset="1" stopColor={darken(SP.red, 0.25)} />
        </linearGradient>
        <clipPath id={`${id}-clip`}><path d="M0 -250 C34 -216 48 -160 48 -100 L48 -40 C48 -28 40 -22 30 -22 L-30 -22 C-40 -22 -48 -28 -48 -40 L-48 -100 C-48 -160 -34 -216 0 -250Z" /></clipPath>
      </defs>
      <g className="sp-rocket">
        <g className="sp-flame" style={{ transformOrigin: "0px -20px", opacity: flame ? 1 : 0 }}>
          <path d="M-22 -22 C-26 20 -8 54 0 80 C8 54 26 20 22 -22Z" fill={SP.mustard} opacity=".9" />
          <path d="M-12 -22 C-14 10 -4 36 0 54 C4 36 14 10 12 -22Z" fill="#FFF1C2" />
        </g>
        <path d="M-48 -70 C-78 -50 -88 -20 -86 8 L-46 -20Z" fill={`url(#${id}-red)`} stroke={line} strokeOpacity=".35" strokeWidth="2" strokeLinejoin="round" />
        <path d="M48 -70 C78 -50 88 -20 86 8 L46 -20Z" fill={`url(#${id}-red)`} stroke={line} strokeOpacity=".35" strokeWidth="2" strokeLinejoin="round" />
        <path d="M-26 -22 L26 -22 L20 -4 L-20 -4Z" fill="#8C8FA8" stroke={line} strokeOpacity=".35" strokeWidth="2" />
        <path d="M0 -250 C34 -216 48 -160 48 -100 L48 -40 C48 -28 40 -22 30 -22 L-30 -22 C-40 -22 -48 -28 -48 -40 L-48 -100 C-48 -160 -34 -216 0 -250Z" fill={`url(#${id}-body)`} stroke={line} strokeOpacity=".35" strokeWidth="2" />
        <g clipPath={`url(#${id}-clip)`}>
          <rect x="-60" y="-260" width="120" height="62" fill={`url(#${id}-red)`} />
          <rect x="-60" y="-52" width="120" height="14" fill={`url(#${id}-red)`} />
          <path d="M-60 -198 H60" stroke={line} strokeOpacity=".3" strokeWidth="2" />
          {[-34, -12, 12, 34].map((cx) => <circle key={cx} cx={cx} cy="-86" r="1.6" fill={line} opacity=".3" />)}
        </g>
        <path d="M0 -42 L0 -6" stroke={line} strokeOpacity=".35" strokeWidth="9" strokeLinecap="round" />
        <path d="M0 -42 L0 -6" stroke={SP.red} strokeWidth="6" strokeLinecap="round" />
        <circle cx="0" cy="-146" r="26" fill="#C9A15A" stroke={line} strokeOpacity=".35" strokeWidth="2" />
        <circle cx="0" cy="-146" r="19" fill="#9ED7E6" />
        {/* the pilot: a puppy in a bubble helmet */}
        <g className="sp-pilot">
          <ellipse cx="-12" cy="-146" rx="5" ry="9" fill="#9A6B45" transform="rotate(20 -12 -146)" />
          <ellipse cx="12" cy="-146" rx="5" ry="9" fill="#9A6B45" transform="rotate(-20 12 -146)" />
          <circle cx="0" cy="-141" r="11" fill="#E7C49B" />
          <circle cx="-4" cy="-143" r="1.6" fill={line} /><circle cx="4" cy="-143" r="1.6" fill={line} />
          <ellipse cx="0" cy="-138" rx="2.2" ry="1.6" fill={line} />
          <path d="M-2.5 -135.5 C-1 -133.5 1 -133.5 2.5 -135.5" stroke={line} strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
        <path d="M-12 -158 C-6 -164 4 -164 10 -160" stroke="#fff" strokeOpacity=".8" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-30 -200 C-36 -170 -38 -130 -36 -60" stroke="#fff" strokeOpacity=".5" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Pad({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-110 0 L110 0 L96 18 L-96 18Z" fill="#4B4F80" stroke={line} strokeOpacity=".4" strokeWidth="2" />
      <path d="M-100 6 H100" stroke="#F2B84B" strokeWidth="3" strokeDasharray="10 8" />
      <g stroke="#7A7FB0" strokeWidth="5" strokeLinecap="round">
        <path d="M-96 0 L-96 -230 M-74 0 L-74 -230" />
        <path d="M-96 -20 L-74 -60 M-74 -60 L-96 -100 M-96 -100 L-74 -140 M-74 -140 L-96 -180 M-96 -180 L-74 -220" strokeWidth="3" />
        <path d="M-74 -150 L-46 -150 M-74 -90 L-46 -90" />
      </g>
      <circle cx="-85" cy="-236" r="6" fill={SP.red} className="sp-beacon" />
    </g>
  );
}

export function Puff({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sp-puff">
        <path d="M-40 10 C-56 10 -58 -8 -44 -12 C-46 -30 -22 -36 -14 -22 C-8 -40 20 -40 22 -20 C36 -28 52 -14 42 0 C54 6 46 14 36 10Z" fill="#F2EEF8" />
      </g>
    </g>
  );
}

export function Planet({ x = 0, y = 0, r = 80, c = SP.teal, ring = false, id, tilt = -18 }: { x?: number; y?: number; r?: number; c?: string; ring?: boolean; id: string; tilt?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={`${id}-p`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={lighten(c, 0.35)} />
          <stop offset=".6" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.35)} />
        </radialGradient>
        <clipPath id={`${id}-pc`}><circle r={r} /></clipPath>
      </defs>
      {ring && <ellipse rx={r * 1.75} ry={r * 0.42} transform={`rotate(${tilt})`} fill="none" stroke={SP.mustard} strokeWidth={r * 0.12} opacity=".85" />}
      <circle r={r} fill={`url(#${id}-p)`} />
      <g clipPath={`url(#${id}-pc)`} opacity=".35">
        <path d={`M${-r} ${-r * 0.3} C${-r * 0.3} ${-r * 0.5} ${r * 0.3} ${-r * 0.1} ${r} ${-r * 0.35}`} stroke="#fff" strokeWidth={r * 0.12} fill="none" />
        <path d={`M${-r} ${r * 0.25} C${-r * 0.2} ${r * 0.05} ${r * 0.4} ${r * 0.45} ${r} ${r * 0.2}`} stroke={darken(c, 0.3)} strokeWidth={r * 0.16} fill="none" />
      </g>
      {ring && <path d={`M${(-r * 1.72).toFixed(1)} ${(r * 0.1).toFixed(1)} A ${r * 1.75} ${r * 0.42} 0 0 0 ${(r * 1.72).toFixed(1)} ${(-r * 0.1).toFixed(1)}`} transform={`rotate(${tilt})`} fill="none" stroke={SP.mustard} strokeWidth={r * 0.12} opacity=".95" />}
    </g>
  );
}

export function Moon({ x = 0, y = 0, r = 50 }: { x?: number; y?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 1.5} fill={SP.cream} opacity=".07" />
      <circle r={r} fill="#F4E9CF" />
      <circle cx={-r * 0.3} cy={-r * 0.2} r={r * 0.2} fill="#E3D3AF" />
      <circle cx={r * 0.35} cy={r * 0.25} r={r * 0.14} fill="#E3D3AF" />
      <circle cx={-r * 0.05} cy={r * 0.45} r={r * 0.09} fill="#E3D3AF" />
    </g>
  );
}

/** A friendly little alien standing at (0,0) and waving. */
export function Alien({ x = 0, y = 0, s = 1, c = "#9BD67B" }: { x?: number; y?: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sp-alien">
        <path d="M0 -62 C-2 -76 -8 -84 -14 -88" stroke={darken(c, 0.2)} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="-15" cy="-89" r="5" fill={SP.pink} />
        <path d="M-24 0 C-28 -30 -24 -64 0 -64 C24 -64 28 -30 24 0Z" fill={c} stroke={line} strokeOpacity=".35" strokeWidth="1.6" />
        <ellipse cx="0" cy="-40" rx="13" ry="14" fill="#fff" />
        <circle cx="2" cy="-38" r="7.5" fill={line} className="sp-alien-eye" />
        <circle cx="4.5" cy="-41" r="2.4" fill="#fff" />
        <path d="M-7 -18 C-3 -13 3 -13 7 -18" stroke={line} strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="-15" cy="-22" rx="4" ry="2.5" fill={SP.pink} opacity=".6" />
        <ellipse cx="15" cy="-22" rx="4" ry="2.5" fill={SP.pink} opacity=".6" />
        <g className="sp-wave" style={{ transformOrigin: "22px -26px" }}>
          <path d="M22 -26 C32 -34 36 -46 36 -56" stroke={c} strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="36" cy="-58" r="5.5" fill={c} />
        </g>
        <path d="M-22 -26 C-30 -20 -32 -12 -32 -6" stroke={c} strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

/** Seeded starfield across w×h. */
export function Stars({ w, h, n = 90, seed = 3, tw = true }: { w: number; h: number; n?: number; seed?: number; tw?: boolean }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = Math.round(r() * w);
        const y = Math.round(r() * h);
        const big = r() > 0.88;
        const rr = big ? 2.6 : 0.8 + Math.round(r() * 10) / 10;
        return big ? (
          <path key={i} className={tw ? "sp-tw" : ""} d={`M${x} ${y - 7} Q${x} ${y} ${x + 7} ${y} Q${x} ${y} ${x} ${y + 7} Q${x} ${y} ${x - 7} ${y} Q${x} ${y} ${x} ${y - 7}Z`} fill={SP.cream} />
        ) : (
          <circle key={i} className={tw && i % 3 === 0 ? "sp-tw" : ""} cx={x} cy={y} r={rr} fill={i % 7 === 0 ? SP.mustard : "#fff"} opacity={0.5 + (i % 5) * 0.1} />
        );
      })}
    </g>
  );
}

export function Hills({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <path d={`M0 ${h * 0.4} C ${w * 0.2} ${h * 0.1} ${w * 0.35} ${h * 0.45} ${w * 0.55} ${h * 0.3} S ${w * 0.85} ${h * 0.05} ${w} ${h * 0.35} L${w} ${h} L0 ${h}Z`} fill="#2E3270" />
      <path d={`M0 ${h * 0.6} C ${w * 0.3} ${h * 0.4} ${w * 0.6} ${h * 0.7} ${w} ${h * 0.5} L${w} ${h} L0 ${h}Z`} fill="#3B3F86" />
      {[0.12, 0.3, 0.68, 0.86].map((t, i) => <ellipse key={i} cx={w * t} cy={h * (0.72 + (i % 2) * 0.1)} rx={18 + i * 4} ry={5 + i} fill="#2E3270" />)}
    </g>
  );
}
