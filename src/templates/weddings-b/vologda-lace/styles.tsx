import { StyleTag, fibres, grain } from "../_shared/kit";

// Vologda Lace styles (prefixed vl-, hoisted once per page).
export const s = { root: "vl-root", paper: "vl-paper", foil: "vl-foil", veil: "vl-veil", swing: "vl-swing", still: "vl-still", sc: "vl-sc", lace: "vl-lace", drift: "vl-drift" } as const;

const CSS = `
.vl-root { -webkit-font-smoothing: antialiased; }
.vl-paper {
  background-color: var(--t-bg);
  background-image: ${grain(0.16, 0.9)}, ${fibres(0.12)}, radial-gradient(120% 80% at 50% 0%, rgba(255,252,245,.9), transparent 60%);
}
.vl-foil {
  background: linear-gradient(100deg, var(--foil-a) 0%, var(--foil-b) 22%, #fff4d8 28%, var(--foil-b) 34%, var(--foil-a) 55%, var(--foil-b) 80%, var(--foil-a) 100%);
  background-size: 240% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: vl-sheen 10s ease-in-out infinite;
}
.vl-still .vl-foil { animation: none; background-position: 30% 50%; }
@keyframes vl-sheen { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.vl-sc { font-variant: small-caps; letter-spacing: .18em; }
.vl-lace { filter: drop-shadow(0 1px 1.2px rgba(120,92,60,.28)); }
.vl-veil { position: fixed; inset: 0; z-index: 80; animation: vl-failsafe .8s ease 9s forwards; }
@keyframes vl-failsafe { to { opacity: 0; visibility: hidden; } }
@media (prefers-reduced-motion: reduce) { .vl-veil { display: none; } .vl-swing, .vl-drift { animation: none !important; } }
.vl-swing { transform-origin: 50% 0%; animation: vl-swing 3.6s ease-in-out infinite; }
@keyframes vl-swing { 0%,100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
.vl-drift { animation: vl-drift 60s linear infinite; }
@keyframes vl-drift { to { transform: rotate(360deg); } }
.vl-still .vl-swing, .vl-still .vl-drift { animation: none; }
`;
export const VologdaStyles = () => <StyleTag id="wb-vologda" css={CSS} />;
