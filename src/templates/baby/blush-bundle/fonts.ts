import { EB_Garamond, Great_Vibes } from "next/font/google";

export const bbScript = Great_Vibes({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--bb-script", preload: false });
export const bbSerif = EB_Garamond({ subsets: ["latin", "cyrillic"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--bb-serif", preload: false });
export const bbFonts = `${bbScript.variable} ${bbSerif.variable}`;
