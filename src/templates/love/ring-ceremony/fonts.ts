import { Yeseva_One, Cormorant_SC } from "next/font/google";

export const display = Yeseva_One({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--rc-display", preload: false });
export const caps = Cormorant_SC({ subsets: ["latin", "cyrillic"], weight: ["400", "500"], variable: "--rc-caps", preload: false });
export const fontClass = `${display.variable} ${caps.variable}`;

// Playfair italic (global --font-playfair) is the flourish face; Tiro Devanagari covers Hindi.
export const CSS = `
.rc{--d:var(--f-display,var(--rc-display)),var(--font-deva),Georgia,serif;--i:var(--f-script,var(--font-playfair)),var(--font-deva),Georgia,serif;--k:var(--f-body,var(--rc-caps)),var(--font-deva),Georgia,serif;font-family:var(--k)}
.rc .d{font-family:var(--d);font-weight:400}
.rc .i{font-family:var(--i);font-style:italic}
.rc .k{font-family:var(--k);letter-spacing:.24em;text-transform:uppercase}
.rc:lang(hi) .k{letter-spacing:.04em}
.rc .gold{background:linear-gradient(100deg,var(--foil-a) 0%,var(--foil-b) 22%,#fff8d8 32%,var(--foil-b) 42%,var(--foil-a) 62%,var(--foil-b) 85%,var(--foil-a));background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:rc-foil 7s ease-in-out infinite}
@keyframes rc-foil{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}
.rc-draw ellipse{stroke-dasharray:1;stroke-dashoffset:1;animation:rc-draw 2.2s cubic-bezier(.6,.1,.2,1) 1.6s forwards}
.rc-draw ellipse:nth-child(2){animation-delay:2s}
@keyframes rc-draw{to{stroke-dashoffset:0}}
.rc-fade{animation:rc-fade 1s ease 3.4s both}
@keyframes rc-fade{from{opacity:0}to{opacity:1}}
.rc-twinkle{animation:rc-tw 3.6s ease-in-out 4s infinite}
@keyframes rc-tw{0%,70%,100%{opacity:0;transform:scale(.3)}80%{opacity:1;transform:scale(1) rotate(45deg)}}
.rc-swing{transform-origin:top center;animation:rc-swing 6s ease-in-out infinite alternate}
@keyframes rc-swing{from{transform:rotate(-2.5deg)}to{transform:rotate(2.5deg)}}
.rc-glow{animation:rc-glow 3s ease-in-out infinite alternate}
@keyframes rc-glow{from{opacity:.6}to{opacity:1}}
@keyframes rc-cl{to{transform:translateX(-115%) skewX(-4deg)}}
@keyframes rc-cr{to{transform:translateX(115%) skewX(4deg)}}
@keyframes rc-up{from{opacity:0;transform:translateY(26px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
@keyframes rc-drop{from{transform:translateY(-120%)}to{transform:none}}
.rc .cl{transform-origin:left;animation:rc-cl 2.2s cubic-bezier(.7,0,.25,1) .6s both}
.rc .cr{transform-origin:right;animation:rc-cr 2.2s cubic-bezier(.7,0,.25,1) .6s both}
.rc .up{animation:rc-up 1.3s cubic-bezier(.2,.7,.2,1) both}
.rc .drop{animation:rc-drop 1.8s cubic-bezier(.3,.8,.3,1) both}
.rc.still,.rc.still *{animation:none!important}
.rc.still .rc-draw ellipse{stroke-dashoffset:0}
@media (prefers-reduced-motion:reduce){.rc *{animation:none!important}.rc .rc-draw ellipse{stroke-dashoffset:0}.rc .cl,.rc .cr{display:none}}
`;
