import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#0E2520",
  "--g-ink": "#F4EDE0",
  "--g-muted": "#B4C4BA",
  "--g-accent": "#E0BF72",
  "--g-gold": "#D8B66A",
  "--g-red": "#C23A35",
  "--g-line": "rgba(216,182,106,.3)",
  "--g-panel": "#F7F0E2",
  "--g-display": "var(--gf-oldstd), var(--font-deva), Georgia, serif",
  "--g-script": "var(--gf-vibes), var(--gf-amita), var(--font-deva), cursive",
  "--g-body": "var(--gf-oldstd), var(--font-deva), Georgia, serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Merry Christmas", ru: "С Рождеством", hi: "क्रिसमस की शुभकामनाएँ" },
  message: {
    en: "Wishing you a Christmas of candlelight and carols, of slow mornings and long tables, of everyone you love gathered close. Thank you for the warmth you bring to every season — may the new year be as kind to you as you are to all of us.",
    ru: "Желаем Рождества при свечах, с колядками, неспешными утрами и длинным столом, за которым собрались все, кого вы любите. Спасибо за тепло, которое вы дарите в любое время года, — пусть новый год будет к вам так же добр.",
    hi: "आपको मोमबत्तियों की रोशनी, कैरल्स, सुकून भरी सुबहों और अपनों से भरी मेज़ वाले क्रिसमस की शुभकामनाएँ। नया साल आपके लिए उतना ही प्यारा हो जितने आप हम सबके लिए हैं।",
  },
  signoff: { en: "Joy & peace, always", ru: "Мира и радости", hi: "सदा आनंद और शांति" },
};

export const CSS = `
.mc{--grain:.2}
.mc.gk-grain::after,.mc.gc-grain::after{mix-blend-mode:screen;opacity:.06}
.mc-flame{transform-box:fill-box;transform-origin:50% 100%;animation:mc-flick 1.5s ease-in-out infinite}
.mc-glow{transform-box:fill-box;transform-origin:center;animation:mc-pulse 3s ease-in-out infinite}
@keyframes mc-flick{0%,100%{transform:scale(1,1) skewX(0)}35%{transform:scale(.93,1.07) skewX(-4deg)}65%{transform:scale(1.04,.96) skewX(3deg)}}
@keyframes mc-pulse{0%,100%{opacity:.85;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}

.mc-open{position:absolute;inset:0;cursor:pointer;overflow:hidden}
.mc-frost{position:absolute;inset:0;--r:0px;backdrop-filter:blur(20px) saturate(1.15) brightness(1.15);-webkit-backdrop-filter:blur(20px) saturate(1.15) brightness(1.15);background:radial-gradient(ellipse at 50% 50%,rgba(225,238,242,.12),rgba(225,238,242,.42) 80%);-webkit-mask:radial-gradient(circle at 50% 46%,transparent var(--r),#000 calc(var(--r) + 60px));mask:radial-gradient(circle at 50% 46%,transparent var(--r),#000 calc(var(--r) + 60px))}
.mc-frost .mc-fern{position:absolute;width:min(46vw,420px)}
.mc-fern.a{left:0;top:0}.mc-fern.b{right:0;top:0;transform:scaleX(-1)}.mc-fern.c{left:0;bottom:0;transform:scaleY(-1)}.mc-fern.d{right:0;bottom:0;transform:scale(-1,-1)}
.mc-mull{position:absolute;inset:0;pointer-events:none}
.mc-mull i{position:absolute;background:linear-gradient(90deg,#2a1a10,#5a3a24 40%,#3a2416 70%,#22150c);box-shadow:0 0 18px rgba(0,0,0,.5)}
.mc-mull .v{left:50%;top:0;bottom:0;width:clamp(12px,1.6vw,22px);translate:-50% 0}
.mc-mull .h{top:46%;left:0;right:0;height:clamp(12px,1.6vw,22px);background:linear-gradient(180deg,#2a1a10,#5a3a24 40%,#3a2416 70%,#22150c)}
.mc-mull .f{inset:0;background:none;border:clamp(14px,2.4vw,34px) solid #3a2416;box-shadow:inset 0 0 30px rgba(0,0,0,.6)}
.mc-ledge{position:absolute;left:0;right:0;bottom:0;height:clamp(20px,4vh,40px);background:radial-gradient(ellipse 30px 16px at 20% 0,#fff 98%,transparent),linear-gradient(#fff,#E6EEF2);border-radius:40% 40% 0 0/100% 100% 0 0}
.mc-write{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;pointer-events:none;padding:0 6vw}
.mc-write p{margin:0}
.mc-write .w1{font-family:var(--g-script);font-size:clamp(46px,9vw,120px);color:rgba(255,255,255,.88);text-shadow:0 0 18px rgba(255,255,255,.5),0 2px 2px rgba(0,40,30,.25);transform:rotate(-4deg)}
.mc-write .gk-tap{margin-top:28px;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.4)}

.mc-hero{position:relative;min-height:100svh;display:grid;place-items:center;overflow:hidden;background:radial-gradient(50% 45% at 50% 52%,rgba(255,190,110,.22),transparent 70%),radial-gradient(120% 90% at 50% 30%,#163A31 0%,#0E2520 55%,#08160F 100%);padding:6cqi 0 10cqi}
.is-compact .mc-hero{min-height:133cqi}
.mc-wr{--w:min(84cqi,84svh,860px);position:relative;width:var(--w);aspect-ratio:1;z-index:2}
.is-compact .mc-wr{--w:88cqi}
.mc-wreath{position:absolute;inset:0;width:100%;height:100%}
.mc-wr-in{position:absolute;inset:22%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:2}
.mc-line{font-family:var(--g-body);font-style:italic;font-size:calc(var(--w) * .028);color:var(--g-muted);margin:0}
.mc-head{font-family:var(--g-display);font-style:italic;font-weight:400;font-size:calc(var(--w) * .088 * var(--k,1));line-height:1.05;margin:.15em 0 .1em;color:var(--g-ink);text-wrap:balance}
.mc-name{font-family:var(--g-script);font-size:calc(var(--w) * .078 * var(--k,1));color:var(--g-accent);margin:0;line-height:1.2}
.mc-candles{position:absolute;bottom:0;left:50%;translate:-50% 0;width:min(110cqi,1300px);display:flex;justify-content:space-between;align-items:flex-end;z-index:3;padding:0 3cqi;pointer-events:none}
.mc-candles svg{width:clamp(44px,6cqi,86px)}
@container (max-width:700px){.mc-candles{display:none}}

.mc .gk-kicker{color:var(--g-accent)}
.mc .gk-title{font-style:italic}
.mc .gk-wish{font-weight:400}
.mc-rule{width:clamp(170px,22cqi,240px);display:block;margin:0 auto}
.mc-letter{position:relative;max-width:700px;margin:0 auto;padding:clamp(48px,8cqi,90px) clamp(28px,8cqi,90px);background:#F7F0E2;color:#2A2420;text-align:center;box-shadow:0 40px 80px -30px rgba(0,0,0,.6);rotate:.6deg}
.mc-letter::before{content:"";position:absolute;inset:12px;border:2px solid #9B2A26;outline:1px solid #2C5E46;outline-offset:4px;pointer-events:none}
.mc-letter .gk-kicker{color:#9B2A26}
.mc-letter .gk-title{color:#1F4A3A}
.mc-msg{font-size:clamp(18px,2.1cqi,22px);line-height:1.8;color:#3a302a}
.mc-sign{font-family:var(--g-script);color:#9B2A26;font-size:clamp(32px,4.4cqi,52px);display:block;margin-top:.6em}
.mc-photo{background:#F7F0E2;padding:12px 12px 40px;box-shadow:0 30px 50px -24px rgba(0,0,0,.6);overflow:visible}
.mc-photo img{filter:sepia(.25) contrast(1.02)}
.mc .gk-event{background:#13302A}
.mc .gk-btn{color:var(--g-accent)}
.mc .gk-btn:hover{background:var(--g-accent);color:#0E2520}
`;
