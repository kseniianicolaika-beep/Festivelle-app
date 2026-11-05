import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#0A2723",
  "--g-ink": "#F3E9D2",
  "--g-muted": "#B9C2A8",
  "--g-accent": "#E3C46A",
  "--g-gold": "#D4AF37",
  "--g-line": "rgba(212,175,55,.3)",
  "--g-panel": "#0F332D",
  "--g-display": "var(--font-playfair), var(--font-deva), Georgia, serif",
  "--g-script": "var(--gf-vibes), var(--gf-amita), var(--font-deva), cursive",
  "--g-body": "var(--font-cormorant), var(--font-deva), Georgia, serif",
  "--g-arabic": "var(--gf-ruqaa), var(--gf-amiri), serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Eid Mubarak", ru: "Ид Мубарак", hi: "ईद मुबारक" },
  message: {
    en: "As the new moon rises, I'm sending you every wish for peace in your heart, light in your home and a table full of the people you love. May your prayers be answered, your sheer khurma be sweet and the year ahead be gentle and generous.",
    ru: "С восходом молодой луны желаю мира в сердце, света в доме и стола, полного любимых людей. Пусть молитвы будут услышаны, угощения — сладкими, а год впереди — добрым и щедрым.",
    hi: "नए चाँद के साथ आपके दिल में सुकून, घर में रौशनी और अपनों से भरे दस्तरख़्वान की दुआ। आपकी हर दुआ क़बूल हो, सेवइयाँ मीठी हों और आने वाला साल मेहरबान हो।",
  },
  signoff: { en: "With duas and love", ru: "С молитвой и любовью", hi: "दुआओं और प्यार के साथ" },
};

export const GOLD = `background:linear-gradient(180deg,#FFF4CC 0%,#E9C766 45%,#B48A2C 80%,#F5DC92 100%);-webkit-background-clip:text;background-clip:text;color:transparent`;

export const CSS = `
.em{--grain:.14}
.em.gk-grain::after,.em.gc-grain::after{mix-blend-mode:screen;opacity:.05}
.em-gold{${GOLD}}
.em-ar{font-family:var(--g-arabic);font-weight:700;line-height:1.3;direction:rtl}
.em-halo{animation:em-pulse 5s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
.em-lglow{animation:em-pulse 3.4s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
@keyframes em-pulse{0%,100%{opacity:.75;transform:scale(1)}50%{opacity:1;transform:scale(1.07)}}
.em-sway{transform-origin:50% 0;animation:gc-sway 5s ease-in-out infinite}
.em-stars{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.em-stars circle{animation:gc-twinkle 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}

.em-open{position:absolute;inset:0;cursor:pointer;perspective:2200px;overflow:hidden}
.em-leaf{position:absolute;top:0;bottom:0;width:50.2%;transform-style:preserve-3d;box-shadow:0 0 60px rgba(0,0,0,.6)}
.em-leaf svg{width:100%;height:100%;display:block}
.em-leaf.l{left:0;transform-origin:0 50%}
.em-leaf.r{right:0;transform-origin:100% 50%}
.em-open-mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;pointer-events:none;text-align:center}
.em-open-ar{font-size:clamp(64px,13vw,150px);margin:0;filter:drop-shadow(0 0 22px rgba(233,199,102,.45))}
.em-open-to{font-family:var(--g-script);color:var(--g-ink);font-size:clamp(26px,4vw,40px);margin:0;text-shadow:0 2px 12px #000}
.em-open .gk-tap{color:var(--g-accent)}
.em-medal{position:absolute;left:50%;top:50%;width:min(64vw,420px);aspect-ratio:1;translate:-50% -50%;border-radius:50%;background:radial-gradient(closest-side,#0A2723 0%,#0A2723 82%,transparent 84%);box-shadow:0 0 0 1px rgba(212,175,55,.6),0 0 0 10px #0A2723,0 0 0 11px rgba(212,175,55,.35),0 0 80px rgba(0,0,0,.7)}

.em-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(60% 40% at 72% 18%,rgba(233,199,102,.12),transparent 70%),linear-gradient(180deg,#051613 0%,#0A2723 55%,#113A32 100%)}
.is-compact .em-hero{min-height:133cqi}
.em-moon{position:absolute;right:8cqi;top:7cqi;width:clamp(120px,19cqi,280px);z-index:1}
.em-lanterns{position:absolute;inset:0 0 auto 0;height:60%;z-index:2;pointer-events:none}
.em-lan{position:absolute;top:0;display:flex;flex-direction:column;align-items:center}
.em-lan i{display:block;width:1.5px;background:linear-gradient(#8A6A22,#E9C766)}
.em-lan svg{width:clamp(44px,6.4cqi,96px)}
.em-sky{position:absolute;left:0;right:0;bottom:0;height:clamp(150px,30cqi,420px);z-index:1}
.em-sky svg{width:100%;height:100%}
.em-hero-in{position:relative;z-index:3;text-align:center;display:flex;flex-direction:column;align-items:center;padding:16cqi 8cqi 26cqi}
.em-ar-h{font-size:clamp(70px,14cqi,200px);margin:0;filter:drop-shadow(0 0 30px rgba(233,199,102,.3))}
.em-head{font-family:var(--g-display);font-weight:400;text-transform:uppercase;letter-spacing:.34em;font-size:calc(clamp(18px,2.6cqi,36px) * var(--k,1));margin:.3em 0 0;padding-left:.34em;color:var(--g-ink)}
.em-line{font-family:var(--g-body);font-style:italic;font-size:clamp(17px,2cqi,24px);color:var(--g-muted);margin:1.4em 0 0}
.em-name{font-family:var(--g-script);color:var(--g-accent);font-size:calc(clamp(44px,7.4cqi,104px) * var(--k,1));line-height:1.2;margin:0}

.em .gk-kicker{color:var(--g-accent)}
.em .gk-title{${GOLD}}
.em .gk-wish{font-family:var(--g-body);font-weight:300}
.em-rule{width:clamp(180px,22cqi,260px);display:block;margin:0 auto}
.em-letter{position:relative;max-width:680px;margin:0 auto;padding:clamp(130px,20cqi,210px) clamp(30px,8cqi,90px) clamp(56px,8cqi,90px);text-align:center}
.em-letter>svg.em-arch{position:absolute;inset:0;width:100%;height:100%;z-index:-1;overflow:visible}
.em-msg{font-size:clamp(19px,2.3cqi,24px);line-height:1.8;color:#EDE3CB}
.em-sign{font-family:var(--g-script);color:var(--g-accent);font-size:clamp(32px,4.4cqi,52px);margin-top:.6em;display:block}
.em-photo{border-radius:999px 999px 4px 4px;border:1.5px solid var(--g-gold);padding:6px;overflow:hidden;background:#0F332D}
.em-photo img{border-radius:999px 999px 2px 2px}
.em .gk-event{background:#0F332D}
.em .gk-btn{color:var(--g-accent)}
.em .gk-btn:hover{background:var(--g-accent);color:#0A2723}
`;
