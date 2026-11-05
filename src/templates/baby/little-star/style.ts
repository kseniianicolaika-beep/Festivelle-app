export const LS_CSS = `
.ls{--ls-d:var(--f-display,var(--ls-display)),var(--ls-deva),system-ui,sans-serif;--ls-h:var(--f-script,var(--ls-hand)),var(--ls-deva),cursive;
  --ls-cream:color-mix(in oklab,var(--t-bg) 55%,#fbf3e2);--ls-navy:var(--t-ink);--ls-butter:#F6C94E;--ls-mint:#9ED6C3;--ls-peach:#F4A99A;--ls-sky:color-mix(in oklab,var(--t-accent) 70%,#9DB9E6);
  color:var(--ls-navy);font-family:var(--ls-d)}
.ls .d{font-family:var(--ls-d);font-weight:900;letter-spacing:-.025em}
.ls .h{font-family:var(--ls-h);font-weight:600}
.ls .lbl{font-family:var(--ls-d);font-weight:800;text-transform:uppercase;letter-spacing:.2em}
.ls-site{container-type:inline-size;overflow-x:clip;background:var(--ls-cream)}
.ls-cream{background:radial-gradient(70% 50% at 50% 40%,#fffdf7 0%,transparent 70%),var(--ls-cream)}
.ls-sec{padding:clamp(56px,9cqw,110px) clamp(18px,5cqw,56px)}
.ls-wrap{max-width:980px;margin:0 auto}
.ls-h2{font-size:clamp(36px,7cqw,72px);line-height:.95}
.ls-p{font-family:var(--ls-d);font-weight:600;font-size:clamp(16px,2.1cqw,20px);line-height:1.7;color:color-mix(in oklab,var(--ls-navy) 80%,var(--t-bg))}
.ls-tile{border-radius:clamp(22px,3.4cqw,36px);padding:clamp(22px,4cqw,40px);position:relative;overflow:hidden}
.ls-scallop{--r:14px;-webkit-mask:radial-gradient(var(--r) at 50% var(--r),#000 98%,#0000) 50% calc(-1*var(--r))/calc(2*var(--r)) 100% repeat-x,linear-gradient(#000 0 0) 0 var(--r)/100% 100% no-repeat;mask:radial-gradient(var(--r) at 50% var(--r),#000 98%,#0000) 50% calc(-1*var(--r))/calc(2*var(--r)) 100% repeat-x,linear-gradient(#000 0 0) 0 var(--r)/100% 100% no-repeat}
.ls-pill{display:inline-flex;align-items:center;gap:.6em;border-radius:999px;padding:.9em 1.6em;font-family:var(--ls-d);font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase;background:var(--ls-navy);color:var(--ls-cream);box-shadow:0 6px 0 color-mix(in oklab,var(--ls-navy) 60%,#000);transition:transform .15s,box-shadow .15s}
.ls-pill:hover{transform:translateY(2px);box-shadow:0 4px 0 color-mix(in oklab,var(--ls-navy) 60%,#000)}
.ls-pill:active{transform:translateY(6px);box-shadow:0 0 0 transparent}
.ls-tap{cursor:pointer;transition:transform .5s cubic-bezier(.3,1.6,.5,1)}
.ls-tap:hover{transform:scale(1.12) rotate(8deg)}
.ls-spun{animation:lsSpin .9s cubic-bezier(.3,1.4,.5,1)}
.ls-shake{animation:lsShake .7s ease}
.ls-pop{animation:lsPop .7s cubic-bezier(.3,1.7,.5,1) var(--dl,.4s) both}
.ls-bob{animation:lsBob 3.6s ease-in-out infinite alternate}
.ls-stamp{animation:lsStamp .9s cubic-bezier(.3,1.5,.5,1) var(--dl,1.6s) both}
.ls-up{animation:lsUp 1s cubic-bezier(.2,.8,.3,1.2) var(--dl,2s) both}
.ls-wiggle{transform-origin:50% 90%;animation:lsWiggle 1.4s ease-in-out var(--dl,1.3s) both}
.ls-burst{position:absolute;pointer-events:none;animation:lsBurst .8s ease-out forwards}
@keyframes lsPop{from{transform:scale(0) rotate(-90deg);opacity:0}}
@keyframes lsBob{from{transform:translateY(-4%)}to{transform:translateY(4%)}}
@keyframes lsStamp{from{transform:scale(1.8);opacity:0;filter:blur(4px)}}
@keyframes lsUp{from{transform:translateY(30px);opacity:0}}
@keyframes lsWiggle{0%{transform:rotate(0) translateY(40px);opacity:0}30%{transform:rotate(-14deg);opacity:1}50%{transform:rotate(12deg)}70%{transform:rotate(-8deg)}85%{transform:rotate(4deg)}100%{transform:rotate(-6deg)}}
@keyframes lsShake{0%,100%{transform:rotate(-6deg)}20%{transform:rotate(-22deg)}40%{transform:rotate(14deg)}60%{transform:rotate(-16deg)}80%{transform:rotate(8deg)}}
@keyframes lsSpin{from{transform:rotate(0) scale(1.5)}to{transform:rotate(360deg) scale(1)}}
@keyframes lsBurst{from{transform:translate(-50%,-50%) scale(.3);opacity:1}to{transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(1) rotate(120deg);opacity:0}}
@media (prefers-reduced-motion:reduce){.ls *,.ls *::before,.ls *::after{animation:none!important;transition:none!important}}
.ls[data-anim="0"] *{animation:none!important}
`;
