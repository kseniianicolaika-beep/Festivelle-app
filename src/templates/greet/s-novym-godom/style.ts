import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#0B1838",
  "--g-ink": "#F5EEDC",
  "--g-muted": "#A9B7D8",
  "--g-accent": "#E8C878",
  "--g-gold": "#E2C278",
  "--g-red": "#D23C3C",
  "--g-line": "rgba(226,194,120,.3)",
  "--g-panel": "#FBF8F1",
  "--g-display": "var(--gf-yeseva), var(--font-deva), Georgia, serif",
  "--g-script": "var(--font-script), var(--gf-amita), var(--font-deva), cursive",
  "--g-body": "var(--font-lora), var(--font-deva), Georgia, serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Happy New Year", ru: "С Новым годом!", hi: "नववर्ष की शुभकामनाएँ" },
  message: {
    en: "When the chimes strike twelve, make a wish — and know that ours are all for you: health, laughter, a home that smells of mandarins and pine, and a year full of the small miracles that make life sparkle.",
    ru: "Когда пробьют куранты, загадай желание — а наши все для тебя: здоровья, смеха, дома, где пахнет мандаринами и хвоей, и года, полного маленьких чудес, от которых жизнь сверкает.",
    hi: "जब घड़ी बारह बजाए, एक मनोकामना माँगिए — और हमारी सारी दुआएँ आपके लिए हैं: सेहत, हँसी, संतरों और देवदार की खुशबू वाला घर और छोटे-छोटे चमत्कारों से भरा साल।",
  },
  signoff: { en: "With love and snowflakes", ru: "С любовью и снежинками", hi: "प्यार और बर्फ़ के फाहों के साथ" },
};

export const GOLDTXT = `background:linear-gradient(180deg,#FFF3CF 0%,#F0D58E 40%,#B88A35 78%,#F6E2A6 100%);-webkit-background-clip:text;background-clip:text;color:transparent`;

export const CSS = `
.ny{--grain:.14}
.ny.gk-grain::after,.ny.gc-grain::after{mix-blend-mode:screen;opacity:.05}
.ny-gold{${GOLDTXT}}
.ny-light{animation:gc-twinkle 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.ny-ball{animation:ny-swing 4s ease-in-out infinite}
@keyframes ny-swing{0%,100%{rotate:-4deg}50%{rotate:4deg}}
.ny-star{animation:ny-glow 3s ease-in-out infinite}
@keyframes ny-glow{0%,100%{filter:drop-shadow(0 0 6px rgba(255,80,80,.5))}50%{filter:drop-shadow(0 0 18px rgba(255,120,120,.9))}}
.ny-flake{position:absolute;animation:gc-spin 40s linear infinite;opacity:.8;pointer-events:none}

.ny-open{position:absolute;inset:0;display:grid;place-items:center;cursor:pointer;overflow:hidden;background:radial-gradient(60% 50% at 50% 45%,#1A2C5E 0%,#0B1838 60%,#050B1E 100%);color:var(--g-ink)}
.ny-open-in{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(18px,3.5vh,34px)}
.ny-open-t{font-family:var(--g-display);font-size:clamp(22px,4vw,38px);margin:0}
.ny-clockbox{position:relative;width:min(70vmin,420px);aspect-ratio:1}
.ny-clock{width:100%;height:100%;filter:drop-shadow(0 30px 60px rgba(0,0,0,.6))}
.ny-hh,.ny-mh{transform-origin:0 0}
.ny-ring{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(240,213,142,.8);opacity:0;pointer-events:none}
.ny-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 46%,#FFF6DA,rgba(255,246,218,0) 60%);opacity:0;pointer-events:none}
.ny-open .gk-tap{color:var(--g-accent)}

.ny-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1fr;align-items:center;overflow:hidden;background:radial-gradient(50% 50% at 70% 60%,rgba(255,190,110,.14),transparent 70%),radial-gradient(120% 90% at 50% 0%,#1A2C5E 0%,#0B1838 60%,#060E26 100%);padding:10cqi 6cqi 0}
.is-compact .ny-hero{min-height:133cqi}
.ny-year{position:absolute;right:-2cqi;top:50%;translate:0 -50%;font-family:var(--g-display);font-size:clamp(140px,34cqi,520px);line-height:.8;color:transparent;-webkit-text-stroke:1.4px rgba(226,194,120,.28);pointer-events:none;letter-spacing:-.02em;z-index:0}
.ny-txt{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;text-align:center}
.ny-orn{font-family:var(--g-script);color:var(--g-accent);font-size:clamp(26px,3.6cqi,44px);margin:0}
.ny-head{font-family:var(--g-display);font-weight:400;font-size:calc(clamp(52px,9cqi,132px) * var(--k,1));line-height:1.02;margin:.08em 0 0;text-wrap:balance}
.ny-line{font-family:var(--g-body);font-style:italic;font-size:clamp(16px,1.9cqi,22px);color:var(--g-muted);margin:1.1em 0 0}
.ny-name{font-family:var(--g-script);color:var(--g-ink);font-size:calc(clamp(40px,6.4cqi,92px) * var(--k,1));margin:0;line-height:1.15}
.ny-treebox{position:relative;z-index:2;display:flex;justify-content:center;align-items:flex-end;align-self:end}
.ny-tree{width:clamp(240px,40cqi,560px);display:block}
.ny-mand{position:absolute;bottom:0;width:clamp(48px,7cqi,96px);z-index:3}
@container (min-width:820px){.ny-hero{grid-template-columns:1.1fr 1fr;padding:0 6cqi}.ny-treebox{height:100%;align-items:flex-end}.ny-tree{width:min(40cqi,82svh)}}

.ny .gk-kicker{color:var(--g-accent)}
.ny .gk-title{${GOLDTXT}}
.ny .gk-wish{font-family:var(--g-body)}
.ny-rule{width:clamp(180px,22cqi,260px);display:block;margin:0 auto}
.ny-letter{position:relative;max-width:700px;margin:0 auto;padding:clamp(60px,9cqi,100px) clamp(30px,8cqi,90px);background:#FBF8F1;color:#25304d;text-align:center;-webkit-mask:radial-gradient(circle 9px at 50% 0,transparent 98%,#000) 0 0/22px 51% repeat-x,radial-gradient(circle 9px at 50% 100%,transparent 98%,#000) 0 100%/22px 51% repeat-x;mask:radial-gradient(circle 9px at 50% 0,transparent 98%,#000) 0 0/22px 51% repeat-x,radial-gradient(circle 9px at 50% 100%,transparent 98%,#000) 0 100%/22px 51% repeat-x}
.ny-letter::before{content:"";position:absolute;inset:22px;border:1px dashed rgba(37,48,77,.25);pointer-events:none}
.ny-letter .gk-kicker{color:#B8322F}
.ny-letter .gk-title{background:none;color:#1A2C5E}
.ny-msg{font-size:clamp(18px,2.1cqi,22px);line-height:1.8}
.ny-sign{font-family:var(--g-script);color:#B8322F;font-size:clamp(32px,4.4cqi,52px);display:block;margin-top:.5em}
.ny-photo{border:1px solid var(--g-gold);padding:8px;background:#0B1838;overflow:visible}
.ny .gk-event{background:#13224A}
.ny .gk-btn{color:var(--g-accent)}
.ny .gk-btn:hover{background:var(--g-accent);color:#0B1838}
`;
