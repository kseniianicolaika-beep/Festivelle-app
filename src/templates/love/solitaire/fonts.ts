import { Cormorant, Great_Vibes, Tenor_Sans } from "next/font/google";

export const display = Cormorant({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--sol-display", preload: false });
export const script = Great_Vibes({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--sol-script", preload: false });
export const body = Tenor_Sans({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--sol-body", preload: false });
export const fontClass = `${display.variable} ${script.variable} ${body.variable}`;

export const CSS = `
.sol{--d:var(--f-display,var(--sol-display)),var(--font-deva),Georgia,serif;--s:var(--f-script,var(--sol-script)),var(--font-deva),cursive;--b:var(--f-body,var(--sol-body)),var(--font-deva),system-ui,sans-serif;font-family:var(--b)}
.sol .d{font-family:var(--d);font-weight:300;letter-spacing:-.01em}
.sol .di{font-family:var(--d);font-style:italic;font-weight:300}
.sol .sc{font-family:var(--s);font-weight:400}
.sol .cap{font-family:var(--b);text-transform:uppercase;letter-spacing:.34em}
.sol :lang(hi) .cap,.sol:lang(hi) .cap{letter-spacing:.08em;text-transform:none}
.sol .foil{background:linear-gradient(100deg,var(--foil-a) 0%,var(--foil-b) 22%,var(--foil-a) 42%,var(--foil-a) 58%,var(--foil-b) 80%,var(--foil-a) 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sol-foil 8s ease-in-out infinite}
@keyframes sol-foil{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.sol .deboss{color:color-mix(in oklab,var(--t-ink) 74%,var(--t-surface));text-shadow:0 1.5px 0 rgba(255,255,255,.95),0 -1px 1px rgba(80,20,40,.25)}
.sol-glint{animation:sol-glint 4.8s ease-in-out 1.2s infinite}
@keyframes sol-glint{0%,62%,100%{opacity:0;transform:scale(.2) rotate(0)}70%{opacity:1;transform:scale(1) rotate(45deg)}80%{opacity:0;transform:scale(.3) rotate(90deg)}}
.sol-fold1{animation:sol-drift 18s ease-in-out infinite alternate}
.sol-fold2{animation:sol-drift 23s ease-in-out -6s infinite alternate-reverse}
@keyframes sol-drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(-30px,18px,0)}}
@keyframes sol-iris{0%{clip-path:circle(0% at 50% 40%)}100%{clip-path:circle(150% at 50% 40%)}}
@keyframes sol-flare{0%{opacity:0;transform:scale(.1) rotate(-30deg)}35%{opacity:1;transform:scale(1.2) rotate(20deg)}100%{opacity:0;transform:scale(2.4) rotate(60deg)}}
@keyframes sol-up{from{opacity:0;transform:translateY(.5em);filter:blur(10px)}to{opacity:1;transform:none;filter:none}}
@keyframes sol-fade{from{opacity:0}to{opacity:1}}
@keyframes sol-line{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes sol-ring{from{opacity:0;transform:translateY(24px) scale(.86) rotate(-6deg)}to{opacity:1;transform:none}}
.sol .iris{animation:sol-iris 2.2s cubic-bezier(.7,0,.2,1) .55s both}
.sol .flare{animation:sol-flare 1.4s ease-out .1s both}
.sol .up{animation:sol-up 1.4s cubic-bezier(.2,.7,.2,1) both}
.sol .fade{animation:sol-fade 1.6s ease both}
.sol .line{transform-origin:center;animation:sol-line 1.6s cubic-bezier(.6,0,.2,1) both}
.sol .ringin{animation:sol-ring 2s cubic-bezier(.2,.7,.2,1) both}
.sol .ch{display:inline-block;animation:sol-up 1.3s cubic-bezier(.2,.7,.2,1) both}
.sol.still *,.sol.still{animation:none!important}
@media (prefers-reduced-motion:reduce){.sol *{animation:none!important}}
`;
