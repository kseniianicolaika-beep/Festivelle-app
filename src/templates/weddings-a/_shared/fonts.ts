import { Italiana, Great_Vibes, Pinyon_Script, EB_Garamond, IM_Fell_English, Cinzel, Cormorant_SC, Old_Standard_TT, Jost, Fraunces, Yeseva_One, Kalam, Amiri, Aref_Ruqaa, Poiret_One, Yatra_One, Amita, Tenor_Sans, Bodoni_Moda } from "next/font/google";

// Extra faces for the weddings-a suite. Not preloaded: a face downloads only when a template uses it.
// Latin-only display faces always sit in front of a Cyrillic-capable fallback in each template's stack.
export const italiana = Italiana({ variable: "--wa-italiana", subsets: ["latin"], weight: "400", preload: false });
export const greatVibes = Great_Vibes({ variable: "--wa-vibes", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
export const pinyon = Pinyon_Script({ variable: "--wa-pinyon", subsets: ["latin"], weight: "400", preload: false });
export const garamond = EB_Garamond({ variable: "--wa-garamond", subsets: ["latin", "cyrillic"], style: ["normal", "italic"], preload: false });
export const fell = IM_Fell_English({ variable: "--wa-fell", subsets: ["latin"], weight: "400", style: ["normal", "italic"], preload: false });
export const cinzel = Cinzel({ variable: "--wa-cinzel", subsets: ["latin"], preload: false });
export const cormorantSC = Cormorant_SC({ variable: "--wa-corsc", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], preload: false });
export const oldStandard = Old_Standard_TT({ variable: "--wa-oldstd", subsets: ["latin", "cyrillic"], weight: ["400", "700"], style: ["normal", "italic"], preload: false });
export const jost = Jost({ variable: "--wa-jost", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], preload: false });
export const fraunces = Fraunces({ variable: "--wa-fraunces", subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "WONK", "opsz"], preload: false });
export const yeseva = Yeseva_One({ variable: "--wa-yeseva", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
export const kalam = Kalam({ variable: "--wa-kalam", subsets: ["latin", "devanagari"], weight: ["300", "400"], preload: false });
export const amiri = Amiri({ variable: "--wa-amiri", subsets: ["latin", "arabic"], weight: ["400", "700"], style: ["normal", "italic"], preload: false });
export const ruqaa = Aref_Ruqaa({ variable: "--wa-ruqaa", subsets: ["latin", "arabic"], weight: ["400", "700"], preload: false });
export const poiret = Poiret_One({ variable: "--wa-poiret", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
export const yatra = Yatra_One({ variable: "--wa-yatra", subsets: ["latin", "devanagari"], weight: "400", preload: false });
export const amita = Amita({ variable: "--wa-amita", subsets: ["latin", "devanagari"], weight: ["400", "700"], preload: false });
export const tenor = Tenor_Sans({ variable: "--wa-tenor", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
export const bodoni = Bodoni_Moda({ variable: "--wa-bodoni", subsets: ["latin"], style: ["normal", "italic"], preload: false });

export const fv = (...f: { variable: string }[]) => f.map((x) => x.variable).join(" ");
