export const BB_CSS = `
.bb{--bb-s:var(--f-script,var(--bb-script)),var(--font-deva),cursive;--bb-d:var(--f-display,var(--bb-serif)),var(--font-deva),Georgia,serif;--bb-b:var(--f-body,var(--bb-serif)),var(--font-deva),Georgia,serif;
  --bb-blush:color-mix(in oklab,var(--t-accent) 22%,#fbeeee);--bb-rose:var(--t-accent);--bb-paper:color-mix(in oklab,var(--t-surface) 80%,#fbf5ee);--bb-sage:#9fae93;
  color:var(--t-ink);font-family:var(--bb-b)}
.bb .s{font-family:var(--bb-s);font-weight:400;letter-spacing:0;line-height:1.05}
.bb .d{font-family:var(--bb-d);font-weight:400}
.bb .lbl{font-family:var(--bb-d);text-transform:uppercase;letter-spacing:.3em;font-size:.72em}
.bb-site{container-type:inline-size;overflow-x:clip;background:var(--t-bg)}
.bb-wash{background:radial-gradient(60% 40% at 15% 10%,color-mix(in oklab,var(--bb-blush) 90%,#f2c6cc) 0%,transparent 70%),radial-gradient(50% 40% at 90% 85%,color-mix(in oklab,var(--bb-blush) 80%,#f0c0c8) 0%,transparent 70%),radial-gradient(40% 30% at 80% 20%,#f7e9e0 0%,transparent 70%),var(--t-bg)}
.bb-letterpaper{background:radial-gradient(120% 80% at 50% 0%,#fffdf9 0%,var(--bb-paper) 70%);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 30px 60px -36px rgba(120,60,70,.4),0 2px 6px rgba(120,60,70,.08)}
.bb-sec{padding:clamp(48px,8cqw,96px) clamp(22px,7cqw,80px);text-align:center}
.bb-h{font-size:clamp(46px,9cqw,92px);color:var(--bb-rose)}
.bb-p{font-size:clamp(18px,2.4cqw,22px);line-height:1.7;color:color-mix(in oklab,var(--t-ink) 85%,var(--t-bg))}
.bb-rule{height:1px;background:linear-gradient(90deg,transparent,color-mix(in oklab,var(--t-gold) 70%,transparent),transparent)}
.bb-btn{display:inline-flex;align-items:center;gap:.7em;padding:.9em 1.8em;border:1px solid var(--bb-rose);color:var(--bb-rose);font-family:var(--bb-d);text-transform:uppercase;letter-spacing:.24em;font-size:12px;border-radius:2px;transition:background .3s,color .3s}
.bb-btn:hover{background:var(--bb-rose);color:#fff}
/* envelope */
.bb-env{position:relative;aspect-ratio:1.45;perspective:1400px}
.bb-envback{position:absolute;inset:0;border-radius:6px;background:linear-gradient(180deg,color-mix(in oklab,var(--bb-blush) 70%,#d9919e),color-mix(in oklab,var(--bb-blush) 85%,#c98190));box-shadow:0 40px 70px -40px rgba(140,60,80,.55)}
.bb-liner{position:absolute;inset:3% 3% 40% 3%;border-radius:4px 4px 0 0;background-color:#f6e2df;background-image:radial-gradient(circle at 25% 25%,#e3a3ae 0 1.4px,transparent 1.6px),radial-gradient(circle at 75% 75%,#b9c4ae 0 1.2px,transparent 1.4px);background-size:14px 14px}
.bb-clip{position:absolute;left:0;right:0;bottom:0;top:-260%;overflow:hidden;pointer-events:none}
.bb-letter{position:absolute;left:11%;right:11%;bottom:1%;height:26%;transform:translateY(-76%)}
.bb-front{position:absolute;inset:0;z-index:3}
.bb-flap{position:absolute;left:0;right:0;top:0;height:58%;transform-origin:50% 0;transform-style:preserve-3d;transform:rotateX(180deg);z-index:1}
.bb-flap>i{position:absolute;inset:0;clip-path:polygon(0 0,100% 0,50% 100%);backface-visibility:hidden}
.bb-flap>i:first-child{background:linear-gradient(180deg,color-mix(in oklab,var(--bb-blush) 92%,#fff),color-mix(in oklab,var(--bb-blush) 80%,#e8a9b3))}
.bb-flap>i:last-child{transform:rotateY(180deg);background-color:#f6e2df;background-image:radial-gradient(circle at 25% 25%,#e3a3ae 0 1.4px,transparent 1.6px),radial-gradient(circle at 75% 75%,#b9c4ae 0 1.2px,transparent 1.4px);background-size:14px 14px}
.bb-ribbon{position:absolute;left:50%;top:0;bottom:0;width:7%;transform:translateX(-50%);z-index:6;background:linear-gradient(90deg,#d98e9c,#f9dde1 40%,#e6a7b2 60%,#c47b8a);opacity:0}
.bb-bowwrap{position:absolute;left:50%;top:58%;width:34%;transform:translate(-50%,-45%);z-index:7;opacity:0}
@keyframes bbEnvIn{from{transform:translateY(40px) rotate(-2deg);opacity:0}}
@keyframes bbRibbon{0%{opacity:1;transform:translateX(-50%)}100%{opacity:0;transform:translateX(-50%) translateY(30%) scaleY(.4)}}
@keyframes bbBow{0%{opacity:1;transform:translate(-50%,-45%) scale(1)}60%{opacity:1;transform:translate(-50%,-45%) scale(1.08) rotate(-6deg)}100%{opacity:0;transform:translate(-30%,10%) scale(.6) rotate(-30deg)}}
@keyframes bbFlap{0%{transform:rotateX(0);z-index:5}49%{z-index:5}50%{z-index:1}100%{transform:rotateX(180deg);z-index:1}}
@keyframes bbLetter{from{transform:translateY(0)}}
@keyframes bbFade{from{opacity:0;transform:translateY(14px)}}
@keyframes bbBloom{from{opacity:0;transform:scale(.8) rotate(-8deg)}}
@keyframes bbSway{from{transform:rotate(-1.5deg)}to{transform:rotate(1.5deg)}}
.bb-anim .bb-env{animation:bbEnvIn 1.1s cubic-bezier(.2,.8,.2,1) .15s both}
.bb-anim .bb-ribbon{animation:bbRibbon 1s cubic-bezier(.6,0,.3,1) 1.3s both}
.bb-anim .bb-bowwrap{animation:bbBow 1.2s cubic-bezier(.6,0,.3,1) 1.1s both}
.bb-anim .bb-flap{animation:bbFlap 1.1s cubic-bezier(.5,0,.2,1) 2.1s both}
.bb-anim .bb-letter{animation:bbLetter 1.5s cubic-bezier(.3,0,.1,1) 2.9s both}
.bb-anim .bb-fade{animation:bbFade 1.3s ease var(--dl,3.8s) both}
.bb-anim .bb-bloom{animation:bbBloom 1.8s cubic-bezier(.2,.7,.2,1) var(--dl,.2s) both}
.bb-sway{transform-origin:50% 100%;animation:bbSway 6s ease-in-out infinite alternate}
@media (prefers-reduced-motion:reduce){.bb *,.bb *::before,.bb *::after{animation:none!important;transition:none!important}}
.bb[data-anim="0"] *{animation:none!important}
`;
