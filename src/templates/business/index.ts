import type { BespokeGroup } from "../types";
import OGSite from "./onyx-gala/Site";
import OGCard from "./onyx-gala/Card";
import STSite from "./sunset-terrace/Site";
import STCard from "./sunset-terrace/Card";
import SGSite from "./summit-grid/Site";
import SGCard from "./summit-grid/Card";
import AZSite from "./azulejo-forum/Site";
import AZCard from "./azulejo-forum/Card";
import ECSite from "./eclipse-launch/Site";
import ECCard from "./eclipse-launch/Card";
import UVSite from "./the-unveiling/Site";
import UVCard from "./the-unveiling/Card";
import HBSite from "./hello-badge/Site";
import HBCard from "./hello-badge/Card";
import CNSite from "./constellation/Site";
import CNCard from "./constellation/Card";

// Bespoke template modules for the business group. Key = catalog id (src/lib/catalog-business.ts).
export const GROUP: BespokeGroup = {
  "onyx-gala": { site: OGSite, card: OGCard, music: "celebration-swing", opening: "Gilded deco doors part on a sunburst" },
  "sunset-terrace": { site: STSite, card: STCard, music: "ambient-sea", opening: "The sun sinks behind the terrace rail" },
  "summit-grid": { site: SGSite, card: SGCard, music: "lofi-glow", opening: "The grid draws itself and the tiles are dealt in" },
  "azulejo-forum": { site: AZSite, card: AZCard, music: "strings-waltz", opening: "Cobalt tiles flip in around the plaque" },
  "eclipse-launch": { site: ECSite, card: ECCard, music: "lofi-glow", opening: "The eclipse corona ignites" },
  "the-unveiling": { site: UVSite, card: UVCard, music: "strings-waltz", opening: "Silk lifts off the plinth" },
  "hello-badge": { site: HBSite, card: HBCard, music: "lofi-glow", opening: "A lanyard badge swings in on its strap" },
  constellation: { site: CNSite, card: CNCard, music: "ambient-sea", opening: "Stars connect into a constellation" },
};
