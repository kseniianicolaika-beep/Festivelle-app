import type { Profile } from "@/lib/profile";
import { langOf } from "../_shared/words";

// Godh bharai (Hindi) / dohale jevan (Marathi) / seemantham (South) — "filling the lap" of the mother-to-be.
// The ritual words stay in Devanagari as a bilingual flourish even on English cards.
export const SHUBH = "॥ शुभ गोद भराई ॥";

const ITEMS = {
  en: {
    program: [
      { title: "Swagat & tilak", detail: "Haldi-kumkum and a sweet for every guest" },
      { title: "Godh bharai", detail: "Her lap filled with coconut, fruit and dry fruits" },
      { title: "Choodi rasam", detail: "Green glass bangles — their chime soothes the baby" },
      { title: "Aarti & ashirwad", detail: "Blessings from the elders" },
      { title: "Bhojan", detail: "A feast of her cravings" },
    ],
    menu: [
      { title: "Mithai", detail: "Modak · Besan laddoo · Shrikhand" },
      { title: "The thali", detail: "Puran poli · Masale bhaat · Kadhi · Batata bhaji" },
      { title: "To sip", detail: "Masala chai · Aam panna · Sol kadhi" },
    ],
  },
  ru: {
    program: [
      { title: "Встреча и тилак", detail: "Хальди-кумкум и сладость для каждой гостьи" },
      { title: "Годх бхарай", detail: "Колени будущей мамы наполняют кокосом и фруктами" },
      { title: "Обряд браслетов", detail: "Зелёные стеклянные браслеты — их звон успокаивает малыша" },
      { title: "Аарти и благословение", detail: "Добрые слова старших" },
      { title: "Угощение", detail: "Любимые блюда будущей мамы" },
    ],
    menu: [
      { title: "Сладости", detail: "Модак · Ладду · Шрикханд" },
      { title: "Тхали", detail: "Пуран поли · Масале бхат · Кадхи" },
      { title: "Напитки", detail: "Масала-чай · Аам панна" },
    ],
  },
  hi: {
    program: [
      { title: "स्वागत व तिलक", detail: "हल्दी-कुमकुम और मुँह मीठा" },
      { title: "गोद भराई", detail: "नारियल, फल और मेवों से गोद भरना" },
      { title: "चूड़ी रस्म", detail: "हरी काँच की चूड़ियाँ — इनकी खनक शिशु को सुकून देती है" },
      { title: "आरती व आशीर्वाद", detail: "बड़ों का स्नेहाशीष" },
      { title: "भोजन", detail: "होने वाली माँ की पसंद के पकवान" },
    ],
    menu: [
      { title: "मिठाई", detail: "मोदक · बेसन लड्डू · श्रीखंड" },
      { title: "थाली", detail: "पूरन पोली · मसाले भात · कढ़ी" },
      { title: "पेय", detail: "मसाला चाय · आम पन्ना" },
    ],
  },
};
export const gbItems = (p: Profile, which: "program" | "menu") => ITEMS[langOf(p)][which];

const SUB = { en: "filling her lap with blessings", ru: "наполняем колени благословениями", hi: "आशीर्वाद से भरी गोद" };
export const gbSub = (p: Profile) => SUB[langOf(p)];
const TITLE = { en: "Godh Bharai", ru: "Годх Бхарай", hi: "गोद भराई" };
export const gbTitle = (p: Profile) => TITLE[langOf(p)];
