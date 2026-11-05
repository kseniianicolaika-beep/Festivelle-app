import type { BespokeGroup } from "../types";
import LoveLetterSite from "./love-letter/Site";
import LoveLetterCard from "./love-letter/Card";
import MhrSite from "./many-happy-returns/Site";
import MhrCard from "./many-happy-returns/Card";
import FlSite from "./festival-of-lights/Site";
import FlCard from "./festival-of-lights/Card";
import EmSite from "./eid-mubarak/Site";
import EmCard from "./eid-mubarak/Card";
import McSite from "./merry-christmas/Site";
import McCard from "./merry-christmas/Card";
import NySite from "./s-novym-godom/Site";
import NyCard from "./s-novym-godom/Card";
import MsSite from "./maslenitsa/Site";
import MsCard from "./maslenitsa/Card";
import WgSite from "./with-gratitude/Site";
import WgCard from "./with-gratitude/Card";
import WlSite from "./welcome-little-one/Site";
import WlCard from "./welcome-little-one/Card";
import MpSite from "./memory-portrait/Site";
import MpCard from "./memory-portrait/Card";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog.ts).
export const GROUP: BespokeGroup = {
  "love-letter": { site: LoveLetterSite, card: LoveLetterCard, music: "piano-romance", opening: "Silk ribbon, wax seal & unfolding letter" },
  "many-happy-returns": { site: MhrSite, card: MhrCard, music: "celebration-swing", opening: "Black lacquer gift box, gold ribbon & champagne iris" },
  "festival-of-lights": { site: FlSite, card: FlCard, music: "sitar-dawn", opening: "Light the diya: rangoli blooms & a ring of lamps ignites" },
  "eid-mubarak": { site: EmSite, card: EmCard, music: "ambient-sea", opening: "Carved jaali doors swing open onto the crescent moon" },
  "merry-christmas": { site: McSite, card: McCard, music: "music-box", opening: "Clear the frosted window onto a candlelit fir wreath" },
  "s-novym-godom": { site: NySite, card: NyCard, music: "music-box", opening: "Kremlin chimes strike twelve — yolka, mandarins & lace snow" },
  maslenitsa: { site: MsSite, card: MsCard, music: "folk-balalaika", opening: "Flip the blin — it rises as the folk spring sun" },
  "with-gratitude": { site: WgSite, card: WgCard, music: "piano-romance", opening: "Vellum sleeve slides away; the letterpress ink presses in" },
  "welcome-little-one": { site: WlSite, card: WlCard, music: "music-box", opening: "Clouds part beneath a swaying cot mobile" },
  "memory-portrait": { site: MpSite, card: MpCard, music: "strings-waltz", opening: "A velvet drape lifts from a gilded frame under a picture light" },
};
