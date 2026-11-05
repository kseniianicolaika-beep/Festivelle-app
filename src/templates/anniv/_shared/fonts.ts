import { Alice, Caveat, Cormorant_SC, Great_Vibes, Old_Standard_TT, Poiret_One, Prata, PT_Mono, Tenor_Sans, Yeseva_One } from "next/font/google";

// Extra faces for the anniversary collection. Every face covers Latin + Cyrillic; Devanagari falls back to the
// app-wide Tiro / Rozha faces (declared in app/layout.tsx) which we always append to each stack.
export const greatVibes = Great_Vibes({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--an-vibes" });
export const prata = Prata({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--an-prata" });
export const tenor = Tenor_Sans({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--an-tenor" });
export const alice = Alice({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--an-alice" });
export const caveat = Caveat({ subsets: ["latin", "cyrillic"], weight: ["400", "600"], preload: false, variable: "--an-caveat" });
export const oldStandard = Old_Standard_TT({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], style: ["normal", "italic"], preload: false, variable: "--an-oldstd" });
export const ptMono = PT_Mono({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--an-mono" });
export const poiret = Poiret_One({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--an-poiret" });
export const yeseva = Yeseva_One({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--an-yeseva" });
export const cormSC = Cormorant_SC({ subsets: ["latin", "cyrillic"], weight: ["300", "500"], preload: false, variable: "--an-cormsc" });

/** All variables on one className — put it on each template root. */
export const annivFontVars = [greatVibes, prata, tenor, alice, caveat, oldStandard, ptMono, poiret, yeseva, cormSC].map((f) => f.variable).join(" ");

const DEVA = "var(--font-deva), var(--font-rozha)";
export const STACK = {
  cormorant: `var(--font-cormorant), ${DEVA}, Georgia, serif`,
  vibes: `var(--an-vibes), var(--font-script), ${DEVA}, cursive`,
  prata: `var(--an-prata), var(--font-playfair), ${DEVA}, Georgia, serif`,
  tenor: `var(--an-tenor), ${DEVA}, system-ui, sans-serif`,
  alice: `var(--an-alice), var(--font-cormorant), ${DEVA}, Georgia, serif`,
  caveat: `var(--an-caveat), var(--font-badscript), ${DEVA}, cursive`,
  oldstd: `var(--an-oldstd), ${DEVA}, Georgia, serif`,
  mono: `var(--an-mono), ${DEVA}, ui-monospace, monospace`,
  poiret: `var(--an-poiret), var(--font-forum), ${DEVA}, sans-serif`,
  forum: `var(--font-forum), ${DEVA}, Georgia, serif`,
  yeseva: `var(--font-rozha), var(--an-yeseva), ${DEVA}, Georgia, serif`,
  cormsc: `var(--an-cormsc), var(--font-cormorant), ${DEVA}, Georgia, serif`,
  marck: `var(--font-script), ${DEVA}, cursive`,
  inter: `var(--font-inter), ${DEVA}, system-ui, sans-serif`,
  montserrat: `var(--font-montserrat), var(--font-inter), ${DEVA}, sans-serif`,
} as const;
