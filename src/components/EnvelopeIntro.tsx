"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";
import { Aurora } from "./fx/Aurora";
import { Petals } from "./fx/Petals";

type Props = { id: string; initials: string; label: string; names: string; bg: string; accent: string; gold: string; ink: string; petals: string[] };
const noop = () => () => {};

// The guest's first moment: a sealed envelope that opens, then the website blooms behind it.
export function EnvelopeIntro({ id, initials, label, names, bg, accent, gold, ink, petals }: Props) {
  const seen = useSyncExternalStore(noop, () => { try { return sessionStorage.getItem(`opened:${id}`) === "1"; } catch { return false; } }, () => false);
  const [stage, setStage] = useState<"closed" | "opening" | "gone">("closed");
  if (seen && stage === "closed") return null;

  function open() {
    setStage("opening");
    try { sessionStorage.setItem(`opened:${id}`, "1"); } catch {}
    setTimeout(() => setStage("gone"), 2100);
  }

  return (
    <AnimatePresence>
      {stage !== "gone" && (
        <motion.div key="env" className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden" style={{ background: bg, color: ink }} exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }} transition={{ duration: 1.1, ease: [0.6, 0, 0.2, 1] }}>
          <Aurora colors={[`${accent}33`, `${gold}44`, `${accent}22`, `${gold}22`]} />
          <Petals count={14} colors={petals} className="absolute" />
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.75, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="eyebrow relative mb-10">{names}</motion.p>

          <motion.button onClick={open} disabled={stage !== "closed"} aria-label={label} initial={{ y: 40, opacity: 0, rotate: -2 }} animate={stage === "closed" ? { y: [0, -8, 0], opacity: 1, rotate: -2 } : { y: 60, opacity: 1, rotate: 0 }} transition={stage === "closed" ? { y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1 } } : { duration: 1.2, ease: "easeInOut" }} className="relative h-[230px] w-[330px] [perspective:1000px] sm:h-[260px] sm:w-[380px]">
            {/* letter */}
            <motion.div className="absolute inset-x-5 top-4 bottom-4 rounded-sm bg-white shadow-md" animate={stage === "opening" ? { y: -150 } : { y: 0 }} transition={{ delay: 0.7, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}>
              <div className="flex h-full flex-col items-center justify-center gap-1 border border-[color:var(--g)] m-2" style={{ ["--g" as string]: gold }}>
                <span className="script text-3xl" style={{ color: accent }}>{initials}</span>
                <span className="text-[9px] uppercase tracking-[0.4em] opacity-60">✦</span>
              </div>
            </motion.div>
            {/* envelope body */}
            <div className="absolute inset-0 rounded-md shadow-[0_40px_80px_-30px_rgba(74,20,36,.5)]" style={{ background: `linear-gradient(160deg, #fffaf4, ${bg})`, clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)" }} />
            <div className="absolute inset-0 rounded-md" style={{ background: `linear-gradient(20deg, ${bg}, #fffdf9)`, clipPath: "polygon(0 100%, 50% 48%, 100% 100%)" }} />
            {/* flap */}
            <motion.div className="absolute inset-x-0 top-0 h-[56%] origin-top" style={{ background: `linear-gradient(180deg, #fffdf9, ${bg})`, clipPath: "polygon(0 0, 100% 0, 50% 100%)", zIndex: stage === "opening" ? 0 : 2 }} animate={stage === "opening" ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} />
            {/* wax seal */}
            <motion.div className="absolute left-1/2 top-[56%] z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg" style={{ background: `radial-gradient(circle at 35% 30%, ${accent}, color-mix(in oklab, ${accent} 60%, black))` }} animate={stage === "opening" ? { scale: 0, opacity: 0 } : { scale: [1, 1.06, 1] }} transition={stage === "opening" ? { duration: 0.4 } : { duration: 2.4, repeat: Infinity }}>
              <span className="script text-xl">{initials}</span>
            </motion.div>
          </motion.button>

          <motion.button onClick={open} initial={{ opacity: 0 }} animate={{ opacity: stage === "closed" ? 1 : 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="relative mt-14 rounded-full border px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] backdrop-blur" style={{ borderColor: `${gold}aa` }}>
            {label}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
