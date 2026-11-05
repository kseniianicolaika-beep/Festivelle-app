import { fv, cinzel, cormorantSC, pinyon, greatVibes, amita, amiri } from "../_shared/fonts";

export const FACES = {
  display: "var(--wa-cinzel), var(--wa-corsc), var(--font-rozha), var(--font-deva), Georgia, serif",
  script: "var(--wa-pinyon), var(--wa-vibes), var(--wa-amita), cursive",
  body: "var(--font-cormorant), var(--font-deva), Georgia, serif",
};
export const FONTS = fv(cinzel, cormorantSC, pinyon, greatVibes, amita, amiri);
/** Gold-leaf foil stops for this suite. */
export const GOLD = { "--wa-f1": "#9a6a22", "--wa-f2": "#ffe9a8", "--wa-f3": "#d6a650" } as React.CSSProperties;
