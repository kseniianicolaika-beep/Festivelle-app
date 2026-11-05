import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#F8F2E8",
  "--g-ink": "#3A2A24",
  "--g-muted": "#8C7769",
  "--g-accent": "#A64459",
  "--g-gold": "#C29A62",
  "--g-line": "rgba(166,68,89,.2)",
  "--g-panel": "#FFFCF6",
  "--g-display": "var(--gf-garamond), var(--gf-amita), var(--font-deva), Georgia, serif",
  "--g-script": "var(--gf-vibes), var(--gf-amita), var(--font-deva), cursive",
  "--g-body": "var(--gf-garamond), var(--font-deva), Georgia, serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Thinking of you", ru: "Думаю о тебе", hi: "ढेर सारा प्यार" },
  message: {
    en: "Some people make the whole world feel softer, and you have always been one of them. Thank you for every story, every cup of tea and every quiet word that came exactly when I needed it. I carry them with me everywhere.",
    ru: "Есть люди, рядом с которыми весь мир становится мягче, — и ты всегда была одной из них. Спасибо за каждую историю, каждую чашку чая и каждое тихое слово, сказанное именно тогда, когда оно было нужно.",
    hi: "कुछ लोग पूरी दुनिया को कोमल बना देते हैं, और आप हमेशा उनमें से एक रहे हैं। हर कहानी, हर चाय के प्याले और हर उस शब्द के लिए धन्यवाद जो ठीक समय पर मिला।",
  },
  signoff: { en: "With all my love", ru: "С любовью, всегда", hi: "ढेर सारे प्यार के साथ" },
};

export const CSS = `
.ll{--grain:.42}
.ll-open{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;cursor:pointer;color:#5a4336}
.ll-open-petals{position:absolute;inset:0;width:100%;height:100%;opacity:.9}
.ll-stage{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(26px,5vh,48px);perspective:1800px}
.ll-env{position:relative;width:min(84vw,600px);aspect-ratio:1.45;animation:ll-float 6s ease-in-out infinite}
@keyframes ll-float{0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(-8px) rotate(-.6deg)}}
.ll-env-body{position:absolute;inset:0;transform-style:preserve-3d}
.ll-env-back{position:absolute;inset:0;border-radius:3px;background:radial-gradient(circle at 20% 30%,#f7e3dc 0 1.2px,transparent 1.6px) 0 0/14px 14px,linear-gradient(#EBC9C2,#E3B9B2);box-shadow:0 50px 90px -40px rgba(60,30,20,.6),0 8px 22px -12px rgba(60,30,20,.35)}
.ll-sheet{position:absolute;left:5%;right:5%;top:5%;height:90%;z-index:2;background:#FFFCF6;display:flex;flex-direction:column;align-items:center;padding-top:9%}
.ll-sheet-line{font-family:var(--g-script);color:var(--g-accent);font-size:clamp(26px,6vw,46px)}
.ll-sheet-sprig{width:44%;margin-top:2%}
.ll-pocket{position:absolute;inset:0;width:100%;height:100%;z-index:3;filter:drop-shadow(0 -1px 0 rgba(255,255,255,.6))}
.ll-to{position:absolute;right:9%;bottom:8%;z-index:5;margin:0;font-family:var(--g-script);font-size:clamp(24px,5.4vw,42px);color:#6b3b3f;transform:rotate(-4deg)}
.ll-to span{font-family:var(--g-body);font-style:italic;font-size:.42em;letter-spacing:.06em;color:#9b7f6e;margin-right:.3em}
.ll-flap{position:absolute;left:0;right:0;top:0;height:60%;z-index:4;transform-origin:50% 0;transform-style:preserve-3d}
.ll-flap-front,.ll-flap-in{position:absolute;inset:0;backface-visibility:hidden;clip-path:polygon(0 0,100% 0,52% 97%,50% 100%,48% 97%)}
.ll-flap-front{background:linear-gradient(180deg,#F7F0E5 0%,#EFE4D3 100%);filter:drop-shadow(0 6px 6px rgba(0,0,0,.15))}
.ll-flap-in{transform:rotateX(180deg);background:radial-gradient(circle at 20% 30%,#f7e3dc 0 1.2px,transparent 1.6px) 0 0/14px 14px,linear-gradient(#E3B9B2,#EBC9C2)}
.ll-band{position:absolute;left:-2.5%;right:-2.5%;top:71%;height:7.5%;z-index:7;box-shadow:0 3px 6px rgba(90,40,40,.18);border-radius:2px}
.ll-bow{position:absolute;left:12%;top:58%;width:30%;z-index:8}
.ll-seal{position:absolute;left:50%;top:60%;width:17%;z-index:8;translate:-50% -50%}
.ll-tap{color:#7d5d4e}

.ll-hero{position:relative;min-height:100svh;display:grid;place-items:center;overflow:hidden;padding:12cqi 6cqi}
.is-compact .ll-hero{min-height:132cqi}
.ll-cw{position:absolute;width:clamp(300px,44cqi,620px);pointer-events:none;z-index:1}
.ll-cw-a{left:-4cqi;top:-4cqi}
.ll-cw-b{right:-4cqi;bottom:-4cqi;transform:rotate(180deg)}
.ll-corner{display:block;width:100%;transform-origin:0 0}
.ll-hero-in{position:relative;z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center;max-width:92cqi}
.ll-hero-name{font-family:var(--g-script);font-weight:400;color:var(--g-accent);font-size:calc(clamp(64px,15cqi,210px) * var(--k,1));line-height:1.05;margin:.12em 0 0;padding:0 .2em}
.ll-flourish{width:clamp(220px,36cqi,520px);margin-top:-.4em}
.ll-hero-head{font-family:var(--g-display);font-style:italic;font-size:clamp(26px,4.6cqi,60px);margin:.35em 0 0;color:var(--g-ink)}
.ll-hero-cue{position:absolute;bottom:28px;left:50%;translate:-50% 0;z-index:2}
.ll-orn{width:clamp(150px,22cqi,260px);margin:0 auto;display:block}

.ll-letter-wrap{position:relative;max-width:760px;margin:0 auto}
.ll-sheet-shadow{filter:drop-shadow(0 30px 40px rgba(80,45,30,.18)) drop-shadow(0 2px 3px rgba(80,45,30,.12));rotate:-.6deg}
.ll-letter{position:relative;background:linear-gradient(90deg,rgba(150,120,90,.05) 1px,transparent 1px) 0 0/26px 100%,#FFFCF6;padding:clamp(36px,8cqi,92px) clamp(26px,8cqi,96px) clamp(40px,7cqi,80px)}
.ll-dear{font-family:var(--g-script);color:var(--g-accent);font-size:clamp(40px,6cqi,72px);margin:.4em 0 .2em;line-height:1.1}
.ll-msg{font-style:italic;font-size:clamp(19px,2.3cqi,24px);line-height:1.85;color:#45332b}
.ll-sign{margin-top:1.1em;text-align:right}
.ll-letter-sprig{width:150px;margin:24px auto 0;display:block;opacity:.9}
.ll-pinned{position:absolute;z-index:3;margin:0;right:-7%;top:-90px;width:clamp(150px,24cqi,230px);padding:10px 10px 30px;background:#fff;rotate:5deg;box-shadow:0 18px 30px -12px rgba(60,30,20,.35)}
.ll-pinned img{width:100%;aspect-ratio:4/5;object-fit:cover;filter:sepia(.18) saturate(.9)}
.ll-tape{position:absolute;top:-12px;left:50%;width:70%;height:24px;translate:-50% 0;rotate:4deg;opacity:.92}
@container (max-width:720px){.ll-pinned{position:relative;left:auto;top:auto;margin:0 auto -40px;display:block;width:min(56cqi,240px)}}
.ll-photo{background:#fff;padding:12px 12px 14px;box-shadow:0 22px 40px -22px rgba(60,30,20,.4);overflow:visible}
.ll-photo img{filter:sepia(.12)}
.ll-corner-tab{position:absolute;width:34px;height:34px;background:linear-gradient(135deg,var(--g-accent) 50%,transparent 50%);opacity:.75}
.ll-corner-tab.l{left:4px;top:4px}
.ll-corner-tab.r{right:4px;bottom:4px;rotate:180deg}
.ll .gk-sec-invitation{padding-top:clamp(40px,8cqi,110px)}
.ll .gk-btn{color:var(--g-accent)}
`;
