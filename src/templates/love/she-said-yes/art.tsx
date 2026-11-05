import { Dela_Gothic_One, Jost } from "next/font/google";

// She Said Yes — cinematic: a full-bleed proposal photo, letterbox bars, a stamped YES. and the date in bold.
export const display = Dela_Gothic_One({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--sy-display", preload: false });
export const body = Jost({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--sy-body", preload: false });
export const fontClass = `${display.variable} ${body.variable}`;

export const CSS = `
.sy{--d:var(--f-display,var(--sy-display)),var(--font-deva),Impact,sans-serif;--b:var(--f-body,var(--sy-body)),var(--font-deva),system-ui,sans-serif;font-family:var(--b);font-weight:300}
.sy .d{font-family:var(--d);font-weight:400;letter-spacing:-.02em;line-height:.86}
.sy .m{font-family:var(--b);font-weight:500;letter-spacing:.32em;text-transform:uppercase}
.sy:lang(hi) .m{letter-spacing:.04em}
.sy .it{font-family:var(--b);font-style:italic;font-weight:300}
.sy .sun{background:linear-gradient(180deg,#ffd27a 0%,#f39a4a 45%,var(--t-accent) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.sy .outline{color:transparent;-webkit-text-stroke:1.5px var(--ol,#fff6ea)}
@keyframes sy-bar-t{from{height:50%}to{height:var(--bar,9%)}}
@keyframes sy-stamp{0%{opacity:0;transform:scale(2.6) rotate(-14deg);filter:blur(10px)}55%{opacity:1;transform:scale(.94) rotate(-6deg);filter:none}75%{transform:scale(1.03) rotate(-7deg)}100%{transform:scale(1) rotate(-6deg)}}
@keyframes sy-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes sy-wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes sy-ken{from{transform:scale(1.18)}to{transform:scale(1.04)}}
@keyframes sy-grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,1%)}50%{transform:translate(1%,-2%)}75%{transform:translate(2%,2%)}}
.sy .bar{animation:sy-bar-t 1.8s cubic-bezier(.7,0,.2,1) .2s both}
.sy .stamp{animation:sy-stamp 1.1s cubic-bezier(.2,.8,.3,1.2) 1.6s both}
.sy .up{animation:sy-up 1.1s cubic-bezier(.2,.7,.2,1) both}
.sy .wipe{animation:sy-wipe 1.3s cubic-bezier(.7,0,.2,1) both}
.sy .ken{animation:sy-ken 9s cubic-bezier(.2,.6,.3,1) both}
.sy .filmgrain{animation:sy-grain .9s steps(3) infinite}
.sy.still,.sy.still *{animation:none!important}
.sy.still .stamp{transform:rotate(-6deg)}.sy.still .bar{height:var(--bar,9%)}
@media (prefers-reduced-motion:reduce){.sy *{animation:none!important}.sy .stamp{transform:rotate(-6deg)}.sy .bar{height:var(--bar,9%)}}
`;

/** Retro striped sun + palm silhouettes over the Arabian Sea — the stand-in when there's no photo. */
export function Sunset({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="sy-sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3b1f3a" /><stop offset=".45" stopColor="#c8553d" /><stop offset=".7" stopColor="#f39a4a" /><stop offset="1" stopColor="#ffd8a0" /></linearGradient>
        <linearGradient id="sy-sun" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff1c4" /><stop offset="1" stopColor="#ffb054" /></linearGradient>
        <linearGradient id="sy-sea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7a3b4a" /><stop offset="1" stopColor="#2a1626" /></linearGradient>
        <mask id="sy-stripes"><rect width="400" height="500" fill="#fff" />{[262, 276, 288, 298, 306].map((y, i) => <rect key={y} y={y} width="400" height={3 + i * 1.6} fill="#000" />)}</mask>
      </defs>
      <rect width="400" height="500" fill="url(#sy-sky)" />
      <circle cx="200" cy="300" r="96" fill="url(#sy-sun)" mask="url(#sy-stripes)" />
      <rect y="310" width="400" height="190" fill="url(#sy-sea)" />
      {[330, 346, 364, 386, 412].map((y, i) => <path key={y} d={`M${150 - i * 14} ${y}h${100 + i * 28}`} stroke="#ffcf88" strokeOpacity={0.7 - i * 0.12} strokeWidth={2 - i * 0.2} strokeLinecap="round" />)}
      <g fill="#1d0f17">
        <path d="M40 500C46 420 52 340 70 250l6 2C62 340 58 420 56 500Z" />
        <path d="M73 250c-30-10-58-4-80 14 26-8 50-8 76-2-34 4-56 20-66 40 22-18 46-28 70-30-20 14-30 34-30 56 12-24 26-40 34-48 0 20 6 38 18 52-4-20-4-40 2-56 14 14 32 22 52 24-16-10-28-26-34-42 24 0 44 8 62 22-12-20-34-34-58-36 24-8 50-6 72 4-24-18-56-22-84-12 16-14 38-20 60-20-26-8-52-2-72 14Z" />
        <path d="M352 500c-4-80-10-150-30-220l-6 2c18 70 22 140 22 218Z" />
        <path d="M318 280c26-12 54-10 76 4-24-4-46-2-68 6 30 2 52 14 64 34-22-14-44-22-66-22 18 12 28 30 28 50-12-20-26-34-34-40 0 18-4 34-14 48 2-18 0-34-6-48-12 14-28 22-46 26 14-12 24-26 28-40-22 2-40 10-56 22 12-18 30-30 52-34-22-6-44-4-64 6 20-16 48-22 74-14-14-10-32-14-50-14 22-6 46-2 62 16Z" />
      </g>
    </svg>
  );
}
