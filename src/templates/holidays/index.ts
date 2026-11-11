import type { BespokeGroup } from "../types";
import DpSite from "./deepotsav/Site";
import DpCard from "./deepotsav/Card";
import MfSite from "./midnight-fir/Site";
import MfCard from "./midnight-fir/Card";
import McSite from "./midnight-countdown/Site";
import McCard from "./midnight-countdown/Card";
import EwSite from "./easter-willow/Site";
import EwCard from "./easter-willow/Card";
import GlSite from "./gulaal/Site";
import GlCard from "./gulaal/Card";
import EdSite from "./eid-dawat/Site";
import EdCard from "./eid-dawat/Card";

// Bespoke template modules for this group. Key = catalog id.
export const GROUP: BespokeGroup = {
  deepotsav: { site: DpSite, card: DpCard, music: "sitar-dawn", opening: "Marigold toran drops; tap to light a row of diyas" },
  "midnight-fir": { site: MfSite, card: MfCard, music: "music-box", opening: "Snow falls on a dark fir; touch the star and the lights climb the branches" },
  "midnight-countdown": { site: McSite, card: McCard, music: "celebration-swing", opening: "Deco clock at five to twelve; strike midnight and fireworks bloom" },
  "easter-willow": { site: EwSite, card: EwCard, music: "piano-romance", opening: "Pussy-willow and blossom drift in; tap the painted egg and it opens in petals" },
  gulaal: { site: GlSite, card: GlCard, music: "lofi-glow", opening: "Clouds of gulaal bloom from the corners; tap anywhere to throw colour" },
  "eid-dawat": { site: EdSite, card: EdCard, music: "ambient-sea", opening: "Brass fanoos lanterns lower on their chains; touch the crescent and they glow" },
};
