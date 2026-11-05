"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Paper } from "@/components/designs/Paper";
import { themeById } from "@/lib/themes";
import type { Profile } from "@/lib/profile";
import type { MotifId } from "@/lib/motifs";

type Step = { who: "you" | "ai"; text: string; profile?: Partial<Profile>; theme?: string; layout?: string; motif?: MotifId };
export type DemoScript = Step[];

// "Talk → it designs itself": a scripted conversation that restyles a real invitation as it plays.
export function TalkDemo({ script, labels }: { script: DemoScript; labels: { you: string; ai: string } }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(1);
  useEffect(() => {
    const t = setTimeout(() => setN((x) => (x >= script.length ? 1 : x + 1)), n >= script.length ? 4200 : 1900);
    return () => clearTimeout(t);
  }, [n, script.length]);
  const shown = reduce ? script : script.slice(0, n);
  const state = shown.reduce<{ profile: Profile; theme: string; layout: string; motif?: MotifId }>(
    (s, st) => ({ profile: { ...s.profile, ...st.profile }, theme: st.theme ?? s.theme, layout: st.layout ?? s.layout, motif: st.motif ?? s.motif }),
    { profile: { occasion: "wedding", language: "en" }, theme: "mogra", layout: "classic" },
  );
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div className="glass flex h-[420px] flex-col justify-end gap-2.5 overflow-hidden rounded-[28px] p-5">
        <AnimatePresence initial={false}>
          {shown.slice(-6).map((s, i) => (
            <motion.div key={`${n}-${i}-${s.text}`} layout initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-[15px] leading-snug ${s.who === "you" ? "self-end rounded-br-md bg-wine text-[#fbeee6]" : "self-start rounded-bl-md bg-white/85 text-ink"}`}>
              <span className="mb-0.5 block text-[10px] uppercase tracking-[.2em] opacity-60">{s.who === "you" ? labels.you : labels.ai}</span>
              {s.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <motion.div key={state.theme + state.layout} initial={{ opacity: 0.4, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.9 }} className="mx-auto w-full max-w-[340px]">
        <Paper kind="invite" layout={state.layout} design={{ motif: state.motif }} profile={state.profile} theme={themeById(state.theme)} className="shadow-[0_50px_90px_-40px_rgba(74,20,36,.7)]" />
      </motion.div>
    </div>
  );
}
