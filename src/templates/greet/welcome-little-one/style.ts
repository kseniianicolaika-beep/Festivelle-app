import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#F2F6FB",
  "--g-ink": "#2E3A55",
  "--g-muted": "#7886A3",
  "--g-accent": "#5F7FB8",
  "--g-gold": "#D9B98A",
  "--g-blush": "#E79AAA",
  "--g-line": "rgba(95,127,184,.22)",
  "--g-panel": "#FFFDF8",
  "--g-display": "var(--gf-nunito), var(--font-comfortaa), var(--font-deva), sans-serif",
  "--g-script": "var(--gf-caveat), var(--gf-kalam, var(--font-deva)), cursive",
  "--g-body": "var(--gf-nunito), var(--font-deva), sans-serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Welcome, little one", ru: "Добро пожаловать, малыш", hi: "नन्हे मेहमान का स्वागत" },
  message: {
    en: "The world just got a little softer. Welcome to the tiniest person with the biggest welcome — may your days be full of lullabies, warm arms and endless wonder. To the new parents: we couldn't be happier for you, and we can't wait for the first cuddle.",
    ru: "Мир стал чуточку нежнее. Добро пожаловать самому маленькому человечку с самой большой любовью вокруг — пусть дни будут полны колыбельных, тёплых рук и бесконечных чудес. Родителям — огромные поздравления!",
    hi: "दुनिया आज थोड़ी और कोमल हो गई है। नन्हे मेहमान का दिल से स्वागत — आपके दिन लोरियों, गर्म बाँहों और अनगिनत अचरजों से भरे हों। नए माता-पिता को ढेरों बधाई!",
  },
  signoff: { en: "Hugs and tiny kisses", ru: "Обнимаем и целуем", hi: "ढेर सारा प्यार और दुलार" },
};

export const CSS = `
.wl{--grain:.25}
.wl-hang{animation:wl-swing 4.5s ease-in-out infinite}
@keyframes wl-swing{0%,100%{rotate:-5deg}50%{rotate:5deg}}
.wl-tw{animation:gc-twinkle 3s ease-in-out infinite}
.wl-drift{animation:wl-drift 14s ease-in-out infinite}
@keyframes wl-drift{0%,100%{translate:0 0}50%{translate:3% -2%}}

.wl-open{position:absolute;inset:0;cursor:pointer;overflow:hidden;background:linear-gradient(180deg,#CFDDF2 0%,#EAF0F9 60%,#F7F1F2 100%)}
.wl-oc{position:absolute;width:min(80vw,760px);filter:drop-shadow(0 20px 30px rgba(95,127,184,.18))}
.wl-open-mobile{position:absolute;left:50%;top:0;width:min(84vw,560px);translate:-50% 0;z-index:2}
.wl-open-mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:3;padding-top:20vh}
.wl-open-t{font-family:var(--g-script);font-size:clamp(34px,6vw,64px);color:var(--g-ink);margin:0}
.wl-open .gk-tap{color:var(--g-accent);margin-top:12px}

.wl-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(60% 50% at 50% 45%,#FFFFFF 0%,transparent 70%),linear-gradient(180deg,#CFDDF2 0%,#EAF0F9 55%,#F8EEF0 100%);padding:0 6cqi}
.is-compact .wl-hero{min-height:133cqi}
.wl-mobile{position:absolute;left:50%;top:0;width:clamp(280px,44cqi,620px);translate:-50% 0;z-index:2}
.wl-moon{position:absolute;right:8cqi;top:12cqi;width:clamp(70px,9cqi,130px);z-index:1}
.wl-star{position:absolute;z-index:1}
.wl-clouds{position:absolute;left:0;right:0;bottom:-6%;height:24%;z-index:2;pointer-events:none}
.wl-clouds svg{position:absolute;bottom:0}
.wl-hero-in{position:relative;z-index:3;text-align:center;display:flex;flex-direction:column;align-items:center;margin-top:clamp(140px,18cqi,240px)}
.wl-line{font-family:var(--g-body);font-weight:600;letter-spacing:.24em;text-transform:uppercase;font-size:clamp(11px,1.1cqi,13px);color:var(--g-muted);margin:0}
.wl-name{font-family:var(--g-display);font-weight:800;color:var(--g-ink);font-size:calc(clamp(56px,11cqi,170px) * var(--k,1));line-height:1;margin:.15em 0 .05em;letter-spacing:-.02em;text-shadow:0 6px 0 #fff,0 14px 30px rgba(95,127,184,.25)}
.wl-head{font-family:var(--g-script);color:var(--g-blush);font-size:calc(clamp(34px,5cqi,72px) * var(--k,1));margin:0;line-height:1.1}
.wl-rattle{position:absolute;z-index:4;left:clamp(14px,8cqi,140px);bottom:clamp(60px,10cqi,150px);width:clamp(60px,8cqi,120px);background:none;border:0;padding:0;cursor:pointer;rotate:-18deg}
.wl-burst{position:absolute;pointer-events:none;z-index:5}

.wl .gk-kicker{color:var(--g-accent);font-weight:700}
.wl .gk-title{font-weight:800;letter-spacing:-.02em}
.wl .gk-wish{font-family:var(--g-script);font-style:normal;font-size:clamp(32px,5cqi,60px);color:var(--g-ink)}
.wl-rule{width:clamp(170px,20cqi,240px);display:block;margin:0 auto}
.wl-letter{position:relative;max-width:680px;margin:0 auto;padding:clamp(60px,9cqi,96px) clamp(28px,8cqi,80px) clamp(48px,7cqi,80px);background:#FFFDF8;border-radius:36px;text-align:center;box-shadow:0 30px 60px -30px rgba(95,127,184,.45)}
.wl-letter::before{content:"";position:absolute;inset:14px;border:2px dashed rgba(95,127,184,.35);border-radius:26px;pointer-events:none}
.wl-letter-cloud{position:absolute;left:50%;top:0;width:200px;translate:-50% -55%}
.wl-msg{font-size:clamp(18px,2.1cqi,21px);line-height:1.8}
.wl-sign{font-family:var(--g-script);color:var(--g-blush);font-size:clamp(34px,4.6cqi,54px);display:block;margin-top:.4em}
.wl-photo{border-radius:28px;border:8px solid #fff;box-shadow:0 20px 40px -20px rgba(95,127,184,.5)}
.wl-photo img{border-radius:20px}
.wl .gk-event{background:#fff;border-radius:22px;border:0}
.wl .gk-btn{color:var(--g-accent)}
.wl .gk-btn:hover{background:var(--g-accent);color:#fff;border-color:var(--g-accent)}
`;
