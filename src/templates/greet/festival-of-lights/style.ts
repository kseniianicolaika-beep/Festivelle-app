import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#1C0D28",
  "--g-ink": "#FBEBCB",
  "--g-muted": "#D2B9D6",
  "--g-accent": "#F6AE3A",
  "--g-gold": "#E6B556",
  "--g-pink": "#F05A92",
  "--g-line": "rgba(230,181,86,.3)",
  "--g-panel": "#241133",
  "--g-display": "var(--font-rozha), var(--font-playfair), Georgia, serif",
  "--g-script": "var(--gf-vibes), var(--gf-amita), var(--font-deva), cursive",
  "--g-body": "var(--font-cormorant), var(--font-deva), Georgia, serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Happy Diwali", ru: "Счастливого Дивали", hi: "शुभ दीपावली" },
  message: {
    en: "May every diya you light tonight bring a little more warmth into your home, and may Lakshmi walk in through an open door. Wishing you sweets that never run out, laughter that fills every room and a year as bright as tonight's sky.",
    ru: "Пусть каждая дия, зажжённая этой ночью, принесёт в ваш дом ещё немного тепла, а Лакшми войдёт в открытую дверь. Желаем сладостей, которые никогда не кончаются, смеха в каждой комнате и года, светлого, как сегодняшнее небо.",
    hi: "इस दीपावली हर दीया आपके घर में और उजाला लाए, और माँ लक्ष्मी आपके द्वार पधारें। मिठास कभी कम न हो, हर कमरा हँसी से भरा रहे और आने वाला साल आज की रात जितना रोशन हो।",
  },
  signoff: { en: "With light and love", ru: "Со светом и любовью", hi: "प्रकाश और प्रेम सहित" },
};

export const GOLDTEXT = `background:linear-gradient(180deg,#FFF2C6 0%,#F6C35A 45%,#D18B25 75%,#FFE09A 100%);-webkit-background-clip:text;background-clip:text;color:transparent`;

export const CSS = `
.fl{--grain:.16}
.fl.gk-grain::after,.fl.gc-grain::after{mix-blend-mode:screen;opacity:.06}
.fl-flame{transform-box:fill-box;transform-origin:50% 100%;animation:fl-flick 1.3s ease-in-out infinite}
.fl-glow{animation:fl-breathe 3s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
@keyframes fl-flick{0%,100%{transform:scale(1,1) skewX(0)}30%{transform:scale(.94,1.08) skewX(-3deg)}60%{transform:scale(1.04,.95) skewX(2deg)}}
@keyframes fl-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
.fl-gold{${GOLDTEXT}}
.fl-deva{font-family:var(--gf-amita),var(--font-deva),serif}

.fl-open{position:absolute;inset:0;display:grid;place-items:center;cursor:pointer;overflow:hidden;background:radial-gradient(60% 50% at 50% 55%,#3a1a4a 0%,#1a0b24 60%,#0b0410 100%);color:var(--g-ink)}
.fl-open-stage{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(18px,3vh,30px)}
.fl-open-deva{font-size:clamp(28px,6vw,52px);margin:0;color:var(--g-accent)}
.fl-ring{position:relative;width:min(74vmin,500px);aspect-ratio:1}
.fl-ring .fl-rangoli{position:absolute;inset:14%;width:72%;height:72%}
.fl-open .fl-rc{opacity:0}
.fl-od{position:absolute;width:19%;translate:-50% -60%}
.fl-open .fl-od .fl-flame,.fl-open .fl-od .fl-glow,.fl-open-center .fl-flame,.fl-open-center .fl-glow{opacity:0}
.fl-open-center{position:absolute;left:50%;top:50%;width:26%;translate:-50% -58%}

.fl-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;align-items:center;overflow:hidden;background:radial-gradient(70% 45% at 50% 100%,rgba(255,150,60,.32),transparent 70%),radial-gradient(120% 80% at 50% 0%,#2c1440 0%,#1C0D28 60%)}
.is-compact .fl-hero{min-height:133cqi}
.fl-toran{position:absolute;top:0;left:-2%;width:104%;z-index:4;filter:drop-shadow(0 8px 10px rgba(0,0,0,.4))}

.fl-archbox{position:absolute;left:50%;translate:-50% 0;top:clamp(70px,11cqi,150px);bottom:0;width:min(88cqi,780px);z-index:1}
.fl-archbox svg{width:100%;height:100%}
.fl-hero-in{position:relative;z-index:3;margin:auto 0;padding:clamp(150px,26cqi,300px) 8cqi clamp(170px,24cqi,280px);text-align:center;display:flex;flex-direction:column;align-items:center}
.fl-orn{font-size:clamp(22px,3.6cqi,44px);color:var(--g-accent);margin:0 0 .2em}
.fl-head{font-family:var(--g-display);font-weight:400;font-size:calc(clamp(56px,11cqi,150px) * var(--k,1));line-height:1.02;margin:0;padding:.05em .1em;text-shadow:0 0 40px rgba(255,170,60,.25)}
.fl-line{font-family:var(--g-body);font-style:italic;font-size:clamp(17px,2cqi,24px);color:var(--g-muted);margin:.9em 0 0}
.fl-name{font-family:var(--g-script);color:var(--g-pink);font-size:calc(clamp(36px,6.4cqi,84px) * var(--k,1));line-height:1.2;margin:.1em 0 0}
.fl-ground{position:absolute;left:0;right:0;bottom:0;height:clamp(150px,22cqi,280px);z-index:2}
.fl-ground .fl-rangoli{position:absolute;left:50%;bottom:0;width:clamp(320px,46cqi,620px);translate:-50% 52%;opacity:.95}
.fl-diyas{position:absolute;left:0;right:0;bottom:clamp(8px,2cqi,24px);display:flex;justify-content:center;gap:clamp(4px,3.2cqi,46px);z-index:3}
.fl-diyas svg{width:clamp(54px,7.4cqi,104px)}
.fl-diyas svg:nth-child(odd){translate:0 -10%}

.fl .gk-kicker{color:var(--g-accent)}
.fl .gk-title{${GOLDTEXT}}
.fl .gk-wish{font-family:var(--g-body);font-weight:300}
.fl-rule{width:clamp(180px,22cqi,260px);display:block;margin:0 auto}
.fl-letter{position:relative;max-width:700px;margin:0 auto;padding:clamp(110px,16cqi,170px) clamp(26px,7cqi,84px) clamp(48px,7cqi,80px);text-align:center;background:linear-gradient(#2a1438,#1f0e2b)}
.fl-letter-arch{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.fl-letter .fl-diya-top{width:84px;display:block;margin:0 auto 6px}
.fl-msg{font-size:clamp(19px,2.3cqi,24px);line-height:1.8;color:#F3E2C4}
.fl-sign{font-family:var(--g-script);color:var(--g-pink);font-size:clamp(28px,4cqi,46px);margin-top:.8em;display:block}
.fl-photo{overflow:hidden;border-radius:999px 999px 6px 6px;border:2px solid var(--g-gold);padding:6px;background:#2a1438}
.fl-photo img{border-radius:999px 999px 2px 2px}
.fl .gk-event{background:#241133}
.fl .gk-btn{color:var(--g-accent)}
.fl .gk-btn:hover{background:var(--g-accent);color:#1C0D28}
.fl-light{display:flex;justify-content:center;gap:clamp(6px,2cqi,22px);margin:26px 0 8px}
.fl-light button{background:none;border:0;padding:0;cursor:pointer;width:clamp(58px,8cqi,92px);transition:transform .3s}
.fl-light button:hover{transform:translateY(-4px)}
.fl-light-n{font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--g-muted)}
`;
