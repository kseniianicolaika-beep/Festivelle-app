import type { Profile } from "@/lib/profile";
import { langOf } from "../_shared/words";

const W = {
  en: { chapter: "Chapter", moons: "nine moons of waiting", starring: "Starring", introducing: "and introducing", baby: "Baby", tagline: "A love story, nine months in the making" },
  ru: { chapter: "Глава", moons: "девять лун ожидания", starring: "В главных ролях", introducing: "и впервые на экране", baby: "Малыш", tagline: "История любви, которую мы пишем девять месяцев" },
  hi: { chapter: "अध्याय", moons: "नौ चाँद का इंतज़ार", starring: "मुख्य भूमिका में", introducing: "और पहली बार", baby: "नन्हा मेहमान", tagline: "नौ महीनों में बुनी एक प्रेम कहानी" },
};
export const bpWords = (p: Profile) => W[langOf(p)];
