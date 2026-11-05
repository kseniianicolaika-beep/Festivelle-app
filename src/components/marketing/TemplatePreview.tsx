import type { TemplateDef } from "@/lib/catalog";
import type { Profile } from "@/lib/profile";
import { themeById } from "@/lib/themes";
import { Paper } from "@/components/designs/Paper";
import type { Kind } from "@/lib/templates";

export function sampleProfile(t: TemplateDef): Profile {
  return {
    occasion: t.occasion,
    partner1: t.sample.partner1,
    partner2: t.sample.partner2,
    date: t.sample.date,
    venue: t.sample.venue,
    city: t.sample.city,
    language: t.sample.language ?? "en",
    age: t.sample.age,
  };
}

// A template's invitation, rendered live in its sample names (no images, pure design).
export function TemplatePreview({ t, kind = "invite", animate = false, className = "" }: { t: TemplateDef; kind?: Kind; animate?: boolean; className?: string }) {
  return (
    <div className={className}>
      <Paper kind={kind} layout={t.paperLayout} design={{ motif: t.motif, theme: t.theme }} profile={sampleProfile(t)} theme={themeById(t.theme)} animate={animate} />
    </div>
  );
}
