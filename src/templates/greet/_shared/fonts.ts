import { Amiri, Amita, Aref_Ruqaa, Caveat, EB_Garamond, Great_Vibes, Kurale, Nunito, Old_Standard_TT, Poiret_One, Ruslan_Display, Tenor_Sans, Yatra_One, Yeseva_One } from "next/font/google";

// Extra faces for the greeting suite. Never preloaded: a face downloads only when a template's CSS uses it.
// Every Latin display face is paired with a Cyrillic- and Devanagari-capable fallback in the template CSS.
const vibes = Great_Vibes({ variable: "--gf-vibes", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const garamond = EB_Garamond({ variable: "--gf-garamond", subsets: ["latin", "cyrillic"], style: ["normal", "italic"], preload: false });
const poiret = Poiret_One({ variable: "--gf-poiret", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const amiri = Amiri({ variable: "--gf-amiri", subsets: ["arabic", "latin"], weight: ["400", "700"], preload: false });
const ruqaa = Aref_Ruqaa({ variable: "--gf-ruqaa", subsets: ["arabic", "latin"], weight: ["400", "700"], preload: false });
const oldstd = Old_Standard_TT({ variable: "--gf-oldstd", subsets: ["latin", "cyrillic"], weight: ["400", "700"], style: ["normal", "italic"], preload: false });
const yeseva = Yeseva_One({ variable: "--gf-yeseva", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const ruslan = Ruslan_Display({ variable: "--gf-ruslan", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const kurale = Kurale({ variable: "--gf-kurale", subsets: ["latin", "cyrillic", "devanagari"], weight: "400", preload: false });
const tenor = Tenor_Sans({ variable: "--gf-tenor", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const caveat = Caveat({ variable: "--gf-caveat", subsets: ["latin", "cyrillic"], preload: false });
const amita = Amita({ variable: "--gf-amita", subsets: ["devanagari", "latin"], weight: ["400", "700"], preload: false });
const yatra = Yatra_One({ variable: "--gf-yatra", subsets: ["devanagari", "latin"], weight: "400", preload: false });
const nunito = Nunito({ variable: "--gf-nunito", subsets: ["latin", "cyrillic"], preload: false });

export const GREET_FONTS = [vibes, garamond, poiret, amiri, ruqaa, oldstd, yeseva, ruslan, kurale, tenor, caveat, amita, yatra, nunito].map((f) => f.variable).join(" ");
