import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Marck_Script, Tiro_Devanagari_Hindi } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"] });
const script = Marck_Script({ variable: "--font-script", subsets: ["latin", "cyrillic"], weight: "400" });
const deva = Tiro_Devanagari_Hindi({ variable: "--font-deva", subsets: ["devanagari", "latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: "An AI wedding designer for Indian and Russian couples. Talk, and watch your invitations and wedding website design themselves.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${script.variable} ${deva.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
