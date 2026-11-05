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
  // ── Beyond weddings ──
  { id: "rose-quartz", name: "Rose Quartz", mood: "Blush silk, a solitaire and the hush after yes", bg: "#FBF0F0", surface: "#FFF8F7", ink: "#4A2230", muted: "#9A7280", accent: "#C0617A", gold: "#C9A27A", motif: "rings", foil: ["#9c5a62", "#e9c3a6"], petals: ["#f4c7cf", "#f9dfe2", "#e9a9b6", "#fff1ee"] },
  { id: "champagne-noir", name: "Champagne Noir", mood: "Black tie, candlelight and a tower of coupes", bg: "#141112", surface: "#1D1819", ink: "#F5EBDD", muted: "#B8A994", accent: "#E4C58E", gold: "#D8B46A", motif: "champagne", dark: true, foil: ["#b98b3e", "#fbe6b4"], petals: ["#e4c58e", "#fff3dc", "#c9a35e", "#f6dcb0"] },
  { id: "confetti-garden", name: "Confetti Garden", mood: "Sunny lawns, paper bunting and balloons in every colour", bg: "#FFF9EE", surface: "#FFFDF7", ink: "#2F3A56", muted: "#7C7F94", accent: "#F0715A", gold: "#F2B84B", motif: "balloons", foil: ["#e0623e", "#f6c25a"], petals: ["#f7b2a6", "#ffd86b", "#9fd8cb", "#b9c8ff"] },
  { id: "cloud-nursery", name: "Cloud Nursery", mood: "Powder blue, soft clouds and a sleepy crescent moon", bg: "#F4F7FB", surface: "#FFFFFF", ink: "#2E3A55", muted: "#7B87A0", accent: "#8BA7D1", gold: "#D9B98A", motif: "moon", foil: ["#6b84ad", "#e2c79c"], petals: ["#dfe8f6", "#f6e3e8", "#ffffff", "#e9eef8"] },
  { id: "pearl", name: "Pearl", mood: "Ivory, lustre and the quiet grace of many years", bg: "#F8F5EF", surface: "#FFFDF9", ink: "#2D2A26", muted: "#857D72", accent: "#9A8468", gold: "#BBA98A", motif: "doves", foil: ["#8a7a63", "#e8dcc6"], petals: ["#ffffff", "#efe8dc", "#f7f2ea", "#e3dbcd"] },
  { id: "ruby", name: "Ruby", mood: "Deep claret, velvet and forty years of devotion", bg: "#2B0B14", surface: "#3A1120", ink: "#F7E6E0", muted: "#D2AFA8", accent: "#E2526B", gold: "#D8A657", motif: "rings", dark: true, foil: ["#c48a43", "#ffe1b0"], petals: ["#b3203f", "#e2526b", "#f3b0b9", "#d8a657"] },
  { id: "love-letter", name: "Love Letter", mood: "Cotton paper, a silk ribbon and handwriting you can feel", bg: "#FBF6EE", surface: "#FFFCF6", ink: "#3A2A24", muted: "#8C7769", accent: "#B5546B", gold: "#C6A36F", motif: "ribbon", foil: ["#8e5b4a", "#e2bf8c"], petals: ["#f4d3d3", "#f9e8dc", "#e8b9bf", "#fff6ee"] },
];

/** Themes most fitting for an occasion, first = default. Couples can always choose any. */
export const OCCASION_THEMES: Record<string, string[]> = {
  wedding: ["konkan-sunset", "azulejo", "rajwada", "belaya-noch", "mogra", "gulmohar", "noor", "sangeet-night"],
  engagement: ["rose-quartz", "champagne-noir", "azulejo", "mogra", "sangeet-night", "konkan-sunset"],
  anniversary: ["pearl", "ruby", "belaya-noch", "rajwada", "love-letter", "noor"],
  birthday: ["champagne-noir", "sangeet-night", "rose-quartz", "konkan-sunset", "gulmohar", "mogra"],
  kids: ["confetti-garden", "cloud-nursery", "gulmohar", "sangeet-night", "konkan-sunset"],
  baby_shower: ["cloud-nursery", "rose-quartz", "mogra", "pearl", "confetti-garden"],
  greeting: ["love-letter", "rose-quartz", "champagne-noir", "pearl", "gulmohar", "noor", "sangeet-night", "cloud-nursery"],
};

export const themeById = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0];

export function pickTheme(vibe = "", culture = ""): string {
  const v = vibe.toLowerCase();
  if (/beach|sunset|sea|coast/.test(v)) return "konkan-sunset";
  if (/azulejo|portug|villa|tile|church|heritage goa/.test(v)) return "azulejo";
  if (/haldi|marigold|turmeric|gulmohar|bright|colou?rful/.test(v)) return "gulmohar";
  if (/emerald|nikah|noor|lantern/.test(v)) return "noor";
  if (/champagne|black tie|noir|cocktail/.test(v)) return "champagne-noir";
  if (/confetti|balloon|unicorn|jungle|dinosaur|circus|rainbow/.test(v)) return "confetti-garden";
  if (/cloud|nursery|lullaby|powder|baby|space|moon/.test(v)) return "cloud-nursery";
  if (/blush|rose quartz|pink|romantic/.test(v)) return "rose-quartz";
  if (/pearl|ivory|timeless/.test(v)) return "pearl";
  if (/ruby|claret|velvet/.test(v)) return "ruby";
  if (/letter|ribbon|handwritten/.test(v)) return "love-letter";
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
