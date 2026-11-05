import type { Profile } from "@/lib/profile";
import { langOf } from "../_shared/words";

const W = {
  en: { vol: "Vol. I · Issue 01", no: "No.", inside: "Inside", lines: ["The little one", "A lullaby in green", "The details, page 3"], plate: "Plate", fig: "Fig.", contents: "Contents", lullaby: "hush, little one" },
  ru: { vol: "Том I · Выпуск 01", no: "№", inside: "В номере", lines: ["Наш малыш", "Колыбельная в зелёном", "Подробности, стр. 3"], plate: "Таблица", fig: "Рис.", contents: "Содержание", lullaby: "баю-баюшки-баю" },
  hi: { vol: "खंड I · अंक 01", no: "क्र.", inside: "इस अंक में", lines: ["हमारा नन्हा", "हरी लोरी", "विवरण, पृष्ठ 3"], plate: "चित्र", fig: "चित्र", contents: "अनुक्रम", lullaby: "चंदा मामा दूर के" },
};
export const slWords = (p: Profile) => W[langOf(p)];
