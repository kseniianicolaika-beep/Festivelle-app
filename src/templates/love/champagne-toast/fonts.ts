import { Poiret_One, Cormorant_SC } from "next/font/google";

export const display = Poiret_One({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--ct-display", preload: false });
export const caps = Cormorant_SC({ subsets: ["latin", "cyrillic"], weight: ["400", "500"], variable: "--ct-caps", preload: false });
export const fontClass = `${display.variable} ${caps.variable}`;

export const CSS = `
.ct{--d:var(--f-display,var(--ct-display)),var(--font-deva),sans-serif;--i:var(--f-script,var(--font-cormorant)),var(--font-deva),Georgia,serif;--b:var(--f-body,var(--font-montserrat)),var(--font-deva),system-ui,sans-serif;--k:var(--ct-caps),var(--font-deva),Georgia,serif;font-family:var(--b);font-weight:300}
.ct .d{font-family:var(--d);font-weight:400;letter-spacing:.06em;text-transform:uppercase}
.ct .i{font-family:var(--i);font-style:italic;font-weight:400}
.ct .k{font-family:var(--k);letter-spacing:.28em;text-transform:uppercase}
.ct:lang(hi) .k,.ct:lang(hi) .d{letter-spacing:.02em}
.ct .gold{background:linear-gradient(100deg,var(--foil-a) 0%,var(--foil-b) 20%,#fff6dc 30%,var(--foil-b) 40%,var(--foil-a) 60%,var(--foil-b) 85%,var(--foil-a) 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ct-foil 6s ease-in-out infinite}
@keyframes ct-foil{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.ct .rule{height:1px;background:linear-gradient(90deg,transparent,var(--t-gold),transparent)}
.ct-stream{stroke-dasharray:120;stroke-dashoffset:120;animation:ct-pour 1.6s cubic-bezier(.5,0,.3,1) 1.4s forwards}
.ct-spill{stroke-dasharray:40;stroke-dashoffset:40;animation:ct-pour 1.2s ease-out 2.6s forwards}
@keyframes ct-pour{to{stroke-dashoffset:0}}
.ct-fizz{animation:ct-fizz 2.4s ease-in infinite}
@keyframes ct-fizz{0%{transform:translateY(0);opacity:0}30%{opacity:1}100%{transform:translateY(-14px);opacity:0}}
@keyframes ct-cl{from{transform:translateX(0)}to{transform:translateX(-102%)}}
@keyframes ct-cr{from{transform:translateX(0)}to{transform:translateX(102%)}}
@keyframes ct-up{from{opacity:0;transform:translateY(30px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
@keyframes ct-track{from{opacity:0;letter-spacing:.8em}to{opacity:1}}
@keyframes ct-fade{from{opacity:0}to{opacity:1}}
@keyframes ct-rise{from{opacity:0;transform:translateY(40px) scale(.94)}to{opacity:1;transform:none}}
@keyframes ct-flick{0%,100%{opacity:.85;transform:scaleY(1)}40%{opacity:1;transform:scaleY(1.08) skewX(2deg)}70%{opacity:.75;transform:scaleY(.95) skewX(-2deg)}}
.ct .cl{animation:ct-cl 2s cubic-bezier(.75,0,.2,1) .5s both}
.ct .cr{animation:ct-cr 2s cubic-bezier(.75,0,.2,1) .5s both}
.ct .up{animation:ct-up 1.3s cubic-bezier(.2,.7,.2,1) both}
.ct .track{animation:ct-track 2s cubic-bezier(.2,.7,.2,1) both}
.ct .fade{animation:ct-fade 1.6s ease both}
.ct .rise{animation:ct-rise 1.8s cubic-bezier(.2,.7,.2,1) both}
.ct .flick{transform-origin:bottom center;animation:ct-flick 2.2s ease-in-out infinite}
.ct.still,.ct.still *{animation:none!important}
.ct.still .ct-stream,.ct.still .ct-spill{stroke-dashoffset:0}
@media (prefers-reduced-motion:reduce){.ct *{animation:none!important}.ct .ct-stream,.ct .ct-spill{stroke-dashoffset:0}.ct .cl,.ct .cr{display:none}}
`;
