import type { BespokeGroup } from "../types";
import * as AshwemDusk from "./ashwem-dusk";
import * as LisbonLetter from "./lisbon-letter";
import * as Maharani from "./maharani";
import * as NevaMonogram from "./neva-monogram";
import * as MograBloom from "./mogra-bloom";
import * as HaldiSun from "./haldi-sun";
import * as NoorNikah from "./noor-nikah";
import * as StarlitSangeet from "./starlit-sangeet";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog.ts).
// Each module folder owns its Site (published website) + Card (every paper/social piece).
export const GROUP: BespokeGroup = {
  "ashwem-dusk": { site: AshwemDusk.Site, card: AshwemDusk.Card, music: "ambient-sea", opening: "Letterbox sunset" },
  "lisbon-letter": { site: LisbonLetter.Site, card: LisbonLetter.Card, music: "strings-waltz", opening: "Envelope & wax seal" },
  "maharani": { site: Maharani.Site, card: Maharani.Card, music: "sitar-dawn", opening: "Palace curtain" },
  "neva-monogram": { site: NevaMonogram.Site, card: NevaMonogram.Card, music: "piano-romance", opening: "Silver monogram iris" },
  "mogra-bloom": { site: MograBloom.Site, card: MograBloom.Card, music: "sitar-dawn", opening: "Jasmine ink bloom" },
  "haldi-sun": { site: HaldiSun.Site, card: HaldiSun.Card, music: "celebration-swing", opening: "Marigold pop" },
  "noor-nikah": { site: NoorNikah.Site, card: NoorNikah.Card, music: "sitar-dawn", opening: "Lantern jaali doors" },
  "starlit-sangeet": { site: StarlitSangeet.Site, card: StarlitSangeet.Card, music: "celebration-swing", opening: "Constellation iris" },
};
