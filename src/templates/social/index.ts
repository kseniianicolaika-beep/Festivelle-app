import type { BespokeGroup } from "../types";
import LTSite from "./long-table/Site";
import LTCard from "./long-table/Card";
import CLSite from "./the-cloche/Site";
import CLCard from "./the-cloche/Card";
import GPSite from "./griha-pravesh/Site";
import GPCard from "./griha-pravesh/Card";
import NVSite from "./novoselye/Site";
import NVCard from "./novoselye/Card";
import CPSite from "./cap-and-laurel/Site";
import CPCard from "./cap-and-laurel/Card";
import NCSite from "./next-chapter/Site";
import NCCard from "./next-chapter/Card";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog-social.ts).
export const GROUP: BespokeGroup = {
  "long-table": { site: LTSite, card: LTCard, music: "piano-romance", opening: "Tapers lit down the long table" },
  "the-cloche": { site: CLSite, card: CLCard, music: "celebration-swing", opening: "The gilt cloche lifts" },
  "griha-pravesh": { site: GPSite, card: GPCard, music: "sitar-dawn", opening: "Carved doors open on the toran" },
  novoselye: { site: NVSite, card: NVCard, music: "folk-balalaika", opening: "Windows light up, the cat steps in" },
  "cap-and-laurel": { site: CPSite, card: CPCard, music: "celebration-swing", opening: "Caps tossed skyward, laurel in gold" },
  "next-chapter": { site: NCSite, card: NCCard, music: "strings-waltz", opening: "The page turns to a new chapter" },
};
