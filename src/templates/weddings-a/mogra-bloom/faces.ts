import { fv, jost, amita } from "../_shared/fonts";

// Cormorant (light, italic) for the voice, Jost for quiet captions; Devanagari in Tiro, its script in Amita.
export const FACES = {
  display: "var(--font-cormorant), var(--font-deva), Georgia, serif",
  script: "var(--font-cormorant), var(--wa-amita), Georgia, serif",
  body: "var(--wa-jost), var(--font-deva), system-ui, sans-serif",
};
export const FONTS = fv(jost, amita);
