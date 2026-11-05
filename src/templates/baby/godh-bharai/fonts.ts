import { Amita, Eczar, Martel } from "next/font/google";

export const gbDisplay = Eczar({ subsets: ["latin", "devanagari"], weight: ["500", "600", "700"], variable: "--gb-display", preload: false });
export const gbScript = Amita({ subsets: ["latin", "devanagari"], weight: ["400", "700"], variable: "--gb-script", preload: false });
export const gbBody = Martel({ subsets: ["latin", "devanagari"], weight: ["300", "400", "600"], variable: "--gb-body", preload: false });
export const gbFonts = `${gbDisplay.variable} ${gbScript.variable} ${gbBody.variable}`;
