"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Envelope, Seal, RibbonRule, SS_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Grain, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, gsap } from "../../celebrate/_shared/motion";
import { EventSections, type Look } from "../_shared/kit";
import { ew, names, fmt, langOf } from "../_shared/words";

export const SS_VARS = { "--t-bg": "#f8f1f3", "--t-surface": "#fffaf6", "--t-ink": "#3e2d4a", "--t-muted": "#8a7891", "--t-accent": "#b07a92", "--t-gold": "#c99a4a" };

const TAP = {
  en: { tap: "Touch the seal", kept: "Not yet! We'll open it together on" },
  ru: { tap: "Коснитесь печати", kept: "Ещё рано! Откроем вместе —" },
  hi: { tap: "मुहर को छुएँ", kept: "अभी नहीं! साथ में खोलेंगे —" },
};

export const SS_LOOK: Look = {
  display: F.prata, script: F.vibes, body: F.cormG, foil: "evss-foil", accent: "text-[var(--t-accent)]",
  panel: "rounded-[14px] border border-[#eadfd2] bg-[#fffaf6] shadow-[0_30px_70px_-40px_rgba(62,45,74,.4)]",
  tile: "rounded-[14px] border border-[#eadfd2] bg-[#fffaf6]/90",
  line: "border-[#d9c7cf]",
  button: "inline-block rounded-full border border-[#c99a4a] bg-[#fffaf6] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-[#3e2d4a] transition hover:bg-[#c99a4a] hover:text-white",
  Frame: ({ children }) => <div className="relative aspect-[4/5] rotate-[-2deg] bg-white p-3 pb-12 shadow-[0_24px_50px_-24px_rgba(62,45,74,.45)]"><div className="h-full w-full overflow-hidden">{children}</div><Seal className="absolute -bottom-5 left-1/2 w-14 -translate-x-1/2" /></div>,
  ornament: <RibbonRule className="w-32" />,
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [tapped, setTapped] = useState(false);
  const L = ew(profile);
  const T = TAP[langOf(profile)];
  const n = names(profile);
  useLenis(!compact);

  // Opening: the envelope drifts in on a breeze, the question mark peeks up from inside, the seal presses down.
  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-env]"), { x: -160, y: 40, rotate: -14, opacity: 0, duration: 1.8, ease: "power3.out" })
      .from(q("[data-env] [data-peek]"), { y: 70, duration: 1.2, ease: "back.out(1.6)" }, "<.9")
      .from(q("[data-env] [data-seal]"), { scale: 2.2, opacity: 0, duration: 0.6, ease: "power4.in" }, "<.4")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out" }, "<.2");
  }, [compact]);

  const touch = () => {
    if (compact) return;
    setTapped(true);
    const peek = root.current?.querySelector("[data-env] [data-peek]");
    const seal = root.current?.querySelector("[data-env] [data-seal]");
    if (peek) gsap.fromTo(peek, { y: 0 }, { y: -22, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.out" });
    if (seal) gsap.fromTo(seal, { rotate: 0 }, { rotate: 10, duration: 0.12, yoyo: true, repeat: 5 });
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} evss-root relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("sealed-secret", theme, design, SS_VARS), fontFamily: F.cormG }}>
      <style href="ev-ss" precedence="default">{SS_CSS}</style>
      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[760px] pb-10 pt-14" : "min-h-[100svh] pb-14 pt-16"}`}>
        <Grain opacity={0.08} freq={0.9} />
        <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.title}</p>
        <h1 className={`relative mt-4 leading-[1.02] ${compact ? "text-[44px]" : "text-[clamp(2.8rem,8vw,6rem)]"}`} style={{ fontFamily: F.prata }}>
          <span className="evss-foil evss-shine">{L.kicker}</span>
        </h1>
        <button type="button" data-env onClick={touch} aria-label={T.tap} className={`relative mt-6 outline-none ${compact ? "w-[300px] cursor-default" : "w-[min(86vw,440px)] cursor-pointer"}`}>
          <Envelope className="w-full drop-shadow-[0_30px_40px_rgba(62,45,74,.18)]" />
        </button>
        {!compact && <p data-hero-in className="relative mt-2 text-sm italic text-[var(--t-muted)]">{tapped ? `${T.kept} ${fmt(profile)}` : T.tap}</p>}
        <p data-hero-in className={`relative mt-4 text-[var(--t-accent)] ${compact ? "text-4xl" : "text-[2.6rem] md:text-5xl"}`} style={{ fontFamily: F.vibes }}>
          <E path="profile.partner1">{n.a}</E>{n.b && <> &amp; <E path="profile.partner2">{n.b}</E></>}
        </p>
        <div data-hero-in className="relative mt-3 flex items-center gap-4"><RibbonRule className="w-16" /><p className="text-2xl" style={{ fontFamily: F.prata }}>{fmt(profile)}</p><RibbonRule className="w-16" /></div>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
      </header>

      <EventSections look={SS_LOOK} profile={profile} design={design} heroUrl={heroUrl} calendarUrl={calendarUrl} compact={compact}>{children}</EventSections>

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Seal className="evss-pulse mx-auto w-14" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
