import type { Look } from "../_shared/kit";
import { F } from "../_shared/fonts";

// Vologda Lace — ivory cotton, cream bobbin lace, church gold, faded rose and dusty blue.
export const VL = { ivory: "#f6efe2", paper: "#fbf7ee", cream: "#fffcf5", thread: "#b49c78", ink: "#3f3226", muted: "#8a7663", gold: "#b48a4a", goldHi: "#e7c98d", rose: "#c49790", blue: "#7f95aa" } as const;

export const VOLOGDA_LOOK: Look = { bg: VL.ivory, surface: VL.paper, ink: VL.ink, muted: VL.muted, accent: VL.rose, gold: VL.gold, foilA: "#8f6a33", foilB: "#e7c98d", display: F.corm, script: F.marck, body: F.corm };

const LOC = { en: "en-GB", ru: "ru-RU", hi: "hi-IN" } as const;
/** Month as it reads after a day number (Russian genitive: «10 июля», not «июль»). */
export function monthOf(iso: string | undefined, lang: "en" | "ru" | "hi") {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(LOC[lang], { day: "numeric", month: "long", timeZone: "UTC" }).replace(/[0-9०-९]+/g, "").trim();
}
