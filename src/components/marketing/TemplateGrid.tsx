import Link from "next/link";
import type { TemplateDef } from "@/lib/catalog";
import { OCCASIONS } from "@/lib/occasions";
import { themeById } from "@/lib/themes";
import { Reveal } from "@/components/fx/Reveal";
import { TemplatePreview } from "./TemplatePreview";

export function TemplateGrid({ list, empty = "New designs are being hand-finished — check back very soon." }: { list: TemplateDef[]; empty?: string }) {
  if (!list.length) return <p className="py-16 text-center font-display text-2xl italic text-muted">{empty}</p>;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {list.map((t, i) => (
        <Reveal key={t.id} delay={Math.min(i, 8) * 0.04}>
          <Link href={`/templates/${t.id}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl p-3 transition duration-700 group-hover:-translate-y-1.5" style={{ background: themeById(t.theme).bg }}>
              <TemplatePreview t={t} className="shadow-[0_30px_60px_-35px_rgba(74,20,36,.55)] transition duration-700 group-hover:shadow-[0_45px_80px_-35px_rgba(74,20,36,.7)]" />
              {t.tier === "luxury" && <span className="absolute right-5 top-5 rounded-full bg-wine/90 px-2 py-0.5 text-[9px] uppercase tracking-[.25em] text-[#fbeee6]">Luxury</span>}
            </div>
            <p className="display mt-3 text-xl leading-tight">{t.name}</p>
            <p className="text-xs text-muted">{OCCASIONS[t.occasion].name} · {t.styles.slice(0, 2).join(", ")}</p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
