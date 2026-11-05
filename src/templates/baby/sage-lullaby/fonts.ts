import { Alegreya, Manrope } from "next/font/google";

export const slSerif = Alegreya({ subsets: ["latin", "cyrillic"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--sl-serif", preload: false });
export const slSans = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--sl-sans", preload: false });
export const slFonts = `${slSerif.variable} ${slSans.variable}`;
