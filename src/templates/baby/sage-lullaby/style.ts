export const SL_CSS = `
.sl{--sl-d:var(--f-display,var(--sl-serif)),var(--font-deva),Georgia,serif;--sl-s:var(--f-body,var(--sl-sans)),var(--font-deva),system-ui,sans-serif;
  --sl-green:var(--t-accent);--sl-deep:color-mix(in oklab,var(--t-ink) 85%,#1d2a20);--sl-linen:color-mix(in oklab,var(--t-bg) 70%,#efeee4);
  color:var(--t-ink);font-family:var(--sl-s)}
.sl .d{font-family:var(--sl-d);font-weight:400}
.sl .i{font-style:italic}
.sl .lbl{font-family:var(--sl-s);text-transform:uppercase;letter-spacing:.24em;font-weight:600}
.sl-linen{background-color:var(--sl-linen);background-image:repeating-linear-gradient(0deg,rgba(60,80,60,.035) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(60,80,60,.03) 0 1px,transparent 1px 4px),radial-gradient(100% 60% at 70% 20%,rgba(255,255,255,.7),transparent 70%)}
.sl-site{container-type:inline-size;overflow-x:clip}
.sl-sec{padding:clamp(56px,9cqw,120px) clamp(20px,6cqw,80px)}
.sl-wrap{max-width:1120px;margin:0 auto}
.sl-rule{height:1px;background:color-mix(in oklab,var(--t-ink) 22%,transparent)}
.sl-p{font-family:var(--sl-d);font-size:clamp(18px,2.2cqw,21px);line-height:1.7;color:color-mix(in oklab,var(--t-ink) 86%,var(--t-bg))}
.sl-drop::first-letter{font-family:var(--sl-d);font-style:italic;float:left;font-size:4.2em;line-height:.82;padding:.06em .1em 0 0;color:var(--sl-green)}
.sl-btn{display:inline-flex;align-items:center;gap:.8em;padding:1em 1.7em;border-radius:999px;background:var(--sl-deep);color:var(--sl-linen);font-family:var(--sl-s);font-weight:600;font-size:12px;letter-spacing:.18em;text-transform:uppercase;transition:transform .3s,background .3s}
.sl-btn:hover{transform:translateY(-2px);background:var(--sl-green)}
.sl-ink path{stroke-dasharray:1;animation:slDraw 2.2s cubic-bezier(.6,.1,.3,1) var(--dl,0s) both}
.sl-inkm path{stroke-dasharray:1}
.sl-wash{animation:slWash 2.4s ease var(--dl,1.4s) both}
.sl-note{animation:slNote 1s cubic-bezier(.3,1.5,.5,1) var(--dl,1.2s) both,slFloat var(--fl,4s) ease-in-out calc(var(--dl,1.2s) + 1s) infinite alternate}
.sl-in{animation:slIn 1.5s cubic-bezier(.2,.7,.2,1) var(--dl,1s) both}
.sl-type{animation:slType 1.8s steps(24) var(--dl,1s) both}
@keyframes slDraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes slWash{from{opacity:0;filter:blur(8px)}}
@keyframes slNote{from{opacity:0;transform:translateY(10px)}}
@keyframes slFloat{from{transform:translateY(0)}to{transform:translateY(-5px)}}
@keyframes slIn{from{opacity:0;transform:translateY(18px);filter:blur(5px)}}
@keyframes slType{from{clip-path:inset(0 100% 0 0)}}
@media (prefers-reduced-motion:reduce){.sl *,.sl *::before,.sl *::after{animation:none!important;transition:none!important}}
.sl[data-anim="0"] *{animation:none!important}
`;
