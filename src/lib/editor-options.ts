// Template-safe choices for the visual editor. Layouts read design.fonts / design.palette; the editor offers only these
// unless the celebration has the Luxury package (free colour picker).
export { FONT_PAIRS, isFontPair, type FontPairId } from "./fonts";

// Curated accents that sit well on every theme (rose, wine, gold, sage, sea, midnight, marigold, plum).
export const CURATED_ACCENTS = ["#c06c78", "#7a1f35", "#b8913f", "#6b7f5e", "#1f4e9c", "#1e2a4a", "#d2452b", "#6b3a73"];
export const isHex = (c: unknown): c is string => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c);

// Human label for an edit path: "texts.headline" → "headline", "profile.partner1" → "first name".
const LABELS: Record<string, string> = {
  "profile.partner1": "first name", "profile.partner2": "second name", "profile.venue": "venue", "profile.city": "city",
  "profile.story": "story", "profile.inviteLine": "invitation wording", "profile.blessing": "closing line", "profile.tradition": "tradition line",
  "texts.eyebrow": "top line", "texts.headline": "headline", "texts.body": "message", "texts.footer": "footer", "texts.hashtag": "hashtag", number: "table number",
};
export function pathLabel(path: string) {
  if (LABELS[path]) return LABELS[path];
  const it = path.match(/^items\.(\d+)\.(title|detail)$/);
  if (it) return `item ${Number(it[1]) + 1} ${it[2]}`;
  if (path.startsWith("section:")) return `${path.slice(8)} section`;
  if (path.startsWith("photo")) return "photo";
  return path.replace(/^(texts|profile)\./, "");
}

// Profile fields the visual editor may change directly (all plain text).
export const EDITABLE_PROFILE = ["partner1", "partner2", "venue", "city", "story", "inviteLine", "blessing", "tradition", "vibe"] as const;
