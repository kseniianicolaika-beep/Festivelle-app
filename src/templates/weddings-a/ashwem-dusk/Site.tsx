"use client";
import { useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { eventWhen, siteData } from "../_shared/data";
import { revealOnScroll, useDaysLeft, useLenis, useScene } from "../_shared/motion";
import { ff, Photo, rootVars, Sec } from "../_shared/ui";
import { CoastMap, Scene, SunMark } from "./art";
import { FACES, FONTS } from "./faces";
import "./ashwem.css";

const serif = { fontFamily: "var(--font-cormorant), var(--font-deva), Georgia, serif" };

// The page itself is the sunset: each section is a little later in the evening than the one before.
const TONES = ["var(--t-bg)", "#f8e6d6", "#f1cdbd", "#d99a92", "#8b4d68", "#3a2648", "#1b1630"];
function toneAt(f: number) {
  const x = f * (TONES.length - 1), i = Math.min(TONES.length - 2, Math.floor(x)), m = Math.round((x - i) * 100);
  return { color: `color-mix(in oklab, ${TONES[i]} ${100 - m}%, ${TONES[i + 1]})`, dark: f > 0.62 };
}
const sunIcon = (time?: string) => {
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i.exec(time ?? "");
  if (!m) return "sun";
  let h = +m[1]; if (/pm/i.test(m[3] ?? "") && h < 12) h += 12;
  return h >= 19 ? "moon" : h >= 16 ? "set" : "sun";
};

export default function AshwemSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const S = siteData(profile, design);
  const { a, b, L, W, date } = S;
  const ref = useRef<HTMLDivElement>(null);
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  const ready = useScene(ref, (k) => {
    const tl = k.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo("[data-bar=top]", { height: "50%" }, { height: compact ? "6%" : "7vh", duration: 2.1, ease: "power4.inOut" }, 0.15)
      .fromTo("[data-bar=bot]", { height: "50%" }, { height: compact ? "6%" : "7vh", duration: 2.1, ease: "power4.inOut" }, 0.15)
      .from("[data-hero-scene] [data-sun]", { y: -70, duration: 3.2, ease: "power2.out" }, 0)
      .from("[data-hero-scene] [data-glow]", { scale: 0.6, opacity: 0, transformOrigin: "50% 50%", duration: 3 }, 0.2)
      .from("[data-hero-scene] [data-palm]", { x: (i) => (i % 2 ? 60 : -60), opacity: 0, duration: 2.4, stagger: 0.1 }, 0.5);
    const split = new k.Split("[data-names] .wa-name", { type: "chars", charsClass: "wa-ch" });
    tl.fromTo("[data-in]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 1.1)
      .from(split.chars, { yPercent: 70, opacity: 0, filter: "blur(10px)", duration: 1.6, stagger: 0.045 }, 1.15)
      .from("[data-amp]", { opacity: 0, scale: 0.6, duration: 1.4 }, 1.6)
      .from("[data-hero-meta] > *", { y: 16, opacity: 0, duration: 1.1, stagger: 0.12 }, 1.9);
    if (compact) return;
    // Scrolling sinks the sun and lifts the names away, like the last minutes of golden hour.
    const st = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
    k.gsap.to("[data-hero-scene] [data-sun]", { y: 140, scrollTrigger: st });
    k.gsap.to("[data-hero-scene] [data-palm]", { y: (i) => -40 - i * 18, scrollTrigger: st });
    k.gsap.to("[data-hero-copy]", { yPercent: -35, opacity: 0, scrollTrigger: st });
    k.gsap.to("[data-hero-scene] svg", { filter: "saturate(1.3) brightness(.7)", scrollTrigger: st });
    revealOnScroll(k);
    k.q("[data-film]").forEach((el) => k.gsap.from(el, { clipPath: "inset(50% 0 50% 0)", duration: 1.8, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 80%", once: true } }));
    k.q(".wa-coast").forEach((el) => k.gsap.from(el, { drawSVG: "0%", duration: 3, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 80%", once: true } }));
  }, [compact]);

  const vis = S.visible.filter((id) => sectionBody(id) !== null);
  function sectionBody(id: SectionId): ReactNode | null {
    switch (id) {
      case "invitation": return S.occ === "greeting" ? null : true;
      case "story": return profile.story ? true : null;
      case "details": return date || S.where ? true : null;
      case "schedule": return S.events.length ? true : null;
      case "venue": return S.where ? true : null;
      case "gallery": return S.gallery.length ? true : null;
      case "rsvp": return true;
      case "info": return S.info ? true : null;
      default: return null;
    }
  }
  const pad = compact ? "px-6" : "px-6 @3xl:px-16";
  const head = (n: number, title: string, dark: boolean) => (
    <div data-reveal className="mb-12 flex flex-col items-center text-center">
      <p className="wa-caps text-[10px]" style={{ color: dark ? "#f6c48a" : "var(--t-accent)" }}>{W.scene} {String(n).padStart(2, "0")}</p>
      <SunMark className="my-4 w-16 opacity-60" />
      <h2 className="text-[2.6rem] leading-none @3xl:text-[3.6rem]" style={ff.display}>{title}</h2>
    </div>
  );

  const render = (id: SectionId, i: number) => {
    const n = vis.length;
    const tone = toneAt((i + 1) / n), prev = toneAt(i / n);
    const dark = toneAt((i + 0.5) / n).dark;
    const muted = dark ? "rgba(255,236,214,.74)" : i / n > 0.3 ? "color-mix(in oklab, var(--t-ink) 74%, transparent)" : "var(--t-muted)";
    const bg = { background: `linear-gradient(to bottom, ${prev.color}, ${tone.color})`, color: dark ? "#fbeee0" : "var(--t-ink)" };
    const body = (() => {
      switch (id) {
        case "invitation":
          return (
            <div className={`mx-auto max-w-5xl py-24 text-center ${pad}`}>
              {head(i + 1, L.invitation, dark)}
              <E as="p" multiline path="profile.inviteLine" className="mx-auto block max-w-3xl text-[1.75rem] italic leading-[1.4] @3xl:text-[2.4rem]" style={serif}>{S.invite}</E>
              <figure data-reveal className="relative mx-auto mt-16 max-w-4xl">
                <div data-film className="ash-film relative overflow-hidden bg-[#1b1220] p-[10px] @3xl:p-[14px]">
                  <Photo src={heroUrl} className="aspect-[4/5] w-full object-cover @2xl:aspect-[2.2/1]" style={{ filter: "sepia(.18) saturate(1.1) contrast(1.02)" }}
                    fallback={<div className="relative aspect-[4/5] @2xl:aspect-[2.2/1]"><Scene layout="wide" className="absolute inset-0 h-full w-full" still={compact} /></div>} />
                  <div className="pointer-events-none absolute inset-[10px] bg-[linear-gradient(180deg,rgba(255,170,90,.18),transparent_40%,rgba(80,30,60,.35))] mix-blend-soft-light @3xl:inset-[14px]" />
                  <div className="ash-sprockets" />
                </div>
                <figcaption className="mt-4 flex justify-between text-[10px] tracking-[0.3em]" style={{ color: muted }}>
                  <span>{(profile.city || "GOA").toUpperCase()}</span><span>{date?.dots}</span>
                </figcaption>
              </figure>
            </div>
          );
        case "story":
          return (
            <div className={`mx-auto max-w-3xl py-24 ${pad}`}>
              {head(i + 1, L.story, dark)}
              <E as="p" multiline path="profile.story" className="ash-dropcap block whitespace-pre-line text-[1.45rem] leading-[1.65] @3xl:text-[1.75rem]" style={serif}>{profile.story}</E>
            </div>
          );
        case "details":
          return (
            <div className={`mx-auto max-w-5xl py-24 ${pad}`}>
              {head(i + 1, L.details, dark)}
              <div className="grid gap-14 text-center @3xl:grid-cols-2 @3xl:gap-6">
                {date && (
                  <div data-reveal>
                    <p className="wa-caps text-[10px]" style={{ color: muted }}>{L.when}</p>
                    <p className="mt-4 text-[7rem] font-light leading-[0.85] @3xl:text-[9rem]" style={serif}>{date.day}</p>
                    <p className="mt-3 text-3xl" style={ff.display}>{date.month} {date.year}</p>
                    <p className="mt-2 text-sm tracking-[0.2em]" style={{ color: muted }}>{date.weekday}</p>
                  </div>
                )}
                {S.where && (
                  <div data-reveal="0.15" className="flex flex-col items-center">
                    <p className="wa-caps text-[10px]" style={{ color: muted }}>{L.where}</p>
                    <E as="p" path={S.wherePath} className="mt-6 block text-[2.6rem] leading-[1.05] @3xl:text-[3.2rem]" style={ff.display}>{S.where}</E>
                    {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-sm tracking-[0.25em]" style={{ color: muted }}>{profile.city}</E>}
                    <p className="mt-4 text-[11px] tracking-[0.3em]" style={{ color: muted }}>15°40′ N · 73°42′ E</p>
                  </div>
                )}
              </div>
              {calendarUrl && <div data-reveal className="mt-14 text-center"><a href={calendarUrl} className="wa-btn border" style={{ borderColor: "currentColor" }}>{L.calendar}</a></div>}
            </div>
          );
        case "schedule":
          return (
            <div className={`mx-auto max-w-4xl py-24 ${pad}`}>
              {head(i + 1, L.events, dark)}
              <ol>
                {S.events.map((e, j) => {
                  const ic = sunIcon(e.time);
                  return (
                    <li key={j} data-reveal={j * 0.08} className="grid grid-cols-1 gap-2 border-t py-8 @2xl:grid-cols-[9rem_1fr_auto] @2xl:items-center @2xl:gap-5" style={{ borderColor: dark ? "rgba(255,230,200,.18)" : "color-mix(in oklab, var(--t-ink) 14%, transparent)" }}>
                      <p className="text-[2.2rem] leading-none @2xl:text-[3.2rem]" style={ff.display}>{(e.time ?? "").replace(/\s*(am|pm)/i, "")}<span className="ml-1 align-top text-[0.75rem] tracking-[0.2em]">{/(am|pm)/i.exec(e.time ?? "")?.[0]?.toUpperCase()}</span></p>
                      <div>
                        <h3 className="text-[1.9rem] leading-tight @2xl:text-[2.3rem]" style={serif}>{e.name}</h3>
                        <p className="mt-1 text-[11px] tracking-[0.22em]" style={{ color: muted }}>{[eventWhen({ ...e, time: undefined }, S.lang), e.venue].filter(Boolean).join(" · ").toUpperCase()}</p>
                      </div>
                      <svg viewBox="0 0 40 40" className="hidden h-10 w-10 opacity-70 @2xl:block" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                        {ic === "moon" ? <path d="M26 8a13 13 0 1 0 6 20A11 11 0 0 1 26 8z" /> : ic === "set" ? <><path d="M8 28a12 12 0 0 1 24 0" /><path d="M2 28h36M10 33h20" /></> : <><circle cx="20" cy="20" r="7" />{Array.from({ length: 8 }, (_, q) => <path key={q} d={`M${20 + Math.cos(q * 0.785) * 11} ${20 + Math.sin(q * 0.785) * 11}L${20 + Math.cos(q * 0.785) * 15} ${20 + Math.sin(q * 0.785) * 15}`} />)}</>}
                      </svg>
                    </li>
                  );
                })}
              </ol>
              {calendarUrl && !S.visible.includes("details") && <div className="mt-10 text-center"><a href={calendarUrl} className="wa-btn border">{L.calendar}</a></div>}
            </div>
          );
        case "venue":
          return (
            <div className={`mx-auto max-w-5xl py-24 ${pad}`}>
              {head(i + 1, L.venue, dark)}
              <div className={`grid items-center gap-12 ${S.goa ? "@3xl:grid-cols-[1fr_1.1fr]" : ""}`}>
                {S.goa && <div data-reveal className="mx-auto w-full max-w-sm" style={{ color: dark ? "#fbe3c8" : "var(--t-ink)" }}><CoastMap className="w-full" pin={`${profile.venue} ${profile.city}`} /></div>}
                <div data-reveal="0.1" className="text-center @3xl:text-left">
                  <E as="p" path={S.wherePath} className="block text-[2.6rem] leading-[1.05]" style={ff.display}>{S.where}</E>
                  {profile.venue && profile.city && <p className="mt-2 tracking-[0.2em]" style={{ color: muted }}>{profile.city}</p>}
                  <a target="_blank" rel="noreferrer" href={S.map} className="wa-btn mt-8 border" style={{ borderColor: "currentColor" }}>{L.directions} →</a>
                  {S.goa && (
                    <div className="mt-12 border-t pt-8" style={{ borderColor: dark ? "rgba(255,230,200,.2)" : "color-mix(in oklab, var(--t-ink) 14%, transparent)" }}>
                      <p className="wa-caps text-[10px]" style={{ color: muted }}>{L.travel}</p>
                      <p className="mt-4 text-xl leading-relaxed" style={{ ...serif, color: muted }}>{L.travelText}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        case "gallery":
          return (
            <div className={`py-24 ${pad}`}>
              {head(i + 1, L.gallery, dark)}
              <div className="ash-strip -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto bg-[#140c18] px-6 py-6 @3xl:-mx-16 @3xl:px-16">
                {S.gallery.map((g, j) => (
                  <Photo key={g.key} slot="gallery" galleryKey={g.key} src={g.src} className={`h-[340px] w-auto shrink-0 snap-center object-cover @3xl:h-[440px] ${j % 3 === 1 ? "aspect-[4/5]" : "aspect-[3/4]"}`} />
                ))}
              </div>
            </div>
          );
        case "rsvp":
          return (
            <div className={`relative mx-auto max-w-2xl py-28 ${pad}`}>
              {head(i + 1, L.rsvp, dark)}
              <p data-reveal className="-mt-6 mb-10 text-center text-2xl italic" style={{ ...serif, color: muted }}>{L.attend}</p>
              <div data-reveal className="ash-rsvp relative rounded-[2px] p-7 @2xl:p-10" style={{ color: "var(--t-ink)" }}>{children}</div>
            </div>
          );
        case "info":
          return (
            <div className={`mx-auto max-w-2xl py-24 text-center ${pad}`}>
              {head(i + 1, L.info, dark)}
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed" style={{ ...serif, color: muted }}>{S.info}</E>
            </div>
          );
      }
    })();
    return <Sec key={id} id={id} style={bg} className={dark ? "ash-dark" : ""}>{body}</Sec>;
  };

  return (
    <div ref={ref} lang={profile.language ?? "en"} style={{ ...rootVars(theme, design, "ashwem-dusk", FACES), ...ff.body }} className={`ash relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] @container ${FONTS} ${ready ? "" : "wa-pre"}`}>
      {/* ── Hero: golden hour, letterboxed like the opening frame of a film ── */}
      <header data-hero className={`relative isolate overflow-hidden text-[#fff5e6] ${compact ? "h-[640px]" : "h-[100svh] min-h-[620px]"}`}>
        <div data-hero-scene className="absolute inset-0">
          <Scene layout="wide" className="absolute inset-0 hidden h-full w-full @3xl:block" still={compact} />
          <Scene layout="tall" className="absolute inset-0 h-full w-full @3xl:hidden" still={compact} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_30%,rgba(20,10,30,.28),transparent_70%)]" />
        <div data-hero-copy className="absolute inset-x-0 top-[13%] flex flex-col items-center px-6 text-center @3xl:top-[15%]">
          <p data-in className="wa-caps mb-6 text-[10px] opacity-90">{S.occ === "wedding" ? W.wedding : S.line}</p>
          <h1 data-names data-in className="flex flex-col items-center leading-[0.9] [text-shadow:0_2px_30px_rgba(60,20,40,.45)] @3xl:flex-row @3xl:gap-6" style={ff.display}>
            <E path="profile.partner1" className="wa-name block text-[clamp(3.6rem,15cqw,9.5rem)] tracking-[0.04em]">{a}</E>
            {b && <span data-amp className="my-1 block text-[clamp(2.4rem,9cqw,5rem)] text-[#ffd79a] @3xl:my-0" style={ff.script}>&amp;</span>}
            {b && <E path="profile.partner2" className="wa-name block text-[clamp(3.6rem,15cqw,9.5rem)] tracking-[0.04em]">{b}</E>}
          </h1>
          <div data-hero-meta data-in className="mt-8 flex flex-col items-center gap-3">
            {date && <p className="text-[12px] tracking-[0.42em]">{date.full.toUpperCase()}</p>}
            {S.where && <E as="p" path={S.wherePath} className="block text-[11px] tracking-[0.3em] opacity-85">{S.where.toUpperCase()}</E>}
            {days !== null && days > 0 && (
              <p className="mt-4 flex [animation:fadein_1.2s_ease_2.6s_both] items-baseline gap-2 border-y border-white/30 px-5 py-2"><span className="text-2xl" style={ff.display}>{days}</span><span className="text-[10px] tracking-[0.3em]">{W.days.toUpperCase()}</span></p>
            )}
          </div>
        </div>
        {/* letterbox bars with slate text */}
        <div data-bar="top" className="absolute inset-x-0 top-0 z-10 flex h-[7%] items-end justify-between bg-[#0c0810] px-5 pb-2 text-[9px] tracking-[0.3em] text-white/45 @3xl:px-10" style={{ height: compact ? "6%" : "7vh" }}>
          <span>{S.goa ? "ASHWEM · NORTH GOA" : (S.where || "").toUpperCase()}</span><span className="hidden @2xl:inline">{W.scene.toUpperCase()} 01 — GOLDEN HOUR</span>
        </div>
        <div data-bar="bot" className="absolute inset-x-0 bottom-0 z-10 flex h-[7%] items-start justify-between bg-[#0c0810] px-5 pt-2 text-[9px] tracking-[0.3em] text-white/45 @3xl:px-10" style={{ height: compact ? "6%" : "7vh" }}>
          <span>{date?.dots}</span><span>{b ? `${a[0]} & ${b[0]}` : a}</span>
        </div>
        <style>{`.wa-pre [data-bar]{height:50%!important}`}</style>
      </header>

      {vis.map((id, i) => render(id, i))}

      {/* ── Night falls: the footer ── */}
      <footer className="relative overflow-hidden bg-[#1b1630] pb-14 pt-24 text-center text-[#fbeee0]">
        <div className="pointer-events-none absolute inset-0 opacity-70">{Array.from({ length: 40 }, (_, i) => <span key={i} className="absolute h-[2px] w-[2px] rounded-full bg-white" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 70}%`, animation: compact ? undefined : `wa-twinkle ${3 + (i % 5)}s ease-in-out ${-(i % 7)}s infinite` }} />)}</div>
        <svg viewBox="0 0 100 100" className="mx-auto mb-10 h-14 w-14 text-[#f6d9a8]" aria-hidden><path d="M62 14a36 36 0 1 0 24 56A30 30 0 0 1 62 14z" fill="currentColor" opacity=".9" /></svg>
        {profile.blessing && <E as="p" path="profile.blessing" className="mx-auto mb-8 block max-w-xl px-6 text-3xl text-[#ffd79a]" style={ff.script}>{profile.blessing}</E>}
        <p className="text-6xl" style={ff.display}>{a[0]}{b && <><span className="mx-3 text-4xl text-[#ffd79a]" style={ff.script}>&amp;</span>{b[0]}</>}</p>
        {S.occ === "wedding" && <p className="wa-caps mt-6 text-[10px] text-white/55">{L.forever}</p>}
        {credit && <div className="mt-12 text-[11px] tracking-wide text-white/45">{credit}</div>}
      </footer>
    </div>
  );
}
