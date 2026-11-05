import type { Culture } from "@/lib/catalog";
import type { OccasionId } from "@/lib/occasions";

// SEO landing pages: /invitations/<slug>
export type SeoPage = { slug: string; occasion: OccasionId; culture?: Culture; title: string; h1: string; intro: string };
export const SEO_PAGES: SeoPage[] = [
  { slug: "wedding-invitations", occasion: "wedding", title: "Online wedding invitations & wedding websites", h1: "Wedding invitations that write themselves", intro: "Tell us your story and Festivelle designs your invitation, save-the-date and wedding website — with live RSVPs — in minutes. Free to design; pay once to publish." },
  { slug: "indian-wedding-invitations", occasion: "wedding", culture: "indian", title: "Indian wedding invitations — haldi, mehendi, sangeet & pheras", h1: "Indian wedding invitations, every ritual honoured", intro: "From haldi mornings to the pheras, each celebration gets its own card and a place on your wedding website — in English or Hindi." },
  { slug: "russian-wedding-invitations", occasion: "wedding", culture: "russian", title: "Приглашения на свадьбу онлайн — Russian wedding invitations", h1: "Свадебные приглашения, которые хочется хранить", intro: "ZAGS, выкуп, венчание и банкет — красивое приглашение и сайт свадьбы на русском, с оплатой российской картой." },
  { slug: "goa-wedding-invitations", occasion: "wedding", culture: "goan", title: "Goa destination wedding invitations & websites", h1: "Goa wedding invitations, sun-warmed and unforgettable", intro: "Beach at golden hour, Portuguese villas, azulejo blue — designs made in Goa, with travel notes your guests will thank you for." },
  { slug: "muslim-wedding-invitations", occasion: "wedding", culture: "muslim", title: "Nikah & walima invitations online", h1: "Nikah invitations in lantern light", intro: "Emerald, gold and jaali lattice — elegant invitations for nikah, mehndi and walima, with an optional Bismillah." },
  { slug: "engagement-invitations", occasion: "engagement", title: "Engagement & ring ceremony invitations", h1: "Announce the yes", intro: "Roka, ring ceremony or champagne evening — a beautiful invitation and page for the beginning of forever." },
  { slug: "anniversary-invitations", occasion: "anniversary", title: "Anniversary party invitations", h1: "A love story, retold", intro: "Silver, ruby or golden — invite the people who watched your story grow." },
  { slug: "birthday-invitations", occasion: "birthday", title: "Birthday invitations & party websites", h1: "Birthday invitations with candlelight and champagne", intro: "Milestone thirtieth or quiet dinner — a gorgeous invitation with RSVPs, designed by simply talking." },
  { slug: "kids-party-invitations", occasion: "kids", title: "Children's birthday party invitations", h1: "Kids' party invitations full of wonder", intro: "Balloons, confetti and cake — invitations as joyful as the party, with RSVPs for busy parents." },
  { slug: "baby-shower-invitations", occasion: "baby_shower", title: "Baby shower invitations online", h1: "Baby shower invitations, soft as a lullaby", intro: "Clouds, crescent moons and pastel light — welcome the little one with the people who'll love them most." },
  { slug: "digital-greeting-cards", occasion: "greeting", title: "Personalised digital greeting cards", h1: "Digital greetings that feel handwritten", intro: "Birthday wishes, anniversaries, Diwali, New Year — an AI that helps you find the words, and a card worth keeping." },
];
export const seoBySlug = (s: string) => SEO_PAGES.find((p) => p.slug === s) ?? null;

export const CULTURES: Record<Culture, string> = { indian: "Indian", russian: "Russian", goan: "Goan", muslim: "Muslim", fusion: "Russian–Indian", western: "Western", universal: "Universal" };
export const LANGS = { en: "English", ru: "Русский", hi: "हिन्दी" } as const;
export const siteOrigin = () => (process.env.APP_URL || (process.env.ROOT_DOMAIN ? `https://${process.env.ROOT_DOMAIN}` : "https://wedding-builder-two.vercel.app")).replace(/\/$/, "");
