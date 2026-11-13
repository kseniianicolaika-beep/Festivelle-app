import type { Metadata } from "next";
import { Bad_Script, Comfortaa, Cormorant_Garamond, Forum, Inter, Lora, Marck_Script, Montserrat, Playfair_Display, Rozha_One, Tiro_Devanagari_Hindi, Unbounded } from "next/font/google";
import { BRAND } from "@/lib/brand";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"] });
const script = Marck_Script({ variable: "--font-script", subsets: ["latin", "cyrillic"], weight: "400" });
// Template font pairings (src/lib/fonts.ts). Not preloaded — the browser fetches a face only when a template uses it.
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin", "cyrillic"], style: ["normal", "italic"], preload: false });
const badscript = Bad_Script({ variable: "--font-badscript", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const forum = Forum({ variable: "--font-forum", subsets: ["latin", "cyrillic"], weight: "400", preload: false });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], preload: false });
const lora = Lora({ variable: "--font-lora", subsets: ["latin", "cyrillic"], style: ["normal", "italic"], preload: false });
const comfortaa = Comfortaa({ variable: "--font-comfortaa", subsets: ["latin", "cyrillic"], preload: false });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin", "cyrillic"], weight: ["300", "500"], preload: false });
const rozha = Rozha_One({ variable: "--font-rozha", subsets: ["latin", "devanagari"], weight: "400", preload: false });
const deva = Tiro_Devanagari_Hindi({ variable: "--font-deva", subsets: ["devanagari", "latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: "Conversation-first invitations, websites, video invitations and greetings for weddings, birthdays, baby showers and every celebration.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${script.variable} ${deva.variable} ${playfair.variable} ${badscript.variable} ${forum.variable} ${montserrat.variable} ${lora.variable} ${comfortaa.variable} ${unbounded.variable} ${rozha.variable}`}>
      <body className="min-h-dvh">{children}<Analytics /></body>
    </html>
  );
}
