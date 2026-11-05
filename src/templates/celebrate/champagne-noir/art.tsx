import { useId } from "react";

// Champagne Noir — hand-built line art: a coupe tower with a pouring stream, a foil-necked bottle, candlelight.

const GW = 60; // glass slot width
const DY = 42; // row step (base sits on the rim below)
const ROWS = 4;
export const TOWER_W = GW * ROWS + 8;
export const TOWER_H = DY * (ROWS - 1) + 56 + 90;

/** One coupe at (x, y) = top-left of a 56×52 glass. */
function Coupe({ x, y, i, gid, filled }: { x: number; y: number; i: number; gid: string; filled: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} data-glass={i}>
      <path data-liquid d="M4.5 8.5C7 18 18 21.2 28 21.2S49 18 51.5 8.5C43 10.6 13 10.6 4.5 8.5Z" fill={`url(#liq${gid})`} style={{ transformOrigin: "28px 21px", transformBox: "view-box", opacity: filled ? 1 : 0 }} />
      {filled && <g data-fizz fill="#fff6dc" opacity=".8"><circle cx="20" cy="15" r=".7" /><circle cx="31" cy="17" r=".55" /><circle cx="38" cy="13" r=".6" /></g>}
      <g fill="none" stroke={`url(#rim${gid})`} strokeWidth="1.1" strokeLinecap="round" data-draw>
        <path d="M2 6.5C2.8 19.5 17 24.2 28 24.2S53.2 19.5 54 6.5" />
        <ellipse cx="28" cy="6.5" rx="26" ry="3.6" />
        <path d="M26.6 24.2C27.4 31 27.4 39 26.2 46.4M29.4 24.2C28.6 31 28.6 39 29.8 46.4" />
        <path d="M17 48.4C20 46.3 36 46.3 39 48.4C36 50.3 20 50.3 17 48.4Z" />
      </g>
      <path d="M8 9.5C11 15 16 18 22 19.6" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth=".8" strokeLinecap="round" />
    </g>
  );
}

/** The tower of coupes (10 glasses) with a thin pouring stream. */
export function CoupeTower({ className = "", filled = true, stream = true, style }: { className?: string; filled?: boolean; stream?: boolean; style?: React.CSSProperties }) {
  const gid = useId().replace(/:/g, "");
  const glasses: { x: number; y: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    const n = r + 1;
    const x0 = (TOWER_W - n * GW) / 2;
    for (let k = 0; k < n; k++) glasses.push({ x: x0 + k * GW + 2, y: 90 + r * DY });
  }
  return (
    <svg viewBox={`0 0 ${TOWER_W} ${TOWER_H}`} className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`rim${gid}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff1c9" />
          <stop offset=".45" stopColor="var(--t-gold, #d8b46a)" />
          <stop offset="1" stopColor="#8a6631" />
        </linearGradient>
        <linearGradient id={`liq${gid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff0bf" />
          <stop offset=".5" stopColor="#e9c46f" />
          <stop offset="1" stopColor="#b78a3a" />
        </linearGradient>
        <linearGradient id={`st${gid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f5dc9a" stopOpacity="0" />
          <stop offset=".35" stopColor="#f5dc9a" />
          <stop offset="1" stopColor="#e9c46f" />
        </linearGradient>
        <radialGradient id={`glow${gid}`} cx=".5" cy=".55" r=".5">
          <stop offset="0" stopColor="#ffd88a" stopOpacity=".28" />
          <stop offset="1" stopColor="#ffd88a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={TOWER_W / 2} cy={TOWER_H * 0.62} rx={TOWER_W * 0.62} ry={TOWER_H * 0.5} fill={`url(#glow${gid})`} />
      {stream && <path data-stream d={`M${TOWER_W / 2 + 1} 0C${TOWER_W / 2 + 1.5} 40 ${TOWER_W / 2 - 0.5} 70 ${TOWER_W / 2} 98`} stroke={`url(#st${gid})`} strokeWidth="1.6" fill="none" strokeLinecap="round" style={{ opacity: filled ? 1 : 0 }} />}
      {/* overflow cascades between rows */}
      {filled && (
        <g data-cascade fill="none" stroke="#e9c46f" strokeOpacity=".55" strokeWidth=".7">
          {glasses.slice(0, 6).map((g, i) => (
            <g key={i}>
              <path d={`M${g.x + 3} ${g.y + 8}C${g.x - 1} ${g.y + 22} ${g.x - 2} ${g.y + 34} ${g.x - 2} ${g.y + DY + 6}`} />
              <path d={`M${g.x + 53} ${g.y + 8}C${g.x + 57} ${g.y + 22} ${g.x + 58} ${g.y + 34} ${g.x + 58} ${g.y + DY + 6}`} />
            </g>
          ))}
        </g>
      )}
      {glasses.map((g, i) => <Coupe key={i} {...g} i={i} gid={gid} filled={filled} />)}
    </svg>
  );
}

/** Champagne bottle: black glass, gold foil neck, monogram label. Cork is a separate group for the pop. */
export function Bottle({ className = "", initial = "N", corked = true }: { className?: string; initial?: string; corked?: boolean }) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 180" className={className} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`gl${gid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#060807" />
          <stop offset=".3" stopColor="#1d2a24" />
          <stop offset=".42" stopColor="#3c4d44" />
          <stop offset=".55" stopColor="#141c18" />
          <stop offset="1" stopColor="#050605" />
        </linearGradient>
        <linearGradient id={`fo${gid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#7a5524" />
          <stop offset=".35" stopColor="#f7dfa0" />
          <stop offset=".55" stopColor="#c99a4a" />
          <stop offset="1" stopColor="#6d4b1f" />
        </linearGradient>
      </defs>
      <g data-cork style={{ opacity: corked ? 1 : 0 }}>
        <path d="M24 4h12l-1 14H25z" fill="#c9a26a" />
        <path d="M23 2.5h14v4H23z" fill="#a98450" rx="2" />
        <path d="M27 6l1 10M31 6l-.5 10" stroke="#8c6a3d" strokeWidth=".6" />
      </g>
      <path d="M23 18h14v22c0 12 17 22 17 42v86c0 5-3 8-8 8H14c-5 0-8-3-8-8V82c0-20 17-30 17-42z" fill={`url(#gl${gid})`} />
      <path d="M22 16h16v30c2 6 6 10 9 14H13c3-4 7-8 9-14z" fill={`url(#fo${gid})`} />
      <path d="M13 60h34" stroke="#f7dfa0" strokeWidth=".8" />
      <rect x="10" y="96" width="40" height="46" rx="2" fill="#f3e7cf" />
      <rect x="12.5" y="98.5" width="35" height="41" rx="1" fill="none" stroke="#b8904a" strokeWidth=".7" />
      <text x="30" y="125" textAnchor="middle" fontSize="20" fontStyle="italic" fill="#3a2a14" style={{ fontFamily: "var(--cf-bodoni), var(--cf-prata), serif" }}>{initial}</text>
      <path d="M17 131h26" stroke="#b8904a" strokeWidth=".5" />
      <path d="M44 70c3 12 3 60 2 90" stroke="#fff" strokeOpacity=".22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** A three-arm candelabra with flickering flames (flames animate via .cn-flame). */
export function Candelabra({ className = "" }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  const flame = (x: number, y: number, d = 0) => (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx="10" ry="14" cy="-8" fill={`url(#halo${gid})`} />
      <path className="cn-flame" style={{ animationDelay: `${d}s`, transformOrigin: "0 0" }} d="M0 0C-3.5-4-3-9 0-15C3-9 3.5-4 0 0Z" fill={`url(#fl${gid})`} />
    </g>
  );
  return (
    <svg viewBox="0 0 160 170" className={className} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={`halo${gid}`}><stop offset="0" stopColor="#ffcf7a" stopOpacity=".55" /><stop offset="1" stopColor="#ffcf7a" stopOpacity="0" /></radialGradient>
        <linearGradient id={`fl${gid}`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff7e0" /><stop offset=".5" stopColor="#ffc861" /><stop offset="1" stopColor="#e2742c" /></linearGradient>
      </defs>
      <g fill="none" stroke="var(--t-gold, #d8b46a)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M80 160V70M50 166h60M62 160c0-6 8-10 18-10s18 4 18 10" />
        <path d="M80 112c-30 0-44-14-44-40M80 112c30 0 44-14 44-40" />
        <path d="M30 72h12M118 72h12M74 62h12" />
      </g>
      <g fill="#efe3c8">
        <rect x="33" y="40" width="6" height="32" rx="1" />
        <rect x="77" y="28" width="6" height="34" rx="1" />
        <rect x="121" y="40" width="6" height="32" rx="1" />
      </g>
      {flame(36, 39, 0)}
      {flame(80, 27, 0.4)}
      {flame(124, 39, 0.8)}
    </svg>
  );
}

/** Deco corner flourish for frames. */
export function Corner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <g fill="none" stroke="var(--t-gold, #d8b46a)" strokeWidth=".9">
        <path d="M2 58V2h56" />
        <path d="M8 58V8h50" strokeOpacity=".55" />
        <path d="M2 22c10 0 20-10 20-20" />
        <circle cx="14" cy="14" r="2.4" fill="var(--t-gold, #d8b46a)" stroke="none" />
      </g>
    </svg>
  );
}

export const CN_CSS = `
.cn-foil{background:linear-gradient(105deg,#8a6631 0%,#f6e2ab 18%,#c79a4c 34%,#fff4d2 50%,#b98b3e 66%,#f3d996 82%,#8a6631 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.cn-shine{animation:cnShine 6s ease-in-out infinite}
@keyframes cnShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.cn-flame{animation:cnFlick 2.2s ease-in-out infinite}
@keyframes cnFlick{0%,100%{transform:scale(1,1) skewX(0)}25%{transform:scale(.94,1.06) skewX(2deg)}50%{transform:scale(1.04,.95) skewX(-2deg)}75%{transform:scale(.97,1.04) skewX(1deg)}}
.cn-bokeh{animation:cnBokeh 9s ease-in-out infinite alternate}
@keyframes cnBokeh{from{transform:translate3d(0,0,0) scale(1);opacity:.55}to{transform:translate3d(0,-18px,0) scale(1.08);opacity:.9}}
.cn-bubble{position:absolute;bottom:-10px;border-radius:50%;border:1px solid rgba(255,236,190,.55);background:radial-gradient(circle at 35% 35%,rgba(255,250,235,.7),rgba(255,230,170,.08) 60%);animation:cnRise linear infinite}
@keyframes cnRise{from{transform:translate3d(0,0,0)}50%{transform:translate3d(8px,-50vh,0)}to{transform:translate3d(-6px,-105vh,0);opacity:0}}
.cn-lb-t{animation:cnLbT 1.4s cubic-bezier(.7,0,.3,1) 2.2s forwards}.cn-lb-b{animation:cnLbB 1.4s cubic-bezier(.7,0,.3,1) 2.2s forwards}.cn-lb-l{animation:cnLbL .5s ease 2.2s forwards}
@keyframes cnLbT{to{transform:translateY(-100%)}}@keyframes cnLbB{to{transform:translateY(100%)}}@keyframes cnLbL{to{opacity:0}}
@media (prefers-reduced-motion: reduce){.cn-lb-t,.cn-lb-b,.cn-lb-l{display:none}.cn-shine,.cn-flame,.cn-bokeh,.cn-bubble{animation:none!important}.cn-bubble{display:none}}
`;
