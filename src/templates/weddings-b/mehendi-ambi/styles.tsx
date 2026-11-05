import { StyleTag } from "../_shared/kit";

// Mehendi Ambi styles (hoisted by React 19 <style href precedence>).
export const s = { root: "mh-root", paper: "mh-paper", stain: "mh-stain", still: "mh-still", fall: "mh-fall", sway: "mh-sway", scallop: "mh-scallop", glow: "mh-glow", deva: "mh-deva" } as const;
const CSS = `
.mh-root { -webkit-font-smoothing: antialiased; }
.mh-paper {
  background:
    radial-gradient(110% 70% at 50% -10%, #fff7ea 0%, transparent 60%),
    radial-gradient(70% 50% at 100% 100%, rgba(180,82,29,.10), transparent 70%),
    radial-gradient(60% 50% at 0% 60%, rgba(217,146,42,.10), transparent 70%),
    #f4e5cd;
}
/* henna stain: darkest where the paste sat longest */
.mh-stain {
  background: linear-gradient(170deg, #5a210a 0%, #8a3512 45%, #b4521d 80%, #8a3512 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.mh-fall { position: absolute; top: -40px; animation: mh-fall linear infinite; will-change: transform; }
@keyframes mh-fall { 0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0; } 8% { opacity: .95; } 100% { transform: translate3d(var(--dx, 40px), var(--fall, 110vh), 0) rotate(var(--rot, 540deg)); opacity: .9; } }
.mh-sway { animation: mh-sway 6s ease-in-out infinite; transform-origin: 50% 0; }
@keyframes mh-sway { 0%,100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
.mh-still .mh-sway, .mh-still .mh-fall { animation: none; }
.mh-scallop {
  --r: 9px;
  -webkit-mask: radial-gradient(var(--r) at 50% var(--r), #000 98%, #0000) 50% 0 / calc(var(--r) * 2) 51% repeat-x, radial-gradient(var(--r) at 50% calc(100% - var(--r)), #000 98%, #0000) 50% 100% / calc(var(--r) * 2) 51% repeat-x, linear-gradient(#000 0 0) 50% 50% / 100% calc(100% - 2 * var(--r)) no-repeat;
          mask: radial-gradient(var(--r) at 50% var(--r), #000 98%, #0000) 50% 0 / calc(var(--r) * 2) 51% repeat-x, radial-gradient(var(--r) at 50% calc(100% - var(--r)), #000 98%, #0000) 50% 100% / calc(var(--r) * 2) 51% repeat-x, linear-gradient(#000 0 0) 50% 50% / 100% calc(100% - 2 * var(--r)) no-repeat;
}
.mh-glow { box-shadow: 0 30px 70px -40px rgba(122,49,18,.55), 0 2px 0 rgba(255,255,255,.6) inset; }
/* Devanagari breaks apart when letter-spaced: keep tracking for Latin/Cyrillic only. */
.mh-root:lang(hi) [class*="tracking-"] { letter-spacing: 0.01em !important; text-transform: none !important; }
@media (prefers-reduced-motion: reduce) { .mh-fall, .mh-sway { animation: none !important; } .mh-fall { display: none; } }
`;
export const MehendiStyles = () => <StyleTag id="wb-mehendi" css={CSS} />;
