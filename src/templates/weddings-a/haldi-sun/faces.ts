import { fv, fraunces, yeseva, kalam, yatra } from "../_shared/fonts";

// Fraunces (soft, wonky) for joy; Yeseva One carries Cyrillic; Yatra One / Kalam carry Devanagari.
export const FACES = {
  display: "var(--wa-fraunces), var(--wa-yeseva), var(--wa-yatra), Georgia, serif",
  script: "var(--wa-kalam), var(--font-badscript), cursive",
  body: "var(--wa-fraunces), var(--font-lora), var(--wa-kalam), Georgia, serif",
};
export const FONTS = fv(fraunces, yeseva, kalam, yatra);

const LINE = { en: "come dressed in sunshine", ru: "приходите в цвете солнца", hi: "पीले रंग में रंग जाइए" } as const;
export const sunshine = (l: "en" | "ru" | "hi") => LINE[l];
