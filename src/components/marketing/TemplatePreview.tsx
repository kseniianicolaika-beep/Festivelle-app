import type { TemplateDef } from "@/lib/catalog";
import type { Profile } from "@/lib/profile";
import { themeById } from "@/lib/themes";
import { Paper } from "@/components/designs/Paper";
import { defaultDesign, type Design, type Kind } from "@/lib/templates";

const STORY = {
  en: "We met on a monsoon evening in Goa, sheltering under the same café awning. One conversation became a hundred — and here we are.",
  ru: "Мы встретились дождливым вечером в Гоа под навесом одного кафе. Один разговор превратился в сотню — и вот мы здесь.",
  hi: "गोवा की एक बरसाती शाम, एक ही कैफ़े की छतरी के नीचे हम मिले। एक बातचीत सौ बन गई — और आज हम यहाँ हैं।",
};
const EVENTS = {
  en: ["Welcome evening", "Ceremony", "Dinner & dancing"],
  ru: ["Приветственный вечер", "Церемония", "Ужин и танцы"],
  hi: ["स्वागत संध्या", "समारोह", "भोज और नृत्य"],
};

/** A template's sample celebration — names, date, venue, a little story and three events — so previews feel lived-in. */
export function sampleProfile(t: TemplateDef): Profile {
  const lang = t.sample.language ?? "en";
  return {
    occasion: t.occasion,
    partner1: t.sample.partner1,
    partner2: t.sample.partner2,
    date: t.sample.date,
    venue: t.sample.venue,
    city: t.sample.city,
    language: lang,
    age: t.sample.age,
    story: STORY[lang],
    events: EVENTS[lang].map((name, i) => ({ name, date: t.sample.date, time: ["6:00 pm", "5:00 pm", "8:00 pm"][i], venue: t.sample.venue })),
  };
}

/** The design a catalog template starts with — always carries `template` so bespoke modules render. */
export function sampleDesign(t: TemplateDef, kind: Kind, p: Profile = sampleProfile(t)): Design {
  return { ...(kind === "website" ? {} : defaultDesign(kind, p)), template: t.id, motif: t.motif, fonts: t.fonts, ...(t.reveal ? { reveal: t.reveal } : {}) };
}

/** The piece kind a template's poster shows (greetings have no "invite"). */
export const posterKind = (t: TemplateDef, kind: Kind = "invite"): Kind => (t.occasion === "greeting" && kind === "invite" ? "greeting" : kind);

// A template's invitation, rendered in its sample names (static; see Live.tsx for the playing version).
export function TemplatePreview({ t, kind = "invite", animate = false, className = "" }: { t: TemplateDef; kind?: Kind; animate?: boolean; className?: string }) {
  const k = posterKind(t, kind);
  const p = sampleProfile(t);
  return (
    <div className={className}>
      <Paper kind={k} layout={t.paperLayout} design={sampleDesign(t, k, p)} profile={p} theme={themeById(t.theme)} animate={animate} />
    </div>
  );
}
