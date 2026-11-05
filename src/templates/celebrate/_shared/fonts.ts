import { Bodoni_Moda, Prata, Great_Vibes, Tenor_Sans, Unbounded, Monoton, Poiret_One, Limelight, Cormorant, Fraunces, Yatra_One, Cinzel, Bricolage_Grotesque, Caveat, Ruslan_Display, Kurale } from "next/font/google";

// Extra faces for the celebrate group. preload:false — files download only when a template uses them.
// Each stack ends in a Cyrillic- and Devanagari-capable face so RU / HI never fall to a system font.
const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], preload: false, variable: "--cf-bodoni" });
const prata = Prata({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--cf-prata" });
const vibes = Great_Vibes({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--cf-vibes" });
const tenor = Tenor_Sans({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--cf-tenor" });
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], preload: false, variable: "--cf-unb" });
const monoton = Monoton({ subsets: ["latin"], weight: "400", preload: false, variable: "--cf-monoton" });
const poiret = Poiret_One({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--cf-poiret" });
const limelight = Limelight({ subsets: ["latin"], weight: "400", preload: false, variable: "--cf-lime" });
const cormorant = Cormorant({ subsets: ["latin", "cyrillic"], style: ["normal", "italic"], preload: false, variable: "--cf-corm" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], preload: false, variable: "--cf-fraun", axes: ["SOFT", "opsz"] });
const yatra = Yatra_One({ subsets: ["latin", "devanagari"], weight: "400", preload: false, variable: "--cf-yatra" });
const cinzel = Cinzel({ subsets: ["latin"], preload: false, variable: "--cf-cinzel" });
const brico = Bricolage_Grotesque({ subsets: ["latin"], preload: false, variable: "--cf-brico" });
const caveat = Caveat({ subsets: ["latin", "cyrillic"], preload: false, variable: "--cf-caveat" });
const ruslan = Ruslan_Display({ subsets: ["latin", "cyrillic"], weight: "400", preload: false, variable: "--cf-ruslan" });
const kurale = Kurale({ subsets: ["latin", "cyrillic", "devanagari"], weight: "400", preload: false, variable: "--cf-kurale" });

/** Class string that defines every --cf-* variable; put it on the template root. */
export const FONT_VARS = [bodoni, prata, vibes, tenor, unbounded, monoton, poiret, limelight, cormorant, fraunces, yatra, cinzel, brico, caveat, ruslan, kurale].map((f) => f.variable).join(" ");

const DEVA = "var(--font-deva)";
/** Font stacks. Design-level font overrides (design.fonts) arrive as --f-display/--f-script/--f-body and win. */
export const F = {
  bodoni: `var(--f-display, var(--cf-bodoni)), var(--cf-prata), ${DEVA}, Georgia, serif`,
  prata: `var(--f-display, var(--cf-prata)), ${DEVA}, Georgia, serif`,
  vibes: `var(--f-script, var(--cf-vibes)), var(--font-script), ${DEVA}, cursive`,
  tenor: `var(--f-body, var(--cf-tenor)), ${DEVA}, system-ui, sans-serif`,
  unb: `var(--f-display, var(--cf-unb)), ${DEVA}, system-ui, sans-serif`,
  monoton: `var(--cf-monoton), var(--cf-unb), sans-serif`,
  poiret: `var(--f-display, var(--cf-poiret)), ${DEVA}, sans-serif`,
  lime: `var(--cf-lime), var(--cf-poiret), serif`,
  corm: `var(--f-display, var(--cf-corm)), ${DEVA}, Georgia, serif`,
  fraun: `var(--cf-fraun), var(--cf-corm), Georgia, serif`,
  yatra: `var(--f-display, var(--cf-yatra)), var(--font-rozha), var(--cf-prata), serif`,
  cinzel: `var(--cf-cinzel), var(--cf-prata), ${DEVA}, serif`,
  deva: `${DEVA}, var(--cf-corm), serif`,
  brico: `var(--f-display, var(--cf-brico)), var(--cf-unb), ${DEVA}, sans-serif`,
  caveat: `var(--f-script, var(--cf-caveat)), ${DEVA}, cursive`,
  ruslan: `var(--f-display, var(--cf-ruslan)), var(--cf-prata), ${DEVA}, serif`,
  kurale: `var(--f-body, var(--cf-kurale)), ${DEVA}, Georgia, serif`,
  marck: `var(--f-script, var(--font-script)), ${DEVA}, cursive`,
  playfair: `var(--f-display, var(--font-playfair)), ${DEVA}, Georgia, serif`,
  montserrat: `var(--f-body, var(--font-montserrat)), var(--font-inter), ${DEVA}, sans-serif`,
  cormG: `var(--f-body, var(--font-cormorant)), ${DEVA}, Georgia, serif`,
} as const;
