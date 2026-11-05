import { StyleTag, fibres, grain } from "../_shared/kit";

// Sage & Linen styles (prefixed, hoisted once per page).
export const s = { root: "sl-root", linen: "sl-linen", cotton: "sl-cotton", press: "sl-press", label: "sl-label", deckle: "sl-deckle", still: "sl-still", sway: "sl-sway", link: "sl-link", rule: "sl-rule" } as const;

const DECKLE = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500' preserveAspectRatio='none'><filter id='d' x='-5%' y='-5%' width='110%' height='110%'><feTurbulence type='fractalNoise' baseFrequency='0.09' numOctaves='3' seed='7'/><feDisplacementMap in='SourceGraphic' scale='7'/></filter><rect x='5' y='5' width='390' height='490' fill='white' filter='url(#d)'/></svg>`)}")`;

const CSS = `
.sl-root { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
.sl-linen {
  background-color: var(--t-bg);
  background-image:
    ${grain(0.16, 0.95)},
    repeating-linear-gradient(0deg, rgba(74,66,48,.022) 0 1px, transparent 1px 2px),
    repeating-linear-gradient(90deg, rgba(74,66,48,.026) 0 1px, transparent 1px 3px),
    ${fibres(0.1)};
}
.sl-cotton {
  background-color: #fbfaf6;
  background-image: ${grain(0.12, 0.9)}, ${fibres(0.08)};
}
.sl-deckle { -webkit-mask: ${DECKLE} center / 100% 100% no-repeat; mask: ${DECKLE} center / 100% 100% no-repeat; }
/* letterpress: ink sits slightly into the cotton — light catch below, shade above */
.sl-press {
  color: color-mix(in oklab, var(--t-ink) 86%, var(--t-bg));
  text-shadow: 0 1px 0 rgba(255,255,255,.75), 0 -0.6px 0 rgba(40,45,35,.22);
}
.sl-label { font-family: var(--wb-tenor), var(--font-deva), system-ui, sans-serif; text-transform: uppercase; letter-spacing: .32em; }
.sl-sway { transform-box: fill-box; animation: sl-sway 9s ease-in-out infinite alternate; }
.sl-still .sl-sway { animation: none; }
@keyframes sl-sway { from { transform: rotate(-1.4deg); } to { transform: rotate(1.6deg); } }
@media (prefers-reduced-motion: reduce) { .sl-sway { animation: none; } }
.sl-link { background: linear-gradient(currentColor, currentColor) 0 100% / 100% 1px no-repeat; padding-bottom: 4px; transition: background-size .5s ease; }
.sl-link:hover { background-size: 30% 1px; }
.sl-rule { height: 1px; background: color-mix(in oklab, var(--t-ink) 22%, transparent); }
`;
export const SageStyles = () => <StyleTag id="wb-sage" css={CSS} />;
