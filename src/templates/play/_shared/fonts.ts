import { Baloo_2, Caveat, Cormorant_Infant, Fredoka, Kalam, Kurale, Nunito, Playpen_Sans, Rubik, Shantell_Sans, Unbounded, Exo_2 } from "next/font/google";

// Picture-book faces for the children's collection. Not preloaded — fetched only when a template renders.
// Every display stack covers Latin + Cyrillic + Devanagari (browser falls through per glyph).
const fredoka = Fredoka({ variable: "--pf-fredoka", subsets: ["latin"], weight: ["400", "500", "600", "700"], preload: false });
const nunito = Nunito({ variable: "--pf-nunito", subsets: ["latin", "cyrillic"], weight: ["400", "600", "700", "800", "900"], preload: false });
const baloo = Baloo_2({ variable: "--pf-baloo", subsets: ["latin", "devanagari"], weight: ["400", "500", "600", "700", "800"], preload: false });
const playpen = Playpen_Sans({ variable: "--pf-playpen", subsets: ["latin", "cyrillic"], weight: ["300", "400", "600", "700", "800"], preload: false });
const unbounded = Unbounded({ variable: "--pf-unbounded", subsets: ["latin", "cyrillic"], weight: ["300", "500", "700", "900"], preload: false });
const exo = Exo_2({ variable: "--pf-exo", subsets: ["latin", "cyrillic"], weight: ["300", "400", "600"], preload: false });
const infant = Cormorant_Infant({ variable: "--pf-infant", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], preload: false });
const kurale = Kurale({ variable: "--pf-kurale", subsets: ["latin", "cyrillic", "devanagari"], weight: "400", preload: false });
const shantell = Shantell_Sans({ variable: "--pf-shantell", subsets: ["latin", "cyrillic"], weight: ["400", "600", "700", "800"], preload: false });
const caveat = Caveat({ variable: "--pf-caveat", subsets: ["latin", "cyrillic"], weight: ["400", "600", "700"], preload: false });
const kalam = Kalam({ variable: "--pf-kalam", subsets: ["latin", "devanagari"], weight: ["400", "700"], preload: false });
const rubik = Rubik({ variable: "--pf-rubik", subsets: ["latin", "cyrillic"], weight: ["400", "500", "700", "800", "900"], preload: false });

export const playFontVars = [fredoka, nunito, baloo, playpen, unbounded, exo, infant, kurale, shantell, caveat, kalam, rubik].map((f) => f.variable).join(" ");

/** Font stacks per template (display, body). */
export const STACKS = {
  balloon: { display: "var(--pf-fredoka), var(--pf-nunito), var(--pf-baloo), sans-serif", body: "var(--pf-nunito), var(--pf-baloo), sans-serif" },
  sea: { display: "var(--pf-playpen), var(--pf-baloo), sans-serif", body: "var(--pf-nunito), var(--pf-baloo), sans-serif" },
  star: { display: "var(--pf-unbounded), var(--pf-baloo), sans-serif", body: "var(--pf-exo), var(--pf-baloo), sans-serif" },
  moon: { display: "var(--pf-infant), var(--pf-kurale), serif", body: "var(--pf-nunito), var(--pf-baloo), sans-serif" },
  picnic: { display: "var(--pf-shantell), var(--pf-baloo), sans-serif", body: "var(--pf-nunito), var(--pf-baloo), sans-serif" },
  artist: { display: "var(--pf-caveat), var(--pf-kalam), cursive", body: "var(--pf-playpen), var(--pf-kalam), sans-serif" },
  castle: { display: "var(--pf-kurale), serif", body: "var(--pf-infant), var(--pf-kurale), serif" },
  jungle: { display: "var(--pf-rubik), var(--pf-baloo), sans-serif", body: "var(--pf-nunito), var(--pf-baloo), sans-serif" },
} as const;
