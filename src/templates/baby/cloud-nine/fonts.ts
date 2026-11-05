import { Cormorant_Infant, Jost } from "next/font/google";

export const cnDisplay = Cormorant_Infant({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--cn-display", preload: false });
export const cnSans = Jost({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], variable: "--cn-sans", preload: false });
export const cnFonts = `${cnDisplay.variable} ${cnSans.variable}`;
