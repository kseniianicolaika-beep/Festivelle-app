import type { BespokeGroup } from "../types";
import CloudNineSite from "./cloud-nine/Site";
import CloudNineCard from "./cloud-nine/Card";
import GodhBharaiSite from "./godh-bharai/Site";
import GodhBharaiCard from "./godh-bharai/Card";
import LittleStarSite from "./little-star/Site";
import LittleStarCard from "./little-star/Card";
import BlushBundleSite from "./blush-bundle/Site";
import BlushBundleCard from "./blush-bundle/Card";
import BumpPortraitSite from "./bump-portrait/Site";
import BumpPortraitCard from "./bump-portrait/Card";
import SageLullabySite from "./sage-lullaby/Site";
import SageLullabyCard from "./sage-lullaby/Card";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog.ts).
export const GROUP: BespokeGroup = {
  "cloud-nine": { site: CloudNineSite, card: CloudNineCard, music: "ambient-sea", opening: "Moonrise — the clouds part, a sleepy moon rises and nursery stars drop on their threads" },
  "godh-bharai": { site: GodhBharaiSite, card: GodhBharaiCard, music: "sitar-dawn", opening: "Genda-phool curtain — marigold ladis part, the bandhanwar drops and diyas flicker under a jharokha" },
  "little-star": { site: LittleStarSite, card: LittleStarCard, music: "music-box", opening: "Twinkle pop — chubby stars pop into a wreath, the monogram stamps in and the rattle wiggles awake (tap stars to make them spin)" },
  "blush-bundle": { site: BlushBundleSite, card: BlushBundleCard, music: "strings-waltz", opening: "Untie the ribbon — the silk bow slips loose, the envelope flap lifts on its liner and the letter rises" },
  "bump-portrait": { site: BumpPortraitSite, card: BumpPortraitCard, music: "piano-romance", opening: "Letterbox — black cinema bars part on the maternity portrait, nine moons wax one by one, the title tracks in" },
  "sage-lullaby": { site: SageLullabySite, card: SageLullabyCard, music: "piano-romance", opening: "Ink bloom — a eucalyptus branch draws itself in ink, watercolour bleeds into the leaves and the magazine masthead types on over a lullaby stave" },
};
