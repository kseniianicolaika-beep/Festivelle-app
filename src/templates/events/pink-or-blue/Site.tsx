"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Bouquet, Cloud, Pair, Dots, PINK, BLUE, PK_CSS } from "./art";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { Grain, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../../celebrate/_shared/motion";
import { EventSections, type Look } from "../_shared/kit";
import { ew, names, fmt, langOf } from "../_shared/words";

export const PK_VARS = { "--t-bg": "#fdf6f2", "--t-surface": "#ffffff", "--t-ink": "#4b3550", "--t-muted": "#8f7a8c", "--t-accent": "#c06c8c", "--t-gold": "#c99a4a" };

const GUESS = {
  en: { ask: "Cast your guess", pink: "Team pink", blue: "Team blue", done: "Your guess is in — we'll all find out together!" },
  ru: { ask: "Ваша догадка?", pink: "Команда розовых", blue: "Команда голубых", done: "Догадка принята — узнаем все вместе!" },
  hi: { ask: "आपका अनुमान?", pink: "टीम गुलाबी", blue: "टीम नीला", done: "अनुमान दर्ज — साथ में जानेंगे!" },
};

export const PK_LOOK: Look = {
  display: F.fraun, script: F.caveat, body: F.montserrat, foil: "evpk-foil", accent: "text-[var(--t-accent)]", italic: true,
  panel: "rounded-[36px] bg-white shadow-[0_30px_80px_-40px_rgba(75,53,80,.35)] ring-1 ring-[#f1dde4]",
  tile: "rounded-[30px] bg-white/80 ring-1 ring-[#eadbe6]",
  line: "border-[#d9c4d6]",
  button: "inline-block rounded-full bg-gradient-to-r from-[#f2a7bf] to-[#9cc6e8] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#4b3550] transition hover:brightness-105",
  Frame: ({ children }) => <div className="aspect-[4/5] overflow-hidden rounded-[48%_48%_40px_40px] p-[5px]" style={{ background: `linear-gradient(135deg,${PINK},#e8c27a,${BLUE})` }}><div className="h-full w-full overflow-hidden rounded-[48%_48%_36px_36px]">{children}</div></div>,
  ornament: <Pair className="w-12" />,
};

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [guess, setGuess] = useState<"p" | "b" | null>(null);
  const L = ew(profile);
  const G = GUESS[langOf(profile)];
  const n = names(profile);
  useLenis(!compact);

  // Opening: pink and blue balloons rise from below, the gold "?" spins in last and bobs.
  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    gsap.timeline({ delay: 0.2 })
      .from(q("[data-balloon]"), { y: 260, opacity: 0, duration: 1.8, stagger: 0.1, ease: "power2.out" })
      .from(q("[data-q]"), { y: 300, rotate: -25, scale: 0.6, opacity: 0, duration: 1.8, ease: "back.out(1.4)", transformOrigin: "50% 50%" }, "<.5")
      .from(q("[data-cloud]"), { x: (i) => (i % 2 ? 120 : -120), opacity: 0, duration: 1.6, ease: "power2.out" }, "<")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out" }, "<.4");
  }, [compact]);

  const vote = (g: "p" | "b", el: HTMLElement) => {
    setGuess(g);
    if (root.current) burstFrom(root.current, el, { colors: g === "p" ? [PINK, "#ffd3e0", "#e8c27a"] : [BLUE, "#d9ecfa", "#e8c27a"], n: 50, shapes: ["circle", "rect"], angle: [220, 320], velocity: [300, 650], gravity: 700, size: 8 });
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} evpk-root relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("pink-or-blue", theme, design, PK_VARS), fontFamily: F.montserrat }}>
      <style href="ev-pk" precedence="default">{PK_CSS}</style>
      <header className={`relative flex flex-col items-center px-5 text-center ${compact ? "min-h-[760px] pb-10 pt-12" : "min-h-[100svh] pb-14 pt-14"}`}>
        <Dots />
        <div data-cloud className="absolute left-[-30px] top-[18%] w-40 md:w-56"><Cloud className="w-full" /></div>
        <div data-cloud className="absolute right-[-30px] top-[48%] w-44 md:w-64"><Cloud className="w-full" /></div>
        <Grain opacity={0.06} freq={0.9} />
        <p data-hero-in className="relative text-[11px] font-semibold uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.kicker}</p>
        <div className={`evpk-float relative mt-2 ${compact ? "w-[250px]" : "w-[min(70vw,340px)]"}`}><Bouquet className="w-full" /></div>
        <h1 className={`relative -mt-2 italic leading-[1] ${compact ? "text-[46px]" : "text-[clamp(2.8rem,8vw,6rem)]"}`} style={{ fontFamily: F.fraun }}>
          <E path="profile.partner1" className="evpk-foil evpk-shine">{n.a}</E>
          {n.b && <><span className="mx-3 text-[0.7em] text-[var(--t-gold)]" style={{ fontFamily: F.caveat }}>&amp;</span><E path="profile.partner2" className="evpk-foil evpk-shine">{n.b}</E></>}
        </h1>
        <p data-hero-in className={`relative text-[var(--t-accent)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`} style={{ fontFamily: F.caveat }}>{L.line}</p>
        <p data-hero-in className="relative mt-3 text-xl italic" style={{ fontFamily: F.fraun }}>{fmt(profile)}</p>
        {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-1 block text-[11px] font-semibold uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}

        <div data-hero-in className="relative mt-8">
          <p className="text-2xl" style={{ fontFamily: F.caveat }}>{guess ? G.done : G.ask}</p>
          <div className="mt-3 flex justify-center gap-3">
            {(["p", "b"] as const).map((g) => (
              <button key={g} type="button" disabled={compact} onClick={(e) => vote(g, e.currentTarget)} aria-pressed={guess === g}
                className={`rounded-full px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#4b3550] transition ${guess === g ? "scale-105 ring-2 ring-[#4b3550]/40" : "hover:scale-105"} ${guess && guess !== g ? "opacity-50" : ""}`}
                style={{ background: g === "p" ? PINK : BLUE }}>{g === "p" ? G.pink : G.blue}</button>
            ))}
          </div>
        </div>
      </header>

      <EventSections look={PK_LOOK} profile={profile} design={design} heroUrl={heroUrl} calendarUrl={calendarUrl} compact={compact}>{children}</EventSections>

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Pair className="mx-auto w-16" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.caveat }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
