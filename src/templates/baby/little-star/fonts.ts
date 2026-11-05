import { Baloo_2, Caveat, Nunito } from "next/font/google";

export const lsDisplay = Nunito({ subsets: ["latin", "cyrillic"], weight: ["400", "600", "800", "900"], variable: "--ls-display", preload: false });
export const lsHand = Caveat({ subsets: ["latin", "cyrillic"], weight: ["500", "700"], variable: "--ls-hand", preload: false });
export const lsDeva = Baloo_2({ subsets: ["devanagari"], weight: ["500", "700", "800"], variable: "--ls-deva", preload: false });
export const lsFonts = `${lsDisplay.variable} ${lsHand.variable} ${lsDeva.variable}`;
