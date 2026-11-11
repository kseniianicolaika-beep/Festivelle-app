import { useId, type CSSProperties } from "react";

// Next Chapter — retirements, farewells and new beginnings. An open clothbound book whose right page turns
// (data-page), a ribbon bookmark, pressed flowers and handwritten margin notes.

const INK = "#5e1a26", SAGE = "#7d8b6a", BLUSH = "#e9c1bd";

/** Pressed wildflower stem. viewBox 60×160. */
export function Pressed({ className = "", style, hue = BLUSH }: { className?: string; style?: CSSProperties; hue?: string }) {
  return (
    <svg viewBox="0 0 60 160" className={className} style={style} aria-hidden>
      <path d="M30 158C28 120 34 80 30 30" stroke={SAGE} strokeWidth="1.6" fill="none" />
      {[[30, 120, -40], [31, 96, 40], [30, 72, -36], [31, 54, 34]].map(([x, y, r], i) => <path key={i} d="M0 0c6-4 14-4 18 0-6 4-12 4-18 0z" transform={`translate(${x} ${y}) rotate(${r})`} fill={SAGE} opacity=".85" />)}
      {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx="30" cy="20" rx="5" ry="11" transform={`rotate(${i * 60} 30 30)`} fill={hue} opacity=".9" />)}
      <circle cx="30" cy="30" r="4" fill="#d9a441" />
    </svg>
  );
}

/** Open book, 3/4 top view. viewBox 360×240. Unless `still`, a blank page keeps turning over to reveal the title. */
export function OpenBook({ className = "", style, still = false, title = ["Chapter", "the next"], note = "Chapter the last…" }: { className?: string; style?: CSSProperties; still?: boolean; title?: [string, string]; note?: string }) {
  const id = useId().replace(/:/g, "");
  const lines = (x0: number, n: number) => Array.from({ length: n }, (_, i) => <path key={i} d={`M${x0} ${70 + i * 14}h${120 - (i % 3) * 18}`} stroke="#b9a68a" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />);
  return (
    <svg viewBox="0 0 360 240" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`pl${id}`} x1="1" x2="0"><stop offset="0" stopColor="#e7dcc6" /><stop offset=".12" stopColor="#fbf6ec" /><stop offset="1" stopColor="#f3ead8" /></linearGradient>
        <linearGradient id={`pr${id}`} x1="0" x2="1"><stop offset="0" stopColor="#e7dcc6" /><stop offset=".12" stopColor="#fbf6ec" /><stop offset="1" stopColor="#f3ead8" /></linearGradient>
        <linearGradient id={`cv${id}`} x1="0" x2="1"><stop offset="0" stopColor="#4a1420" /><stop offset=".5" stopColor="#7a2434" /><stop offset="1" stopColor="#4a1420" /></linearGradient>
      </defs>
      <ellipse cx="180" cy="226" rx="170" ry="12" fill="#000" opacity=".12" />
      {/* cover */}
      <path d="M8 46l172 14 172-14v168l-172 14-172-14z" fill={`url(#cv${id})`} />
      {/* page stacks */}
      <path d="M18 42c60-10 120-4 162 14v164c-42-18-102-24-162-14z" fill="#efe5d2" />
      <path d="M342 42c-60-10-120-4-162 14v164c42-18 102-24 162-14z" fill="#efe5d2" />
      {/* left page */}
      <path d="M22 36c60-10 118-4 158 14v164c-40-18-98-24-158-14z" fill={`url(#pl${id})`} />
      <g transform="translate(-8 0)">{lines(48, 8)}</g>
      <text x="62" y="58" fontSize="13" fontStyle="italic" fill={INK} fontFamily="var(--cf-caveat), cursive" opacity=".75">{note}</text>
      {/* right page (static) */}
      <path d="M338 36c-60-10-118-4-158 14v164c40-18 98-24 158-14z" fill={`url(#pr${id})`} />
      <text x="214" y="104" fontSize="26" fontStyle="italic" fill={INK} fontFamily="var(--cf-fraun), var(--cf-corm), Georgia, serif">{title[0]}</text>
      <text x="236" y="136" fontSize="26" fontStyle="italic" fill={INK} fontFamily="var(--cf-fraun), var(--cf-corm), Georgia, serif">{title[1]}</text>
      <path d="M232 152h70" stroke="#c9a25a" strokeWidth="1.2" />
      {/* turning page */}
      {!still && <path data-page className="nc-turn" d="M338 36c-60-10-118-4-158 14v164c40-18 98-24 158-14z" fill={`url(#pr${id})`} style={{ transformOrigin: "180px 130px", transformBox: "view-box" }} />}
      {/* pressed flower on the left page + ribbon */}
      <g transform="translate(56 196) rotate(-78) scale(.6)"><Pressed /></g>
      <path d="M180 214c2 18-4 30-10 40l10-6 8 8c-4-14-6-26-8-42z" fill="#a3202e" />
    </svg>
  );
}

/** A curling ribbon flourish. viewBox 200×40. */
export function Flourish({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 40" className={className} style={style} aria-hidden>
      <path d="M4 22c30-18 52 14 80 0 10-6 10-16 2-16s-8 14 6 16c30 4 54-22 104-4" stroke="#c9a25a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="22" r="3" fill={INK} />
    </svg>
  );
}

export const NC_CSS = `
.nc-paper{background-color:#f5ecdc;background-image:radial-gradient(70% 50% at 50% 28%,rgba(255,250,240,.9),transparent 70%),repeating-linear-gradient(0deg,rgba(94,26,38,.025) 0 1px,transparent 1px 30px)}
.nc-turn{animation:ncTurn 2.6s cubic-bezier(.6,0,.3,1) 1.4s both}
@keyframes ncTurn{0%{transform:scaleX(1) skewY(0)}55%{transform:scaleX(-.05) skewY(-4deg);opacity:1}100%{transform:scaleX(-1) skewY(0);opacity:0}}
.nc-root .ss-h2,.nc-root .ss-venue,.nc-root .ss-v,.nc-root .ss-ev,.nc-root .ss-lead,.nc-root .ss-num{font-family:var(--f-display,var(--cf-fraun)),var(--cf-corm),Georgia,serif;font-style:italic;color:#5e1a26}
.nc-root .ss-script{font-family:var(--f-script,var(--cf-caveat)),cursive;color:#7d8b6a}
.nc-root .ss-k,.nc-root .ss-time{color:#9a7a3e}
.nc-root .ss-s,.nc-root .ss-body{color:#4a3630}
.nc-root .ss-cell{background:#fbf6ec;border:1px solid rgba(94,26,38,.18);border-radius:3px;box-shadow:6px 6px 0 rgba(125,139,106,.25)}
.nc-root .ss-dots{border-color:rgba(94,26,38,.3)}
.nc-root .ss-btn{background:#5e1a26;color:#f5ecdc}
.nc-root .ss-btn-ghost{background:transparent;color:#5e1a26;border:1px solid rgba(94,26,38,.4)}
.nc-root .ss-photo{border:10px solid #fbf6ec;border-bottom-width:40px;box-shadow:0 24px 50px -24px rgba(60,20,20,.45);transform:rotate(-2deg)}
.nc-root .ss-panel{background:#fbf6ec;border:1px solid rgba(94,26,38,.2);box-shadow:8px 8px 0 rgba(125,139,106,.22)}
.nc-card .sc-eyebrow,.nc-card .sc-where{font-family:var(--cf-tenor),sans-serif;color:#9a7a3e}
.nc-card .sc-name,.nc-card .sc-head,.nc-card .sc-num,.nc-card .sc-tag,.nc-card .sc-date,.nc-card .sc-item-t{font-family:var(--f-display,var(--cf-fraun)),var(--cf-corm),Georgia,serif;font-style:italic;color:#5e1a26}
.nc-card .sc-amp,.nc-card .sc-line,.nc-card .sc-foot,.nc-card .sc-host,.nc-card .sc-tagline{font-family:var(--f-script,var(--cf-caveat)),cursive;color:#7d8b6a}
.nc-card .sc-lead,.nc-card .sc-body,.nc-card .sc-item-d{font-family:var(--cf-corm),Georgia,serif;font-style:italic;color:#4a3630}
.nc-card .sc-item+.sc-item{border-top:1px solid rgba(94,26,38,.18)}
.nc-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.nc-turn{display:none}}
`;
