import { Amita, Caveat, Cormorant, Cormorant_SC, Great_Vibes, Jost, Kalam, Laila, Manrope, Poiret_One, Prata, PT_Mono, Spectral, Tenor_Sans, Yeseva_One } from "next/font/google";

// Faces for the weddings-b bespoke suites. Not preloaded — a face downloads only when a template paints with it.
// Every Latin face is paired with a Cyrillic- and Devanagari-capable fallback in the stacks below.
const poiret = Poiret_One({ variable: "--wb-poiret", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const vibes = Great_Vibes({ variable: "--wb-vibes", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const jost = Jost({ variable: "--wb-jost", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], preload: false });
const corm = Cormorant({ variable: "--wb-corm", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], preload: false });
const cormSC = Cormorant_SC({ variable: "--wb-cormsc", subsets: ["latin", "cyrillic"], weight: ["400", "500"], preload: false });
const yeseva = Yeseva_One({ variable: "--wb-yeseva", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const manrope = Manrope({ variable: "--wb-manrope", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600"], preload: false });
const amita = Amita({ variable: "--wb-amita", subsets: ["latin", "devanagari"], weight: ["400", "700"], preload: false });
const kalam = Kalam({ variable: "--wb-kalam", subsets: ["latin", "devanagari"], weight: ["300", "400"], preload: false });
const laila = Laila({ variable: "--wb-laila", subsets: ["latin", "devanagari"], weight: ["300", "400", "500"], preload: false });
const tenor = Tenor_Sans({ variable: "--wb-tenor", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const spectral = Spectral({ variable: "--wb-spectral", subsets: ["latin", "cyrillic"], weight: ["200", "300", "400"], style: ["normal", "italic"], preload: false });
const prata = Prata({ variable: "--wb-prata", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const caveat = Caveat({ variable: "--wb-caveat", subsets: ["latin", "cyrillic"], weight: ["400", "500", "700"], preload: false });
const mono = PT_Mono({ variable: "--wb-mono", subsets: ["latin", "cyrillic"], weight: "400", preload: false });

/** Class that exposes every face as a CSS variable — put it on the template root. */
export const FONT_CLASS = [poiret, vibes, jost, corm, cormSC, yeseva, manrope, amita, kalam, laila, tenor, spectral, prata, caveat, mono].map((f) => f.variable).join(" ");

const DEVA = "var(--font-deva), var(--font-rozha)";
/** Ready-made stacks (Latin/Cyrillic face first, Devanagari fallback per glyph). */
export const F = {
  poiret: `var(--wb-poiret), var(--font-forum), ${DEVA}, Georgia, serif`,
  vibes: `var(--wb-vibes), var(--font-script), ${DEVA}, cursive`,
  jost: `var(--wb-jost), ${DEVA}, system-ui, sans-serif`,
  corm: `var(--wb-corm), var(--font-cormorant), ${DEVA}, Georgia, serif`,
  cormSC: `var(--wb-cormsc), var(--wb-corm), ${DEVA}, Georgia, serif`,
  marck: `var(--font-script), var(--wb-vibes), ${DEVA}, cursive`,
  yeseva: `var(--wb-yeseva), ${DEVA}, Georgia, serif`,
  manrope: `var(--wb-manrope), ${DEVA}, system-ui, sans-serif`,
  amita: `var(--wb-amita), var(--font-script), cursive`,
  kalam: `var(--wb-kalam), var(--font-badscript), cursive`,
  laila: `var(--wb-laila), var(--font-lora), Georgia, serif`,
  tenor: `var(--wb-tenor), ${DEVA}, system-ui, sans-serif`,
  spectral: `var(--wb-spectral), ${DEVA}, Georgia, serif`,
  prata: `var(--wb-prata), var(--font-rozha), var(--font-deva), Georgia, serif`,
  caveat: `var(--wb-caveat), var(--wb-kalam), cursive`,
  mono: `var(--wb-mono), var(--wb-kalam), ui-monospace, monospace`,
  deva: `var(--font-deva), var(--font-rozha), serif`,
} as const;
