import { fv, poiret, bodoni, yatra, jost } from "../_shared/fonts";

// Deco display (Poiret One, Cyrillic) → Yatra One for Devanagari; Bodoni italic accents → Playfair for Cyrillic.
export const FACES = {
  display: "var(--wa-poiret), var(--wa-yatra), var(--font-deva), sans-serif",
  script: "var(--wa-bodoni), var(--font-playfair), var(--wa-yatra), Georgia, serif",
  body: "var(--wa-jost), var(--font-deva), system-ui, sans-serif",
};
export const FONTS = fv(poiret, bodoni, yatra, jost);

export const LINES = {
  en: { night: "An evening of music, dance & starlight", setlist: "The setlist", dance: "Will you dance with us?", track: "Track", until: "nights to go", dress: "Dress: shimmer & sequins" },
  ru: { night: "Вечер музыки, танцев и звёзд", setlist: "Программа вечера", dance: "Потанцуете с нами?", track: "Трек", until: "ночей осталось", dress: "Дресс-код: блеск и пайетки" },
  hi: { night: "संगीत, नृत्य और सितारों की एक शाम", setlist: "संगीत सूची", dance: "क्या आप हमारे साथ नाचेंगे?", track: "गीत", until: "रातें शेष", dress: "परिधान: चमक और सितारे" },
} as const;
