// ONE font-pairing id space (design.fonts). The visual editor re-exports this from lib/editor-options.ts.
// Faces are declared in app/layout.tsx via next/font (CSS variables). Every pairing covers Latin + Cyrillic;
// Devanagari text falls back to Tiro / Rozha automatically.
export const FONT_PAIRS = {
  classic: { name: "Classic serif", display: "var(--font-cormorant), Georgia, serif", script: "var(--font-script), cursive", body: "var(--font-inter), system-ui, sans-serif" },
  script: { name: "Romantic script", display: "var(--font-script), var(--font-cormorant), cursive", script: "var(--font-script), cursive", body: "var(--font-cormorant), Georgia, serif" },
  modern: { name: "Modern", display: "var(--font-montserrat), var(--font-inter), Arial, sans-serif", script: "var(--font-cormorant), Georgia, serif", body: "var(--font-montserrat), var(--font-inter), sans-serif" },
  editorial: { name: "Editorial", display: "var(--font-playfair), Georgia, serif", script: "var(--font-playfair), Georgia, serif", body: "var(--font-cormorant), Georgia, serif" },
  devanagari: { name: "Devanagari", display: "var(--font-deva), serif", script: "var(--font-deva), serif", body: "var(--font-deva), serif" },
  playfair: { name: "Playfair & Bad Script", display: "var(--font-playfair), Georgia, serif", script: "var(--font-badscript), cursive", body: "var(--font-inter), sans-serif" },
  deco: { name: "Art deco", display: "var(--font-forum), Georgia, serif", script: "var(--font-script), cursive", body: "var(--font-montserrat), sans-serif" },
  lora: { name: "Lora & Bad Script", display: "var(--font-lora), Georgia, serif", script: "var(--font-badscript), cursive", body: "var(--font-lora), Georgia, serif" },
  playful: { name: "Playful", display: "var(--font-comfortaa), sans-serif", script: "var(--font-badscript), cursive", body: "var(--font-comfortaa), sans-serif" },
  glam: { name: "Glam", display: "var(--font-unbounded), sans-serif", script: "var(--font-playfair), Georgia, serif", body: "var(--font-montserrat), sans-serif" },
  royal: { name: "Royal", display: "var(--font-rozha), var(--font-playfair), Georgia, serif", script: "var(--font-cormorant), Georgia, serif", body: "var(--font-inter), sans-serif" },
} as const;
export type FontPairId = keyof typeof FONT_PAIRS;
export type FontPair = FontPairId;
export const isFontPair = (f: unknown): f is FontPairId => typeof f === "string" && f in FONT_PAIRS;

/** CSS variables consumed by .display / .script / .tbody (globals.css). */
export function fontVars(id?: string): Record<string, string> {
  if (!isFontPair(id) || id === "classic") return {};
  const f = FONT_PAIRS[id];
  return { "--f-display": f.display, "--f-script": f.script, "--f-body": f.body };
}
