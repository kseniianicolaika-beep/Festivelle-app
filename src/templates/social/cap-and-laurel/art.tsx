import { useId, type CSSProperties } from "react";

// Cap & Laurel — graduation. A burgundy mortarboard with a swinging gold tassel (data-tassel), a gilt laurel
// wreath drawn branch by branch (data-laurel), a ribboned diploma and small caps that fly up (data-fly).

const BURG = "#6e1630", BURG_D = "#3f0a1b";

export function Mortarboard({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 240 180" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`t${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8c2141" /><stop offset=".6" stopColor={BURG} /><stop offset="1" stopColor={BURG_D} /></linearGradient>
        <linearGradient id={`g${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8a6a2c" /><stop offset=".5" stopColor="#f6dc9a" /><stop offset="1" stopColor="#a7802f" /></linearGradient>
      </defs>
      {/* skull cap */}
      <path d="M66 84v40c0 16 108 16 108 0V84z" fill={BURG_D} />
      <path d="M66 118c0 16 108 16 108 0" stroke="#8c2141" strokeWidth="2" fill="none" />
      {/* board */}
      <path d="M120 30L230 70 120 110 10 70z" fill={`url(#t${id})`} />
      <path d="M120 30L230 70 120 110 10 70z" fill="none" stroke="#a83a5a" strokeWidth="1.2" />
      <path d="M10 70l110 40 110-40v5l-110 40L10 75z" fill={BURG_D} />
      {/* button + tassel */}
      <circle cx="120" cy="70" r="6" fill={`url(#g${id})`} />
      <g data-tassel className="cl2-tassel" style={{ transformOrigin: "120px 70px", transformBox: "view-box" }}>
        <path d="M120 70C150 76 176 82 188 96v34" stroke={`url(#g${id})`} strokeWidth="3" fill="none" />
        <rect x="183" y="128" width="10" height="8" rx="2" fill={`url(#g${id})`} />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${184 + i * 1.4} 136l${(i - 3) * 0.8} 26`} stroke={`url(#g${id})`} strokeWidth="1.6" />)}
      </g>
    </svg>
  );
}

/** Two laurel branches meeting at the bottom, tied with a ribbon. viewBox 300×260. */
export function Laurel({ className = "", style, gold = true }: { className?: string; style?: CSSProperties; gold?: boolean }) {
  const id = useId().replace(/:/g, "");
  const fill = gold ? `url(#lg${id})` : "#6b7a4b";
  const branch = (s: 1 | -1) => {
    const pts = Array.from({ length: 11 }, (_, i) => {
      const a = Math.PI * (0.62 + i * 0.075);
      return { x: 150 + s * 116 * Math.cos(a) * -1, y: 140 + 110 * Math.sin(a) * -1, a: (a * 180) / Math.PI };
    });
    return (
      <g data-laurel>
        <path d={`${pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("")}L150 238`} fill="none" stroke={fill} strokeWidth="2.4" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            <path d="M0 0C10-6 20-6 28 0 20 6 10 6 0 0z" transform={`rotate(${s === 1 ? 200 - p.a + 90 : p.a - 20 - 90})`} fill={fill} />
            <path d="M0 0C10-6 20-6 28 0 20 6 10 6 0 0z" transform={`rotate(${s === 1 ? 160 - p.a + 90 : p.a + 20 - 90})`} fill={fill} opacity=".85" />
          </g>
        ))}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 300 260" className={className} style={style} aria-hidden overflow="visible">
      <defs><linearGradient id={`lg${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8a6a2c" /><stop offset=".45" stopColor="#f6dc9a" /><stop offset=".7" stopColor="#c9a24e" /><stop offset="1" stopColor="#7a5a20" /></linearGradient></defs>
      {branch(1)}
      {branch(-1)}
      <path d="M150 238c-10-14-30-16-30-4s20 10 30 4zM150 238c10-14 30-16 30-4s-20 10-30 4z" fill={BURG} />
      <path d="M146 242l-10 18 6-2 3 6zM154 242l10 18-6-2-3 6z" fill={BURG} />
      <circle cx="150" cy="238" r="5.5" fill="#8c2141" stroke="#c9a24e" strokeWidth="1" />
    </svg>
  );
}

/** Rolled diploma tied with a burgundy ribbon. viewBox 220×80. */
export function Diploma({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 220 80" className={className} style={style} aria-hidden>
      <defs><linearGradient id={`p${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0" /><stop offset=".5" stopColor="#f3e6cc" /><stop offset="1" stopColor="#d9c39a" /></linearGradient></defs>
      <rect x="20" y="22" width="180" height="34" rx="17" fill={`url(#p${id})`} transform="rotate(-8 110 39)" />
      <ellipse cx="196" cy="27" rx="7" ry="17" fill="#e8d6b2" transform="rotate(-8 110 39)" />
      <path d="M104 22v38M114 21v38" stroke={BURG} strokeWidth="5" transform="rotate(-8 110 39)" />
      <path d="M108 52c-10 10-18 20-22 26M110 52c8 10 16 18 22 22" stroke={BURG} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export const CP_CSS = `
.cp-paper{background-color:#faf5ec;background-image:radial-gradient(60% 45% at 50% 30%,rgba(246,220,154,.35),transparent 70%),radial-gradient(circle,rgba(110,22,48,.05) 1px,transparent 1.5px);background-size:auto,22px 22px}
.cp-foil{background:linear-gradient(100deg,#7a5a20 0%,#f6dc9a 24%,#c9a24e 44%,#fff1c9 56%,#a7802f 70%,#f1d692 86%,#7a5a20 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.cl2-tassel{animation:cpSwing 3.2s ease-in-out infinite}
@keyframes cpSwing{0%,100%{transform:rotate(0)}50%{transform:rotate(-7deg)}}
.cp-root .ss-h2,.cp-root .ss-venue{font-family:var(--cf-cinzel),var(--cf-prata),serif;color:#6e1630;letter-spacing:.04em}
.cp-root .ss-v,.cp-root .ss-ev,.cp-root .ss-lead,.cp-root .ss-num{font-family:var(--f-display,var(--cf-corm)),Georgia,serif;font-style:italic;color:#6e1630}
.cp-root .ss-script{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#a7802f}
.cp-root .ss-k,.cp-root .ss-time{color:#a7802f}
.cp-root .ss-s,.cp-root .ss-body{color:#4a3a36}
.cp-root .ss-cell{background:#fffdf8;border:1px solid rgba(167,128,47,.45);border-radius:2px;box-shadow:0 0 0 6px #fffdf8,0 0 0 7px rgba(110,22,48,.2)}
.cp-root .ss-dots{border-color:rgba(167,128,47,.5)}
.cp-root .ss-btn{background:#6e1630;color:#faf5ec}
.cp-root .ss-btn-ghost{background:transparent;color:#6e1630;border:1px solid rgba(110,22,48,.45)}
.cp-root .ss-photo{border:2px solid #c9a24e;box-shadow:0 0 0 8px #fffdf8,0 0 0 9px rgba(110,22,48,.3),0 30px 60px -30px rgba(60,10,20,.45)}
.cp-root .ss-panel{background:#fffdf8;border:1px solid rgba(167,128,47,.45)}
.cp-card .sc-eyebrow,.cp-card .sc-where{font-family:var(--cf-tenor),sans-serif;color:#a7802f}
.cp-card .sc-name,.cp-card .sc-head,.cp-card .sc-num,.cp-card .sc-tag{font-family:var(--cf-cinzel),var(--cf-prata),serif;color:#6e1630;letter-spacing:.02em}
.cp-card .sc-date,.cp-card .sc-item-t{font-family:var(--f-display,var(--cf-corm)),Georgia,serif;font-style:italic;color:#6e1630}
.cp-card .sc-amp,.cp-card .sc-line,.cp-card .sc-foot,.cp-card .sc-host,.cp-card .sc-tagline{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#a7802f}
.cp-card .sc-lead,.cp-card .sc-body,.cp-card .sc-item-d{font-family:var(--cf-corm),Georgia,serif;font-style:italic;color:#4a3a36}
.cp-card .sc-item+.sc-item{border-top:1px solid rgba(167,128,47,.35)}
.cp-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.cl2-tassel{animation:none!important}}
`;
