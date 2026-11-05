import { fv, amiri, ruqaa, greatVibes, amita } from "../_shared/fonts";

export const FACES = {
  display: "var(--wa-amiri), var(--font-cormorant), var(--font-deva), Georgia, serif",
  script: "var(--wa-vibes), var(--wa-ruqaa), var(--wa-amita), cursive",
  body: "var(--font-cormorant), var(--wa-amiri), var(--font-deva), Georgia, serif",
};
export const FONTS = fv(amiri, ruqaa, greatVibes, amita);
/** Lantern-brass foil. */
export const BRASS = { "--wa-f1": "#8a6418", "--wa-f2": "#fff0b8", "--wa-f3": "#d4af37" } as React.CSSProperties;
export const arabic = { fontFamily: "var(--wa-ruqaa), var(--wa-amiri), serif" } as React.CSSProperties;
export const naskh = { fontFamily: "var(--wa-amiri), serif" } as React.CSSProperties;
