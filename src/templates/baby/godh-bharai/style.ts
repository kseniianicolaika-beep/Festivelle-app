export const GB_CSS = `
.gb{--gb-d:var(--f-display,var(--gb-display)),var(--font-cormorant),Georgia,serif;--gb-sc:var(--f-script,var(--gb-script)),var(--font-script),cursive;--gb-b:var(--f-body,var(--gb-body)),var(--font-cormorant),Georgia,serif;
  --gb-kum:var(--t-accent);--gb-leaf:#3f6f2a;--gb-maroon:color-mix(in oklab,var(--t-ink) 55%,#7a1416);--gb-haldi:color-mix(in oklab,var(--t-bg) 78%,#f6c453);
  --gb-foil:linear-gradient(100deg,#9a5a12 0%,#f2c86a 25%,#b57a22 45%,#fff0b8 58%,#c4882a 78%,#f0c66a 100%);
  color:var(--t-ink);font-family:var(--gb-b)}
.gb .d{font-family:var(--gb-d);font-weight:600;letter-spacing:-.01em}
.gb .sc{font-family:var(--gb-sc)}
.gb .lbl{font-family:var(--gb-b);text-transform:uppercase;letter-spacing:.26em;font-weight:600}
.gb .foil{background:var(--gb-foil);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.gb-paper{background:radial-gradient(90% 60% at 50% 30%,color-mix(in oklab,var(--t-bg) 90%,#fff) 0%,transparent 70%),radial-gradient(120% 80% at 50% 120%,color-mix(in oklab,var(--gb-haldi) 70%,#f2a33a) 0%,transparent 60%),var(--gb-haldi)}
.gb-site{container-type:inline-size;overflow-x:clip;background:var(--t-bg)}
.gb-hero{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;text-align:center}
.gb-sec{padding:clamp(64px,10cqw,120px) clamp(20px,6cqw,64px);text-align:center}
.gb-wrap{max-width:860px;margin:0 auto}
.gb-h{font-size:clamp(34px,6.4cqw,60px);line-height:1.05;color:var(--gb-maroon)}
.gb-p{font-size:clamp(16px,2.1cqw,19px);line-height:1.85;color:color-mix(in oklab,var(--t-ink) 85%,var(--t-bg))}
.gb-panel{position:relative;background:color-mix(in oklab,var(--t-surface) 82%,transparent);border:1px solid color-mix(in oklab,var(--t-gold) 70%,transparent);box-shadow:0 0 0 6px color-mix(in oklab,var(--t-surface) 60%,transparent),0 0 0 7px color-mix(in oklab,var(--t-gold) 40%,transparent),0 40px 70px -40px rgba(120,50,10,.35)}
.gb-btn{display:inline-flex;align-items:center;gap:.6em;padding:1em 1.8em;border-radius:999px;background:var(--gb-kum);color:#fff8ec;font-family:var(--gb-b);font-weight:600;font-size:12px;letter-spacing:.22em;text-transform:uppercase;box-shadow:0 14px 30px -14px var(--gb-kum);transition:transform .3s}
.gb-btn:hover{transform:translateY(-2px)}
.gb-band{background:linear-gradient(180deg,var(--t-bg),color-mix(in oklab,var(--gb-haldi) 70%,var(--t-bg)) 50%,var(--t-bg))}
.gb-maroonbg{background:radial-gradient(80% 60% at 50% 0%,#8a2a1a 0%,transparent 70%),#5a1410;color:#fbe9c8}
.gb-flame{animation:gbFlicker 1.6s ease-in-out infinite alternate}
.gb-glow{animation:gbGlow 2.4s ease-in-out infinite alternate}
.gb-sway{transform-origin:50% 0;animation:gbSway var(--sw,6s) ease-in-out infinite alternate}
@keyframes gbFlicker{0%{transform:scale(1,1) rotate(-2deg)}40%{transform:scale(.92,1.08) rotate(2deg)}100%{transform:scale(1.04,.94) rotate(-1deg)}}
@keyframes gbGlow{from{opacity:.55}to{opacity:1}}
@keyframes gbSway{from{transform:rotate(-1.4deg)}to{transform:rotate(1.4deg)}}
@keyframes gbOpenL{from{transform:translateX(0)}}
@keyframes gbOpenR{from{transform:translateX(0)}}
@keyframes gbDrop{from{transform:translateY(-100%)}}
@keyframes gbRise{from{opacity:0;transform:translateY(24px);filter:blur(6px)}}
@keyframes gbZoom{from{opacity:0;transform:scale(.86)}}
@keyframes gbSheen{from{background-position:120% 0}to{background-position:-20% 0}}
.gb-curl{animation:gbOpenL 2.4s cubic-bezier(.7,0,.2,1) .5s both}
.gb-curr{animation:gbOpenR 2.4s cubic-bezier(.7,0,.2,1) .5s both}
.gb-a-drop{animation:gbDrop 1.6s cubic-bezier(.2,.9,.3,1.1) var(--dl,.1s) both}
.gb-a-rise{animation:gbRise 1.4s cubic-bezier(.2,.7,.2,1) var(--dl,1.6s) both}
.gb-a-zoom{animation:gbZoom 1.8s cubic-bezier(.2,.7,.2,1) var(--dl,1.2s) both}
.gb .foil.gb-a-sheen{animation:gbSheen 5s ease-in-out 3s infinite alternate}
@media (prefers-reduced-motion:reduce){.gb *,.gb *::before,.gb *::after{animation:none!important;transition:none!important}}
.gb[data-anim="0"] *{animation:none!important}
`;
