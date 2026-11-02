export type Theme = {
  id: string;
  name: string;
  mood: string;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  gold: string;
  motif: "palms" | "azulejo" | "arch" | "birch" | "jasmine";
};

export const THEMES: Theme[] = [
  { id: "konkan-sunset", name: "Konkan Sunset", mood: "Barefoot on the beach at golden hour", bg: "#FBF3EA", surface: "#FFFaf4", ink: "#3B1F1A", muted: "#8A6A5E", accent: "#C8553D", gold: "#D9A441", motif: "palms" },
  { id: "azulejo", name: "Azulejo", mood: "Portuguese villas and hand-painted tiles of old Goa", bg: "#F6F8FC", surface: "#FFFFFF", ink: "#13294B", muted: "#5B6B86", accent: "#1F4E9C", gold: "#B89A5B", motif: "azulejo" },
  { id: "rajwada", name: "Rajwada", mood: "Royal heritage, marigold and candlelit arches", bg: "#3A0D12", surface: "#4A1419", ink: "#F6E7C8", muted: "#D9BFA0", accent: "#E2A33B", gold: "#C9A24A", motif: "arch" },
  { id: "belaya-noch", name: "Belaya Noch", mood: "White Nights — silver birch, ivory and Petersburg light", bg: "#F3F5F7", surface: "#FFFFFF", ink: "#1E2A38", muted: "#66788C", accent: "#5E7A96", gold: "#A8B4C0", motif: "birch" },
  { id: "mogra", name: "Mogra", mood: "Quiet, modern, jasmine-white minimalism", bg: "#FFFDF8", surface: "#FFFFFF", ink: "#2B2B2B", muted: "#7A7A70", accent: "#6B7F5E", gold: "#B5A27A", motif: "jasmine" },
];

export const themeById = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0];

export function pickTheme(vibe = "", culture = ""): string {
  const v = vibe.toLowerCase();
  if (/beach|sunset|sea|coast/.test(v)) return "konkan-sunset";
  if (/azulejo|portug|villa|tile|church|heritage goa/.test(v)) return "azulejo";
  if (/royal|palace|rajwada|grand|heritage/.test(v)) return "rajwada";
  if (/white|birch|winter|petersburg|classic russian|belaya/.test(v)) return "belaya-noch";
  if (/minimal|modern|garden|quiet|jasmine|mogra/.test(v)) return "mogra";
  if (culture === "russian") return "belaya-noch";
  if (culture === "indian") return "rajwada";
  return "konkan-sunset";
}

export const themeVars = (t: Theme) =>
  ({
    "--t-bg": t.bg,
    "--t-surface": t.surface,
    "--t-ink": t.ink,
    "--t-muted": t.muted,
    "--t-accent": t.accent,
    "--t-gold": t.gold,
  }) as React.CSSProperties;
