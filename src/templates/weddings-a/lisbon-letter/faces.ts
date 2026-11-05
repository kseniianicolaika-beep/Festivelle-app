import { fv, fell, garamond, pinyon, greatVibes, amita } from "../_shared/fonts";

export const FACES = {
  display: "var(--wa-fell), var(--wa-garamond), var(--font-deva), Georgia, serif",
  script: "var(--wa-pinyon), var(--wa-vibes), var(--wa-amita), cursive",
  body: "var(--wa-garamond), var(--font-deva), Georgia, serif",
};
export const FONTS = fv(fell, garamond, pinyon, greatVibes, amita);
export const SALUTE = {
  en: { dear: "Dearest family & friends,", love: "With love,", reply: "Répondez s’il vous plaît", page: "page", mass: "The Nuptial Mass", post: "Par avion · Via aérea" },
  ru: { dear: "Дорогие родные и друзья,", love: "С любовью,", reply: "Будем ждать вашего ответа", page: "стр.", mass: "Венчание", post: "Авиа · Via aérea" },
  hi: { dear: "प्रिय परिवारजन एवं मित्रों,", love: "सप्रेम,", reply: "कृपया उत्तर दें", page: "पृष्ठ", mass: "विवाह संस्कार", post: "हवाई डाक · Via aérea" },
} as const;
