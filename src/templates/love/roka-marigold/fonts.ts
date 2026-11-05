import { Amita, Kurale, Yatra_One } from "next/font/google";

export const display = Yatra_One({ subsets: ["latin", "devanagari"], weight: "400", variable: "--rk-display", preload: false });
export const script = Amita({ subsets: ["latin", "devanagari"], weight: ["400", "700"], variable: "--rk-script", preload: false });
export const body = Kurale({ subsets: ["latin", "cyrillic", "devanagari"], weight: "400", variable: "--rk-body", preload: false });
export const fontClass = `${display.variable} ${script.variable} ${body.variable}`;

export const CSS = `
.rk{--d:var(--f-display,var(--rk-display)),var(--rk-body),serif;--s:var(--f-script,var(--rk-script)),var(--rk-body),cursive;--b:var(--f-body,var(--rk-body)),system-ui,serif;font-family:var(--b)}
.rk .d{font-family:var(--d);font-weight:400;letter-spacing:.01em}
.rk .sc{font-family:var(--s);font-weight:700}
.rk .cap{font-family:var(--b);text-transform:uppercase;letter-spacing:.24em}
.rk:lang(hi) .cap{letter-spacing:.04em;text-transform:none}
.rk .gota{background:repeating-linear-gradient(90deg,#f6d27a 0 6px,#c98d2a 6px 8px,#fff1b8 8px 12px,#c98d2a 12px 14px)}
.rk-sway{animation:rk-sway 5s ease-in-out infinite alternate}
@keyframes rk-sway{from{transform:rotate(-2.4deg)}to{transform:rotate(2.4deg)}}
.rk-flame{animation:rk-flame 1.6s ease-in-out infinite}
@keyframes rk-flame{0%,100%{transform:scale(1,1)}35%{transform:scale(.92,1.12) skewX(3deg)}70%{transform:scale(1.05,.94) skewX(-3deg)}}
@keyframes rk-drop{0%{transform:translateY(-105%)}60%{transform:translateY(4%)}80%{transform:translateY(-2%)}100%{transform:none}}
@keyframes rk-pop{0%{opacity:0;transform:scale(.3)}65%{opacity:1;transform:scale(1.08)}100%{transform:none}}
@keyframes rk-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes rk-burst{0%{opacity:0;transform:translate(0,0) scale(.2) rotate(0)}15%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(1) rotate(var(--r))}}
.rk .drop{animation:rk-drop 1.5s cubic-bezier(.3,.7,.3,1) .1s both}
.rk .pop{animation:rk-pop .9s cubic-bezier(.2,.9,.3,1.3) both}
.rk .up{animation:rk-up 1.1s cubic-bezier(.2,.7,.2,1) both}
.rk .burst{animation:rk-burst 2.4s cubic-bezier(.2,.6,.3,1) both}
.rk.still,.rk.still *{animation:none!important}
.rk.still .burst{display:none}
@media (prefers-reduced-motion:reduce){.rk *{animation:none!important}.rk .burst{display:none}}
`;
