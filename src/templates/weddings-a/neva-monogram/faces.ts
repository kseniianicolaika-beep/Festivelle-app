import { fv, oldStandard, cormorantSC, greatVibes, amita } from "../_shared/fonts";

export const FACES = {
  display: "var(--wa-oldstd), var(--font-deva), Georgia, serif",
  script: "var(--wa-vibes), var(--wa-amita), cursive",
  body: "var(--font-cormorant), var(--font-deva), Georgia, serif",
};
export const FONTS = fv(oldStandard, cormorantSC, greatVibes, amita);
export const sc = { fontFamily: "var(--wa-corsc), var(--font-deva), Georgia, serif", letterSpacing: "0.22em" } as const;
export const NEVA = {
  en: { nights: "White Nights", sunset: "sunset", sunrise: "sunrise", chapter: "Chapter" },
  ru: { nights: "Белые ночи", sunset: "закат", sunrise: "рассвет", chapter: "Глава" },
  hi: { nights: "श्वेत रातें", sunset: "सूर्यास्त", sunrise: "सूर्योदय", chapter: "अध्याय" },
} as const;
