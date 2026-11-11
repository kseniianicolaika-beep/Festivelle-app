import { useId, type CSSProperties } from "react";

// The Cloche — a black-tie supper club. A gilt dome on a porcelain plate (data-dome lifts to release steam,
// data-steam), crossed silver cutlery, and an art-deco fan frame for cards.

export function Cloche({ className = "", style, open = false }: { className?: string; style?: CSSProperties; open?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 320 260" className={className} style={style} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`d${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#6d4a1c" /><stop offset=".18" stopColor="#c9a25a" /><stop offset=".36" stopColor="#fbe7b4" />
          <stop offset=".5" stopColor="#d7b46e" /><stop offset=".78" stopColor="#8f6a2b" /><stop offset="1" stopColor="#5a3c14" />
        </linearGradient>
        <radialGradient id={`s${id}`} cx=".35" cy=".3" r=".5"><stop offset="0" stopColor="#fff8e2" stopOpacity=".9" /><stop offset="1" stopColor="#fff8e2" stopOpacity="0" /></radialGradient>
        <linearGradient id={`p${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf6ee" /><stop offset="1" stopColor="#d9ccb8" /></linearGradient>
      </defs>
      {/* plate */}
      <ellipse cx="160" cy="226" rx="150" ry="22" fill="#000" opacity=".35" />
      <ellipse cx="160" cy="218" rx="150" ry="24" fill={`url(#p${id})`} />
      <ellipse cx="160" cy="216" rx="122" ry="16" fill="none" stroke="#c9a25a" strokeWidth="1.4" />
      <ellipse cx="160" cy="216" rx="116" ry="14" fill="none" stroke="#c9a25a" strokeWidth=".6" />
      {/* steam (shown when the dome lifts) */}
      {[120, 160, 200].map((x, i) => (
        <path key={x} data-steam d={`M${x} 200c-10-16 10-26 0-42s10-26 0-42`} stroke="#fff6e6" strokeOpacity=".75" strokeWidth="3" fill="none" strokeLinecap="round" style={{ opacity: open ? 0.8 : 0, transitionDelay: `${i * 0.1}s` }} />
      ))}
      {/* dome */}
      <g data-dome style={{ transform: open ? "translate(0,-90px) rotate(-8deg)" : undefined, transformOrigin: "60px 210px", transformBox: "view-box" }}>
        <path d="M34 210C34 120 92 66 160 66s126 54 126 144z" fill={`url(#d${id})`} />
        <path d="M34 210C34 120 92 66 160 66s126 54 126 144z" fill={`url(#s${id})`} />
        <path d="M60 196C66 140 104 98 150 88" stroke="#fff3cf" strokeOpacity=".55" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="28" y="204" width="264" height="10" rx="5" fill="#8f6a2b" />
        <rect x="28" y="204" width="264" height="4" rx="2" fill="#f1d692" opacity=".8" />
        {/* deco fan engraving */}
        {[-40, -20, 0, 20, 40].map((a) => <path key={a} d="M160 196L160 120" transform={`rotate(${a} 160 196)`} stroke="#6d4a1c" strokeOpacity=".35" strokeWidth="1.2" />)}
        <path d="M118 150a42 42 0 0 1 84 0" stroke="#6d4a1c" strokeOpacity=".35" strokeWidth="1.2" fill="none" />
        {/* handle */}
        <path d="M146 68c0-14 28-14 28 0" stroke={`url(#d${id})`} strokeWidth="7" fill="none" />
        <circle cx="160" cy="50" r="9" fill={`url(#d${id})`} />
        <circle cx="157" cy="47" r="3" fill="#fff6dc" opacity=".8" />
      </g>
    </svg>
  );
}

/** Crossed fork & knife. viewBox 120×160. */
export function Cutlery({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 160" className={className} style={style} aria-hidden>
      <defs><linearGradient id={`c${id}`} x1="0" x2="1"><stop offset="0" stopColor="#8f6a2b" /><stop offset=".5" stopColor="#fbe7b4" /><stop offset="1" stopColor="#8f6a2b" /></linearGradient></defs>
      <g transform="rotate(-24 60 80)">
        <path d="M50 10v34c0 8 4 12 8 14v92h6V58c4-2 8-6 8-14V10h-4v32h-3V10h-4v32h-3V10h-4v32h-3V10z" fill={`url(#c${id})`} />
      </g>
      <g transform="rotate(24 60 80)">
        <path d="M58 10c10 8 12 30 6 52v88h-6z" fill={`url(#c${id})`} />
      </g>
    </svg>
  );
}

/** Art-deco corner fan (place in four corners, flipping as needed). viewBox 100×100. */
export function Fan({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {[30, 48, 66].map((r) => <path key={r} d={`M0 ${r}A${r} ${r} 0 0 0 ${r} 0`} />)}
        {[15, 35, 55, 75].map((a) => <path key={a} d={`M0 0L${(66 * Math.sin((a * Math.PI) / 180)).toFixed(2)} ${(66 * Math.cos((a * Math.PI) / 180)).toFixed(2)}`} />)}
        <path d="M0 92H8M92 0V8" />
      </g>
      <circle cx="0" cy="0" r="12" fill="currentColor" />
    </svg>
  );
}

export const CL_CSS = `
.cl-noir{background-color:#1b0b0f;background-image:radial-gradient(70% 55% at 50% 30%,rgba(120,30,50,.45),transparent 70%),repeating-linear-gradient(90deg,rgba(241,214,146,.035) 0 1px,transparent 1px 22px),radial-gradient(130% 90% at 50% 120%,#3a0f1a,#12060a 70%)}
.cl-foil{background:linear-gradient(100deg,#8f6a2b 0%,#fbe7b4 24%,#c9a25a 42%,#fff4d6 54%,#a77a33 68%,#f1d692 86%,#8f6a2b 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.cl-shine{animation:clShine 8s ease-in-out infinite}
@keyframes clShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.cl-root [data-dome],.cl-root [data-steam]{transition:transform 1.1s cubic-bezier(.6,0,.2,1),opacity 1s ease}
.cl-root .ss-h2,.cl-root .ss-venue{font-family:var(--f-display,var(--cf-bodoni)),var(--cf-prata),Georgia,serif;font-style:italic;background:linear-gradient(100deg,#8f6a2b,#fbe7b4 30%,#c9a25a 55%,#f1d692 80%,#8f6a2b);-webkit-background-clip:text;background-clip:text;color:transparent}
.cl-root .ss-v,.cl-root .ss-ev,.cl-root .ss-lead,.cl-root .ss-num{font-family:var(--f-display,var(--cf-bodoni)),var(--cf-prata),Georgia,serif;font-style:italic;color:#f5e8d4}
.cl-root .ss-script{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#e6a3ad}
.cl-root .ss-k,.cl-root .ss-time{font-family:var(--cf-tenor),sans-serif;color:#d7b46e}
.cl-root .ss-s,.cl-root .ss-body{color:#cdb7a8}
.cl-root .ss-cell{background:rgba(40,12,20,.75);border:1px solid rgba(215,180,110,.35);box-shadow:inset 0 0 0 5px rgba(27,11,15,.9),inset 0 0 0 6px rgba(215,180,110,.2)}
.cl-root .ss-dots{border-color:rgba(215,180,110,.45)}
.cl-root .ss-btn{background:linear-gradient(100deg,#8f6a2b,#f1d692 50%,#8f6a2b);color:#1b0b0f}
.cl-root .ss-btn-ghost{background:transparent;color:#d7b46e;border:1px solid rgba(215,180,110,.55)}
.cl-root .ss-photo{box-shadow:0 0 0 1px rgba(215,180,110,.6),0 0 0 10px #1b0b0f,0 0 0 11px rgba(215,180,110,.35),0 40px 80px -30px rgba(0,0,0,.7)}
.cl-root .ss-panel{background:rgba(40,12,20,.92);border:1px solid rgba(215,180,110,.45);color:#f5e8d4}
.cl-card .sc-eyebrow,.cl-card .sc-where{font-family:var(--cf-tenor),sans-serif;color:#d7b46e}
.cl-card .sc-name,.cl-card .sc-head,.cl-card .sc-num,.cl-card .sc-tag{font-family:var(--f-display,var(--cf-bodoni)),var(--cf-prata),Georgia,serif;font-style:italic;background:linear-gradient(100deg,#8f6a2b 0%,#fbe7b4 24%,#c9a25a 42%,#fff4d6 54%,#a77a33 68%,#f1d692 86%,#8f6a2b 100%);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.cl-card .sc-date,.cl-card .sc-item-t{font-family:var(--f-display,var(--cf-bodoni)),var(--cf-prata),Georgia,serif;font-style:italic;color:#f5e8d4}
.cl-card .sc-amp,.cl-card .sc-line,.cl-card .sc-foot,.cl-card .sc-host,.cl-card .sc-tagline{font-family:var(--f-script,var(--cf-vibes)),cursive;color:#e6a3ad}
.cl-card .sc-lead,.cl-card .sc-body,.cl-card .sc-item-d{font-family:var(--cf-corm),Georgia,serif;font-style:italic;color:#e3cfc0}
.cl-card .sc-item+.sc-item{border-top:1px solid rgba(215,180,110,.3)}
.cl-card:not(.cl-still) .sc-name{animation:clShine 8s ease-in-out infinite}
.cl-still *{animation:none!important}
@media (prefers-reduced-motion: reduce){.cl-shine,.cl-card .sc-name{animation:none!important}.cl-root [data-dome]{transition:none}}
`;
