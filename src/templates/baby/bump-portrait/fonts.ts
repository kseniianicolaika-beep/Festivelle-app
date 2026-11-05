import { Prata, Tenor_Sans } from "next/font/google";

export const bpDisplay = Prata({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--bp-display", preload: false });
export const bpSans = Tenor_Sans({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--bp-sans", preload: false });
export const bpFonts = `${bpDisplay.variable} ${bpSans.variable}`;
