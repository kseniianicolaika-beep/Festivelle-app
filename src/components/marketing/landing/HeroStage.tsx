"use client";
import { useEffect, useRef, useState } from "react";
import type { TemplateDef } from "@/lib/catalog";
import { themeById } from "@/lib/themes";
import { bespokeFor } from "@/templates/registry";
import { LiveTemplate } from "../Live";

const CYCLE = 11000;

// The hero's stage: a real bespoke template plays its opening on a phone, its invitation resting beside it,
// then gives way to the next — like a stationer turning the pages of their book.
export function HeroStage({ list, label }: { list: TemplateDef[]; label: string }) {
  const [i, setI] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const t = list[i % list.length];
  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => { if (!document.hidden) setI((x) => x + 1); }, CYCLE);
    return () => clearInterval(id);
  }, [list.length]);
  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches) return;
    const on = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  if (!t) return null;
  const th = themeById(t.theme);
  const opening = bespokeFor(t.id)?.opening ?? t.blurb;
  return (
    <div ref={stage} className="relative mx-auto w-full max-w-[560px] [--px:0] [--py:0]">
      {/* glow + arch */}
      <div aria-hidden className="absolute inset-[-12%] -z-10 transition-[background] duration-[2000ms]" style={{ background: `radial-gradient(50% 46% at 55% 48%, ${th.gold}55, transparent 70%), radial-gradient(40% 40% at 35% 70%, ${th.accent}22, transparent 70%)` }} />
      <svg aria-hidden viewBox="0 0 400 520" className="absolute left-1/2 top-[2%] -z-10 h-[96%] -translate-x-1/2 text-gold/50" fill="none" stroke="currentColor">
        <path d="M30 520V200C30 96 106 20 200 20s170 76 170 180v320" strokeWidth=".8" />
        <path d="M48 520V204C48 110 116 38 200 38s152 72 152 166v316" strokeWidth=".5" strokeDasharray="1 5" />
      </svg>
      <div className="relative flex items-end justify-center gap-0 pb-6 pt-4">
        <div key={`card-${i}`} className="fade-up relative z-10 mb-[6%] mr-[-14%] w-[46%] max-w-[250px]" style={{ ["--d" as string]: "600ms" }}>
          <div style={{ transform: "translate3d(calc(var(--px) * -18px), calc(var(--py) * -14px), 0) rotate(-5deg)" }} className="transition-transform duration-500 ease-out">
            <div className="poster-shadow overflow-hidden rounded-[3px]"><LiveTemplate t={t} play="mount" replayOnHover={false} /></div>
          </div>
        </div>
        <div key={`site-${i}`} className="fade-up relative w-[56%] max-w-[300px]">
          <div style={{ transform: "translate3d(calc(var(--px) * 12px), calc(var(--py) * 10px), 0)" }} className="transition-transform duration-500 ease-out">
            <LiveTemplate t={t} kind="website" play="mount" device="phone" replayOnHover={false} />
          </div>
        </div>
      </div>
      <div className="relative mt-2 flex items-center gap-4 px-2">
        <span className="num text-sm text-muted">{String((i % list.length) + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span>
        <span className="relative h-px flex-1 overflow-hidden bg-line">
          <span key={i} className="absolute inset-y-0 left-0 w-full origin-left bg-wine/60" style={{ animation: `hero-progress ${CYCLE}ms linear both` }} />
        </span>
        <span className="min-w-0 truncate text-right text-[12.5px] text-muted"><span className="kicker !tracking-[.28em] text-rose before:hidden">{label}</span> <span className="ml-2 font-display text-[1.05rem] italic text-ink">{t.name}</span><span className="hidden sm:inline"> — {opening}</span></span>
      </div>
      <style>{`@keyframes hero-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } } @media (prefers-reduced-motion: reduce) { [style*="hero-progress"] { animation: none !important; } }`}</style>
    </div>
  );
}
