import type { GreetDefaults } from "../_shared/kit";

export const VARS = {
  "--g-bg": "#FFF4E0",
  "--g-ink": "#3A140C",
  "--g-muted": "#8A5A44",
  "--g-accent": "#D4372C",
  "--g-gold": "#F2B33A",
  "--g-line": "rgba(212,55,44,.25)",
  "--g-panel": "#FFFBF2",
  "--g-display": "var(--gf-ruslan), var(--gf-kurale), var(--font-deva), Georgia, serif",
  "--g-script": "var(--font-script), var(--gf-kurale), var(--font-deva), cursive",
  "--g-body": "var(--gf-kurale), var(--font-deva), Georgia, serif",
};

export const DEFAULTS: GreetDefaults = {
  headline: { en: "Happy Maslenitsa!", ru: "Широкая Масленица!", hi: "मास्लेनित्सा मुबारक!" },
  message: {
    en: "Winter is packing its bags! Here's to golden blini piled high, honey and smetana, sledges and songs, and the first warm sun on your face. May your year be as round, rich and generous as a Maslenitsa table.",
    ru: "Зима собирает чемоданы! Пусть блины будут горой и золотыми, мёд и сметана — рекой, а первое весеннее солнце согреет тебя. Пусть год будет таким же круглым, сытным и щедрым, как масленичный стол.",
    hi: "सर्दी विदा हो रही है! सुनहरे ब्लिनी के ढेर, शहद और मलाई, गीत और हँसी, और चेहरे पर बसंत की पहली धूप — आपका साल मास्लेनित्सा की दावत जितना भरपूर और मीठा हो।",
  },
  signoff: { en: "With a warm spring hug", ru: "Обнимаю по-весеннему", hi: "बसंत की गर्माहट के साथ" },
};

export const CSS = `
.ms{--grain:.3}
.ms-rays{animation:gc-spin 60s linear infinite;transform-origin:0 0}
.ms-rib{animation:ms-flutter 4s ease-in-out infinite;transform-box:view-box}
@keyframes ms-flutter{0%,100%{transform:skewX(0) rotate(0)}50%{transform:skewX(6deg) rotate(-1.5deg)}}

.ms-open{position:absolute;inset:0;display:grid;place-items:center;cursor:pointer;overflow:hidden;background:radial-gradient(60% 50% at 50% 50%,#FFF8EA,#FBE5C0 80%)}
.ms-open-band{position:absolute;left:0;right:0;height:clamp(54px,8vh,80px);width:100%}
.ms-open-band.t{top:0}.ms-open-band.b{bottom:0}
.ms-open-in{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(14px,3vh,26px)}
.ms-open-title{font-family:var(--g-display);color:var(--g-accent);font-size:clamp(34px,7vw,72px);margin:0;text-align:center;line-height:1.05}
.ms-stack{position:relative;width:min(64vw,340px)}
.ms-stack>svg{width:100%;display:block}
.ms-fly{position:absolute;left:50%;top:44%;width:66%;translate:-50% -50%;opacity:0;pointer-events:none}
.ms-sunfly{position:absolute;left:50%;top:44%;width:100%;translate:-50% -50%;opacity:0;pointer-events:none}
.ms-open .gk-tap{color:var(--g-muted)}

.ms-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;align-items:center;overflow:hidden;background:linear-gradient(180deg,#CFE6F5 0%,#F3F0E2 42%,#FFF4E0 70%)}
.is-compact .ms-hero{min-height:133cqi}
.ms-ribbons{position:absolute;inset:0 0 auto 0;height:clamp(180px,30cqi,380px);width:100%;z-index:1;opacity:.95}
.ms-sun{position:relative;z-index:2;width:clamp(180px,min(30cqi,34svh),420px);margin-top:clamp(30px,5cqi,70px)}
.is-compact .ms-sun{width:36cqi}
.ms-hero-in{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 6cqi;margin-top:clamp(-30px,-2cqi,-10px)}
.ms-head{font-family:var(--g-display);font-weight:400;color:var(--g-accent);font-size:calc(clamp(40px,7.4cqi,110px) * var(--k,1));line-height:1.05;margin:0;text-shadow:3px 3px 0 #F2B33A;text-wrap:balance}
.ms-line{font-family:var(--g-body);font-size:clamp(16px,1.9cqi,22px);color:var(--g-muted);margin:.8em 0 0}
.ms-name{font-family:var(--g-script);color:var(--g-ink);font-size:calc(clamp(40px,6.4cqi,92px) * var(--k,1));margin:0;line-height:1.15}
.ms-table{position:relative;z-index:3;margin-top:auto;width:100%;display:flex;flex-direction:column;align-items:center}
.ms-table-blini{width:clamp(180px,min(22cqi,26svh),300px);margin-bottom:-8px;cursor:pointer;background:none;border:0;padding:0;position:relative;z-index:2}
.ms-table-blini svg{width:100%;display:block}
.ms-count{position:absolute;bottom:22%;right:-4%;background:var(--g-accent);color:#fff;font-family:var(--g-body);font-size:13px;border-radius:999px;padding:4px 10px;rotate:8deg;box-shadow:0 4px 0 #8E1B14}
.ms-band{width:100%;height:clamp(60px,8cqi,96px);display:block}
.ms-hint{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--g-muted);margin:6px 0 10px}

.ms .gk-kicker{color:var(--g-accent);font-family:var(--g-body)}
.ms .gk-title{color:var(--g-accent)}
.ms .gk-wish{font-family:var(--g-body);font-style:normal}
.ms-rule{width:clamp(180px,22cqi,260px);display:block;margin:0 auto}
.ms-letter{position:relative;max-width:700px;margin:0 auto;padding:clamp(80px,12cqi,120px) clamp(28px,8cqi,90px) clamp(50px,8cqi,90px);background:#FFFBF2;text-align:center;border-radius:6px;box-shadow:0 0 0 6px #D4372C,0 0 0 9px #FFF4E0,0 0 0 11px #3A140C,0 30px 60px -20px rgba(140,40,20,.35)}
.ms-letter-sun{position:absolute;left:50%;top:0;width:120px;translate:-50% -50%}
.ms-msg{font-size:clamp(18px,2.1cqi,22px);line-height:1.8}
.ms-sign{font-family:var(--g-script);color:var(--g-accent);font-size:clamp(32px,4.4cqi,52px);display:block;margin-top:.5em}
.ms-photo{background:#fff;padding:10px;box-shadow:0 0 0 4px #D4372C,0 18px 30px -12px rgba(0,0,0,.3);border-radius:4px;overflow:visible}
.ms .gk-event{background:#FFFBF2;border:2px solid var(--g-accent)}
.ms .gk-btn{color:var(--g-accent);border-color:var(--g-accent)}
.ms .gk-btn:hover{background:var(--g-accent);color:#fff}
`;
