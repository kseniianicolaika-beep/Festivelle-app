// Curated, hand-drawn line motifs (no AI images). Each is culturally specific and optional.
export const MOTIFS = [
  { id: "palms", name: "Goan palms", tags: ["beach", "goa"] },
  { id: "azulejo", name: "Azulejo tiles", tags: ["goa", "portuguese", "catholic"] },
  { id: "arch", name: "Mughal arch", tags: ["royal", "indian"] },
  { id: "birch", name: "Silver birch", tags: ["russian"] },
  { id: "jasmine", name: "Jasmine (mogra)", tags: ["minimal", "south indian"] },
  { id: "marigold", name: "Marigold garland", tags: ["haldi", "indian"] },
  { id: "lattice", name: "Jaali lattice", tags: ["nikah", "mughal"] },
  { id: "stars", name: "Starlight", tags: ["sangeet", "night"] },
  { id: "paisley", name: "Paisley (ambi)", tags: ["mehendi", "indian"] },
  { id: "lotus", name: "Lotus", tags: ["hindu", "indian"] },
  { id: "rings", name: "Entwined rings", tags: ["universal", "russian"] },
  { id: "doves", name: "Doves & olive", tags: ["christian", "universal"] },
  { id: "khokhloma", name: "Khokhloma berries", tags: ["russian", "folk"] },
  { id: "mandala", name: "Mandala", tags: ["mehendi", "indian"] },
] as const;

export type MotifId = (typeof MOTIFS)[number]["id"];
export const isMotif = (m: unknown): m is MotifId => MOTIFS.some((x) => x.id === m);

// Sacred invocations — only ever shown when the couple chooses one.
export const INVOCATIONS = {
  ganesh: { label: "Shri Ganesh", text: "॥ श्री गणेशाय नमः ॥" },
  om: { label: "Om", text: "ॐ" },
  ikonkar: { label: "Ik Onkar", text: "ੴ" },
  bismillah: { label: "Bismillah", text: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" },
  cross: { label: "Cross", text: "✝" },
  orthodox: { label: "Orthodox cross", text: "☦" },
} as const;
export type InvocationId = keyof typeof INVOCATIONS;
