import type { BespokeGroup } from "../types";
import SolSite from "./solitaire/Site";
import SolCard from "./solitaire/Card";
import CtSite from "./champagne-toast/Site";
import CtCard from "./champagne-toast/Card";
import RkSite from "./roka-marigold/Site";
import RkCard from "./roka-marigold/Card";
import MeSite from "./moscow-evening/Site";
import MeCard from "./moscow-evening/Card";
import RcSite from "./ring-ceremony/Site";
import RcCard from "./ring-ceremony/Card";
import SySite from "./she-said-yes/Site";
import SyCard from "./she-said-yes/Card";
import WpSite from "./wisteria-promise/Site";
import WpCard from "./wisteria-promise/Card";
import SuSite from "./snapshots-of-us/Site";
import SuCard from "./snapshots-of-us/Card";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog.ts).
export const GROUP: BespokeGroup = {
  "champagne-toast": { site: CtSite, card: CtCard, music: "celebration-swing", opening: "Velvet curtains part on a champagne pour" },
  "roka-marigold": { site: RkSite, card: RkCard, music: "sitar-dawn", opening: "Marigold toran drops, petals burst into a jharokha" },
  "moscow-evening": { site: MeSite, card: MeCard, music: "strings-waltz", opening: "Wax seal lifts, the lace envelope opens and the letter rises" },
  "ring-ceremony": { site: RcSite, card: RcCard, music: "sitar-dawn", opening: "Emerald silk parts, lanterns glow, two rings draw and interlock" },
  "she-said-yes": { site: SySite, card: SyCard, music: "lofi-glow", opening: "Letterbox bars pull open and a giant YES. stamps down" },
  "wisteria-promise": { site: WpSite, card: WpCard, music: "piano-romance", opening: "Ink blooms like a wet wash as wisteria grows down from the pergola" },
  "snapshots-of-us": { site: SuSite, card: SuCard, music: "lofi-glow", opening: "Five polaroids drop onto linen and develop; names written in marker" },
  solitaire: { site: SolSite, card: SolCard, music: "piano-romance", opening: "Iris of light from the stone" },
};
