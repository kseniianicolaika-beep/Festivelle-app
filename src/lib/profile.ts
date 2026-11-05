export type WeddingEvent = { name: string; date?: string; time?: string; venue?: string };

export type Profile = {
  occasion?: import("./occasions").OccasionId; // default "wedding"
  age?: number; // birthdays / anniversaries (years)
  partner1?: string;
  partner2?: string;
  culture?: "indian" | "russian" | "fusion" | "other";
  tradition?: string; // e.g. Goan Catholic, Punjabi, Orthodox
  date?: string; // ISO yyyy-mm-dd
  city?: string;
  venue?: string;
  events?: WeddingEvent[];
  vibe?: string;
  language?: "en" | "ru" | "hi";
  story?: string;
  heroKey?: string; // object-storage key of the couple's photo
  inviteLine?: string; // AI-written invitation wording, in the guest language
  blessing?: string; // short closing line / blessing for the card and site
};

export const LANG_LABEL = { en: "English", ru: "Русский", hi: "हिन्दी" } as const;

export function coupleNames(p: Profile) {
  return [p.partner1 || "Partner", p.partner2 || "Partner"] as const;
}

export function formatDate(iso: string | undefined, lang: Profile["language"] = "en") {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  const locale = lang === "ru" ? "ru-RU" : lang === "hi" ? "hi-IN" : "en-GB";
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
