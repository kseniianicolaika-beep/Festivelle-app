import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#0E0C0B",
  "--g-ink": "#F3E7D3",
  "--g-muted": "#B3A389",
  "--g-accent": "#E4C68C",
  "--g-gold": "#C9A15A",
  "--g-line": "rgba(228,198,140,.28)",
  "--g-panel": "#15110E",
  "--g-display": "var(--font-playfair), var(--font-deva), Georgia, serif",
  "--g-script": "var(--font-playfair), var(--font-deva), Georgia, serif",
  "--g-body": "var(--font-cormorant), var(--font-deva), Georgia, serif",
  "--g-deco": "var(--gf-poiret), var(--font-forum), var(--font-deva), sans-serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Many happy returns", ru: "С днём рождения", hi: "जन्मदिन मुबारक" },
  message: {
    en: "Here's to another year of you — the laugh that fills a room, the loyalty that never wavers and the plans that always end in a story. May this one be your most golden yet. Raise a glass: tonight is entirely yours.",
    ru: "За ещё один год тебя — за смех, который наполняет комнату, за верность, которая не подводит, и за планы, которые всегда превращаются в истории. Пусть этот год будет самым золотым. Поднимем бокалы — сегодня всё для тебя.",
    hi: "आपके एक और शानदार साल के नाम — वह हँसी जो कमरा भर देती है, वह साथ जो कभी नहीं डगमगाता। यह साल आपका सबसे सुनहरा हो। आज की शाम पूरी तरह आपकी है।",
  },
  signoff: { en: "Cheers to you", ru: "За тебя!", hi: "आपके नाम एक जाम" },
};

export const FOIL = `background:linear-gradient(100deg,#8A6630 0%,#F4DEA2 20%,#B98B3E 38%,#FFF1C9 50%,#A37A36 64%,#E9CD8A 82%,#8A6630 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent`;

export const CSS = `
.mhr{--grain:.18}
.mhr.gk-grain::after,.mhr.gc-grain::after{mix-blend-mode:screen;opacity:.08}
.mhr-foil{${FOIL};animation:mhr-shine 9s ease-in-out infinite}
@keyframes mhr-shine{0%,100%{background-position:0% 0}50%{background-position:100% 0}}
.mhr-deco{font-family:var(--g-deco);text-transform:uppercase;letter-spacing:.32em}
.mhr-flame{transform-box:fill-box;transform-origin:50% 100%;animation:gc-flicker 1.4s ease-in-out infinite}

.mhr-open{position:absolute;inset:0;display:grid;place-items:center;cursor:pointer;background:radial-gradient(60% 50% at 50% 38%,#2a211a 0%,#120e0c 55%,#060505 100%);color:var(--g-accent);overflow:hidden;--r:0px;-webkit-mask:radial-gradient(circle at 50% 52%,transparent var(--r),#000 calc(var(--r) + 1px));mask:radial-gradient(circle at 50% 52%,transparent var(--r),#000 calc(var(--r) + 1px))}
.mhr-spot{position:absolute;left:50%;top:-10%;width:90vmin;height:120vmin;translate:-50% 0;background:radial-gradient(closest-side,rgba(255,226,170,.16),transparent);pointer-events:none}
.mhr-open-sun{position:absolute;bottom:0;left:50%;translate:-50% 0;width:max(120vw,900px);opacity:.35}
.mhr-stage{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(36px,6vh,64px);padding-top:6vh}
.mhr-box{position:relative;width:min(58vw,320px);aspect-ratio:1/.92}
.mhr-glow{position:absolute;left:50%;top:22%;width:160%;aspect-ratio:1;translate:-50% -50%;background:radial-gradient(closest-side,rgba(255,232,170,.95),rgba(255,196,90,.35) 45%,transparent);opacity:0;pointer-events:none}
.mhr-body{position:absolute;left:0;right:0;top:22%;bottom:0;background:linear-gradient(105deg,#050404 0%,#1d1815 30%,#0b0909 52%,#221b16 78%,#070606 100%);box-shadow:0 60px 80px -40px rgba(0,0,0,.9),inset 0 0 0 1px rgba(228,198,140,.25)}
.mhr-body::before{content:"";position:absolute;inset:8%;border:1px solid rgba(228,198,140,.18)}
.mhr-lid{position:absolute;left:-5%;right:-5%;top:6%;height:20%;background:linear-gradient(105deg,#0a0808 0%,#2a221d 34%,#0e0b0a 56%,#2d241e 80%,#0a0808 100%);box-shadow:0 14px 18px -10px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,240,210,.18),inset 0 0 0 1px rgba(228,198,140,.3);z-index:3}
.mhr-rib{position:absolute;background:linear-gradient(90deg,#8A6630,#F4DEA2 35%,#C99A4A 55%,#FFF1C9 70%,#A37A36);box-shadow:0 0 12px rgba(255,210,130,.25)}
.mhr-rib.v{left:50%;width:13%;translate:-50% 0;top:0;bottom:0}
.mhr-rib.h{top:46%;height:13%;left:0;right:0;background:linear-gradient(180deg,#8A6630,#F4DEA2 35%,#C99A4A 55%,#FFF1C9 70%,#A37A36)}
.mhr-bow{position:absolute;left:50%;top:-12%;width:62%;translate:-50% 0;z-index:5}
.mhr-tag{position:absolute;right:-24%;top:24%;z-index:6;width:38%;aspect-ratio:1.6;background:#F3E7D3;color:#3a2a1a;display:grid;place-items:center;rotate:9deg;clip-path:polygon(14% 0,100% 0,100% 100%,14% 100%,0 50%);font-family:var(--font-playfair),var(--font-deva),serif;font-style:italic;font-size:clamp(13px,2.6vw,18px);box-shadow:0 10px 18px rgba(0,0,0,.4);padding-left:10%;text-align:center;line-height:1.1}
.mhr-tag::before{content:"";position:absolute;left:7%;top:50%;width:6px;height:6px;border-radius:50%;background:#0e0c0b;translate:0 -50%}
.mhr-open-title{font-size:clamp(11px,1.5vw,13px)}

.mhr-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;padding:9cqi 6cqi 0;background:radial-gradient(70% 55% at 50% 100%,rgba(228,170,90,.18),transparent 70%),radial-gradient(90% 70% at 50% 0%,#211a15 0%,#0E0C0B 70%)}
.is-compact .mhr-hero{min-height:133cqi}
.mhr-frame{position:absolute;inset:clamp(14px,2.6cqi,36px);border:1px solid rgba(228,198,140,.32);pointer-events:none;z-index:2}
.mhr-frame::after{content:"";position:absolute;inset:8px;border:1px solid rgba(228,198,140,.14)}
.mhr-c{position:absolute;width:clamp(56px,9cqi,120px);z-index:3}
.mhr-c.tl{left:clamp(6px,1.4cqi,20px);top:clamp(6px,1.4cqi,20px)}
.mhr-c.tr{right:clamp(6px,1.4cqi,20px);top:clamp(6px,1.4cqi,20px);rotate:90deg}
.mhr-c.br{right:clamp(6px,1.4cqi,20px);bottom:clamp(6px,1.4cqi,20px);rotate:180deg}
.mhr-c.bl{left:clamp(6px,1.4cqi,20px);bottom:clamp(6px,1.4cqi,20px);rotate:270deg}
.mhr-hero-in{position:relative;z-index:4;margin:auto 0;text-align:center;display:flex;flex-direction:column;align-items:center}
.mhr-head{font-size:clamp(14px,2.2cqi,30px);color:var(--g-accent);margin:0}
.mhr-name{font-family:var(--g-display);font-style:italic;font-weight:400;line-height:1;margin:.18em 0 .1em;font-size:calc(clamp(72px,17cqi,240px) * var(--k,1));padding:0 .12em .08em}
.mhr-age{font-family:var(--g-deco);font-size:clamp(16px,2cqi,24px);letter-spacing:.4em;color:var(--g-muted)}
.mhr-line{font-family:var(--g-body);font-style:italic;font-size:clamp(18px,2.2cqi,26px);color:var(--g-muted);margin:.5em 0 0}
.mhr-ground{position:relative;z-index:3;width:100%;display:flex;justify-content:center;margin-top:auto;padding-top:5cqi}
.mhr-sun{position:absolute;bottom:0;left:50%;translate:-50% 0;width:max(min(110cqi,140svh),560px)}
.is-compact .mhr-sun{width:110cqi}
.mhr-cake{position:relative;width:clamp(150px,20cqi,270px);margin-bottom:-2px}
.mhr-cue{position:absolute;bottom:clamp(26px,4cqi,48px);right:clamp(32px,6cqi,80px);z-index:5;color:var(--g-muted)}

.mhr .gk-title{font-style:italic}
.mhr .gk-kicker{font-family:var(--g-deco);color:var(--g-accent)}
.mhr .gk-wish{font-family:var(--g-body);font-weight:300}
.mhr-fan{width:clamp(180px,24cqi,260px);margin:0 auto;display:block}
.mhr-letter{position:relative;max-width:720px;margin:0 auto;padding:clamp(48px,8cqi,96px) clamp(28px,7cqi,88px);background:linear-gradient(160deg,#1a1511,#100d0b);border:1px solid rgba(228,198,140,.35);text-align:center}
.mhr-letter::before{content:"";position:absolute;inset:10px;border:1px solid rgba(228,198,140,.15);pointer-events:none}
.mhr-letter .mhr-c{width:clamp(44px,7cqi,74px)}
.mhr-portrait{width:clamp(170px,26cqi,250px);aspect-ratio:3/4;margin:0 auto 34px;padding:7px;border:1px solid rgba(228,198,140,.55);border-radius:999px 999px 0 0;box-shadow:0 0 0 6px #120e0c,0 0 0 7px rgba(228,198,140,.25)}
.mhr-portrait img{width:100%;height:100%;object-fit:cover;border-radius:999px 999px 0 0;filter:grayscale(.15) contrast(1.05)}
.mhr-msg{font-size:clamp(19px,2.3cqi,24px);line-height:1.8;font-weight:300;color:#E9DCC6}
.mhr-sign{font-family:var(--g-display);font-style:italic;font-size:clamp(30px,4.4cqi,52px);margin-top:.8em}
.mhr-photo{padding:10px;border:1px solid rgba(228,198,140,.4);background:#130f0d;overflow:visible}
.mhr-photo img{filter:grayscale(.25) contrast(1.05)}
.mhr .gk-btn{color:var(--g-accent)}
.mhr .gk-btn:hover{background:var(--g-accent);color:#0E0C0B}
.mhr .gk-event{background:#14100e}
.mhr-coupes{width:clamp(120px,14cqi,170px);margin:0 auto 10px;display:block}
`;
