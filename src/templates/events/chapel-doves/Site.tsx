"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Chapel, DoveOlive, DoveShape, CrossRule, CD_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Grain, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { EventSections, type Look } from "../_shared/kit";
import { ew, names, fmt } from "../_shared/words";

export const CD_VARS = { "--t-bg": "#fbf8f1", "--t-surface": "#ffffff", "--t-ink": "#263a52", "--t-muted": "#6f8199", "--t-accent": "#4d6f94", "--t-gold": "#c9a36a" };

export const CD_LOOK: Look = {
  display: F.corm, script: F.vibes, body: F.cormG, foil: "evcd-foil", accent: "text-[var(--t-accent)]", italic: true,
  panel: "rounded-t-[120px] rounded-b-[18px] border border-[#d8cfbe] bg-white shadow-[0_30px_70px_-40px_rgba(38,58,82,.35)]",
  tile: "rounded-[18px] border border-[#e3dccd] bg-white",
  line: "border-[#c9bfae]",
  button: "inline-block rounded-full bg-[#263a52] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-[#fbf8f1] transition hover:bg-[#4d6f94]",
  Frame: ({ children }) => <div className="aspect-[4/5] overflow-hidden rounded-t-full border border-[#c9a36a] bg-white p-2 shadow-[0_24px_50px_-28px_rgba(38,58,82,.4)]"><div className="h-full w-full overflow-hidden rounded-t-full">{children}</div></div>,
  ornament: <CrossRule className="w-32" />,
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const L = ew(profile);
  const n = names(profile);
  useLenis(!compact);

  // Opening: the chapel doors swing open on golden light and three doves rise out over the guests.
  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-chapel]"), { y: 40, opacity: 0, duration: 1.3, ease: "power3.out" })
      .to(q("[data-chapel] [data-door='l']"), { scaleX: 0.15, duration: 1.4, ease: "power2.inOut" }, ">.1")
      .to(q("[data-chapel] [data-door='r']"), { scaleX: 0.15, duration: 1.4, ease: "power2.inOut" }, "<")
      .from(q("[data-chapel] [data-dove]"), { y: 60, scale: 0.2, opacity: 0, stagger: 0.2, duration: 1.4, ease: "power2.out", transformOrigin: "50% 50%" }, "<.5")
      .from(q("[data-sky-dove]"), { x: -80, y: 50, opacity: 0, stagger: 0.25, duration: 2, ease: "power2.out" }, "<.3")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.12, duration: 1.1, ease: "power3.out" }, "<");
  }, [compact]);

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} evcd-root relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("chapel-doves", theme, design, CD_VARS), fontFamily: F.cormG }}>
      <style href="ev-cd" precedence="default">{CD_CSS}</style>
      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[760px] pb-10 pt-12" : "min-h-[100svh] pb-14 pt-16"}`}>
        <Grain opacity={0.06} freq={0.9} />
        {[["12%", "18%", 0.9], ["78%", "12%", 0.7], ["86%", "34%", 0.55]].map(([l, t, s], i) => (
          <div key={i} data-sky-dove className="evcd-fly absolute w-14 md:w-20" style={{ left: l as string, top: t as string, scale: String(s), animationDelay: `${i * 1.3}s` }}><DoveShape className="w-full" /></div>
        ))}
        <p data-hero-in className="relative max-w-md text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{L.kicker}</p>
        <h1 className={`relative mt-3 italic leading-[0.95] ${compact ? "text-[54px]" : "text-[clamp(3.2rem,10vw,7.5rem)]"}`} style={{ fontFamily: F.corm }}>
          <E path="profile.partner1" className="evcd-foil evcd-shine">{n.a}</E>
        </h1>
        <div data-chapel className={`relative mt-4 ${compact ? "w-[250px]" : "w-[min(70vw,340px)]"}`}><Chapel className="w-full" /></div>
        <div data-hero-in className="relative mt-5 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current" /><p className="text-2xl italic text-[var(--t-ink)]" style={{ fontFamily: F.corm }}>{fmt(profile)}</p><span className="h-px w-12 bg-current" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block max-w-xl text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
      </header>

      <EventSections look={CD_LOOK} profile={profile} design={design} heroUrl={heroUrl} calendarUrl={calendarUrl} compact={compact}>{children}</EventSections>

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <DoveOlive className="mx-auto w-24" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
