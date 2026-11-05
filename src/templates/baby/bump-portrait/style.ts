export const BP_CSS = `
.bp{--bp-d:var(--f-display,var(--bp-display)),var(--font-deva),Georgia,serif;--bp-s:var(--f-body,var(--bp-sans)),var(--font-deva),system-ui,sans-serif;
  --bp-ink:var(--t-ink);--bp-ivory:var(--t-bg);--bp-film:color-mix(in oklab,var(--t-ink) 92%,#000);--bp-moon:#f3ead9;
  color:var(--bp-ink);font-family:var(--bp-s)}
.bp .d{font-family:var(--bp-d);font-weight:400;letter-spacing:-.01em}
.bp .lbl{font-family:var(--bp-s);text-transform:uppercase;letter-spacing:.34em}
.bp .tc{font-family:var(--bp-s);letter-spacing:.18em;font-variant-numeric:tabular-nums}
.bp-site{container-type:inline-size;overflow-x:clip;background:var(--bp-ivory)}
.bp-dark{background:var(--bp-film);color:var(--bp-moon)}
.bp-sec{padding:clamp(64px,11cqw,140px) clamp(20px,6cqw,90px)}
.bp-wrap{max-width:1180px;margin:0 auto}
.bp-num{font-family:var(--bp-s);font-size:11px;letter-spacing:.3em;color:var(--t-muted)}
.bp-big{font-size:clamp(40px,8.4cqw,120px);line-height:.98}
.bp-p{font-size:clamp(16px,1.9cqw,19px);line-height:1.85;color:color-mix(in oklab,var(--bp-ink) 78%,var(--bp-ivory))}
.bp-line{height:1px;background:color-mix(in oklab,var(--bp-ink) 18%,transparent)}
.bp-btn{display:inline-flex;align-items:center;gap:1em;padding:1.05em 2em;font-family:var(--bp-s);text-transform:uppercase;letter-spacing:.3em;font-size:11px;border:1px solid currentColor;transition:background .3s,color .3s}
.bp-btn:hover{background:var(--bp-ink);color:var(--bp-ivory)}
.bp-dark .bp-btn:hover{background:var(--bp-moon);color:var(--bp-film)}
.bp-strip{background:#141210;padding:18px 0}
.bp-grain{animation:bpGrain .8s steps(5) infinite}
.bp-bar{position:absolute;left:0;right:0;background:#0d0c0b;z-index:5}
@keyframes bpGrain{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-5%)}60%{transform:translate(-2%,-2%)}80%{transform:translate(5%,4%)}}
@keyframes bpBarT{from{height:50%}}
@keyframes bpBarB{from{height:50%}}
@keyframes bpKen{from{transform:scale(1.16)}}
@keyframes bpIn{from{opacity:0;transform:translateY(16px)}}
@keyframes bpTrack{from{opacity:0;letter-spacing:.5em;filter:blur(10px)}}
@keyframes bpMoon{from{opacity:0;transform:scale(.4)}}
.bp-a-bart{animation:bpBarT 2.2s cubic-bezier(.75,0,.2,1) .3s both}
.bp-a-barb{animation:bpBarB 2.2s cubic-bezier(.75,0,.2,1) .3s both}
.bp-a-ken{animation:bpKen 9s cubic-bezier(.2,.6,.2,1) .2s both}
.bp-a-in{animation:bpIn 1.4s cubic-bezier(.2,.7,.2,1) var(--dl,2.4s) both}
.bp-a-track{animation:bpTrack 2.2s cubic-bezier(.2,.7,.2,1) var(--dl,2.6s) both}
.bp-a-moon{animation:bpMoon .8s cubic-bezier(.3,1.4,.5,1) var(--dl,1s) both}
@media (prefers-reduced-motion:reduce){.bp *,.bp *::before,.bp *::after{animation:none!important;transition:none!important}}
.bp[data-anim="0"] *{animation:none!important}
`;
