"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { eventWhen, fit, siteData } from "../_shared/data";
import { revealOnScroll, useDaysLeft, useLenis, useScene } from "../_shared/motion";
import { ff, Photo, rootVars, Sec } from "../_shared/ui";
import { Crescent, DoorLeaf, GirihBand, GirihWall, khatamPath, Lantern, LightThrow, ogeeMask, ogeePath, StarRule, starPath } from "./art";
import { arabic, BRASS, FACES, FONTS, naskh } from "./faces";
import "./noor.css";

const caps: CSSProperties = { fontFamily: "var(--wa-amiri), var(--font-cormorant), serif", letterSpacing: "0.34em", textTransform: "uppercase" };

/** Ogee arch outline drawn exactly over an ogee-masked box. */
const Outline = ({ inset = 0, w = 1.4, o = 1, dash }: { inset?: number; w?: number; o?: number; dash?: string }) => (
  <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute" style={{ inset: -inset, width: `calc(100% + ${inset * 2}px)`, height: `calc(100% + ${inset * 2}px)` }} aria-hidden>
    <path d={ogeePath(0, 0, 300, 400)} fill="none" stroke="var(--t-gold)" strokeWidth={w} opacity={o} strokeDasharray={dash} vectorEffect="non-scaling-stroke" />
  </svg>
);

export default function NoorSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const S = siteData(profile, design);
  const { a, b, L, W, date } = S;
  const ref = useRef<HTMLDivElement>(null);
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  const ready = useScene(ref, (k) => {
    const tl = k.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from("[data-lantern]", { yPercent: -70, duration: 2.4, stagger: 0.18, ease: "elastic.out(1, 0.55)" }, 0.1)
      .from("[data-glowup]", { opacity: 0, duration: 1.6 }, 0.6)
      .fromTo(".noor-door-l", { rotateY: 0, transformPerspective: 1400 }, { rotateY: -80, transformPerspective: 1400, duration: 2.6, ease: "power3.inOut" }, 1.0)
      .fromTo(".noor-door-r", { rotateY: 0, transformPerspective: 1400 }, { rotateY: 80, transformPerspective: 1400, duration: 2.6, ease: "power3.inOut" }, 1.0)
      .from("[data-hall]", { scale: 1.12, filter: "brightness(.3)", duration: 3.2, ease: "power2.out" }, 1.0)
      .fromTo("[data-in]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 1.9)
      .from("[data-names] .wa-name", { opacity: 0, y: 18, filter: "blur(10px)", duration: 1.8, stagger: 0.3 }, 2.0)
      .from("[data-amp]", { opacity: 0, scale: 0.4, rotate: -20, duration: 1.4 }, 2.4)
      .from("[data-hero-top] > *", { opacity: 0, y: -10, duration: 1.2, stagger: 0.1 }, 1.9)
      .from("[data-hero-meta] > *", { y: 14, opacity: 0, duration: 1, stagger: 0.12 }, 2.7);
    if (compact) return;
    const st = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
    k.gsap.to("[data-lantern]", { y: (i) => 60 + i * 30, scrollTrigger: st });
    k.gsap.to("[data-hero-copy]", { y: -40, opacity: 0.3, scrollTrigger: st });
    revealOnScroll(k);
    k.q("[data-star]").forEach((el) => k.gsap.from(el, { rotate: -90, scale: 0.6, opacity: 0, duration: 2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }));
  }, [compact]);

  const has = (id: SectionId) => {
    switch (id) {
      case "invitation": return S.occ !== "greeting";
      case "story": return !!profile.story;
      case "details": return !!(date || S.where);
      case "schedule": return S.events.length > 0;
      case "venue": return !!S.where;
      case "gallery": return S.gallery.length > 0;
      case "rsvp": return true;
      case "info": return !!S.info;
    }
  };
  const vis = S.visible.filter(has);
  const pad = compact ? "px-6" : "px-6 @3xl:px-14";
  const muted = { color: "var(--t-muted)" };
  const head = (title: string) => (
    <div data-reveal className="mb-14 flex flex-col items-center text-center">
      <StarRule className="mb-6 w-44" />
      <h2 className="text-[2.4rem] leading-tight @3xl:text-[3rem]" style={{ ...ff.display, color: "var(--t-gold)" }}>{title}</h2>
    </div>
  );
  const nameSize = fit(a.length >= b.length ? a : b, 15, 6);

  const render = (id: SectionId, i: number): ReactNode => {
    const sbg: CSSProperties = { background: i % 2 ? "color-mix(in oklab, var(--t-bg) 82%, #000)" : "var(--t-bg)" };
    switch (id) {
      case "invitation":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            <div className="mx-auto grid max-w-6xl items-center gap-16 @4xl:grid-cols-[1fr_1.05fr]">
              <figure data-reveal className="noor-glow relative mx-auto aspect-[3/4] w-full max-w-[400px]">
                <div className="absolute inset-0" style={ogeeMask(300, 400)}>
                  <Photo src={heroUrl} className="h-full w-full object-cover" fallback={<div className="h-full w-full bg-[radial-gradient(70%_50%_at_50%_35%,#3d6b55,#0b241d)]"><GirihWall className="h-full w-full" opacity={0.25} /></div>} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,210,120,.15),transparent_40%,rgba(5,25,20,.5))] mix-blend-soft-light" />
                </div>
                <Outline w={1.6} />
                <Outline inset={14} w={0.9} o={0.55} />
              </figure>
              <div className="text-center @4xl:text-left">
                {S.invocation ? <p data-reveal className="mb-6 text-[1.9rem] text-[var(--t-gold)]" dir="auto" style={naskh}>{S.invocation.text}</p> : <p data-reveal className="mb-6 text-[11px] text-[var(--t-gold)]" style={caps}>{L.invitation}</p>}
                <E as="p" multiline path="profile.inviteLine" className="block text-[1.9rem] italic leading-[1.4] @3xl:text-[2.4rem]" style={ff.body}>{S.invite}</E>
                <p data-reveal className="mt-10 text-[2.8rem] leading-tight text-[var(--t-gold)]" style={ff.display}>{a}{b && <><span className="mx-3 text-[0.8em]" style={ff.script}>&amp;</span>{b}</>}</p>
                {profile.tradition && <p className="mt-3 text-[11px]" style={{ ...caps, ...muted }}>{profile.tradition}</p>}
              </div>
            </div>
          </Sec>
        );
      case "story":
        return (
          <Sec key={id} id={id} style={sbg} className={`overflow-hidden py-28 ${pad}`}>
            <svg viewBox="-100 -100 200 200" className={`pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-[.07] ${compact ? "" : "noor-spin"}`} aria-hidden fill="none" stroke="var(--t-gold)">
              {[96, 80, 64].map((r, j) => <path key={j} d={starPath(0, 0, r, 0.72)} strokeWidth=".6" transform={`rotate(${j * 11.25})`} />)}
              <path d={khatamPath(0, 0, 40)} strokeWidth=".6" />
            </svg>
            {head(L.story)}
            <div data-reveal className="relative"><E as="p" multiline path="profile.story" className="relative mx-auto block max-w-3xl whitespace-pre-line text-center text-[1.55rem] italic leading-[1.65] @3xl:text-[1.9rem]" style={ff.body}>{profile.story}</E></div>
          </Sec>
        );
      case "details":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.details)}
            <div className="mx-auto grid max-w-5xl items-center gap-14 text-center @3xl:grid-cols-2">
              {date && (
                <div data-reveal className="relative mx-auto aspect-square w-[min(80cqw,330px)]">
                  <svg data-star viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden fill="none" stroke="var(--t-gold)">
                    <path d={starPath(0, 0, 98, 0.78)} strokeWidth="1.1" fill="rgba(212,175,55,.05)" />
                    <path d={starPath(0, 0, 90, 0.78)} strokeWidth=".5" strokeDasharray="1 3" />
                    <path d={khatamPath(0, 0, 72)} strokeWidth=".6" opacity=".55" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px]" style={{ ...caps, ...muted }}>{date.weekday}</p>
                    <p className="wa-foil text-[5.2rem] leading-[1.05]" style={{ ...ff.display, ...BRASS }}>{date.day}</p>
                    <p className="text-[12px]" style={caps}>{date.month} {date.year}</p>
                  </div>
                </div>
              )}
              {S.where && (
                <div data-reveal="0.15">
                  <p className="text-[10px]" style={{ ...caps, ...muted }}>{L.where}</p>
                  <E as="p" path={S.wherePath} className="mt-5 block text-[2.5rem] leading-[1.12] @3xl:text-[3rem]" style={ff.display}>{S.where}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-[12px] text-[var(--t-gold)]" style={caps}>{profile.city}</E>}
                  {calendarUrl && <a href={calendarUrl} className="wa-btn mt-10 border border-[var(--t-gold)]/70 text-[var(--t-gold)] hover:bg-[var(--t-gold)]/10">✦ {L.calendar}</a>}
                </div>
              )}
            </div>
          </Sec>
        );
      case "schedule":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.events)}
            <ol className="mx-auto max-w-3xl">
              {S.events.map((e, j) => (
                <li key={j} data-reveal={j * 0.1} className="relative grid grid-cols-[56px_1fr] items-start gap-5 pb-12 @2xl:grid-cols-[80px_1fr_auto] @2xl:items-center">
                  <div className="relative flex justify-center">
                    <Lantern className="w-[46px] @2xl:w-[56px]" chain={24} still={compact} delay={j * 0.6} />
                  </div>
                  <div className="border-b border-[var(--t-gold)]/25 pb-8">
                    <p className="text-[11px] text-[var(--t-gold)]" style={caps}>{String(j + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-[2rem] leading-tight @2xl:text-[2.4rem]" style={ff.display}>{e.name}</h3>
                    <p className="mt-2 text-[15px]" style={muted}>{eventWhen(e, S.lang)}{e.venue ? ` · ${e.venue}` : ""}</p>
                  </div>
                  <svg viewBox="-20 -20 40 40" className="hidden w-8 @2xl:block" aria-hidden><path d={starPath(0, 0, 18, 0.55)} fill="none" stroke="var(--t-gold)" /></svg>
                </li>
              ))}
            </ol>
            {calendarUrl && !vis.includes("details") && <div className="text-center"><a href={calendarUrl} className="wa-btn border border-[var(--t-gold)]/70 text-[var(--t-gold)]">✦ {L.calendar}</a></div>}
          </Sec>
        );
      case "venue":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.venue)}
            <div data-reveal className="relative mx-auto max-w-4xl border border-[var(--t-gold)]/40 p-3">
              <div className="relative overflow-hidden px-6 py-16 text-center @3xl:py-24" style={{ background: "radial-gradient(60% 70% at 50% 40%, #2f5f4c, #0b241d)" }}>
                <GirihWall className="absolute inset-0" opacity={0.14} size={52} />
                <Crescent className="relative mx-auto mb-8 w-16" />
                <E as="p" path={S.wherePath} className="relative block text-[2.4rem] leading-tight @3xl:text-[3.4rem]" style={ff.display}>{S.where}</E>
                {profile.venue && profile.city && <p className="relative mt-3 text-[11px] text-[var(--t-gold)]" style={caps}>{profile.city}</p>}
                <a target="_blank" rel="noreferrer" href={S.map} className="wa-btn relative mt-9 bg-[var(--t-gold)] text-[#0b241d] hover:brightness-110">{L.directions} →</a>
              </div>
            </div>
            {S.goa && (
              <div data-reveal className="mx-auto mt-14 max-w-2xl text-center">
                <p className="text-[10px] text-[var(--t-gold)]" style={caps}>{L.travel}</p>
                <p className="mt-4 text-xl leading-relaxed" style={muted}>{L.travelText}</p>
              </div>
            )}
          </Sec>
        );
      case "gallery":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.gallery)}
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 @3xl:grid-cols-3 @3xl:gap-6">
              {S.gallery.map((g, j) => (
                <div key={g.key} data-reveal={(j % 3) * 0.08} className="relative aspect-[3/4]">
                  <div className="absolute inset-0" style={ogeeMask(300, 400)}><Photo slot="gallery" galleryKey={g.key} src={g.src} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div>
                  <Outline w={1.2} />
                </div>
              ))}
            </div>
          </Sec>
        );
      case "rsvp":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.rsvp)}
            <div data-reveal className="noor-panel relative mx-auto max-w-2xl px-6 pb-10 pt-14 @2xl:px-12"
              style={{ "--t-ink": "#0f2e28", "--t-muted": "#4f6a5f", "--t-bg": "#fbf5e6", "--t-surface": "#fffdf6", "--t-accent": "#0f5a46" } as CSSProperties}>
              <div className="absolute inset-x-0 top-0 opacity-90"><GirihBand /></div>
              <p className="mb-8 text-center text-[1.7rem] italic" style={{ ...ff.body, color: "#0f5a46" }}>{L.attend}</p>
              {children}
            </div>
          </Sec>
        );
      case "info":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 text-center ${pad}`}>
            {head(L.info)}
            <E as="p" multiline path="texts.body" className="mx-auto block max-w-2xl whitespace-pre-line text-xl leading-relaxed" style={muted}>{S.info}</E>
          </Sec>
        );
    }
  };

  return (
    <div ref={ref} lang={profile.language ?? "en"} style={{ ...rootVars(theme, design, "noor-nikah", FACES), ...BRASS, ...ff.body }} className={`noor @container relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] ${FONTS} ${ready ? "" : "wa-pre"}`}>
      {/* ── Hero: carved jaali doors swing open beneath brass lanterns ── */}
      <header data-hero className={`relative isolate flex flex-col items-center justify-center overflow-hidden pt-10 ${compact ? "h-[720px]" : "h-[100svh] min-h-[720px]"}`}
        style={{ background: "radial-gradient(70% 60% at 50% 42%, color-mix(in oklab, var(--t-bg) 70%, #3f7a62), var(--t-bg) 60%, color-mix(in oklab, var(--t-bg) 60%, #000))" }}>
        <GirihWall className="absolute inset-0" opacity={0.07} />
        <div data-glowup className="pointer-events-none absolute inset-0 opacity-25 mix-blend-screen"><LightThrow /></div>
        {/* lanterns */}
        <div data-lantern className="absolute left-[6%] top-0 w-[64px] @3xl:left-[13%] @3xl:w-[92px]"><Lantern chain={compact ? 60 : 150} still={compact} delay={0} className="w-full" /></div>
        <div data-lantern className="absolute right-[6%] top-0 w-[54px] @3xl:right-[13%] @3xl:w-[80px]"><Lantern chain={compact ? 30 : 90} still={compact} delay={1} className="w-full" /></div>
        <div data-lantern className="absolute left-[26%] top-0 hidden w-[56px] @4xl:block"><Lantern chain={30} still={compact} delay={2} className="w-full" /></div>
        <div data-lantern className="absolute right-[27%] top-0 hidden w-[62px] @4xl:block"><Lantern chain={200} still={compact} delay={3} className="w-full" /></div>

        <div data-hero-copy className="relative z-[5] flex flex-col items-center">
          <div className="noor-glow @container relative aspect-[3/4]" style={{ height: compact ? 440 : "min(64svh, 104cqw)" }}>
            <div className="absolute inset-0 overflow-hidden" style={ogeeMask(300, 400)}>
              <div data-hall className="absolute inset-0" style={{ background: "radial-gradient(60% 45% at 50% 30%, #4e8a6e, #1a4a3c 55%, #082019)" }}>
                <GirihWall className="absolute inset-0" opacity={0.16} size={44} />
                <div className="absolute inset-0 opacity-30 mix-blend-screen"><LightThrow /></div>
              </div>
              <div data-hero-top className="absolute inset-x-[10%] top-[14%] flex flex-col items-center text-center">
                {S.invocation ? <p data-in className="text-[7.2cqw] leading-tight text-[var(--t-gold)]" dir="auto" style={naskh}>{S.invocation.text}</p> : <div data-in><Crescent className="w-[16cqw]" /></div>}
              </div>
              <div className="noor-names absolute inset-x-[7%] top-[36%] flex flex-col items-center text-center">
                <p data-in className="mb-[3cqw] text-[3.1cqw] text-[#f3e9d2]/85" style={caps}>{S.occ === "wedding" ? (S.lang === "en" ? "The Nikah of" : W.wedding) : S.line}</p>
                <h1 data-names data-in className="flex flex-col items-center leading-[1.05]" style={ff.display}>
                  <E path="profile.partner1" className="wa-name wa-foil block" style={{ fontSize: `${nameSize}cqw` }}>{a}</E>
                  {b && <span data-amp className="block text-[var(--t-gold)]" style={{ ...ff.script, fontSize: `${nameSize * 0.62}cqw`, lineHeight: 1.1 }}>&amp;</span>}
                  {b && <E path="profile.partner2" className="wa-name wa-foil block" style={{ fontSize: `${nameSize}cqw` }}>{b}</E>}
                </h1>
                {S.occ === "wedding" && <p data-in className="mt-[3cqw] text-[8cqw] leading-none text-[var(--t-gold)] opacity-80" dir="rtl" lang="ar" style={arabic}>نكاح</p>}
              </div>
              <DoorLeaf side="l" className="noor-door noor-door-l" />
              <DoorLeaf side="r" className="noor-door noor-door-r" />
            </div>
            <Outline w={2.2} />
            <Outline inset={12} w={0.9} o={0.6} />
            <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-[-34px] h-[calc(100%+68px)] w-[calc(100%+68px)]" aria-hidden>
              <rect x="0" y="0" width="300" height="400" fill="none" stroke="var(--t-gold)" strokeWidth="1" opacity=".5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="mt-[34px] w-[min(92cqw,520px)]"><GirihBand h={18} /></div>
          <div data-hero-meta data-in className="mt-6 flex flex-col items-center gap-2 text-center">
            {date && <p className="text-[12px] text-[var(--t-gold)]" style={caps}>{date.full}</p>}
            {S.where && <E as="p" path={S.wherePath} className="block text-[18px] italic">{S.where}</E>}
            {days !== null && days > 0 && <p className="mt-1 text-[11px] opacity-80" style={caps}><span className="text-[var(--t-gold)]">{days}</span> · {W.days}</p>}
          </div>
        </div>
      </header>

      {vis.map((id, i) => render(id, i))}

      <footer className="relative overflow-hidden pb-14 pt-20 text-center" style={{ background: "color-mix(in oklab, var(--t-bg) 70%, #000)" }}>
        <GirihWall className="absolute inset-0" opacity={0.06} />
        <Crescent className="relative mx-auto mb-8 w-20" />
        {profile.blessing && <E as="p" path="profile.blessing" className="relative mx-auto mb-6 block max-w-xl px-6 text-3xl text-[var(--t-gold)]" style={ff.script}>{profile.blessing}</E>}
        <p className="wa-foil relative text-5xl" style={{ ...ff.display, ...BRASS }}>{a}{b && <><span className="mx-2 text-3xl" style={ff.script}>&amp;</span>{b}</>}</p>
        {S.occ === "wedding" && <p className="relative mt-5 text-[10px] opacity-70" style={caps}>{L.forever}</p>}
        {credit && <div className="relative mt-10 text-[11px] tracking-wide opacity-60">{credit}</div>}
      </footer>
    </div>
  );
}
