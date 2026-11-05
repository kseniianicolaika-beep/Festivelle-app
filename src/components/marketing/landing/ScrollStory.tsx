"use client";
import { useEffect, useRef, useState } from "react";
import { Paper } from "@/components/designs/Paper";
import { templateById } from "@/lib/catalog";
import { themeById } from "@/lib/themes";
import type { Profile } from "@/lib/profile";
import type { DemoScript } from "../TalkDemo";

// How many conversation lines each chapter has revealed.
const UPTO = [2, 4, 6, 7];

// "Talk → it designs itself", told as four scroll chapters. The invitation on the right blooms into a new,
// real bespoke template as each answer lands.
export function ScrollStory({ script, chapters, labels }: { script: DemoScript; chapters: [string, string][]; labels: { you: string; ai: string; blank: string } }) {
  const [active, setActive] = useState(-1);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); });
    }, { rootMargin: "-48% 0px -48% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const shown = active < 0 ? [] : script.slice(0, UPTO[Math.min(active, UPTO.length - 1)]);
  const state = shown.reduce<{ profile: Profile; template?: string }>((s, st) => ({ profile: { ...s.profile, ...st.profile }, template: st.template ?? s.template }), { profile: { occasion: "wedding", language: "en" } });
  const tpl = state.template ? templateById(state.template) : null;

  return (
    <div className="relative grid md:grid-cols-[1fr_1fr] md:gap-16">
      {/* Sticky stage */}
      <div className="sticky top-[64px] z-10 -mx-5 flex h-[54vh] items-center justify-center bg-gradient-to-b from-ivory via-ivory to-ivory/0 px-5 pb-6 md:order-2 md:top-0 md:mx-0 md:h-dvh md:bg-none md:pb-0">
        <div className="relative w-[min(64vw,300px)] md:w-[min(34vw,400px)]">
          <div aria-hidden className="absolute inset-[-18%] -z-10 rounded-full transition-[background] duration-[1600ms]" style={{ background: `radial-gradient(closest-side, ${tpl ? themeById(tpl.theme).gold : "#e9c9b8"}55, transparent)` }} />
          {tpl ? (
            <div key={tpl.id + (state.profile.partner1 ?? "")} className="bloom relative">
              <span aria-hidden className="bloom-ring pointer-events-none absolute left-1/2 top-[46%] -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60" />
              <div className="poster-shadow overflow-hidden rounded-[3px]">
                <Paper kind="invite" layout={tpl.paperLayout} design={{ template: tpl.id, motif: tpl.motif, fonts: tpl.fonts }} profile={{ ...state.profile, occasion: "wedding" }} theme={themeById(tpl.theme)} />
              </div>
            </div>
          ) : (
            <BlankSheet label={labels.blank} />
          )}
        </div>
      </div>

      {/* Chapters */}
      <div className="relative md:order-1">
        {chapters.map(([title, line], i) => {
          const from = i === 0 ? 0 : UPTO[i - 1];
          const lines = script.slice(from, UPTO[i]);
          const on = active >= i;
          return (
            <div key={i} ref={(el) => { refs.current[i] = el; }} data-i={i} className="flex min-h-[78vh] flex-col justify-center py-16 md:min-h-[92vh]">
              <p className={`num text-2xl text-rose transition-opacity duration-700 ${on ? "opacity-100" : "opacity-30"}`}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className={`t-h1 mt-2 transition-all duration-1000 ${on ? "opacity-100" : "translate-y-3 opacity-25"}`}>{title}</h3>
              <p className={`t-lede mt-5 max-w-md transition-opacity delay-150 duration-1000 ${on ? "opacity-100" : "opacity-20"}`}>{line}</p>
              <div className="mt-8 flex max-w-md flex-col gap-2.5">
                {lines.map((s, j) => (
                  <div key={j} className={`max-w-[88%] rounded-[22px] px-4 py-2.5 text-[15px] leading-snug transition-all duration-700 ${s.who === "you" ? "self-end rounded-br-md bg-wine text-[#fbeee6] shadow-[0_14px_30px_-18px_rgba(74,20,36,.8)]" : "self-start rounded-bl-md bg-white/80 text-ink ring-1 ring-line"} ${on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} style={{ transitionDelay: on ? `${300 + j * 260}ms` : "0ms" }}>
                    <span className="mb-0.5 block text-[9.5px] uppercase tracking-[.24em] opacity-55">{s.who === "you" ? labels.you : labels.ai}</span>
                    {s.text}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlankSheet({ label }: { label: string }) {
  return (
    <div className="poster-shadow relative aspect-[5/7] overflow-hidden rounded-[3px] bg-[#fffaf4] paper-tex">
      <div className="absolute inset-[7%] border border-gold/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-[14%]">
        <span className="h-px w-1/3 bg-gold/50" />
        {[70, 52, 0, 64, 40].map((w, i) => (w ? <span key={i} className="relative h-2.5 overflow-hidden rounded-full bg-[#efe3d6]" style={{ width: `${w}%` }}><span className="sweep absolute inset-0" /></span> : <p key={i} className="script py-2 text-center text-[clamp(1.6rem,3vw,2.4rem)] text-rose/70">{label}</p>))}
        <span className="h-px w-1/3 bg-gold/50" />
      </div>
    </div>
  );
}
