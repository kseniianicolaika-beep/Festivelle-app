import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#F4EFE6",
  "--g-ink": "#26241F",
  "--g-muted": "#837A6C",
  "--g-accent": "#5E6B4E",
  "--g-gold": "#B39C76",
  "--g-line": "rgba(38,36,31,.16)",
  "--g-panel": "#FBF8F2",
  "--g-display": "var(--font-cormorant), var(--font-deva), Georgia, serif",
  "--g-script": "var(--font-cormorant), var(--font-deva), Georgia, serif",
  "--g-body": "var(--gf-tenor), var(--font-deva), sans-serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Thank you", ru: "Спасибо", hi: "धन्यवाद" },
  message: {
    en: "Some kindnesses are too large for a quick word in a corridor. Your care, your patience and the time you gave so freely changed the course of our year. We wanted you to have this — quietly, sincerely, and with our deepest gratitude.",
    ru: "Есть доброта, о которой не скажешь мимоходом. Ваша забота, терпение и время, которое вы отдали так щедро, изменили наш год. Нам хотелось сказать это тихо, искренне и с глубокой благодарностью.",
    hi: "कुछ उपकार इतने बड़े होते हैं कि उन्हें जल्दी में कहा नहीं जा सकता। आपकी परवाह, आपका धैर्य और आपका दिया हुआ समय — इन सबने हमारा साल बदल दिया। हृदय से धन्यवाद।",
  },
  signoff: { en: "With heartfelt thanks", ru: "С искренней благодарностью", hi: "हार्दिक आभार सहित" },
};

// Letterpress: ink sits *in* the paper — a dark top-left inner edge and a light bottom-right lip.
export const PRESS = "text-shadow:0 1px 0 rgba(255,255,255,.85),0 -1px 0 rgba(0,0,0,.18)";
export const DEBOSS = "color:#E9E3D8;text-shadow:1px 1px 1px rgba(255,255,255,.95),-1px -1px 1px rgba(0,0,0,.14)";

export const CSS = `
.wg{--grain:.5}
.wg-press{${PRESS}}
.wg-deboss{${DEBOSS}}
.wg-caps{font-family:var(--g-body);text-transform:uppercase;letter-spacing:.3em;font-size:11px}

.wg-open{position:absolute;inset:0;display:grid;place-items:center;cursor:pointer;overflow:hidden;background:radial-gradient(70% 60% at 50% 45%,#ECE6DA,#D9D1C2)}
.wg-envwrap{position:relative;width:min(70vw,380px);aspect-ratio:5/7}
.wg-cardp{position:absolute;inset:0;background:#F8F4EC;box-shadow:0 40px 70px -30px rgba(40,30,20,.45),0 2px 4px rgba(40,30,20,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
.wg-cardp::before{content:"";position:absolute;inset:16px;box-shadow:inset 1px 1px 1px rgba(0,0,0,.12),inset -1px -1px 1px rgba(255,255,255,.9)}
.wg-cardp .wg-dv{width:62%;color:#D8D0C2;filter:drop-shadow(1px 1px 0 rgba(255,255,255,.9)) drop-shadow(-1px -1px 0 rgba(0,0,0,.12))}
.wg-cardp .wg-t{font-family:var(--g-display);font-size:clamp(40px,8vw,64px);font-weight:300;margin:0}
.wg-vellum{position:absolute;inset:-3% 0;background:linear-gradient(100deg,rgba(255,255,255,.55),rgba(250,248,244,.72) 50%,rgba(255,255,255,.5));backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);box-shadow:0 0 0 1px rgba(255,255,255,.6),0 10px 30px rgba(0,0,0,.08);display:grid;place-items:center}
.wg-belly{position:absolute;left:-4%;right:-4%;top:58%;height:16%;background:#5E6B4E;display:grid;place-items:center;color:#F4EFE6;box-shadow:0 4px 10px rgba(0,0,0,.18)}
.wg-belly span{font-family:var(--g-body);letter-spacing:.4em;text-transform:uppercase;font-size:clamp(10px,1.6vw,12px)}
.wg-open .gk-tap{position:absolute;bottom:8vh;left:0;right:0;text-align:center;color:var(--g-muted)}

.wg-hero{position:relative;min-height:100svh;display:grid;grid-template-rows:auto 1fr auto;padding:clamp(22px,4cqi,56px) clamp(22px,6cqi,96px);overflow:hidden}
.is-compact .wg-hero{min-height:133cqi}
.wg-mast{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--g-line);padding-bottom:14px;color:var(--g-muted)}
.wg-mid{display:flex;flex-direction:column;justify-content:center;padding:6cqi 0}
.wg-big{font-family:var(--g-display);font-weight:300;font-size:calc(clamp(84px,19cqi,300px) * var(--k,1));line-height:.86;letter-spacing:-.035em;margin:0;color:var(--g-ink)}
.wg-big em{font-style:italic;color:var(--g-accent)}
.wg-to{display:flex;align-items:baseline;gap:clamp(12px,2cqi,28px);margin-top:clamp(20px,3cqi,40px);flex-wrap:wrap}
.wg-name{font-family:var(--g-display);font-style:italic;font-size:calc(clamp(34px,5.4cqi,80px) * var(--k,1));line-height:1.1;margin:0}
.wg-doves{position:absolute;right:clamp(10px,5cqi,90px);top:clamp(90px,14cqi,190px);width:clamp(200px,34cqi,520px);color:var(--g-accent);opacity:.9}
.wg-foot{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid var(--g-line);padding-top:14px;color:var(--g-muted);gap:20px}
.wg-foot p{margin:0}
@container (max-width:700px){.wg-doves{position:relative;right:auto;top:auto;width:80%;margin:0 auto 4cqi;display:block}.wg-mid{padding-top:10cqi}}

.wg .gk-kicker{font-family:var(--g-body);color:var(--g-accent)}
.wg .gk-title{font-weight:300}
.wg .gk-wish{font-weight:300;font-style:italic;color:var(--g-ink)}
.wg-rule{width:clamp(160px,18cqi,220px);display:block;margin:0 auto;color:var(--g-accent)}
.wg-letter{position:relative;max-width:980px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:clamp(24px,5cqi,70px);align-items:start}
@container (min-width:820px){.wg-letter{grid-template-columns:.9fr 1.1fr}}
.wg-lede{font-family:var(--g-display);font-weight:300;font-size:clamp(34px,4.6cqi,60px);line-height:1.08;margin:0;letter-spacing:-.01em}
.wg-col{border-left:1px solid var(--g-line);padding-left:clamp(18px,3cqi,40px)}
.wg-msg{font-family:var(--g-display);font-size:clamp(19px,2.1cqi,23px);line-height:1.75}
.wg-msg::first-letter{float:left;font-size:3.6em;line-height:.82;padding:.06em .1em 0 0;color:var(--g-accent);font-weight:300}
.wg-sign{font-family:var(--g-display);font-style:italic;font-size:clamp(28px,3.6cqi,44px);color:var(--g-accent);margin-top:.8em;display:block}
.wg-photo{overflow:hidden}
.wg-photo img{filter:grayscale(1) contrast(1.05);mix-blend-mode:multiply}
.wg .gk-event{background:var(--g-panel)}
`;
