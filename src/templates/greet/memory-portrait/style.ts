import type { GreetDefaults } from "../_shared/kit";
import { damask } from "./art";

export const VARS = {
  "--g-bg": "#2E1A1C",
  "--g-ink": "#F2E6D3",
  "--g-muted": "#C9B49C",
  "--g-accent": "#E3B9A6",
  "--g-gold": "#D2AE62",
  "--g-line": "rgba(210,174,98,.3)",
  "--g-panel": "#F4EBDD",
  "--g-display": "var(--font-playfair), var(--font-deva), Georgia, serif",
  "--g-script": "var(--gf-vibes), var(--gf-amita), var(--font-deva), cursive",
  "--g-body": "var(--font-cormorant), var(--font-deva), Georgia, serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "With all our love", ru: "Со всей любовью", hi: "ढेर सारे प्यार के साथ" },
  message: {
    en: "Some photographs hold a whole lifetime. This one holds your laugh, your patience and every Sunday you made feel like a holiday. We framed it because you deserve a place of honour — on our wall, and in our hearts, always.",
    ru: "Некоторые фотографии вмещают целую жизнь. В этой — твой смех, твоё терпение и каждое воскресенье, которое ты превращал в праздник. Мы вставили её в раму, потому что ты достоин почётного места — на стене и в наших сердцах.",
    hi: "कुछ तस्वीरों में पूरी ज़िंदगी समा जाती है। इसमें आपकी हँसी, आपका धैर्य और हर वो इतवार है जिसे आपने त्योहार बना दिया। आपकी जगह हमेशा सबसे ऊँची है — दीवार पर भी, दिल में भी।",
  },
  signoff: { en: "Forever your family", ru: "Навсегда твоя семья", hi: "सदा आपका परिवार" },
};

const GILT = "linear-gradient(135deg,#6E4E1C 0%,#F3DC9A 18%,#B8893A 36%,#FFF0C0 50%,#A07428 64%,#E8C878 82%,#6E4E1C 100%)";

export const CSS = `
.mp{--grain:.22}
.mp.gk-grain::after,.mp.gc-grain::after{mix-blend-mode:screen;opacity:.06}
.mp-wall{background-color:#33191b;background-image:radial-gradient(60% 50% at 50% 38%,rgba(255,214,150,.22),transparent 70%),radial-gradient(130% 100% at 50% 40%,transparent 50%,rgba(0,0,0,.55)),${damask("#3d2124")};background-size:auto,auto,120px 140px}
.mp-frame{position:relative;padding:5.2%;background:${GILT};box-shadow:inset 0 0 0 2px rgba(255,240,200,.55),inset 0 0 0 7px rgba(110,78,28,.55),inset 0 0 22px rgba(60,30,0,.7),0 40px 70px -20px rgba(0,0,0,.75),0 6px 14px rgba(0,0,0,.5)}
.mp-frame::before{content:"";position:absolute;inset:2.6%;border:2px solid rgba(255,240,200,.45);box-shadow:inset 0 0 0 3px rgba(110,78,28,.35);pointer-events:none}
.mp-mat{background:#EFE5D3;padding:7%;box-shadow:inset 2px 2px 6px rgba(0,0,0,.35)}
.mp-pic{position:relative;aspect-ratio:4/5;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.25)}
.mp-pic img,.mp-pic svg{width:100%;height:100%;object-fit:cover;display:block}
.mp-pic img{filter:sepia(.32) contrast(1.05) saturate(.85)}
.mp-pic::after{content:"";position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.18) 0%,transparent 36%);pointer-events:none}
.mp-gc{position:absolute;width:22%;z-index:2;pointer-events:none}
.mp-gc.tl{left:-6%;top:-6%}.mp-gc.tr{right:-6%;top:-6%;transform:scaleX(-1)}.mp-gc.bl{left:-6%;bottom:-6%;transform:scaleY(-1)}.mp-gc.br{right:-6%;bottom:-6%;transform:scale(-1,-1)}
.mp-light{position:absolute;left:50%;translate:-50% 0;width:46%;height:5%;top:-9%;background:linear-gradient(#C9A35A,#6E4E1C);border-radius:40% 40% 10px 10px;box-shadow:0 2px 6px rgba(0,0,0,.6);z-index:3}
.mp-cone{position:absolute;left:50%;translate:-50% 0;top:-5%;width:140%;height:80%;background:radial-gradient(50% 60% at 50% 0%,rgba(255,226,170,.38),transparent 70%);pointer-events:none;z-index:4;mix-blend-mode:screen}
.mp-plaque{display:inline-flex;flex-direction:column;align-items:center;padding:.7em 1.6em;background:linear-gradient(180deg,#E9CF8C,#B98E45 55%,#8A6428);color:#3a2610;box-shadow:inset 0 1px 0 rgba(255,250,220,.7),0 6px 12px rgba(0,0,0,.5);border-radius:3px;text-shadow:0 1px 0 rgba(255,240,200,.6)}
.mp-cord{position:absolute;left:50%;top:-30%;width:40%;height:32%;translate:-50% 0;border:1.5px solid rgba(201,163,90,.6);border-bottom:0;border-radius:50% 50% 0 0/100% 100% 0 0;clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}

.mp-open{position:absolute;inset:0;display:grid;place-items:center;cursor:pointer;overflow:hidden}
.mp-open-in{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(24px,5vh,46px)}
.mp-open-fr{position:relative;width:min(56vw,300px,40vh)}
.mp-drape{position:absolute;left:-14%;right:-14%;top:-12%;bottom:-10%;z-index:6;background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 18%,transparent 80%,rgba(0,0,0,.4)),repeating-linear-gradient(90deg,#4a0b14 0,#7d1626 3%,#9a2232 4.5%,#6a1220 6.5%,#4a0b14 9%);border-radius:6px 6px 40% 40%/6px 6px 8% 8%;box-shadow:0 30px 50px rgba(0,0,0,.6);transform-origin:50% 0}
.mp-drape::after{content:"";position:absolute;left:4%;right:4%;bottom:-4%;height:7%;background:repeating-linear-gradient(90deg,#E8C878 0 3px,#8A6428 3px 6px);-webkit-mask:linear-gradient(#000,transparent);mask:linear-gradient(#000,transparent);border-radius:0 0 50% 50%}
.mp-open-t{font-family:var(--g-script);color:var(--g-accent);font-size:clamp(30px,5vw,52px);margin:0}
.mp-open .gk-tap{color:var(--g-muted);margin-top:5vh}

.mp-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1fr;align-items:center;justify-items:center;gap:clamp(30px,5cqi,80px);padding:clamp(70px,10cqi,130px) 6cqi clamp(50px,7cqi,100px);overflow:hidden}
.is-compact .mp-hero{min-height:133cqi}
.mp-hero-fr{position:relative;width:clamp(230px,min(32cqi,52svh),440px)}
.mp-hero-txt{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:560px}
.mp-head{font-family:var(--g-display);font-style:italic;font-weight:400;font-size:calc(clamp(40px,5.6cqi,84px) * var(--k,1));line-height:1.05;margin:0;color:var(--g-ink)}
.mp-line{font-family:var(--g-body);font-style:italic;color:var(--g-muted);font-size:clamp(17px,1.9cqi,22px);margin:1.2em 0 .5em}
.mp-name{font-family:var(--g-script);font-size:calc(clamp(36px,5cqi,70px) * var(--k,1));margin:0;line-height:1.15}
.mp-plq-name{font-family:var(--g-display);font-size:clamp(15px,1.5cqi,19px);letter-spacing:.24em;text-transform:uppercase}
.mp-plq-sub{font-family:var(--g-body);font-style:italic;font-size:clamp(12px,1.1cqi,14px);margin-top:2px}
@container (min-width:860px){.mp-hero{grid-template-columns:1fr 1fr;padding-left:8cqi;padding-right:8cqi}.mp-hero-txt{align-items:flex-start;text-align:left}}

.mp .gk-kicker{color:var(--g-gold)}
.mp .gk-title{font-style:italic}
.mp .gk-wish{color:var(--g-ink)}
.mp-rule{width:clamp(170px,22cqi,250px);display:block;margin:0 auto}
.mp-letter{position:relative;max-width:680px;margin:0 auto;padding:clamp(56px,8cqi,90px) clamp(28px,8cqi,90px);background:#F4EBDD;color:#3A2A24;text-align:center;box-shadow:0 40px 70px -30px rgba(0,0,0,.8);rotate:-.5deg}
.mp-letter::before{content:"";position:absolute;inset:12px;border:1px solid rgba(160,116,40,.45);pointer-events:none}
.mp-letter .gk-kicker{color:#A07428}
.mp-letter .gk-title{color:#5A2A2E}
.mp-msg{font-size:clamp(19px,2.2cqi,23px);line-height:1.8}
.mp-sign{font-family:var(--g-script);color:#8A3B42;font-size:clamp(32px,4.4cqi,52px);display:block;margin-top:.5em}
.mp-photo{padding:6%;background:${GILT};box-shadow:inset 0 0 0 2px rgba(255,240,200,.5),inset 0 0 14px rgba(60,30,0,.6),0 30px 50px -20px rgba(0,0,0,.7);overflow:visible}
.mp-photo img{filter:sepia(.3) contrast(1.05);box-shadow:inset 0 0 0 1px #000}
.mp .gk-event{background:rgba(0,0,0,.25)}
.mp .gk-btn{color:var(--g-gold)}
.mp .gk-btn:hover{background:var(--g-gold);color:#2E1A1C;border-color:var(--g-gold)}
`;
