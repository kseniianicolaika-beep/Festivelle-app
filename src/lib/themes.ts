import type { MotifId } from "./motifs";

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
  motif: MotifId;
  dark?: boolean;
  foil: [string, string];
  petals: string[];
};

// Eight design worlds. Each one is a full palette + foil + petal colours + default motif.
export const THEMES: Theme[] = [
  { id: "konkan-sunset", name: "Konkan Sunset", mood: "Barefoot on the beach at golden hour", bg: "#FBF3EA", surface: "#FFFAF4", ink: "#3B1F1A", muted: "#8A6A5E", accent: "#C8553D", gold: "#D9A441", motif: "palms", foil: ["#7a4f22", "#d7a95c"], petals: ["#f2c6c8", "#e8a3ab", "#f6dcd2", "#f0b49a"] },
  { id: "azulejo", name: "Azulejo", mood: "Portuguese villas and hand-painted tiles of old Goa", bg: "#F6F8FC", surface: "#FFFFFF", ink: "#13294B", muted: "#5B6B86", accent: "#1F4E9C", gold: "#B89A5B", motif: "azulejo", foil: ["#173f86", "#6f97d6"], petals: ["#dbe5f5", "#f6e8d8", "#c7d6ef", "#ffffff"] },
  { id: "rajwada", name: "Rajwada", mood: "Royal heritage, marigold and candlelit arches", bg: "#3A0D12", surface: "#4A1419", ink: "#F6E7C8", muted: "#D9BFA0", accent: "#E2A33B", gold: "#C9A24A", motif: "arch", dark: true, foil: ["#d6a650", "#fff0c4"], petals: ["#f2a93b", "#e8862a", "#f7c66b", "#c9452f"] },
  { id: "belaya-noch", name: "Belaya Noch", mood: "White Nights — silver birch, ivory and Petersburg light", bg: "#F3F5F7", surface: "#FFFFFF", ink: "#1E2A38", muted: "#66788C", accent: "#5E7A96", gold: "#A8B4C0", motif: "birch", foil: ["#3f5166", "#a9bccf"], petals: ["#e6ecf2", "#cfd9e3", "#f5f7fa", "#bac7d4"] },
  { id: "mogra", name: "Mogra", mood: "Quiet, modern, jasmine-white minimalism", bg: "#FFFDF8", surface: "#FFFFFF", ink: "#2B2B2B", muted: "#7A7A70", accent: "#6B7F5E", gold: "#B5A27A", motif: "jasmine", foil: ["#4f5f45", "#b5a27a"], petals: ["#ffffff", "#f4f1e6", "#e9eee2", "#fbfaf3"] },
  { id: "gulmohar", name: "Gulmohar", mood: "Haldi mornings — marigold, turmeric and flame-tree blossom", bg: "#FFF5E8", surface: "#FFFBF3", ink: "#4A2310", muted: "#9A6A48", accent: "#D2452B", gold: "#E0A43A", motif: "marigold", foil: ["#9a4a12", "#f2b544"], petals: ["#f7b733", "#f39c34", "#e8552f", "#ffd27a"] },
  { id: "noor", name: "Noor", mood: "Emerald and gold — lantern light for a nikah or a grand evening", bg: "#0F2E28", surface: "#143A33", ink: "#F3E9D2", muted: "#BFB59A", accent: "#D4AF37", gold: "#D4AF37", motif: "lattice", dark: true, foil: ["#c9a43a", "#fbe7a6"], petals: ["#d4af37", "#f3e9d2", "#9ccfb8", "#e9d48a"] },
  { id: "sangeet-night", name: "Sangeet Night", mood: "Midnight blue, starlight and dancing till dawn", bg: "#141833", surface: "#1B2045", ink: "#F4ECFF", muted: "#B7B0D6", accent: "#E9B949", gold: "#E9B949", motif: "stars", dark: true, foil: ["#d9a93a", "#fff1c2"], petals: ["#e9b949", "#c9b8ff", "#ffffff", "#f6d68a"] },
];

export const themeById = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0];

export function pickTheme(vibe = "", culture = ""): string {
  const v = vibe.toLowerCase();
  if (/beach|sunset|sea|coast/.test(v)) return "konkan-sunset";
  if (/azulejo|portug|villa|tile|church|heritage goa/.test(v)) return "azulejo";
  if (/haldi|marigold|turmeric|gulmohar|bright|colou?rful/.test(v)) return "gulmohar";
  if (/emerald|nikah|noor|lantern/.test(v)) return "noor";
  if (/sangeet|night|party|star|midnight/.test(v)) return "sangeet-night";
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
    "--foil-a": t.foil[0],
    "--foil-b": t.foil[1],
  }) as React.CSSProperties;

export const petalColors = (t: Theme) => t.petals;
