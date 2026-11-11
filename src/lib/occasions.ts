import type { Profile } from "./profile";
import type { Kind } from "./templates";
import type { MotifId } from "./motifs";

type Lang = "en" | "ru" | "hi";
type L3 = Record<Lang, string>;

// Every celebration Festivelle designs. `pair` = two honourees ("Anna & Mark"); otherwise one ("Mia turns 7").
// `pairable` = one or two names both read naturally (a baby shower for "Anna & Mark").
// CONTRACT (shared): OCCASIONS, OccasionId, isOccasion, occasionOf, displayNames, priceGroup, occasionBrief.
export const OCCASIONS = {
  wedding: {
    name: "Wedding", pair: true, pairable: true, group: "wedding", theme: "konkan-sunset", motif: "rings",
    blurb: "Invitations, a wedding website and live RSVPs — for every ritual from haldi to ZAGS.",
    sample: { partner1: "Anya", partner2: "Rohan", date: "2027-02-14", venue: "Ashwem Beach, Goa" },
  },
  engagement: {
    name: "Engagement", pair: true, pairable: true, group: "wedding", theme: "rose-quartz", motif: "rings",
    blurb: "Announce the yes — ring ceremony, roka or an evening of champagne.",
    sample: { partner1: "Maya", partner2: "Arjun", date: "2027-01-09", venue: "Villa Fontainhas, Panjim" },
  },
  anniversary: {
    name: "Anniversary", pair: true, pairable: true, group: "celebration", theme: "pearl", motif: "doves",
    blurb: "Twenty-five years, or the first — a love story retold for the people who watched it grow.",
    sample: { partner1: "Elena", partner2: "Vikram", date: "2027-03-20", venue: "The Lisbon Room, Goa", age: 25 },
  },
  birthday: {
    name: "Birthday", pair: false, pairable: false, group: "celebration", theme: "champagne-noir", motif: "champagne",
    blurb: "A grown-up evening of candlelight, music and the people who matter.",
    sample: { partner1: "Natasha", date: "2027-04-18", venue: "Thalassa, Vagator", age: 30 },
  },
  kids: {
    name: "Children's party", pair: false, pairable: false, group: "celebration", theme: "confetti-garden", motif: "balloons",
    blurb: "Balloons, cake and wonder — an invitation as joyful as the party.",
    sample: { partner1: "Mia", date: "2027-05-02", venue: "Our garden, Assagao", age: 7 },
  },
  baby_shower: {
    name: "Baby shower", pair: false, pairable: true, group: "celebration", theme: "cloud-nursery", motif: "moon",
    blurb: "Soft as a lullaby — welcome the little one with the people who'll love them most.",
    sample: { partner1: "Priya", partner2: "Sam", date: "2027-06-12", venue: "Casa Susegad, Loutolim" },
  },
  bridal_shower: {
    name: "Bridal shower", pair: false, pairable: false, group: "celebration", theme: "rose-quartz", motif: "ribbon",
    blurb: "Petals, prosecco and the people who love her most — a shower for the bride-to-be.",
    sample: { partner1: "Sofia", date: "2027-01-23", venue: "The Courtyard, Assagao" },
  },
  rehearsal_dinner: {
    name: "Rehearsal dinner", pair: true, pairable: true, group: "celebration", theme: "terracotta", motif: "eucalyptus",
    blurb: "One long table the night before — candles, toasts and the families meeting at last.",
    sample: { partner1: "Anya", partner2: "Rohan", date: "2027-02-13", venue: "Gunpowder, Assagao" },
  },
  gender_reveal: {
    name: "Gender reveal", pair: true, pairable: true, group: "celebration", theme: "cloud-nursery", motif: "balloons",
    blurb: "Pink or blue? Gather everyone for the sweetest surprise of the year.",
    sample: { partner1: "Priya", partner2: "Sam", date: "2027-04-10", venue: "Our garden, Siolim" },
  },
  baptism: {
    name: "Baptism", pair: false, pairable: false, group: "celebration", theme: "lace-ivory", motif: "doves",
    blurb: "A christening, a naming, a blessing — gentle invitations for a little one's first sacred day.",
    sample: { partner1: "Little Leo", date: "2027-03-14", venue: "Our Lady of the Immaculate Conception, Panjim" },
  },
  corporate_party: {
    name: "Corporate party", pair: false, pairable: false, group: "business", theme: "deco-onyx", motif: "champagne",
    blurb: "Year-end galas, team celebrations and client evenings — polished, on-brand and RSVP-ready.",
    sample: { partner1: "Lumen Studio", date: "2026-12-18", venue: "W Goa, Vagator" },
  },
  conference: {
    name: "Conference", pair: false, pairable: false, group: "business", theme: "lagoon", motif: "arch",
    blurb: "Agenda, speakers, venue and registration — a conference website guests actually read.",
    sample: { partner1: "Goa Design Summit", date: "2027-02-25", venue: "Kala Academy, Panjim" },
  },
  product_launch: {
    name: "Product launch", pair: false, pairable: false, group: "business", theme: "champagne-noir", motif: "stars",
    blurb: "A reveal worth showing up for — launch invitations with countdown, story and guest list.",
    sample: { partner1: "Aurora by Lumen", date: "2027-03-05", venue: "Sunset Studio, Anjuna" },
  },
  networking: {
    name: "Networking event", pair: false, pairable: false, group: "business", theme: "sage", motif: "lattice",
    blurb: "Founders' breakfasts, mixers and meetups — invitations that make strangers want to come.",
    sample: { partner1: "Founders of Goa", date: "2027-01-28", venue: "Cohive, Panjim" },
  },
  holiday: {
    name: "Holiday party", pair: false, pairable: false, group: "celebration", theme: "diwali", motif: "diya",
    blurb: "Diwali, Christmas, New Year, Easter — a festive gathering with an invitation to match.",
    sample: { partner1: "The Kapoors", date: "2027-10-29", venue: "Our home, Porvorim", tradition: "Diwali" },
  },
  dinner_party: {
    name: "Dinner party", pair: false, pairable: true, group: "celebration", theme: "terracotta", motif: "eucalyptus",
    blurb: "Candles, a long table and good conversation — an evening invitation with a menu to match.",
    sample: { partner1: "Elena", date: "2027-02-06", venue: "Our villa, Moira" },
  },
  housewarming: {
    name: "Housewarming", pair: false, pairable: true, group: "celebration", theme: "sage", motif: "arch",
    blurb: "New keys, new home — open the door to friends with a warm griha pravesh or house party.",
    sample: { partner1: "Maya", partner2: "Arjun", date: "2027-01-16", venue: "Our new home, Saligao" },
  },
  special: {
    name: "Special occasion", pair: false, pairable: true, group: "celebration", theme: "pearl", motif: "confetti",
    blurb: "Graduations, retirements, farewells and welcomes — any moment worth gathering for.",
    sample: { partner1: "Dr. Natasha", date: "2027-05-22", venue: "The Lisbon Room, Panjim" },
  },
  greeting: {
    name: "Digital greeting", pair: false, pairable: false, group: "greeting", theme: "love-letter", motif: "ribbon",
    blurb: "A handwritten-feeling card — birthdays, thank-yous, new babies, festivals.",
    sample: { partner1: "Grandma Olga", tradition: "Birthday" },
  },
} as const satisfies Record<string, { name: string; pair: boolean; pairable: boolean; group: string; theme: string; motif: MotifId; blurb: string; sample: Partial<Profile> }>;

export type OccasionId = keyof typeof OCCASIONS;
export type PriceGroup = (typeof OCCASIONS)[OccasionId]["group"];
export const OCCASION_IDS = Object.keys(OCCASIONS) as OccasionId[];
export const isOccasion = (o: unknown): o is OccasionId => typeof o === "string" && o in OCCASIONS;
export const occasionOf = (p: Profile): OccasionId => (isOccasion(p.occasion) ? p.occasion : "wedding");
export const priceGroup = (p: Profile): PriceGroup => OCCASIONS[occasionOf(p)].group;

/** Whether a second name is shown ("Anna & Mark"). */
export const isPair = (p: Profile) => !!p.partner2 && OCCASIONS[occasionOf(p)].pairable;

export function displayNames(p: Profile) {
  const o = OCCASIONS[occasionOf(p)];
  if (!p.partner1) return o.name;
  return isPair(p) ? `${p.partner1} & ${p.partner2}` : p.partner1;
}

/** [first, second | ""] — second is empty for single-honouree celebrations. */
export const nameParts = (p: Profile): [string, string] => [p.partner1 || (OCCASIONS[occasionOf(p)].pair ? "Partner" : "You"), isPair(p) ? p.partner2! : OCCASIONS[occasionOf(p)].pair ? "Partner" : ""];

const lang = (p: Profile): Lang => (p.language === "ru" || p.language === "hi" ? p.language : "en");

/** The short line under/over the names — never "getting married" on a birthday. */
export function occasionLine(p: Profile): string {
  const n = p.age;
  const L = lang(p);
  const lines: Record<OccasionId, L3> = {
    wedding: { en: "are getting married", ru: "женятся", hi: "विवाह बंधन में बंध रहे हैं" },
    engagement: { en: "are engaged", ru: "помолвлены", hi: "की सगाई है" },
    anniversary: n ? { en: `celebrate ${n} years together`, ru: `отмечают ${n} лет вместе`, hi: `साथ के ${n} वर्ष मना रहे हैं` } : { en: "celebrate their anniversary", ru: "отмечают годовщину", hi: "वैवाहिक वर्षगांठ मना रहे हैं" },
    birthday: n ? { en: `turns ${n}`, ru: `— нам ${n}!`, hi: `${n} वर्ष के हो रहे हैं` } : { en: "is celebrating a birthday", ru: "празднует день рождения", hi: "का जन्मदिन है" },
    kids: n ? { en: `is turning ${n}`, ru: `— мне ${n}!`, hi: `${n} साल के हो रहे हैं` } : { en: "is having a party", ru: "приглашает на праздник", hi: "की पार्टी है" },
    baby_shower: { en: "a baby shower for", ru: "бэйби-шавер для", hi: "गोद भराई —" },
    bridal_shower: { en: "a bridal shower for", ru: "девичник в честь", hi: "ब्राइडल शॉवर —" },
    rehearsal_dinner: { en: "the night before we say I do", ru: "накануне свадьбы", hi: "शादी से पहले की शाम" },
    gender_reveal: { en: "boy or girl? find out with us", ru: "мальчик или девочка? узнаем вместе", hi: "लड़का या लड़की? साथ में जानिए" },
    baptism: { en: "is being baptised", ru: "крестины", hi: "का नामकरण संस्कार" },
    corporate_party: { en: "invites you to celebrate", ru: "приглашает на праздник", hi: "आपको आमंत्रित करता है" },
    conference: { en: "a conference", ru: "конференция", hi: "सम्मेलन" },
    product_launch: { en: "is launching", ru: "представляет", hi: "लॉन्च कर रहा है" },
    networking: { en: "an evening of good company", ru: "вечер знакомств", hi: "मिलने-जुलने की शाम" },
    holiday: { en: "festive greetings from", ru: "праздничный вечер у", hi: "त्योहार की शुभकामनाएँ" },
    dinner_party: { en: "dinner is served", ru: "приглашает на ужин", hi: "रात्रिभोज" },
    housewarming: { en: "welcome to our new home", ru: "добро пожаловать в наш новый дом", hi: "गृह प्रवेश" },
    special: { en: "a celebration for", ru: "праздник в честь", hi: "उत्सव" },
    greeting: { en: "with love, for", ru: "с любовью для", hi: "स्नेह सहित" },
  };
  return lines[occasionOf(p)][L];
}

/** Default invitation wording when the AI hasn't written one yet. */
export function occasionInvite(p: Profile): string {
  const L = lang(p);
  const lines: Record<OccasionId, L3> = {
    wedding: { en: "Together with their families, request the pleasure of your company", ru: "Вместе с семьями приглашают вас разделить с ними этот день", hi: "अपने परिवारों के साथ, आपकी उपस्थिति का सादर निवेदन करते हैं" },
    engagement: { en: "She said yes. Come and raise a glass with us", ru: "Она сказала «да». Поднимем бокалы вместе", hi: "हमारी सगाई की खुशी में शामिल होइए" },
    anniversary: { en: "The years have only made it sweeter — celebrate with us", ru: "Годы сделали её только нежнее — разделите этот вечер с нами", hi: "सालों ने इसे और मधुर बनाया है — हमारे साथ जश्न मनाइए" },
    birthday: { en: "An evening of candlelight, music and dear friends — you're invited", ru: "Вечер свечей, музыки и близких друзей — ждём вас", hi: "रोशनी, संगीत और प्यारे दोस्तों की शाम — आप आमंत्रित हैं" },
    kids: { en: "Balloons, cake and plenty of giggles — come and play!", ru: "Шарики, торт и море смеха — приходите играть!", hi: "गुब्बारे, केक और ढेर सारी मस्ती — खेलने आइए!" },
    baby_shower: { en: "A little one is on the way — join us to shower them with love", ru: "Скоро нас станет больше — приходите осыпать малыша любовью", hi: "नन्हा मेहमान आने वाला है — अपना आशीर्वाद देने आइए" },
    bridal_shower: { en: "Before she says I do — join us to shower the bride with love", ru: "Пока она ещё не сказала «да» — приходите поздравить невесту", hi: "दुल्हन पर प्यार बरसाने आइए" },
    rehearsal_dinner: { en: "Join us the evening before the wedding for dinner, toasts and family", ru: "Приглашаем на ужин накануне свадьбы — тосты, семья и близкие", hi: "शादी से एक शाम पहले रात्रिभोज में शामिल होइए" },
    gender_reveal: { en: "Pink or blue? Come and find out with us", ru: "Розовый или голубой? Приходите узнать вместе с нами", hi: "गुलाबी या नीला? हमारे साथ जानिए" },
    baptism: { en: "With joy, we invite you to the baptism of our little one", ru: "С радостью приглашаем вас на крестины нашего малыша", hi: "हमारे नन्हे के नामकरण संस्कार में आपका स्वागत है" },
    corporate_party: { en: "To a year worth celebrating — join us for an evening together", ru: "За год, который стоит отпраздновать — приглашаем на вечер", hi: "एक शानदार साल का जश्न — हमारे साथ शाम बिताइए" },
    conference: { en: "Join us for a day of ideas, talks and conversations", ru: "Приглашаем на день идей, выступлений и встреч", hi: "विचारों और बातचीत के एक दिन में शामिल होइए" },
    product_launch: { en: "Be the first to see what we've been making", ru: "Будьте первыми, кто увидит нашу новинку", hi: "हमारी नई पेशकश सबसे पहले देखिए" },
    networking: { en: "Good people, good coffee, good conversations — come and meet", ru: "Хорошие люди, хороший кофе и разговоры — приходите знакомиться", hi: "अच्छे लोग, अच्छी बातें — मिलने आइए" },
    holiday: { en: "Celebrate the season with us — lights, food and good company", ru: "Встретим праздник вместе — огни, угощения и близкие", hi: "त्योहार हमारे साथ मनाइए" },
    dinner_party: { en: "A long table, candlelight and good company — you're invited to dinner", ru: "Длинный стол, свечи и любимые люди — приглашаем на ужин", hi: "रात्रिभोज में आप आमंत्रित हैं" },
    housewarming: { en: "We've found our home — come and fill it with laughter", ru: "У нас новый дом — приходите наполнить его смехом", hi: "हमारे नए घर में पधारिए" },
    special: { en: "Some moments deserve a gathering — please join us", ru: "Некоторые моменты стоит отметить вместе — ждём вас", hi: "इस खास पल में हमारे साथ रहिए" },
    greeting: { en: "Thinking of you today, with all our love", ru: "Думаем о тебе сегодня — с любовью", hi: "आज आपको ढेर सारा प्यार" },
  };
  return lines[occasionOf(p)][L];
}

/** Events suggested during the conversation (rule-engine chips). */
export const OCCASION_EVENTS: Record<Exclude<OccasionId, "wedding">, string[]> = {
  engagement: ["Ring ceremony", "Roka", "Cocktail evening", "Engagement dinner"],
  anniversary: ["Dinner", "Vow renewal", "Party", "Family lunch"],
  birthday: ["Welcome drinks", "Dinner", "Party", "Morning-after brunch"],
  kids: ["Games", "Cake cutting", "Magic show", "Treasure hunt"],
  baby_shower: ["Godh bharai", "Afternoon tea", "Games", "Blessings"],
  bridal_shower: ["Brunch", "High tea", "Games", "Spa afternoon"],
  rehearsal_dinner: ["Welcome drinks", "Dinner", "Toasts", "After-party"],
  gender_reveal: ["Reveal moment", "Brunch", "Games", "Cake"],
  baptism: ["Ceremony", "Family lunch", "Reception"],
  corporate_party: ["Welcome drinks", "Awards", "Dinner", "Dancing"],
  conference: ["Registration", "Keynote", "Panels", "Workshops", "Networking drinks"],
  product_launch: ["Arrivals", "The reveal", "Demos", "Drinks"],
  networking: ["Coffee & intros", "Talks", "Open networking"],
  holiday: ["Puja", "Dinner", "Fireworks", "Carols", "Countdown"],
  dinner_party: ["Aperitivo", "Dinner", "Dessert & digestifs"],
  housewarming: ["Griha pravesh puja", "House tour", "Lunch", "Party"],
  special: ["Ceremony", "Speeches", "Dinner", "Party"],
  greeting: [],
};

/** The pieces a new celebration starts with. */
export function starterFor(o: OccasionId): { kind: Kind; layout: string }[] {
  if (o === "greeting") return [{ kind: "greeting", layout: "classic" }, { kind: "story", layout: "classic" }];
  if (o === "wedding") return [{ kind: "invite", layout: "classic" }, { kind: "website", layout: "romance" }, { kind: "save", layout: "classic" }];
  if (OCCASIONS[o].group === "business") return [{ kind: "invite", layout: "classic" }, { kind: "website", layout: "romance" }, { kind: "post", layout: "classic" }];
  return [{ kind: "invite", layout: "classic" }, { kind: "website", layout: "romance" }, { kind: "story", layout: "classic" }];
}

/** Injected into the AI system prompt so the concierge speaks to the right celebration. */
export function occasionBrief(id: OccasionId): string {
  const briefs: Record<OccasionId, string> = {
    wedding: "OCCASION: a wedding. partner1/partner2 are the couple. Learn names, culture & tradition, date, venue, the celebrations (mehendi, haldi, sangeet, pheras, nikah, ZAGS, vykup, banquet…), mood, guest language and their love story.",
    engagement: "OCCASION: an engagement. partner1/partner2 are the couple. Learn names, date, venue, the gatherings (ring ceremony, roka, cocktail evening, dinner), mood, guest language and how they got engaged (put it in \"story\"). inviteLine announces the engagement — never call it a wedding.",
    anniversary: "OCCASION: a wedding anniversary. partner1/partner2 are the couple; \"age\" = number of years married. Learn names, years, date, venue, plans (dinner, vow renewal, party), mood, language and a memory from their years together (\"story\"). Celebrate longevity tenderly.",
    birthday: "OCCASION: an adult birthday. partner1 = the person celebrating, partner2 = null; \"age\" = the age they turn (only if they want it shown). Learn name, age, date, venue, plan for the evening, mood, guest language and a line about them (\"story\"). Elegant, warm, a little playful — never \"getting married\".",
    kids: "OCCASION: a children's party. partner1 = the child, partner2 = null; \"age\" = the age they turn. \"vibe\" = the party theme (unicorns, space, jungle, dinosaurs, under the sea, princesses…). Learn the child's name, age, theme, date, venue, activities (games, cake, magic show), guest language. Parents are writing: joyful, simple wording that children and parents both love.",
    baby_shower: "OCCASION: a baby shower / godh bharai. partner1 = the mother-to-be (partner2 = partner, optional). \"tradition\" = boy, girl or surprise. Learn names, date, venue, activities, mood (soft, dreamy), guest language. Gentle, tender, joyful wording.",
    bridal_shower: "OCCASION: a bridal shower / hen party. partner1 = the bride-to-be, partner2 = null. Learn her name, date, venue, the plan (brunch, high tea, games, spa), mood, guest language and a line about her (\"story\"). Playful, warm, feminine wording — it's for her friends and family, never a wedding invitation.",
    rehearsal_dinner: "OCCASION: a rehearsal dinner the evening before a wedding. partner1/partner2 are the couple. Learn names, date, venue, the evening (drinks, dinner, toasts), mood and guest language. Intimate, warm, family-first wording.",
    gender_reveal: "OCCASION: a gender reveal party. partner1/partner2 are the parents-to-be. Learn names, date, venue, how the reveal happens (balloons, cake, confetti), mood and guest language. Joyful, playful — never reveal the gender in the wording.",
    baptism: "OCCASION: a baptism / christening / naming ceremony. partner1 = the child's name, \"tradition\" = the ceremony (baptism, christening, naamkaran). Learn the child's name, parents (put in \"story\"), date, church or venue, reception plan, guest language. Gentle, reverent, joyful wording.",
    corporate_party: "OCCASION: a corporate party (year-end gala, team celebration, client evening). partner1 = the company or host name, partner2 = null. Learn company, the reason to celebrate, date, venue, programme (drinks, awards, dinner), dress code, guest language. Polished, warm, professional — never romantic, never \"love story\". Use \"story\" for a short welcome from the host.",
    conference: "OCCASION: a conference or summit. partner1 = the conference name, partner2 = null. Learn name, theme, date(s), venue, agenda (keynotes, panels, workshops), speakers (put in \"story\"), audience and guest language. Clear, confident, professional wording; RSVP = registration.",
    product_launch: "OCCASION: a product launch event. partner1 = the product or brand name, partner2 = null. Learn the product, company, date, venue, programme (arrivals, the reveal, demos, drinks), mood and guest language. Exciting, crisp, premium wording with a sense of anticipation.",
    networking: "OCCASION: a networking event / meetup / mixer. partner1 = the event or community name, partner2 = null. Learn name, who it's for, date, venue, programme, mood and guest language. Friendly, inclusive, professional wording.",
    holiday: "OCCASION: a holiday or festival party (Diwali, Christmas, New Year, Easter, Eid, Holi, Maslenitsa…). partner1 = the hosts (\"The Kapoors\"), \"tradition\" = the festival. Learn hosts, festival, date, venue, plan (puja, dinner, fireworks, carols, countdown), mood and guest language. Festive, generous, culturally accurate wording for that festival.",
    dinner_party: "OCCASION: a dinner party. partner1 = the host (partner2 optional co-host). Learn hosts, the reason (if any), date, venue, menu or cuisine, dress code, mood and guest language. Elegant, convivial, intimate wording.",
    housewarming: "OCCASION: a housewarming / griha pravesh. partner1 (+ optional partner2) = the hosts. Learn names, date, the new home's area/address, plan (puja, house tour, lunch, party), mood and guest language. Warm, homely, welcoming wording.",
    special: "OCCASION: a special occasion (graduation, retirement, farewell, welcome home, award, reunion…). partner1 = the person or people being celebrated; \"tradition\" = what the occasion is. Learn who, what, date, venue, plan, mood and guest language. Warm wording that fits the specific occasion — ask what it is first.",
    greeting: "OCCASION: a digital greeting card (no event, no RSVP, no date needed). partner1 = the recipient, \"tradition\" = the kind of greeting (birthday, anniversary, congratulations, thank you, new baby, Diwali, New Year, Christmas, Eid…), \"story\" = the heartfelt message itself (3–5 sentences, personal, never generic), \"blessing\" = the sign-off (\"With love, Anna\"). Ask who it's for, the occasion, a detail or memory about them, and who it's from — then WRITE the message for them and offer to make it funnier, shorter or more tender. Mark complete once recipient, greeting type, message and sign-off are known.",
  };
  return briefs[id];
}
