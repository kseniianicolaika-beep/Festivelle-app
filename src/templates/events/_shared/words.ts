import type { Profile } from "@/lib/profile";
import { nameParts, occasionOf } from "@/lib/occasions";
import type { Design, Kind } from "@/lib/templates";
import { cardText, langOf, words, type Lang } from "../../celebrate/_shared/words";

export { fmt, where, whereFull, mapHref, media, dateParts, fit, shapeOf, langOf } from "../../celebrate/_shared/words";

type EvOcc = "bridal_shower" | "rehearsal_dinner" | "gender_reveal" | "baptism";
const isEv = (o: string): o is EvOcc => o === "bridal_shower" || o === "rehearsal_dinner" || o === "gender_reveal" || o === "baptism";

// Occasion-specific words for the events group (bridal shower, rehearsal dinner, gender reveal, baptism).
const OW: Record<EvOcc, Record<Lang, { kicker: string; line: string; title: string; tag: string; thanks: string; about: string; welcome: string }>> = {
  bridal_shower: {
    en: { kicker: "A shower for the bride-to-be", line: "the bride-to-be", title: "Bridal shower", tag: "Shower", thanks: "for showering the bride with so much love", about: "About the bride", welcome: "Welcome to the shower" },
    ru: { kicker: "Девичник в честь невесты", line: "невеста", title: "Девичник", tag: "Devichnik", thanks: "за любовь и тёплые слова невесте", about: "О невесте", welcome: "Добро пожаловать на девичник" },
    hi: { kicker: "दुल्हन के लिए", line: "होने वाली दुल्हन", title: "ब्राइडल शॉवर", tag: "Shower", thanks: "दुल्हन पर इतना प्यार बरसाने के लिए", about: "दुल्हन के बारे में", welcome: "स्वागत है" },
  },
  rehearsal_dinner: {
    en: { kicker: "The night before the wedding", line: "the night before we say I do", title: "Rehearsal dinner", tag: "TheNightBefore", thanks: "for the toasts, the laughter and the night before", about: "A few words from us", welcome: "Welcome to dinner" },
    ru: { kicker: "Вечер накануне свадьбы", line: "накануне свадьбы", title: "Предсвадебный ужин", tag: "Nakanune", thanks: "за тосты, смех и этот вечер накануне", about: "Пару слов от нас", welcome: "Добро пожаловать на ужин" },
    hi: { kicker: "शादी से पहले की शाम", line: "शादी से पहले की शाम", title: "रात्रिभोज", tag: "TheNightBefore", thanks: "इस खूबसूरत शाम के लिए", about: "हमारी ओर से", welcome: "स्वागत है" },
  },
  gender_reveal: {
    en: { kicker: "Boy or girl?", line: "pink or blue? find out with us", title: "Gender reveal", tag: "PinkOrBlue", thanks: "for sharing the sweetest surprise with us", about: "Our little news", welcome: "Pink or blue?" },
    ru: { kicker: "Мальчик или девочка?", line: "розовый или голубой?", title: "Гендер-пати", tag: "MalchikIliDevochka", thanks: "что разделили с нами этот сюрприз", about: "Наша маленькая новость", welcome: "Розовый или голубой?" },
    hi: { kicker: "लड़का या लड़की?", line: "गुलाबी या नीला?", title: "जेंडर रिवील", tag: "PinkOrBlue", thanks: "इस प्यारे सरप्राइज़ में साथ देने के लिए", about: "हमारी खुशखबरी", welcome: "गुलाबी या नीला?" },
  },
  baptism: {
    en: { kicker: "With joy we invite you to the baptism of", line: "is being baptised", title: "Baptism", tag: "Baptism", thanks: "for your prayers and blessings on this sacred day", about: "A few words", welcome: "Welcome" },
    ru: { kicker: "С радостью приглашаем на крестины", line: "в день Святого Крещения", title: "Крестины", tag: "Krestiny", thanks: "за молитвы и добрые пожелания в этот светлый день", about: "Пару слов", welcome: "Добро пожаловать" },
    hi: { kicker: "नामकरण संस्कार", line: "का नामकरण संस्कार", title: "नामकरण", tag: "Naming", thanks: "आपके आशीर्वाद के लिए", about: "कुछ शब्द", welcome: "स्वागत है" },
  },
};

export function ew(p: Profile) {
  const o = occasionOf(p);
  const occ = OW[isEv(o) ? o : "bridal_shower"][langOf(p)];
  return { ...words(p), ...occ };
}

/** Names as one line ("Anya & Rohan" or "Sofia") and their parts. */
export function names(p: Profile) {
  const [a, b] = nameParts(p);
  return { a, b, both: b ? `${a} & ${b}` : a };
}

/** What each piece says — the celebrate copy, re-voiced for this occasion. */
export function eventText(kind: Kind, d: Design, p: Profile) {
  const c = cardText(kind, d, p);
  const W = ew(p);
  const n = names(p);
  const x = d.texts ?? {};
  const line = W.line;
  const tagBase = `#${n.a.replace(/[^\p{L}\p{N}]/gu, "")}${W.tag}`;
  const over: Partial<typeof c> = { line, name: n.both };
  if (kind === "welcome") Object.assign(over, { eyebrow: x.eyebrow ?? W.welcome, line });
  if (kind === "hashtag") Object.assign(over, { hashtag: x.hashtag ?? tagBase });
  if (kind === "thankyou") Object.assign(over, { body: x.body ?? W.thanks });
  if (kind === "greeting") Object.assign(over, { headline: x.headline ?? W.title });
  if (kind === "save" || kind === "post") Object.assign(over, { eyebrow: x.eyebrow ?? W.kicker });
  return { ...c, ...over };
}
