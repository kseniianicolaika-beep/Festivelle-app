"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Profile } from "@/lib/profile";
import { KINDS, PAPER_LAYOUTS, SITE_LAYOUTS, defaultDesign, templatesFor, type Kind } from "@/lib/templates";
import { WeddingSite } from "@/components/WeddingSite";
import { themeById } from "@/lib/themes";
import { Paper } from "@/components/designs/Paper";
import { occasionOf } from "@/lib/occasions";
import { ScaledFrame } from "@/components/templates/Live";

const GROUPS = ["Stationery", "Online", "Social", "Greetings", "On the day", "After"] as const;
export type Pick = { kind: Kind; layout: string; theme: string; motif?: string; fonts?: string; template?: string };

// Browse every template, previewed live with the couple's own names, date and story.
export function Gallery({ profile, initialKind, mode, onPick, onClose }: { profile: Profile; initialKind?: Kind; mode: "add" | "restyle"; onPick: (p: Pick) => void; onClose: () => void }) {
  const [kind, setKind] = useState<Kind>(initialKind ?? "invite");
  const occ = occasionOf(profile);
  const kinds = (Object.keys(KINDS) as Kind[]).filter((k) => mode === "add" || k === kind);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end justify-center bg-wine/30 backdrop-blur-md md:items-center" onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 30 }} onClick={(e) => e.stopPropagation()} className="scroll-soft flex max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[32px] bg-ivory shadow-2xl md:rounded-[32px]">
        <div className="flex items-start justify-between gap-4 px-6 pb-3 pt-6 md:px-8">
          <div>
            <p className="eyebrow text-rose">{mode === "add" ? "Template gallery" : "Restyle this piece"}</p>
            <h2 className="t-h2 mt-1">Choose a <em className="text-rose">beginning</em> — then refine it in chat</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-2xl leading-none text-muted hover:bg-blush" aria-label="Close">×</button>
        </div>
        {mode === "add" && (
          <div className="scroll-soft flex shrink-0 gap-6 overflow-x-auto px-6 pb-3 pt-1 md:px-8">
            {GROUPS.map((g) => (
              <div key={g} className="shrink-0">
                <p className="eyebrow mb-2 text-muted">{g}</p>
                <div className="flex gap-1.5">
                  {kinds.filter((k) => KINDS[k].group === g).map((k) => (
                    <button key={k} onClick={() => setKind(k)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition ${kind === k ? "bg-wine text-white shadow" : "bg-white/70 text-ink hover:bg-blush"}`}>{KINDS[k].name}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="shrink-0 px-6 pb-3 text-sm italic text-muted md:px-8">{KINDS[kind].blurb}</p>
        <div className="scroll-soft flex-1 overflow-y-auto px-6 pb-10 md:px-8">
          <AnimatePresence mode="popLayout">
            <motion.div key={kind} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`grid gap-5 ${kind === "website" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : KINDS[kind].ratio === "7/5" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
              {templatesFor(kind, occ).map((tpl, i) => {
                const th = themeById(tpl.theme);
                return (
                  <motion.button key={tpl.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.035 }} whileHover={{ y: -6 }} onClick={() => onPick({ kind, layout: tpl.layout, theme: tpl.theme, motif: tpl.motif, fonts: tpl.fonts, template: tpl.template })} className="group text-left">
                    <div className="pointer-events-none transition duration-500 group-hover:drop-shadow-2xl">
                      {kind === "website" ? (
                        <ScaledFrame width={1100} className="aspect-[4/3] rounded-[14px] bg-white ring-1 ring-black/5">
                          <WeddingSite profile={profile} theme={th} layout={tpl.layout} motif={tpl.motif} design={{ fonts: tpl.fonts, template: tpl.template }} compact />
                        </ScaledFrame>
                      ) : (
                        <div className="overflow-hidden rounded-[3px] shadow-[0_24px_50px_-30px_rgba(74,20,36,.6)]"><Paper kind={kind} layout={tpl.layout} design={{ ...defaultDesign(kind, profile), motif: tpl.motif, fonts: tpl.fonts, template: tpl.template }} profile={profile} theme={th} animate={false} /></div>
                      )}
                    </div>
                    <p className="display mt-3 text-xl">{tpl.name}</p>
                    <p className="text-xs text-muted">{th.name} · {(kind === "website" ? SITE_LAYOUTS : PAPER_LAYOUTS)[tpl.layout as never] ?? tpl.layout}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
