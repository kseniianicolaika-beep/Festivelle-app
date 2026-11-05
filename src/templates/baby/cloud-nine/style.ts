// Cloud Nine — scoped CSS (hoisted & de-duplicated by React via <style href precedence>).
export const CN_CSS = `
.cn{--cn-d:var(--f-display,var(--cn-display)),var(--font-deva),Georgia,serif;--cn-s:var(--f-body,var(--cn-sans)),var(--font-deva),system-ui,sans-serif;
  --cn-dusk:color-mix(in oklab,var(--t-accent) 62%,#4d5f8f);--cn-sky:color-mix(in oklab,var(--t-accent) 38%,#fff);--cn-blush:color-mix(in oklab,#f3d4dc 80%,var(--t-bg));
  --cn-foil:linear-gradient(100deg,#b88a55 0%,#f3dcac 28%,#c99a62 46%,#fff3d6 60%,#c4925a 80%,#ecd2a0 100%);
  color:var(--t-ink);font-family:var(--cn-s);}
.cn .d{font-family:var(--cn-d);font-weight:300;letter-spacing:-.01em}
.cn .i{font-style:italic}
.cn .lbl{font-family:var(--cn-s);text-transform:uppercase;letter-spacing:.32em;font-weight:400}
.cn .foil{background:var(--cn-foil);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.cn-site{background:var(--t-bg);container-type:inline-size;overflow-x:clip}
.cn-sky{background:radial-gradient(120% 70% at 50% 108%,var(--cn-blush) 0%,transparent 60%),linear-gradient(180deg,var(--cn-dusk) 0%,color-mix(in oklab,var(--cn-dusk) 40%,var(--cn-sky)) 38%,var(--cn-sky) 64%,var(--cn-blush) 100%)}
.cn-hero{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff}
.cn-hero .cn-names{text-shadow:0 2px 30px rgba(60,70,120,.25)}
.cn-sec{padding:clamp(64px,10cqw,124px) clamp(20px,6cqw,64px);text-align:center}
.cn-band{position:relative;background:linear-gradient(180deg,var(--t-bg),color-mix(in oklab,var(--cn-sky) 30%,var(--t-bg)) 30%,color-mix(in oklab,var(--cn-blush) 40%,var(--t-bg)) 75%,var(--t-bg))}
.cn-wrap{max-width:760px;margin:0 auto}
.cn-h{font-size:clamp(34px,7cqw,64px);line-height:1;margin-top:.35em}
.cn-p{font-family:var(--cn-d);font-size:clamp(19px,2.6cqw,25px);line-height:1.55;color:color-mix(in oklab,var(--t-ink) 82%,var(--t-bg))}
.cn-pillow{background:linear-gradient(180deg,#fff,color-mix(in oklab,var(--cn-sky) 30%,#fff));border-radius:999px;box-shadow:0 30px 60px -30px color-mix(in oklab,var(--t-accent) 70%,transparent),inset 0 -10px 30px color-mix(in oklab,var(--cn-sky) 40%,transparent)}
.cn-card{background:rgba(255,255,255,.72);backdrop-filter:blur(10px);border:1px solid color-mix(in oklab,var(--t-gold) 40%,transparent);border-radius:28px;box-shadow:0 40px 80px -50px rgba(60,80,130,.45)}
.cn-btn{display:inline-flex;align-items:center;gap:.6em;border-radius:999px;padding:.95em 1.7em;font-family:var(--cn-s);font-size:12px;letter-spacing:.28em;text-transform:uppercase;border:1px solid color-mix(in oklab,var(--t-gold) 70%,transparent);transition:background .3s,transform .3s}
.cn-btn:hover{background:color-mix(in oklab,var(--t-gold) 14%,transparent);transform:translateY(-1px)}
.cn-arch{border-radius:999px 999px 28px 28px;overflow:hidden}
.cn-float{animation:cnFloat 7s ease-in-out infinite alternate}
.cn-drift{animation:cnDrift 38s linear infinite alternate}
.cn-hang{transform-origin:50% 0;animation:cnDrop 1.8s cubic-bezier(.2,.9,.25,1.15) var(--dl,1.2s) both,cnSwing var(--sw,5s) ease-in-out calc(var(--dl,1.2s) + 1.8s) infinite alternate}
.cn-tw{animation:cnTw var(--tw,3s) ease-in-out infinite alternate}
@keyframes cnFloat{from{transform:translateY(-1.5%)}to{transform:translateY(1.5%)}}
@keyframes cnDrift{from{transform:translateX(-4%)}to{transform:translateX(4%)}}
@keyframes cnDrop{from{transform:translateY(-110%);opacity:0}}
@keyframes cnSwing{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}
@keyframes cnTw{from{opacity:.25;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
@keyframes cnPartL{from{transform:translateX(42%) scale(1.15)}}
@keyframes cnPartR{from{transform:translateX(-42%) scale(1.15)}}
@keyframes cnRise{from{transform:translateY(38%);opacity:0;filter:blur(6px)}}
@keyframes cnName{from{opacity:0;letter-spacing:.35em;filter:blur(14px)}}
@keyframes cnFade{from{opacity:0;transform:translateY(12px)}}
@keyframes cnSheen{from{background-position:120% 0}to{background-position:-20% 0}}
.cn-a-partl{animation:cnPartL 2.6s cubic-bezier(.6,0,.2,1) .2s both}
.cn-a-partr{animation:cnPartR 2.6s cubic-bezier(.6,0,.2,1) .2s both}
.cn-a-rise{animation:cnRise 2.4s cubic-bezier(.2,.8,.2,1) .7s both}
.cn-a-name{animation:cnName 2s cubic-bezier(.2,.7,.2,1) var(--dl,1.7s) both}
.cn-a-fade{animation:cnFade 1.4s ease var(--dl,2.4s) both}
.cn .foil.cn-a-sheen{animation:cnSheen 6s ease-in-out 2.5s infinite alternate}
@media (prefers-reduced-motion:reduce){.cn *,.cn *::before,.cn *::after{animation:none!important;transition:none!important}}
.cn[data-anim="0"] *{animation:none!important}
`;
