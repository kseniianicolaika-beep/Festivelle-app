import type { ComponentType, ReactNode } from "react";
import type { Profile } from "@/lib/profile";
import type { Theme } from "@/lib/themes";
import type { Design, Kind } from "@/lib/templates";

// CONTRACT for bespoke templates. Each catalog template gets its own hand-composed Site + Card.
// Site renders the full published website; Card renders every paper/social piece (switch on `kind`).
// Rules: wrap editable text in <E path=...> (src/components/designs/Editable.tsx); mark photo slots
// data-edit-photo="hero|photo|gallery"; wrap website sections in data-edit-section="<SectionId>" and honour
// design.sections order/hidden via sectionLayout(); honour design.palette/fonts (designVars) and
// prefers-reduced-motion. Animations: gsap (+ScrollTrigger/SplitText), lenis, ogl — all installed.
export type SiteProps = {
  profile: Profile;
  theme: Theme;
  design?: Design;
  heroUrl?: string | null;
  calendarUrl?: string | null;
  children?: ReactNode; // RSVP form slot — render inside your RSVP section
  credit?: ReactNode;
  compact?: boolean; // studio/catalog preview: no fixed/full-viewport effects, no scroll hijack, no audio
};
export type CardProps = {
  kind: Kind;
  layout: string;
  profile: Profile;
  theme: Theme;
  design: Design;
  photoUrl?: string | null;
  animate?: boolean; // false for PNG export / print
  className?: string;
};
export type MusicId = "piano-romance" | "strings-waltz" | "sitar-dawn" | "music-box" | "lofi-glow" | "folk-balalaika" | "ambient-sea" | "celebration-swing";
export type Bespoke = { site: ComponentType<SiteProps>; card: ComponentType<CardProps>; music?: MusicId; opening?: string };
export type BespokeGroup = Record<string, Bespoke>;
