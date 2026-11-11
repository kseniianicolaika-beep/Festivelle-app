import type { Profile } from "@/lib/profile";

/** "Venue · City" for headers and footers. */
export const venueLine = (p: Profile) => [p.venue, p.city].filter(Boolean).join(" · ");
