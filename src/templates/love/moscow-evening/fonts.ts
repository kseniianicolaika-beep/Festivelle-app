import { Old_Standard_TT, Oranienbaum } from "next/font/google";

export const display = Oranienbaum({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--me-display", preload: false });
export const text = Old_Standard_TT({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--me-text", preload: false });
export const fontClass = `${display.variable} ${text.variable}`;

// Marck Script (the Russian handwriting face) is loaded globally as --font-script.
export const CSS = `
.me{--d:var(--f-display,var(--me-display)),var(--font-deva),Georgia,serif;--h:var(--f-script,var(--font-script)),var(--font-deva),cursive;--b:var(--f-body,var(--me-text)),var(--font-deva),Georgia,serif;font-family:var(--b)}
.me .d{font-family:var(--d);font-weight:400;letter-spacing:.005em}
.me .h{font-family:var(--h)}
.me .it{font-family:var(--b);font-style:italic}
.me .cap{font-family:var(--b);text-transform:uppercase;letter-spacing:.3em;font-size:.72em}
.me:lang(hi) .cap{letter-spacing:.05em;text-transform:none}
.me .ink{color:color-mix(in oklab,#1f2a44 80%,var(--t-ink))}
.me-wax{font-family:var(--me-display),var(--font-deva),serif;color:#3c0b10;text-shadow:1px 1px 0 rgba(255,170,170,.35),-1px -1px 0 rgba(0,0,0,.45)}
.me .silver{background:linear-gradient(100deg,#8d95a0,#f4f6f8 25%,#9aa3ae 45%,#e9edf1 70%,#8d95a0);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:me-sheen 7s ease-in-out infinite}
@keyframes me-sheen{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}
.me .lined{background-image:repeating-linear-gradient(180deg,transparent 0 2.15em,color-mix(in oklab,var(--t-gold) 35%,transparent) 2.15em calc(2.15em + 1px));line-height:2.15em}
.me-snow{animation:me-snow 18s linear infinite}
.me-snow2{animation:me-snow 30s linear infinite}
@keyframes me-snow{from{background-position:0 0,0 0,0 0,0 0}to{background-position:40px 660px,-30px 480px,20px 900px,-10px 360px}}
.me-window{animation:me-glow 4s ease-in-out infinite alternate}
@keyframes me-glow{from{opacity:.22}to{opacity:.5}}
@keyframes me-seal{0%{transform:translate(-50%,-50%) scale(1)}40%{transform:translate(-50%,-50%) scale(1.08)}100%{transform:translate(-50%,-50%) scale(.2);opacity:0}}
@keyframes me-flap{0%{transform:rotateX(0);z-index:3}49%{z-index:3}50%{z-index:0}100%{transform:rotateX(180deg);z-index:0}}
@keyframes me-letter{from{transform:translateY(0)}to{transform:translateY(var(--rise,-46%))}}
@keyframes me-unfold{from{transform:perspective(900px) rotateX(-88deg);opacity:.4}to{transform:none;opacity:1}}
@keyframes me-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes me-write{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.me .seal-go{animation:me-seal 1s cubic-bezier(.6,0,.4,1) .8s both}
.me .flap{transform-origin:top;animation:me-flap 1s cubic-bezier(.5,0,.3,1) 1.5s both}
.me .letter{animation:me-letter 1.4s cubic-bezier(.3,.7,.2,1) 2.3s both}
.me .unfold{transform-origin:top;animation:me-unfold 1.4s cubic-bezier(.2,.7,.2,1) both}
.me .up{animation:me-up 1.2s cubic-bezier(.2,.7,.2,1) both}
.me .write{animation:me-write 2.4s cubic-bezier(.5,.1,.3,1) both}
.me.still,.me.still *{animation:none!important}
.me.still .seal-go{display:none}.me.still .flap{transform:rotateX(180deg);z-index:0}.me.still .letter{transform:translateY(var(--rise,-46%))}
.me .opened .seal-go{display:none}.me .opened .flap{transform:rotateX(180deg);z-index:0;animation:none}.me .opened .letter{transform:translateY(var(--rise,-46%));animation:none}
@media (prefers-reduced-motion:reduce){.me *{animation:none!important}.me .seal-go{display:none}.me .flap{transform:rotateX(180deg);z-index:0}.me .letter{transform:translateY(var(--rise,-46%))}}
`;
